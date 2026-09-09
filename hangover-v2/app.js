import * as THREE from 'three';

const $ = id => document.getElementById(id);
const mobile = matchMedia('(max-width:700px)').matches;

try {
  $('bootText').textContent = '3D-ENGINE GELADEN · DETAILMODELL WIRD AUFGEBAUT …';

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87b7e4);
  scene.fog = new THREE.Fog(0xa8cae6, 115, 220);

  const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.04, 420);
  const renderer = new THREE.WebGLRenderer({ antialias: !mobile, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.15 : 1.8));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = false;
  $('view').appendChild(renderer.domElement);

  let theta=.72, phi=1.08, radius=72, targetY=28, drag=false, lastX=0, lastY=0, pinch=0, cam='orbit';
  function orbit(){
    const s=Math.sin(phi);
    camera.position.set(Math.sin(theta)*s*radius,targetY+Math.cos(phi)*radius,Math.cos(theta)*s*radius);
    camera.lookAt(0,targetY,0);
  }
  orbit();

  const cv=renderer.domElement;
  cv.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY});
  cv.addEventListener('pointermove',e=>{
    if(!drag||cam!=='orbit') return;
    theta-=(e.clientX-lastX)*.006;
    phi=Math.max(.18,Math.min(1.5,phi+(e.clientY-lastY)*.006));
    lastX=e.clientX;lastY=e.clientY;orbit();
  });
  addEventListener('pointerup',()=>drag=false);
  cv.addEventListener('wheel',e=>{if(cam!=='orbit')return;e.preventDefault();radius=Math.max(7,Math.min(155,radius+e.deltaY*.05));orbit()},{passive:false});
  cv.addEventListener('touchstart',e=>{if(e.touches.length===2)pinch=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)},{passive:true});
  cv.addEventListener('touchmove',e=>{if(cam!=='orbit'||e.touches.length!==2)return;const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);if(pinch){radius=Math.max(7,Math.min(155,radius-(d-pinch)*.08));orbit()}pinch=d},{passive:true});

  scene.add(new THREE.HemisphereLight(0xeaf6ff,0x39472c,2.15));
  const sun=new THREE.DirectionalLight(0xffffff,2.8);sun.position.set(28,92,34);scene.add(sun);
  const fill=new THREE.DirectionalLight(0xc9dcff,.6);fill.position.set(-30,35,-25);scene.add(fill);

  const M={
    galvanized:new THREE.MeshStandardMaterial({color:0xcfd5d8,metalness:.9,roughness:.34}),
    galvanizedDark:new THREE.MeshStandardMaterial({color:0x7f898e,metalness:.92,roughness:.28}),
    white:new THREE.MeshStandardMaterial({color:0xf0f1ed,metalness:.65,roughness:.36}),
    yellow:new THREE.MeshStandardMaterial({color:0xf3c500,metalness:.5,roughness:.34}),
    yellowDark:new THREE.MeshStandardMaterial({color:0xb98d00,metalness:.55,roughness:.36}),
    red:new THREE.MeshStandardMaterial({color:0x8b1820,metalness:.38,roughness:.42}),
    redBright:new THREE.MeshStandardMaterial({color:0xc6292f,metalness:.35,roughness:.39}),
    purple:new THREE.MeshStandardMaterial({color:0x6c2874,metalness:.3,roughness:.42}),
    purpleDark:new THREE.MeshStandardMaterial({color:0x32143a,metalness:.25,roughness:.5}),
    dark:new THREE.MeshStandardMaterial({color:0x11161c,metalness:.65,roughness:.3}),
    rubber:new THREE.MeshStandardMaterial({color:0x090b0e,metalness:.05,roughness:.88}),
    seat:new THREE.MeshStandardMaterial({color:0x6b151d,metalness:.15,roughness:.62}),
    seatPad:new THREE.MeshStandardMaterial({color:0x1b2026,metalness:.1,roughness:.82}),
    glass:new THREE.MeshStandardMaterial({color:0x9bcaf2,metalness:.05,roughness:.1,transparent:true,opacity:.36}),
    ledWarm:new THREE.MeshStandardMaterial({color:0xffcf55,emissive:0xffb51f,emissiveIntensity:1.3,roughness:.22}),
    ledBlue:new THREE.MeshStandardMaterial({color:0x5ba8ff,emissive:0x2f79ff,emissiveIntensity:1.5,roughness:.2}),
    ledWhite:new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xf4f9ff,emissiveIntensity:1.25,roughness:.16}),
    concrete:new THREE.MeshStandardMaterial({color:0x767b7d,metalness:.08,roughness:.9}),
    deck:new THREE.MeshStandardMaterial({color:0x63696d,metalness:.68,roughness:.47}),
    paintBlue:new THREE.MeshStandardMaterial({color:0x284e87,metalness:.18,roughness:.48})
  };

  const cylSeg = mobile ? 8 : 12;
  const fineSeg = mobile ? 12 : 20;
  function box(w,h,d,m,x=0,y=0,z=0,p=scene){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);p.add(o);return o}
  function cyl(r,h,m,x=0,y=0,z=0,p=scene,s=cylSeg){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,s),m);o.position.set(x,y,z);p.add(o);return o}
  function tube(a,b,r=.04,m=M.galvanized,p=scene,s=cylSeg){const v=new THREE.Vector3().subVectors(b,a);const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,v.length(),s),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.clone().normalize());p.add(o);return o}
  function ring(r1,r2,h,m,p=scene,seg=fineSeg){const g=new THREE.CylinderGeometry(r2,r2,h,seg,1,false);const inner=new THREE.CylinderGeometry(r1,r1,h+.002,seg,1,false);const outer=new THREE.Mesh(g,m);const innerMesh=new THREE.Mesh(inner,m);p.add(outer);p.add(innerMesh);innerMesh.scale.set(.999,1,.999);return outer}
  function bulb(r,a,y,m,p){const mesh=new THREE.Mesh(new THREE.SphereGeometry(r,mobile?5:7,mobile?4:6),m);mesh.position.set(Math.cos(a),y,Math.sin(a));p.add(mesh);return mesh}
  function railSegment(a,b,height=.95,p=scene){
    tube(new THREE.Vector3(a.x,.88,a.z),new THREE.Vector3(a.x,.88+height,a.z),.026,M.galvanized,p);
    tube(new THREE.Vector3(b.x,.88,b.z),new THREE.Vector3(b.x,.88+height,b.z),.026,M.galvanized,p);
    tube(new THREE.Vector3(a.x,.88+height,a.z),new THREE.Vector3(b.x,.88+height,b.z),.028,M.galvanized,p);
    tube(new THREE.Vector3(a.x,.88+height*.52,a.z),new THREE.Vector3(b.x,.88+height*.52,b.z),.021,M.galvanized,p);
  }

  // --- Fairground / transportable base ---------------------------------------------------------
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(240,240),new THREE.MeshStandardMaterial({color:0x748d55,roughness:1}));
  ground.rotation.x=-Math.PI/2;scene.add(ground);

  const base=new THREE.Group();scene.add(base);
  box(23,.42,19,M.galvanizedDark,0,.24,0,base);
  box(21.8,.22,17.8,M.deck,0,.55,0,base);
  for(let x=-10;x<=10;x+=1.1) box(.025,.018,17.4,M.galvanized,x,.675,0,base);
  for(let z=-8;z<=8;z+=1.1) box(21.4,.018,.025,M.galvanized,0,.68,z,base);

  // Stabilizer beams / outriggers
  for(const side of [-1,1]){
    box(7.2,.52,.58,M.galvanizedDark,side*13.4,.38,0,base);
    box(1.7,.24,2.7,M.concrete,side*16.25,.17,0,base);
    box(.85,.75,.85,M.galvanizedDark,side*16.15,.72,0,base);
  }
  for(const side of [-1,1]){
    box(.62,.52,5.5,M.galvanizedDark,0,.38,side*10.7,base);
    box(2.7,.24,1.7,M.concrete,0,.17,side*13.2,base);
  }

  // Access stairs
  for(let i=0;i<5;i++) box(3.2,.16,.6,M.deck,-7.2,.22+i*.18,9.25-i*.5,base);
  for(const sx of [-1,1]) tube(new THREE.Vector3(-7.2+sx*1.55,.35,9.5),new THREE.Vector3(-7.2+sx*1.55,1.35,7.2),.035,M.galvanized,base);

  // Perimeter railings
  const railPts=[[-10.4,-7.8],[10.4,-7.8],[10.4,7.7],[4.2,7.7],[-4.2,7.7],[-10.4,7.7],[-10.4,-7.8]];
  for(let i=0;i<railPts.length-1;i++) railSegment(new THREE.Vector3(railPts[i][0],0,railPts[i][1]),new THREE.Vector3(railPts[i+1][0],0,railPts[i+1][1]),.98,base);

  // Rear themed facade, inspired by Hangover show front
  box(20.4,5.4,.42,M.purpleDark,0,3.4,-8.25,base);
  box(19.7,4.8,.16,M.purple,0,3.45,-7.99,base);
  for(let x=-8.8;x<=8.8;x+=2.2){
    box(1.5,3.9,.06,(Math.round(x*10)%4===0?M.paintBlue:M.purpleDark),x,3.35,-7.84,base);
    for(let y=1.8;y<5.2;y+=.55) bulb(.055,0,y,M.ledBlue,(()=>{const g=new THREE.Group();g.position.set(x,0,-7.75);base.add(g);return g})());
  }
  // Simple dimensional HANGOVER sign geometry
  const sign=new THREE.Group();sign.position.set(0,6.05,-7.85);base.add(sign);
  box(13.2,1.45,.28,M.purpleDark,0,0,0,sign);
  box(12.45,1.02,.34,M.redBright,0,.02,.05,sign);
  for(let i=0;i<34;i++){const x=-5.95+i*(11.9/33);const b=new THREE.Mesh(new THREE.SphereGeometry(.06,5,4),M.ledWhite);b.position.set(x,.53,.26);sign.add(b)}
  for(let i=0;i<34;i++){const x=-5.95+i*(11.9/33);const b=new THREE.Mesh(new THREE.SphereGeometry(.06,5,4),M.ledWhite);b.position.set(x,-.53,.26);sign.add(b)}

  // --- Tower mast -------------------------------------------------------------------------------
  const tower=new THREE.Group();scene.add(tower);
  const H=80;
  const half=1.18;
  const corners=[[-half,-half],[half,-half],[half,half],[-half,half]];

  // Main corner chords with visible clamp collars every section
  for(const [x,z] of corners){
    box(.2,H,.2,M.white,x,H/2+.82,z,tower);
    for(let yy=1.4;yy<80;yy+=4){
      cyl(.16,.16,M.galvanizedDark,x,yy,z,tower,10);
    }
  }

  // Dense 2 m modular lattice, with cross X-bracing on all four faces
  for(let yy=.8;yy<=80;yy+=2){
    for(let i=0;i<4;i++){
      const [x1,z1]=corners[i],[x2,z2]=corners[(i+1)%4];
      tube(new THREE.Vector3(x1,yy,z1),new THREE.Vector3(x2,yy,z2),.038,M.galvanized,tower);
      if(yy<78.8){
        tube(new THREE.Vector3(x1,yy,z1),new THREE.Vector3(x2,yy+2,z2),.03,M.galvanized,tower);
        tube(new THREE.Vector3(x2,yy,z2),new THREE.Vector3(x1,yy+2,z1),.03,M.galvanized,tower);
      }
    }
  }

  // Inner guide rails and trolley tracks
  box(.18,72,.28,M.yellow,-1.48,37,0,tower);
  box(.18,72,.28,M.yellow,1.48,37,0,tower);
  box(.22,72,.16,M.dark,0,37,-.68,tower);
  box(.22,72,.16,M.dark,0,37,.68,tower);

  // Guide rail brackets
  for(let yy=2.8;yy<74;yy+=2){
    box(.48,.1,.18,M.yellowDark,-1.34,yy,0,tower);
    box(.48,.1,.18,M.yellowDark,1.34,yy,0,tower);
    tube(new THREE.Vector3(-1.15,yy,-.78),new THREE.Vector3(-1.48,yy,0),.025,M.yellow,tower);
    tube(new THREE.Vector3(1.15,yy,-.78),new THREE.Vector3(1.48,yy,0),.025,M.yellow,tower);
  }

  // Magnetic brake fins / packs near lower mast
  for(let yy=4.2;yy<21.8;yy+=.72){
    box(.13,.55,.78,M.dark,-1.52,yy,0,tower);
    box(.13,.55,.78,M.dark,1.52,yy,0,tower);
    box(.08,.48,.7,M.galvanizedDark,-1.61,yy,0,tower);
    box(.08,.48,.7,M.galvanizedDark,1.61,yy,0,tower);
  }

  // Cable / rope channel + service line
  tube(new THREE.Vector3(-.52,2,-.86),new THREE.Vector3(-.52,80,-.86),.028,M.dark,tower);
  tube(new THREE.Vector3(.52,2,-.86),new THREE.Vector3(.52,80,-.86),.018,M.dark,tower);
  for(let yy=4;yy<80;yy+=4) box(.36,.06,.08,M.galvanizedDark,-.52,yy,-.86,tower);

  // Top crown and release/lift machinery
  const crown=new THREE.Group();crown.position.y=80.75;tower.add(crown);
  box(3.2,.32,3.2,M.galvanizedDark,0,.1,0,crown);
  for(const [x,z] of corners) tube(new THREE.Vector3(x,0,z),new THREE.Vector3(x*.78,2.05,z*.78),.07,M.galvanized,crown);
  box(2.3,.32,2.3,M.yellow,0,2.05,0,crown);
  box(1.5,.7,1.5,M.red,0,2.42,0,crown);
  for(const sx of [-1,1]){
    const pulley=new THREE.Mesh(new THREE.TorusGeometry(.48,.09,mobile?6:8,mobile?12:20),M.galvanizedDark);
    pulley.rotation.y=Math.PI/2;pulley.position.set(sx*.62,2.82,0);crown.add(pulley);
    cyl(.11,1.55,M.dark,sx*.62,2.82,0,crown,10).rotation.z=Math.PI/2;
  }
  box(2.7,.18,.62,M.yellow,0,3.38,0,crown);
  for(let i=-4;i<=4;i++) box(.12,.25,.12,M.ledWhite,i*.28,3.53,.1,crown);

  // --- Moving carriage and 24 seat gondola ------------------------------------------------------
  const carriage=new THREE.Group();
  const rotator=new THREE.Group();
  scene.add(carriage);carriage.add(rotator);

  // Inner guide carriage frame
  box(3.45,.38,3.45,M.yellowDark,0,.72,0,rotator);
  box(2.9,1.45,2.9,M.red,0,1.2,0,rotator);
  box(2.48,1.1,2.48,M.yellow,0,1.23,0,rotator);
  for(const sx of [-1,1]){
    box(.38,1.7,.72,M.galvanizedDark,sx*1.57,.96,0,rotator);
    for(const z of [-.26,.26]) cyl(.18,.18,M.rubber,sx*1.72,.73,z,rotator,12).rotation.z=Math.PI/2;
  }

  // Radial load-bearing spider
  for(let i=0;i<12;i++){
    const a=i*Math.PI*2/12;
    tube(new THREE.Vector3(Math.cos(a)*1.42,.65,Math.sin(a)*1.42),new THREE.Vector3(Math.cos(a)*3.6,.08,Math.sin(a)*3.6),.09,M.yellow,rotator,10);
    tube(new THREE.Vector3(Math.cos(a)*1.3,1.7,Math.sin(a)*1.3),new THREE.Vector3(Math.cos(a)*3.5,.18,Math.sin(a)*3.5),.065,M.galvanizedDark,rotator,8);
  }

  // Ring chassis / underfloor structure
  const floorRing=new THREE.Mesh(new THREE.TorusGeometry(3.55,.18,mobile?8:10,mobile?36:64),M.galvanizedDark);floorRing.rotation.x=Math.PI/2;floorRing.position.y=-.05;rotator.add(floorRing);
  const outerRail=new THREE.Mesh(new THREE.TorusGeometry(4.25,.08,mobile?6:8,mobile?36:64),M.yellow);outerRail.rotation.x=Math.PI/2;outerRail.position.y=.03;rotator.add(outerRail);
  const footRing=new THREE.Mesh(new THREE.TorusGeometry(3.95,.055,mobile?6:8,mobile?36:64),M.galvanized);footRing.rotation.x=Math.PI/2;footRing.position.y=-.55;rotator.add(footRing);

  function createSeat(index){
    const a=index*Math.PI*2/24;
    const g=new THREE.Group();
    g.position.set(Math.cos(a)*3.72,0,Math.sin(a)*3.72);
    g.rotation.y=-a+Math.PI/2;
    rotator.add(g);

    // seat shell and pad
    box(.64,.18,.74,M.redBright,0,-.05,0,g);
    box(.54,.09,.52,M.seatPad,0,.06,.02,g);
    box(.66,1.05,.16,M.seat,0,.54,-.29,g);
    box(.56,.24,.13,M.seatPad,0,.85,-.20,g);
    // headrest
    box(.5,.33,.18,M.redBright,0,1.12,-.28,g);
    box(.42,.17,.12,M.seatPad,0,1.13,-.18,g);

    // side guards / separator plates
    for(const sx of [-1,1]){
      box(.08,.72,.58,M.red,sx*.36,.31,-.02,g);
      box(.065,.26,.48,M.galvanizedDark,sx*.39,-.31,.06,g);
      tube(new THREE.Vector3(sx*.31,.98,-.1),new THREE.Vector3(sx*.34,.16,.22),.048,M.yellow,g,8);
      cyl(.075,.42,M.galvanizedDark,sx*.35,.98,-.08,g,8).rotation.z=Math.PI/2;
    }

    // U-shaped over-shoulder restraint
    tube(new THREE.Vector3(-.27,1.08,-.08),new THREE.Vector3(-.28,.31,.28),.052,M.yellow,g,8);
    tube(new THREE.Vector3(.27,1.08,-.08),new THREE.Vector3(.28,.31,.28),.052,M.yellow,g,8);
    tube(new THREE.Vector3(-.27,1.08,-.08),new THREE.Vector3(.27,1.08,-.08),.055,M.yellow,g,8);
    box(.48,.08,.1,M.rubber,0,.78,.06,g);

    // foot bar / anti-slip plate
    tube(new THREE.Vector3(-.29,-.45,.12),new THREE.Vector3(.29,-.45,.12),.035,M.galvanized,g,8);
    box(.56,.055,.34,M.dark,0,-.52,.18,g);
    // local seat number bulb
    const led=new THREE.Mesh(new THREE.SphereGeometry(.045,5,4),M.ledWarm);led.position.set(.31,.11,.37);g.add(led);
  }
  for(let i=0;i<24;i++) createSeat(i);

  // Grand circular upper canopy / LED disc
  const canopy=new THREE.Group();canopy.position.y=2.2;rotator.add(canopy);
  const canopyOuter=new THREE.Mesh(new THREE.CylinderGeometry(4.65,4.55,.28,mobile?40:72),M.yellowDark);canopyOuter.position.y=.08;canopy.add(canopyOuter);
  const canopyFace=new THREE.Mesh(new THREE.RingGeometry(1.95,4.5,mobile?40:72),M.yellow);canopyFace.rotation.x=-Math.PI/2;canopyFace.position.y=.24;canopy.add(canopyFace);
  const canopyInner=new THREE.Mesh(new THREE.RingGeometry(2.2,4.32,mobile?40:72),M.red);canopyInner.rotation.x=-Math.PI/2;canopyInner.position.y=.255;canopy.add(canopyInner);
  const ledCount=mobile?48:96;
  for(let i=0;i<ledCount;i++){
    const a=i*Math.PI*2/ledCount;
    const r=i%2?4.08:4.35;
    const led=new THREE.Mesh(new THREE.SphereGeometry(.055,mobile?5:7,mobile?4:6),i%3===0?M.ledWhite:M.ledWarm);
    led.position.set(Math.cos(a)*r,.32,Math.sin(a)*r);canopy.add(led);
  }
  for(let i=0;i<(mobile?20:32);i++){
    const a=i*Math.PI*2/(mobile?20:32);
    const led=new THREE.Mesh(new THREE.SphereGeometry(.045,5,4),M.ledBlue);
    led.position.set(Math.cos(a)*2.65,.33,Math.sin(a)*2.65);canopy.add(led);
  }

  // vertical support struts to canopy
  for(let i=0;i<12;i++){
    const a=i*Math.PI*2/12;
    tube(new THREE.Vector3(Math.cos(a)*1.35,1.55,Math.sin(a)*1.35),new THREE.Vector3(Math.cos(a)*3.9,2.18,Math.sin(a)*3.9),.055,M.yellow,rotator,8);
  }

  // Service hoses/cables hanging under inner carriage
  for(const sx of [-1,1]){
    tube(new THREE.Vector3(sx*.9,.4,-.8),new THREE.Vector3(sx*1.25,-.5,-.7),.025,M.dark,rotator,6);
    tube(new THREE.Vector3(sx*.65,.45,-.95),new THREE.Vector3(sx*.8,-.42,-1.05),.018,M.red,rotator,6);
  }

  // Initial gondola position
  let state='LOADING',locked=false,auto=false,rotation=true,estop=false,y=3.25,v=0,a=0,holdTimer=0;
  const loadY=3.25,topY=73.5,brakeY=20;

  function setState(s){state=s;$('state').textContent=s}
  function lock(){locked=true;$('restLamp').className='lamp on';$('restTxt').textContent='LOCKED';setState('LOCKED')}
  function unlock(){if(Math.abs(y-loadY)<.2){locked=false;$('restLamp').className='lamp';$('restTxt').textContent='OPEN';setState('LOADING')}}
  function release(){if(estop||!locked||y<25)return;v=0;setState('FREEFALL')}
  function cycle(){if(estop)return;lock();auto=true;setTimeout(()=>{if(auto&&!estop)setState('LIFTING')},300)}

  $('lock').onclick=lock;
  $('unlock').onclick=unlock;
  $('cycle').onclick=cycle;
  $('lift').onclick=()=>{if(!estop){lock();auto=false;setState('LIFTING')}};
  $('drop').onclick=release;
  $('return').onclick=()=>{if(!estop){auto=false;setState('RETURN')}};
  $('rotate').onclick=()=>rotation=!rotation;
  $('estop').onclick=()=>{estop=true;auto=false;v=0;setState('E-STOP')};
  $('resetView').onclick=()=>{theta=.72;phi=1.08;radius=72;targetY=28;cam='orbit';orbit()};
  function setCam(x){cam=x;$('cameraSel').value=x}
  $('cameraSel').onchange=e=>setCam(e.target.value);
  document.querySelectorAll('[data-cam]').forEach(b=>b.onclick=()=>setCam(b.dataset.cam));
  ['hold','liftSpeed','rotSpeed'].forEach(id=>$(id).oninput=()=>{
    $('holdVal').textContent=(+$('hold').value).toFixed(1)+' s';
    $('liftVal').textContent=(+$('liftSpeed').value).toFixed(1)+' m/s';
    $('rotVal').textContent=(+$('rotSpeed').value).toFixed(1)+' rpm';
  });
  $('showData').onclick=()=>{$('dataPanel').classList.toggle('open');$('controlPanel').classList.remove('open')};
  $('showControl').onclick=()=>{$('controlPanel').classList.toggle('open');$('dataPanel').classList.remove('open')};

  const clock=new THREE.Clock();
  function update(dt){
    dt=Math.min(dt,.033);
    if(!estop){
      if(state==='LIFTING'){
        a=0;v=+$('liftSpeed').value;y+=v*dt;
        if(y>=topY){y=topY;v=0;holdTimer=0;setState('TOP HOLD')}
      } else if(state==='TOP HOLD'){
        a=0;v=0;holdTimer+=dt;if(auto&&holdTimer>=+$('hold').value)release();
      } else if(state==='FREEFALL'){
        a=-9.81;v+=a*dt;y+=v*dt;
        if(y<=brakeY){y=brakeY;setState('MAGNETIC BRAKE')}
      } else if(state==='MAGNETIC BRAKE'){
        const speed=Math.abs(v);
        a=13+Math.min(30,speed*1.45);
        v+=a*dt;
        if(v>-.75)v=-.75;
        y+=v*dt;
        if(y<=loadY+1.45)setState('RETURN');
      } else if(state==='RETURN'){
        a=0;v=-.62;y+=v*dt;
        if(y<=loadY){y=loadY;v=0;setState('LOCKED');if(auto){auto=false;setTimeout(unlock,700)}}
      } else {a=0;v=0}
    }

    y=Math.max(loadY,Math.min(topY,y));
    carriage.position.y=y;
    if(rotation)rotator.rotation.y+=(+$('rotSpeed').value)*Math.PI*2/60*dt;

    $('height').textContent=y.toFixed(1)+' m';
    $('speed').textContent=Math.abs(v).toFixed(1)+' m/s';
    $('gforce').textContent=Math.max(0,1+a/9.81).toFixed(2)+' g';
    $('rpm').textContent=(rotation?+$('rotSpeed').value:0).toFixed(1)+' rpm';
    $('brakeLamp').className='lamp '+(state==='MAGNETIC BRAKE'?'warn':'on');
    $('brakeTxt').textContent=state==='MAGNETIC BRAKE'?'ACTIVE':'READY';

    if(cam==='ground'){
      camera.position.lerp(new THREE.Vector3(13,3.15,24),.08);
      camera.lookAt(0,39,0);
    } else if(cam==='tower'){
      camera.position.lerp(new THREE.Vector3(5.2,78,7.5),.08);
      camera.lookAt(0,y+1,0);
    } else if(cam==='onride'){
      const ang=6*Math.PI*2/24+rotator.rotation.y;
      const pos=new THREE.Vector3(Math.cos(ang)*3.9,y+.62,Math.sin(ang)*3.9);
      camera.position.lerp(pos,.34);
      camera.lookAt(Math.cos(ang)*25,y+.25,Math.sin(ang)*25);
    }
  }

  function animate(){requestAnimationFrame(animate);update(clock.getDelta());renderer.render(scene,camera)}
  animate();
  addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
  setState('LOADING');
  $('boot').classList.add('hidden');
} catch(e) {
  console.error(e);
  $('bootText').innerHTML='START FEHLGESCHLAGEN<br><small>'+String(e.message||e)+'</small>';
  $('state').textContent='ERROR';
}
