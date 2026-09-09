import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {RidePhysics,wrap,MAX_SIDE_ANGLE,RIDE_LIFT,MAX_LIFT} from '../physics.mjs';
const model=JSON.parse(gunzipSync(readFileSync(new URL('../assets/nightfly.json.gz',import.meta.url))));
const p=new RidePhysics(model.origins),step=1/120;
function run(seconds){for(let t=0;t<seconds;t+=step){p.step(step);assert.ok([p.lift,p.mainAngle,p.spinAngle,...p.gondolas.flatMap(g=>[g.angle,g.velocity])].every(Number.isFinite),'nonfinite state');}}
const heights=[0,1,2,3].map(k=>model.origins['gondola'+k][2]);assert.ok(heights.every(h=>Math.abs(h-heights[0])<1e-10));assert.ok(model.hinges.every(h=>h[2]===0));
assert.equal(p.setSwing(true),false);assert.equal(p.setSpin(true),false);run(2);assert.ok(p.gondolas.every(g=>g.angle===0));
p.setLift(RIDE_LIFT);run(10);assert.ok(p.canDrive);assert.ok(Math.abs(p.lift-RIDE_LIFT)<.001);assert.ok(p.lift<1,'ride lift must remain visibly short of full stroke');assert.ok(p.pivot()[2]>9.5);assert.ok(Math.abs(p.mainAngle)<.01,'powered arm should be neutral when swing is off');
assert.ok(p.setSwing(true));assert.ok(p.setSpin(true));p.setBrakes(false);run(18);assert.ok(Math.abs(p.mainAngle)>.05);assert.ok(Math.abs(p.mainAngle)<=MAX_SIDE_ANGLE+.001);assert.ok(Math.abs(p.spinAngle)>1);assert.ok(p.gondolas.some(g=>Math.abs(g.angle)>.1));assert.ok(new Set(p.gondolas.map(g=>g.angle.toFixed(2))).size>1);
p.setBrakes(true);run(1);const locked=p.gondolas.map(g=>g.angle);run(3);p.gondolas.forEach((g,k)=>assert.ok(Math.abs(g.angle-locked[k])<1e-10));
p.gondolas[2].brake=false;run(3);assert.ok(Math.abs(p.gondolas[2].angle-locked[2])>.01);assert.equal(p.gondolas[0].angle,locked[0]);
p.setLift(0);assert.ok(p.parking);run(60);assert.equal(p.parking,false);assert.ok(p.lift<.001);assert.ok(Math.abs(p.mainAngle)<.001);assert.ok(Math.abs(wrap(p.spinAngle))<.001);assert.ok(p.gondolas.every(g=>g.brake&&Math.abs(g.angle)<.001));
p.reset();p.setLift(1);run(10);assert.ok(p.lift<=MAX_LIFT+.001);p.setSwing(true);p.setSpin(true);p.amplitude=130*Math.PI/180;p.swingSpeed=40*Math.PI/180;p.spinRPM=-12;p.setBrakes(false);run(60);assert.ok(Math.abs(p.mainAngle)<=MAX_SIDE_ANGLE+.001);assert.ok(p.gondolas.every(g=>Math.abs(g.velocity)<=18));p.setLift(0);run(70);assert.ok(p.lift<.001&&!p.parking);
console.log('PASS: level hinges; loading interlock; photo-referenced inclined lift ride pose; side-swing envelope; signed rotation; 4 independent free gondolas; collective/individual brakes; automatic parking; extreme-control stability.');
console.log('Model:',model.meshes.length,'parts;',model.origins);
const THREE=await import('../vendor/three.module.js');
const {LIFT_ANGLE}=await import('../physics.mjs');
const lift=new THREE.Group(),rotor=new THREE.Group(),crown=new THREE.Group();lift.position.fromArray(model.origins.lift);rotor.position.fromArray(model.origins.rotor).sub(lift.position);crown.position.fromArray(model.origins.crown).sub(new THREE.Vector3(...model.origins.rotor));lift.add(rotor);rotor.add(crown);
p.reset();p.setLift(RIDE_LIFT);run(10);p.setSwing(true);p.setSpin(true);p.setBrakes(false);run(5);
const liftAngle=LIFT_ANGLE*p.lift;lift.rotation.x=liftAngle;
const parentQ=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),liftAngle);
const desiredQ=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),p.mainAngle);
rotor.quaternion.copy(parentQ.invert().multiply(desiredQ));crown.rotation.z=p.spinAngle;lift.updateMatrixWorld(true);
for(let k=0;k<4;k++){const actual=new THREE.Vector3(...model.origins['gondola'+k]).sub(new THREE.Vector3(...model.origins.crown)).applyMatrix4(crown.matrixWorld);assert.ok(actual.distanceTo(new THREE.Vector3(...p.support(k)))<1e-10);}
console.log('PASS: Three.js articulated transforms exactly match all four simulated hinge positions with world-Y side swing.');
