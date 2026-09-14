import * as THREE from 'three';

const GONDOLA_RADIUS=3.60, FORK_OUTER_X=1.80, FORK_SPLIT_Y=1.25, FORK_ELBOW_Y=1.68;
const YELLOW=0xf3bd1d,SILVER=0xbfc2c1,DARK=0x151515,CHROME=0xd5d7d6,LIGHT=0xfff0b0;
const mat=(color,metalness=.55,roughness=.3,emissive=0)=>new THREE.MeshStandardMaterial({color,metalness,roughness,emissive,emissiveIntensity:emissive?1.15:0});
const M={yellow:mat(YELLOW,.42,.28),silver:mat(SILVER,.78,.24),dark:mat(DARK,.22,.5),chrome:mat(CHROME,.92,.14),light:mat(0xfff8df,.05,.22,LIGHT)};
const GUARD_MAT=new THREE.MeshStandardMaterial({color:0xc4c7c7,metalness:.88,roughness:.22});
function beam(a,b,w,d,material,parent,name){const v=new THREE.Vector3().subVectors(b,a),mesh=new THREE.Mesh(new THREE.BoxGeometry(w,d,v.length()),material);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),v.normalize());mesh.castShadow=mesh.receiveShadow=true;mesh.name=name;parent.add(mesh);return mesh;}
function cylinder(a,b,r,material,parent,name,n=18){const v=new THREE.Vector3().subVectors(b,a),mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,v.length(),n),material);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());mesh.castShadow=true;mesh.name=name;parent.add(mesh);return mesh;}
function bulb(p,parent){const b=new THREE.Mesh(new THREE.SphereGeometry(.035,8,6),M.light);b.position.copy(p);b.name='Pegasus31_LED';parent.add(b);}
function cleanOriginalGondolas(nf){nf.scene.traverse(o=>{if(o.isMesh&&/Gondola_\d+_Seat_\d+_shell$/i.test(o.name||''))o.visible=false;});}
function hideLegacyForks(nf){nf.scene.traverse(o=>{if(o.isMesh&&/Crown_spoke|Crown_fork|Nightfly_Y_fork/i.test(o.name||''))o.visible=false;});}

// Reference geometry: the Pegasus 16 guards sit directly outside the two outer seats.
// They are narrow in the front/back direction and have a rounded, swept top and lower nose.
function roundedGuard(parent,side){
 const g=new THREE.Group();g.name=`Nightfly_GondolaGuard_${side<0?'L':'R'}`;parent.add(g);
 const x=side*1.48; // directly beside outer seat, not far outside the gondola
 const y=-.02;
 const outline=[
  [0,-.34,.02],[0,-.39,.18],[0,-.39,.72],[0,-.34,1.02],
  [0,-.23,1.22],[0,-.06,1.31],[0,.14,1.28],[0,.29,1.15],
  [0,.36,.91],[0,.36,.42],[0,.30,.16],[0,.20,.02]
 ].map(([dx,dy,z])=>new THREE.Vector3(x+side*dx,y+dy,z));
 for(let i=0;i<outline.length;i++)cylinder(outline[i],outline[(i+1)%outline.length],.024,GUARD_MAT,g,'Guard_round_frame',10);
 // Welded mesh follows the rounded outline. Horizontal rows get progressively narrower toward top/bottom.
 const rows=12;
 for(let r=1;r<rows;r++){
  const z=.04+r*(1.23/rows);
  const q=(z-.04)/1.23;
  const half=.34*(Math.sin(Math.PI*Math.min(1,Math.max(0,q)))**.28);
  cylinder(new THREE.Vector3(x,y-half,z),new THREE.Vector3(x,y+half,z),.0075,GUARD_MAT,g,'Guard_mesh_h',6);
 }
 for(let c=-5;c<=5;c++){
  const yy=y+c*.055;
  const edge=Math.abs(c)/5;
  const z0=.07+.10*edge, z1=1.24-.13*edge;
  cylinder(new THREE.Vector3(x,yy,z0),new THREE.Vector3(x,yy,z1),.0075,GUARD_MAT,g,'Guard_mesh_v',6);
 }
 // Curved tubular lower mounting rail returning toward the carrier.
 const p0=new THREE.Vector3(x,y-.34,.03),p1=new THREE.Vector3(x-side*.10,y-.43,-.05),p2=new THREE.Vector3(x-side*.25,y-.38,-.13);
 cylinder(p0,p1,.025,GUARD_MAT,g,'Guard_mount_1',10);cylinder(p1,p2,.025,GUARD_MAT,g,'Guard_mount_2',10);
}
function addGondolaGuards(nf){for(let k=0;k<4;k++){const gondola=nf.groups[`gondola${k}`];if(!gondola)continue;roundedGuard(gondola,-1);roundedGuard(gondola,1);}}
function buildBranch(root,k){const a=k*Math.PI/2,branch=new THREE.Group();branch.name=`Pegasus31_Fork_${k+1}`;branch.rotation.z=a;root.add(branch);beam(new THREE.Vector3(0,.32,0),new THREE.Vector3(0,FORK_SPLIT_Y,0),.34,.30,M.silver,branch,'Pegasus31_Silver_radial_spoke');for(const side of[-1,1]){const x=side*FORK_OUTER_X;beam(new THREE.Vector3(0,FORK_SPLIT_Y,0),new THREE.Vector3(x,FORK_ELBOW_Y,0),.22,.22,M.yellow,branch,'Pegasus31_Fork_swept_shoulder');beam(new THREE.Vector3(x,FORK_ELBOW_Y,0),new THREE.Vector3(x,GONDOLA_RADIUS,0),.22,.22,M.silver,branch,'Pegasus31_Fork_outer_cheek');cylinder(new THREE.Vector3(x-.10,GONDOLA_RADIUS,0),new THREE.Vector3(x+.10,GONDOLA_RADIUS,0),.20,M.silver,branch,'Pegasus31_stationary_bearing',20);cylinder(new THREE.Vector3(side*1.48,GONDOLA_RADIUS,0),new THREE.Vector3(x,GONDOLA_RADIUS,0),.085,M.chrome,branch,'Pegasus31_axial_journal',16);for(let i=0;i<15;i++){const t=i/14;bulb(new THREE.Vector3(side*(.15+t*(FORK_OUTER_X-.15)),FORK_SPLIT_Y+t*(FORK_ELBOW_Y-FORK_SPLIT_Y),.13),branch);}const count=Math.floor((GONDOLA_RADIUS-FORK_ELBOW_Y)/.10)+1;for(let i=0;i<count;i++)bulb(new THREE.Vector3(x,FORK_ELBOW_Y+i*.10,.13),branch);}for(let j=0;j<Math.floor((FORK_SPLIT_Y-.45)/.10);j++)for(const x of[-.11,.11])bulb(new THREE.Vector3(x,.45+j*.10,.175),branch);}
export function installPegasus31(nf){if(!nf?.groups?.crown)return false;if(nf.scene.getObjectByName('Pegasus31_root'))return true;cleanOriginalGondolas(nf);hideLegacyForks(nf);addGondolaGuards(nf);const root=new THREE.Group();root.name='Pegasus31_root';nf.groups.crown.add(root);for(let k=0;k<4;k++)buildBranch(root,k);nf.scene.traverse(o=>{if(!o.isMesh||!o.material)return;const n=(o.name||'').toLowerCase();if(n.includes('seat_yellow')||n.includes('yellow_shell')||n.includes('spoke_yellow')){o.material=o.material.clone();o.material.color.setHex(YELLOW);}else if(n.includes('back_pad')||n.includes('headrest')||n.includes('restraint')){o.material=o.material.clone();o.material.color.setHex(DARK);}});return true;}
function boot(){const nf=window.nightfly;if(!nf?.groups?.crown){requestAnimationFrame(boot);return;}installPegasus31(nf);}boot();
