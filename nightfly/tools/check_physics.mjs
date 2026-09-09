import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {RidePhysics,wrap,RIDE_LIFT,HOLD_ANGLE,INVERSION_THRESHOLD,MAX_MAIN_RATE,TAU} from '../physics.mjs';
const model=JSON.parse(gunzipSync(readFileSync(new URL('../assets/nightfly.json.gz',import.meta.url))));
const p=new RidePhysics(model.origins),step=1/120;
function run(seconds,observe=()=>{}){for(let t=0;t<seconds;t+=step){p.step(step);observe(p);assert.ok([p.lift,p.mainAngle,p.mainVelocity,p.spinAngle,...p.gondolas.flatMap(g=>[g.angle,g.velocity])].every(Number.isFinite),'nonfinite state');assert.ok(Math.abs(p.mainVelocity)<=MAX_MAIN_RATE+1e-9,'main arm must never exceed the realistic speed cap');}}
const heights=[0,1,2,3].map(k=>model.origins['gondola'+k][2]);assert.ok(heights.every(h=>Math.abs(h-heights[0])<1e-10));assert.ok(model.hinges.every(h=>h[2]===0));
assert.equal(p.setSwing(true),false);assert.equal(p.setSpin(true),false);
p.setLift(RIDE_LIFT);run(12);assert.ok(p.canDrive);assert.ok(Math.abs(p.mainAngle)<.02,'no artificial lateral ride lean');

p.amplitude=120*Math.PI/180;assert.ok(p.setSwing(true));let lo=Infinity,hi=-Infinity;run(18,s=>{lo=Math.min(lo,s.mainAngle);hi=Math.max(hi,s.mainAngle);});assert.ok(lo<-.3&&hi>.3,'normal programme must swing both directions');

p.amplitude=HOLD_ANGLE;run(18);assert.equal(p.swingMode,'hold');assert.ok(Math.abs(Math.abs(wrap(p.mainAngle))-Math.PI)<.04,'180 degree command must hold the arm upside down');assert.ok(Math.abs(p.mainVelocity)<.06,'top hold must settle');

// 181°+ restores the first reliable behaviour: swing up, cross the top and keep
// producing complete rotations without stalling, while staying below the speed cap.
p.setSwing(false);run(8);p.amplitude=INVERSION_THRESHOLD;assert.ok(p.setSwing(true));let entered=false,maxUnwrapped=-Infinity,minRate=Infinity,maxRate=0;
run(55,s=>{
 if(s.inverting)entered=true;
 maxUnwrapped=Math.max(maxUnwrapped,s.mainAngle);
 if(s.inverting)minRate=Math.min(minRate,Math.abs(s.mainVelocity));
 maxRate=Math.max(maxRate,Math.abs(s.mainVelocity));
});
assert.equal(p.swingMode,'invert');assert.ok(entered,'181 degree command must enter inversion mode');assert.ok(maxUnwrapped>TAU*2,'inversion programme must continue beyond one full loop');assert.ok(minRate>8*Math.PI/180,'inversion programme must not stall after the first loop');assert.ok(maxRate<=MAX_MAIN_RATE+1e-9,'inversion must remain below speed cap');

p.setSpin(true);p.setBrakes(false);run(6);assert.ok(p.gondolas.some(g=>Math.abs(g.angle)>.08));p.setBrakes(true);run(1);const locked=p.gondolas.map(g=>g.angle);run(2);p.gondolas.forEach((g,k)=>assert.ok(Math.abs(g.angle-locked[k])<1e-9));
console.log('PASS: progressive swing; 180° hold; reliable non-stalling inversions; speed cap; independent gondola dynamics.');
