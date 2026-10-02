import app from './app.js';import {testConnection} from './config/db.js';
if(!process.env.JWT_SECRET||process.env.JWT_SECRET.length<32){console.error('JWT_SECRET must contain at least 32 characters. Run npm run setup.');process.exit(1);}
try{await testConnection();const port=Number(process.env.PORT||5000);app.listen(port,'127.0.0.1',()=>console.log(`Student Portal Pro: http://localhost:${port}\nAPI documentation: http://localhost:${port}/api/docs`));}catch(e){console.error('Database connection failed:',e.message,'\nCheck server/.env and run npm run db:setup.');process.exit(1);}
