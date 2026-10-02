import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import {fileURLToPath} from 'node:url';
dotenv.config({path:fileURLToPath(new URL('../.env',import.meta.url))});
export const dbConfig={host:process.env.DB_HOST||'127.0.0.1',port:Number(process.env.DB_PORT||3306),user:process.env.DB_USER||'root',password:process.env.DB_PASSWORD_B64!==undefined?Buffer.from(process.env.DB_PASSWORD_B64,'base64').toString('utf8'):(process.env.DB_PASSWORD||''),database:process.env.DB_NAME||'student_portal_pro'};
const pool=mysql.createPool({...dbConfig,waitForConnections:true,connectionLimit:10,decimalNumbers:true});
export async function testConnection(){await pool.query('SELECT 1');return true;}
export default pool;
