import express from 'express';
import pool from '../config/db.js';
import {asyncRoute,adminOnly,requireOwner} from '../middleware/auth.js';
import {ApiError,text,parseCgpa} from '../services/rules.js';
const router=express.Router();
router.get('/',asyncRoute(async(req,res)=>{
 const [clusters]=await pool.query(`SELECT c.*,(SELECT COUNT(*) FROM student_cluster_choices s WHERE s.cluster_id=c.id) student_count,(SELECT COUNT(DISTINCT cs.course_id) FROM section_clusters m JOIN cluster_groups g ON g.id=m.group_id JOIN course_sections cs ON cs.id=m.section_id WHERE g.cluster_id=c.id) course_count FROM academic_clusters c ORDER BY c.code`);
 const [groups]=await pool.query(`SELECT g.*,(SELECT COUNT(*) FROM section_clusters m WHERE m.group_id=g.id) offering_count FROM cluster_groups g ORDER BY g.id`);
 const [sections]=await pool.query(`SELECT cs.id,cs.course_id,cs.section_name,cs.schedule,cs.classroom,cs.faculty_name,cs.total_seats,c.course_code,c.course_name,m.group_id,g.cluster_id,(SELECT COUNT(*) FROM enrollments e WHERE e.section_id=cs.id AND e.status='Enrolled') filled_seats FROM course_sections cs JOIN courses c ON c.id=cs.course_id JOIN section_clusters m ON m.section_id=cs.id JOIN cluster_groups g ON g.id=m.group_id ORDER BY c.course_code,g.id`);
 res.json({success:true,clusters:clusters.map(c=>({...c,studentCount:Number(c.student_count),courseCount:Number(c.course_count),groups:groups.filter(g=>g.cluster_id===c.id),sections:sections.filter(s=>s.cluster_id===c.id)}))});
}));
async function changeCluster(req,res){
 const id=text(req.params.studentId,'Student ID',50),clusterId=text(req.body.clusterId,'Cluster ID',50);requireOwner(req,id);
 const conn=await pool.getConnection();try{
  await conn.beginTransaction();await conn.query('SELECT id FROM course_sections ORDER BY id FOR UPDATE');
  const [[s]]=await conn.execute('SELECT id,semester FROM students WHERE id=? FOR UPDATE',[id]);if(!s)throw new ApiError(404,'Student not found.');
  const [[cluster]]=await conn.execute('SELECT * FROM academic_clusters WHERE id=?',[clusterId]);if(!cluster||cluster.semester!==s.semester)throw new ApiError(400,'Choose a cluster for the current semester.');
  const [[old]]=await conn.execute('SELECT * FROM student_cluster_choices WHERE student_id=? AND semester=?',[id,s.semester]);
  if(old?.cluster_id===clusterId){await conn.commit();return res.json({success:true,message:'This cluster is already selected.'});}
  const [[{n}]]=await conn.execute(`SELECT (SELECT COUNT(*) FROM enrollments e JOIN courses c ON c.id=e.course_id WHERE e.student_id=? AND c.semester=? AND e.status IN('Enrolled','Completed'))+(SELECT COUNT(*) FROM waitlist w JOIN courses c ON c.id=w.course_id WHERE w.student_id=? AND c.semester=? AND w.status='Waiting') n`,[id,s.semester,id,s.semester]);
  if(n||old?.locked&&req.user.role!=='admin')throw new ApiError(409,'Cluster is locked for this semester. An administrator must resolve enrollments and waitlists before changing it.');
  const reason=req.user.role==='admin'?text(req.body.reason,'Change reason',255):'Student selected cluster before enrollment';
  await conn.execute('INSERT INTO student_cluster_choices(student_id,semester,cluster_id)VALUES(?,?,?) ON DUPLICATE KEY UPDATE cluster_id=VALUES(cluster_id),locked=FALSE',[id,s.semester,clusterId]);
  await conn.execute("INSERT INTO academic_audit(student_id,admin_id,action,old_value,new_value,reason)VALUES(?,?,'CLUSTER_SELECTED',?,?,?)",[id,req.user.role==='admin'?req.user.id:null,old?.cluster_id||null,clusterId,reason]);
  await conn.commit();res.json({success:true,message:`${cluster.name} selected. All subjects must stay in this cluster.`});
 }catch(e){await conn.rollback();throw e;}finally{conn.release();}
}
router.put('/students/:studentId',asyncRoute(changeCluster));
router.put('/students/:studentId/cgpa',adminOnly,asyncRoute(async(req,res)=>{
 const id=text(req.params.studentId,'Student ID',50),value=parseCgpa(req.body.value),reason=text(req.body.reason,'Change reason',255);
 const conn=await pool.getConnection();try{await conn.beginTransaction();const [[s]]=await conn.execute('SELECT id FROM students WHERE id=? FOR UPDATE',[id]);if(!s)throw new ApiError(404,'Student not found.');const [[old]]=await conn.execute('SELECT value FROM cgpa_overrides WHERE student_id=?',[id]);
 if(value===null)await conn.execute('DELETE FROM cgpa_overrides WHERE student_id=?',[id]);else await conn.execute('INSERT INTO cgpa_overrides(student_id,value,reason,admin_id)VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE value=VALUES(value),reason=VALUES(reason),admin_id=VALUES(admin_id)',[id,value,reason,req.user.id]);
 await conn.execute("INSERT INTO academic_audit(student_id,admin_id,action,old_value,new_value,reason)VALUES(?,?,'CGPA_UPDATED',?,?,?)",[id,req.user.id,old?String(old.value):null,value===null?null:String(value),reason]);await conn.commit();res.json({success:true,message:value===null?'Calculated CGPA restored.':'Official CGPA updated.'});
 }catch(e){await conn.rollback();throw e;}finally{conn.release();}
}));
router.put('/:id',adminOnly,asyncRoute(async(req,res)=>{const name=text(req.body.name,'Cluster name',100),description=text(req.body.description||'Academic cohort','Description',255);const [r]=await pool.execute('UPDATE academic_clusters SET name=?,description=? WHERE id=?',[name,description,req.params.id]);if(!r.affectedRows)throw new ApiError(404,'Cluster not found.');res.json({success:true,message:'Cluster updated.'});}));
router.put('/groups/:id/name',adminOnly,asyncRoute(async(req,res)=>{const [r]=await pool.execute('UPDATE cluster_groups SET name=? WHERE id=?',[text(req.body.name,'Section group name',50),req.params.id]);if(!r.affectedRows)throw new ApiError(404,'Section group not found.');res.json({success:true,message:'Section group updated.'});}));
router.put('/sections/:id/group',adminOnly,asyncRoute(async(req,res)=>{
 const group=text(req.body.groupId,'Section group',50);const conn=await pool.getConnection();try{await conn.beginTransaction();await conn.query('SELECT id FROM course_sections ORDER BY id FOR UPDATE');const [[s]]=await conn.execute('SELECT semester FROM courses c JOIN course_sections cs ON cs.course_id=c.id WHERE cs.id=?',[req.params.id]);const [[g]]=await conn.execute('SELECT c.semester FROM cluster_groups g JOIN academic_clusters c ON c.id=g.cluster_id WHERE g.id=?',[group]);if(!s||!g||g.semester!==s.semester)throw new ApiError(400,'Choose a valid section group in the course semester.');const [[{n}]]=await conn.execute("SELECT (SELECT COUNT(*) FROM enrollments WHERE section_id=?)+(SELECT COUNT(*) FROM waitlist WHERE section_id=? AND status='Waiting') n",[req.params.id,req.params.id]);if(n)throw new ApiError(409,'A section with enrollment history or a waiting student cannot be moved.');await conn.execute('INSERT INTO section_clusters(section_id,group_id)VALUES(?,?) ON DUPLICATE KEY UPDATE group_id=VALUES(group_id)',[req.params.id,group]);await conn.commit();res.json({success:true,message:'Course offering assigned to section group.'});}catch(e){await conn.rollback();throw e;}finally{conn.release();}
}));
router.get('/audit/history',adminOnly,asyncRoute(async(req,res)=>{const [audit]=await pool.query('SELECT a.*,s.full_name,s.roll_number FROM academic_audit a LEFT JOIN students s ON s.id=a.student_id ORDER BY a.id DESC LIMIT 100');res.json({success:true,audit});}));
export default router;
