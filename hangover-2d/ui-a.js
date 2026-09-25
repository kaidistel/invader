const SVGNS='http://www.w3.org/2000/svg';
const svg=(name,attrs={},text='')=>{
  const el=document.createElementNS(SVGNS,name);
  for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));
  if(text)el.textContent=text;
  return el;
};

function buildTowerDetail(){
  const tower=document.querySelector('.tower-structure');
  if(!tower)return;
  const detail=svg('g',{id:'towerDetail',class:'tower-detail'});

  for(let y=82,n=0;y<728;y+=28,n++){
    detail.append(svg('line',{x1:449,y1:y,x2:511,y2:y,class:'truss-rung'}));
    detail.append(svg('line',{x1:450,y1:y,x2:510,y2:y+28,class:n%2?'truss-diag dim':'truss-diag'}));
    detail.append(svg('line',{x1:510,y1:y,x2:450,y2:y+28,class:n%2?'truss-diag':'truss-diag dim'}));
    if(n%3===0){
      detail.append(svg('rect',{x:454,y:y+7,width:5,height:14,rx:1,class:'tower-bolt'}));
      detail.append(svg('rect',{x:501,y:y+7,width:5,height:14,rx:1,class:'tower-bolt'}));
    }
  }
  detail.append(
    svg('line',{x1:472,y1:76,x2:472,y2:731,class:'lift-cable'}),
    svg('line',{x1:488,y1:76,x2:488,y2:731,class:'lift-cable'}),
    svg('line',{x1:479,y1:76,x2:479,y2:731,class:'service-rail'}),
    svg('line',{x1:481,y1:76,x2:481,y2:731,class:'service-rail'})
  );
  for(let y=96;y<720;y+=13)detail.append(svg('line',{x1:475,y1:y,x2:485,y2:y,class:'ladder-rung'}));

  for(let y=566;y<=700;y+=18){
    detail.append(svg('rect',{x:442,y:y,width:14,height:8,rx:2,class:'brake-module'}));
    detail.append(svg('rect',{x:504,y:y,width:14,height:8,rx:2,class:'brake-module'}));
  }
  for(const y of [175,290,405,520]){
    detail.append(svg('circle',{cx:444,cy:y,r:7,class:'guide-wheel'}));
    detail.append(svg('circle',{cx:516,cy:y,r:7,class:'guide-wheel'}));
    detail.append(svg('circle',{cx:444,cy:y,r:3,class:'guide-hub'}));
    detail.append(svg('circle',{cx:516,cy:y,r:3,class:'guide-hub'}));
  }

  const top=svg('g',{class:'top-machinery'});
  top.append(
    svg('rect',{x:451,y:42,width:58,height:24,rx:4,class:'machine-box'}),
    svg('circle',{cx:466,cy:54,r:10,class:'pulley'}),svg('circle',{cx:494,cy:54,r:10,class:'pulley'}),
    svg('circle',{cx:466,cy:54,r:4,class:'pulley-hub'}),svg('circle',{cx:494,cy:54,r:4,class:'pulley-hub'}),
    svg('rect',{x:474,y:34,width:12,height:10,rx:2,class:'service-box'})
  );
  detail.append(top);
  tower.append(detail);

  const scene=$('towerSvg');
  const flags=svg('g',{id:'fairFlags',class:'fair-flags'});
  const flagData=[[132,690],[242,690],[718,690],[828,690]];
  for(const pair of flagData){
    const x=pair[0],base=pair[1];
    flags.append(svg('line',{x1:x,y1:base,x2:x,y2:574,class:'flag-pole'}));
    flags.append(svg('path',{d:'M'+(x+2)+' 582 L'+(x+62)+' 594 L'+(x+2)+' 632 Z',class:'hangover-flag'}));
    flags.append(svg('text',{x:x+11,y:604,class:'flag-text'},'GYRO'));
    flags.append(svg('text',{x:x+11,y:617,class:'flag-text'},'DROP TOWER'));
  }
  scene.insertBefore(flags,$('facade'));

  const station=svg('g',{id:'stationDetail',class:'station-detail'});
  station.append(svg('path',{d:'M70 846H890L850 915H110Z',class:'station-deck'}));
  for(let x=112;x<850;x+=42)station.append(svg('line',{x1:x,y1:855,x2:x-28,y2:910,class:'deck-hatch'}));
  for(const x of [96,205,755,864])station.append(svg('line',{x1:x,y1:806,x2:x,y2:885,class:'rail-post'}));
  station.append(
    svg('path',{d:'M86 812H286M674 812H874',class:'queue-rail'}),
    svg('path',{d:'M86 835H286M674 835H874',class:'queue-rail'}),
    svg('rect',{x:82,y:800,width:210,height:10,rx:3,class:'gate-base'}),
    svg('rect',{x:668,y:800,width:210,height:10,rx:3,class:'gate-base'})
  );
  scene.insertBefore(station,$('facade'));
}

function buildGondolaDetail(){
  const gondola=$('gondola');
  const deck=$('gondolaDeck');
  if(!gondola||!deck)return;

  const carrier=svg('g',{id:'carrierDetail',class:'carrier-detail'});
  carrier.append(
    svg('rect',{x:411,y:-22,width:138,height:18,rx:4,class:'carrier-beam'}),
    svg('rect',{x:420,y:-5,width:15,height:74,rx:3,class:'carrier-upright'}),
    svg('rect',{x:525,y:-5,width:15,height:74,rx:3,class:'carrier-upright'}),
    svg('path',{d:'M426 8L449 55M534 8L511 55M435 47H525',class:'carrier-brace'}),
    svg('circle',{cx:419,cy:7,r:11,class:'carrier-wheel'}),svg('circle',{cx:541,cy:7,r:11,class:'carrier-wheel'}),
    svg('circle',{cx:419,cy:7,r:4,class:'carrier-wheel-hub'}),svg('circle',{cx:541,cy:7,r:4,class:'carrier-wheel-hub'})
  );
  gondola.insertBefore(carrier,deck);

  const halo=svg('g',{id:'haloRig',class:'halo-rig'});
  halo.append(
    svg('ellipse',{cx:480,cy:-3,rx:198,ry:43,class:'halo-ring thick'}),
    svg('ellipse',{cx:480,cy:-7,rx:185,ry:38,class:'halo-ring'}),
    svg('ellipse',{cx:480,cy:-11,rx:171,ry:33,class:'halo-ring'}),
    svg('ellipse',{cx:480,cy:-15,rx:158,ry:29,class:'halo-ring inner'})
  );
  for(const a of [-72,-48,-24,0,24,48,72]){
    const r=a*Math.PI/180,x=480+Math.sin(r)*168,y=-10+Math.cos(r)*22;
    halo.append(svg('line',{x1:480,y1:24,x2:x,y2:y,class:'halo-spoke'}));
  }
  for(const x of [337,382,578,623])halo.append(svg('line',{x1:x,y1:-15,x2:x+(x<480?20:-20),y2:34,class:'halo-hanger'}));
  deck.insertBefore(halo,deck.firstChild);

  const inner=svg('g',{id:'innerFrame',class:'inner-frame'});
  inner.append(
    svg('rect',{x:439,y:-4,width:82,height:78,rx:8,class:'inner-red'}),
    svg('path',{d:'M447 68V2M513 68V2M449 10L478 66M511 10L482 66',class:'inner-bracing'}),
    svg('rect',{x:463,y:-5,width:8,height:74,class:'inner-rail'}),svg('rect',{x:489,y:-5,width:8,height:74,class:'inner-rail'}),
    svg('rect',{x:451,y:12,width:58,height:30,rx:3,class:'control-cabinet'}),
    svg('text',{x:480,y:24,'text-anchor':'middle',class:'cabinet-title'},'DROP'),
    svg('text',{x:480,y:34,'text-anchor':'middle',class:'cabinet-sub'},'CONTROL')
  );
  deck.insertBefore(inner,$('seatRow'));

  const under=svg('g',{id:'undercarriage',class:'undercarriage'});
  for(const x of [348,410,550,612]){
    under.append(svg('rect',{x:x-16,y:73,width:32,height:20,rx:3,class:'wheel-bracket'}));
    under.append(svg('circle',{cx:x,cy:92,r:11,class:'under-wheel'}));
    under.append(svg('circle',{cx:x,cy:92,r:4,class:'under-hub'}));
  }
  under.append(svg('path',{d:'M325 76Q480 116 635 76',class:'under-chassis'}));
  deck.append(under);
}

function buildSeats(){
  const row=$('seatRow');
  row.replaceChildren();
  for(let i=0;i<24;i++){
    const g=svg('g',{class:'seat-unit','data-seat':i});
    const back=svg('path',{d:'M-13 8 C-15 -6 -14 -30 -9 -38 Q0 -44 9 -38 C14 -30 15 -6 13 8 Z',class:'seat-back'});
    const shell=svg('path',{d:'M-17 6 Q0 0 17 6 L15 19 Q0 25 -15 19 Z',class:'seat-shell'});
    const pad=svg('path',{d:'M-11 4 Q0 1 11 4 L9 13 Q0 17 -9 13 Z',class:'seat-pad'});
    const head=svg('circle',{cx:0,cy:-47,r:7,class:'seat-head'});
    const bar=svg('path',{d:'M-13 -28 C-25 -22 -23 -3 -15 9 M13 -28 C25 -22 23 -3 15 9 M-15 9 Q0 18 15 9',class:'lapbar'});
    const sideL=svg('path',{d:'M-17 -10L-24 13L-19 20',class:'side-handle'});
    const sideR=svg('path',{d:'M17 -10L24 13L19 20',class:'side-handle'});
    const number=svg('text',{x:0,y:-55,'text-anchor':'middle',class:'seat-number'},String(i+1));
    const ledBox=svg('g',{class:'seat-ledbox'});
    ledBox.append(svg('path',{d:'M-16 23H16L13 34H-13Z',class:'led-housing'}));
    for(let n=0;n<4;n++)ledBox.append(svg('rect',{x:-11+n*7,y:25,width:4,height:7,rx:2,class:'seat-tube'}));
    g.append(number,head,back,shell,pad,bar,sideL,sideR,ledBox);
    row.append(g);
  }

  $('seatMap').replaceChildren();
  for(let i=0;i<24;i++){const d=document.createElement('i');d.className='seat-dot';d.id='seatDot'+i;$('seatMap').append(d);}

  const bulbs=$('signBulbs');bulbs.replaceChildren();
  for(let i=0;i<54;i++){
    const x=188+i*(584/53),y=i%2?758:720;
    bulbs.append(svg('circle',{cx:x,cy:y,r:2.7,class:'sign-bulb '+(i%5===0?'alt':'')}));
  }
}

function buildFacadeDetail(){
  const facade=$('facade');
  if(!facade)return;
  const art=svg('g',{id:'facadeArt',class:'facade-art'});
  art.append(
    svg('path',{d:'M294 852L319 767L344 852M307 812H331M301 832H338M315 780L323 780',class:'landmark-line'}),
    svg('path',{d:'M650 850L650 798L659 786L668 798V850M659 786V766M654 773L659 765L664 773',class:'liberty'}),
    svg('ellipse',{cx:585,cy:837,rx:42,ry:14,class:'taxi'}),svg('rect',{x:555,y:821,width:60,height:16,rx:8,class:'taxi'}),
    svg('text',{x:585,y:834,'text-anchor':'middle',class:'taxi-text'},'TAXI'),
    svg('circle',{cx:220,cy:839,r:24,class:'chip purple'}),svg('circle',{cx:220,cy:839,r:12,class:'chip-core'}),
    svg('circle',{cx:740,cy:845,r:22,class:'chip cyan'}),svg('circle',{cx:740,cy:845,r:10,class:'chip-core'}),
    svg('path',{d:'M105 850Q135 790 165 850Z',class:'showgirl'}),svg('circle',{cx:135,cy:792,r:8,class:'showgirl-head'}),
    svg('path',{d:'M795 850Q825 790 855 850Z',class:'showgirl'}),svg('circle',{cx:825,cy:792,r:8,class:'showgirl-head'})
  );
  facade.append(art);
}

function projectSeats(){
  document.querySelectorAll('.seat-unit').forEach((g,i)=>{
    const a=i/24*Math.PI*2 + state.rotation*Math.PI/180;
    const depth=Math.sin(a);
    const x=480+Math.cos(a)*167;
    const y=47+depth*26;
    const scale=.62+(depth+1)*.18;
    const sx=.45+Math.abs(Math.sin(a))*.55;
    g.setAttribute('transform','translate('+x.toFixed(1)+' '+y.toFixed(1)+') scale('+(scale*sx).toFixed(3)+' '+scale.toFixed(3)+')');
    g.style.opacity=String(.43+(depth+1)*.285);
    g.style.filter=depth>.15?'brightness(1.08)':'brightness(.72)';
  });
}

function renderFast(){
  const yStation=650,yTop=112,range=yStation-yTop;const y=yStation-(state.height/TOP_POS)*range;
  $('gondola').setAttribute('transform','translate(0 '+(y-100)+')');
  $('gondolaDeck').setAttribute('transform','translate(0 58)');
  projectSeats();
  $('height').innerHTML=state.height.toFixed(1)+' <small>m</small>';$('heightChip').textContent=state.height.toFixed(1)+' m';
  $('speed').innerHTML=Math.abs(state.velocity*3.6).toFixed(0)+' <small>km/h</small>';
  $('direction').textContent=state.velocity>.1?'↑ AUFWÄRTS':state.velocity<-.1?'↓ ABWÄRTS':atStation()?'IN STATION':'STILLSTAND';
  $('rpm').innerHTML=(Math.abs(state.rotationDir)*state.rotationRpm).toFixed(1)+' <small>rpm</small>';
  $('rotationDir').textContent=state.rotationDir>0?'CW':state.rotationDir<0?'CCW':'STOP';
  $('rideTimer').textContent=fmt(state.rideTime);$('programStage').textContent=state.stage;
  $('motionChip').textContent=state.stage;$('stageTitle').textContent=state.stage;$('stageHint').textContent=hint();
  $('sceneState').textContent=state.estop?'NOT-HALT':moving()?state.stage:'STANDBY';

  const accel=Number.isFinite(state.accel)?state.accel:0;
  const gv=Math.max(0,1+accel/9.81);
  if($('gforce'))$('gforce').innerHTML=gv.toFixed(2)+' <small>g</small>';
  if($('accelText'))$('accelText').textContent=state.phase==='dropping'?'FREIER FALL':state.phase==='braking'?'VERZÖGERUNG':Math.abs(accel)>1?'BESCHLEUNIGUNG':'RUHE';

  if($('sysLiftText'))$('sysLiftText').textContent=state.velocity>.15?'UP':state.velocity<-.15&&!['dropping','braking'].includes(state.phase)?'DOWN':'IDLE';
  if($('sysCatchText'))$('sysCatchText').textContent=['dropping','braking'].includes(state.phase)?'RELEASED':state.height>1?'ENGAGED':'PARK';
  if($('sysBrakeText'))$('sysBrakeText').textContent=state.phase==='braking'?'ACTIVE':'READY';
  if($('sysRotText'))$('sysRotText').textContent=state.rotationDir>0?'CW':state.rotationDir<0?'CCW':'STOP';
  $('sysLift')?.classList.toggle('on',Math.abs(state.velocity)>.15&&!['dropping','braking'].includes(state.phase));
  $('sysCatch')?.classList.toggle('warn',['dropping','braking'].includes(state.phase));
  $('sysBrake')?.classList.toggle('warn',state.phase==='braking');
  $('sysRot')?.classList.toggle('on',state.rotationDir!==0);
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
  document.querySelectorAll('.seat-unit').forEach((g,i)=>{g.classList.toggle('occupied',i<state.loaded);g.querySelector('.seat-head')?.classList.toggle('occupied',i<state.loaded);});
  $('sysPlc')?.classList.toggle('on',state.power&&!state.estop);if($('sysPlcText'))$('sysPlcText').textContent=state.estop?'FAULT':state.power?'RUN':'OFF';
  renderFast();
}

function renderLog(){
  $('log').replaceChildren(...state.events.slice(0,9).map(e=>{const li=document.createElement('li'),t=document.createElement('time'),s=document.createElement('span');t.textContent=fmt(e.t);s.textContent=e.text;li.append(t,s);return li;}));
}

buildTowerDetail();
buildGondolaDetail();
buildSeats();
buildFacadeDetail();
