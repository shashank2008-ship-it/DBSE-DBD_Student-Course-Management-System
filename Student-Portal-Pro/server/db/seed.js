import {seedClusters} from './clusters.js';
import {hashPassword} from '../services/security.js';
export async function seedDatabase(conn){
 const studentHash=await hashPassword('Student@2026!'),adminHash=await hashPassword('Admin@2026!');
 await conn.execute(`INSERT IGNORE INTO admins(id,username,full_name,email,password_hash) VALUES('ADMIN01','admin','Academic Administrator','admin@portal.local',?)`,[adminHash]);
 for(const [id,name,email] of [['2520030477','K. Pranav','pranav@portal.local'],['2520030002','Charan','charan@portal.local'],['2024CSB1084','Shashank Gotti','shashank@portal.local']])await conn.execute(`INSERT IGNORE INTO students(id,roll_number,full_name,email,password_hash)VALUES(?,?,?,?,?)`,[id,id,name,email,studentHash]);
 const catalog=[
 ['DS','CS201','Data Structures Foundations',4,'Mon, Wed 08:00 AM - 09:30 AM','Build a foundation in arrays, linked lists, stacks, queues, trees and algorithm analysis.'],
 ['DBMS','25CS1302E','Database Systems Engineering and Distributed Backend Development',4,'Mon, Wed 10:00 AM - 11:30 AM','Relational modelling, SQL, transactions, backend APIs and distributed system concepts.'],
 ['ML','CS302','Machine Learning',4,'Tue, Thu 10:00 AM - 11:30 AM','Supervised and unsupervised learning, classification, SVM and model evaluation.'],
 ['OS','CS303','Operating Systems',4,'Mon, Wed 02:00 PM - 03:30 PM','Processes, concurrency, memory management and file systems.'],
 ['IOT','CS304','Internet of Things',3,'Fri 09:30 AM - 12:30 PM','Sensors, microcontrollers, embedded protocols and edge analytics.'],
 ['SEC','CS405','Application Security Studio',3,'Sat 10:00 AM - 11:30 AM','Secure API design, threat modelling and practical security reviews. One-seat demo section for waitlist demonstration.']];
 for(const [id,code,name,credits,schedule,description] of catalog){
  await conn.execute(`INSERT IGNORE INTO courses(id,course_code,course_name,credits,schedule,classroom,description,prerequisites)VALUES(?,?,?,?,?,'Hall 202',?,?)`,[id,code,name,credits,schedule,description,id==='ML'?'CS201 (Data Structures Foundations)':'None']);
  const facultyId=`FAC-${id}`;
  await conn.execute(`INSERT IGNORE INTO faculty(id,faculty_id,full_name,email,qualification,courses_taught,avatar_initials)VALUES(?,?,?,?,?,?,?)`,[facultyId,facultyId,`Dr. ${id} Faculty`,`${id.toLowerCase()}@portal.local`,'Ph.D.',name,id]);
  for(let n=1;n<=2;n++){
   const alt=id==='DBMS'?'Tue, Thu 02:00 PM - 03:30 PM':id==='ML'?'Mon, Wed 03:30 PM - 05:00 PM':id==='OS'?'Tue, Thu 11:30 AM - 01:00 PM':id==='IOT'?'Sat 09:30 AM - 12:30 PM':id==='DS'?'Tue, Thu 08:00 AM - 09:30 AM':'Sat 02:00 PM - 03:30 PM';
   await conn.execute(`INSERT IGNORE INTO course_sections(id,course_id,section_number,section_name,faculty_id,faculty_name,faculty_email,classroom,schedule,total_seats)VALUES(?,?,?,?,?,?,?,?,?,?)`,[`${id}-SEC${n}`,id,n,`Section ${n}`,facultyId,`Dr. ${id} Faculty`,`${id.toLowerCase()}@portal.local`,`Hall ${200+n}`,n===1?schedule:alt,id==='SEC'?1:30]);
  }
  const [[{n}]]=await conn.execute('SELECT COUNT(*) AS n FROM course_syllabus WHERE course_id=?',[id]);
  if(!n){
   const topics=id==='DBMS'?['CO1: ER models, normalisation and SQL constraints','CO1: JOINs, aggregates, CTEs and window functions','CO1: Transactions, locks, views, triggers and stored logic','CO2-CO6: NoSQL, API frameworks, microservices and deployment']:['Foundations and core concepts','Practical applications and labs','Project implementation and evaluation'];
   for(let i=0;i<topics.length;i++)await conn.execute('INSERT INTO course_syllabus(course_id,week_range,topic) VALUES(?,?,?)',[id,`Unit ${i+1}`,topics[i]]);
   await conn.execute('INSERT INTO course_outcomes(course_id,outcome_text) VALUES(?,?)',[id,`Apply ${name.toLowerCase()} concepts to a working project.`]);
   for(const [component,weight] of [['Internal Assessment','30%'],['Midterm','20%'],['Final Assessment','50%']])await conn.execute('INSERT INTO course_assessments(course_id,component,weight)VALUES(?,?,?)',[id,component,weight]);
  }
 }
 await conn.query(`INSERT IGNORE INTO course_prerequisites VALUES('ML','DS')`);
 // Insert once only: rerunning setup never re-enrolls a dropped student or resets marks.
 await conn.query(`INSERT IGNORE INTO enrollments(student_id,course_id,section_id,status)VALUES('2520030477','DS','DS-SEC1','Completed'),('2520030477','DBMS','DBMS-SEC1','Enrolled'),('2520030002','SEC','SEC-SEC1','Enrolled')`);
 await conn.query(`INSERT IGNORE INTO grades(student_id,course_id,internal_marks,midterm_marks,final_marks,total_marks,grade,grade_points,semester)VALUES('2520030477','DS',27,18,43,88,'A+',9,'Trimester 2025')`);
 for(const [date,present] of [['2026-09-21',1],['2026-09-23',1],['2026-09-28',0],['2026-09-30',1]])await conn.execute(`INSERT IGNORE INTO attendance(student_id,course_id,session_date,present)VALUES('2520030477','DBMS',?,?)`,[date,present]);
 await seedClusters(conn);
}
