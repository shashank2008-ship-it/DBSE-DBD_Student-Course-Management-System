import {verifyToken,canAccessStudent} from '../services/security.js';
import {ApiError} from '../services/rules.js';
export function authenticate(req,res,next){
 try{
  if(!req.headers.authorization?.startsWith('Bearer '))throw new Error();
  req.user=verifyToken(req.headers.authorization.slice(7),process.env.JWT_SECRET);next();
 }catch{res.status(401).json({success:false,message:'Please sign in. Your session is missing, invalid or expired.'});}
}
export function adminOnly(req,res,next){if(req.user.role!=='admin')return next(new ApiError(403,'Administrator access required.'));next();}
export function requireOwner(req,id){if(!canAccessStudent(req.user,id))throw new ApiError(403,'You can only access your own student records.');}
export const asyncRoute=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
