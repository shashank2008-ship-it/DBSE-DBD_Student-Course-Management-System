import {readFile,writeFile} from 'node:fs/promises';import {randomBytes} from 'node:crypto';import {createInterface} from 'node:readline/promises';import {spawnSync} from 'node:child_process';
const envPath=new URL('../server/.env',import.meta.url);let existing='';try{existing=await readFile(envPath,'utf8');}catch{}
if(existing){console.log('Existing server/.env preserved. Edit it manually to change MySQL settings.');}
else {
 const rl=createInterface({input:process.stdin,output:process.stdout});
 const host=(await rl.question('MySQL host [127.0.0.1]: ')).trim()||'127.0.0.1';
 const port=(await rl.question('MySQL port [3306]: ')).trim()||'3306';
 const user=(await rl.question('MySQL username [root]: ')).trim()||'root';
 const pass=process.env.PORTAL_SETUP_PASSWORD??await rl.question('MySQL password (local terminal input): ');rl.close();
 const quote=value=>{if(/[\r\n]/.test(value))throw new Error('Connection fields cannot contain newlines.');return value;};
 await writeFile(envPath,`DB_HOST=${quote(host)}\nDB_PORT=${port}\nDB_USER=${quote(user)}\nDB_PASSWORD_B64=${Buffer.from(pass).toString('base64')}\nDB_NAME=student_portal_pro\nPORT=5000\nJWT_SECRET=${randomBytes(48).toString('hex')}\n`);
 console.log('Configuration created.');
}
const db=spawnSync(process.execPath,['server/db/initDb.js'],{stdio:'inherit'});if(db.status!==0)process.exit(db.status||1);
const build=spawnSync(process.execPath,['scripts/build.mjs'],{stdio:'inherit'});if(build.status!==0)process.exit(build.status||1);console.log('Setup complete. Run npm start and open http://localhost:5000');
