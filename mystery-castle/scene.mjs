import * as THREE from '../nightfly/vendor/three.module.js';
import {OrbitControls} from '../nightfly/vendor/controls/OrbitControls.js';

export function createScene(container, ride) {
  const scene=new THREE.Scene();scene.background=new THREE.Color('#0a0d12');scene.fog=new THREE.FogExp2('#0a0d12',.007);
  const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.4;
  container.append(renderer.domElement);renderer.domElement.setAttribute('aria-label','Interaktive 3D-Turmkammer mit sechs Gondeln');
  const camera=new THREE.PerspectiveCamera(46,1,.1,220);
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=8;controls.maxDistance=115;controls.maxPolarAngle=Math.PI*.49;controls.target.set(0,19,0);
  let mode='overview',worklight=true,reduceMotion=false;
  const mat=(color,metalness=.0,roughness=.8)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
  const iron=mat('#292e36',.8,.4),brass=mat('#b18b50',.8,.4),dark=mat('#181b22',.5,.55),red=mat('#53272b',.15,.8),seat=mat('#263b43',.3,.5),bone=mat('#d9bb8c',.2,.5);
  function brickTexture(){const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const c=canvas.getContext('2d');c.fillStyle='#161c22';c.fillRect(0,0,512,512);let seed=91;const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};for(let y=0;y<8;y++)for(let x=-1;x<5;x++){const k=36+Math.floor(rand()*18);c.fillStyle=`rgb(${k},${k+3},${k+7})`;c.fillRect(x*128+(y%2)*64+3,y*64+3,122,58);c.strokeStyle='#74757830';c.strokeRect(x*128+(y%2)*64+4,y*64+4,120,56);for(let n=0;n<70;n++){c.fillStyle=rand()>.5?'#00000010':'#a9a79410';c.fillRect(x*128+(y%2)*64+rand()*120,y*64+rand()*58,rand()*6,2)}}const tex=new THREE.CanvasTexture(canvas);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(2,8);tex.colorSpace=THREE.SRGBColorSpace;return tex}
  const stone=new THREE.MeshStandardMaterial({map:brickTexture(),roughness:.94,color:'#a0a7b3'});
  function mesh(geo,material,parent=scene){const m=new THREE.Mesh(geo,material);parent.add(m);return m}
  function box(w,h,d,x,y,z,material=iron,parent=scene){const m=mesh(new THREE.BoxGeometry(w,h,d),material,parent);m.position.set(x,y,z);return m}
  function cylinder(r1,r2,h,x,y,z,material=iron,parent=scene,sides=12){const m=mesh(new THREE.CylinderGeometry(r1,r2,h,sides),material,parent);m.position.set(x,y,z);return m}
  function torus(radius,tube,x,y,z,material=brass,parent=scene){const m=mesh(new THREE.TorusGeometry(radius,tube,8,36),material,parent);m.position.set(x,y,z);return m}
  const floor=cylinder(15,15,1,0,-.55,0,dark,scene,6);floor.rotation.y=Math.PI/6;
  for(const r of [3.5,5,7,12.8]){const ring=torus(r,.045,0,.02,0,brass);ring.rotation.x=-Math.PI/2}
  for(let i=0;i<24;i++){const a=i*Math.PI/12;const line=box(.035,.02,7,Math.sin(a)*8,.02,Math.cos(a)*8,brass);line.rotation.y=a;}
  // Cutaway architecture: retain the rear half of the masonry so all six tracks remain legible.
  for(let i=0;i<6;i++){
    const angle=i*Math.PI/3;const wall=new THREE.Group();wall.rotation.y=angle;scene.add(wall);
    if(Math.cos(angle)<.1){box(15,55,.8,0,27.5,13,stone,wall);for(const y of [5,20,36,53]){box(15,.35,.8,0,y,12.4,brass,wall);box(14,.8,.65,0,y-.6,12.55,iron,wall)}
      for(const x of [-6.5,6.5])box(.8,55,1.2,x,27.5,12.2,stone,wall);
      // High gothic lancet windows, with pointed crowns and mullions.
      for(const x of [-4,4]){box(1.9,8,.15,x,43,12.46,dark,wall);const glow=mat('#779aa3',.2,.4);glow.emissive=new THREE.Color('#33556b');glow.emissiveIntensity=.7;box(1.35,7,.2,x,43,12.25,glow,wall);box(.12,8,.3,x,43,12.05,brass,wall);box(1.8,.12,.3,x,42,12.05,brass,wall);const crown=mesh(new THREE.ConeGeometry(1.15,2,3),brass,wall);crown.position.set(x,48,12.2);crown.scale.z=.15}
    }
  }
  const frame=new THREE.Group();scene.add(frame);
  for(let i=0;i<6;i++){
    const a=i*Math.PI/3+Math.PI/6;const x=Math.sin(a)*14,z=Math.cos(a)*14;
    cylinder(.23,.33,54,x,27,z,iron,frame);for(const y of [1,19,37,53])cylinder(.5,.5,.4,x,y,z,brass,frame);
  }
  for(const y of [1,19,37,53]){const ring=mesh(new THREE.TorusGeometry(14,.15,6,6),brass,frame);ring.rotation.x=Math.PI/2;ring.rotation.z=Math.PI/6;ring.position.y=y;}
  const cars=[],gates=[],bulbs=[];
  const guestMaterials=['#857563','#697583','#677d70','#865859'].map(c=>mat(c));
  for(let i=0;i<6;i++){
    const a=i*Math.PI/3;const track=new THREE.Group();track.rotation.y=a;scene.add(track);
    // Local +Z is the outside wall; passengers face -Z, towards the chamber centre.
    for(const x of [-2.8,2.8]){box(.25,51,.35,x,26,10.3,brass,track);box(.7,51,.28,x,26,10.65,iron,track);for(let y=2;y<53;y+=2)box(.72,.13,.15,x,y,10.1,dark,track)}
    box(6.9,.8,.65,0,52,10.4,iron,track);
    for(const x of [-2.8,2.8]){const wheel=torus(.65,.12,x,52,10.1,brass,track);wheel.rotation.y=Math.PI/2;box(.035,51,.035,x+.25,26,10.05,dark,track)}
    for(let j=0;j<8;j++)box(.34,12,.22,-1.4+j*.4,7,10.1,bone,track);
    box(7.8,.35,3.5,0,.15,8.8,iron,track);
    const vehicle=new THREE.Group();vehicle.position.set(0,.55,9);track.add(vehicle);
    box(7.2,.5,1.65,0,.25,0,red,vehicle);box(7.5,.18,1.9,0,.03,-.12,brass,vehicle);
    const hoops=[],people=[];
    for(let j=0;j<8;j++){
      const x=(j-3.5)*.86;box(.72,.25,.8,x,.63,-.24,seat,vehicle);box(.72,1.35,.26,x,1.28,.22,seat,vehicle);
      const head=cylinder(.3,.29,.33,x,2.03,.18,seat,vehicle);head.rotation.x=Math.PI/2;
      const hoop=new THREE.Group();hoop.position.set(x,1.8,.08);vehicle.add(hoop);
      const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.25,-.85,-.32),new THREE.Vector3(-.3,-.15,-.4),new THREE.Vector3(-.18,.08,-.12),new THREE.Vector3(.18,.08,-.12),new THREE.Vector3(.3,-.15,-.4),new THREE.Vector3(.25,-.85,-.32)]);
      mesh(new THREE.TubeGeometry(curve,16,.065,5,false),dark,hoop);box(.5,.13,.18,0,-.76,-.36,brass,hoop);hoops.push(hoop);
      const person=new THREE.Group();vehicle.add(person);cylinder(.21,.28,.62,x,1.11,-.05,guestMaterials[j%4],person,6);const h=mesh(new THREE.SphereGeometry(.185,8,6),bone,person);h.position.set(x,1.65,-.08);for(const dx of [-.14,.14]){box(.15,.18,.56,x+dx,.71,-.45,guestMaterials[j%4],person);box(.14,.5,.15,x+dx,.38,-.72,dark,person)}people.push(person);
    }
    const gate=new THREE.Group();gate.position.set(-3.8,.4,6.5);track.add(gate);box(7.6,.1,.1,3.8,1,0,brass,gate);for(let k=0;k<12;k++)box(.065,1,.065,k*.65,.5,0,iron,gate);gates.push(gate);
    const bulbMat=new THREE.MeshBasicMaterial({color:'#83ceb8'});const bulb=mesh(new THREE.SphereGeometry(.18,8,6),bulbMat,track);bulb.position.set(0,3.1,10.15);bulbs.push(bulb);
    cars.push({vehicle,hoops,people});
  }
  // Original atmospheric laboratory apparatus; not a claim of measured interior geometry.
  cylinder(1.4,1.8,.6,0,.3,0,iron);cylinder(.7,1.1,2.5,0,1.9,0,brass);
  const orbMaterial=new THREE.MeshStandardMaterial({color:'#b3e9df',emissive:'#53bcb6',emissiveIntensity:1.8,metalness:.4,roughness:.2});
  const orb=mesh(new THREE.SphereGeometry(.8,24,16),orbMaterial);orb.position.y=4;
  const rings=[];for(let i=0;i<3;i++){const ring=torus(1.3,.05,0,4,0,brass);ring.rotation.set(i*.9,i*1.1,.5);rings.push(ring)}
  for(let i=0;i<4;i++){const a=i*Math.PI/2;cylinder(.2,.35,4,Math.sin(a)*2,2,Math.cos(a)*2,iron);for(let y=1;y<4;y+=.3){const r=torus(.32,.04,Math.sin(a)*2,y,Math.cos(a)*2,brass);r.rotation.x=Math.PI/2}}
  scene.add(new THREE.HemisphereLight('#b9cee5','#4e3522',2));const key=new THREE.DirectionalLight('#b9ccdf',3.2);key.position.set(15,38,20);scene.add(key);
  const warm=new THREE.PointLight('#e7a665',130,50,1.5);warm.position.set(-10,8,3);scene.add(warm);
  const core=new THREE.PointLight('#83e6de',70,28,1.5);core.position.set(0,6,0);scene.add(core);
  const top=new THREE.PointLight('#749db9',200,60,1.5);top.position.set(0,45,-5);scene.add(top);
  const dustGeo=new THREE.BufferGeometry();const positions=new Float32Array(180*3);for(let i=0;i<positions.length;i+=3){positions[i]=Math.sin(i*127.7)*13;positions[i+1]=(i*.731)%51;positions[i+2]=Math.cos(i*47.1)*13}dustGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));const dust=mesh(dustGeo,new THREE.PointsMaterial({color:'#bca779',size:.055,transparent:true,opacity:.5}));scene.remove(dust);const particles=new THREE.Points(dustGeo,dust.material);scene.add(particles);
  function resize(){const {width,height}=container.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix()}
  const ro=new ResizeObserver(resize);ro.observe(container);
  function view(name){mode=name;controls.enabled=name!=='onride';if(name==='overview'){camera.position.set(43,29,57);controls.target.set(0,24,0)}if(name==='station'){camera.position.set(17,11,24);controls.target.set(0,3,0)}if(name==='tower'){camera.position.set(0,22,79);controls.target.set(0,26,0)}controls.update()}
  view('overview');resize();
  return {view,setWorklight(v){worklight=v},setReduceMotion(v){reduceMotion=v},render(dt,time){
    const active=ride.phase==='running';
    key.intensity=worklight?3.2:active?.15:1.1;top.intensity=worklight?200:active?32:90;
    warm.intensity=worklight?130:active?10:60;core.intensity=active?110:70;
    orbMaterial.emissiveIntensity=active?2.3:1.1;
    cars.forEach(({vehicle,hoops,people},i)=>{vehicle.position.y=.55+ride.cars[i].height;people.forEach((p,j)=>p.visible=j<ride.cars[i].guests);hoops.forEach(h=>{const target=ride.restraints?0:-1.45;h.rotation.x+=(target-h.rotation.x)*Math.min(1,dt*4)});gates[i].rotation.y+=((ride.gates?-1.25:0)-gates[i].rotation.y)*Math.min(1,dt*4);bulbs[i].material.color.set(i>=ride.active?'#393c41':ride.emergency?'#e55546':ride.cars[i].checked?'#9cdfc3':'#dcb27a')});
    if(!reduceMotion){rings.forEach((r,i)=>{r.rotation.y+=dt*(.12+i*.04)});particles.rotation.y=time*.006}
    if(mode==='onride'){camera.position.set(0,ride.cars[0].height+2.05,8.2);camera.lookAt(0,ride.cars[0].height+2,0)}else controls.update();
    renderer.render(scene,camera);
  },dispose(){ro.disconnect();controls.dispose();renderer.dispose()}};
}
