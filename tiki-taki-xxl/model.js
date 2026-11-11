import * as THREE from 'three';

/** Tiki Taki XXL (Paulsen) — detailed photo-guided fan reconstruction.
 *  18x13m ride footprint, one 20-seat rigid square rotor, 4x5 inward-facing seats.
 *  29m pivot + 27m pendulum are modeling assumptions, not authenticated KMG plans.
 *  Static structure and moving groups are separated for correct two-axis rigging.
 */
export function createTikiTaki(scene) {
 const root=new THREE.Group();root.name='TIKI_TAKI_XXL_RIG';scene.add(root);
 const fixed=new THREE.Group();fixed.name='STATIC_STRUCTURE';root.add(fixed);
 const pivot=new THREE.Group();pivot.name='MAIN_PENDULUM_PIVOT';pivot.position.y=29;root.add(pivot);
 const spinRig=new THREE.Group();spinRig.name='GONDOLA_SPIN_PIVOT';spinRig.position.y=-27;pivot.add(spinRig);
 const pal={yellow:0xf8cc20,bright:0xffe33b,darkYellow:0xbb8218,steel:0xa3aeb2,silver:0xe0e5e1,red:0xd31337,magenta:0xff238e,black:0x0a1015,coal:0x1b2225,teal:0x0daca4,mint:0x43d3b4,green:0x2d8c48,leaf:0x81b84a,wood:0x9f632d,brown:0x4e2918,white:0xffeedd,orange:0xf08717,purple:0x8650ad};
 const M={};for(const [k,c] of Object.entries(pal))M[k]=new THREE.MeshStandardMaterial({color:c,roughness:.48,metalness:['yellow','bright','darkYellow','steel','silver'].includes(k)?.48:.08,side:THREE.DoubleSide});
 const put=(p,geo,mt,n,x=0,y=0,z=0)=>{const q=new THREE.Mesh(geo,typeof mt==='string'?M[mt]:mt);q.name=n;q.position.set(x,y,z);q.castShadow=q.receiveShadow=true;p.add(q);return q};
 const block=(p,w,h,d,x,y,z,m,n)=>put(p,new THREE.BoxGeometry(w,h,d),m,n,x,y,z);
 const ball=(p,r,x,y,z,m,n,seg=12)=>put(p,new THREE.SphereGeometry(r,seg,9),m,n,x,y,z);
 const rod=(p,a,b,r,m,n,sections=10)=>{const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),D=B.clone().sub(A);const o=put(p,new THREE.CylinderGeometry(r,r,D.length(),sections),m,n);o.position.copy(A.add(B).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),D.normalize());return o};
 const girder=(p,a,b,w,d,m,n)=>{const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),D=B.clone().sub(A);const o=block(p,w,D.length(),d,0,0,0,m,n);o.position.copy(A.add(B).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),D.normalize());return o};
 function signTexture(text,w=1024,h=260,background='#5c321e',edge='#ff409b',ink='#ffe059'){
   const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');
   const grad=g.createLinearGradient(0,0,w,h);grad.addColorStop(0,background);grad.addColorStop(.5,'#7c472b');grad.addColorStop(1,background);
   g.fillStyle=grad;g.beginPath();g.roundRect(9,8,w-18,h-16,45);g.fill();
   g.lineWidth=16;g.strokeStyle=edge;g.stroke();g.fillStyle=ink;let fontSize=Math.floor(h*.62);g.font='900 '+fontSize+'px system-ui';g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';
   while(g.measureText(text).width>w-75&&fontSize>18){fontSize-=5;g.font='900 '+fontSize+'px system-ui'}
   g.lineWidth=15;g.strokeStyle='#4c230f';g.strokeText(text,w/2,h/2);g.fillText(text,w/2,h/2);
   const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t
 }
 function signage(p,txt,w,h,x,y,z){const map=signTexture(txt);return put(p,new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map,side:THREE.DoubleSide,transparent:true,roughness:.9}),'SIGN_'+txt,x,y,z)}
 function flower(p,x,y,z,scale=1){
  const colors=['magenta','red','orange','leaf'];const m=colors[Math.abs(Math.floor((x*3+y)*5))%colors.length];
  for(let i=0;i<5;i++){const a=i*Math.PI*2/5;const o=ball(p,.16*scale,x+Math.sin(a)*.19*scale,y+Math.cos(a)*.19*scale,z,m,'HIBISCUS_PETAL',9);o.scale.set(1.23,1.1,.63)}
  ball(p,.095*scale,x,y,z+.09*scale,'yellow','HIBISCUS_CENTER',10)
 }
 function tikiFace(g,cx,cy,s){
  g.save();g.translate(cx,cy);g.scale(s,s);
  const stroke=(c,w=8)=>{g.strokeStyle=c;g.lineWidth=w;g.lineCap='round';g.lineJoin='round'};
  g.beginPath();g.moveTo(-110,-157);g.lineTo(-50,-193);g.lineTo(-12,-166);g.lineTo(16,-208);g.lineTo(78,-159);g.lineTo(119,-101);g.lineTo(103,110);g.lineTo(45,174);g.lineTo(-64,168);g.lineTo(-116,82);g.closePath();g.fillStyle='#083c40';g.fill();stroke('#f74487',12);g.stroke();
  for(let k=0;k<6;k++){g.beginPath();g.moveTo(-102+k*40,-145);g.lineTo(-93+k*40,-196-k%2*18);stroke(k%2?'#0dbcb4':'#ef7f1c',15);g.stroke()}
  for(const q of [-1,1]){
   g.fillStyle='#f58a25';g.beginPath();g.ellipse(q*55,-52,45,40,q*.15,0,Math.PI*2);g.fill();stroke('#0dc2ac',12);g.stroke();
   g.fillStyle='#fbf9dc';g.beginPath();g.ellipse(q*55,-49,25,21,0,0,Math.PI*2);g.fill();g.fillStyle='#16191d';g.beginPath();g.arc(q*55,-50,13,0,Math.PI*2);g.fill();
   g.fillStyle='#f32b80';g.beginPath();g.arc(q*81,34,29,0,Math.PI*2);g.fill();stroke('#f0ad20',6);g.stroke()
  }
  g.beginPath();g.moveTo(-97,42);g.bezierCurveTo(-58,22,55,23,98,41);g.bezierCurveTo(80,148,-80,159,-97,42);g.closePath();g.fillStyle='#fc3177';g.fill();stroke('#ffc237',13);g.stroke();
  g.beginPath();g.moveTo(-85,56);g.bezierCurveTo(-57,67,52,68,85,54);g.bezierCurveTo(61,130,-60,135,-85,56);g.fillStyle='#1b171b';g.fill();
  g.fillStyle='#fff7e9';for(let k=-3;k<=3;k++){g.beginPath();g.moveTo(k*22-8,59);g.lineTo(k*22+8,59);g.lineTo(k*22,90);g.fill()}
  g.beginPath();g.moveTo(-65,-118);g.quadraticCurveTo(0,-148,65,-118);stroke('#ff971f',15);g.stroke();g.restore()
 }
 function scenicMural(){
  const c=document.createElement('canvas');c.width=2048;c.height=760;const g=c.getContext('2d');
  const sky=g.createLinearGradient(0,0,0,760);sky.addColorStop(0,'#f8e0ac');sky.addColorStop(.50,'#fffbdf');sky.addColorStop(1,'#b1dbc5');g.fillStyle=sky;g.fillRect(0,0,2048,760);
  // Waves and red surfboard follow the actual surfer scene concept.
  for(let i=0;i<34;i++){let x=i*85-100;g.beginPath();g.moveTo(x,720);g.bezierCurveTo(x+120,490,x-90,475,x+140,360);g.strokeStyle=['#086c79','#16b3a4','#f8fff2'][i%3];g.lineWidth=15+i%4*3;g.stroke()}
  g.save();g.translate(360,640);g.rotate(-.3);g.fillStyle='#d71839';g.beginPath();g.ellipse(0,0,400,40,0,0,Math.PI*2);g.fill();g.strokeStyle='#301417';g.lineWidth=12;g.stroke();g.restore();
  for(let i=0;i<17;i++){const x=i*125+35;
   g.save();g.translate(x,55+i%3*14);g.rotate(Math.sin(i*1.7)*.35);
   for(let j=-4;j<=4;j++){g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(j*26,-116,j*52,65);g.strokeStyle=j%2?'#1b773e':'#7daf2f';g.lineWidth=14;g.stroke()}g.restore();
   if(i%2===0)for(let k=0;k<3;k++){g.beginPath();g.arc(x+k*27-21,124+k%2*19,19,0,Math.PI*2);g.fillStyle=['#ff287c','#f8a530','#f53b80'][k];g.fill()}
  }
  // Huge rainbow-carved Tikis at asymmetric positions of the artwork.
  tikiFace(g,450,447,1.22);tikiFace(g,1470,410,1.53);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t
 }
 // Realistic ground and checker plate, 18m broad transport deck.
 block(fixed,18,.55,13,0,.06,0,'silver','METAL_CHEQUER_PLATE');
 for(let x=-8.7;x<9;x+=.95)block(fixed,.065,.03,12.8,x,.36,0,'yellow','DECK_GOLD_ANTI_SLIP_LINE');
 for(const z of [-6.4,6.4])block(fixed,18,.22,.14,0,.39,z,'darkYellow','DECK_OUTER_GOLD_EDGE');
 for(const x of [-8.9,8.9])block(fixed,.16,.22,13,x,.39,0,'darkYellow','DECK_SIDE_GOLD_EDGE');
 for(const z of [-4.6,4.6]){
  for(const x of [-7.9,7.9]){
   girder(fixed,[x,.5,z],[0,29,z*.62],.75,.79,'yellow','MAIN_A_FRAME_BOX_SECTION');
   girder(fixed,[x*.88,4,z],[x*.06,27,z*.62],.095,.11,'bright','A_FRAME_STIFFENING_RIB');
   block(fixed,1.5,.55,1.15,x,.63,z,'darkYellow','A_FRAME_ANCHOR_SHOE');
   for(let k=0;k<35;k++){const t=k/35;ball(fixed,.055,x*(1-t)+Math.sign(x)*.26,.7+28.3*t,z+(z*.62-z)*t+.32,'magenta','MAIN_A_FRAME_LED',8)}
   const decor=signage(fixed,'TIKI TAKI',2.8,.75,x*.47,15.0,z+.5);
   decor.rotation.z=Math.sign(x)*-.30;
   for(let k=0;k<8;k++)ball(fixed,.05,x*.47+Math.sin(k)*.42,13.6+k*.3,z+.5,'magenta','LEG_DECORATION_LAMP',8)
   for(const side of [-.44,.44])rod(fixed,[x-.32,.72,z+side],[x+.32,.72,z+side],.07,'steel','STAINLESS_FOOT_PIN');
  }
 }
 for(const z of [-3.6,3.6]){
  for(const x of [-4.3,4.3]){
   rod(fixed,[x,.6,z],[x,12.9,z],.13,'yellow','VERTICAL_AUXILIARY_SUPPORT');
   rod(fixed,[x,12.9,z],[0,29,z*.6],.14,'darkYellow','INSIDE_REAR_STAY');
  }
  for(let y of [6.4,9.1])rod(fixed,[-7,y,z],[7,y,z],.12,'yellow','WIDE_TRANSVERSE_BRACE');
 }
 rod(fixed,[0,29,-5],[0,29,5],.67,'steel','MAIN_BEARING_AXLE');
 for(const z of [-4.65,4.65]){ball(fixed,.78,0,29,z,'darkYellow','BEARING_HOUSING',20);for(let i=0;i<8;i++){const a=i*Math.PI/4;ball(fixed,.06,Math.cos(a)*.59,29+Math.sin(a)*.59,z,'steel','BEARING_BOLT',8)}}
 signage(fixed,'TIKI TAKI',4.8,1.2,0,31.25,4.65);
 for(const x of [-6.8,6.8])for(let y of [6,11,15]){
  block(fixed,.65,.95,.55,x*(1-y/29),y,4.9-y*.05,'black','MAIN_LEG_SPEAKER');
  for(let i=0;i<4;i++)rod(fixed,[x*(1-y/29)-.27,y-.32+i*.22,5.19-y*.05],[x*(1-y/29)+.27,y-.32+i*.22,5.19-y*.05],.018,'coal','SPEAKER_GRILLE')
 }
 // Painted scenic mural, behind all A-frame parts and moving gondolas.
 block(fixed,18,6.6,.19,0,3.75,-6.5,'darkYellow','REAR_MURAL_CARRIER');
 put(fixed,new THREE.PlaneGeometry(17.8,6.4),new THREE.MeshStandardMaterial({map:scenicMural(),roughness:1,side:THREE.DoubleSide}),'ACTUAL_THEME_INSPIRED_TROPICAL_MURAL',0,3.8,-6.38);
 for(let x=-8.9;x<8.9;x+=.13)ball(fixed,.055,x,7.08,-6.1,'magenta','PINK_TOP_BULB',8);
 // Pendulum, 27m long, swings in X/Y only.
 girder(pivot,[0,-.2,0],[0,-27,0],1.32,1.1,'yellow','CLOSED_STEEL_MAIN_PENDULUM_ARM');
 for(const z of [-.68,.68]){rod(pivot,[0,-2,z],[0,-24,z],.09,'bright','ARM_OUTER_LONGITUDINAL_RIB');rod(pivot,[0,-1,z+.15],[0,-21,z+.15],.055,'steel','HYDRAULIC_METAL_PIPE')}
 for(let i=0;i<11;i++){const y=-2-i*2.3;block(pivot,1.43,.16,1.3,0,y,0,'bright','ARM_STIFFENER_RIB');for(const sx of [-.73,.73])ball(pivot,.09,sx,y,.65,'magenta','ARM_RGB_DECOR_LAMP',9)}
 block(pivot,2.5,2.0,2.4,0,-26.25,0,'darkYellow','PENDULUM_END_MAIN_GEAR_CASING');
 ball(spinRig,1.4,0,0,0,'yellow','FOUR_WAY_CENTRAL_ROTOR_HUB',22);
 const rows=[],leds=[],restraintMeshes=[],seatPositions=[];
 for(let g=0;g<4;g++){
  const G=new THREE.Group();G.name='GONDOLA_'+(g+1);G.rotation.y=g*Math.PI/2;spinRig.add(G);rows.push(G);
  girder(G,[0,0,0],[4.45,0,0],.4,.5,'yellow','RADIAL_GONDOLA_CARRIER');
  block(G,1.5,.72,9.0,4.44,-.64,0,'yellow','FIVE_SEAT_FRAME');
  block(G,.2,.55,9.0,5.14,.37,0,'darkYellow','BACK_SEAT_RESTRAINT_RAIL');
  rod(G,[3.25,-1.27,-4.5],[3.25,-1.27,4.5],.09,'steel','TOE_PROTECTION_BAR');
  for(const zz of [-4.58,4.58])rod(G,[4.0,-1.15,zz],[5.1,1.27,zz],.1,'yellow','SIDE_STIFFENER');
  // One central monitor, five individual lock lamps above middle seat.
  block(G,.46,.83,.92,3.7,1.77,0,'black','CENTRAL_BLACK_LOCK_MONITOR_CASE');
  for(let s=0;s<5;s++){
   const number=g*5+s+1,seatZ=(s-2)*1.76;
   const ledMat=new THREE.MeshStandardMaterial({color:0x2a302b,emissive:0x07100a,emissiveIntensity:.1});
   leds.push(ball(G,.08,3.45,1.48,(s-2)*.17,ledMat,'LOCK_INDICATOR_S'+String(number).padStart(2,'0'),12));
   const S=new THREE.Group();S.name='SEAT_'+String(number).padStart(2,'0');S.position.set(4.35,-.36,seatZ);G.add(S);
   block(S,1.35,.30,1.55,-.23,-.62,0,'red','RED_SEAT_CUSHION');
   block(S,.37,1.6,1.49,.39,.16,0,'black','BLACK_HIGH_BACKREST');
   block(S,.21,.54,1.04,.50,1.14,0,'coal','HEAD_PAD');
   for(const sign of [-1,1]){
    block(S,1.2,.28,.16,-.2,-.56,sign*.68,'magenta','RED_SIDE_BOLSTER');
    rod(S,[-.85,-.44,sign*.74],[.36,-.44,sign*.74],.055,'silver','SILVER_HANDRAIL');
    block(S,.28,.25,.20,.37,.88,sign*.59,'steel','HARNES_HINGE');
   }
   const R=new THREE.Group();R.name='RESTRAINT_'+String(number).padStart(2,'0');R.position.set(.39,1.16,0);S.add(R);restraintMeshes.push(R);
   for(const side of [-1,1]){
    rod(R,[0,0,side*.57],[-.19,-.24,side*.64],.16,'black','U_BOW_UPPER');
    rod(R,[-.19,-.24,side*.64],[-.81,-1.18,side*.64],.18,'black','U_BOW_SHOULDER');
    rod(R,[-.81,-1.18,side*.64],[-1.03,-1.22,side*.38],.18,'coal','U_BOW_LOWER');
   }
   rod(R,[-1.03,-1.23,-.38],[-1.03,-1.23,.38],.18,'black','U_BOW_LAP_CROSSBAR');
   seatPositions.push(new THREE.Vector3(3.9,-.2,seatZ));
  }
 }
 // Actual front aesthetic: TIKI / TAKI fascia split around carved idol sculpture.
 for(const [x,title] of [[-5.2,'TIKI'],[5.2,'TAKI']]){
  block(fixed,7.15,1.8,.35,x,1.2,6.6,'yellow','WOOD_CARVED_SPLIT_FASCIA');
  const sp=signage(fixed,title,6.9,1.55,x,1.2,6.82);
 }
 const idol=new THREE.Group();idol.name='TIKI_CARVED_FRONT_IDOL';idol.position.set(0,0,7.18);fixed.add(idol);
 for(let k=0;k<3;k++)block(idol,4.1-k*.3,.3,1.5-k*.15,0,.40+k*.28,.45,'silver','TIKI_STONE_STAIR');
 block(idol,2.35,2.45,.55,0,2.28,0,'wood','CARVED_WOOD_TIKI_HEAD');
 for(const x of [-1.3,1.3]){rod(idol,[x,1.0,.25],[x,3.6,.25],.18,'wood','WOODEN_IDOL_COLUMN');for(const y of [1.5,2.2,2.9])ball(idol,.13,x,y,.5,'teal','IDOL_COLUMN_DETAIL')}
 for(const x of [-.53,.53]){ball(idol,.52,x,3.0,.5,'green','GREEN_CARVED_EYEBROW');ball(idol,.37,x,2.87,.84,'teal','TIKI_BULGING_EYE');ball(idol,.19,x,2.87,1.14,'white','WHITE_OF_EYE');ball(idol,.11,x,2.87,1.32,'black','TIKI_PUPIL');}
 ball(idol,.22,0,2.45,1.03,'orange','TIKI_ORANGE_NOSE');ball(idol,.84,0,1.72,.57,'red','WIDE_ORANGE_LIPPED_MOUTH');ball(idol,.65,0,1.72,.89,'black','TIKI_OPEN_MOUTH');
 for(let i=-3;i<=3;i++){block(idol,.12,.23,.12,i*.18,1.90,1.49,'white','UPPER_TIKI_TOOTH');block(idol,.11,.17,.10,i*.18,1.46,1.44,'white','LOWER_TIKI_TOOTH')}
 for(let j=0;j<18;j++){let a=j*2*Math.PI/18;flower(idol,Math.cos(a)*1.26,3.52+Math.sin(a)*.42,.51,.68)}
 // ticket kiosk at photo-correct front-right location (outside 18x13 ride machine outline).
 const booth=new THREE.Group();booth.name='TICKET_BOOTH';booth.position.set(12.25,0,8.5);fixed.add(booth);
 block(booth,7.6,4.3,3.5,0,2.4,0,'wood','CARVED_TROPICAL_KIOSK_BASE');
 block(booth,8.3,.47,4.2,0,4.84,0,'darkYellow','CARVED_TICKET_ROOFLINE');
 for(const x of [-3.35,-1.7,1.7,3.35]){rod(booth,[x,.45,1.93],[x,4.68,1.93],.14,'brown','BAMBOO_RAIL');for(let y=.7;y<4.8;y+=.6)ball(booth,.15,x,y,1.94,'wood','BAMBOO_JOINT',8)}
 for(const x of [-2.45,0,2.45]){block(booth,2.13,2.2,.1,x,3.25,1.94,'black','GLASS_SERVICE_WINDOW');block(booth,2.21,.11,.15,x,4.44,2.06,'yellow','TICKET_WINDOW_FRAME')}
 // multicolour flower garland, volcanic lava cone and ticket arch
 const v=put(booth,new THREE.ConeGeometry(1.55,3.6,12),'purple','PURPLE_SCENIC_VOLCANO',1.15,6.65,-.75);
 put(booth,new THREE.ConeGeometry(.38,.83,12),'orange','LAVA_VOLCANO_CAP',1.15,8.75,-.75);
 for(let i=0;i<26;i++){let a=i*Math.PI/25;const x=Math.cos(a)*3.72,y=5.23+Math.sin(a)*.73;flower(booth,x,y,1.95,.78)}
 signage(booth,'TICKETS',5.7,1.35,0,5.74,2.17);
 signage(booth,'TIKI TAKI',6.45,1.05,0,.9,2.07);
 for(const x of [-3.25,3.25]){ball(booth,.44,x,1.5,2.13,'green','SMALL_CORNER_TIKI_MASK');for(const side of [-.18,.18])ball(booth,.09,x+side,1.56,2.50,'orange','SMALL_TIKI_EYE');ball(booth,.17,x,1.32,2.50,'red','SMALL_TIKI_MOUTH')}
 // Entrance rails, show loudspeakers and safety fencing.
 for(let i=0;i<18;i++)rod(fixed,[-8.3+i*.98,.45,5.4],[-8.3+i*.98,1.65,5.4],.035,'yellow','FRONT_QUEUE_FENCE_POST');
 for(const y of [1.03,1.63])rod(fixed,[-8.7,y,5.4],[8.7,y,5.4],.045,'yellow','FRONT_QUEUE_FENCE_RAIL');
 const axes=new THREE.AxesHelper(5);axes.position.set(0,29,0);axes.visible=false;scene.add(axes);
 return {root,pivot,spinRig,rows,leds,restraintMeshes,seatPositions,axes};
}
