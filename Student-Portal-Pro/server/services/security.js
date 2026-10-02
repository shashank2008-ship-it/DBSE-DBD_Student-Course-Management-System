import {randomBytes, scrypt as scryptCb, timingSafeEqual, createHmac} from 'node:crypto';
import {promisify} from 'node:util';
const scrypt=promisify(scryptCb);
export async function hashPassword(password){
 const salt=randomBytes(16).toString('hex');
 const key=await scrypt(password,salt,64);
 return `scrypt$${salt}$${key.toString('hex')}`;
}
export async function verifyPassword(password,hash){
 try{
  const [kind,salt,hex]=String(hash).split('$');
  if(kind!=='scrypt'||!salt||!/^[a-f0-9]{128}$/.test(hex))return false;
  const key=await scrypt(password,salt,64);return timingSafeEqual(key,Buffer.from(hex,'hex'));
 }catch{return false;}
}
const encode=x=>Buffer.from(JSON.stringify(x)).toString('base64url');
export function signToken(user,secret,seconds=28800){
 const body=`${encode({alg:'HS256',typ:'JWT'})}.${encode({sub:user.id,id:user.id,role:user.role,exp:Math.floor(Date.now()/1000)+seconds,iat:Math.floor(Date.now()/1000)})}`;
 return `${body}.${createHmac('sha256',secret).update(body).digest('base64url')}`;
}
export function verifyToken(token,secret){
 const [header,payload,signature,...extra]=String(token).split('.');
 if(extra.length||!signature)throw new Error('Invalid session');
 const expected=createHmac('sha256',secret).update(`${header}.${payload}`).digest();
 const actual=Buffer.from(signature,'base64url');
 if(actual.length!==expected.length||!timingSafeEqual(actual,expected))throw new Error('Invalid session');
 const h=JSON.parse(Buffer.from(header,'base64url'));
 const user=JSON.parse(Buffer.from(payload,'base64url'));
 if(h.alg!=='HS256'||!user.id||!['admin','student'].includes(user.role)||!Number.isFinite(user.exp)||user.exp<=Date.now()/1000)throw new Error('Session expired');
 return user;
}
export const canAccessStudent=(user,id)=>user?.role==='admin'||(user?.role==='student'&&user.id===id);
