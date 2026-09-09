import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {RidePhysics,wrap,RIDE_LIFT,MAX_MAIN_RATE,TAU} from '../physics.mjs';
const model=JSON.parse(gunzipSync(readFileSync(new URL('../assets/nightfly.json.gz',import.meta.url))));
const p=new RidePhysics(model.origins),step=1/120;
function run(seconds,observe=()=>{}){for(let t=0;t<seconds;t+=step){p.step(step);observe(p);assert.ok([p.lift,p.mainAngle,p.mainVelocity,p.spinAngle,...p.gondolas.flatMap(g=>[g.angle,g.velocity])].every(Number.isFinite),'nonfinite state');assert.ok(Math.abs(p.mainVelocity)<=MAX_MAIN_RATE+1e-9,'main arm speed cap');}}
assert.equal(p.setProgram('p30'),false);assert.equal(p.setSpin(true),false);
p.setLift(RIDE_LIFT);run(12);assert.ok(p.canDrive);assert.ok(Math.abs(p.mainAngle)<.02);
for(const [name,min,max] of [['p30',.25,1.2],['p50',.45,1.9],['p80',.75,2.9]]){
 assert.ok(p.setProgram(name));let lo=Infinity,hi=-Infinity;run(22,s=>{lo=Math.min(lo,wrap(s.mainAngle));hi=Math.max(hi,wrap(s.mainAngle));});assert.ok(lo<-min&&hi>min,`${name} must swing both directions`);assert.ok(Math.max(Math.abs(lo),Math.abs(hi))<max,`${name} must stay in swing range`);
}
assert.ok(p.setProgram('hold'));run(18);assert.ok(Math.abs(Math.abs(wrap(p.mainAngle))-Math.PI)<.05,'hold must settle at 180 degrees');assert.ok(Math.abs(p.mainVelocity)<.07,'hold must settle');
p.setProgram('stop');run(10);assert.ok(Math.abs(wrap(p.mainAngle))<.08,'stop must return toward neutral');
assert.ok(p.setProgram('p100'));let rotating=false,startAngle=0,maxAngle=-Infinity,minRotRate=Infinity;run(55,s=>{if(s.rotating&&!rotating)startAngle=s.mainAngle;if(s.rotating){rotating=true;maxAngle=Math.max(maxAngle,s.mainAngle);minRotRate=Math.min(minRotRate,s.mainVelocity);}});assert.ok(rotating,'100 percent must enter continuous rotation');assert.ok(maxAngle-startAngle>TAU*1.5,'100 percent must continue through multiple loops');assert.ok(minRotRate>30*Math.PI/180,'continuous rotation must not stall');
p.setSpin(true);p.setBrakes(false);run(6);assert.ok(p.gondolas.some(g=>Math.abs(g.angle)>.08));p.setBrakes(true);run(1);const locked=p.gondolas.map(g=>g.angle);run(2);p.gondolas.forEach((g,k)=>assert.ok(Math.abs(g.angle-locked[k])<1e-9));
console.log('PASS: 30/50/80 swing programs; 180 hold; 100 continuous rotation; speed cap; gondola dynamics.');
