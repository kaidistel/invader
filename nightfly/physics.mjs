import './operations.mjs';
export const TAU=Math.PI*2, LIFT_ANGLE=-28*Math.PI/180;
export const RIDE_LIFT=1, MAX_LIFT=1, MAX_MAIN_RATE=88*Math.PI/180;
export const PROGRAMS={
  p30:{label:'30 %',kind:'swing',angle:55*Math.PI/180,power:.52},
  p50:{label:'50 %',kind:'swing',angle:95*Math.PI/180,power:.68},
  p80:{label:'80 %',kind:'swing',angle:152*Math.PI/180,power:.88},
  p100:{label:'100 %',kind:'rotate',angle:Math.PI,power:1},
  hold:{label:'180° HOLD',kind:'hold',angle:Math.PI,power:0},
  stop:{label:'STOP',kind:'stop',angle:0,power:0}
};
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const wrap=v=>Math.atan2(Math.sin(v),Math.cos(v));
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),mul=(a,s)=>a.map(v=>v*s),dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const rx=(v,a)=>[v[0],v[1]*Math.cos(a)-v[2]*Math.sin(a),v[1]*Math.sin(a)+v[2]*Math.cos(a)];
export const ry=(v,a)=>[v[0]*Math.cos(a)+v[2]*Math.sin(a),v[1],-v[0]*Math.sin(a)+v[2]*Math.cos(a)];
export const rz=(v,a)=>[v[0]*Math.cos(a)-v[1]*Math.sin(a),v[0]*Math.sin(a)+v[1]*Math.cos(a),v[2]];
const approach=(a,b,step)=>a+clamp(b-a,-step,step);
const sgn=v=>v<0?-1:v>0?1:0;

export class RidePhysics{
 constructor(origins){this.origins=origins;this.reset();}
 reset(){
  this.lift=0;this.liftVelocity=0;this.liftTarget=0;
  this.mainAngle=0;this.mainVelocity=0;this.mainAccel=0;this.motorTorque=0;
  this.spinAngle=0;this.spinVelocity=0;this.spinAccel=0;
  this.swingEnvelope=0;this.program='stop';this.rotating=false;
  this.loopDirection=1;this.loopProgress=0;this.loopStage='idle';
  this.spinOn=false;this.spinRPM=12;this.parking=false;this.afterPark=0;this.time=0;
  this.gondolas=Array.from({length:4},()=>({angle:0,velocity:0,brake:true,previous:null,prevVelocity:[0,0,0],acc:[0,0,0]}));
 }
 get canDrive(){return this.lift>RIDE_LIFT-.035&&!this.parking;}
 get swingOn(){return this.program!=='stop';}
 get programSpec(){return PROGRAMS[this.program]||PROGRAMS.stop;}
 setProgram(name){
  if(!PROGRAMS[name])return false;
  if(name!=='stop'&&!this.canDrive)return false;
  this.program=name;this.rotating=false;this.swingEnvelope=Math.abs(wrap(this.mainAngle));
  if(name==='p100'){
   this.loopDirection=Math.abs(this.mainVelocity)>.12?sgn(this.mainVelocity):1;
   this.loopProgress=0;this.loopStage='accelerating';
  }else this.loopStage='idle';
  return true;
 }
 setLift(target){
  target=clamp(target,0,MAX_LIFT);
  if(target<RIDE_LIFT-.035&&(this.program!=='stop'||this.spinOn||Math.abs(wrap(this.mainAngle))>.015||Math.abs(wrap(this.spinAngle))>.015||this.gondolas.some(g=>Math.abs(wrap(g.angle))>.025))){
   this.parking=true;this.afterPark=target;this.program='stop';this.rotating=false;this.loopStage='idle';this.spinOn=false;
  }else{this.liftTarget=target;this.parking=false;}
 }
 setSpin(on){if(on&&!this.canDrive)return false;this.spinOn=on;return true;}
 setBrakes(brake){if(this.parking)return;for(const g of this.gondolas)g.brake=brake;}
 liftAngle(){return LIFT_ANGLE*this.lift;}
 pivot(){return add(this.origins.lift,rx(sub(this.origins.rotor,this.origins.lift),this.liftAngle()));}
 support(k){const local=sub(this.origins['gondola'+k],this.origins.crown),arm=add(sub(this.origins.crown,this.origins.rotor),rz(local,this.spinAngle));return add(this.pivot(),rx(ry(arm,this.mainAngle),this.liftAngle()));}
 _mainDrive(dt){
  const spec=this.programSpec,a=wrap(this.mainAngle),w=this.mainVelocity;
  const gravity=-1.55*Math.sin(a),drag=-.11*w-.025*w*Math.abs(w);let motor=0;
  if(this.parking||spec.kind==='stop'){
    this.rotating=false;this.loopStage='idle';motor=clamp(-2.9*a-2.35*w,-2.8,2.8);
  }else if(spec.kind==='hold'){
    this.rotating=false;this.loopStage='idle';const target=Math.PI+Math.round((this.mainAngle-Math.PI)/TAU)*TAU;motor=clamp((target-this.mainAngle)*4.6-w*2.7-gravity,-3.5,3.5);
  }else if(spec.kind==='swing'){
    this.rotating=false;this.loopStage='idle';const target=spec.angle,amp=Math.max(Math.abs(a),this.swingEnvelope*.985);this.swingEnvelope=approach(this.swingEnvelope,Math.abs(a),1.4*dt);
    const lower=Math.max(0,1-Math.abs(a)/(Math.PI*.72));const need=clamp((target-amp)/(25*Math.PI/180),-1,1);motor=sgn(w||Math.sin(a)||1)*spec.power*2.25*lower*need;
    if(amp>target)motor+=-sgn(w)*clamp((amp-target)*2.7,0,1.2);
  }else if(spec.kind==='rotate'){
    const dir=this.loopDirection||1,desired=66*Math.PI/180*dir;
    this.loopProgress+=Math.abs(w)*dt;
    if(!this.rotating){
      this.loopStage='accelerating';
      const launchSpeed=52*Math.PI/180;
      const speedNeed=clamp((launchSpeed-Math.abs(w))/(launchSpeed*.72),0,1);
      const launchPush=1.15+.95*speedNeed;
      motor=clamp(-gravity-drag+dir*launchPush,-3.5,3.5);
      if(Math.abs(w)>48*Math.PI/180&&this.loopProgress>Math.PI*.55){this.rotating=true;this.loopStage='continuous';}
    }else{
      this.loopStage='continuous';
      const speedError=desired-w;
      motor=clamp(-gravity-drag+speedError*2.15,-3.65,3.65);
      if(w*dir<18*Math.PI/180){
        motor=clamp(-gravity-drag+dir*2.45,-3.65,3.65);
      }
    }
  }
  this.motorTorque=motor;return clamp(gravity+drag+motor,-4.4,4.4);
 }
 step(dt){
  this.time+=dt;
  const desiredLift=clamp((this.liftTarget-this.lift)*1.9,-.18,.18);this.liftVelocity=approach(this.liftVelocity,desiredLift,.30*dt);this.lift=clamp(this.lift+this.liftVelocity*dt,0,MAX_LIFT);
  if(Math.abs(this.liftTarget-this.lift)<.0002&&Math.abs(this.liftVelocity)<.002){this.lift=this.liftTarget;this.liftVelocity=0;}
  if(this.program!=='stop'&&!this.canDrive){this.program='stop';this.rotating=false;this.loopStage='idle';}if(this.spinOn&&!this.canDrive)this.spinOn=false;
  const prevMain=this.mainVelocity;this.mainAccel=this._mainDrive(dt);this.mainVelocity=clamp(this.mainVelocity+this.mainAccel*dt,-MAX_MAIN_RATE,MAX_MAIN_RATE);this.mainAngle+=this.mainVelocity*dt;if(Math.abs(this.mainAngle)>TAU*20)this.mainAngle=wrap(this.mainAngle);this.mainAccel=(this.mainVelocity-prevMain)/dt;this.swingEnvelope=Math.max(this.swingEnvelope*.9992,Math.abs(wrap(this.mainAngle)));
  let wantSpin=this.spinOn?this.spinRPM*TAU/60:0;if(this.parking)wantSpin=clamp(-wrap(this.spinAngle)*1.7,-.8,.8);
  const prevSpin=this.spinVelocity;this.spinVelocity=approach(this.spinVelocity,wantSpin,.42*dt);this.spinAngle+=this.spinVelocity*dt;this.spinAccel=(this.spinVelocity-prevSpin)/dt;
  const liftA=this.liftAngle(),mainAxis=rx([0,1,0],liftA),mainOmega=mul(mainAxis,this.mainVelocity),mainAlpha=mul(mainAxis,this.mainAccel);
  const axisSpin=rx(ry([0,0,this.spinVelocity],this.mainAngle),liftA),spinAlpha=rx(ry([0,0,this.spinAccel],this.mainAngle),liftA),omega=add(mainOmega,axisSpin),alpha=add(add(mainAlpha,spinAlpha),cross(mainOmega,axisSpin));
  for(let k=0;k<4;k++){
   const g=this.gondolas[k],p=this.support(k);let velocity=[0,0,0];
   if(g.previous){velocity=mul(sub(p,g.previous),1/dt);const raw=mul(sub(velocity,g.prevVelocity),1/dt);g.acc=add(mul(g.acc,.78),mul(raw,.22));}g.previous=p;g.prevVelocity=velocity;
   if(this.parking){const aa=clamp(-wrap(g.angle)*14-g.velocity*7,-15,15);g.velocity+=aa*dt;g.angle+=g.velocity*dt;continue;}
   if(g.brake){const aa=clamp(-wrap(g.angle)*18-g.velocity*8,-18,18);g.velocity+=aa*dt;g.angle+=g.velocity*dt;continue;}
   const t=k*Math.PI/2,hinge=rx(ry(rz([-Math.sin(t),Math.cos(t),0],this.spinAngle),this.mainAngle),liftA),down=rx(ry([0,0,-1],this.mainAngle),liftA),side=cross(hinge,down),length=.68;
   const r=mul(add(mul(down,Math.cos(g.angle)),mul(side,Math.sin(g.angle))),length),rq=cross(hinge,r),inertial=add(add(cross(alpha,r),cross(omega,cross(omega,r))),mul(cross(omega,rq),2*g.velocity)),effective=sub(sub([0,0,-9.81],g.acc),inertial);
   const acceleration=clamp(dot(rq,effective)/(length*length)-.42*g.velocity,-70,70);g.velocity=clamp(g.velocity+acceleration*dt,-13,13);g.angle+=g.velocity*dt;if(Math.abs(g.angle)>Math.PI*20)g.angle=wrap(g.angle);
  }
  if(this.parking&&Math.abs(wrap(this.mainAngle))<.008&&Math.abs(this.mainVelocity)<.014&&Math.abs(wrap(this.spinAngle))<.008&&Math.abs(this.spinVelocity)<.014&&this.gondolas.every(g=>Math.abs(wrap(g.angle))<.012&&Math.abs(g.velocity)<.02)){
   this.mainAngle=0;this.mainVelocity=0;this.spinAngle=0;this.spinVelocity=0;for(const g of this.gondolas){g.angle=0;g.velocity=0;g.brake=true;}this.parking=false;this.liftTarget=this.afterPark;
  }
 }
}
