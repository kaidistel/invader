import * as THREE from 'three';

const $ = id => document.getElementById(id);
const mobile = matchMedia('(max-width:700px)').matches;

try {
  $('bootText').textContent = '3D-ENGINE GELADEN · MODELL WIRD AUFGEBAUT …';

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x86b8e6);
  scene.fog = new THREE.Fog(0xaacdea, 105, 190);

  const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.05, 400);
  const renderer = new THREE.WebGLRenderer({ antialias: !mobile, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.15 : 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  $('view').appendChild(renderer.domElement);

  let theta=.7, phi=1.15, radius=74, targetY=30, drag=false, lastX=0, lastY=0, pinch=0, cam='orbit';
  function orbit(){const s=Math.sin(phi);camera.position.set(Math.sin(theta)*s*radius,targetY+Math.cos(phi)*radius,Math.cos(theta)*s*radius);camera.lookAt(0,targetY,0)}
  orbit();

  const cv=renderer.domElement;
  cv.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY});
  cv.addEventListener('pointermove',e=>{if(!drag||cam!=='orbit')return;theta-=(e.clientX-lastX)*.006;phi=Math.max(.2,Math.min(1.48,phi+(e.clientY-lastY)*.006));lastX=e.clientX;lastY=e.clientY;orbit()});
  addEventListener('pointerup',()=>drag=false);
  cv.addEventListener('wheel',e=>{if(cam!=='orbit')return;e.preventDefault();radius=Math.max(8,Math.min(150,radius+e.deltaY*.05));orbit()},{passive:false});
  cv.addEventListener('touchstart',e=>{if(e.touches.length===2)pinch=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)},{passive:true});
  cv.addEventListener('touchmove',e=>{if(cam!=='orbit'||e.touches.length!==2)return;const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);if(pinch){radius=Math.max(8,Math.min(150,radius-(d-pinch)*.08));orbit()}pinch=d},{passive:true});

  scene.add(new THREE.HemisphereLight(0xeaf6ff,0x435334,2.15));
  const sun=new THREE.DirectionalLight(0xffffff,2.5);sun.position.set(30,90,35);scene.add(sun);
  const M={steel:new THREE.MeshStandardMaterial({color:0xd7dadd,metalness:.8,roughness:.4}),white:new THREE.MeshStandardMaterial({color:0xf4f4ef,metalness:.55,roughness:.42}),yellow:new THREE.MeshStandardMaterial({color:0xf5c400,metalness:.4,roughness:.4}),red:new THREE.MeshStandardMaterial({color:0x8b2028,metalness:.3,roughness:.5}),dark:new THREE.MeshStandardMaterial({color:0x15191f,metalness:.5,roughness:.4}),purple:new THREE.MeshStandardMaterial({color:0x6d2d73,metalness:.25,roughness:.5}),led:new THREE.MeshStandardMaterial({color:0xf1c95b,emissive:0xffc928,emissiveIntensity:.85})};
  function box(w,h,d,m,x=0,y=0,z=0,p=scene){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);p.add(o);return o}
  function cyl(r,h,m,x=0,y=0,z=0,p=scene,s=16){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,s),m);o.position.set(x,y,z);p.add(o);return o}
  function beam(a,b,r=.05,m=M.steel,p=scene){const v=new THREE.Vector3().subVectors(b,a),o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,v.length(),6),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());p.add(o);return o}

  const ground=new THREE.Mesh(new THREE.PlaneGeometry(220,220),new THREE.MeshStandardMaterial({color:0x78935a,roughness:1}));ground.rotation.x=-Math.PI/2;scene.add(ground);box(21,.5,18,M.steel,0,.25,0);box(19,5,.5,M.purple,0,3,-7.2);
  const tower=new THREE.Group();scene.add(tower);const H=80,h=1.2,c=[[-h,-h],[h,-h],[h,h],[-h,h]];for(const [x,z] of c)box(.18,H,.18,M.white,x,H/2+.8,z,tower);for(let yy=.8;yy<=80;yy+=4){for(let i=0;i<4;i++){const [x1,z1]=c[i],[x2,z2]=c[(i+1)%4];beam(new THREE.Vector3(x1,yy,z1),new THREE.Vector3(x2,yy,z2),.04,M.steel,tower);if(yy<77)beam(new THREE.Vector3(x1,yy,z1),new THREE.Vector3(x2,yy+4,z2),.033,M.steel,tower)}}box(.18,70,.22,M.yellow,-1.5,36,0,tower);box(.18,70,.22,M.yellow,1.5,36,0,tower);for(let yy=4;yy<21;yy+=1.15){box(.14,.72,.5,M.dark,-1.5,yy,0,tower);box(.14,.72,.5,M.dark,1.5,yy,0,tower)}cyl(1.8,.2,M.red,0,81.3,0,tower,24);
  const carriage=new THREE.Group(),rotator=new THREE.Group();scene.add(carriage);carriage.add(rotator);cyl(2,.42,M.yellow,0,0,0,rotator,24);cyl(1.45,.7,M.yellow,0,.35,0,rotator,16);for(let i=0;i<8;i++){const ang=i*Math.PI/4;beam(new THREE.Vector3(Math.cos(ang)*1.45,.4,Math.sin(ang)*1.45),new THREE.Vector3(Math.cos(ang)*1.9,2.6,Math.sin(ang)*1.9),.075,M.yellow,rotator)}cyl(1.85,.18,M.yellow,0,2.6,0,rotator,16);for(let i=0;i<24;i++){const ang=i*Math.PI*2/24,g=new THREE.Group();g.position.set(Math.cos(ang)*3.5,0,Math.sin(ang)*3.5);g.rotation.y=-ang+Math.PI/2;rotator.add(g);box(.62,.22,.72,M.red,0,-.1,0,g);box(.62,1.02,.18,M.red,0,.47,-.28,g);beam(new THREE.Vector3(-.28,.92,-.1),new THREE.Vector3(-.3,.1,.2),.042,M.yellow,g);beam(new THREE.Vector3(.28,.92,-.1),new THREE.Vector3(.3,.1,.2),.042,M.yellow,g)}const halo=new THREE.Mesh(new THREE.RingGeometry(2.2,4.55,mobile?28:56),M.led);halo.rotation.x=-Math.PI/2;halo.position.y=2.25;rotator.add(halo);box(2.9,1.25,2.9,M.red,0,1.2,0,rotator);box(2.45,1.02,2.45,M.yellow,0,1.25,0,rotator);

  let state='LOADING',locked=false,auto=false,rotation=true,estop=false,y=3.25,v=0,a=0,holdTimer=0;const loadY=3.25,topY=73.5,brakeY=20;
  function setState(s){state=s;$('state').textContent=s}function lock(){locked=true;$('restLamp').className='lamp on';$('restTxt').textContent='LOCKED';setState('LOCKED')}function unlock(){if(Math.abs(y-loadY)<.2){locked=false;$('restLamp').className='lamp';$('restTxt').textContent='OPEN';setState('LOADING')}}function release(){if(estop||!locked||y<25)return;v=0;setState('FREEFALL')}function cycle(){if(estop)return;lock();auto=true;setTimeout(()=>{if(auto&&!estop)setState('LIFTING')},300)}
  $('lock').onclick=lock;$('unlock').onclick=unlock;$('cycle').onclick=cycle;$('lift').onclick=()=>{if(!estop){lock();auto=false;setState('LIFTING')}};$('drop').onclick=release;$('return').onclick=()=>{if(!estop){auto=false;setState('RETURN')}};$('rotate').onclick=()=>rotation=!rotation;$('estop').onclick=()=>{estop=true;auto=false;v=0;setState('E-STOP')};$('resetView').onclick=()=>{theta=.7;phi=1.15;radius=74;targetY=30;cam='orbit';orbit()};function setCam(x){cam=x;$('cameraSel').value=x}$('cameraSel').onchange=e=>setCam(e.target.value);document.querySelectorAll('[data-cam]').forEach(b=>b.onclick=()=>setCam(b.dataset.cam));['hold','liftSpeed','rotSpeed'].forEach(id=>$(id).oninput=()=>{$('holdVal').textContent=(+$('hold').value).toFixed(1)+' s';$('liftVal').textContent=(+$('liftSpeed').value).toFixed(1)+' m/s';$('rotVal').textContent=(+$('rotSpeed').value).toFixed(1)+' rpm'});$('showData').onclick=()=>{$('dataPanel').classList.toggle('open');$('controlPanel').classList.remove('open')};$('showControl').onclick=()=>{$('controlPanel').classList.toggle('open');$('dataPanel').classList.remove('open')};
  const clock=new THREE.Clock();function update(dt){dt=Math.min(dt,.033);if(!estop){if(state==='LIFTING'){a=0;v=+$('liftSpeed').value;y+=v*dt;if(y>=topY){y=topY;v=0;holdTimer=0;setState('TOP HOLD')}}else if(state==='TOP HOLD'){a=0;v=0;holdTimer+=dt;if(auto&&holdTimer>=+$('hold').value)release()}else if(state==='FREEFALL'){a=-9.81;v+=a*dt;y+=v*dt;if(y<=brakeY){y=brakeY;setState('MAGNETIC BRAKE')}}else if(state==='MAGNETIC BRAKE'){a=20+Math.min(24,Math.abs(v));v+=a*dt;if(v>-.8)v=-.8;y+=v*dt;if(y<=loadY+1.4)setState('RETURN')}else if(state==='RETURN'){a=0;v=-.65;y+=v*dt;if(y<=loadY){y=loadY;v=0;setState('LOCKED');if(auto){auto=false;setTimeout(unlock,700)}}}else{a=0;v=0}}y=Math.max(loadY,Math.min(topY,y));carriage.position.y=y;if(rotation)rotator.rotation.y+=(+$('rotSpeed').value)*Math.PI*2/60*dt;$('height').textContent=y.toFixed(1)+' m';$('speed').textContent=Math.abs(v).toFixed(1)+' m/s';$('gforce').textContent=Math.max(0,1+a/9.81).toFixed(2)+' g';$('rpm').textContent=(rotation?+$('rotSpeed').value:0).toFixed(1)+' rpm';$('brakeLamp').className='lamp '+(state==='MAGNETIC BRAKE'?'warn':'on');$('brakeTxt').textContent=state==='MAGNETIC BRAKE'?'ACTIVE':'READY';if(cam==='ground'){camera.position.lerp(new THREE.Vector3(12,3.7,23),.08);camera.lookAt(0,42,0)}else if(cam==='tower'){camera.position.lerp(new THREE.Vector3(5.5,77,7),.08);camera.lookAt(0,y,0)}else if(cam==='onride'){const ang=6*Math.PI*2/24+rotator.rotation.y,pos=new THREE.Vector3(Math.cos(ang)*3.55,y+.55,Math.sin(ang)*3.55);camera.position.lerp(pos,.3);camera.lookAt(Math.cos(ang)*20,y+.3,Math.sin(ang)*20)}}
  function animate(){requestAnimationFrame(animate);update(clock.getDelta());renderer.render(scene,camera)}animate();addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});setState('LOADING');$('boot').classList.add('hidden');
} catch(e) {console.error(e);$('bootText').innerHTML='START FEHLGESCHLAGEN<br><small>'+String(e.message||e)+'</small>';$('state').textContent='ERROR';}
