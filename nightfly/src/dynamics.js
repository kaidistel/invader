export const TAU=Math.PI*2;
export const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
export const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
export const approach=(v,t,d)=>v+clamp(t-v,-d,d);
export const PHYSICS={
 armGravity:.72, armMotorJerk:.20, armDriveAcceleration:.22,
 armHoldAcceleration:.28, armMaxSpeed:1.15,
 rotorAcceleration:.8, rotorJerk:.8,
 gondolaCOM:.22, gondolaInertia:.62,
 gondolaDamping:.72, gondolaQuadraticDrag:.20, gondolaMaxSpeed:2.4
};
export class RideState {
 constructor(){this.reset();}
 reset(){this.lift=0;this.liftTarget=0;this.rpm=0;this.rpmTarget=0;this.rpmAccel=0;this.rotor=0;this.arm=0;this.armSpeed=0;this.motor=0;this.mode='hold';this.hold=0;this.power=.65;this.manual=0;this.parking=false;this.estopped=false;this.paused=false;this.time=0;this.gondolasIndexed=true;this.gondolasSecured=true;this.restraints=0;this.restraintTarget=0;}
 get restraintsLocked(){return this.restraints===0&&this.restraintTarget===0;}
 get canOpenRestraints(){return this.lift<.001&&this.liftTarget===0&&!this.parking&&Math.abs(this.rpm)<.01&&Math.abs(this.armSpeed)<.015&&Math.abs(wrap(this.arm))<.008&&Math.abs(wrap(this.rotor))<.008&&this.gondolasIndexed&&this.gondolasSecured;}
 openRestraints(){if(!this.canOpenRestraints)return false;this.restraintTarget=1;return true;}
 closeRestraints(){this.restraintTarget=0;return true;}
 get ready(){return this.lift>.995&&!this.parking&&!this.estopped&&this.restraintsLocked;}
 raise(){if(!this.restraintsLocked)return false;this.liftTarget=1;this.parking=false;this.estopped=false;return true;}
 park(){this.parking=true;this.rpmTarget=0;this.mode='park';this.manual=0;this.estopped=false;}
 setRPM(v){if(!this.ready)return false;this.rpmTarget=clamp(Number(v)||0,-12,12);return true;}
 setMode(mode){if(!this.ready)return false;this.mode=mode;this.manual=0;
  if(mode==='hold')this.hold=this.arm+this.armSpeed*Math.abs(this.armSpeed)/(2*PHYSICS.armHoldAcceleration);
  return true;
 }
 stop(){this.estopped=true;this.rpmTarget=0;this.manual=0;this.mode='hold';this.hold=this.arm+this.armSpeed*Math.abs(this.armSpeed)/(2*.65);this.liftTarget=this.lift;this.parking=false;}
 step(dt){
  if(this.paused)return;
  this.time+=dt;
  this.restraints=approach(this.restraints,this.restraintTarget,dt/2.8);
  const target=this.ready?this.rpmTarget:0,limit=this.estopped?3:PHYSICS.rotorAcceleration;
  const desiredRPMAccel=clamp((target-this.rpm)*1.5,-limit,limit);
  this.rpmAccel=approach(this.rpmAccel,desiredRPMAccel,dt*(this.estopped?3:PHYSICS.rotorJerk));
  const nextRPM=this.rpm+this.rpmAccel*dt;
  if((target-this.rpm)*(target-nextRPM)<=0){this.rpm=target;this.rpmAccel=0;}else this.rpm=clamp(nextRPM,-12,12);
  if(Math.abs(target-this.rpm)<.001&&Math.abs(this.rpmAccel)<.01){this.rpm=target;this.rpmAccel=0;}
  this.rotor+=this.rpm*TAU/60*dt;
  const gravity=-PHYSICS.armGravity*Math.sin(this.arm);
  let desiredMotor=0;
  if(this.mode==='hold'||this.mode==='park'||this.estopped){
   const error=this.mode==='park'?-wrap(this.arm):this.hold-this.arm;
   const decel=this.estopped?.65:PHYSICS.armHoldAcceleration;
   const speedTarget=this.mode==='park'?clamp(error*.45,-.42,.42):0;
   desiredMotor=clamp((speedTarget-this.armSpeed)*1.2,-decel,decel);
  }else if(this.manual){
   desiredMotor=this.manual*(.25+this.power*.65);
  }else if(this.mode==='pendulum'){
   const amplitude=.30+this.power*1.2;
   const desiredEnergy=PHYSICS.armGravity*(1-Math.cos(amplitude));
   const energy=.5*this.armSpeed*this.armSpeed+PHYSICS.armGravity*(1-Math.cos(this.arm));
   const direction=Math.abs(this.armSpeed)>.00001?Math.sign(this.armSpeed):(this.arm<=0?1:-1);
   desiredMotor=clamp((desiredEnergy-energy)*.5,-.14,.14)*direction;
  }else if(this.mode==='left'||this.mode==='right'){
   const direction=this.mode==='left'?-1:1;
   const speedTarget=direction*(.30+this.power*.42);
   desiredMotor=clamp((speedTarget-this.armSpeed)*.8,-PHYSICS.armDriveAcceleration,PHYSICS.armDriveAcceleration);
  }
  this.motor=approach(this.motor,clamp(desiredMotor,-1.2,1.2),dt*(this.estopped?.7:PHYSICS.armMotorJerk));
  const servo=['hold','park','left','right'].includes(this.mode)||this.estopped;
  // Servo modes balance the gravitational load; only the commanded drive ramps.
  const acceleration=(servo?0:gravity)+this.motor-.055*this.armSpeed;
  if(this.lift<.995&&!this.parking&&!this.estopped){this.arm=0;this.armSpeed=0;this.motor=0;}
  else{this.armSpeed=clamp(this.armSpeed+acceleration*dt,-PHYSICS.armMaxSpeed,PHYSICS.armMaxSpeed);this.arm+=this.armSpeed*dt;}
  if(this.mode==='hold'&&Math.abs(this.armSpeed)<.0005){this.armSpeed=0;this.hold=this.arm;this.motor=0;}
  if(this.parking){
   const r=wrap(this.rotor);
   if(Math.abs(this.rpm)<.01)this.rotor+=clamp(-r,-.20*dt,.20*dt);
   if(this.gondolasIndexed&&Math.abs(wrap(this.arm))<.008&&Math.abs(this.armSpeed)<.015&&Math.abs(wrap(this.rotor))<.008&&Math.abs(this.rpm)<.01){
    this.arm=0;this.armSpeed=0;this.motor=0;this.rotor=0;this.liftTarget=0;
   }
  }
  this.lift=approach(this.lift,this.liftTarget,dt/9);
  if(this.parking&&this.lift<.0001){this.parking=false;this.mode='hold';this.hold=0;}
 }
}
export function integrateGondola(g,acceleration,dt){
 // Filter only high-frequency forcing; preserve continuous, unrestricted rotation.
 g.filteredAcceleration??=0;
 g.filteredAcceleration+=(clamp(acceleration,-8,8)-g.filteredAcceleration)*(1-Math.exp(-dt/.16));
 if(g.braked){g.speed=0;return;}
 const drag=PHYSICS.gondolaDamping*g.speed+PHYSICS.gondolaQuadraticDrag*Math.abs(g.speed)*g.speed;
 g.speed=clamp(g.speed+(g.filteredAcceleration-drag)*dt,-PHYSICS.gondolaMaxSpeed,PHYSICS.gondolaMaxSpeed);
 g.angle+=g.speed*dt;
}
