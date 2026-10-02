import test from 'node:test';
import assert from 'node:assert/strict';

test('password hashing rejects universal demo passwords and malformed hashes', async () => {
 const security = await import('../services/security.js');
 const hash = await security.hashPassword('Correct-Pass-42');
 assert.notEqual(hash,'Correct-Pass-42');
 assert.equal(await security.verifyPassword('Correct-Pass-42',hash),true);
 assert.equal(await security.verifyPassword('password123',hash),false);
 assert.equal(await security.verifyPassword('anything','broken'),false);
});
test('signed sessions reject tampering and expiration', async () => {
 const s = await import('../services/security.js');
 const token=s.signToken({id:'S1',role:'student'},'test-secret',60);
 assert.equal(s.verifyToken(token,'test-secret').id,'S1');
 assert.throws(()=>s.verifyToken(token+'x','test-secret'));
 assert.throws(()=>s.verifyToken(s.signToken({id:'S1',role:'student'},'test-secret',-1),'test-secret'));
});
test('time conflict detection allows adjacent classes and rejects overlaps', async () => {
 const { schedulesOverlap, parseSchedule } = await import('../services/rules.js');
 assert.equal(schedulesOverlap('Mon, Wed 10:00 AM - 11:30 AM','Wed 11:00 AM - 12:00 PM'),true);
 assert.equal(schedulesOverlap('Mon 10:00 AM - 11:30 AM','Mon 11:30 AM - 12:30 PM'),false);
 assert.equal(schedulesOverlap('Mon 10:00 AM - 11:30 AM','Tue 10:00 AM - 11:30 AM'),false);
 assert.throws(()=>parseSchedule('invalid'));
 assert.throws(()=>parseSchedule('Mon 13:00 AM - 02:00 PM'));
});
test('grade rules reject impossible marks and calculate exact boundaries',async()=>{
 const {calculateGrade}=await import('../services/rules.js');
 assert.deepEqual(calculateGrade(30,20,50),{total:100,grade:'O',points:10});
 assert.equal(calculateGrade(15,10,15).grade,'P');
 assert.equal(calculateGrade(0,0,0).points,0);
 assert.throws(()=>calculateGrade(31,20,50));
 assert.throws(()=>calculateGrade('abc',20,50));
});
test('ownership denies another student and permits administrators',async()=>{
 const {canAccessStudent}=await import('../services/security.js');
 assert.equal(canAccessStudent({id:'S1',role:'student'},'S2'),false);
 assert.equal(canAccessStudent({id:'S1',role:'student'},'S1'),true);
 assert.equal(canAccessStudent({id:'A1',role:'admin'},'S2'),true);
});
test('cluster enrollment requires a choice and forbids mixing clusters',async()=>{
 const rules=await import('../services/rules.js');
 assert.equal(typeof rules.clusterEligibility,'function');
 assert.match(rules.clusterEligibility(null,'C1'),/Choose/);
 assert.match(rules.clusterEligibility('C1','C2'),/selected cluster/);
 assert.match(rules.clusterEligibility('C1',null),/assigned/);
 assert.equal(rules.clusterEligibility('C1','C1'),null);
});
test('CGPA overrides accept zero and ten and reject invalid values',async()=>{
 const rules=await import('../services/rules.js');
 assert.equal(typeof rules.parseCgpa,'function');
 assert.equal(rules.parseCgpa(null),null);
 assert.equal(rules.parseCgpa(0),0);
 assert.equal(rules.parseCgpa('9.25'),9.25);
 assert.equal(rules.parseCgpa(10),10);
 for(const value of ['',true,false,undefined,-1,10.01,Infinity,'abc','  '])assert.throws(()=>rules.parseCgpa(value));
});
