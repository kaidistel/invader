import {Ride,PROGRAMS,duration,TRAVEL} from './engine.mjs';
const $=id=>document.getElementById(id);
const ride=new Ride();
const labels={off:'ANLAGE AUS',boot:'SELBSTTEST',station:'STATION BEREIT',boarding:'GÄSTE STEIGEN EIN',locking:'BÜGEL SCHLIESSEN',running:'FAHRT AKTIV',unloading:'GÄSTE STEIGEN AUS',braking:'NOTBREMSUNG',halted:'STÖRUNG / STILLSTAND',recovery:'RÜCKHOLUNG'};
const format=seconds=>`${Math.floor(seconds/60).toString().padStart(2,'0')}:${Math.floor(seconds%60).toString().padStart(2,'0')}`;
for(const b of document.querySelectorAll('[data-program]'))b.querySelector('.program-time').textContent='~'+Math.round(duration(Number(b.dataset.program)))+' s';
let scene=null,last=performance.now(),uiTime=0,lastEvents='',profileProgram=0,paused=document.hidden;
let soundEnabled=false,audio=null,master=null,drone=null,lowpass=null;
const motion=matchMedia('(prefers-reduced-motion: reduce)').matches;$('reduceMotion').checked=motion;
for(let i=0;i<6;i++){
 const button=document.createElement('button');button.className='gondola';button.id='car'+i;
 button.innerHTML=`<span class="car-name">GONDEL 0${i+1}<i></i></span><span class="seats">${'<i></i>'.repeat(8)}</span><small>IN STATION</small>`;
 button.setAttribute('aria-label',`Gondel ${i+1} prüfen`);button.onclick=()=>{if(ride.check(i)){clickSound();renderUI()}};$('gondolas').append(button);
}
for(let i=0;i<25;i++)$('altitude').append(document.createElement('i'));
function clickSound(){if(!audio||!soundEnabled)return;const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.setValueAtTime(470,audio.currentTime);osc.frequency.exponentialRampToValueAtTime(160,audio.currentTime+.06);gain.gain.setValueAtTime(.05,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.07);osc.connect(gain).connect(master);osc.start();osc.stop(audio.currentTime+.08)}
$('sound').onclick=async()=>{try{if(!audio){audio=new (window.AudioContext||window.webkitAudioContext)();master=audio.createGain();master.gain.value=0;master.connect(audio.destination);drone=audio.createOscillator();drone.type='triangle';drone.frequency.value=48;lowpass=audio.createBiquadFilter();lowpass.type='lowpass';lowpass.frequency.value=220;drone.connect(lowpass).connect(master);drone.start();}await audio.resume();soundEnabled=!soundEnabled;master.gain.setTargetAtTime(soundEnabled?.06:0,audio.currentTime,.3);$('sound').setAttribute('aria-pressed',String(soundEnabled));$('sound').querySelector('span').textContent=soundEnabled?'Ton an':'Ton aus'}catch{$('sound').querySelector('span').textContent='Ton nicht verfügbar'}};
for(const button of document.querySelectorAll('[data-action]'))button.onclick=()=>{if(ride.command(button.dataset.action)){clickSound();renderUI()}};
for(const button of document.querySelectorAll('[data-program]'))button.onclick=()=>{if(ride.setProgram(Number(button.dataset.program))){clickSound();renderUI()}};
$('lanes').onchange=()=>{ride.setActive(Number($('lanes').value));renderUI()};
for(const button of document.querySelectorAll('[data-view]'))button.onclick=()=>{scene?.view(button.dataset.view);document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b===button))};
$('worklight').onchange=()=>scene?.setWorklight($('worklight').checked);
$('reduceMotion').onchange=()=>scene?.setReduceMotion($('reduceMotion').checked);
$('help').onclick=()=>$('manual').showModal();$('sources').onclick=()=>$('research').showModal();
for(const button of document.querySelectorAll('.close-modal'))button.onclick=()=>button.closest('dialog').close();
for(const dialog of document.querySelectorAll('dialog'))dialog.onclick=e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}};
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{ride.report('Vollbild im Browser nicht verfügbar.');renderUI()}};
document.addEventListener('visibilitychange',()=>{paused=document.hidden;last=performance.now();document.body.classList.toggle('paused',paused);if(audio&&master)master.gain.setTargetAtTime(!paused&&soundEnabled?.06:0,audio.currentTime,.1)});
function hint(){
 if(ride.emergency)return ride.phase==='braking'?'Bremsung abwarten. Bügel und Tore bleiben gesperrt.':'Not-Halt entriegeln. Danach zurückholen oder quittieren.';
 if(ride.phase==='halted')return ride.atStation?'Störung quittieren. Danach erneut prüfen oder aussteigen lassen.':'Gondeln kontrolliert zur Station zurückholen.';
 if(ride.phase==='recovery')return 'Rückholung läuft. Bügel bleiben verriegelt.';
 if(!ride.power)return 'Hauptschalter einschalten, um die Schicht zu beginnen.';
 if(ride.phase==='boot')return 'Selbsttest läuft. Druckreserve wird aufgebaut.';
 if(ride.phase==='boarding')return 'Gäste steigen ein. Warte, bis alle Plätze besetzt sind.';
 if(ride.phase==='locking')return 'Bügel schließen. Anschließend jede aktive Gondel im Monitor prüfen.';
 if(ride.phase==='unloading')return 'Gäste verlassen die Station. Gleich kann der nächste Einlass starten.';
 if(ride.phase==='running')return `${ride.stage} · ${PROGRAMS[ride.program].name}.`;
 if(!ride.occupied)return 'Programm und Spuren wählen. Dann Gäste einsteigen lassen.';
 if(ride.gates&&!ride.restraints)return 'Tore schließen für die nächste Fahrt oder Ausstieg starten.';
 if(ride.gates)return 'Tore schließen, bevor du die Bügel bedienst.';
 if(!ride.restraints)return 'Bügel schließen und anschließend jede aktive Gondel prüfen.';
 if(!ride.checked)return 'Jede aktive Gondel unten im Monitor einzeln prüfen. Zum Ausstieg Bügel öffnen.';
 if(!ride.clear)return 'Fahrbereich kontrollieren und freigeben.';
 if(ride.pressure<.98)return 'Druckaufbau läuft. Start bei voller Reserve möglich.';
 return 'Alle Freigaben liegen an. Du kannst das Experiment starten.';
}
function drawProfile(){const stages=PROGRAMS[ride.program].stages,total=duration(ride.program);let x=0,points='0,38';for(const [,height,seconds]of stages){x+=seconds/total*290;points+=` ${x.toFixed(1)},${(38-height/TRAVEL*32).toFixed(1)}`}$('profile').innerHTML=`<path d="M0 38H290" stroke="#63786a44" stroke-width="1"/><polyline points="${points}" fill="none" stroke="#c4b780" stroke-width="1.5"/><circle cx="0" cy="38" r="2" fill="#dfd7af"/>`}
function renderUI(){
 const current=ride.cars[0];$('clock').textContent=format(ride.time);$('status').textContent=labels[ride.phase];$('sceneStatus').textContent=ride.phase==='running'?`PROGRAMM ${ride.program} / AKTIV`:ride.emergency?'NOT-HALT':'LIVE / '+labels[ride.phase];
 $('statusLight').className=ride.emergency?'alarm':ride.power?'on':'';$('voltage').textContent=ride.power?'ON':'OFF';$('compressor').textContent=ride.power?(ride.pressure<.98?'DRUCKAUFBAU':'DRUCK BEREIT'):'KOMPRESSOR AUS';
 $('height').innerHTML=`${current.height.toFixed(1)} <small>m</small>`;$('speed').innerHTML=`${Math.abs(current.velocity*3.6).toFixed(0)} <small>km/h</small>`;$('direction').textContent=current.velocity>.1?'↑ AUFWÄRTS':current.velocity<-.1?'↓ ABWÄRTS':ride.atStation?'IN STATION':'STILLSTAND';
 $('pressure').innerHTML=`${Math.round(ride.pressure*100)} <small>%</small>`;$('pressureBar').style.width=`${ride.pressure*100}%`;
 $('progress').innerHTML=`${format(ride.rideTime)} <small>/ ${format(duration(ride.program))}</small>`;$('currentPhase').textContent=ride.phase==='running'?ride.stage.toUpperCase():labels[ride.phase];
 $('capacity').textContent=`${ride.occupied} / ${ride.active*8} GÄSTE`;
 for(let i=0;i<6;i++){const car=ride.cars[i],b=$('car'+i);b.classList.toggle('checked',car.checked);b.classList.toggle('inactive',i>=ride.active);b.disabled=!(ride.phase==='station'&&!ride.emergency&&ride.restraints&&!ride.gates&&i<ride.active&&!car.checked);b.setAttribute('aria-pressed',String(car.checked));b.querySelector('small').textContent=i>=ride.active?'AUSSER BETRIEB':ride.moving?`${car.height.toFixed(1)} m · VERRIEGELT`:car.checked?'✓ GEPRÜFT':ride.restraints?'PRÜFUNG OFFEN':car.guests?'BÜGEL OFFEN':'IN STATION';b.querySelectorAll('.seats i').forEach((s,j)=>s.classList.toggle('occupied',j<car.guests))}
 $('power').classList.toggle('on',ride.power);$('powerLabel').textContent=ride.power?'EIN':'AUS';$('lanes').disabled=ride.occupied>0||!['station','off'].includes(ride.phase)||ride.emergency;
 document.querySelectorAll('[data-action]').forEach(b=>b.disabled=!ride.allowed(b.dataset.action));
 document.querySelectorAll('[data-program]').forEach(b=>{b.classList.toggle('selected',Number(b.dataset.program)===ride.program);b.setAttribute('aria-pressed',String(Number(b.dataset.program)===ride.program));b.disabled=ride.moving});
 $('gates').innerHTML=`<span>▥</span> Tore ${ride.gates?'schließen':'öffnen'}`;$('restraints').innerHTML=`<span>∩</span> Bügel ${ride.restraints?'öffnen':'schließen'}`;$('clear').classList.toggle('on',ride.clear);
 $('stationState').textContent=ride.occupied?`${ride.occupied} GÄSTE`:'LEER';
 for(const [id,on]of [['interGate',!ride.gates],['interRestraint',ride.restraints&&ride.checked],['interClear',ride.clear],['interPressure',ride.pressure>=.98]])$(id).classList.toggle('on',on);
 const next=hint();if($('guidance').textContent!==next)$('guidance').textContent=next;
 $('sceneHint').textContent=ride.phase==='running'?ride.stage:ride.emergency?'Experiment unterbrochen. Rückholung erforderlich.':ride.power?'Du kontrollierst das nächste Experiment.':'Starte die Anlage. Erwecke den Turm.';
 $('safetyText').textContent=ride.emergency?'Not-Halt verriegelt':ride.phase==='halted'?'Quittierung erforderlich':ride.power?'Not-Halt frei':'System ausgeschaltet';
 $('recovery').hidden=!['braking','halted','recovery'].includes(ride.phase);
 $('rides').textContent=ride.rides;$('served').textContent=ride.served;$('queue').textContent=ride.queue;$('throughput').textContent=ride.served?Math.round(ride.served/ride.time*3600):'—';
 if(profileProgram!==ride.program){profileProgram=ride.program;drawProfile()}
 const eventKey=ride.events.map(e=>e.time+e.text).join('|');if(eventKey!==lastEvents){lastEvents=eventKey;$('log').replaceChildren(...ride.events.slice(0,8).map(e=>{const li=document.createElement('li'),time=document.createElement('time'),text=document.createElement('span');time.textContent=format(e.time);text.textContent=e.text;li.append(time,text);return li}))}
}
function fallback(error){console.error('3D initialization failed',error);$('loading').innerHTML='<div class="error-card"><h2>3D ist hier nicht verfügbar.</h2><p>Aktiviere die Hardwarebeschleunigung deines Browsers.<br>Die Bedienung funktioniert weiterhin mit der schematischen Ansicht.</p></div>';$('loading').style.alignContent='start';const tower=document.createElement('div');tower.className='fallback-tower';for(let i=0;i<6;i++){const t=document.createElement('div');t.className='fallback-track';t.innerHTML='<i class="fallback-car"></i>';tower.append(t)}$('loading').append(tower);$('renderStatus').textContent='SCHEMATISCHE ANSICHT';document.querySelectorAll('[data-view]').forEach(b=>b.disabled=true);$('worklight').disabled=true;return {render(){tower.querySelectorAll('.fallback-car').forEach((c,i)=>c.style.bottom=`${ride.cars[i].height/TRAVEL*90}%`)},setReduceMotion(){}}}
renderUI();
try{const {createScene}=await import('./scene.mjs');scene=createScene($('scene'),ride);scene.setReduceMotion(motion);$('loading').remove()}catch(error){scene=fallback(error)}
let sample=0;
function loop(now){const dt=Math.min((now-last)/1000,.05);last=now;if(!paused){ride.update(dt);scene?.render(dt,ride.time);uiTime+=dt;sample+=dt;if(uiTime>.1){renderUI();uiTime=0}if(sample>.4){sample=0;const plot=$('altitude');plot.firstChild.style.height=`${2+ride.cars[0].height/TRAVEL*10}px`;plot.append(plot.firstChild)}if(audio&&soundEnabled&&drone){drone.frequency.setTargetAtTime(ride.power?48+Math.abs(ride.cars[0].velocity)*3:35,audio.currentTime,.15);lowpass.frequency.setTargetAtTime(ride.phase==='running'?700:150,audio.currentTime,.2)}}requestAnimationFrame(loop)}
requestAnimationFrame(loop);
