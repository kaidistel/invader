import * as THREE from 'three';

const scene = window.__hangoverScene;
if (!scene) throw new Error('Hangover scene not captured');

const mobile = matchMedia('(max-width:700px)').matches;
let spin = null;
scene.traverse(o => {
  if (spin || !o.isGroup) return;
  const groupedChildren = o.children.filter(c => c.isGroup).length;
  if (groupedChildren >= 24) spin = o;
});
if (!spin) throw new Error('Rotating gondola group not found');

const mat = {
  yellow: new THREE.MeshStandardMaterial({color:0xf2c400,metalness:.48,roughness:.3}),
  yellowDark: new THREE.MeshStandardMaterial({color:0x9b7100,metalness:.62,roughness:.28}),
  red: new THREE.MeshStandardMaterial({color:0xa01620,metalness:.38,roughness:.36}),
  steel: new THREE.MeshStandardMaterial({color:0xbac2c7,metalness:.94,roughness:.23}),
  steelDark: new THREE.MeshStandardMaterial({color:0x555f65,metalness:.92,roughness:.24}),
  black: new THREE.MeshStandardMaterial({color:0x0c1014,metalness:.58,roughness:.34}),
  rubber: new THREE.MeshStandardMaterial({color:0x08090a,roughness:.9}),
  ledWarm: new THREE.MeshStandardMaterial({color:0xffd45b,emissive:0xffb000,emissiveIntensity:1.65}),
  ledWhite: new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xffffff,emissiveIntensity:1.5}),
  ledBlue: new THREE.MeshStandardMaterial({color:0x69aaff,emissive:0x2d73ff,emissiveIntensity:1.7})
};

const seg = mobile ? 10 : 20;
function addMesh(g,m,x=0,y=0,z=0,p=spin){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);p.add(o);return o}
function tube(a,b,r,m=mat.steel,p=spin){const v=new THREE.Vector3().subVectors(b,a);const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,v.length(),seg),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.clone().normalize());p.add(o);return o}
function torus(R,r,m,y=0,p=spin){const o=new THREE.Mesh(new THREE.TorusGeometry(R,r,mobile?6:10,mobile?32:64),m);o.rotation.x=Math.PI/2;o.position.y=y;p.add(o);return o}
function bulb(r,a,y,m,size=.045,p=spin){const o=new THREE.Mesh(new THREE.SphereGeometry(size,mobile?5:7,mobile?4:6),m);o.position.set(Math.cos(a)*r,y,Math.sin(a)*r);p.add(o);return o}

// Broad, layered Funtime-style canopy. The tapered layers give the gondola the heavy disc silhouette visible from below.
addMesh(new THREE.CylinderGeometry(3.55,4.5,.18,mobile?36:72,1,false),mat.yellow,0,1.86,0);
addMesh(new THREE.CylinderGeometry(3.25,4.18,.13,mobile?36:72,1,false),mat.red,0,2.02,0);
addMesh(new THREE.CylinderGeometry(2.7,3.72,.12,mobile?32:64,1,false),mat.yellowDark,0,2.15,0);
torus(4.48,.12,mat.yellow,1.83);torus(4.18,.09,mat.red,2.04);torus(3.72,.08,mat.steel,2.16);

// Concentric underside LED rows.
const ledRows = mobile ? [[4.28,36],[3.9,28],[3.5,24]] : [[4.3,72],[3.92,60],[3.52,48],[3.08,40]];
ledRows.forEach((row,ri)=>{const [r,n]=row;for(let i=0;i<n;i++){const a=i*Math.PI*2/n;bulb(r,a,1.72-ri*.05,(i+ri)%5===0?mat.ledBlue:((i+ri)%2?mat.ledWarm:mat.ledWhite),ri===0?.052:.042)}});

// Yellow central cage around the mast: lower/upper hoops, uprights and diagonal triangulation.
for (const y of [.5,1.15,2.55]) torus(1.42,.075,y===1.15?mat.red:mat.yellow,y);
for(let i=0;i<8;i++){
  const a=i*Math.PI/4;
  const x=Math.cos(a)*1.38,z=Math.sin(a)*1.38;
  tube(new THREE.Vector3(x,.45,z),new THREE.Vector3(x,2.6,z),.065,mat.yellow);
  const a2=a+Math.PI/4;
  tube(new THREE.Vector3(x,.62,z),new THREE.Vector3(Math.cos(a2)*1.38,2.45,Math.sin(a2)*1.38),.045,mat.yellowDark);
}

// Hub, guide sleeve and visible roller assemblies.
addMesh(new THREE.CylinderGeometry(1.15,1.15,1.9,24),mat.red,0,1.3,0);
addMesh(new THREE.CylinderGeometry(.86,.86,2.15,20),mat.black,0,1.25,0);
for(let i=0;i<8;i++){
  const a=i*Math.PI/4,x=Math.cos(a)*1.05,z=Math.sin(a)*1.05;
  const wheel=addMesh(new THREE.CylinderGeometry(.15,.15,.12,12),mat.rubber,x,.72,z);
  wheel.rotation.z=Math.PI/2-a;
  addMesh(new THREE.BoxGeometry(.16,.42,.18),mat.steelDark,x,.72,z);
}

// Double radial spider arms and seat mounting ring.
torus(3.68,.085,mat.steelDark,.12);
torus(3.25,.07,mat.yellowDark,.18);
for(let i=0;i<24;i++){
  const a=i*Math.PI*2/24;
  const nx=Math.cos(a), nz=Math.sin(a), tx=-Math.sin(a), tz=Math.cos(a);
  const spread=.11;
  tube(new THREE.Vector3(nx*1.55+tx*spread,.35,nz*1.55+tz*spread),new THREE.Vector3(nx*3.48+tx*spread,.03,nz*3.48+tz*spread),.052,i%2?mat.steelDark:mat.yellow);
  tube(new THREE.Vector3(nx*1.55-tx*spread,.35,nz*1.55-tz*spread),new THREE.Vector3(nx*3.48-tx*spread,.03,nz*3.48-tz*spread),.052,i%2?mat.steelDark:mat.yellow);

  // Seat rear frame and footboard support, matching the outward-facing seat geometry.
  tube(new THREE.Vector3(nx*3.42,.08,nz*3.42),new THREE.Vector3(nx*3.73,.86,nz*3.73),.047,mat.steelDark);
  tube(new THREE.Vector3(nx*3.5,-.08,nz*3.5),new THREE.Vector3(nx*4.02,-.38,nz*4.02),.043,mat.steel);
  addMesh(new THREE.BoxGeometry(.38,.055,.34),mat.steelDark,nx*4.03,-.39,nz*4.03);

  // Shoulder-restraint pivot housing and side safety brackets.
  addMesh(new THREE.BoxGeometry(.12,.26,.18),mat.yellowDark,nx*3.67+tx*.32,.74,nz*3.67+tz*.32);
  addMesh(new THREE.BoxGeometry(.12,.26,.18),mat.yellowDark,nx*3.67-tx*.32,.74,nz*3.67-tz*.32);
}

// Characteristic mechanical underside: brake fins, hose runs, boxed calipers and central service ring.
torus(2.15,.11,mat.black,-.35);torus(2.62,.075,mat.steelDark,-.3);
for(let i=0;i<12;i++){
  const a=i*Math.PI*2/12,nx=Math.cos(a),nz=Math.sin(a);
  addMesh(new THREE.BoxGeometry(.12,.62,.42),mat.steelDark,nx*2.55,-.55,nz*2.55);
  addMesh(new THREE.BoxGeometry(.08,.5,.28),mat.black,nx*2.72,-.55,nz*2.72);
  tube(new THREE.Vector3(nx*1.15,-.18,nz*1.15),new THREE.Vector3(nx*2.45,-.48,nz*2.45),.024,mat.black);
}

// Extra outer trim and small marker lights make the edge read as a real illuminated fairground gondola.
torus(4.55,.055,mat.steel,1.74);
const markerCount=mobile?24:48;
for(let i=0;i<markerCount;i++){const a=i*Math.PI*2/markerCount;bulb(4.53,a,1.82,i%4===0?mat.ledBlue:mat.ledWarm,.036)}

window.__hangoverDetailPass = { spin, version: 2 };
