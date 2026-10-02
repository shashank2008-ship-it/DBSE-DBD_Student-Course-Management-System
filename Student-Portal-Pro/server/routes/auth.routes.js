import express from 'express';
import pool from '../config/db.js';
import {hashPassword,verifyPassword,signToken} from '../services/security.js';
import {text,email,password,ApiError} from '../services/rules.js';
import {asyncRoute,authenticate} from '../middleware/auth.js';
export const formatStudent=row=>({id:row.id,rollNumber:row.roll_number,fullName:row.full_name,email:row.email,phone:row.phone||'',department:row.department,program:row.program,year:row.year_level,semester:row.semester,currentGpa:row.cgpa_override!==null&&row.cgpa_override!==undefined?Number(row.cgpa_override):Number(row.current_gpa)||0,calculatedGpa:Number(row.current_gpa)||0,cgpaSource:row.cgpa_override!==null&&row.cgpa_override!==undefined?'admin':'calculated',cgpaReason:row.cgpa_reason||'',clusterId:row.cluster_id||null,clusterName:row.cluster_name||null,clusterCode:row.cluster_code||null,clusterLocked:Boolean(row.cluster_locked),semesterGpa:Number(row.semester_gpa)||0,totalCredits:Number(row.total_credits)||160,completedCredits:Number(row.completed_credits)||0,attendanceRate:Number(row.attendance_rate)||0,currentSemesterCredits:Number(row.current_semester_credits)||0,role:'student',isAdmin:false});
export async function getUser(id,role){
 if(role==='admin'){const [rows]=await pool.execute('SELECT id,full_name,email,department,phone FROM admins WHERE id=?',[id]);if(!rows.length)throw new ApiError(401,'Account no longer exists.');return {id:rows[0].id,fullName:rows[0].full_name,email:rows[0].email,department:rows[0].department,phone:rows[0].phone,role:'admin',isAdmin:true};}
 const [rows]=await pool.execute(`SELECT s.*,v.current_gpa,v.semester_gpa,v.completed_credits,v.attendance_rate,v.current_semester_credits,ch.cluster_id,ch.locked cluster_locked,cl.name cluster_name,cl.code cluster_code,o.value cgpa_override,o.reason cgpa_reason FROM students s JOIN v_student_academic_summary v ON v.student_id=s.id LEFT JOIN student_cluster_choices ch ON ch.student_id=s.id AND ch.semester=s.semester LEFT JOIN academic_clusters cl ON cl.id=ch.cluster_id LEFT JOIN cgpa_overrides o ON o.student_id=s.id WHERE s.id=?`,[id]);if(!rows.length)throw new ApiError(401,'Account no longer exists.');return formatStudent(rows[0]);
}
const router=express.Router();
const attempts=new Map();
router.use((req,res,next)=>{
 if(req.method==='GET')return next();const key=req.ip;const now=Date.now();let state=attempts.get(key);
 if(!state||state.until<now){state={count:0,until:now+60000};attempts.set(key,state);}if(++state.count>20)return res.status(429).json({success:false,message:'Too many authentication requests. Try again in one minute.'});
 if(attempts.size>10000)for(const [k,v] of attempts)if(v.until<now)attempts.delete(k);next();
});
router.post('/login',asyncRoute(async(req,res)=>{
 const credential=text(req.body.studentIdOrEmail||req.body.rollNumber||req.body.username,'Student ID or email',150);
 const pass=typeof req.body.password==='string'?req.body.password:'';
 const [admins]=await pool.execute('SELECT id,password_hash FROM admins WHERE username=? OR email=? OR id=?',[credential,credential,credential]);
 const [students]=admins.length?[[]]:await pool.execute('SELECT id,password_hash FROM students WHERE id=? OR email=? OR roll_number=?',[credential,credential,credential]);
 const row=admins[0]||students[0];if(!row||!await verifyPassword(pass,row.password_hash))throw new ApiError(401,'Invalid credentials.');
 const user=await getUser(row.id,admins.length?'admin':'student');res.json({success:true,role:user.role,user,student:user,token:signToken(user,process.env.JWT_SECRET),message:`Welcome back, ${user.fullName}!`});
}));
router.post('/register',asyncRoute(async(req,res)=>{
 const id=text(req.body.rollNumber,'Roll number',50).toUpperCase();if(!/^[A-Z0-9_-]+$/.test(id))throw new ApiError(400,'Roll number can contain letters, numbers, underscores and hyphens.');
 const name=text(req.body.fullName,'Full name');const mail=email(req.body.email);const pass=password(req.body.password);
 const dept=req.body.department?text(req.body.department,'Department',100):'Computer Science & Engineering';
 const year=req.body.year?text(req.body.year,'Year',50):'1st Year';
 await pool.execute('INSERT INTO students(id,roll_number,full_name,email,password_hash,department,program,year_level)VALUES(?,?,?,?,?,?,?,?)',[id,id,name,mail,await hashPassword(pass),dept,`B.Tech in ${dept}`,year]);
 const user=await getUser(id,'student');res.status(201).json({success:true,user,student:user,token:signToken(user,process.env.JWT_SECRET),message:'Registration successful.'});
}));
router.get('/me',authenticate,asyncRoute(async(req,res)=>res.json({success:true,user:await getUser(req.user.id,req.user.role)})));
router.post('/change-password',authenticate,asyncRoute(async(req,res)=>{
 const table=req.user.role==='admin'?'admins':'students';const [rows]=await pool.execute(`SELECT password_hash FROM ${table} WHERE id=?`,[req.user.id]);
 if(!rows.length||!await verifyPassword(req.body.currentPassword||'',rows[0].password_hash))throw new ApiError(400,'Current password is incorrect.');
 await pool.execute(`UPDATE ${table} SET password_hash=? WHERE id=?`,[await hashPassword(password(req.body.newPassword)),req.user.id]);res.json({success:true,message:'Password updated.'});
}));
export default router;
