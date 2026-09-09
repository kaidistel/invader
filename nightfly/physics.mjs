// Z-up articulated ride model. Fixed timestep; simplified rigid pendulum dynamics.
export const TAU=Math.PI*2, LIFT_ANGLE=-28*Math.PI/180;
// In the real ride pose the lift reaches its normal operating position, while
// the powered swing axis holds the long passenger arm visibly off vertical.
export const RIDE_LIFT=1, MAX_LIFT=1, RIDE_HANG=24*Math.PI/180, MAX_SIDE_ANGLE=86*Math.PI/180;
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const wrap=v=>Math.atan2(Math.sin(v),Math.cos(v));
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),mul=(a,s)=>a.map(v=>v*s),dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const rx=(v,a)=>[v[0],v[1]*Math.cos(a)-v[2]*Math.sin(a),v[1]*Math.sin(a)+v[2]*Math.cos(a)];
export const ry=(v,a)=>[v[0]*Math.cos(a)+v[2]*Math.sin(a),v[1],-v[0]*Math.sin(a)+v[2]*Math.cos(a)];
export const rz=(v,a)=>[v[0]*Math.cos(a)-v[1]*Math.sin(a),v[0]*Math.sin(a)+v[1]*Math.cos(a),v[2]];
const approach=(a,b,step)=>a+clamp(b-a,-step,step);
export class RidePhysics{
 constructor(origins){this.origins=origins;this.reset();}
 reset(){this.lift=0;this.liftVelocity=0;this.liftTarget=0;this.mainAngle=0;this.mainVelocity=0;this.mainAccel=0;this.spinAngle=0;this.spinVelocity=0;this.spinAccel=0;this.phase=0;this.swingOn=false;this.spinOn=false;this.amplitude=78*Math.PI/180;this.swingSpeed=20*Math.PI/180;this.spinRPM=6;this.parking=false;this.afterPark=0;this.time=0;this.gondolas=Array.from({length:4},()=>({angle:0,velocity:0,brake:true,previous:null,prevVelocity:[0,0,0],acc:[0,0,0]}));}
 get canDrive(){return this.lift>RIDE_LIFT-.035&&!this.parking;}
 get safeAmplitude(){return MAX_SIDE_ANGLE;}
 setLift(target){target=clamp(target,0,MAX_LIFT);if(target<RIDE_LIFT-.035&&(this.swingOn||this.spinOn||Math.abs(this.mainAngle)>.015||Math.abs(wrap(this.spinAngle))>.015||this.gondolas.some(g=>Math.abs(wrap(g.angle))>.025))){this.parking=true;this.afterPark=target;this.swingOn=false;this.spinOn=false;}else{this.liftTarget=target;this.parking=false;}}
 setSwing(on){if(on&&!this.canDrive)return false;this.swingOn=on;if(on){const amplitude=Math.max(.001,Math.min(Math.abs(this.amplitude),this.safeAmplitude));this.phase=Math.asin(clamp(RIDE_HANG/amplitude,-1,1));}return true;}
 setSpin(on){if(on&&!this.canDrive)return false;this.spinOn=on;return true;}
 setBrakes(brake){if(this.parking)return;for(const g of this.gondolas)g.brake=brake;}
 pivot(){return add(this.origins.lift,rx(sub(this.origins.rotor,this.origins.lift),LIFT_ANGLE*this.lift));}
 support(k){const local=sub(this.origins['gondola'+k],this.origins.crown);return add(this.pivot(),ry(add(sub(this.origins.crown,this.origins.rotor),rz(local,this.spinAngle)),this.mainAngle));}
 step(dt){
  this.time+=dt;
  const desiredLift=clamp((this.liftTarget-this.lift)*1.9,-.18,.18);this.liftVelocity=approach(this.liftVelocity,desiredLift,.30*dt);this.lift=clamp(this.lift+this.liftVelocity*dt,0,MAX_LIFT);
  if(Math.abs(this.liftTarget-this.lift)<.0002&&Math.abs(this.liftVelocity)<.002){this.lift=this.liftTarget;this.liftVelocity=0;}
  if(this.swingOn&&!this.canDrive)this.swingOn=false;if(this.spinOn&&!this.canDrive)this.spinOn=false;
  if(this.swingOn)this.phase+=dt*this.swingSpeed/Math.max(.1,Math.min(this.amplitude,this.safeAmplitude));
  const amplitude=Math.min(Math.abs(this.amplitude),this.safeAmplitude);
  // Loading/parking is neutral for clearance. In ride position the swing axis is
  // held at RIDE_HANG; only an active swing command releases it into oscillation.
  const target=this.parking?0:(this.canDrive?(this.swingOn?amplitude*Math.sin(this.phase):RIDE_HANG):0);
  const prevMain=this.mainVelocity;this.mainAccel=clamp((target-this.mainAngle)*10-this.mainVelocity*6,-1.9,1.9);this.mainVelocity+=this.mainAccel*dt;this.mainAngle+=this.mainVelocity*dt;this.mainAccel=(this.mainVelocity-prevMain)/dt;
  if(!this.parking&&this.canDrive){const bounded=clamp(this.mainAngle,-MAX_SIDE_ANGLE,MAX_SIDE_ANGLE);if(bounded!==this.mainAngle){this.mainAngle=bounded;this.mainVelocity=0;}}
  let wantSpin=this.spinOn?this.spinRPM*TAU/60:0;if(this.parking)wantSpin=clamp(-wrap(this.spinAngle)*1.7,-.8,.8);
  const prevSpin=this.spinVelocity;this.spinVelocity=approach(this.spinVelocity,wantSpin,.42*dt);this.spinAngle+=this.spinVelocity*dt;this.spinAccel=(this.spinVelocity-prevSpin)/dt;
  const axisSpin=ry([0,0,this.spinVelocity],this.mainAngle);const omega=add([0,this.mainVelocity,0],axisSpin);const alpha=add(add([0,this.mainAccel,0],ry([0,0,this.spinAccel],this.mainAngle)),cross([0,this.mainVelocity,0],axisSpin));
  for(let k=0;k<4;k++){
   const g=this.gondolas[k],p=this.support(k);let velocity=[0,0,0];
   if(g.previous){velocity=mul(sub(p,g.previous),1/dt);const raw=mul(sub(velocity,g.prevVelocity),1/dt);g.acc=add(mul(g.acc,.65),mul(raw,.35));}g.previous=p;g.prevVelocity=velocity;
   if(this.parking){const a=clamp(-wrap(g.angle)*14-g.velocity*7,-15,15);g.velocity+=a*dt;g.angle+=g.velocity*dt;continue;}
   if(g.brake){g.velocity=approach(g.velocity,0,24*dt);g.angle+=g.velocity*dt;continue;}
   const t=k*Math.PI/2,hinge=ry(rz([-Math.sin(t),Math.cos(t),0],this.spinAngle),this.mainAngle);
   const down=ry([0,0,-1],this.mainAngle),side=cross(hinge,down),length=.62;
   const r=mul(add(mul(down,Math.cos(g.angle)),mul(side,Math.sin(g.angle))),length),rq=cross(hinge,r);
   const inertial=add(add(cross(alpha,r),cross(omega,cross(omega,r))),mul(cross(omega,rq),2*g.velocity));
   const effective=sub(sub([0,0,-9.81],g.acc),inertial);
   const acceleration=clamp(dot(rq,effective)/(length*length)-.28*g.velocity,-90,90);
   g.velocity=clamp(g.velocity+acceleration*dt,-18,18);g.angle+=g.velocity*dt;if(Math.abs(g.angle)>Math.PI*20)g.angle=wrap(g.angle);
  }
  if(this.parking&&Math.abs(this.mainAngle)<.008&&Math.abs(this.mainVelocity)<.014&&Math.abs(wrap(this.spinAngle))<.008&&Math.abs(this.spinVelocity)<.014&&this.gondolas.every(g=>Math.abs(wrap(g.angle))<.012&&Math.abs(g.velocity)<.02)){
   this.mainAngle=0;this.mainVelocity=0;this.spinAngle=0;this.spinVelocity=0;for(const g of this.gondolas){g.angle=0;g.velocity=0;g.brake=true;}this.parking=false;this.liftTarget=this.afterPark;
  }
 }
}
