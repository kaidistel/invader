function renderFast(){
  const yStation=650,yTop=112,range=yStation-yTop;const y=yStation-(state.height/TOP_POS)*range;
  $('gondola').setAttribute('transform','translate(0 '+(y-100)+')');
  $('gondolaDeck').setAttribute('transform','translate(0 58) rotate('+(Math.sin(state.rotation*Math.PI/180)*1.8)+' 480 42)');
  $('height').innerHTML=state.height.toFixed(1)+' <small>m</small>';$('heightChip').textContent=state.height.toFixed(1)+' m';
  $('speed').innerHTML=Math.abs(state.velocity*3.6).toFixed(0)+' <small>km/h</small>';
  $('direction').textContent=state.velocity>.1?'↑ AUFWÄRTS':state.velocity<-.1?'↓ ABWÄRTS':atStation()?'IN STATION':'STILLSTAND';
  $('rpm').innerHTML=(Math.abs(state.rotationDir)*state.rotationRpm).toFixed(1)+' <small>rpm</small>';
  $('rotationDir').textContent=state.rotationDir>0?'CW':state.rotationDir<0?'CCW':'STOP';
  $('rideTimer').textContent=fmt(state.rideTime);$('programStage').textContent=state.stage;
  $('motionChip').textContent=state.stage;$('stageTitle').textContent=state.stage;$('stageHint').textContent=hint();
  $('sceneState').textContent=state.estop?'NOT-HALT':moving()?state.stage:'STANDBY';
}

function render(){
  const label=labels[state.phase]||state.stage;
  $('topState').textContent=state.estop?'NOT-HALT':label;$('statusText').textContent=state.estop?'NOT-HALT':label;
  $('topLamp').className=state.estop?'alarm':state.power?'on':'';$('statusLamp').className=state.estop?'alarm':state.power?'on':'';
  $('clock').textContent=fmt(state.time);$('safetyText').textContent=state.estop?'TRIP':state.power?'READY':'OFF';
  $('power').classList.toggle('on',state.power);$('powerLabel').textContent=state.power?'EIN':'AUS';
  $('stationInfo').textContent=state.loaded?state.loaded+' GÄSTE':'LEER';$('seatState').textContent=state.loaded?state.loaded+'/24 BELEGT':'LEER';
  $('gates').textContent=state.gatesOpen?'TORE SCHLIESSEN':'TORE ÖFFNEN';$('restraints').textContent=state.restraints?'BÜGEL ÖFFNEN':'BÜGEL SCHLIESSEN';
  $('clear').classList.toggle('on',state.clear);
  $('iGate').classList.toggle('on',!state.gatesOpen);$('iRest').classList.toggle('on',state.restraints);$('iClear').classList.toggle('on',state.clear);$('iBrake').classList.toggle('on',state.brakeReady);
  document.querySelectorAll('[data-action]').forEach(b=>b.disabled=!can(b.dataset.action));
  $('recovery').hidden=!state.estop&&state.phase!=='halted';$('guidance').textContent=hint();
  $('modeLabel').textContent=state.mode==='auto'?'AUTOMATIK':'MANUELL';
  for(let i=0;i<24;i++)$('seatDot'+i)?.classList.toggle('occupied',i<state.loaded);
  document.querySelectorAll('.seat-unit').forEach((g,i)=>{g.classList.toggle('occupied',i<Math.min(13,state.loaded));g.querySelector('.seat-head')?.classList.toggle('occupied',i<Math.min(13,state.loaded));});
  renderFast();
}

function renderLog(){
  $('log').replaceChildren(...state.events.slice(0,9).map(e=>{const li=document.createElement('li'),t=document.createElement('time'),s=document.createElement('span');t.textContent=fmt(e.t);s.textContent=e.text;li.append(t,s);return li;}));
}

function buildSeats(){
  const row=$('seatRow');const ns='http://www.w3.org/2000/svg';
  for(let i=0;i<13;i++){
    const angle=-160+i*(140/12),rad=angle*Math.PI/180,cx=480+Math.cos(rad)*155,cy=42+Math.sin(rad)*28;
    const g=document.createElementNS(ns,'g');g.setAttribute('class','seat-unit');g.setAttribute('transform','translate('+cx+' '+cy+') rotate('+(angle+90)+')');
    const shell=document.createElementNS(ns,'rect');shell.setAttribute('x','-13');shell.setAttribute('y','-1');shell.setAttribute('width','26');shell.setAttribute('height','22');shell.setAttribute('rx','7');shell.setAttribute('class','seat-shell');
    const back=document.createElementNS(ns,'rect');back.setAttribute('x','-11');back.setAttribute('y','-22');back.setAttribute('width','22');back.setAttribute('height','25');back.setAttribute('rx','8');back.setAttribute('class','seat-back');
    const bar=document.createElementNS(ns,'path');bar.setAttribute('d','M-11 -14 Q-18 1 -9 13 M11 -14 Q18 1 9 13');bar.setAttribute('class','lapbar');
    const head=document.createElementNS(ns,'circle');head.setAttribute('cx','0');head.setAttribute('cy','-29');head.setAttribute('r','6');head.setAttribute('class','seat-head');
    const light=document.createElementNS(ns,'circle');light.setAttribute('cx','0');light.setAttribute('cy','27');light.setAttribute('r','3');light.setAttribute('class','seat-light');
    g.append(shell,back,bar,head,light);row.append(g);
  }
  for(let i=0;i<24;i++){const d=document.createElement('i');d.className='seat-dot';d.id='seatDot'+i;$('seatMap').append(d);}
  const bulbs=$('signBulbs');
  for(let i=0;i<34;i++){
    const x=192+i*(576/33),y=i%2?758:722;const c=document.createElementNS(ns,'circle');c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r','3.1');c.setAttribute('class','sign-bulb '+(i%4===0?'alt':''));bulbs.append(c);
  }
}
buildSeats();
