// Run against a disposable database. Refuse to modify the ordinary demo database.
import assert from 'node:assert/strict';
import mysql from 'mysql2/promise';import {readFile} from 'node:fs/promises';import {seedDatabase} from '../db/seed.js';
import app from '../app.js';import pool,{dbConfig} from '../config/db.js';
if(!/_test$/.test(dbConfig.database))throw new Error('Integration tests require DB_NAME ending in _test. Use a disposable initialized database.');
const setup=await mysql.createConnection({...dbConfig,database:undefined});
await setup.query(`DROP DATABASE IF EXISTS \`${dbConfig.database}\``);
await setup.query(`CREATE DATABASE \`${dbConfig.database}\` CHARACTER SET utf8mb4`);
await setup.query(`USE \`${dbConfig.database}\``);
for(const statement of (await readFile(new URL('../db/schema.sql',import.meta.url),'utf8')).split('-- @statement'))if(statement.trim())await setup.query(statement);
await seedDatabase(setup);await setup.end();
const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const base=`http://127.0.0.1:${server.address().port}/api`;let passed=0;
const call=async(path,method='GET',body,token)=>{const r=await fetch(base+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:body?JSON.stringify(body):undefined});const data=await r.json();return {status:r.status,data};};
const check=(name,fn)=>async()=>{await fn();passed++;console.log('PASS',name);};
try{
 const admin=(await call('/auth/login','POST',{studentIdOrEmail:'admin',password:'Admin@2026!'})).data.token;
 const student=(await call('/auth/login','POST',{studentIdOrEmail:'2520030477',password:'Student@2026!'})).data.token;
 assert.ok(admin&&student);
 await check('Semester GPA excludes prior-term grades',async()=>{const s=(await call('/students/2520030477','GET',null,student)).data.student;assert.equal(s.currentGpa,9);assert.equal(s.semesterGpa,0);})();
 await check('No authentication cannot access admin',async()=>assert.equal((await call('/admin/overview')).status,401))();
 await check('Student cannot access admin',async()=>assert.equal((await call('/admin/overview','GET',null,student)).status,403))();
 await check('Student cannot read another profile',async()=>assert.equal((await call('/students/2520030002','GET',null,student)).status,403))();
 await check('Universal demo password rejected',async()=>assert.equal((await call('/auth/login','POST',{studentIdOrEmail:'2520030477',password:'password123'})).status,401))();
 await check('Tampered token rejected',async()=>assert.equal((await call('/auth/me','GET',null,student+'x')).status,401))();
 const id='TEST'+Date.now();const registration=await call('/auth/register','POST',{rollNumber:id,fullName:'Integration Student',email:`${id}@test.local`,password:'Testing@2026!'});const token=registration.data.token;assert.equal(registration.status,201);
 await check('New student starts with genuine zero metrics',async()=>{const s=(await call(`/students/${id}`,'GET',null,token)).data.student;assert.equal(s.currentGpa,0);assert.equal(s.attendanceRate,0);assert.equal(s.completedCredits,0);})();
 await check('Four clusters with two or three groups are available',async()=>{const cs=(await call('/clusters','GET',null,token)).data.clusters;assert.equal(cs.length,4);assert.deepEqual(cs.map(c=>c.groups.length),[2,3,2,3]);assert.ok(cs.every(c=>c.courseCount===6));})();
 await check('Enrollment requires cluster selection',async()=>assert.equal((await call('/enrollments','POST',{courseId:'DS',sectionId:'DS-SEC1'},token)).status,409))();
 await check('Student chooses own cluster',async()=>assert.equal((await call(`/clusters/students/${id}`,'PUT',{clusterId:'CLUSTER-1'},token)).status,200))();
 await check('Missing prerequisite rejected',async()=>assert.equal((await call('/enrollments','POST',{courseId:'ML',sectionId:'ML-SEC1'},token)).status,409))();
 await check('Wrong-course section rejected',async()=>assert.equal((await call('/enrollments','POST',{courseId:'DS',sectionId:'OS-SEC1'},token)).status,400))();
 await check('Atomic enrollment and notification',async()=>{assert.equal((await call('/enrollments','POST',{courseId:'DS',sectionId:'DS-SEC1'},token)).status,201);assert.ok((await call(`/notifications/${id}`,'GET',null,token)).data.notifications.length);})();
 await check('Cross-cluster enrollment rejected without consuming a seat',async()=>{const before=(await call('/courses/OS')).data.course.sections.find(s=>s.id==='OS-C2-S1').availableSeats;assert.equal((await call('/enrollments','POST',{courseId:'OS',sectionId:'OS-C2-S1'},token)).status,409);assert.equal((await call('/courses/OS')).data.course.sections.find(s=>s.id==='OS-C2-S1').availableSeats,before);})();
 await check('Student cluster locks after enrollment',async()=>assert.equal((await call(`/clusters/students/${id}`,'PUT',{clusterId:'CLUSTER-2'},token)).status,409))();
 await check('Students cannot change another student cluster',async()=>assert.equal((await call('/clusters/students/2520030002','PUT',{clusterId:'CLUSTER-2'},token)).status,403))();
 await check('Students cannot assign CGPA',async()=>assert.equal((await call(`/clusters/students/${id}/cgpa`,'PUT',{value:10,reason:'test'},token)).status,403))();
 await check('Admin CGPA overrides are visible, auditable and clearable',async()=>{assert.equal((await call(`/clusters/students/${id}/cgpa`,'PUT',{value:8.75,reason:'Verified prior transcript'},admin)).status,200);let s=(await call(`/students/${id}`,'GET',null,token)).data.student;assert.equal(s.currentGpa,8.75);assert.equal(s.cgpaSource,'admin');assert.equal(s.calculatedGpa,0);assert.ok((await call('/clusters/audit/history','GET',null,admin)).data.audit.some(a=>a.action==='CGPA_UPDATED'&&a.student_id===id));assert.equal((await call(`/clusters/students/${id}/cgpa`,'PUT',{value:11,reason:'test'},admin)).status,400);assert.equal((await call(`/clusters/students/${id}/cgpa`,'PUT',{value:null,reason:'Restore grade-based calculation'},admin)).status,200);s=(await call(`/students/${id}`,'GET',null,token)).data.student;assert.equal(s.currentGpa,0);assert.equal(s.cgpaSource,'calculated');})();
 await check('Duplicate enrollment rejected',async()=>assert.equal((await call('/enrollments','POST',{courseId:'DS',sectionId:'DS-SEC1'},token)).status,409))();
 await check('Section switch changes timetable',async()=>{assert.equal((await call('/enrollments','POST',{courseId:'DS',sectionId:'DS-SEC2'},token)).status,201);const week=(await call(`/timetable/${id}`,'GET',null,token)).data.timetable;assert.equal(week.Monday.length,0);assert.equal(week.Tuesday.length,1);})();
 await check('Invalid marks rejected',async()=>assert.equal((await call('/admin/grades','PUT',{studentId:id,courseId:'DS',internalMarks:31,midtermMarks:20,finalMarks:50},admin)).status,400))();
 await check('Grade publication calculates GPA and earned credits',async()=>{assert.equal((await call('/admin/grades','PUT',{studentId:id,courseId:'DS',internalMarks:27,midtermMarks:18,finalMarks:43},admin)).status,200);const s=(await call(`/students/${id}`,'GET',null,token)).data.student;assert.equal(s.currentGpa,9);assert.equal(s.completedCredits,4);})();
 await check('Prerequisite satisfied by passing grade',async()=>assert.equal((await call('/enrollments','POST',{courseId:'ML',sectionId:'ML-SEC1'},token)).status,201))();
 await check('Full section waitlist and automatic promotion',async()=>{const q=await call('/enrollments','POST',{courseId:'SEC',sectionId:'SEC-SEC1',waitlist:true},token);assert.equal(q.status,201);assert.equal(q.data.waitlisted,true);assert.equal((await call('/admin/enrollments/drop','POST',{studentId:'2520030002',courseId:'SEC'},admin)).status,200);const enrolled=(await call(`/enrollments/${id}`,'GET',null,token)).data.enrolledCourseIds;assert.ok(enrolled.includes('SEC'));assert.equal((await call(`/enrollments/waitlist/${id}`,'GET',null,token)).data.waitlist.length,0);})();
 await check('Independent aggregates do not multiply active credits',async()=>{await call('/admin/grades','PUT',{studentId:id,courseId:'ML',internalMarks:20,midtermMarks:15,finalMarks:40},admin);const s=(await call(`/students/${id}`,'GET',null,token)).data.student;assert.equal(s.currentSemesterCredits,11);assert.equal(s.completedCredits,8);assert.equal(s.currentGpa,8.5);})();
 await check('Attendance is recorded rather than invented',async()=>{const date=new Date().toISOString().slice(0,10);assert.equal((await call('/admin/attendance','PUT',{studentId:id,courseId:'DS',sessionDate:date,present:true},admin)).status,200);assert.equal((await call(`/students/${id}`,'GET',null,token)).data.student.attendanceRate,100);})();
 await check('Trigger audit covers section switch',async()=>{const a=(await call('/admin/audit','GET',null,admin)).data.audit;assert.ok(a.some(r=>r.student_id===id&&r.action_type==='SWITCHED'));})();
 await check('CTE analytics runs',async()=>assert.equal((await call('/admin/analytics','GET',null,admin)).status,200))();
 await check('Course capacity aggregates every cluster offering',async()=>{const c=(await call('/courses')).data.courses.find(c=>c.id==='DBMS');assert.equal(c.totalSeats,300);})();
 // Create overlapping sections to exercise authoritative backend conflicts.
 await pool.query(`UPDATE course_sections SET schedule='Tue 08:30 AM - 09:30 AM' WHERE id='OS-SEC2'`);
 await check('Server rejects an overlapping timetable',async()=>assert.equal((await call('/enrollments','POST',{courseId:'OS',sectionId:'OS-SEC2'},token)).status,409))();
 await check('Last-seat race admits exactly one student',async()=>{
  const ids=['RACE1'+Date.now(),'RACE2'+Date.now()];const tokens=[];
  for(const x of ids){const t=(await call('/auth/register','POST',{rollNumber:x,fullName:x,email:`${x}@test.local`,password:'Testing@2026!'})).data.token;tokens.push(t);await call(`/clusters/students/${x}`,'PUT',{clusterId:'CLUSTER-1'},t);}
  const results=await Promise.all(tokens.map(t=>call('/enrollments','POST',{courseId:'SEC',sectionId:'SEC-SEC2'},t)));
  assert.deepEqual(results.map(x=>x.status).sort(),[201,409]);
 })();
 await check('Retry after own waitlist promotion stays enrolled, never waiting',async()=>{
  await pool.execute(`INSERT INTO courses(id,course_code,course_name,credits,schedule)VALUES('PROMO','TEST-PROMO','Promotion Retry',1,'Fri 02:00 PM - 03:00 PM')`);
  await pool.execute(`INSERT INTO course_sections(id,course_id,section_number,section_name,faculty_name,classroom,schedule,total_seats)VALUES('PROMO-SEC1','PROMO',1,'Section 1','Test Faculty','Hall 1','Fri 02:00 PM - 03:00 PM',1)`);
  await pool.execute(`INSERT INTO section_clusters(section_id,group_id)VALUES('PROMO-SEC1','CLUSTER-1-G1')`);
  await pool.execute(`INSERT INTO waitlist(student_id,course_id,section_id)VALUES(?,'PROMO','PROMO-SEC1')`,[id]);
  const r=await call('/enrollments','POST',{courseId:'PROMO',sectionId:'PROMO-SEC1',waitlist:true},token);
  assert.equal(r.status,201);assert.equal(r.data.waitlisted,undefined);
  const [waiting]=await pool.execute(`SELECT id FROM waitlist WHERE student_id=? AND course_id='PROMO' AND status='Waiting'`,[id]);assert.equal(waiting.length,0);
 })();
 await check('Cluster choice stays locked after dropping all subjects',async()=>{
  const x='LOCK'+Date.now();const t=(await call('/auth/register','POST',{rollNumber:x,fullName:'Lock Test',email:`${x}@test.local`,password:'Testing@2026!'})).data.token;
  await call(`/clusters/students/${x}`,'PUT',{clusterId:'CLUSTER-2'},t);
  assert.equal((await call('/enrollments','POST',{courseId:'OS',sectionId:'OS-C2-S1'},t)).status,201);
  assert.equal((await call('/enrollments','DELETE',{courseId:'OS'},t)).status,200);
  assert.equal((await call(`/clusters/students/${x}`,'PUT',{clusterId:'CLUSTER-3'},t)).status,409);
  assert.equal((await call(`/clusters/students/${x}`,'PUT',{clusterId:'CLUSTER-3',reason:'Verified semester transfer'},admin)).status,200);
  assert.equal((await call('/enrollments','POST',{courseId:'OS',sectionId:'OS-C3-S1'},t)).status,201);
 })();
 await check('Admin cannot move occupied sections',async()=>assert.equal((await call('/clusters/sections/DBMS-SEC1/group','PUT',{groupId:'CLUSTER-2-G1'},admin)).status,409))();
 await check('Cluster selection and enrollment race remains consistent',async()=>{
  const x='CHOICE'+Date.now();const t=(await call('/auth/register','POST',{rollNumber:x,fullName:'Choice Race',email:`${x}@test.local`,password:'Testing@2026!'})).data.token;
  await call(`/clusters/students/${x}`,'PUT',{clusterId:'CLUSTER-1'},t);
  const r=await Promise.all([call(`/clusters/students/${x}`,'PUT',{clusterId:'CLUSTER-2'},t),call('/enrollments','POST',{courseId:'IOT',sectionId:'IOT-SEC1'},t)]);
  const s=(await call(`/students/${x}`,'GET',null,t)).data.student;
  assert.ok((s.clusterId==='CLUSTER-1'&&r[1].status===201&&r[0].status===409)||(s.clusterId==='CLUSTER-2'&&r[0].status===200&&r[1].status===409));
 })();
 await check('Admin dashboards receive cluster and CGPA records',async()=>{const r=await call('/admin/students','GET',null,admin);assert.equal(r.status,200);assert.ok(r.data.students.some(s=>s.clusterId==='CLUSTER-1'&&s.enrollments.length));assert.equal((await call('/admin/overview','GET',null,admin)).status,200);})();
 await check('Setup preserves edited clusters, CGPA and enrollment state',async()=>{
  await call('/clusters/CLUSTER-2','PUT',{name:'Cluster 2 · Engineering',description:'Updated academic cohort'},admin);
  await call(`/clusters/students/${id}/cgpa`,'PUT',{value:9.1,reason:'Verified university record'},admin);
  const before=(await call(`/enrollments/${id}`,'GET',null,token)).data.enrolledCourseIds;
  const conn=await pool.getConnection();try{await seedDatabase(conn);}finally{conn.release();}
  assert.equal((await call(`/students/${id}`,'GET',null,token)).data.student.currentGpa,9.1);
  assert.deepEqual((await call(`/enrollments/${id}`,'GET',null,token)).data.enrolledCourseIds,before);
  assert.equal((await call('/clusters','GET',null,token)).data.clusters.find(c=>c.id==='CLUSTER-2').name,'Cluster 2 · Engineering');
 })();
 await check('Legacy waitlist-only students receive a locked cluster',async()=>{
  const x='LEGACYWAIT'+Date.now();await call('/auth/register','POST',{rollNumber:x,fullName:'Legacy Waiting',email:`${x}@test.local`,password:'Testing@2026!'});
  await pool.execute("INSERT INTO waitlist(student_id,course_id,section_id)VALUES(?,'OS','OS-SEC1')",[x]);
  const conn=await pool.getConnection();try{await seedDatabase(conn);}finally{conn.release();}
  const [[choice]]=await pool.execute('SELECT * FROM student_cluster_choices WHERE student_id=?',[x]);assert.ok(choice);assert.equal(choice.cluster_id,'CLUSTER-1');assert.equal(Number(choice.locked),1);
 })();
 await check('Official CGPA reaches analytics and student ranking',async()=>{
  const r=(await call('/admin/analytics','GET',null,admin)).data.analytics.find(r=>r.student_id===id);assert.equal(Number(r.current_gpa),9.1);
  const s=(await call(`/students/${id}`,'GET',null,token)).data.student;assert.equal(Number(s.instituteRank),1);
 })();
 await check('Legacy sections use clusters from their own semester',async()=>{
  await pool.execute("INSERT INTO courses(id,course_code,course_name,credits,schedule,semester)VALUES('OLDTERM','OLDTERM','Prior semester',1,'Fri 03:00 PM - 04:00 PM','Trimester 2025')");
  await pool.execute("INSERT INTO course_sections(id,course_id,section_number,section_name,faculty_name,classroom,schedule,total_seats)VALUES('OLDTERM-S1','OLDTERM',1,'Section 1','Faculty','Hall 1','Fri 03:00 PM - 04:00 PM',30)");
  const conn=await pool.getConnection();try{await seedDatabase(conn);}finally{conn.release();}
  const [[row]]=await pool.execute("SELECT c.semester FROM section_clusters m JOIN cluster_groups g ON g.id=m.group_id JOIN academic_clusters c ON c.id=g.cluster_id WHERE m.section_id='OLDTERM-S1'");assert.equal(row.semester,'Trimester 2025');
  await pool.execute("DELETE m FROM section_clusters m JOIN course_sections cs ON cs.id=m.section_id WHERE cs.course_id='DBMS' AND cs.section_number>=200");
  await pool.execute("DELETE FROM course_sections WHERE course_id='DBMS' AND section_number>=200");
  await pool.execute("UPDATE courses SET semester='Trimester 2025' WHERE id='DBMS'");
  const c2=await pool.getConnection();try{await seedDatabase(c2);await seedDatabase(c2);}finally{c2.release();}
  const [[cloned]]=await pool.execute("SELECT c.semester,c.code FROM section_clusters m JOIN cluster_groups g ON g.id=m.group_id JOIN academic_clusters c ON c.id=g.cluster_id WHERE m.section_id='DBMS-C2-S1'");assert.equal(cloned.semester,'Trimester 2025');assert.equal(cloned.code,'C2');

 })();
 console.log(`Integration checks: ${passed} passed.`);
}catch(e){console.error('FAIL',e);process.exitCode=1;}finally{await new Promise(r=>server.close(r));await pool.end();}
