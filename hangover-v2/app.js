import * as THREE from 'three';

const $=id=>document.getElementById(id);
const mobile=matchMedia('(max-width:700px)').matches;

try{
$('bootText').textContent='3D-ENGINE GELADEN · ULTRA DETAIL WIRD AUFGEBAUT …';
const scene=new THREE.Scene();scene.background=new THREE.Color(0x87b7e4);scene.fog=new THREE.Fog(0xa8cae6,120,230);
const camera=new THREE.PerspectiveCamera(50,innerWidth/innerHeight,.04,420);
const renderer=new THREE.WebGLRenderer({antialias:!mobile,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.1:1.8));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;$('view').appendChild(renderer.domElement);
let theta=.72,phi=1.08,radius=72,targetY=28,drag=false,lastX=0,lastY=0,pinch=0,cam='orbit';
function orbit(){const s=Math.sin(phi);camera.position.set(Math.sin(theta)*s*radius,targetY+Math.cos(phi)*radius,Math.cos(theta)*s*radius);camera.lookAt(0,targetY,0)}orbit();
const cv=renderer.domElement;cv.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY});cv.addEventListener('pointermove',e=>{if(!drag||cam!=='orbit')return;theta-=(e.clientX-lastX)*.006;phi=Math.max(.18,Math.min(1.5,phi+(e.clientY-lastY)*.006));lastX=e.clientX;lastY=e.clientY;orbit()});addEventListener('pointerup',()=>drag=false);cv.addEventListener('wheel',e=>{if(cam!=='orbit')return;e.preventDefault();radius=Math.max(7,Math.min(155,radius+e.deltaY*.05));orbit()},{passive:false});cv.addEventListener('touchstart',e=>{if(e.touches.length===2)pinch=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)},{passive:true});cv.addEventListener('touchmove',e=>{if(cam!=='orbit'||e.touches.length!==2)return;const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);if(pinch){radius=Math.max(7,Math.min(155,radius-(d-pinch)*.08));orbit()}pinch=d},{passive:true});
scene.add(new THREE.HemisphereLight(0xeaf6ff,0x39472c,2.2));const sun=new THREE.DirectionalLight(0xffffff,2.8);sun.position.set(28,92,34);scene.add(sun);const fill=new THREE.DirectionalLight(0xc9dcff,.55);fill.position.set(-30,35,-25);scene.add(fill);
const M={galv:new THREE.MeshStandardMaterial({color:0xd1d7da,metalness:.9,roughness:.32}),galvD:new THREE.MeshStandardMaterial({color:0x7b858a,metalness:.93,roughness:.27}),white:new THREE.MeshStandardMaterial({color:0xf0f1ed,metalness:.65,roughness:.35}),yellow:new THREE.MeshStandardMaterial({color:0xf3c500,metalness:.48,roughness:.33}),yellowD:new THREE.MeshStandardMaterial({color:0xb88900,metalness:.55,roughness:.35}),red:new THREE.MeshStandardMaterial({color:0x86151d,metalness:.34,roughness:.42}),redB:new THREE.MeshStandardMaterial({color:0xc62d34,metalness:.3,roughness:.38}),purple:new THREE.MeshStandardMaterial({color:0x6d2876,metalness:.28,roughness:.42}),purpleD:new THREE.MeshStandardMaterial({color:0x2c1235,metalness:.22,roughness:.52}),blue:new THREE.MeshStandardMaterial({color:0x244f8d,metalness:.22,roughness:.44}),dark:new THREE.MeshStandardMaterial({color:0x11161c,metalness:.66,roughness:.28}),rubber:new THREE.MeshStandardMaterial({color:0x07090b,metalness:.02,roughness:.9}),pad:new THREE.MeshStandardMaterial({color:0x171b20,metalness:.05,roughness:.83}),skin:new THREE.MeshStandardMaterial({color:0xd8a27f,roughness:.8}),denim:new THREE.MeshStandardMaterial({color:0x23395a,roughness:.75}),ledW:new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xf8fbff,emissiveIntensity:1.3}),ledY:new THREE.MeshStandardMaterial({color:0xffd25b,emissive:0xffb321,emissiveIntensity:1.45}),ledB:new THREE.MeshStandardMaterial({color:0x5fa9ff,emissive:0x317cff,emissiveIntensity:1.6}),concrete:new THREE.MeshStandardMaterial({color:0x777c7e,roughness:.92}),deck:new THREE.MeshStandardMaterial({color:0x5d6468,metalness:.65,roughness:.48})};
const seg=mobile?8:12,fine=mobile?12:24;
function box(w,h,d,m,x=0,y=0,z=0,p=scene){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);p.add(o);return o}
function cyl(r,h,m,x=0,y=0,z=0,p=scene,s=seg){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,s),m);o.position.set(x,y,z);p.add(o);return o}
function tube(a,b,r=.04,m=M.galv,p=scene,s=seg){const v=new THREE.Vector3().subVectors(b,a),o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,v.length(),s),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.clone().normalize());p.add(o);return o}
function torus(R,r,m,p=scene,rx=Math.PI/2){const o=new THREE.Mesh(new THREE.TorusGeometry(R,r,mobile?6:10,fine),m);o.rotation.x=rx;p.add(o);return o}
function bulb(x,y,z,m,p=scene,r=.055){const o=new THREE.Mesh(new THREE.SphereGeometry(r,mobile?5:7,mobile?4:6),m);o.position.set(x,y,z);p.add(o);return o}
function rail(x1,z1,x2,z2,y=.72,h=.95,p=scene){for(const [x,z] of [[x1,z1],[x2,z2]])tube(new THREE.Vector3(x,y,z),new THREE.Vector3(x,y+h,z),.026,M.galv,p);tube(new THREE.Vector3(x1,y+h,z1),new THREE.Vector3(x2,y+h,z2),.028,M.galv,p);tube(new THREE.Vector3(x1,y+h*.52,z1),new THREE.Vector3(x2,y+h*.52,z2),.021,M.galv,p)}

// Ground + transportable base
const ground=new THREE.Mesh(new THREE.PlaneGeometry(240,240),new THREE.MeshStandardMaterial({color:0x748d55,roughness:1}));ground.rotation.x=-Math.PI/2;scene.add(ground);
const base=new THREE.Group();scene.add(base);box(23,.42,19,M.galvD,0,.24,0,base);box(21.8,.22,17.8,M.deck,0,.55,0,base);
for(let x=-10;x<=10;x+=1.1)box(.025,.018,17.4,M.galv,x,.675,0,base);for(let z=-8;z<=8;z+=1.1)box(21.4,.018,.025,M.galv,0,.68,z,base);
for(const sx of [-1,1]){box(7.2,.52,.58,M.galvD,sx*13.4,.38,0,base);box(1.7,.24,2.7,M.concrete,sx*16.25,.17,0,base);box(.85,.75,.85,M.galvD,sx*16.15,.72,0,base)}
for(const sz of [-1,1]){box(.62,.52,5.5,M.galvD,0,.38,sz*10.7,base);box(2.7,.24,1.7,M.concrete,0,.17,sz*13.2,base)}
for(let i=0;i<6;i++)box(3.4,.16,.62,M.deck,-7.2,.22+i*.17,9.35-i*.5,base);for(const sx of [-1,1])tube(new THREE.Vector3(-7.2+sx*1.65,.4,9.6),new THREE.Vector3(-7.2+sx*1.65,1.55,6.6),.035,M.galv,base);
rail(-10.4,-7.8,10.4,-7.8,.72,.98,base);rail(10.4,-7.8,10.4,7.7,.72,.98,base);rail(-10.4,-7.8,-10.4,7.7,.72,.98,base);rail(10.4,7.7,4.2,7.7,.72,.98,base);rail(-4.2,7.7,-10.4,7.7,.72,.98,base);
// queue maze
for(const z of [4.7,5.9,7.1]){rail(-3.6,z,3.6,z,.72,.92,base)}for(const x of [-3.6,3.6])rail(x,4.7,x,7.1,.72,.92,base);
// cabinets / operator booth
box(2.2,2.1,1.2,M.galvD,7.9,1.75,-5.9,base);box(2.0,1.7,1.05,M.dark,7.9,1.78,-5.85,base);box(1.5,.75,.05,M.blue,7.9,2.02,-5.29,base);for(let i=0;i<5;i++)bulb(7.25+i*.32,2.28,-5.24,i%2?M.ledY:M.ledB,base,.045);
box(1.25,2.2,.7,M.galvD,-8.3,1.8,-6.1,base);for(let y=1.1;y<2.7;y+=.34)box(.75,.04,.03,M.dark,-8.3,y,-5.72,base);

// Show facade
box(20.5,5.5,.45,M.purpleD,0,3.45,-8.3,base);box(19.8,4.9,.18,M.purple,0,3.46,-8.03,base);
for(let x=-9;x<=9;x+=2){box(1.25,4.15,.08,(Math.round(x)%4===0?M.blue:M.purpleD),x,3.4,-7.88,base);for(let y=1.55;y<5.4;y+=.42)bulb(x,y,-7.79,M.ledB,base,.045)}
// vegas skyline blocks
for(const x of [-7.6,-5.9,-4.4,4.5,6.1,7.8]){const h=1.5+((Math.abs(x)*7)%2.5);box(1.05,h,.12,M.dark,x,1.05+h/2,-7.66,base);for(let y=1.3;y<1+h;y+=.38)for(const dx of [-.28,.28])bulb(x+dx,y,-7.57,M.ledY,base,.035)}
// giant sign body
const sign=new THREE.Group();sign.position.set(0,6.25,-7.75);base.add(sign);box(14.2,1.7,.36,M.purpleD,0,0,0,sign);box(13.55,1.2,.42,M.redB,0,.02,.08,sign);box(8.7,.46,.5,M.dark,0,-1.0,.04,sign);
for(let i=0;i<42;i++){const x=-6.65+i*(13.3/41);bulb(x,.67,.29,M.ledW,sign,.055);bulb(x,-.67,.29,M.ledW,sign,.055)}for(let i=0;i<12;i++){const x=-4.1+i*.75;bulb(x,-1.0,.31,i%2?M.ledB:M.ledY,sign,.05)}
// stylized HANGOVER lettering as dimensional bars
const letters=[[-5.2,1.4],[-3.8,1.0],[-2.45,1.15],[-1.0,1.15],[.45,1.25],[1.95,1.15],[3.35,1.0],[4.75,1.15]];for(const [x,w] of letters){box(w,.42,.12,M.ledY,x,.07,.29,sign)}
// side decorative pylons
for(const sx of [-1,1]){const px=sx*10.7;box(.7,6.2,.65,M.purpleD,px,3.7,-7.8,base);for(let y=1;y<6.6;y+=.35)bulb(px,y,-7.42,y%1<.5?M.ledB:M.ledW,base,.045);tube(new THREE.Vector3(px,6.7,-7.8),new THREE.Vector3(px+sx*1.4,8.2,-7.8),.11,M.purple,base)}

// Tower mast
const tower=new THREE.Group();scene.add(tower);const H=80,half=1.18,corners=[[-half,-half],[half,-half],[half,half],[-half,half]];
for(const [x,z] of corners){box(.2,H,.2,M.white,x,H/2+.82,z,tower);for(let yy=1.4;yy<80;yy+=4)cyl(.16,.16,M.galvD,x,yy,z,tower,10)}
for(let yy=.8;yy<=80;yy+=2){for(let i=0;i<4;i++){const [x1,z1]=corners[i],[x2,z2]=corners[(i+1)%4];tube(new THREE.Vector3(x1,yy,z1),new THREE.Vector3(x2,yy,z2),.038,M.galv,tower);if(yy<78.8){tube(new THREE.Vector3(x1,yy,z1),new THREE.Vector3(x2,yy+2,z2),.03,M.galv,tower);tube(new THREE.Vector3(x2,yy,z2),new THREE.Vector3(x1,yy+2,z1),.03,M.galv,tower)}}}
// central ladder and service platforms
for(let yy=2;yy<79;yy+=.5)box(.75,.035,.04,M.galv,0,yy,1.24,tower);tube(new THREE.Vector3(-.42,2,1.24),new THREE.Vector3(-.42,79,1.24),.026,M.galv,tower);tube(new THREE.Vector3(.42,2,1.24),new THREE.Vector3(.42,79,1.24),.026,M.galv,tower);
for(const yy of [20,40,60]){box(3.2,.1,2.8,M.galvD,0,yy,0,tower);rail(-1.5,-1.2,1.5,-1.2,yy,.85,tower);rail(-1.5,1.2,1.5,1.2,yy,.85,tower)}
// guide rails + cable channels
box(.18,72,.28,M.yellow,-1.48,37,0,tower);box(.18,72,.28,M.yellow,1.48,37,0,tower);box(.22,72,.16,M.dark,0,37,-.68,tower);box(.22,72,.16,M.dark,0,37,.68,tower);
for(let yy=2.8;yy<74;yy+=2){box(.48,.1,.18,M.yellowD,-1.34,yy,0,tower);box(.48,.1,.18,M.yellowD,1.34,yy,0,tower);tube(new THREE.Vector3(-1.15,yy,-.78),new THREE.Vector3(-1.48,yy,0),.025,M.yellow,tower);tube(new THREE.Vector3(1.15,yy,-.78),new THREE.Vector3(1.48,yy,0),.025,M.yellow,tower)}
// magnetic brake packs
for(let yy=4.2;yy<22;yy+=.68){for(const sx of [-1,1]){box(.15,.52,.84,M.dark,sx*1.54,yy,0,tower);box(.08,.46,.7,M.galvD,sx*1.64,yy,0,tower);box(.04,.5,.12,M.yellowD,sx*1.7,yy,0,tower)}}
// ropes and pulleys
for(const x of [-.52,.52])tube(new THREE.Vector3(x,2,-.88),new THREE.Vector3(x,80,-.88),.022,M.dark,tower);for(let yy=4;yy<80;yy+=4)box(.42,.06,.09,M.galvD,-.52,yy,-.88,tower);
const crown=new THREE.Group();crown.position.y=80.75;tower.add(crown);box(3.4,.34,3.4,M.galvD,0,.12,0,crown);for(const [x,z] of corners)tube(new THREE.Vector3(x,0,z),new THREE.Vector3(x*.72,2.15,z*.72),.065,M.galv,crown);box(2.2,.26,2.2,M.yellowD,0,2.05,0,crown);
for(const x of [-.62,.62]){const p=cyl(.52,.28,M.dark,x,2.35,-.12,crown,20);p.rotation.z=Math.PI/2;torus(.38,.07,M.galvD,crown,0).position.set(x,2.35,-.12)}
box(1.5,.85,1.3,M.dark,0,1.35,.3,crown);for(let i=0;i<4;i++)bulb(-.45+i*.3,1.48,.98,i<2?M.ledY:M.ledB,crown,.04);
// aviation marker lamps
for(const [x,z] of corners)bulb(x,2.6,z,M.ledB,crown,.08);

// Gondola carriage / guide trolley
const carriage=new THREE.Group(),spin=new THREE.Group();scene.add(carriage);carriage.add(spin);
const trolley=new THREE.Group();carriage.add(trolley);box(3.15,2.6,2.3,M.galvD,0,1.15,0,trolley);box(2.7,2.15,1.95,M.yellow,0,1.2,0,trolley);box(2.25,1.75,1.55,M.red,0,1.18,0,trolley);
for(const sx of [-1,1])for(const sy of [.35,1.95]){const r=cyl(.22,.16,M.rubber,sx*1.48,sy,-.9,trolley,12);r.rotation.z=Math.PI/2;const r2=cyl(.22,.16,M.rubber,sx*1.48,sy,.9,trolley,12);r2.rotation.z=Math.PI/2}
for(const sx of [-1,1]){box(.18,2.25,.32,M.yellowD,sx*1.66,1.18,0,trolley);for(let yy=.35;yy<2.2;yy+=.44)box(.3,.08,.55,M.galvD,sx*1.7,yy,0,trolley)}
// radial spider frame
cyl(2.05,.42,M.yellow,0,.1,0,spin,28);cyl(1.45,.76,M.yellowD,0,.48,0,spin,20);for(let i=0;i<12;i++){const a=i*Math.PI*2/12;tube(new THREE.Vector3(Math.cos(a)*1.3,.4,Math.sin(a)*1.3),new THREE.Vector3(Math.cos(a)*3.45,.05,Math.sin(a)*3.45),.09,i%2?M.galvD:M.yellow,spin)}
// layered canopy / LED platter
torus(2.65,.22,M.yellow,spin);torus(3.25,.18,M.yellowD,spin);torus(3.92,.24,M.yellow,spin);torus(4.38,.16,M.redB,spin);box(2.6,1.0,2.6,M.red,0,1.0,0,spin);box(2.2,.72,2.2,M.yellow,0,1.1,0,spin);
const ledCount=mobile?48:96;for(let i=0;i<ledCount;i++){const a=i*Math.PI*2/ledCount;bulb(Math.cos(a)*4.25,2.05,Math.sin(a)*4.25,i%3===0?M.ledB:(i%2?M.ledY:M.ledW),spin,.05)}for(let i=0;i<(mobile?30:60);i++){const a=i*Math.PI*2/(mobile?30:60);bulb(Math.cos(a)*3.45,2.22,Math.sin(a)*3.45,i%2?M.ledY:M.ledW,spin,.045)}
// seats
for(let i=0;i<24;i++){
 const a=i*Math.PI*2/24,g=new THREE.Group();g.position.set(Math.cos(a)*3.65,0,Math.sin(a)*3.65);g.rotation.y=-a+Math.PI/2;spin.add(g);
 // mount + footrest
 tube(new THREE.Vector3(-.25,.05,-.42),new THREE.Vector3(-.18,.55,-.28),.05,M.galvD,g);tube(new THREE.Vector3(.25,.05,-.42),new THREE.Vector3(.18,.55,-.28),.05,M.galvD,g);box(.52,.06,.42,M.galvD,0,-.3,.48,g);
 // seat bucket
 box(.58,.2,.68,M.red,0,-.03,0,g);box(.56,.95,.2,M.red,0,.5,-.29,g);box(.48,.72,.08,M.pad,0,.48,-.17,g);box(.42,.12,.2,M.pad,0,.95,-.3,g);box(.1,.7,.12,M.redB,-.34,.35,-.08,g);box(.1,.7,.12,M.redB,.34,.35,-.08,g);
 // restraint pivot + U-bar
 cyl(.08,.16,M.galvD,-.31,.84,-.08,g,10).rotation.z=Math.PI/2;cyl(.08,.16,M.galvD,.31,.84,-.08,g,10).rotation.z=Math.PI/2;tube(new THREE.Vector3(-.3,.82,-.05),new THREE.Vector3(-.28,.15,.24),.045,M.yellow,g);tube(new THREE.Vector3(.3,.82,-.05),new THREE.Vector3(.28,.15,.24),.045,M.yellow,g);tube(new THREE.Vector3(-.28,.15,.24),new THREE.Vector3(.28,.15,.24),.05,M.yellow,g);
 // visible dummy rider every second seat on desktop
 if(!mobile&&i%2===0){cyl(.12,.48,M.denim,0,.22,.04,g,10);const head=new THREE.Mesh(new THREE.SphereGeometry(.14,10,8),M.skin);head.position.set(0,.73,-.04);g.add(head);tube(new THREE.Vector3(-.08,.34,.04),new THREE.Vector3(-.22,.02,.25),.055,M.skin,g,8);tube(new THREE.Vector3(.08,.34,.04),new THREE.Vector3(.22,.02,.25),.055,M.skin,g,8)}
}
// undercarriage hoses / brake calipers
for(let i=0;i<8;i++){const a=i*Math.PI*2/8;tube(new THREE.Vector3(Math.cos(a)*1.25,-.1,Math.sin(a)*1.25),new THREE.Vector3(Math.cos(a)*2.55,-.48,Math.sin(a)*2.55),.032,M.dark,spin);box(.24,.32,.18,M.galvD,Math.cos(a)*2.7,-.44,Math.sin(a)*2.7,spin)}
// halo support struts
for(let i=0;i<12;i++){const a=i*Math.PI*2/12;tube(new THREE.Vector3(Math.cos(a)*1.55,.9,Math.sin(a)*1.55),new THREE.Vector3(Math.cos(a)*3.75,2.0,Math.sin(a)*3.75),.06,M.yellow,spin)}

// physics / operator logic
let state='LOADING',locked=false,auto=false,rotation=true,estop=false,y=3.25,v=0,a=0,holdTimer=0;const loadY=3.25,topY=73.5,brakeY=20;
function setState(s){state=s;$('state').textContent=s}
function lock(){locked=true;$('restLamp').className='lamp on';$('restTxt').textContent='LOCKED';setState('LOCKED')}
function unlock(){if(Math.abs(y-loadY)<.2){locked=false;$('restLamp').className='lamp';$('restTxt').textContent='OPEN';setState('LOADING')}}
function release(){if(estop||!locked||y<25)return;v=0;setState('FREEFALL')}
function cycle(){if(estop)return;lock();auto=true;setTimeout(()=>{if(auto&&!estop)setState('LIFTING')},300)}
$('lock').onclick=lock;$('unlock').onclick=unlock;$('cycle').onclick=cycle;$('lift').onclick=()=>{if(!estop){lock();auto=false;setState('LIFTING')}};$('drop').onclick=release;$('return').onclick=()=>{if(!estop){auto=false;setState('RETURN')}};$('rotate').onclick=()=>rotation=!rotation;$('estop').onclick=()=>{if(estop){estop=false;setState(locked?'LOCKED':'LOADING');$('estop').textContent='NOT-AUS'}else{estop=true;auto=false;v=0;setState('E-STOP');$('estop').textContent='NOT-AUS RESET'}};
$('resetView').onclick=()=>{theta=.72;phi=1.08;radius=72;targetY=28;cam='orbit';orbit()};function setCam(x){cam=x;$('cameraSel').value=x}$('cameraSel').onchange=e=>setCam(e.target.value);document.querySelectorAll('[data-cam]').forEach(b=>b.onclick=()=>setCam(b.dataset.cam));['hold','liftSpeed','rotSpeed'].forEach(id=>$(id).oninput=()=>{$('holdVal').textContent=(+$('hold').value).toFixed(1)+' s';$('liftVal').textContent=(+$('liftSpeed').value).toFixed(1)+' m/s';$('rotVal').textContent=(+$('rotSpeed').value).toFixed(1)+' rpm'});$('showData').onclick=()=>{$('dataPanel').classList.toggle('open');$('controlPanel').classList.remove('open')};$('showControl').onclick=()=>{$('controlPanel').classList.toggle('open');$('dataPanel').classList.remove('open')};
const clock=new THREE.Clock();function update(dt){dt=Math.min(dt,.033);if(!estop){if(state==='LIFTING'){a=0;v=+$('liftSpeed').value;y+=v*dt;if(y>=topY){y=topY;v=0;holdTimer=0;setState('TOP HOLD')}}else if(state==='TOP HOLD'){a=0;v=0;holdTimer+=dt;if(auto&&holdTimer>=+$('hold').value)release()}else if(state==='FREEFALL'){a=-9.81;v+=a*dt;y+=v*dt;if(y<=brakeY){y=brakeY;setState('MAGNETIC BRAKE')}}else if(state==='MAGNETIC BRAKE'){const speed=Math.abs(v);a=15+speed*1.15;v+=a*dt;if(v>-.9)v=-.9;y+=v*dt;if(y<=loadY+1.4)setState('RETURN')}else if(state==='RETURN'){a=0;v=-.65;y+=v*dt;if(y<=loadY){y=loadY;v=0;setState('LOCKED');if(auto){auto=false;setTimeout(unlock,700)}}}else{a=0;v=0}}y=Math.max(loadY,Math.min(topY,y));carriage.position.y=y;if(rotation)spin.rotation.y+=(+$('rotSpeed').value)*Math.PI*2/60*dt;$('height').textContent=y.toFixed(1)+' m';$('speed').textContent=Math.abs(v).toFixed(1)+' m/s';$('gforce').textContent=Math.max(0,1+a/9.81).toFixed(2)+' g';$('rpm').textContent=(rotation?+$('rotSpeed').value:0).toFixed(1)+' rpm';$('brakeLamp').className='lamp '+(state==='MAGNETIC BRAKE'?'warn':'on');$('brakeTxt').textContent=state==='MAGNETIC BRAKE'?'ACTIVE':'READY';if(cam==='ground'){camera.position.lerp(new THREE.Vector3(13,3.2,23),.08);camera.lookAt(0,36,0)}else if(cam==='tower'){camera.position.lerp(new THREE.Vector3(5.3,77,7),.08);camera.lookAt(0,y,0)}else if(cam==='onride'){const ang=6*Math.PI*2/24+spin.rotation.y,pos=new THREE.Vector3(Math.cos(ang)*3.62,y+.62,Math.sin(ang)*3.62);camera.position.lerp(pos,.32);camera.lookAt(Math.cos(ang)*18,y+.2,Math.sin(ang)*18)}}
function animate(){requestAnimationFrame(animate);update(clock.getDelta());renderer.render(scene,camera)}animate();addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});setState('LOADING');$('boot').classList.add('hidden');
}catch(e){console.error(e);$('bootText').innerHTML='START FEHLGESCHLAGEN<br><small>'+String(e.message||e)+'</small>';$('state').textContent='ERROR';}
