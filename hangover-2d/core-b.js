function startMove(target,duration,phase,stage,onDone){
  const from=state.height;
  state.segment={type:'move',from,target,duration,t:0,onDone};
  state.phase=phase;state.stage=stage;state.target=target;
}

function startDrop(label){
  state.segment={type:'drop'};state.phase='dropping';state.stage=label;state.velocity=0;state.target=null;
  flashDrop();whoosh();log(label+' freigegeben.');
}

function emergencyStop(){
  state.estop=true;state.clear=false;state.rotationDir=0;
  if(state.phase==='dropping'||state.phase==='braking'){
    state.stage='NOT-HALT · DROP LÄUFT IN BREMSE';
    log('NOT-HALT während Drop: Magnetbremszone bleibt wirksam.');
  }else{
    state.segment=null;state.velocity=0;setPhase('halted','NOT-HALT · STILLSTAND');log('NOT-HALT betätigt. Bewegung gestoppt.');
  }
  alarmFx();
}

function triggerMagic(){
  if(state.magic)return;
  state.magic=true;$('stage').classList.add('magic');buzzFx();log('Magic Fingers ausgelöst.');
  setTimeout(()=>{state.magic=false;$('stage').classList.remove('magic');},800);
}

function update(dt){
  dt=Math.min(.05,Math.max(0,dt));state.time+=dt;
  if(state.phase==='running'||state.phase==='dropping'||state.phase==='braking'||state.phase==='returning')state.rideTime+=dt;
  state.rotation+=state.rotationDir*state.rotationRpm*360/60*dt;

  if(['boot','boarding','locking','unloading'].includes(state.phase)){
    state.hold-=dt;
    if(state.hold<=0){
      if(state.phase==='boot'){setPhase('station','STATION BEREIT');log('Selbsttest abgeschlossen · Anlage bereit.');}
      else if(state.phase==='boarding'){state.loaded=Math.min(24,state.queue);state.queue-=state.loaded;setPhase('station','STATION BEREIT');log(state.loaded+' Fahrgäste sitzen. Tore schließen.');}
      else if(state.phase==='locking'){state.restraints=true;setPhase('station','STATION BEREIT');log('Bügelkreis geschlossen und verriegelt.');}
      else if(state.phase==='unloading'){state.served+=state.loaded;state.loaded=0;setPhase('station','STATION BEREIT');log('Gondel leer · bereit für nächsten Einlass.');}
    }
  }

  if(state.segment?.type==='move'){
    if(state.estop){state.segment=null;state.velocity=0;}
    else{
      const s=state.segment;s.t=Math.min(s.duration,s.t+dt);const p=smooth(s.t/s.duration);const prev=state.height;
      state.height=s.from+(s.target-s.from)*p;state.velocity=(state.height-prev)/dt;
      if(s.t>=s.duration){state.height=s.target;state.velocity=0;state.segment=null;const cb=s.onDone;if(cb)cb();}
    }
  }else if(state.segment?.type==='hold40'){
    state.velocity=0;state.hold-=dt;if(state.hold<=0){state.segment=null;startDrop('ERSTER FALL · 40 m');state.segment.afterHalf=true;}
  }else if(state.segment?.type==='holdTop'){
    state.velocity=0;state.hold-=dt;if(state.hold<=0){state.segment=null;startDrop('HAUPTDROP · TOP');state.segment.afterTop=true;}
  }

  if(state.phase==='dropping'&&state.segment?.type==='drop'){
    const prev=state.height;state.velocity=Math.max(-25,state.velocity-9.81*dt);state.height=Math.max(0,state.height+state.velocity*dt);
    const afterHalf=!!state.segment.afterHalf,afterTop=!!state.segment.afterTop;
    if(state.height<=BRAKE_TOP){state.phase='braking';state.stage='MAGNETBREMSE AKTIV';state.brakeReady=true;state.segment={type:'brake',afterHalf,afterTop};brakeFx();}
    if(Math.abs(prev-state.height)>.1&&Math.random()<.04)whooshTick();
  }else if(state.phase==='braking'&&state.segment?.type==='brake'){
    const s=state.segment;
    const decel=clamp(25+Math.abs(state.velocity)*1.15,25,47);state.velocity+=decel*dt;
    if(state.velocity>-2.2)state.velocity=-2.2;state.height=Math.max(5,state.height+state.velocity*dt);
    if(state.height<=7.5){state.height=7.5;state.velocity=0;
      if(state.estop){state.segment=null;setPhase('halted','NOT-HALT · IN BREMSZONE');}
      else if(s.afterHalf){state.segment=null;startMove(TOP_POS,12,'running','AUFFAHRT ZUR TOPPOSITION',()=>{state.hold=+$('topHold').value;state.segment={type:'holdTop'};state.stage='TOP HOLD';log('Topposition erreicht · Hauptdrop bereit.');});}
      else if(s.afterTop){state.segment=null;startMove(0,7,'returning','RÜCKFAHRT ZUR STATION',finishRide);}
      else{state.segment=null;startMove(0,7,'returning','RÜCKFAHRT ZUR STATION',()=>{setPhase('station','STATION BEREIT');state.clear=false;});}
    }
  }

  if(state.mode==='manual'&&state.manualHold!==0&&!state.estop&&state.power&&state.loaded>0&&!state.gatesOpen&&state.restraints){
    if(!['dropping','braking'].includes(state.phase)){
      state.phase='manual';state.stage=state.manualHold>0?'MANUELL AUF':'MANUELL AB';state.segment=null;
      const speed=state.manualHold>0?4.2:-3.2;const prev=state.height;state.height=clamp(state.height+speed*dt,0,TOP_POS);state.velocity=(state.height-prev)/dt;
      if(state.height===0||state.height===TOP_POS)state.velocity=0;
    }
  }else if(state.phase==='manual'&&!state.segment){state.velocity=0;if(atStation()){state.phase='station';state.stage='STATION BEREIT';}else state.stage='MANUELL · HALT';}

  renderFast();
}

function finishRide(){
  state.height=0;state.velocity=0;state.rotationDir=0;state.rides++;state.clear=false;setPhase('station','FAHRT BEENDET');log('Fahrt beendet. Bügel öffnen, Tore öffnen und Auslass starten.');
}

function hint(){
  if(state.estop)return state.phase==='dropping'||state.phase==='braking'?'Drop läuft bis in die Magnetbremse. Danach Not-Halt entriegeln.':'Not-Halt entriegeln. Danach Rückholung oder Störung quittieren.';
  if(!state.power)return 'Hauptschalter einschalten.';
  if(state.phase==='boot')return 'Selbsttest läuft.';
  if(state.phase==='boarding')return 'Einlass läuft.';
  if(state.phase==='locking')return 'Bügel werden verriegelt.';
  if(state.phase==='unloading')return 'Auslass läuft.';
  if(moving())return state.stage+'.';
  if(state.loaded===0)return 'Einlass starten.';
  if(state.gatesOpen)return 'Stationstore schließen.';
  if(!state.restraints)return 'Schoßbügel schließen.';
  if(!state.clear)return 'Fahrbereich freigeben.';
  if(state.mode==='auto')return 'Alle Freigaben liegen an. Signaturprogramm kann starten.';
  return 'Manuell: Höhe anfahren, Rotation wählen und Drop freigeben.';
}
