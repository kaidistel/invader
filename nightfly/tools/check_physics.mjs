import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {RidePhysics,wrap,MAX_SWING_ANGLE,RIDE_LIFT,MAX_LIFT,LIFT_ANGLE,rx} from '../physics.mjs';
const model=JSON.parse(gunzipSync(readFileSync(new URL('../assets/nightfly.json.gz',import.meta.url))));
const p=new RidePhysics(model.origins),step=1/120;
function run(seconds){for(let t=0;t<seconds;t+=step){p.step(step);assert.ok([p.lift,p.mainAngle,p.spinAngle,...p.gondolas.flatMap(g=>[g.angle,g.velocity])].every(Number.isFinite),'nonfinite state');}}
const heights=[0,1,2,3].map(k=>model.origins['gondola'+k][2]);assert.ok(heights.every(h=>Math.abs(h-heights[0])<1e-10));assert.ok(model.hinges.every(h=>h[2]===0));
assert.equal(p.setSwing(true),false);assert.equal(p.setSpin(true),false);run(2);assert.ok(p.gondolas.every(g=>g.angle===0));
// The swing joint stays neutral laterally while the whole rotor is rigidly carried by the lifting boom.
const baseArm=model.origins.crown.map((v,i)=>v-model.origins.rotor[i]);
p.setLift(.5);run(8);assert.ok(Math.abs(p.mainAngle)<.02,'half lift must not add a lateral swing offset');const halfInherited=rx(baseArm,LIFT_ANGLE*p.lift);
p.setLift(RIDE_LIFT);run(10);assert.ok(p.canDrive);assert.ok(Math.abs(p.lift-RIDE_LIFT)<.001);assert.ok(Math.abs(p.mainAngle)<.02,'ride pose must have no artificial lateral lean');const rideInherited=rx(baseArm,LIFT_ANGLE*p.lift);assert.ok(Math.abs(rideInherited[1]-halfInherited[1])>.1||Math.abs(rideInherited[2]-halfInherited[2])>.1,'main arm must still be carried rigidly by lift motion');assert.ok(p.pivot()[2]>10);
assert.ok(p.setSwing(true));assert.ok(p.setSpin(true));p.setBrakes(false);run(18);assert.ok(Math.abs(p.mainAngle)>.05);assert.ok(Math.abs(p.mainAngle)<=MAX_SWING_ANGLE+.001);assert.ok(Math.abs(p.spinAngle)>1);assert.ok(p.gondolas.some(g=>Math.abs(g.angle)>.1));assert.ok(new Set(p.gondolas.map(g=>g.angle.toFixed(2))).size>1);
// Inversion range: command beyond 180 degrees and prove the arm crosses upside-down.
p.amplitude=205*Math.PI/180;p.swingSpeed=42*Math.PI/180;let inverted=false;for(let t=0;t<35;t+=step){p.step(step);if(Math.abs(p.mainAngle)>Math.PI)inverted=true;}assert.ok(inverted,'swing must be able to pass 180 degrees and perform an inversion');assert.ok(Math.abs(p.mainAngle)<=MAX_SWING_ANGLE+.001);
p.setSwing(false);run(12);assert.ok(Math.abs(p.mainAngle)<.02,'stopped swing must return to neutral ride pose');
p.setBrakes(true);run(1);const locked=p.gondolas.map(g=>g.angle);run(3);p.gondolas.forEach((g,k)=>assert.ok(Math.abs(g.angle-locked[k])<1e-10));
p.gondolas[2].brake=false;run(3);assert.ok(Math.abs(p.gondolas[2].angle-locked[2])>.01);assert.equal(p.gondolas[0].angle,locked[0]);
p.setLift(0);run(80);assert.ok(p.lift<.001);assert.ok(Math.abs(p.mainAngle)<.02);assert.ok(Math.abs(wrap(p.spinAngle))<.001);assert.ok(p.gondolas.every(g=>g.brake&&Math.abs(g.angle)<.001));
p.reset();p.setLift(1);run(12);assert.ok(p.lift<=MAX_LIFT+.001);p.setSwing(true);p.setSpin(true);p.amplitude=210*Math.PI/180;p.swingSpeed=55*Math.PI/180;p.spinRPM=-12;p.setBrakes(false);run(60);assert.ok(Math.abs(p.mainAngle)<=MAX_SWING_ANGLE+.001);assert.ok(p.gondolas.every(g=>Math.abs(g.velocity)<=18));p.setLift(0);run(90);assert.ok(p.lift<.001);
console.log('PASS: rigid lift carry without lateral ride lean; inversion-capable swing; signed rotation; independent gondolas; brakes; lowering; stability.');
