import './pegasus31.mjs';
import * as THREE from 'three';

const $=id=>document.getElementById(id);
let restraintsClosed=true,micStream=null,audioCtx=null,micSource=null,micGain=null,initialized=false;
const restraintRigs=[];

function installStyles(){
 const style=document.createElement('style');style.textContent=`
 .extras-card{border-color:#4a3b13;background:linear-gradient(180deg,#171a1b,#101416)}
 .extras-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}.extras-grid .brake-button{grid-column:1/-1}
 .utility-button{min-height:43px;padding:8px 10px;display:flex;align-items:center;justify-content:space-between;text-align:left;font-size:8px;letter-spacing:.09em}.utility-button b{font-size:9px;color:#e6b11e}.utility-button.active{border-color:#8f711c;background:#e6b11e14;box-shadow:0 0 18px #e6b11e12}.utility-button.active b{color:#ffd454}
 .music-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px;margin-top:10px}.music-row input{min-width:0;background:#0b0f12;border:1px solid #293137;color:#f4f5f6;border-radius:5px;padding:8px 9px;font-size:9px;outline:none}.music-row input:focus{border-color:#8f711c;box-shadow:0 0 0 2px #e6b11e13}.music-row button{padding:7px 9px;font-size:8px;letter-spacing:.08em}
 .youtube-player{margin-top:8px;border:1px solid #2b3338;border-radius:6px;overflow:hidden;background:#050607}.youtube-player iframe{display:block;width:100%;height:150px;border:0}
 @media(max-width:520px){.extras-grid{grid-template-columns:1fr}.extras-grid .brake-button{grid-column:auto}.music-row{grid-template-columns:1fr}.youtube-player iframe{height:180px}}
 `;document.head.appendChild(style);
}

function waitForRide(){
 const nf=window.nightfly;
 if(!nf?.groups?.gondola0||!nf?.state){requestAnimationFrame(waitForRide);return;}
 if(initialized)return;
 initialized=true;
 installStyles();installUI(nf);buildOriginalRestraintRigs(nf);installInterlock();requestAnimationFrame(update);
}

function installUI(nf){
 const consoleEl=document.querySelector('.console'),footer=document.querySelector('.console-footer');
 if(!consoleEl||!footer)return;
 const section=document.createElement('section');section.className='control-card extras-card';section.innerHTML=`
  <header class="card-title"><div><span class="card-index">05</span><h2>Operator Extras</h2></div><output id="restraint-state">Bügel prüfen…</output></header>
  <div class="extras-grid">
   <button id="restraints" class="brake-button">BÜGEL ÖFFNEN</button>
   <button id="mic-toggle" class="utility-button"><span>MIKROFON</span><b>OFF</b></button>
  </div>
  <p id="extras-status" class="hint">Vorhandene Nightfly-Schulterbügel werden erkannt.</p>
  <div class="music-row"><input id="youtube-url" type="text" inputmode="url" placeholder="YouTube-Link oder Video-ID"><button id="youtube-load">MUSIK LADEN</button></div>
  <div id="youtube-player" class="youtube-player" hidden></div>`;
 consoleEl.insertBefore(section,footer);
 $('restraints').onclick=()=>setRestraints(!restraintsClosed,nf);
 $('mic-toggle').onclick=toggleMic;
 $('youtube-load').onclick=loadYouTube;
}

function installInterlock(){
 document.addEventListener('click',e=>{
  if(restraintsClosed)return;
  const target=e.target.closest?.('[data-program],#spin,#ride');
  if(!target)return;
  e.preventDefault();e.stopImmediatePropagation();setStatus('Fahrfreigabe gesperrt: zuerst alle Bügel schließen.');
 },true);
}

function restraintToken(k,seat){return `Gondola_${k+1}_Seat_${seat+1}_`;}
function matchesSeatRestraint(name,k,seat){
 const token=restraintToken(k,seat);
 return name.includes(token)&&(name.includes('shoulder_restraint')||name.includes('restraint_bridge')||name.includes('grab_handle'));
}

function buildOriginalRestraintRigs(nf){
 nf.scene.updateMatrixWorld(true);
 let found=0;
 for(let k=0;k<4;k++){
  const gondola=nf.groups['gondola'+k],t=k*Math.PI/2,axis=new THREE.Vector3(-Math.sin(t),Math.cos(t),0).normalize();
  for(let seat=0;seat<4;seat++){
   const parts=[];
   gondola.traverse(obj=>{if(obj.isMesh&&matchesSeatRestraint(obj.name||'',k,seat))parts.push(obj);});
   if(!parts.length)continue;
   const box=new THREE.Box3();
   for(const mesh of parts){if(!mesh.geometry.boundingBox)mesh.geometry.computeBoundingBox();box.union(mesh.geometry.boundingBox);}
   const center=box.getCenter(new THREE.Vector3());
   const pivot=new THREE.Vector3(center.x,center.y,box.max.z-.03);
   const rig=new THREE.Group();rig.name=`Original_restraint_${k+1}_${seat+1}`;rig.position.copy(pivot);gondola.add(rig);
   gondola.updateMatrixWorld(true);rig.updateMatrixWorld(true);
   for(const mesh of parts)rig.attach(mesh);
   rig.userData.axis=axis;rig.userData.current=0;restraintRigs.push(rig);found++;
  }
 }
 const state=$('restraint-state');if(state)state.textContent=`${found} / 16 erkannt`;
 setStatus(found===16?'Alle 16 vorhandenen Schulterbügel erkannt.':'Bügelsteuerung aktiv, aber nur '+found+' von 16 Bügelgruppen erkannt.');
}

function setRestraints(close,nf){
 const s=nf.state;
 if(!close&&(s.lift>.06||s.program!=='stop'||s.spinOn||Math.abs(s.mainVelocity)>.025||Math.abs(s.spinVelocity)>.025)){
  setStatus('Bügel lassen sich nur in Ladeposition bei vollständig stillstehendem Geschäft öffnen.');return;
 }
 if(!restraintRigs.length){setStatus('Keine originalen Bügel erkannt – Steuerung nicht ausgeführt.');return;}
 restraintsClosed=close;
 $('restraints').textContent=close?'BÜGEL ÖFFNEN':'BÜGEL SCHLIESSEN';$('restraints').classList.toggle('released',!close);
 $('restraint-state').textContent=close?`${restraintRigs.length} / 16 geschlossen`:`${restraintRigs.length} / 16 offen`;
 setStatus(close?'Originale Schulterbügel geschlossen. Fahrbetrieb freigegeben.':'Originale Schulterbügel geöffnet. Fahrantrieb ist verriegelt.');
}

async function toggleMic(){
 const button=$('mic-toggle');
 if(micStream){micStream.getTracks().forEach(t=>t.stop());micStream=null;micSource?.disconnect();micGain?.disconnect();if(audioCtx){await audioCtx.close();audioCtx=null;}button.classList.remove('active');button.querySelector('b').textContent='OFF';setStatus('Mikrofon aus.');return;}
 try{micStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});audioCtx=new AudioContext();micSource=audioCtx.createMediaStreamSource(micStream);micGain=audioCtx.createGain();const compressor=audioCtx.createDynamicsCompressor();micGain.gain.value=.85;micSource.connect(micGain).connect(compressor).connect(audioCtx.destination);button.classList.add('active');button.querySelector('b').textContent='LIVE';setStatus('Mikrofon live. Kopfhörer empfohlen, sonst kann es Rückkopplungen geben.');}catch(e){setStatus('Mikrofon konnte nicht aktiviert werden. Browser-Berechtigung prüfen.');}
}

function parseYouTube(value){value=value.trim();if(/^[\w-]{11}$/.test(value))return value;try{const u=new URL(value);if(u.hostname.includes('youtu.be'))return u.pathname.slice(1).split('/')[0];if(u.searchParams.get('v'))return u.searchParams.get('v');const m=u.pathname.match(/\/(?:embed|shorts)\/([\w-]{11})/);return m?.[1]||null;}catch{return null;}}
function loadYouTube(){const id=parseYouTube($('youtube-url').value);if(!id){setStatus('Bitte gültigen YouTube-Link oder Video-ID eingeben.');return;}const box=$('youtube-player');box.hidden=false;box.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&controls=1&rel=0" title="Nightfly Musik" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;setStatus('YouTube-Musik geladen. Start kann je nach Browser noch einen Klick im Player brauchen.');}
function setStatus(text){const el=$('extras-status');if(el)el.textContent=text;}

let previous=performance.now();
function update(now){
 const nf=window.nightfly;if(!nf?.state){requestAnimationFrame(update);return;}
 const dt=Math.min((now-previous)/1000,.05);previous=now,target=restraintsClosed?0:-1.15;
 for(const rig of restraintRigs){rig.userData.current+=(target-rig.userData.current)*Math.min(1,dt*7);rig.setRotationFromAxisAngle(rig.userData.axis,rig.userData.current);}
 requestAnimationFrame(update);
}
waitForRide();
