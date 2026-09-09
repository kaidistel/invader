// Z-up articulated Pegasus 16 model. Fixed timestep; simplified ride dynamics.
export const TAU=Math.PI*2, LIFT_ANGLE=-28*Math.PI/180;
export const RIDE_LIFT=1, MAX_LIFT=1, MAX_MAIN_RATE=74*Math.PI/180;
export const PROGRAMS={
  p30:{label:'30 %',kind:'swing',angle:55*Math.PI/180,rate:18*Math.PI/180},
  p50:{label:'50 %',kind:'swing',angle:92*Math.PI/180,rate:21*Math.PI/180},
  p80:{label:'80 %',kind:'swing',angle:150*Math.PI/180,rate:25*Math.PI/180},
  p100:{label:'100 %',kind:'rotate',angle:170*Math.PI/180,rate:60*Math.PI/180},
  hold:{label:'180° HOLD',kind:'hold',angle:Math.PI,rate:0},
  stop:{label:'STOP',kind:'stop',angle:0,rate:0}
};
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
 reset(){
  this.lift=0;this.liftVelocity=0;this.liftTarget=0;
  this.mainAngle=0;this.mainVelocity=0;this.mainAccel=0;
  this.spinAngle=0;this.spinVelocity=0;this.spinAccel=0;
  this.phase=0;this.swingEnvelope=0;this.program='stop';this.rotating=false;
  this.spinOn=false;this.spinRPM=12;this.parking=false;this.afterPark=0;this.time=0;
  this.gondolas=Array.from({length:4},()=>({angle:0,velocity:0,brake:true,previous:null,prevVelocity:[0,0,0],acc:[0,0,0]}));
 }
 get canDrive(){return this.lift>RIDE_LIFT-.035&&!this.parking;}
 get swingOn(){return this.program!=='stop';}
 get programSpec(){return PROGRAMS[this.program]||PROGRAMS.stop;}
 setProgram(name){
  if(!PROGRAMS[name])return false;
  if(name!=='stop'&&!this.canDrive)return false;
  this.program=name;this.rotating=false;
  if(name==='stop'){this.swingEnvelope=0;return true;}
  const spec=PROGRAMS[name];
  if(spec.kind==='swing'){this.swingEnvelope=Math.min(Math.abs(wrap(this.mainAngle)),spec.angle);this.phase=0;}
  if(spec.kind==='rotate'){this.swingEnvelope=Math.min(Math.abs(wrap(this.mainAngle)),155*Math.PI/180);this.phase=0;}
  return true;
 }
 setLift(target){
  target=clamp(target,0,MAX_LIFT);
  if(target<RIDE_LIFT-.035&&(this.program!=='stop'||this.spinOn||Math.abs(wrap(this.mainAngle))>.015||Math.abs(wrap(this.spinAngle))>.015||this.gondolas.some(g=>Math.abs(wrap(g.angle))>.025))){
   this.parking=true;this.afterPark=target;this.program='stop';this.rotating=false;this.spinOn=false;
  }else{this.liftTarget=target;this.parking=false;}
 }
 setSpin(on){if(on&&!this.canDrive)return false;this.spinOn=on;return true;}
 setBrakes(brake){if(this.parking)return;for(const g of this.gondolas)g.brake=brake;}
 liftAngle(){return LIFT_ANGLE*this.lift;}
 pivot(){return add(this.origins.lift,rx(sub(this.origins.rotor,this.origins.lift),this.liftAngle()));}
 support(k){const local=sub(this.origins['gondola'+k],this.origins.crown),arm=add(sub(this.origins.crown,this.origins.rotor),rz(local,this.spinAngle));return add(this.pivot(),rx(ry(arm,this.mainAngle),this.liftAngle()));}
 step(dt){
  this.time+=dt;
  const desiredLift=clamp((this.liftTarget-this.lift)*1.9,-.18,.18);this.liftVelocity=approach(this.liftVelocity,desiredLift,.30*dt);this.lift=clamp(this.lift+this.liftVelocity*dt,0,MAX_LIFT);
  if(Math.abs(this.liftTarget-this.lift)<.0002&&Math.abs(this.liftVelocity)<.002){this.lift=this.liftTarget;this.liftVelocity=0;}
  if(this.program!=='stop'&&!this.canDrive){this.program='stop';this.rotating=false;}if(this.spinOn&&!this.canDrive)this.spinOn=false;

  const spec=this.programSpec,prevMain=this.mainVelocity;
  if(this.parking||spec.kind==='stop'){
   this.rotating=false;this.swingEnvelope=approach(this.swingEnvelope,0,32*Math.PI/180*dt);
   this.mainAccel=clamp(-wrap(this.mainAngle)*8.5-this.mainVelocity*5.8,-4.2,4.2);
  }else if(spec.kind==='hold'){
   this.rotating=false;
   const holdTarget=Math.PI+Math.round((this.mainAngle-Math.PI)/TAU)*TAU;
   this.mainAccel=clamp((holdTarget-this.mainAngle)*7.8-this.mainVelocity*5.6,-4.6,4.6);
  }else if(spec.kind==='swing'){
   this.rotating=false;this.swingEnvelope=approach(this.swingEnvelope,spec.angle,20*Math.PI/180*dt);
   this.phase+=dt*spec.rate/Math.max(.22,this.swingEnvelope);
   const target=this.swingEnvelope*Math.sin(this.phase);
   this.mainAccel=clamp((target-this.mainAngle)*9-this.mainVelocity*4.8,-4.0,4.0);
  }else if(spec.kind==='rotate'){
   if(!this.rotating){
    // First build a large real swing; only then hand over to continuous rotation.
    const pumpLimit=168*Math.PI/180;this.swingEnvelope=approach(this.swingEnvelope,pumpLimit,20*Math.PI/180*dt);
    this.phase+=dt*(25*Math.PI/180)/Math.max(.25,this.swingEnvelope);
    const target=this.swingEnvelope*Math.sin(this.phase);
    this.mainAccel=clamp((target-this.mainAngle)*9-this.mainVelocity*4.4,-4.6,4.6);
    if(wrap(this.mainAngle)>145*Math.PI/180&&this.mainVelocity>20*Math.PI/180&&this.swingEnvelope>158*Math.PI/180){
      this.rotating=true;this.mainVelocity=Math.max(this.mainVelocity,50*Math.PI/180);
    }
   }else{
    // 100 % is intentionally a continuous full-rotation programme. Gravity still
    // modulates the speed, while the drive keeps enough energy to avoid stalling.
    const a=wrap(this.mainAngle),gravity=-1.05*Math.sin(a);
    const desired=60*Math.PI/180,topAssist=Math.abs(a)>130*Math.PI/180?.50:0;
    const motor=clamp((desired-this.mainVelocity)*.95+topAssist,-.75,1.20);
    this.mainAccel=clamp(gravity+motor-.08*this.mainVelocity,-2.2,2.2);
   }
  }
  this.mainVelocity=clamp(this.mainVelocity+this.mainAccel*dt,-MAX_MAIN_RATE,MAX_MAIN_RATE);
  if(this.rotating&&this.mainVelocity<38*Math.PI/180)this.mainVelocity=38*Math.PI/180;
  this.mainAngle+=this.mainVelocity*dt;this.mainAccel=(this.mainVelocity-prevMain)/dt;
  if(Math.abs(this.mainAngle)>TAU*20)this.mainAngle=wrap(this.mainAngle);

  let wantSpin=this.spinOn?this.spinRPM*TAU/60:0;if(this.parking)wantSpin=clamp(-wrap(this.spinAngle)*1.7,-.8,.8);
  const prevSpin=this.spinVelocity;this.spinVelocity=approach(this.spinVelocity,wantSpin,.42*dt);this.spinAngle+=this.spinVelocity*dt;this.spinAccel=(this.spinVelocity-prevSpin)/dt;
  const liftA=this.liftAngle(),mainAxis=rx([0,1,0],liftA),mainOmega=mul(mainAxis,this.mainVelocity),mainAlpha=mul(mainAxis,this.mainAccel);
  const axisSpin=rx(ry([0,0,this.spinVelocity],this.mainAngle),liftA),spinAlpha=rx(ry([0,0,this.spinAccel],this.mainAngle),liftA),omega=add(mainOmega,axisSpin),alpha=add(add(mainAlpha,spinAlpha),cross(mainOmega,axisSpin));
  for(let k=0;k<4;k++){
   const g=this.gondolas[k],p=this.support(k);let velocity=[0,0,0];
   if(g.previous){velocity=mul(sub(p,g.previous),1/dt);const raw=mul(sub(velocity,g.prevVelocity),1/dt);g.acc=add(mul(g.acc,.65),mul(raw,.35));}g.previous=p;g.prevVelocity=velocity;
   if(this.parking){const aa=clamp(-wrap(g.angle)*14-g.velocity*7,-15,15);g.velocity+=aa*dt;g.angle+=g.velocity*dt;continue;}
   if(g.brake){g.velocity=approach(g.velocity,0,24*dt);g.angle+=g.velocity*dt;continue;}
   const t=k*Math.PI/2,hinge=rx(ry(rz([-Math.sin(t),Math.cos(t),0],this.spinAngle),this.mainAngle),liftA),down=rx(ry([0,0,-1],this.mainAngle),liftA),side=cross(hinge,down),length=.62;
   const r=mul(add(mul(down,Math.cos(g.angle)),mul(side,Math.sin(g.angle))),length),rq=cross(hinge,r),inertial=add(add(cross(alpha,r),cross(omega,cross(omega,r))),mul(cross(omega,rq),2*g.velocity)),effective=sub(sub([0,0,-9.81],g.acc),inertial);
   const acceleration=clamp(dot(rq,effective)/(length*length)-.28*g.velocity,-90,90);g.velocity=clamp(g.velocity+acceleration*dt,-18,18);g.angle+=g.velocity*dt;if(Math.abs(g.angle)>Math.PI*20)g.angle=wrap(g.angle);
  }
  if(this.parking&&Math.abs(wrap(this.mainAngle))<.008&&Math.abs(this.mainVelocity)<.014&&Math.abs(wrap(this.spinAngle))<.008&&Math.abs(this.spinVelocity)<.014&&this.gondolas.every(g=>Math.abs(wrap(g.angle))<.012&&Math.abs(g.velocity)<.02)){
   this.mainAngle=0;this.mainVelocity=0;this.spinAngle=0;this.spinVelocity=0;for(const g of this.gondolas){g.angle=0;g.velocity=0;g.brake=true;}this.parking=false;this.liftTarget=this.afterPark;
  }
 }
}
