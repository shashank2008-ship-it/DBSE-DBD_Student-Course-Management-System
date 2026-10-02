export class ApiError extends Error {constructor(status,message){super(message);this.status=status;}}
export function text(value,name,max=150){
 if(typeof value!=='string'||!value.trim()||value.trim().length>max)throw new ApiError(400,`${name} must be 1-${max} characters.`);
 return value.trim();
}
export function email(value){const v=text(value,'Email').toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))throw new ApiError(400,'Enter a valid email.');return v;}
export function password(value){if(typeof value!=='string'||value.length<8||value.length>128)throw new ApiError(400,'Password must contain 8-128 characters.');return value;}
export function calculateGrade(internal,midterm,final){
 const values=[internal,midterm,final];
 if(values.some((v,i)=>typeof v!=='number'||!Number.isFinite(v)||v<0||v>[30,20,50][i]))throw new ApiError(400,'Marks must be numbers within internal 0-30, midterm 0-20 and final 0-50.');
 const total=Math.round(values.reduce((a,b)=>a+b,0)*100)/100;
 const bands=[[90,'O',10],[80,'A+',9],[70,'A',8],[60,'B+',7],[50,'B',6],[40,'P',5],[0,'F',0]];
 const [,grade,points]=bands.find(([min])=>total>=min);return {total,grade,points};
}
export function parseSchedule(schedule){
 const m=String(schedule).match(/^(.*?)\s+(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
 if(!m)throw new ApiError(400,'Invalid schedule. Example: Mon, Wed 10:00 AM - 11:30 AM');
 const days={mon:'Monday',monday:'Monday',tue:'Tuesday',tuesday:'Tuesday',wed:'Wednesday',wednesday:'Wednesday',thu:'Thursday',thursday:'Thursday',fri:'Friday',friday:'Friday',sat:'Saturday',saturday:'Saturday'};
 const selected=m[1].split(',').map(s=>days[s.trim().toLowerCase()]);
 const time=(h,min,p)=>{h=Number(h);min=Number(min);if(h<1||h>12||min>59)throw new ApiError(400,'Invalid schedule time.');return (h%12+(p.toUpperCase()==='PM'?12:0))*60+min;};
 const start=time(m[2],m[3],m[4]),end=time(m[5],m[6],m[7]);
 if(!selected.length||selected.some(x=>!x)||start>=end)throw new ApiError(400,'Schedule needs valid days and a later end time.');
 return [...new Set(selected)].map(day=>({day,start,end,timeSlot:`${m[2]}:${m[3]} ${m[4].toUpperCase()} - ${m[5]}:${m[6]} ${m[7].toUpperCase()}`}));
}
export function schedulesOverlap(a,b){return parseSchedule(a).some(x=>parseSchedule(b).some(y=>x.day===y.day&&x.start<y.end&&y.start<x.end));}
export function clusterEligibility(studentCluster,sectionCluster){
 if(!studentCluster)return 'Choose an academic cluster before enrolling.';
 if(!sectionCluster)return 'This section has not been assigned to a cluster. Contact the administrator.';
 return studentCluster===sectionCluster?null:'Choose a section within your selected cluster. Courses from different clusters cannot be mixed.';
}
export function parseCgpa(value){
 if(value===null)return null;
 if(!['number','string'].includes(typeof value)||String(value).trim()===''||!Number.isFinite(Number(value))||Number(value)<0||Number(value)>10)throw new ApiError(400,'CGPA must be a number between 0 and 10, or null to use calculated GPA.');
 return Math.round(Number(value)*100)/100;
}
