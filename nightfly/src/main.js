import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RideState, PHYSICS, clamp, wrap, integrateGondola } from './dynamics.js';

import { HOTKEYS, shortcutFor } from './hotkeys.js';

const $=id=>document.getElementById(id);
const state=new RideState(), X=new THREE.Vector3(1,0,0), Y=new THREE.Vector3(0,1,0), Z=new THREE.Vector3(0,0,1);
const radians=THREE.MathUtils.degToRad;
const scene=new THREE.Scene();scene.background=new THREE.Color('#607f89');scene.fog=new THREE.Fog('#607f89',65,180);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
$('viewport').appendChild(renderer.domElement);
const camera=new THREE.PerspectiveCamera(43,1,.1,250);
const orbit=new OrbitControls(camera,renderer.domElement);orbit.enableDamping=true;orbit.maxPolarAngle=Math.PI*.48;orbit.minDistance=8;orbit.maxDistance=70;
const hemi=new THREE.HemisphereLight('#dae8ff','#526446',2.2);scene.add(hemi);
const sun=new THREE.DirectionalLight('#fff0ce',3.2);sun.position.set(13,28,16);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{left:-24,right:24,top:24,bottom:-24,near:1,far:85});sun.shadow.bias=-.0003;scene.add(sun);
const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();scene.environment=pmrem.fromScene(room,.04).texture;room.dispose();pmrem.dispose();
const ground=new THREE.Mesh(new THREE.PlaneGeometry(300,300),new THREE.MeshStandardMaterial({color:'#536457',roughness:.97}));
ground.rotation.x=-Math.PI/2;ground.position.y=-.015;ground.receiveShadow=true;scene.add(ground);
const grid=new THREE.GridHelper(160,80,'#667764','#60715f');grid.position.y=.002;grid.material.transparent=true;grid.material.opacity=.12;scene.add(grid);
let model,tower,main,rotor,hydraulics=[],gondolas=[],restraintHinges=[],ready=false,night=false,camMode='orbit',parkBrakes=null;
let accumulator=0,last=performance.now(),lastUi=0;const dt=1/120;
const originalName=o=>o.userData.name||o.name;
function find(name){let found;model.traverse(o=>{if(originalName(o)===name)found=o;});if(!found)throw new Error('Bauteil fehlt: '+name);return found;}
function message(text){$('message').textContent=text;}
function optimizeModel(owners){
 model.updateMatrixWorld(true);
 const set=new Set(owners),buckets=new Map(),remove=[];
 const meshes=[];model.traverse(o=>{if(o.isMesh)meshes.push(o);});
 for(const mesh of meshes){
  mesh.castShadow=true;mesh.receiveShadow=true;
  if(set.has(mesh)||Array.isArray(mesh.material))continue;
  let owner=mesh.parent;while(owner&&!set.has(owner))owner=owner.parent;owner=owner||model;
  const key=owner.uuid+mesh.material.uuid;
  if(!buckets.has(key))buckets.set(key,{owner,material:mesh.material,geometries:[]});
  let geo=mesh.geometry.clone();if(geo.index)geo=geo.toNonIndexed();
  geo.applyMatrix4(new THREE.Matrix4().copy(owner.matrixWorld).invert().multiply(mesh.matrixWorld));
  for(const key of Object.keys(geo.attributes))if(!['position','normal','uv'].includes(key))geo.deleteAttribute(key);
  if(!geo.attributes.normal)geo.computeVertexNormals();
  if(!geo.attributes.uv)geo.setAttribute('uv',new THREE.BufferAttribute(new Float32Array(geo.attributes.position.count*2),2));
  geo.clearGroups();buckets.get(key).geometries.push(geo);remove.push(mesh);
 }
 for(const {owner,material,geometries} of buckets.values()){
  const geo=mergeGeometries(geometries);if(!geo)throw new Error('Geometrie konnte nicht zusammengefasst werden.');
  const mesh=new THREE.Mesh(geo,material);mesh.name='Batched surface';mesh.castShadow=true;mesh.receiveShadow=true;owner.add(mesh);
  for(const part of geometries)part.dispose();
 }
 for(const mesh of remove){for(const child of [...mesh.children])mesh.parent.attach(child);mesh.removeFromParent();}
 return buckets.size;
}
function pose(){
 const opening=state.restraints*state.restraints*(3-2*state.restraints);
 for(const h of restraintHinges)h.node.quaternion.copy(h.closed).multiply(new THREE.Quaternion().setFromAxisAngle(X,-1.15*opening));
 const tilt=radians(59.3+(36-59.3)*state.lift);
 tower.quaternion.setFromAxisAngle(X,tilt);
 // Keep the mounting angle fixed relative to the lifting structure; do not counter-rotate during lift.
 main.quaternion.setFromAxisAngle(X,radians(9-59.3)).multiply(new THREE.Quaternion().setFromAxisAngle(Z,-(Math.PI+state.arm)));
 rotor.quaternion.setFromAxisAngle(Y,state.rotor);
 model.updateMatrixWorld(true);
 for(const h of hydraulics){
  const base=h.base.getWorldPosition(new THREE.Vector3()),eye=h.eye.getWorldPosition(new THREE.Vector3());
  const distance=base.distanceTo(eye);
  h.base.quaternion.setFromUnitVectors(Y,eye.sub(base).normalize());
  const length=Math.max(.01,distance-2.55);
  h.rod.position.y=2.55+length/2;h.rod.scale.y=h.initialScaleY*length/h.initialLength;
 }
 model.updateMatrixWorld(true);
}
function resetHistories(){
 for(const g of gondolas){const m=g.mount.matrixWorld;g.previous.copy(m);g.older.copy(m);g.previousQ.copy(g.mount.getWorldQuaternion(new THREE.Quaternion()));g.previousOmega.set(0,0,0);g.filteredAcceleration=0;}
}
function swingStep(){
 const gravity=new THREE.Vector3(0,-9.81,0);
 for(const g of gondolas){
  const q=g.mount.getWorldQuaternion(new THREE.Quaternion());
  const localR=g.restOffset.clone().applyAxisAngle(X,g.angle);
  const fixed=g.mount.localToWorld(localR.clone());
  const prev=localR.clone().applyMatrix4(g.previous),old=localR.clone().applyMatrix4(g.older);
  const acceleration=fixed.clone().addScaledVector(prev,-2).add(old).multiplyScalar(1/(dt*dt));
  const axis=X.clone().applyQuaternion(q),r=localR.clone().applyQuaternion(q);
  const dq=q.clone().multiply(g.previousQ.clone().invert()).normalize();
  if(dq.w<0)dq.set(-dq.x,-dq.y,-dq.z,-dq.w);
  const angle=2*Math.acos(clamp(dq.w,-1,1)),s=Math.sqrt(Math.max(0,1-dq.w*dq.w));
  const omega=s>.00001?new THREE.Vector3(dq.x,dq.y,dq.z).multiplyScalar(angle/(s*dt)):new THREE.Vector3();
  const relativeVelocity=new THREE.Vector3().crossVectors(axis,r).multiplyScalar(g.speed);
  const force=gravity.clone().sub(acceleration).addScaledVector(new THREE.Vector3().crossVectors(omega,relativeVelocity),-2);
  const frameAlpha=omega.clone().sub(g.previousOmega).multiplyScalar(1/dt);
  // Include the body's rotational inertia, not just the COM point mass.
  const bodyFraction=1-PHYSICS.gondolaCOM**2/PHYSICS.gondolaInertia;
  const angularAcceleration=axis.dot(new THREE.Vector3().crossVectors(r,force))/PHYSICS.gondolaInertia-bodyFraction*frameAlpha.dot(axis);
  g.previousOmega.copy(omega);
  if(state.parking){
   // Parking servos return the gondolas to their indexed loading angles.
   g.angle+=clamp(-wrap(g.angle),-.35*dt,.35*dt);g.speed=0;
  }else integrateGondola(g,angularAcceleration,dt);
  g.node.quaternion.setFromAxisAngle(X,g.angle).multiply(g.rest);
  g.older.copy(g.previous);g.previous.copy(g.mount.matrixWorld);g.previousQ.copy(q);
 }
}
function syncGondolaState(){
 state.gondolasIndexed=gondolas.every(g=>Math.abs(wrap(g.angle))<.02&&Math.abs(g.speed)<.02);
 state.gondolasSecured=gondolas.every(g=>g.braked);
}
function commandRestraints(open){
 syncGondolaState();
 if(open&&!state.openRestraints()){message('Bügel öffnen: erst Ladestellung anfahren und alle Gondeln festbremsen.');return;}
 if(!open)state.closeRestraints();
 message(open?'Alle 16 Bügel öffnen …':'Alle 16 Bügel schließen und verriegeln …');
 updateUI();
}
function step(){
 if(!ready||state.paused)return;
 syncGondolaState();
 const restraintsWereMoving=state.restraints!==state.restraintTarget;
 state.step(dt);pose();swingStep();
 if(restraintsWereMoving&&state.restraints===state.restraintTarget)message(state.restraintsLocked?'Alle 16 Bügel geschlossen und verriegelt.':'Alle 16 Bügel geöffnet.');
 if(!state.parking&&parkBrakes){gondolas.forEach(g=>g.braked=true);parkBrakes=null;message('Ladestellung erreicht. Gondeln gebremst.');}
}
function setAllBrake(value){if(!value&&!state.restraintsLocked){message('Zum Lösen der Gondeln zuerst alle Bügel schließen.');return;}for(const g of gondolas){g.braked=value;g.speed=0;}message(value?'Alle Gondeln am aktuellen Winkel festgebremst.':'Gondeln frei: Schwerkraft und Fahrbewegung wirken auf die Sitze.');updateUI();}
function setRPM(value){if(!state.setRPM(value)){message('Bitte zuerst vollständig in Fahrstellung anheben.');$('rpm').value=state.rpmTarget;return;}$('rpm').value=state.rpmTarget;updateUI();}
function setMode(mode){if(!state.setMode(mode)){message('Bitte zuerst vollständig in Fahrstellung anheben.');return;}message({pendulum:'Pendelantrieb aktiv. Die Leistung bestimmt die Auslenkung.',left:'Dauerrotation des Arms nach links.',right:'Dauerrotation des Arms nach rechts.',hold:'Der Arm wird mit sanftem Bremsweg angehalten.',free:'Arm schwingt ohne Motorantrieb.'}[mode]);updateUI();}
function reset(){
 state.reset();parkBrakes=null;for(const g of gondolas){g.angle=0;g.speed=0;g.braked=true;g.node.quaternion.copy(g.rest);}
 pose();resetHistories();$('rpm').value=0;$('power').value=65;accumulator=0;message('Zuerst in Fahrstellung anheben.');updateUI();
}
function updateUI(){
 const moving=Math.abs(state.restraints-state.restraintTarget)>.00001;
 $('restraints-status').textContent=moving?(state.restraintTarget?'Öffnet …':'Schließt …'):(state.restraintsLocked?'16 / 16 verriegelt':'16 / 16 offen');
 $('restraints-open').classList.toggle('selected',state.restraintTarget===1);
 $('restraints-close').classList.toggle('selected',state.restraintsLocked);
 $('restraints-bar').style.width=(1-state.restraints)*100+'%';
 $('restraints-status').classList.toggle('unlocked',!state.restraintsLocked);
 $('rpm-live').textContent=state.rpm.toFixed(1).replace('.',',');
 $('arm-live').textContent=Math.round(THREE.MathUtils.radToDeg(wrap(state.arm)));
 $('lift-live').textContent=Math.round(state.lift*100);
 $('lift-bar').style.width=state.lift*100+'%';
 $('rpm-target').textContent=state.rpmTarget.toFixed(1).replace('.',',')+' U/min';
 $('power-value').textContent=Math.round(state.power*100)+' %';
 $('status').textContent=state.paused?'PAUSIERT':state.estopped?'NOT-HALT':state.parking?'RÜCKKEHR ZUR STATION':state.mode==='park180'?'ARM PARKT AUF 180°':state.ready?'FAHRBETRIEB':state.lift>0?'GESTELL IN BEWEGUNG':'LADESTELLUNG';
 $('pause').textContent=state.paused?'▶ Weiter':'Ⅱ Pause';
 for(const [id,mode] of [['pendulum','pendulum'],['arm-hold','hold'],['loop-left','left'],['loop-right','right']])$(id).classList.toggle('selected',state.mode===mode);
 $('brake').classList.toggle('selected',gondolas.every(g=>g.braked));$('release').classList.toggle('selected',gondolas.every(g=>!g.braked));
 gondolas.forEach((g,i)=>{const b=$('gondola-'+i);b.innerHTML='<b>G '+(i+1)+'</b>'+(g.braked?'GEBREMST':'FREI');b.classList.toggle('free',!g.braked);b.setAttribute('aria-pressed',String(g.braked));});
 $('raise').classList.toggle('selected',state.liftTarget===1);$('estop').style.borderColor=state.estopped?'#ff9477':'';
}
function chooseCamera(mode){
 camMode=mode;orbit.enabled=mode!=='seat';
 if(mode==='orbit'){camera.position.set(23,17,29);orbit.target.set(0,7,0);}
 if(mode==='front'){camera.position.set(0,11,36);orbit.target.set(0,7,0);}
 document.querySelectorAll('[data-camera]').forEach(b=>b.classList.toggle('selected',b.dataset.camera===mode));
 orbit.update();
}
function resize(){const v=$('viewport');renderer.setSize(v.clientWidth,v.clientHeight);camera.aspect=v.clientWidth/v.clientHeight;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe($('viewport'));
chooseCamera('orbit');
try{
 const gltf=await new GLTFLoader().loadAsync(new URL('../public/nightfly.glb', import.meta.url).href,p=>{$('load-progress').textContent='Modell laden · '+Math.round(100*p.loaded/(p.total||20212232))+' %';});
 model=gltf.scene;scene.add(model);model.updateMatrixWorld(true);
 tower=find('Tower tilt hinge');main=find('Main swing axis');rotor=find('Rotor axial rotation');
 for(let k=1;k<=4;k++){
  const id=String(k).padStart(2,'0'),node=find('Gondola '+id+' | four seats'),mount=find('Gondola '+id+' | outward mounting frame');
  mount.attach(node);node.position.set(0,0,0);model.updateMatrixWorld(true);
  const q=mount.getWorldQuaternion(new THREE.Quaternion());
  gondolas.push({node,mount,rest:node.quaternion.clone(),restOffset:new THREE.Vector3(0,-PHYSICS.gondolaCOM,0).applyQuaternion(q.clone().invert()),angle:0,speed:0,braked:true,previous:mount.matrixWorld.clone(),older:mount.matrixWorld.clone(),previousQ:q,previousOmega:new THREE.Vector3(),filteredAcceleration:0});
  const b=document.createElement('button');b.id='gondola-'+(k-1);b.title='Bremse Gondel '+k+' umschalten';b.onclick=()=>{const g=gondolas[k-1];if(g.braked&&!state.restraintsLocked){message('Zum Lösen der Gondel zuerst alle Bügel schließen.');return;}g.braked=!g.braked;g.speed=0;updateUI();};$('gondolas').appendChild(b);
 }
 for(let i=0;i<16;i++){
  const node=find('Seat restraint hinge'+(i?'.'+String(i).padStart(3,'0'):''));
  restraintHinges.push({node,closed:node.quaternion.clone()});
 }
 for(const suffix of ['', '.001']){
  const base=find('Lift cylinder | fixed base'+suffix),eye=find('Lift cylinder | upper eye'+suffix),rod=find('Lift cylinder | sliding chrome rod'+suffix);
  const length=base.getWorldPosition(new THREE.Vector3()).distanceTo(eye.getWorldPosition(new THREE.Vector3()))-2.55;
  hydraulics.push({base,eye,rod,initialScaleY:rod.scale.y,initialLength:length});
 }
 $('load-progress').textContent='Geometrie für den Browser optimieren …';
 const batches=optimizeModel([model,tower,main,rotor,...gondolas.map(g=>g.node),...restraintHinges.map(h=>h.node),...hydraulics.flatMap(h=>[h.base,h.rod])]);
 model.traverse(o=>{if(o.isMesh&&o.material){const m=o.material;if(m.emissiveIntensity>2)m.emissiveIntensity=1.8;}});
 ready=true;reset();$('controls').disabled=false;$('loader').remove();
 console.info('Nightfly ready:',batches,'material batches');
}catch(error){console.error(error);$('load-progress').textContent='Laden fehlgeschlagen: '+error.message;$('loader').querySelector('.spinner').style.display='none';}
$('raise').onclick=()=>{if(!state.raise()){message('Vor dem Anheben alle Bügel vollständig schließen und verriegeln.');return;}message('Gestell wird in Fahrstellung angehoben …');};
$('restraints-open').onclick=()=>commandRestraints(true);
$('restraints-close').onclick=()=>commandRestraints(false);
$('lower').onclick=()=>{parkBrakes=true;state.park();message('Antriebe werden geparkt, danach senkt sich das Gestell.');};
$('rpm').oninput=e=>setRPM(Number(e.target.value));
$('left').onclick=()=>setRPM(-12);$('right').onclick=()=>setRPM(12);$('rotor-stop').onclick=()=>setRPM(0);
$('pendulum').onclick=()=>setMode('pendulum');$('arm-hold').onclick=()=>setMode('hold');
$('loop-left').onclick=()=>setMode('left');$('loop-right').onclick=()=>setMode('right');
$('power').oninput=e=>{state.power=Number(e.target.value)/100;updateUI();};
$('release').onclick=()=>setAllBrake(false);$('brake').onclick=()=>setAllBrake(true);
$('estop').onclick=()=>{state.stop();parkBrakes=null;setAllBrake(true);message('Not-Halt: Antriebe bremsen. Mit Fahrstellung wieder freigeben.');};
$('reset').onclick=reset;$('pause').onclick=()=>{state.paused=!state.paused;accumulator=0;updateUI();};
$('help').onclick=()=>$('help-dialog').showModal();$('help-close').onclick=()=>$('help-dialog').close();
document.querySelectorAll('[data-camera]').forEach(b=>b.onclick=()=>chooseCamera(b.dataset.camera));
$('night').onclick=()=>{night=!night;scene.background.set(night?'#17283f':'#607f89');scene.fog.color.copy(scene.background);sun.intensity=night?.2:3.2;hemi.intensity=night?.55:2.2;renderer.toneMappingExposure=night?1.25:1.0;$('night').classList.toggle('selected',night);};
const heldArrows=new Set();
function applyManualKeys(){
 if(state.ready&&!state.paused){state.mode='free';state.manual=(heldArrows.has('arrowright')?1:0)-(heldArrows.has('arrowleft')?1:0);}
}
function runShortcut(action){
 if(action==='manual-left'||action==='manual-right'){heldArrows.add(action==='manual-left'?'arrowleft':'arrowright');applyManualKeys();return;}
 if(action==='rpm-down'||action==='rpm-up'){setRPM(state.rpmTarget+(action==='rpm-up'?.5:-.5));return;}
 if(action==='power-up'||action==='power-down'){state.power=clamp(state.power+(action==='power-up'?.05:-.05),.1,1);$('power').value=Math.round(state.power*100);updateUI();return;}
 if(action==='restraints-toggle'){commandRestraints(state.restraintTarget===0);return;}
 if(action==='brake-toggle'){setAllBrake(!gondolas.every(g=>g.braked));return;}
 if(action.startsWith('camera-')){chooseCamera(action.slice(7));return;}
 if(action==='help'){$('help-dialog').open?$('help-dialog').close():$('help-dialog').showModal();return;}
 if(action==='arm-park-180'){heldArrows.clear();state.manual=0;if(!state.parkArm180()){message('180°-Parken ist erst in Fahrstellung möglich.');return;}message('Arm fährt kontrolliert auf 180° Parkposition.');updateUI();return;}
 if(['pause','reset','estop','lower','arm-hold'].includes(action)){heldArrows.clear();state.manual=0;}
 $(action)?.click();
}
document.addEventListener('keydown',e=>{
 if(!ready)return;
 const binding=shortcutFor(e,$('help-dialog').open);
 if(!binding)return;
 e.preventDefault();runShortcut(binding.action);
});
document.addEventListener('keyup',e=>{
 const key=e.key.toLowerCase();
 if(['arrowleft','arrowright'].includes(key)){
  heldArrows.delete(key);
  state.manual=(heldArrows.has('arrowright')?1:0)-(heldArrows.has('arrowleft')?1:0);
 }
});
window.addEventListener('blur',()=>{heldArrows.clear();state.manual=0;});
for(const binding of HOTKEYS){
 const button=binding.action.startsWith('camera-')?document.querySelector('[data-camera="'+binding.action.slice(7)+'"]'):$(binding.action);
 if(button){button.dataset.key=binding.label;button.title=binding.description+' ('+binding.label+')';button.setAttribute('aria-keyshortcuts',binding.key===' '?'Space':binding.label);}
}
$('rpm').title='Q / E: Drehzahl in 0,5-U/min-Schritten';
$('power').title='+ / −: Antriebsleistung in 5-%-Schritten';
const keyTable=document.createElement('div');keyTable.className='shortcut-table';keyTable.id='shortcut-table';
for(const b of HOTKEYS){const row=document.createElement('div');const key=document.createElement('kbd');key.textContent=b.label;const text=document.createElement('span');text.textContent=b.description;row.append(key,text);keyTable.appendChild(row);}
$('help-close').before(keyTable);
document.addEventListener('visibilitychange',()=>{last=performance.now();accumulator=0;});
window.__nightfly={
 get ready(){return ready;},state,
 getStats:()=>({ready,restraints:state.restraints,restraintsLocked:state.restraintsLocked,restraintTarget:state.restraintTarget,restraintAngles:restraintHinges.map(h=>h.node.quaternion.angleTo(h.closed)),armLocalQuaternion:main?.quaternion.toArray(),armWorldQuaternion:main?.getWorldQuaternion(new THREE.Quaternion()).toArray(),drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,lift:state.lift,rpm:state.rpm,arm:state.arm,armSpeed:state.armSpeed,motor:state.motor,power:state.power,camera:camMode,night,mode:state.mode,gondolas:gondolas.map(g=>({angle:g.angle,speed:g.speed,braked:g.braked,pivotError:g.node.getWorldPosition(new THREE.Vector3()).distanceTo(g.mount.getWorldPosition(new THREE.Vector3()))}))}),
 advance(seconds){for(let i=0;i<seconds/dt;i++)step();updateUI();},
 reset, setRPM,setMode,setAllBrake,chooseCamera,
};
function animate(now){
 const elapsed=Math.min((now-last)/1000,.1);last=now;
 if(!document.hidden){accumulator+=elapsed;while(accumulator>=dt){step();accumulator-=dt;}}
 if(ready&&camMode==='seat'){
  const g=gondolas[0].node;
  const p=g.localToWorld(new THREE.Vector3(0,.45,.05)),look=g.localToWorld(new THREE.Vector3(0,.45,4));
  camera.position.copy(p);camera.up.copy(Y).applyQuaternion(g.getWorldQuaternion(new THREE.Quaternion()));camera.lookAt(look);
 }else{camera.up.copy(Y);orbit.update();}
 renderer.render(scene,camera);
 if(ready&&now-lastUi>100){updateUI();lastUi=now;}
 requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
