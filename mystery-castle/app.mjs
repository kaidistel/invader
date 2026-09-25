import {Ride,PROGRAMS,duration,TRAVEL} from './engine.mjs';

const $=id=>document.getElementById(id);
const svgNS='http://www.w3.org/2000/svg';
const ride=new Ride();
const labels={off:'ANLAGE AUS',boot:'SELBSTTEST',station:'STATION BEREIT',boarding:'EINLASS',locking:'BÜGEL VERRIEGELN',running:'FAHRT AKTIV',unloading:'AUSLASS',braking:'NOTBREMSUNG',halted:'STÖRUNG / STILLSTAND',recovery:'RÜCKHOLUNG'};
const format=seconds=>`${Math.floor(seconds/60).toString().padStart(2,'0')}:${Math.floor(seconds%60).toString().padStart(2,'0')}`;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));

let last=performance.now(),uiTimer=0,lastEvents='',paused=document.hidden;
let soundEnabled=false,audio=null,master=null,drone=null,lowpass=null;
let view='tower';
const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
$('reduceMotion').checked=prefersReduced;
document.body.classList.toggle('reduce-motion',prefersReduced);

for(const b of document.querySelectorAll('[data-program]')){
  b.querySelector('.program-time').textContent='~'+Math.round(duration(Number(b.dataset.program)))+' s';
}

function svgEl(name,attrs={}){
  const el=document.createElementNS(svgNS,name);
  for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));
  return el;
}

const visualCars=[];
function buildTower(){
  const root=$('lanesVisual');
  const xs=[118,214,310,410,506,602];
  xs.forEach((x,i)=>{
    const bay=svgEl('g',{class:'lane',id:`lane${i}`});
    const shadow=svgEl('rect',{x:x-38,y:92,width:76,height:500,rx:2,class:'lane-shadow'});
    const rail1=svgEl('path',{d:`M${x-18} 92V592`,class:'guide-rail'});
    const rail2=svgEl('path',{d:`M${x+18} 92V592`,class:'guide-rail'});
    const cable=svgEl('path',{d:`M${x} 92V592`,class:'drive-cable'});
    const topBrake=svgEl('g',{class:'brake-zone top'});
    const bottomBrake=svgEl('g',{class:'brake-zone bottom'});
    for(let j=0;j<7;j++){
      topBrake.append(svgEl('rect',{x:x-29,y:112+j*12,width:58,height:5,rx:1}));
      bottomBrake.append(svgEl('rect',{x:x-29,y:462+j*16,width:58,height:6,rx:1}));
    }
    const carrier=svgEl('g',{class:'carrier',id:`carrier${i}`});
    carrier.append(svgEl('rect',{x:x-41,y:-24,width:82,height:34,rx:5,class:'carrier-body'}));
    carrier.append(svgEl('rect',{x:x-35,y:-18,width:70,height:18,rx:4,class:'restraint-bar'}));
    for(let s=0;s<8;s++){
      const sx=x-31+s*9;
      carrier.append(svgEl('path',{d:`M${sx} 0 q4 -7 8 0 v8 h-8z`,class:'seat'}));
      carrier.append(svgEl('circle',{cx:sx+4,cy:-8,r:2.3,class:'head'}));
    }
    const number=svgEl('text',{x,y:-30,'text-anchor':'middle',class:'carrier-number'});number.textContent=String(i+1).padStart(2,'0');carrier.append(number);
    bay.append(shadow,rail1,rail2,cable,topBrake,bottomBrake,carrier);
    root.append(bay);
    visualCars.push({bay,carrier});
  });
}
buildTower();

for(let i=0;i<6;i++){
  const button=document.createElement('button');
  button.className='gondola';button.id='car'+i;
  button.innerHTML=`<span class="car-name"><b>GONDEL ${String(i+1).padStart(2,'0')}</b><i></i></span><span class="seats">${'<i></i>'.repeat(8)}</span><small>IN STATION</small>`;
  button.onclick=()=>{if(ride.check(i)){clickSound(520);renderUI();}};
  $('gondolas').append(button);
}

function ensureAudio(){
  if(audio)return;
  audio=new (window.AudioContext||window.webkitAudioContext)();
  master=audio.createGain();master.gain.value=0;master.connect(audio.destination);
  lowpass=audio.createBiquadFilter();lowpass.type='lowpass';lowpass.frequency.value=190;
  drone=audio.createOscillator();drone.type='triangle';drone.frequency.value=43;drone.connect(lowpass).connect(master);drone.start();
}
function clickSound(freq=420){
  if(!audio||!soundEnabled)return;
  const o=audio.createOscillator(),g=audio.createGain();o.type='square';o.frequency.value=freq;g.gain.setValueAtTime(.025,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.045);o.connect(g).connect(master);o.start();o.stop(audio.currentTime+.05);
}
$('sound').onclick=async()=>{try{ensureAudio();await audio.resume();soundEnabled=!soundEnabled;master.gain.setTargetAtTime(soundEnabled?.075:0,audio.currentTime,.2);$('sound').setAttribute('aria-pressed',String(soundEnabled));$('sound').querySelector('span').textContent=soundEnabled?'Ton an':'Ton aus';}catch{$('sound').querySelector('span').textContent='Ton nicht verfügbar';}};

for(const button of document.querySelectorAll('[data-action]'))button.onclick=()=>{if(ride.command(button.dataset.action)){clickSound(button.dataset.action==='stop'?120:420);renderUI();}};
for(const button of document.querySelectorAll('[data-program]'))button.onclick=()=>{if(ride.setProgram(Number(button.dataset.program))){clickSound(600);drawProfile();renderUI();}};
$('lanes').onchange=()=>{ride.setActive(Number($('lanes').value));renderUI();};
$('worklight').onchange=()=>document.body.classList.toggle('worklight-off',!$('worklight').checked);
$('reduceMotion').onchange=()=>document.body.classList.toggle('reduce-motion',$('reduceMotion').checked);

for(const button of document.querySelectorAll('[data-view]'))button.onclick=()=>{
  view=button.dataset.view;
  document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b===button));
  const svg=$('towerSvg');
  svg.setAttribute('viewBox',view==='station'?'55 390 610 290':'0 0 720 760');
  document.body.classList.toggle('tech-view',view==='tech');
};

$('help').onclick=()=>$('manual').showModal();
$('sources').onclick=()=>$('research').showModal();
for(const button of document.querySelectorAll('.close-modal'))button.onclick=()=>button.closest('dialog').close();
$('fullscreen').onclick=async()=>{try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen();}catch{ride.report('Vollbild im Browser nicht verfügbar.');renderUI();}};

document.addEventListener('visibilitychange',()=>{paused=document.hidden;last=performance.now();document.body.classList.toggle('paused',paused);if(audio&&master)master.gain.setTargetAtTime(!paused&&soundEnabled?.075:0,audio.currentTime,.08);});

function hint(){
  if(ride.emergency)return ride.phase==='braking'?'Notbremsung läuft. Bedienung gesperrt.':'Not-Halt entriegeln. Danach ggf. Rückholung starten.';
  if(ride.phase==='halted')return ride.atStation?'Störung quittieren.':'Gondeln kontrolliert zur Station zurückholen.';
  if(ride.phase==='recovery')return 'Rückholung aktiv. Bügel bleiben verriegelt.';
  if(!ride.power)return 'Hauptschalter einschalten.';
  if(ride.phase==='boot')return 'Selbsttest und Druckaufbau laufen.';
  if(ride.phase==='boarding')return 'Einlass läuft. Gäste nehmen Platz.';
  if(ride.phase==='locking')return 'Bügel verriegeln. Danach jede aktive Gondel prüfen.';
  if(ride.phase==='unloading')return 'Auslass läuft.';
  if(ride.phase==='running')return `${ride.stage} · Programm ${ride.program}.`;
  if(!ride.occupied)return 'Programm und Gondelanzahl wählen, dann Einlass starten.';
  if(ride.gates)return 'Stationstore schließen.';
  if(!ride.restraints)return 'Bügel schließen.';
  if(!ride.checked)return 'Jede aktive Gondel anklicken und prüfen.';
  if(!ride.clear)return 'Fahrbereich freigeben.';
  if(ride.pressure<.98)return 'Druckreserve wird aufgebaut.';
  return 'Alle Freigaben liegen an. Fahrt kann gestartet werden.';
}

function drawProfile(){
  const svg=$('profile'),stages=PROGRAMS[ride.program].stages,total=duration(ride.program);
  let x=8,points=`${x},42`,elapsed=0;
  for(const [,height,seconds] of stages){elapsed+=seconds;x=8+elapsed/total*284;points+=` ${x.toFixed(1)},${(42-height/TRAVEL*34).toFixed(1)}`;}
  svg.innerHTML=`<path d="M8 42H292" class="profile-base"/><polyline points="${points}" class="profile-line"/><circle cx="8" cy="42" r="2.5" class="profile-dot"/><text x="8" y="8">HÖHENPROFIL · P${ride.program}</text>`;
}

drawProfile();

function updateVisual(){
  const stationY=586,topY=112,range=stationY-topY;
  visualCars.forEach(({bay,carrier},i)=>{
    const car=ride.cars[i];
    const y=stationY-clamp(car.height/TRAVEL,0,1)*range;
    carrier.setAttribute('transform',`translate(0 ${y})`);
    bay.classList.toggle('inactive',i>=ride.active);
    bay.classList.toggle('checked',car.checked);
    carrier.querySelectorAll('.seat').forEach((s,j)=>s.classList.toggle('occupied',j<car.guests));
    carrier.querySelectorAll('.head').forEach((s,j)=>s.classList.toggle('occupied',j<car.guests));
  });
  const stage=(ride.stage||'').toLowerCase();
  const tower=$('towerStage');
  tower.classList.toggle('launching',ride.phase==='running'&&(stage.includes('abschuss')||stage.includes('vorfahrt')));
  tower.classList.toggle('dropping',ride.phase==='running'&&(stage.includes('abwärts')||stage.includes('bungee')||stage.includes('ablassen')));
  tower.classList.toggle('show',ride.phase==='running'&&(stage.includes('show')||stage.includes('scheitel')));
  tower.classList.toggle('emergency',ride.emergency);
}

function renderUI(){
  const current=ride.cars[0],label=labels[ride.phase]||ride.phase;
  $('clock').textContent=format(ride.time);$('status').textContent=label;$('statusTop').textContent=label;
  $('sceneStatus').textContent=ride.phase==='running'?`P${ride.program} · ${ride.stage.toUpperCase()}`:ride.emergency?'NOT-HALT':label;
  $('statusLight').className=ride.emergency?'alarm':ride.power?'on':'';
  $('voltage').textContent=ride.power?'ON':'OFF';
  $('compressor').textContent=ride.power?(ride.pressure<.98?'DRUCKAUFBAU':'DRUCK BEREIT'):'KOMPRESSOR AUS';
  $('height').innerHTML=`${current.height.toFixed(1)} <small>m</small>`;
  $('speed').innerHTML=`${Math.abs(current.velocity*3.6).toFixed(0)} <small>km/h</small>`;
  $('direction').textContent=current.velocity>.1?'↑ AUFWÄRTS':current.velocity<-.1?'↓ ABWÄRTS':ride.atStation?'IN STATION':'STILLSTAND';
  $('pressure').innerHTML=`${Math.round(ride.pressure*100)} <small>%</small>`;$('pressureBar').style.width=`${ride.pressure*100}%`;
  $('progress').innerHTML=`${format(ride.rideTime)} <small>/ ${format(duration(ride.program))}</small>`;
  $('currentPhase').textContent=ride.phase==='running'?ride.stage.toUpperCase():label;
  $('capacity').textContent=`${ride.occupied} / ${ride.active*8} GÄSTE`;
  $('stageName').textContent=ride.phase==='running'?ride.stage.toUpperCase():label;
  $('stageHint').textContent=hint();

  for(let i=0;i<6;i++){
    const car=ride.cars[i],b=$('car'+i);
    b.classList.toggle('checked',car.checked);b.classList.toggle('inactive',i>=ride.active);
    b.disabled=!(ride.phase==='station'&&!ride.emergency&&ride.restraints&&!ride.gates&&i<ride.active&&!car.checked);
    b.querySelector('small').textContent=i>=ride.active?'AUSSER BETRIEB':ride.moving?`${car.height.toFixed(1)} m · VERRIEGELT`:car.checked?'✓ GEPRÜFT':ride.restraints?'PRÜFUNG OFFEN':car.guests?'BÜGEL OFFEN':'IN STATION';
    b.querySelectorAll('.seats i').forEach((s,j)=>s.classList.toggle('occupied',j<car.guests));
  }

  $('power').classList.toggle('on',ride.power);$('powerLabel').textContent=ride.power?'EIN':'AUS';
  $('lanes').disabled=ride.occupied>0||!['station','off'].includes(ride.phase)||ride.emergency;
  document.querySelectorAll('[data-action]').forEach(b=>b.disabled=!ride.allowed(b.dataset.action));
  document.querySelectorAll('[data-program]').forEach(b=>{b.classList.toggle('selected',Number(b.dataset.program)===ride.program);b.disabled=ride.moving;});
  $('gates').textContent=ride.gates?'TORE SCHLIESSEN':'TORE ÖFFNEN';
  $('restraints').textContent=ride.restraints?'BÜGEL ÖFFNEN':'BÜGEL SCHLIESSEN';
  $('clear').classList.toggle('on',ride.clear);
  $('stationState').textContent=ride.occupied?`${ride.occupied} GÄSTE`:'LEER';
  for(const [id,on] of [['interGate',!ride.gates],['interRestraint',ride.restraints&&ride.checked],['interClear',ride.clear],['interPressure',ride.pressure>=.98]])$(id).classList.toggle('on',on);
  $('guidance').textContent=hint();
  $('safetyText').textContent=ride.emergency?'Not-Halt verriegelt':ride.phase==='halted'?'Quittierung erforderlich':ride.power?'Sicherheitskreis bereit':'System ausgeschaltet';
  $('recovery').hidden=!['braking','halted','recovery'].includes(ride.phase);
  $('rides').textContent=ride.rides;$('served').textContent=ride.served;$('queue').textContent=ride.queue;$('throughput').textContent=ride.served?Math.round(ride.served/Math.max(1,ride.time)*3600):'—';

  const key=ride.events.map(e=>e.time+e.text).join('|');
  if(key!==lastEvents){lastEvents=key;$('log').replaceChildren(...ride.events.slice(0,8).map(e=>{const li=document.createElement('li'),time=document.createElement('time'),text=document.createElement('span');time.textContent=format(e.time);text.textContent=e.text;li.append(time,text);return li;}));}
  updateVisual();
}

renderUI();
function loop(now){
  const dt=Math.min((now-last)/1000,.05);last=now;
  if(!paused){
    ride.update(dt);uiTimer+=dt;
    if(audio&&soundEnabled&&drone){
      drone.frequency.setTargetAtTime(ride.power?43+Math.min(40,Math.abs(ride.cars[0].velocity)*2.8):34,audio.currentTime,.08);
      lowpass.frequency.setTargetAtTime(ride.phase==='running'?900:180,audio.currentTime,.12);
    }
    updateVisual();
    if(uiTimer>.08){renderUI();uiTimer=0;}
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
