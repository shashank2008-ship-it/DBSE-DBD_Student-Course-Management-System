import {randomUUID} from 'node:crypto';
import pool from '../config/db.js';
import {ApiError,parseSchedule,schedulesOverlap,clusterEligibility} from './rules.js';
// Lock all section rows, then affected student rows, in a stable order. This
// intentionally serializes enrollment changes in this college-sized system.
// Capacity and FIFO promotion therefore use the same transaction boundary.
async function transaction(fn){
 const conn=await pool.getConnection();
 try{await conn.beginTransaction();await conn.query('SELECT id FROM course_sections ORDER BY id FOR UPDATE');const result=await fn(conn);await conn.commit();return result;}
 catch(e){await conn.rollback();throw e;}finally{conn.release();}
}
async function lockStudent(conn,id){const [rows]=await conn.execute('SELECT id FROM students WHERE id=? FOR UPDATE',[id]);if(!rows.length)throw new ApiError(404,'Student not found.');}
export async function eligibility(conn,studentId,section){
 const [[choice]]=await conn.execute(`SELECT ch.cluster_id FROM students s LEFT JOIN student_cluster_choices ch ON ch.student_id=s.id AND ch.semester=s.semester WHERE s.id=?`,[studentId]);
 const [[offering]]=await conn.execute(`SELECT g.cluster_id,c.semester,s.semester student_semester FROM course_sections cs JOIN courses c ON c.id=cs.course_id JOIN students s ON s.id=? LEFT JOIN section_clusters m ON m.section_id=cs.id LEFT JOIN cluster_groups g ON g.id=m.group_id WHERE cs.id=?`,[studentId,section.id]);
 const clusterReason=clusterEligibility(choice?.cluster_id,offering?.cluster_id);if(clusterReason)return clusterReason;
 if(offering.semester!==offering.student_semester)return 'Choose a course for your current semester.';
 const [missing]=await conn.execute(`SELECT c.course_code FROM course_prerequisites p JOIN courses c ON c.id=p.prerequisite_id LEFT JOIN grades g ON g.course_id=p.prerequisite_id AND g.student_id=? AND g.grade_points>0 AND g.status='Published' WHERE p.course_id=? AND g.id IS NULL`,[studentId,section.course_id]);
 if(missing.length)return `Complete prerequisite: ${missing.map(x=>x.course_code).join(', ')}.`;
 const [active]=await conn.execute(`SELECT c.id,c.course_name,c.credits,cs.schedule FROM enrollments e JOIN courses c ON c.id=e.course_id JOIN course_sections cs ON cs.id=e.section_id WHERE e.student_id=? AND e.status='Enrolled' AND e.course_id<>?`,[studentId,section.course_id]);
 if(active.reduce((n,c)=>n+Number(c.credits),Number(section.credits))>24)return 'Term credit limit is 24.';
 const conflict=active.find(c=>schedulesOverlap(c.schedule,section.schedule));
 return conflict?`Timetable conflict with ${conflict.course_name}.`:null;
}
async function sectionInfo(conn,id,course){const [rows]=await conn.execute(`SELECT cs.*,c.credits,c.course_name,c.course_type FROM course_sections cs JOIN courses c ON c.id=cs.course_id WHERE cs.id=? AND cs.course_id=?`,[id,course]);if(!rows.length)throw new ApiError(400,'Choose a valid section belonging to this course.');return rows[0];}
async function notify(conn,student,title,message){await conn.execute('INSERT INTO notifications(id,student_id,title,message,category)VALUES(?,?,?,?,?)',[randomUUID(),student,title,message,'enrollment']);}
async function syncTimetable(conn,student,section){
 await conn.execute('DELETE FROM timetable WHERE student_id=? AND course_id=?',[student,section.course_id]);
 for(const slot of parseSchedule(section.schedule))await conn.execute(`INSERT INTO timetable(student_id,course_id,section_id,day_of_week,time_slot,start_minutes,end_minutes,classroom,course_type)VALUES(?,?,?,?,?,?,?,?,?)`,[student,section.course_id,section.id,slot.day,slot.timeSlot,slot.start,slot.end,section.classroom,section.course_type]);
}
async function writeEnrollment(conn,student,section){
 await conn.execute(`INSERT INTO enrollments(student_id,course_id,section_id,status)VALUES(?,?,?,'Enrolled') ON DUPLICATE KEY UPDATE section_id=VALUES(section_id),status='Enrolled',enrolled_at=CURRENT_TIMESTAMP`,[student,section.course_id,section.id]);
 await conn.execute(`UPDATE waitlist SET status='Cancelled' WHERE student_id=? AND course_id=? AND status='Waiting'`,[student,section.course_id]);
 await conn.execute('UPDATE student_cluster_choices ch JOIN students s ON s.id=ch.student_id AND s.semester=ch.semester SET ch.locked=TRUE WHERE ch.student_id=?',[student]);
 await syncTimetable(conn,student,section);
}
async function countSeats(conn,section){const [[{filled}]]=await conn.execute(`SELECT COUNT(*) AS filled FROM enrollments WHERE section_id=? AND status='Enrolled'`,[section.id]);return Number(section.total_seats)-Number(filled);}
async function promote(conn,sectionId){
 const [rows]=await conn.execute(`SELECT w.* FROM waitlist w WHERE w.section_id=? AND w.status='Waiting' ORDER BY w.id FOR UPDATE`,[sectionId]);
 for(const w of rows){
  const section=await sectionInfo(conn,w.section_id,w.course_id);
  if(await countSeats(conn,section)<=0)break;
  await lockStudent(conn,w.student_id);
  const [enrolled]=await conn.execute(`SELECT id FROM enrollments WHERE student_id=? AND course_id=? AND status IN('Enrolled','Completed')`,[w.student_id,w.course_id]);
  if(enrolled.length){await conn.execute(`UPDATE waitlist SET status='Cancelled' WHERE id=?`,[w.id]);continue;}
  const reason=await eligibility(conn,w.student_id,section);
  // Leave temporarily ineligible students waiting; next eligible FIFO student may take the seat.
  if(reason)continue;
  await writeEnrollment(conn,w.student_id,section);
  await conn.execute(`UPDATE waitlist SET status='Promoted' WHERE id=?`,[w.id]);
  await notify(conn,w.student_id,'Waitlist seat confirmed',`You have been enrolled in ${section.course_name}, ${section.section_name}.`);
 }
}
export async function enroll({studentId,courseId,sectionId,waitlist=false}){
 return transaction(async conn=>{
  await lockStudent(conn,studentId);
  if(!sectionId){const [sections]=await conn.execute(`SELECT cs.id FROM course_sections cs JOIN section_clusters m ON m.section_id=cs.id JOIN cluster_groups g ON g.id=m.group_id JOIN student_cluster_choices ch ON ch.cluster_id=g.cluster_id JOIN students s ON s.id=ch.student_id AND s.semester=ch.semester WHERE cs.course_id=? AND s.id=? ORDER BY cs.section_number`,[courseId,studentId]);if(!sections.length)throw new ApiError(404,'Course not found.');sectionId=sections[0].id;}
  const section=await sectionInfo(conn,sectionId,courseId);
  const [existing]=await conn.execute('SELECT * FROM enrollments WHERE student_id=? AND course_id=?',[studentId,courseId]);
  if(existing[0]?.status==='Completed')throw new ApiError(409,'This course has already been completed.');
  if(existing[0]?.status==='Enrolled'&&existing[0].section_id===sectionId)throw new ApiError(409,'You are already enrolled in this section.');
  const reason=await eligibility(conn,studentId,section);if(reason)throw new ApiError(409,reason);
  // Honour earlier eligible waitlist entries before accepting a new enrollee.
  await promote(conn,sectionId);
  const [promotedSelf]=await conn.execute("SELECT id FROM enrollments WHERE student_id=? AND course_id=? AND section_id=? AND status='Enrolled'",[studentId,courseId,sectionId]);
  if(promotedSelf.length)return {success:true,courseId,sectionId,message:'Your waitlist seat has been confirmed.',availableSeats:await countSeats(conn,section)};
  if(await countSeats(conn,section)<=0){
   if(!waitlist||existing[0]?.status==='Enrolled')throw new ApiError(409,'Section is full. Join its waitlist or choose another section.');
   const [prior]=await conn.execute(`SELECT id FROM waitlist WHERE student_id=? AND course_id=? AND status='Waiting'`,[studentId,courseId]);
   if(prior.length)throw new ApiError(409,'You are already waiting for this course.');
   await conn.execute(`DELETE FROM waitlist WHERE student_id=? AND course_id=? AND status<>'Waiting'`,[studentId,courseId]);
   await conn.execute(`INSERT INTO waitlist(student_id,course_id,section_id)VALUES(?,?,?)`,[studentId,courseId,sectionId]);
   await conn.execute('UPDATE student_cluster_choices ch JOIN students s ON s.id=ch.student_id AND s.semester=ch.semester SET ch.locked=TRUE WHERE ch.student_id=?',[studentId]);
   await notify(conn,studentId,'Waitlist joined',`You are waiting for ${section.course_name}, ${section.section_name}.`);
   return {success:true,waitlisted:true,message:'Added to the waitlist. Eligible students are promoted automatically when a seat opens.'};
  }
  const oldSection=existing[0]?.status==='Enrolled'?existing[0].section_id:null;
  await writeEnrollment(conn,studentId,section);
  await notify(conn,studentId,oldSection?'Section switched':'Enrollment confirmed',`${section.course_name}, ${section.section_name}.`);
  if(oldSection&&oldSection!==sectionId)await promote(conn,oldSection);
  return {success:true,courseId,sectionId,message:oldSection?'Section switched successfully.':'Enrollment confirmed.',availableSeats:await countSeats(conn,section)};
 });
}
export async function drop(studentId,courseId){return transaction(async conn=>{
 await lockStudent(conn,studentId);
 const [rows]=await conn.execute(`SELECT * FROM enrollments WHERE student_id=? AND course_id=? AND status='Enrolled'`,[studentId,courseId]);
 if(!rows.length)throw new ApiError(404,'Active enrollment not found.');
 await conn.execute(`UPDATE enrollments SET status='Dropped' WHERE id=?`,[rows[0].id]);
 await conn.execute('DELETE FROM timetable WHERE student_id=? AND course_id=?',[studentId,courseId]);
 await notify(conn,studentId,'Course dropped','Your enrollment was dropped and your timetable updated.');
 await promote(conn,rows[0].section_id);
 return {success:true,message:'Course dropped. Eligible waitlisted students were considered for the released seat.'};
});}
export async function cancelWaitlist(studentId,id){return transaction(async conn=>{
 await lockStudent(conn,studentId);const [result]=await conn.execute(`UPDATE waitlist SET status='Cancelled' WHERE id=? AND student_id=? AND status='Waiting'`,[id,studentId]);
 if(!result.affectedRows)throw new ApiError(404,'Waiting entry not found.');return {success:true,message:'Waitlist entry cancelled.'};
});}
