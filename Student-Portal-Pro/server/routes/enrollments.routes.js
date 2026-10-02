import express from 'express';
import pool from '../config/db.js';
import {asyncRoute,requireOwner} from '../middleware/auth.js';
import {text} from '../services/rules.js';
import {enroll,drop,cancelWaitlist,eligibility} from '../services/enrollment.js';
const router=express.Router();
router.get('/waitlist/:studentId',asyncRoute(async(req,res)=>{requireOwner(req,req.params.studentId);const [rows]=await pool.execute(`SELECT w.*,c.course_name,c.course_code,cs.section_name,(SELECT COUNT(*) FROM waitlist earlier WHERE earlier.section_id=w.section_id AND earlier.status='Waiting' AND earlier.id<=w.id) AS position FROM waitlist w JOIN courses c ON c.id=w.course_id JOIN course_sections cs ON cs.id=w.section_id WHERE w.student_id=? AND w.status='Waiting' ORDER BY w.id`,[req.params.studentId]);res.json({success:true,waitlist:rows});}));
router.delete('/waitlist/:id',asyncRoute(async(req,res)=>res.json(await cancelWaitlist(req.user.id,req.params.id))));
router.get('/eligibility/:courseId/:sectionId',asyncRoute(async(req,res)=>{
 const conn=await pool.getConnection();try{const [rows]=await conn.execute(`SELECT cs.*,c.credits FROM course_sections cs JOIN courses c ON c.id=cs.course_id WHERE cs.id=? AND cs.course_id=?`,[req.params.sectionId,req.params.courseId]);if(!rows.length)return res.status(404).json({success:false,message:'Section not found.'});const reason=await eligibility(conn,req.user.id,rows[0]);res.json({success:true,eligible:!reason,reason,creditLimit:24});}finally{conn.release();}
}));
router.get('/:studentId',asyncRoute(async(req,res)=>{
 requireOwner(req,req.params.studentId);const [rows]=await pool.execute(`SELECT e.*,c.course_code,c.course_name,c.credits,c.department,c.course_type,COALESCE(CONCAT(cl.code,' · ',g.name),cs.section_name) section_name,cs.section_number,cs.faculty_name,cs.classroom,cs.schedule,COALESCE(a.attendance_rate,0) AS attendance_rate FROM enrollments e JOIN courses c ON c.id=e.course_id JOIN course_sections cs ON cs.id=e.section_id LEFT JOIN section_clusters m ON m.section_id=cs.id LEFT JOIN cluster_groups g ON g.id=m.group_id LEFT JOIN academic_clusters cl ON cl.id=g.cluster_id LEFT JOIN(SELECT student_id,course_id,AVG(present)*100 AS attendance_rate FROM attendance GROUP BY student_id,course_id)a ON a.student_id=e.student_id AND a.course_id=e.course_id WHERE e.student_id=? AND e.status='Enrolled' ORDER BY c.course_code`,[req.params.studentId]);
 res.json({success:true,enrolledCourseIds:rows.map(r=>r.course_id),enrolledCourses:rows.map(r=>({id:r.course_id,courseId:r.course_id,courseCode:r.course_code,courseName:r.course_name,credits:r.credits,department:r.department,courseType:r.course_type,sectionId:r.section_id,sectionName:r.section_name,facultyName:r.faculty_name,classroom:r.classroom,schedule:r.schedule,attendanceRate:Number(r.attendance_rate),status:r.status}))});
}));
router.post('/',asyncRoute(async(req,res)=>{const studentId=req.body.studentId||req.user.id;requireOwner(req,studentId);const courseId=text(req.body.courseId,'Course ID',50);if(req.body.waitlist!==undefined&&typeof req.body.waitlist!=='boolean')return res.status(400).json({success:false,message:'waitlist must be a boolean.'});res.status(201).json(await enroll({studentId,courseId,sectionId:req.body.sectionId,waitlist:req.body.waitlist===true}));}));
router.delete('/',asyncRoute(async(req,res)=>{const studentId=req.body.studentId||req.user.id;requireOwner(req,studentId);res.json(await drop(studentId,text(req.body.courseId,'Course ID',50)));}));
export default router;
