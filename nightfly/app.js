import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RidePhysics,LIFT_ANGLE,RIDE_LIFT,MAX_LIFT,wrap,clamp} from './physics.mjs';
const $=id=>document.getElementById(id),deg=r=>r*180/Math.PI;
let engine,paused=false,ready=false,cameraPreset='overview';
const viewport=$('viewport'),scene=new THREE.Scene();scene.background=new THREE.Color('#18232d');scene.fog=new THREE.Fog('#18232d',55,115);
THREE.Object3D.DEFAULT_UP.set(0,0,1);
const camera=new THREE.PerspectiveCamera(43,1,.08,180);camera.up.set(0,0,1);camera.position.set(17,-29,16);
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});}catch(error){fail('WebGL ist in diesem Browser nicht verfügbar. Bitte prüfe, ob die Hardwarebeschleunigung aktiviert ist.');throw error;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;viewport.appendChild(renderer.domElement);
const orbit=new OrbitControls(camera,renderer.domElement);orbit.target.set(0,-1.5,5.5);orbit.enableDamping=true;orbit.minDistance=3;orbit.maxDistance=65;orbit.maxPolarAngle=Math.PI*.485;orbit.update();
const ambient=new THREE.HemisphereLight('#e0ecff','#687078',2.5);ambient.position.set(0,0,35);scene.add(ambient);
const sun=new THREE.DirectionalLight('#fff2d6',3.2);sun.position.set(-13,-18,28);sun.castShadow=true;sun.shadow.mapSize.set(1536,1536);Object.assign(sun.shadow.camera,{left:-17,right:17,top:21,bottom:-18,near:.1,far:75});sun.shadow.bias=-.0004;sun.shadow.normalBias=.035;scene.add(sun);
const fill=new THREE.DirectionalLight('#bddfff',1.2);fill.position.set(15,6,15);scene.add(fill);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(240,240),new THREE.MeshStandardMaterial({color:'#273440',roughness:1,metalness:0}));ground.position.z=-.04;ground.receiveShadow=true;scene.add(ground);
const grid=new THREE.GridHelper(70,35,'#3b4b57','#30404d');grid.rotation.x=Math.PI/2;grid.position.z=-.025;grid.material.transparent=true;grid.material.opacity=.28;scene.add(grid);
const groups={};const hingeVectors=[];const hydraulic=[];const markers=[];
function fail(message){$('loading').hidden=true;$('error').hidden=false;$('error-text').textContent=message;$('mode').textContent='Ladefehler';}
async function inflate(url){const response=await fetch(url);if(!response.ok)throw new Error(`Datei nicht verfügbar (${response.status}).`);return new Response(response.body.pipeThrough(new DecompressionStream('gzip')));}
function positionBetween(mesh,a,b){mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize());mesh.scale.y=a.distanceTo(b);}
function makeHydraulics(){for(const x of [-.72,.72]){
 const a=new THREE.Vector3(x,3.8,.85),tip=new THREE.Vector3(x,2.1,5.85).sub(groups.lift.position);
 const barrel=new THREE.Mesh(new THREE.CylinderGeometry(.19,.19,1,16),new THREE.MeshStandardMaterial({color:'#efbb24',metalness:.6,roughness:.35}));
 const piston=new THREE.Mesh(new THREE.CylinderGeometry(.10,.10,1,16),new THREE.MeshStandardMaterial({color:'#c3cbd2',metalness:.85,roughness:.24}));barrel.castShadow=piston.castShadow=true;scene.add(barrel,piston);hydraulic.push({a,tip,barrel,piston});
 }}
function makeMarker(k){const canvas=document.createElement('canvas');canvas.width=canvas.height=96;const ctx=canvas.getContext('2d');ctx.fillStyle='#111a22';ctx.beginPath();ctx.arc(48,48,35,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ffcd32';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#ffcd32';ctx.font='bold 38px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(k+1),48,49);const tex=new THREE.CanvasTexture(canvas),sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthTest:false,transparent:true}));sprite.scale.set(.56,.56,.56);sprite.position.set(0,0,1.15);groups['gondola'+k].add(sprite);markers.push(sprite);}
function makeTube(points,r,material){const curve=new THREE.CatmullRomCurve3(points,false,'centripetal');const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,20,r,7,false),material);mesh.castShadow=true;return mesh;}
function enhanceGondolas(){
 const steel=new THREE.MeshStandardMaterial({color:'#c7d0d6',metalness:.82,roughness:.28});
 const yellow=new THREE.MeshStandardMaterial({color:'#f3bd1f',metalness:.42,roughness:.34});
 const dark=new THREE.MeshStandardMaterial({color:'#171b20',metalness:.08,roughness:.72});
 for(let k=0;k<4;k++){
  const g=groups['gondola'+k],t=k*Math.PI/2,radial=new THREE.Vector3(Math.cos(t),Math.sin(t),0),axle=new THREE.Vector3(-Math.sin(t),Math.cos(t),0),up=new THREE.Vector3(0,0,1);
  const axleMesh=new THREE.Mesh(new THREE.CylinderGeometry(.105,.105,3.62,18),steel);axleMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),axle);axleMesh.castShadow=true;g.add(axleMesh);
  for(const s of [-1,1]){
   const end=axle.clone().multiplyScalar(s*1.70);
   const cap=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.18,18),yellow);cap.position.copy(end);cap.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),axle);g.add(cap);
   const pts=[];for(let i=0;i<=12;i++){const a=-.55+i*(Math.PI*1.32/12);pts.push(end.clone().add(radial.clone().multiplyScalar(.62*Math.sin(a))).add(up.clone().multiplyScalar(.72*Math.cos(a)-.05)));}
   g.add(makeTube(pts,.026,steel));
   for(const f of [.22,.42,.62,.82]){const a=-.55+f*Math.PI*1.32,p=end.clone().add(radial.clone().multiplyScalar(.62*Math.sin(a))).add(up.clone().multiplyScalar(.72*Math.cos(a)-.05));const q=p.clone().add(radial.clone().multiplyScalar(-.25));g.add(makeTube([p,q],.012,steel));}
  }
  // Reference-photo pass: yellow outer shells with narrower black padded backs.
  // This gives the four high-back seats the strong yellow outline visible on Nightfly.
  const right=axle.clone().multiplyScalar(-1),basis=new THREE.Matrix4().makeBasis(right,radial,up),seatQ=new THREE.Quaternion().setFromRotationMatrix(basis);
  for(let j=0;j<4;j++){
   const center=axle.clone().multiplyScalar((j-1.5)*.68).add(radial.clone().multiplyScalar(-.12)).add(up.clone().multiplyScalar(-.10));
   const shell=new THREE.Mesh(new THREE.BoxGeometry(.55,.16,.78),yellow);shell.position.copy(center).add(radial.clone().multiplyScalar(-.015));shell.quaternion.copy(seatQ);shell.castShadow=true;g.add(shell);
   const pad=new THREE.Mesh(new THREE.BoxGeometry(.46,.115,.68),dark);pad.position.copy(center).add(radial.clone().multiplyScalar(.035));pad.quaternion.copy(seatQ);pad.castShadow=true;g.add(pad);
  }
 }
}
function syncPose(){
 const liftAngle=LIFT_ANGLE*engine.lift;
 groups.lift.rotation.x=liftAngle;
 // Pegasus 16 geometry: the swing axle is rigidly mounted to the lifting boom.
 // Do NOT cancel the parent's X rotation. Local Y therefore tilts together with
 // the boom and the long arm naturally sits oblique in the raised ride pose.
 groups.rotor.rotation.set(0,engine.mainAngle,0);
 groups.crown.rotation.z=engine.spinAngle;
 for(let k=0;k<4;k++)groups['gondola'+k].quaternion.setFromAxisAngle(hingeVectors[k],engine.gondolas[k].angle);
 scene.updateMatrixWorld(true);
 for(const h of hydraulic){const b=groups.lift.localToWorld(h.tip.clone()),delta=b.clone().sub(h.a);const middle=h.a.clone().addScaledVector(delta,.58);positionBetween(h.barrel,h.a,middle);positionBetween(h.piston,middle,b);}
}
function syncUI(){
 $('lift-out').textContent=`${Math.round(engine.lift*100)} %`;$('swing-out').textContent=`${Math.round(deg(engine.mainAngle))}°`;$('spin-out').textContent=`${(engine.spinVelocity*60/(2*Math.PI)).toFixed(1)} U/min`;
 $('load').classList.toggle('selected',engine.liftTarget===0||engine.parking);$('ride').classList.toggle('selected',Math.abs(engine.liftTarget-RIDE_LIFT)<.001&&!engine.parking);
 $('swing').disabled=$('spin').disabled=!engine.canDrive;$('brake').disabled=engine.parking;
 $('swing').classList.toggle('active',engine.swingOn);$('spin').classList.toggle('active',engine.spinOn);
 $('swing').innerHTML=engine.swingOn?'Schwingen stoppen <span>↔</span>':'Schwingen starten <span>↔</span>';$('spin').innerHTML=engine.spinOn?'Drehung stoppen <span>⟳</span>':'Drehung starten <span>⟳</span>';
 let count=0;for(let k=0;k<4;k++){const g=engine.gondolas[k];if(g.brake)count++;$('gangle'+k).textContent=`${Math.round(deg(wrap(g.angle)))}°`;$('gbrake'+k).textContent=g.brake?'Fest':'Frei';$('gbrake'+k).classList.toggle('free',!g.brake);$('gbrake'+k).setAttribute('aria-pressed',String(g.brake));$('gbrake'+k).disabled=engine.parking;}
 $('brake-count').textContent=`${count} / 4 fest`;$('brake').textContent=count===4?'Alle Gondeln freigeben':'Alle Gondeln bremsen';$('brake').classList.toggle('released',count<4);
 $('mode').textContent=paused?'Simulation pausiert':engine.parking?'Richtet sich zur Beladung aus':engine.lift<.01?'Ladeposition':!engine.canDrive?'Hubarm bewegt sich':engine.swingOn||engine.spinOn?'Fahrt läuft':'Fahrposition';
 $('lift-hint').textContent=engine.parking?'Schaukelbewegung neutralisieren, Gondeln ausrichten, dann absenken.':engine.canDrive?'Fahrposition erreicht – die Schaukelachse bleibt starr am geneigten Hubarm.':'Zum Starten zuerst in Fahrposition anheben.';
}
function setCamera(preset){cameraPreset=preset;document.querySelectorAll('[data-camera]').forEach(b=>b.classList.toggle('selected',b.dataset.camera===preset));const center=groups.crown?groups.crown.getWorldPosition(new THREE.Vector3()):new THREE.Vector3(0,-2.8,2.4);
 if(preset==='front'){camera.position.set(0,-32,10);orbit.target.set(0,-1,6);}else if(preset==='seats'){camera.position.copy(center).add(new THREE.Vector3(5.2,-7.5,3.8));orbit.target.copy(center);}else{camera.position.set(17,-29,16);orbit.target.set(0,-1.5,5.5);}orbit.update();}
try{
 const response=await inflate('./assets/nightfly.json.gz'),model=await response.json();engine=new RidePhysics(model.origins);
 for(const name of ['static','lift','rotor','crown','gondola0','gondola1','gondola2','gondola3']){const group=new THREE.Group();group.name=name;groups[name]=group;const parentName=name==='rotor'?'lift':name==='crown'?'rotor':name.startsWith('gondola')?'crown':null;const origin=new THREE.Vector3(...model.origins[name]);if(parentName){group.position.copy(origin).sub(new THREE.Vector3(...model.origins[parentName]));groups[parentName].add(group);}else{group.position.copy(origin);scene.add(group);}}
 const materials={},loader=new THREE.TextureLoader();
 await Promise.all(Object.entries(model.materials).map(async([name,spec])=>{const settings={color:spec.color,metalness:spec.metalness,roughness:Math.max(.35,spec.roughness),side:THREE.DoubleSide};if(spec.emissive){settings.emissive=spec.emissive;settings.emissiveIntensity=.65;}if(spec.map){const tex=await loader.loadAsync('./assets/'+spec.map);tex.colorSpace=THREE.SRGBColorSpace;tex.flipY=false;tex.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);settings.map=tex;}materials[name]=new THREE.MeshStandardMaterial(settings);}));
 for(const part of model.meshes){const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(part.positions,3));geo.setIndex(part.indices);if(part.uv)geo.setAttribute('uv',new THREE.Float32BufferAttribute(part.uv,2));geo.computeVertexNormals();const mesh=new THREE.Mesh(geo,materials[part.material]);mesh.name=part.name;mesh.castShadow=!/bulb|wire|Lettering/.test(part.name);mesh.receiveShadow=true;groups[part.group].add(mesh);}
 for(let k=0;k<4;k++){hingeVectors.push(new THREE.Vector3(...model.hinges[k]));$('gondolas').insertAdjacentHTML('beforeend',`<div class="gondola"><span>Gondel ${k+1}</span><output id="gangle${k}">0°</output><button id="gbrake${k}" aria-label="Bremse Gondel ${k+1}" aria-pressed="true">Fest</button></div>`);$('gbrake'+k).addEventListener('click',()=>{engine.gondolas[k].brake=!engine.gondolas[k].brake;syncUI();});makeMarker(k);}
 enhanceGondolas();makeHydraulics();syncPose();syncUI();ready=true;$('loading').hidden=true;
}catch(error){console.error(error);fail(error.message||'Bitte lade die Seite erneut.');}
$('load').onclick=()=>{if(!ready)return;engine.setLift(0);$('lift').value=0;};$('ride').onclick=()=>{if(!ready)return;engine.setLift(RIDE_LIFT);$('lift').value=Math.round(RIDE_LIFT*100);};$('lift').oninput=e=>{if(ready)engine.setLift(Math.min(Number(e.target.value)/100,MAX_LIFT));};
$('swing').onclick=()=>{if(ready)engine.setSwing(!engine.swingOn);};$('spin').onclick=()=>{if(ready)engine.setSpin(!engine.spinOn);};$('brake').onclick=()=>{if(ready){engine.setBrakes(!engine.gondolas.every(g=>g.brake));syncUI();}};
$('amplitude').oninput=e=>{let v=Number(e.target.value);if(ready){const max=Math.floor(deg(engine.safeAmplitude));v=Math.min(v,max);e.target.value=v;engine.amplitude=v*Math.PI/180;}$('amplitude-out').value=v+'°';};$('swing-speed').oninput=e=>{const v=Number(e.target.value);$('swing-speed-out').value=v+'°/s';if(ready)engine.swingSpeed=v*Math.PI/180;};$('spin-speed').oninput=e=>{const v=Number(e.target.value);$('spin-speed-out').value=v+' U/min';if(ready)engine.spinRPM=v;};
$('pause').onclick=()=>{paused=!paused;$('pause').textContent=paused?'Fortsetzen':'Pause';if(ready)syncUI();};
$('reset').onclick=()=>{if(!ready)return;engine.reset();paused=false;$('pause').textContent='Pause';$('lift').value=0;$('amplitude').value=78;$('amplitude-out').value='78°';$('swing-speed').value=20;$('swing-speed-out').value='20°/s';$('spin-speed').value=6;$('spin-speed-out').value='6 U/min';syncPose();syncUI();setCamera('overview');};
$('download').onclick=async()=>{const button=$('download');button.disabled=true;try{const response=await inflate('./assets/Nightfly_korrigiert.glb.gz'),blob=await response.blob(),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Nightfly_korrigiert.glb';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}catch(error){button.textContent='Download erneut versuchen';}finally{button.disabled=false;}};
for(const button of document.querySelectorAll('[data-camera]'))button.onclick=()=>setCamera(button.dataset.camera);
new ResizeObserver(()=>{const w=viewport.clientWidth,h=viewport.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}).observe(viewport);
let previous=performance.now(),accumulator=0,lastUI=0;function animate(now){requestAnimationFrame(animate);const elapsed=Math.min((now-previous)/1000,.075);previous=now;if(ready&&!paused){accumulator+=elapsed;while(accumulator>=1/120){engine.step(1/120);accumulator-=1/120;}syncPose();}if(ready&&now-lastUI>90){syncUI();lastUI=now;}orbit.update();renderer.render(scene,camera);}requestAnimationFrame(animate);
document.addEventListener('visibilitychange',()=>{previous=performance.now();accumulator=0;});
window.nightfly={get state(){return engine;},groups,scene};
