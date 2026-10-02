import mysql from 'mysql2/promise';
import {readFile} from 'node:fs/promises';
import pool,{dbConfig} from '../config/db.js';
import {seedDatabase} from './seed.js';
if(!/^[A-Za-z0-9_]+$/.test(dbConfig.database))throw new Error('DB_NAME must contain letters, numbers and underscores only.');
const conn=await mysql.createConnection({...dbConfig,database:undefined});
try {
 await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
 await conn.query(`USE \`${dbConfig.database}\``);
 const sql=await readFile(new URL('./schema.sql',import.meta.url),'utf8');
 for(const statement of sql.split('-- @statement'))if(statement.trim())await conn.query(statement.trim());
 await seedDatabase(conn);
 console.log(`Database ${dbConfig.database} ready. Existing records and passwords are preserved on repeated setup.`);
 console.log('Demo admin: admin / Admin@2026! | Demo student: 2520030477 / Student@2026!');
} catch(e){console.error('Setup failed:',e.message);process.exitCode=1;}finally{await conn.end();await pool.end();}
