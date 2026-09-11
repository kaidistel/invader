import * as THREE from 'three';

// Ported from the supplied Blender NIGHTFLY / PEGASUS 16 v3.1 reconstruction.
// Drawing values remain visual estimates, exactly as noted in the source file.
const GONDOLA_RADIUS=3.60;
const FORK_OUTER_X=1.80;
const FORK_SPLIT_Y=1.25;
const FORK_ELBOW_Y=1.68;

const YELLOW=0xf3bd1d, SILVER=0xbfc2c1, DARK=0x151515, CHROME=0xd5d7d6, LIGHT=0xfff0b0;
const mat=(color,metalness=.55,roughness=.3,emissive=0)=>new THREE.MeshStandardMaterial({color,metalness,roughness,emissive,emissiveIntensity:emissive?1.15:0});
const M={yellow:mat(YELLOW,.42,.28),silver:mat(SILVER,.78,.24),dark:mat(DARK,.22,.5),chrome:mat(CHROME,.92,.14),light:mat(0xfff8df,.05,.22,LIGHT)};

function beam(a,b,w,d,material,parent,name){
 const v=new THREE.Vector3().subVectors(b,a),len=v.length(),mesh=new THREE.Mesh(new THREE.BoxGeometry(w,d,len),material);
 mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),v.normalize());mesh.castShadow=mesh.receiveShadow=true;mesh.name=name;parent.add(mesh);return mesh;
}
function cylinder(a,b,r,material,parent,name,n=18){
 const v=new THREE.Vector3().subVectors(b,a),len=v.length(),mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,len,n),material);
 mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());mesh.castShadow=true;mesh.name=name;parent.add(mesh);return mesh;
}
function bulb(p,parent){const b=new THREE.Mesh(new THREE.SphereGeometry(.035,8,6),M.light);b.position.copy(p);b.name='Pegasus31_LED';parent.add(b);return b;}

function hideLegacyForks(nf){
 nf.scene.traverse(o=>{if(!o.isMesh)return;const n=o.name||'';if(/Crown_spoke|Crown_fork|Nightfly_Y_fork|Shield_perimeter|Shield_vertical_wire|Shield_horizontal_wire|Gondola_end_guard/i.test(n))o.visible=false;});
}

function buildBranch(root,k){
 const a=k*Math.PI/2,branch=new THREE.Group();branch.name=`Pegasus31_Fork_${k+1}`;branch.rotation.z=a;root.add(branch);
 beam(new THREE.Vector3(0,.32,0),new THREE.Vector3(0,FORK_SPLIT_Y,0),.34,.30,M.silver,branch,'Pegasus31_Silver_radial_spoke');
 for(const side of [-1,1]){
  const x=side*FORK_OUTER_X;
  beam(new THREE.Vector3(0,FORK_SPLIT_Y,0),new THREE.Vector3(x,FORK_ELBOW_Y,0),.22,.22,M.yellow,branch,'Pegasus31_Fork_swept_shoulder');
  beam(new THREE.Vector3(x,FORK_ELBOW_Y,0),new THREE.Vector3(x,GONDOLA_RADIUS,0),.22,.22,M.silver,branch,'Pegasus31_Fork_outer_cheek');
  cylinder(new THREE.Vector3(x-.10,GONDOLA_RADIUS,0),new THREE.Vector3(x+.10,GONDOLA_RADIUS,0),.20,M.silver,branch,'Pegasus31_stationary_bearing',20);
  cylinder(new THREE.Vector3(side*1.48,GONDOLA_RADIUS,0),new THREE.Vector3(x,GONDOLA_RADIUS,0),.085,M.chrome,branch,'Pegasus31_axial_journal',16);
  for(let i=0;i<15;i++){
   const t=i/14;bulb(new THREE.Vector3(side*(.15+t*(FORK_OUTER_X-.15)),FORK_SPLIT_Y+t*(FORK_ELBOW_Y-FORK_SPLIT_Y),.13),branch);
  }
  const count=Math.floor((GONDOLA_RADIUS-FORK_ELBOW_Y)/.10)+1;
  for(let i=0;i<count;i++)bulb(new THREE.Vector3(x,FORK_ELBOW_Y+i*.10,.13),branch);
 }
 for(let j=0;j<Math.floor((FORK_SPLIT_Y-.45)/.10);j++)for(const x of [-.11,.11])bulb(new THREE.Vector3(x,.45+j*.10,.175),branch);
 return branch;
}

function enhanceGondola(group){
 // The v3.1 source puts the continuous axle behind the four seats and keeps all guards outside the passenger envelope.
 cylinder(new THREE.Vector3(-1.45,.10,.08),new THREE.Vector3(1.45,.10,.08),.10,M.chrome,group,'Pegasus31_continuous_axle',20);
 beam(new THREE.Vector3(-1.29,-.23,-1.12),new THREE.Vector3(1.29,-.23,-1.12),.15,.66,M.dark,group,'Pegasus31_underseat_frame');
 for(const side of [-1,1]){
  const x=side*1.46;
  cylinder(new THREE.Vector3(x-side*.04,0,0),new THREE.Vector3(x+side*.04,0,0),.19,M.silver,group,'Pegasus31_bearing_flange',24);
  cylinder(new THREE.Vector3(side*1.305,-.02,-.03),new THREE.Vector3(side*1.305,.02,-.03),.21,M.chrome,group,'Pegasus31_brake_disc',24);
  const cal=new THREE.Mesh(new THREE.BoxGeometry(.12,.11,.14),M.dark);cal.position.set(side*1.305,.175,-.03);cal.name='Pegasus31_brake_caliper';group.add(cal);
 }
 // No overhead hoop. Only small end-side protective posts, fully outside all four seats.
 for(const side of [-1,1]){
  const x=side*1.55;
  cylinder(new THREE.Vector3(x,.18,-1.13),new THREE.Vector3(x,.18,.12),.022,M.chrome,group,'Pegasus31_end_side_post',12);
  cylinder(new THREE.Vector3(x,.18,-1.13),new THREE.Vector3(x,-.64,-1.13),.022,M.chrome,group,'Pegasus31_end_lower_rail',12);
 }
}

export function installPegasus31(nf){
 if(!nf?.groups?.crown)return false;
 if(nf.scene.getObjectByName('Pegasus31_root'))return true;
 hideLegacyForks(nf);
 const root=new THREE.Group();root.name='Pegasus31_root';nf.groups.crown.add(root);
 // Crown-local dimensions from the supplied v3.1 Blender source.
 for(let k=0;k<4;k++)buildBranch(root,k);
 for(let k=0;k<4;k++)enhanceGondola(nf.groups['gondola'+k]);
 // Recolor the surviving original hardware toward the supplied Nightfly reference palette.
 nf.scene.traverse(o=>{if(!o.isMesh||!o.material)return;const n=(o.name||'').toLowerCase();if(n.includes('seat_yellow')||n.includes('yellow_shell')||n.includes('spoke_yellow')){o.material=o.material.clone();o.material.color.setHex(YELLOW);}else if(n.includes('back_pad')||n.includes('headrest')||n.includes('restraint')){o.material=o.material.clone();o.material.color.setHex(DARK);}});
 return true;
}

function boot(){const nf=window.nightfly;if(!nf?.groups?.crown){requestAnimationFrame(boot);return;}installPegasus31(nf);}
boot();
