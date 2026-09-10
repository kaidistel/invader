import * as THREE from 'three';

const $=id=>document.getElementById(id);
let restraintsClosed=true,micStream=null,audioCtx=null,micSource=null,micGain=null,guestActors=[],initialized=false;
const restraintGroups=[];

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

function waitForRide(){const nf=window.nightfly;if(!nf?.groups?.gondola0||!nf?.state){requestAnimationFrame(waitForRide);return;}if(initialized)return;initialized=true;installStyles();installUI(nf);buildRestraints(nf);installInterlock(nf);requestAnimationFrame(update);}

function installUI(nf){
 const consoleEl=document.querySelector('.console');const footer=document.querySelector('.console-footer');if(!consoleEl||!footer)return;
 const section=document.createElement('section');section.className='control-card extras-card';section.innerHTML=`
  <header class="card-title"><div><span class="card-index">05</span><h2>Operator Extras</h2></div><output id="guest-count">0 Gäste</output></header>
  <div class="extras-grid">
   <button id="restraints" class="brake-button">BÜGEL ÖFFNEN</button>
   <button id="mic-toggle" class="utility-button"><span>MIKROFON</span><b>OFF</b></button>
   <button id="spawn-guests" class="utility-button"><span>GÄSTE SPAWNEN</span><b>RANDOM</b></button>
  </div>
  <p id="extras-status" class="hint">Bügel sind geschlossen. Gäste können nur in Ladeposition bei geöffneten Bügeln einsteigen.</p>
  <div class="music-row"><input id="youtube-url" type="text" inputmode="url" placeholder="YouTube-Link oder Video-ID"><button id="youtube-load">MUSIK LADEN</button></div>
  <div id="youtube-player" class="youtube-player" hidden></div>`;
 consoleEl.insertBefore(section,footer);
 $('restraints').onclick=()=>setRestraints(!restraintsClosed,nf);$('mic-toggle').onclick=toggleMic;$('spawn-guests').onclick=()=>spawnGuests(nf);$('youtube-load').onclick=loadYouTube;
}

function installInterlock(nf){
 document.addEventListener('click',e=>{if(restraintsClosed)return;const target=e.target.closest?.('[data-program],#spin,#ride');if(!target)return;e.preventDefault();e.stopImmediatePropagation();setStatus('Fahrfreigabe gesperrt: zuerst alle Bügel schließen.');},true);
}

function tube(a,b,r,material){const d=b.clone().sub(a),m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d.length(),10),material);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());m.castShadow=true;return m;}

function buildRestraints(nf){
 const mat=new THREE.MeshStandardMaterial({color:'#e6b11e',metalness:.7,roughness:.28});
 for(let k=0;k<4;k++){
  const g=nf.groups['gondola'+k],t=k*Math.PI/2,radial=new THREE.Vector3(Math.cos(t),Math.sin(t),0),axle=new THREE.Vector3(-Math.sin(t),Math.cos(t),0),up=new THREE.Vector3(0,0,1),gondolaBars=[];
  for(let seat=0;seat<4;seat++){
   const lateral=axle.clone().multiplyScalar((seat-1.5)*.68),pivot=lateral.clone().add(radial.clone().multiplyScalar(.03)).add(up.clone().multiplyScalar(.78)),holder=new THREE.Group();holder.position.copy(pivot);g.add(holder);
   const p0=axle.clone().multiplyScalar(-.22),p1=axle.clone().multiplyScalar(.22),down=radial.clone().multiplyScalar(.30).add(up.clone().multiplyScalar(-.53));holder.add(tube(p0,p0.clone().add(down),.035,mat),tube(p1,p1.clone().add(down),.035,mat),tube(p0.clone().add(down),p1.clone().add(down),.038,mat));holder.userData.axle=axle.clone();holder.userData.current=0;gondolaBars.push(holder);
  }
  restraintGroups.push(gondolaBars);
 }
}

function setRestraints(close,nf){
 const s=nf.state;if(!close&&(s.lift>.06||s.program!=='stop'||s.spinOn)){setStatus('Bügel lassen sich nur in Ladeposition bei stillstehendem Geschäft öffnen.');return;}
 restraintsClosed=close;$('restraints').textContent=close?'BÜGEL ÖFFNEN':'BÜGEL SCHLIESSEN';$('restraints').classList.toggle('released',!close);setStatus(close?'Bügel geschlossen. Fahrbetrieb freigegeben.':'Bügel offen. Boarding ist möglich; Fahrantrieb ist verriegelt.');
}

async function toggleMic(){
 const button=$('mic-toggle');
 if(micStream){micStream.getTracks().forEach(t=>t.stop());micStream=null;micSource?.disconnect();micGain?.disconnect();if(audioCtx){await audioCtx.close();audioCtx=null;}button.classList.remove('active');button.querySelector('b').textContent='OFF';setStatus('Mikrofon aus.');return;}
 try{micStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});audioCtx=new AudioContext();micSource=audioCtx.createMediaStreamSource(micStream);micGain=audioCtx.createGain();const compressor=audioCtx.createDynamicsCompressor();micGain.gain.value=.85;micSource.connect(micGain).connect(compressor).connect(audioCtx.destination);button.classList.add('active');button.querySelector('b').textContent='LIVE';setStatus('Mikrofon live. Kopfhörer empfohlen, sonst kann es Rückkopplungen geben.');}catch(e){setStatus('Mikrofon konnte nicht aktiviert werden. Browser-Berechtigung prüfen.');}
}

function makeGuest(){const root=new THREE.Group(),skin=new THREE.MeshStandardMaterial({color:new THREE.Color().setHSL(.06+Math.random()*.05,.35,.58),roughness:.8}),shirt=new THREE.MeshStandardMaterial({color:new THREE.Color().setHSL(Math.random(),.55,.45),roughness:.75}),dark=new THREE.MeshStandardMaterial({color:'#24282c',roughness:.9});const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.18,.48,5,10),shirt);torso.position.z=.72;const head=new THREE.Mesh(new THREE.SphereGeometry(.14,14,10),skin);head.position.z=1.23;const leg1=new THREE.Mesh(new THREE.CapsuleGeometry(.07,.42,4,8),dark),leg2=leg1.clone();leg1.position.set(-.09,0,.26);leg2.position.set(.09,0,.26);root.add(torso,head,leg1,leg2);root.scale.setScalar(.88+Math.random()*.16);return root;}

function spawnGuests(nf){
 const s=nf.state;if(s.lift>.06||s.program!=='stop'||s.spinOn||restraintsClosed){setStatus('Für Boarding: Ladeposition, Stillstand und Bügel öffnen.');return;}
 const occupied=new Set(guestActors.map(a=>`${a.gondola}-${a.seat}`)),free=[];for(let g=0;g<4;g++)for(let seat=0;seat<4;seat++)if(!occupied.has(`${g}-${seat}`))free.push([g,seat]);if(!free.length){setStatus('Alle 16 Plätze sind belegt.');return;}
 const count=Math.min(free.length,Math.max(2,Math.floor(3+Math.random()*7)));for(let i=0;i<count;i++){const pick=free.splice(Math.floor(Math.random()*free.length),1)[0],actor=makeGuest();actor.position.set(-4.5+i*.65,-8.5-Math.random()*1.4,0);nf.scene.add(actor);guestActors.push({obj:actor,gondola:pick[0],seat:pick[1],progress:0,seated:false,delay:i*.22});}$('guest-count').textContent=`${guestActors.length} Gäste`;setStatus(`${count} Gäste kommen zur Anlage und steigen automatisch ein.`);
}

function seatLocal(g,seat){const t=g*Math.PI/2,radial=new THREE.Vector3(Math.cos(t),Math.sin(t),0),axle=new THREE.Vector3(-Math.sin(t),Math.cos(t),0),up=new THREE.Vector3(0,0,1);return axle.multiplyScalar((seat-1.5)*.68).add(radial.multiplyScalar(.08)).add(up.multiplyScalar(.44));}
function updateGuests(nf,dt){for(const a of guestActors){if(a.seated)continue;if(a.delay>0){a.delay-=dt;continue;}const group=nf.groups['gondola'+a.gondola],target=group.localToWorld(seatLocal(a.gondola,a.seat).clone());a.progress=Math.min(1,a.progress+dt*.48);const p=a.progress,queue=new THREE.Vector3(target.x,-5.8,target.z),mid=new THREE.Vector3(target.x,-3.5,target.z);let desired;if(p<.5)desired=a.obj.position.clone().lerp(queue,p*.14);else if(p<.82)desired=queue.clone().lerp(mid,(p-.5)/.32);else desired=mid.clone().lerp(target,(p-.82)/.18);a.obj.position.lerp(desired,.14);a.obj.lookAt(target.x,target.y,a.obj.position.z);if(p>=.995){group.attach(a.obj);a.obj.position.copy(seatLocal(a.gondola,a.seat));a.obj.rotation.set(0,0,0);a.seated=true;}}}

function parseYouTube(value){value=value.trim();if(/^[\w-]{11}$/.test(value))return value;try{const u=new URL(value);if(u.hostname.includes('youtu.be'))return u.pathname.slice(1).split('/')[0];if(u.searchParams.get('v'))return u.searchParams.get('v');const m=u.pathname.match(/\/(?:embed|shorts)\/([\w-]{11})/);return m?.[1]||null;}catch{return null;}}
function loadYouTube(){const id=parseYouTube($('youtube-url').value);if(!id){setStatus('Bitte gültigen YouTube-Link oder Video-ID eingeben.');return;}const box=$('youtube-player');box.hidden=false;box.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&controls=1&rel=0" title="Nightfly Musik" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;setStatus('YouTube-Musik geladen. Start kann je nach Browser noch einen Klick im Player brauchen.');}
function setStatus(text){const el=$('extras-status');if(el)el.textContent=text;}

let previous=performance.now();function update(now){const nf=window.nightfly;if(!nf?.state){requestAnimationFrame(update);return;}const dt=Math.min((now-previous)/1000,.05);previous=now,target=restraintsClosed?0:-1.15;for(const bars of restraintGroups)for(const h of bars){h.userData.current+=(target-h.userData.current)*Math.min(1,dt*7);h.setRotationFromAxisAngle(h.userData.axle,h.userData.current);}updateGuests(nf,dt);requestAnimationFrame(update);}
waitForRide();
