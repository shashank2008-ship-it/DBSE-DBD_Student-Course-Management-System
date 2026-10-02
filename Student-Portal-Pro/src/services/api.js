export const TOKEN_KEY='student_portal_pro_token';
export const request=async(endpoint,options={})=>{
 const token=sessionStorage.getItem(TOKEN_KEY);
 const response=await fetch(`/api${endpoint}`,{...options,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{ }),...options.headers}});
 const data=await response.json();
 if(!response.ok){if(response.status===401&&!endpoint.startsWith('/auth/login'))window.dispatchEvent(new Event('portal-session-expired'));const error=new Error(data.message||'Request failed.');error.status=response.status;throw error;}
 return data;
};
const json=(method,data)=>({method,body:JSON.stringify(data)});
const api={
 clusters:{getAll:()=>request('/clusters'),select:(id,clusterId,reason)=>request(`/clusters/students/${id}`,json('PUT',{clusterId,reason})),saveCgpa:(id,value,reason)=>request(`/clusters/students/${id}/cgpa`,json('PUT',{value,reason})),update:(id,data)=>request(`/clusters/${id}`,json('PUT',data)),renameGroup:(id,name)=>request(`/clusters/groups/${id}/name`,json('PUT',{name})),assignSection:(id,groupId)=>request(`/clusters/sections/${id}/group`,json('PUT',{groupId})),audit:()=>request('/clusters/audit/history')},
 health:()=>request('/health'),
 auth:{login:(studentIdOrEmail,password)=>request('/auth/login',json('POST',{studentIdOrEmail,password})),register:data=>request('/auth/register',json('POST',data)),me:()=>request('/auth/me'),changePassword:data=>request('/auth/change-password',json('POST',data))},
 students:{getAll:()=>request('/students'),getProfile:id=>request(`/students/${id}`),updateProfile:(id,data)=>request(`/students/${id}`,json('PUT',data))},
 courses:{getAll:()=>request('/courses'),getById:id=>request(`/courses/${id}`)},
 enrollments:{getEnrolled:id=>request(`/enrollments/${id}`),enroll:(studentId,courseId,sectionId,waitlist=false)=>request('/enrollments',json('POST',{studentId,courseId,sectionId,waitlist})),drop:(studentId,courseId)=>request('/enrollments',json('DELETE',{studentId,courseId})),waitlist:id=>request(`/enrollments/waitlist/${id}`),cancelWaitlist:id=>request(`/enrollments/waitlist/${id}`,{method:'DELETE'}),eligibility:(course,section)=>request(`/enrollments/eligibility/${course}/${section}`)},
 faculty:{getAll:()=>request('/admin/faculty')},
 admin:{getOverview:()=>request('/admin/overview'),getStudents:()=>request('/admin/students'),getEnrollments:()=>request('/admin/enrollments'),getFaculty:()=>request('/admin/faculty'),dropEnrollment:(studentId,courseId)=>request('/admin/enrollments/drop',json('POST',{studentId,courseId})),audit:()=>request('/admin/audit'),waitlist:()=>request('/admin/waitlist'),analytics:()=>request('/admin/analytics'),saveGrades:data=>request('/admin/grades',json('PUT',data)),saveAttendance:data=>request('/admin/attendance',json('PUT',data))},
 grades:{getGrades:id=>request(`/grades/${id}`)},timetable:{getTimetable:id=>request(`/timetable/${id}`)},
 notifications:{getAll:id=>request(`/notifications/${id}`),markRead:id=>request(`/notifications/${id}/read`,{method:'PATCH'}),markAllRead:id=>request(`/notifications/read-all/${id}`,{method:'PATCH'})}
};
export async function downloadTranscript(id){const r=await fetch(`/api/grades/transcript/${id}`,{headers:{Authorization:`Bearer ${sessionStorage.getItem(TOKEN_KEY)}`}});if(!r.ok)throw new Error('Transcript download failed.');const url=URL.createObjectURL(await r.blob());const a=document.createElement('a');a.href=url;a.download='Academic-Transcript.csv';a.click();URL.revokeObjectURL(url);}
export default api;
