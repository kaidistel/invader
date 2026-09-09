import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {RidePhysics,wrap,RIDE_LIFT,HOLD_ANGLE,INVERSION_THRESHOLD,MAX_MAIN_RATE} from '../physics.mjs';
const model=JSON.parse(gunzipSync(readFileSync(new URL('../assets/nightfly.json.gz',import.meta.url))));
const p=new RidePhysics(model.origins),step=1/120;
function run(seconds,observe=()=>{}){for(let t=0;t<seconds;t+=step){p.step(step);observe(p);assert.ok([p.lift,p.mainAngle,p.mainVelocity,p.spinAngle,...p.gondolas.flatMap(g=>[g.angle,g.velocity])].every(Number.isFinite),'nonfinite state');assert.ok(Math.abs(p.mainVelocity)<=MAX_MAIN_RATE+1e-9,'main arm must never exceed the realistic speed cap');}}
const heights=[0,1,2,3].map(k=>model.origins['gondola'+k][2]);assert.ok(heights.every(h=>Math.abs(h-heights[0])<1e-10));assert.ok(model.hinges.every(h=>h[2]===0));
assert.equal(p.setSwing(true),false);assert.equal(p.setSpin(true),false);
p.setLift(RIDE_LIFT);run(12);assert.ok(p.canDrive);assert.ok(Math.abs(p.mainAngle)<.02,'no artificial lateral ride lean');

// Normal programme keeps a recognisable back-and-forth swing and builds amplitude progressively.
p.amplitude=120*Math.PI/180;assert.ok(p.setSwing(true));let lo=Infinity,hi=-Infinity;run(18,s=>{lo=Math.min(lo,s.mainAngle);hi=Math.max(hi,s.mainAngle);});assert.ok(lo<-.3&&hi>.3,'normal programme must swing both directions');

// Exactly 180 degrees is a true top hold, not an inversion request.
p.amplitude=HOLD_ANGLE;run(18);assert.equal(p.swingMode,'hold');assert.ok(Math.abs(Math.abs(wrap(p.mainAngle))-Math.PI)<.04,'180 degree command must hold the arm upside down');assert.ok(Math.abs(p.mainVelocity)<.06,'top hold must settle');

// 181 degrees and above must produce a loop, then return to visible pendulum motion.
p.setSwing(false);run(8);p.amplitude=INVERSION_THRESHOLD;assert.ok(p.setSwing(true));let entered=false,completed=false,returned=false,maxRate=0,wasInverting=false;run(70,s=>{
 maxRate=Math.max(maxRate,Math.abs(s.mainVelocity));
 if(s.inverting)entered=true;
 if(wasInverting&&!s.inverting)completed=true;
 if(completed&&s.mainVelocity<-10*Math.PI/180&&wrap(s.mainAngle)<-35*Math.PI/180)returned=true;
 wasInverting=s.inverting;
});
assert.equal(p.swingMode,'invert');assert.ok(entered,'181 degree command must enter inversion mode automatically');assert.ok(completed,'inversion must finish and leave loop mode');assert.ok(returned,'after a loop the arm must visibly swing back before another inversion');assert.ok(maxRate<=MAX_MAIN_RATE+1e-9,'inversion must remain below the hard physical speed limit');

// Gondola brake logic still works during the energetic programme.
p.setSpin(true);p.setBrakes(false);run(6);assert.ok(p.gondolas.some(g=>Math.abs(g.angle)>.08));p.setBrakes(true);run(1);const locked=p.gondolas.map(g=>g.angle);run(2);p.gondolas.forEach((g,k)=>assert.ok(Math.abs(g.angle-locked[k])<1e-9));
console.log('PASS: neutral ride pose; progressive swing; exact 180° hold; loop returns to pendulum motion with speed cap; independent gondola dynamics and brakes.');
