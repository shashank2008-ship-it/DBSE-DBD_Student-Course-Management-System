import {createHash} from 'node:crypto';
// Additive migration: preserve original section IDs, schedules, grades and enrollments.
export async function seedClusters(conn){
 const term='Trimester 2026';
 const prefix=t=>t===term?'CLUSTER':`CLUSTER-${createHash('sha256').update(t).digest('hex').slice(0,10)}`;
 const [terms]=await conn.query('SELECT semester FROM courses UNION SELECT semester FROM students');
 for(const {semester:t} of terms){if(typeof t!=='string'||!t)continue;
  for(let c=1;c<=4;c++){
   const id=`${prefix(t)}-${c}`;await conn.execute('INSERT IGNORE INTO academic_clusters(id,code,name,semester,description)VALUES(?,?,?,?,?)',[id,`C${c}`,`Cluster ${c}`,t,'A consistent academic cohort across every enrolled subject.']);
   for(let g=1;g<=(c%2===0?3:2);g++)await conn.execute('INSERT IGNORE INTO cluster_groups(id,cluster_id,name)VALUES(?,?,?)',[`${id}-G${g}`,id,`Section ${g}`]);
  }
 }
 // Keep legacy IDs and assignments. Repair only absent or incompatible-semester metadata.
 const [legacy]=await conn.query('SELECT cs.id,cs.section_number,c.semester,cl.semester assigned_semester FROM course_sections cs JOIN courses c ON c.id=cs.course_id LEFT JOIN section_clusters m ON m.section_id=cs.id LEFT JOIN cluster_groups g ON g.id=m.group_id LEFT JOIN academic_clusters cl ON cl.id=g.cluster_id');
 for(const s of legacy){if(!s.semester||s.assigned_semester===s.semester)continue;
  await conn.execute('INSERT INTO section_clusters(section_id,group_id)VALUES(?,?) ON DUPLICATE KEY UPDATE group_id=VALUES(group_id)',[s.id,`${prefix(s.semester)}-1-G${s.section_number===2?2:1}`]);
 }
 const [base]=await conn.query("SELECT cs.*,c.semester FROM course_sections cs JOIN courses c ON c.id=cs.course_id WHERE cs.id IN('DS-SEC1','DBMS-SEC1','ML-SEC1','OS-SEC1','IOT-SEC1','SEC-SEC1')");
 for(const s of base){
  const [alts]=await conn.execute('SELECT schedule FROM course_sections WHERE course_id=? AND section_number=2',[s.course_id]);
  for(let c=2;c<=4;c++)for(let g=1;g<=(c%2===0?3:2);g++){
   const id=`${s.course_id}-C${c}-S${g}`;
   await conn.execute(`INSERT IGNORE INTO course_sections(id,course_id,section_number,section_name,faculty_id,faculty_name,faculty_email,classroom,schedule,total_seats)VALUES(?,?,?,?,?,?,?,?,?,?)`,[id,s.course_id,c*100+g,`C${c} · Section ${g}`,s.faculty_id,s.faculty_name,s.faculty_email,`Hall ${c}0${g}`,g===2?(alts[0]?.schedule||s.schedule):s.schedule,s.total_seats]);
   // Only insert missing associations; preserve admin-edited group assignments.
   await conn.execute('INSERT IGNORE INTO section_clusters(section_id,group_id)VALUES(?,?)',[id,`${prefix(s.semester)}-${c}-G${g}`]);
  }
 }
 const [legacyStudents]=await conn.query(`SELECT s.id,s.semester FROM students s WHERE EXISTS(SELECT 1 FROM enrollments e JOIN courses c ON c.id=e.course_id WHERE e.student_id=s.id AND c.semester=s.semester) OR EXISTS(SELECT 1 FROM waitlist w JOIN courses c ON c.id=w.course_id WHERE w.student_id=s.id AND c.semester=s.semester AND w.status='Waiting')`);
 for(const s of legacyStudents)await conn.execute('INSERT IGNORE INTO student_cluster_choices(student_id,semester,cluster_id,locked)VALUES(?,?,?,TRUE)',[s.id,s.semester,`${prefix(s.semester)}-1`]);
}
