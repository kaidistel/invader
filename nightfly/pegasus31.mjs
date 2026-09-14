import * as THREE from 'three';

const GONDOLA_RADIUS=3.60, FORK_OUTER_X=1.80, FORK_SPLIT_Y=1.25, FORK_ELBOW_Y=1.68;
const YELLOW=0xf3bd1d,SILVER=0xbfc2c1,DARK=0x151515,CHROME=0xd5d7d6,LIGHT=0xfff0b0;
const mat=(color,metalness=.55,roughness=.3,emissive=0)=>new THREE.MeshStandardMaterial({color,metalness,roughness,emissive,emissiveIntensity:emissive?1.15:0});
const M={yellow:mat(YELLOW,.42,.28),silver:mat(SILVER,.78,.24),dark:mat(DARK,.22,.5),chrome:mat(CHROME,.92,.14),light:mat(0xfff8df,.05,.22,LIGHT)};
const GUARD_MAT=mat(0xbfc2c1,.88,.22);
function beam(a,b,w,d,material,parent,name){const v=new THREE.Vector3().subVectors(b,a),mesh=new THREE.Mesh(new THREE.BoxGeometry(w,d,v.length()),material);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),v.normalize());mesh.castShadow=mesh.receiveShadow=true;mesh.name=name;parent.add(mesh);return mesh;}
function cylinder(a,b,r,material,parent,name,n=18){const v=new THREE.Vector3().subVectors(b,a),mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,v.length(),n),material);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());mesh.castShadow=true;mesh.name=name;parent.add(mesh);return mesh;}
function bulb(p,parent){const b=new THREE.Mesh(new THREE.SphereGeometry(.035,8,6),M.light);b.position.copy(p);b.name='Pegasus31_LED';parent.add(b);}
function cleanOriginalGondolas(nf){nf.scene.traverse(o=>{if(o.isMesh&&/Gondola_\d+_Seat_\d+_shell$/i.test(o.name||''))o.visible=false;});}
function hideLegacyForks(nf){nf.scene.traverse(o=>{if(o.isMesh&&/Crown_spoke|Crown_fork|Nightfly_Y_fork/i.test(o.name||''))o.visible=false;});}

// Rebuild the guards in the exact local axes used by build_model.py.
// The row direction changes by 90 degrees for every gondola, which is why a fixed X/Y placement was wrong.
function addReferenceGuard(parent,k,side){
 const t=k*Math.PI/2;
 const out=new THREE.Vector3(Math.cos(t),Math.sin(t),0).normalize();
 const tan=new THREE.Vector3(-Math.sin(t),Math.cos(t),0).normalize();
 const up=new THREE.Vector3(0,0,1);
 const e=tan.clone().multiplyScalar(side*1.67);
 const g=new THREE.Group();g.name=`Nightfly_GondolaGuard_${k+1}_${side<0?'L':'R'}`;parent.add(g);
 const shape=[[-.34,-.90],[.55,-.90],[.78,-.52],[.82,.12],[.56,.73],[.15,.91],[-.34,.63],[-.34,-.90]];
 const outline=shape.map(([q,z])=>e.clone().addScaledVector(out,q).addScaledVector(up,z));
 for(let i=0;i<outline.length-1;i++)cylinder(outline[i],outline[i+1],.035,GUARD_MAT,g,'Shield_perimeter',10);
 for(let q=-.28;q<.68;q+=.09){
  const ztop=.78-Math.max(0,q-.1)*.7;
  cylinder(e.clone().addScaledVector(out,q).addScaledVector(up,-.84),e.clone().addScaledVector(out,q).addScaledVector(up,ztop),.007,GUARD_MAT,g,'Shield_vertical_wire',6);
 }
 for(let z=-.8;z<.65;z+=.09){
  const qend=.7-Math.max(0,z-.1)*.35;
  cylinder(e.clone().addScaledVector(out,-.28).addScaledVector(up,z),e.clone().addScaledVector(out,qend).addScaledVector(up,z),.007,GUARD_MAT,g,'Shield_horizontal_wire',6);
 }
}
function addReferenceGuards(nf){for(let k=0;k<4;k++){const gondola=nf.groups[`gondola${k}`];if(!gondola)continue;addReferenceGuard(gondola,k,-1);addReferenceGuard(gondola,k,1);}}

function buildBranch(root,k){const a=k*Math.PI/2,branch=new THREE.Group();branch.name=`Pegasus31_Fork_${k+1}`;branch.rotation.z=a;root.add(branch);beam(new THREE.Vector3(0,.32,0),new THREE.Vector3(0,FORK_SPLIT_Y,0),.34,.30,M.silver,branch,'Pegasus31_Silver_radial_spoke');for(const side of[-1,1]){const x=side*FORK_OUTER_X;beam(new THREE.Vector3(0,FORK_SPLIT_Y,0),new THREE.Vector3(x,FORK_ELBOW_Y,0),.22,.22,M.yellow,branch,'Pegasus31_Fork_swept_shoulder');beam(new THREE.Vector3(x,FORK_ELBOW_Y,0),new THREE.Vector3(x,GONDOLA_RADIUS,0),.22,.22,M.silver,branch,'Pegasus31_Fork_outer_cheek');cylinder(new THREE.Vector3(x-.10,GONDOLA_RADIUS,0),new THREE.Vector3(x+.10,GONDOLA_RADIUS,0),.20,M.silver,branch,'Pegasus31_stationary_bearing',20);cylinder(new THREE.Vector3(side*1.48,GONDOLA_RADIUS,0),new THREE.Vector3(x,GONDOLA_RADIUS,0),.085,M.chrome,branch,'Pegasus31_axial_journal',16);for(let i=0;i<15;i++){const f=i/14;bulb(new THREE.Vector3(side*(.15+f*(FORK_OUTER_X-.15)),FORK_SPLIT_Y+f*(FORK_ELBOW_Y-FORK_SPLIT_Y),.13),branch);}const count=Math.floor((GONDOLA_RADIUS-FORK_ELBOW_Y)/.10)+1;for(let i=0;i<count;i++)bulb(new THREE.Vector3(x,FORK_ELBOW_Y+i*.10,.13),branch);}for(let j=0;j<Math.floor((FORK_SPLIT_Y-.45)/.10);j++)for(const x of[-.11,.11])bulb(new THREE.Vector3(x,.45+j*.10,.175),branch);}
export function installPegasus31(nf){if(!nf?.groups?.crown)return false;if(nf.scene.getObjectByName('Pegasus31_root'))return true;cleanOriginalGondolas(nf);hideLegacyForks(nf);addReferenceGuards(nf);const root=new THREE.Group();root.name='Pegasus31_root';nf.groups.crown.add(root);for(let k=0;k<4;k++)buildBranch(root,k);nf.scene.traverse(o=>{if(!o.isMesh||!o.material)return;const n=(o.name||'').toLowerCase();if(n.includes('seat_yellow')||n.includes('yellow_shell')||n.includes('spoke_yellow')){o.material=o.material.clone();o.material.color.setHex(YELLOW);}else if(n.includes('back_pad')||n.includes('headrest')||n.includes('restraint')){o.material=o.material.clone();o.material.color.setHex(DARK);}});return true;}
function boot(){const nf=window.nightfly;if(!nf?.groups?.crown){requestAnimationFrame(boot);return;}installPegasus31(nf);}boot();
