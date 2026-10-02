import React,{createContext,useContext,useState,useEffect,useCallback,useRef} from 'react';
import api,{TOKEN_KEY} from '../services/api';
const Context=createContext(null);const emptyUser={id:'',fullName:'',email:'',phone:'',currentGpa:0,semesterGpa:0,completedCredits:0,totalCredits:160,attendanceRate:0};const emptyWeek=()=>Object.fromEntries(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map(d=>[d,[]]));
export function AppProvider({children}){
 const [currentUser,setCurrentUser]=useState(emptyUser),[isAuthenticated,setAuthenticated]=useState(false),[authLoading,setAuthLoading]=useState(true);
 const [clusters,setClusters]=useState([]);
 const [courses,setCourses]=useState([]),[enrolledCourses,setEnrolled]=useState([]),[grades,setGrades]=useState([]),[notifications,setNotifications]=useState([]),[weeklyTimetable,setTimetable]=useState(emptyWeek),[waitlist,setWaitlist]=useState([]),[toasts,setToasts]=useState([]),[isBackendConnected,setConnected]=useState(false),[isSyncing,setSyncing]=useState(false);
 const userRef=useRef(null),fetching=useRef(false),pending=useRef(false),generation=useRef(0);
 const showToast=useCallback((message,type='info')=>{const id=Date.now()+Math.random();setToasts(p=>[...p,{id,message,type}]);setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),5000);},[]);
 const clearSession=useCallback(()=>{generation.current++;sessionStorage.removeItem(TOKEN_KEY);userRef.current=null;setAuthenticated(false);setCurrentUser(emptyUser);setEnrolled([]);setGrades([]);setNotifications([]);setTimetable(emptyWeek());setWaitlist([]);},[]);
 const refreshBackendData=useCallback(async(targetId=null,notify=false)=>{
  if(fetching.current){pending.current=true;return;}fetching.current=true;setSyncing(true);const gen=generation.current;
  try{
   const catalog=await api.courses.getAll();if(gen!==generation.current)return;setCourses(catalog.courses||[]);
   const u=userRef.current;
   if(u){const r=await api.clusters.getAll();if(gen!==generation.current)return;setClusters(r.clusters||[]);}
   if(u?.role==='student'){
    const id=targetId||u.id;
    const [profile,enrolled,marks,timetable,alerts,queue]=await Promise.all([api.students.getProfile(id),api.enrollments.getEnrolled(id),api.grades.getGrades(id),api.timetable.getTimetable(id),api.notifications.getAll(id),api.enrollments.waitlist(id)]);
    if(gen!==generation.current)return;
    setCurrentUser(profile.student);setEnrolled(enrolled.enrolledCourses||[]);setGrades(marks.grades||[]);setTimetable(timetable.timetable);setNotifications(alerts.notifications||[]);setWaitlist(queue.waitlist||[]);
   }
   setConnected(true);if(notify)showToast('Data refreshed.','success');
  }catch(e){if(gen===generation.current){setConnected(false);if(notify)showToast(e.message,'error');}}
  finally{fetching.current=false;setSyncing(false);if(pending.current){pending.current=false;queueMicrotask(()=>refreshBackendData());}}
 },[showToast]);
 useEffect(()=>{
  let active=true;
  const expired=()=>{clearSession();showToast('Please sign in again.','warning');};window.addEventListener('portal-session-expired',expired);
  (async()=>{try{if(sessionStorage.getItem(TOKEN_KEY)){const {user}=await api.auth.me();if(!active)return;userRef.current=user;setCurrentUser(user);setAuthenticated(true);}await refreshBackendData();}catch{clearSession();}finally{if(active)setAuthLoading(false);}})();
  return()=>{active=false;window.removeEventListener('portal-session-expired',expired);};
 },[clearSession,refreshBackendData,showToast]);
 useEffect(()=>{if(!isAuthenticated)return;const focus=()=>refreshBackendData();const timer=setInterval(()=>{if(document.visibilityState==='visible')refreshBackendData();},15000);window.addEventListener('focus',focus);return()=>{clearInterval(timer);window.removeEventListener('focus',focus);};},[isAuthenticated,refreshBackendData]);
 const accept=async res=>{generation.current++;sessionStorage.setItem(TOKEN_KEY,res.token);userRef.current=res.user||res.student;setCurrentUser(userRef.current);setAuthenticated(true);setConnected(true);await refreshBackendData();showToast(res.message,'success');return {success:true,role:userRef.current.role};};
 const login=async(id,pass)=>{try{return await accept(await api.auth.login(id,pass));}catch(e){showToast(e.message,'error');return false;}};
 const registerStudent=async data=>{try{return await accept(await api.auth.register(data));}catch(e){showToast(e.message,'error');return false;}};
 const operation=async fn=>{try{const res=await fn();await refreshBackendData();showToast(res.message||'Saved.','success');return true;}catch(e){showToast(e.message,'error');return false;}};
 const enrollCourse=(course,section=null,queue=false)=>operation(()=>api.enrollments.enroll(currentUser.id,course,section,queue));
 const dropCourse=course=>operation(()=>api.enrollments.drop(currentUser.id,course));
 const updateProfile=data=>operation(()=>api.students.updateProfile(currentUser.id,data));
 const logout=()=>{clearSession();showToast('Signed out.');};
 const enrolledCourseIds=enrolledCourses.map(c=>c.id);
 const visibleCourses=currentUser.role==='student'?courses.map(c=>{const sections=(currentUser.clusterId?(c.sections||[]).filter(s=>s.clusterId===currentUser.clusterId):[]);return {...c,sections,totalSeats:sections.reduce((n,s)=>n+Number(s.totalSeats),0),availableSeats:sections.reduce((n,s)=>n+Number(s.availableSeats),0)};}):courses;
 const selectCluster=clusterId=>operation(()=>api.clusters.select(currentUser.id,clusterId));
 return <Context.Provider value={{currentUser,isAuthenticated,authLoading,isAdmin:isAuthenticated&&currentUser.role==='admin',courses:visibleCourses,clusters,selectCluster,enrolledCourses,enrolledCourseIds,grades,notifications,weeklyTimetable,waitlist,unreadNotificationCount:notifications.filter(n=>!n.read).length,toasts,isBackendConnected,isSyncing,refreshBackendData,login,registerStudent,logout,enrollCourse,dropCourse,updateProfile,showToast,removeToast:id=>setToasts(p=>p.filter(t=>t.id!==id)),markNotificationRead:id=>operation(()=>api.notifications.markRead(id)),markAllNotificationsRead:()=>operation(()=>api.notifications.markAllRead(currentUser.id)),cancelWaitlist:id=>operation(()=>api.enrollments.cancelWaitlist(id))}}>{children}</Context.Provider>;
}
export const useApp=()=>useContext(Context);
