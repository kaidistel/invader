import * as THREE from 'three';

/**
 * Tiki Taki XXL — fan reconstruction, not manufacturer CAD.
 * The stationary frame, pendulum, spinning gondola, 20 restraints and LEDs
 * have named, independent transform nodes suitable for GLB export/rigging.
 */
export function createTikiTaki(scene) {
  const root = new THREE.Group(); root.name='TIKI_TAKI_XXL_ROOT'; scene.add(root);
  const fixed=new THREE.Group();fixed.name='STATIC_STRUCTURE';root.add(fixed);
  const pendulum=new THREE.Group();pendulum.name='MAIN_PENDULUM_PIVOT';pendulum.position.set(0,34,0);root.add(pendulum);
  const wheel=new THREE.Group();wheel.name='GONDOLA_SPIN_PIVOT';wheel.position.set(0,-24.8,0);pendulum.add(wheel);
  const pal={
    gold:0xfbd01c, goldDark:0xdca81b, lemon:0xffe650, pink:0xf72895, red:0xe31538,
    wine:0xa80d31, charcoal:0x101619, steel:0xa7b3b4, silver:0xdde2dd,
    teal:0x00b2a3, green:0x339b3b, deep:0x134529, aqua:0x30d6bf,
    sand:0xddbb77, brown:0x73431f, purple:0x683aaf
  };
  const material={};for(const [k,v] of Object.entries(pal))material[k]=new THREE.MeshStandardMaterial({color:v,metalness:['gold','goldDark','steel','silver'].includes(k)?.5:.12,roughness:.45,side:THREE.DoubleSide});
  function add(parent,geometry,mat,name,pos=[0,0,0],rot=[0,0,0]){
    const mesh=new THREE.Mesh(geometry,typeof mat==='string'?material[mat]:mat);
    mesh.name=name;mesh.position.set(...pos);mesh.rotation.set(...rot);
    mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  }
  const cube=(p,w,h,d,x,y,z,m,n)=>add(p,new THREE.BoxGeometry(w,h,d),m,n,[x,y,z]);
  const orb=(p,r,x,y,z,m,n,seg=14)=>add(p,new THREE.SphereGeometry(r,seg,10),m,n,[x,y,z]);
  function beam(p,a,b,r,m,n,segments=10){
    const aa=new THREE.Vector3(...a),bb=new THREE.Vector3(...b),diff=bb.clone().sub(aa);
    const obj=add(p,new THREE.CylinderGeometry(r,r,diff.length(),segments),m,n);
    obj.position.copy(aa.add(bb).multiplyScalar(.5));
    obj.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),diff.normalize());return obj;
  }
  function stripeTube(p,points,r,m,n){
    const c=new THREE.CatmullRomCurve3(points.map(q=>new THREE.Vector3(...q)));
    return add(p,new THREE.TubeGeometry(c,Math.max(8,points.length*6),r,7,false),m,n);
  }
  function signTexture(text,back='#2e4b2b',ink='#ffe856',border='#e33280',size=1024){
    const c=document.createElement('canvas');c.width=size;c.height=Math.round(size*.26);const ctx=c.getContext('2d');
    const gr=ctx.createLinearGradient(0,0,c.width,c.height);gr.addColorStop(0,back);gr.addColorStop(.5,'#522b1d');gr.addColorStop(1,back);
    ctx.fillStyle=gr;ctx.fillRect(0,0,c.width,c.height);
    ctx.strokeStyle=border;ctx.lineWidth=14;ctx.strokeRect(11,11,c.width-22,c.height-22);
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 '+Math.round(size*.15)+'px system-ui';
    ctx.lineJoin='round';ctx.lineWidth=17;ctx.strokeStyle='#401b17';ctx.strokeText(text,size/2,c.height*.52);
    ctx.fillStyle=ink;ctx.fillText(text,size/2,c.height*.52);
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t;
  }
  function sign(parent,text,w,h,x,y,z){
    const t=signTexture(text);
    return add(parent,new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:t,side:THREE.DoubleSide,roughness:.7}), 'SIGN_'+text,[x,y,z]);
  }
  // Platform and gold-framed deck.
  cube(fixed,42,.7,24,0,.1,0,'silver','CHECKERPLATE_PLATFORM');
  for(let x=-20;x<=20;x+=3)cube(fixed,.10,.045,23,x,.51,0,'gold','DECK_STRIPE_'+x);
  for(const z of [-11.9,11.9])cube(fixed,42,.22,.22,0,.56,z,'gold','PLATFORM_EDGE');
  for(const x of [-20.8,20.8])cube(fixed,.22,.22,24,x,.56,0,'gold','PLATFORM_EDGE_SIDE');
  // Main machine — A-frame, diagonal cross braces and dual bearings.
  for(const z of [-3.6,3.6]){
    for(const x of [-17.5,17.5]){
      beam(fixed,[x,.7,z],[0,34,z],.58,'gold','A_FRAME_MAIN_'+x+'_'+z,12);
      beam(fixed,[x*.74,7.9,z],[0,34,z],.12,'goldDark','A_FRAME_INNER_'+x+'_'+z);
      cube(fixed,2.6,1,2.4,x,.7,z,'goldDark','SUPPORT_FOOT');
    }
    beam(fixed,[-11,13,z],[11,13,z],.12,'gold','LOWER_TIE_BAR_'+z);
    beam(fixed,[-8,19,z],[8,19,z],.13,'gold','UPPER_TIE_BAR_'+z);
  }
  beam(fixed,[0,34,-4.5],[0,34,4.5],.85,'steel','TOP_PIVOT_SHAFT');
  for(const z of [-4.2,4.2])orb(fixed,1.08,0,34,z,'goldDark','MAIN_BEARING_HOUSING');
  // Rear vertical supports and bracing.
  for(const x of [-9.5,9.5]){
    beam(fixed,[x,.5,-6],[0,34,-3.6],.26,'goldDark','REAR_STAY');
    beam(fixed,[x,.5,6],[0,34,3.6],.26,'goldDark','FRONT_STAY');
  }
  // Pendulum: tapered wide yellow plate and secondary longitudinal members.
  beam(pendulum,[0,0,0],[0,-24.8,0],.70,'gold','MAIN_PENDULUM_ARM',12);
  beam(pendulum,[-.7,-3,-.44],[-.7,-23,-.44],.16,'goldDark','ARM_REINFORCEMENT_LEFT');
  beam(pendulum,[.7,-3,.44],[.7,-23,.44],.16,'goldDark','ARM_REINFORCEMENT_RIGHT');
  for(let y=-3;y>-23;y-=2.7)cube(pendulum,1.65,.22,1.38,0,y,0,'lemon','ARM_RIB_'+y);
  beam(pendulum,[0,-2,-1.25],[0,-21,-1.25],.075,'steel','ARM_CABLE');
  beam(pendulum,[0,-2,1.25],[0,-21,1.25],.075,'steel','ARM_HYDRAULIC_LINE');
  cube(pendulum,3,2.2,3.1,0,-24,0,'goldDark','PENDULUM_HUB_HOUSING');
  sign(pendulum,'TIKI TAKI',4.6,1.3,0,-13,1.1);
  // Rotor center and four rigid five-seat beams.
  orb(wheel,2.15,0,0,0,'gold','CENTRAL_ROTOR_HUB',24);
  const rows=[],leds=[],restraintMeshes=[],seatPositions=[];
  for(let g=0;g<4;g++){
    const section=new THREE.Group();section.name='GONDOLA_'+(g+1);
    section.rotation.y=-g*Math.PI/2;wheel.add(section);rows.push(section);
    beam(section,[0,0,0],[6.5,0,0],.35,'gold','RADIAL_ARM_G'+(g+1));
    beam(section,[1.2,.55,0],[6.15,.55,0],.12,'goldDark','ARM_RAIL_G'+(g+1));
    cube(section,1.4,1.1,11.1,6.35,-.65,0,'gold','SEAT_ROW_CARRIER_G'+(g+1));
    cube(section,.28,1.1,11.4,5.6,.65,0,'goldDark','UPPER_RESTRAINT_RAIL_G'+(g+1));
    for(let s=0;s<5;s++){
      const number=g*5+s+1,z=(s-2)*2.13;
      const seatNode=new THREE.Group();seatNode.name='SEAT_'+String(number).padStart(2,'0');seatNode.position.set(6.8,-.65,z);section.add(seatNode);
      cube(seatNode,1.75,.36,1.91,.2,-.65,0,'red','RED_SEAT_CUSHION');
      cube(seatNode,.58,1.95,1.73,-.52,.15,0,'charcoal','HIGH_BACKREST');
      cube(seatNode,.20,.6,1.7,-.78,1.13,0,'wine','HEADREST');
      for(const offset of [-.95,.95]){
        cube(seatNode,1.45,.22,.15,.26,-.57,offset,'wine','SEAT_SIDE');
      }
      const restraint=new THREE.Group();restraint.name='RESTRAINT_'+String(number).padStart(2,'0');
      restraint.position.set(-.46,1.02,0);seatNode.add(restraint);restraintMeshes.push(restraint);
      for(const dz of [-.66,.66]){
        stripeTube(restraint,[[0,0,dz],[.31,-.19,dz],[.75,-.84,dz],[.95,-1.3,dz]],.145,'charcoal','OVER_SHOULDER_BAR');
      }
      beam(restraint,[.95,-1.3,-.66],[.95,-1.3,.66],.17,'charcoal','LAP_RESTRAINT');
      const metalHandle=beam(seatNode,[1.0,-.44,-.92],[1.0,-.44,.92],.045,'silver','GRAB_BAR');
      // Exactly one status light per seat, all five over the centerline of the five-seat row.
      const ledMat=new THREE.MeshStandardMaterial({color:0x2a302b,emissive:0x07100a,emissiveIntensity:.1});
      cube(section,.12,.37,.48,5.35,1.26,z,'charcoal','LED_BACKPLATE_S'+String(number).padStart(2,'0'));
      const light=orb(section,.17,5.27,1.26,z,ledMat,'LOCK_INDICATOR_S'+String(number).padStart(2,'0'));
      leds.push(light);seatPositions.push(new THREE.Vector3(7.1,-.6,z));
      for(const dz of [-.92,.92])orb(seatNode,.14,.2,-.73,dz,'goldDark','SEAT_FASTENER');
    }
  }
  // Real-world inspired illustrated backwall; this geometry is original fan artwork.
  const back=new THREE.Group();back.name='TROPICAL_BACKDROP';fixed.add(back);
  cube(back,41,13,.3,0,7.1,-12.4,'sand','BACKDROP_PANEL');
  const art=document.createElement('canvas');art.width=1536;art.height=512;const ctx=art.getContext('2d');
  const bg=ctx.createLinearGradient(0,0,0,512);bg.addColorStop(0,'#ffe9a2');bg.addColorStop(.52,'#f5dbae');bg.addColorStop(1,'#7bc6ba');ctx.fillStyle=bg;ctx.fillRect(0,0,1536,512);
  // Layered ocean surf and tropical foliage.
  for(let i=0;i<38;i++){
    ctx.beginPath();const xx=i*46-30;ctx.moveTo(xx,512);
    ctx.bezierCurveTo(xx+100,320,xx-70,285,xx+28,195);
    ctx.strokeStyle=i%3===0?'#078a9c':i%3===1?'#2cbdab':'#0f6875';ctx.lineWidth=8+i%4*3;ctx.stroke();
  }
  for(let p=0;p<12;p++){
    const x=90+p*135,y=55+(p%3)*24;
    ctx.save();ctx.translate(x,y);ctx.rotate((p%4-2)*.4);
    for(let f=0;f<9;f++){ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo((f-4)*25,-110,(f-4)*54,45);ctx.strokeStyle=f%2?'#227840':'#72a835';ctx.lineWidth=11;ctx.stroke()}
    ctx.restore();
    for(let f=0;f<4;f++){const fx=x+(f-1.5)*23,fy=y+70+(f%2)*17;ctx.fillStyle=['#ff318b','#ff7735','#ffca44'][f%3];for(let j=0;j<5;j++){ctx.beginPath();ctx.ellipse(fx+Math.cos(j*Math.PI*2/5)*14,fy+Math.sin(j*Math.PI*2/5)*14,13,8,j*.5,0,Math.PI*2);ctx.fill()}ctx.fillStyle='#753524';ctx.beginPath();ctx.arc(fx,fy,8,0,Math.PI*2);ctx.fill()}
  }
  function mask(x,y,sc){
    ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);
    ctx.fillStyle='#0b423b';ctx.strokeStyle='#f2347e';ctx.lineWidth=11;
    ctx.beginPath();ctx.moveTo(-115,-125);ctx.lineTo(-70,-180);ctx.lineTo(0,-130);ctx.lineTo(90,-180);ctx.lineTo(115,-95);ctx.lineTo(110,92);ctx.lineTo(60,142);ctx.lineTo(-70,142);ctx.lineTo(-113,70);ctx.closePath();ctx.fill();ctx.stroke();
    for(const side of [-1,1]){ctx.fillStyle='#e98c17';ctx.beginPath();ctx.ellipse(side*58,-43,43,35,-side*.2,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fffada';ctx.beginPath();ctx.ellipse(side*59,-45,22,19,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#171515';ctx.beginPath();ctx.arc(side*59,-45,10,0,Math.PI*2);ctx.fill()}
    ctx.fillStyle='#fd4e82';ctx.beginPath();ctx.moveTo(-90,28);ctx.quadraticCurveTo(0,-12,90,28);ctx.quadraticCurveTo(68,122,0,120);ctx.quadraticCurveTo(-65,120,-90,28);ctx.fill();
    ctx.fillStyle='#ffffff';for(let j=-3;j<=3;j++){ctx.beginPath();ctx.moveTo(j*19-8,40);ctx.lineTo(j*19+8,40);ctx.lineTo(j*19,66);ctx.fill()}
    ctx.strokeStyle='#14c9b3';ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(-65,-123);ctx.lineTo(-30,-155);ctx.lineTo(0,-110);ctx.lineTo(30,-155);ctx.lineTo(65,-123);ctx.stroke();ctx.restore();
  }
  mask(790,300,1.18);mask(242,278,.85);mask(1277,298,.82);
  const tex=new THREE.CanvasTexture(art);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;
  add(back,new THREE.PlaneGeometry(40.6,12.75),new THREE.MeshStandardMaterial({map:tex,side:THREE.DoubleSide,roughness:.9}),'CUSTOM_TROPICAL_TIKI_ART',[0,7.14,-12.18]);
  for(let x=-20;x<=20;x+=.55){
    const light=orb(back,.1,x,13.72,-12.03,x%2?'pink':'lemon','BACKDROP_MARQUEE_LIGHT',8);
  }
  // Foreground scenery: jungle altar and red / yellow lettering.
  cube(fixed,8.8,2.7,1.5,0,1.9,12.1,'goldDark','FRONT_CENTER_FASCIA');
  sign(fixed,'TIKI TAKI',8,2.1,0,2.1,12.92);
  for(const x of [-13,-10,10,13]){
    const palm=beam(fixed,[x,.5,11.2],[x,3.2,11.2],.19,'brown','SCENIC_PALM_TRUNK');
    for(let j=0;j<8;j++){
      const a=j*Math.PI/4;stripeTube(fixed,[[x,3.1,11.2],[x+Math.cos(a)*1.2,4.1,11.2+Math.sin(a)*1.2],[x+Math.cos(a)*2.9,2.9,11.2+Math.sin(a)*2.9]],.14,'green','PALM_FROND');
    }
  }
  const booth=new THREE.Group();booth.name='TICKET_BOOTH';booth.position.set(22,0,10);fixed.add(booth);
  cube(booth,11,6.5,5,0,3,0,'brown','TICKET_KIOSK_BASE');
  cube(booth,12,1,6.2,0,6.7,0,'goldDark','TICKET_ROOF');
  sign(booth,'TICKETS',9.3,2.2,0,7.1,3.14);
  for(const x of [-3,0,3])cube(booth,2.7,2.4,.07,x,3.5,2.54,'charcoal','TICKET_WINDOW');
  for(let i=0;i<7;i++)orb(booth,.48,(i-3)*1.5,7.7,2.9,i%2?'pink':'green','ROOF_FLOWER');
  // Stylized volcanic crown.
  const volcano=add(fixed,new THREE.ConeGeometry(2.7,4.3,8,1),'purple','SCENIC_VOLCANO',[21,9.3,7.3]);volcano.rotation.z=.12;
  orb(fixed,1,21,11.3,7.3,'pink','VOLCANO_CROWN');
  const axes=new THREE.AxesHelper(5);axes.name='TECHNICAL_AXIS_GUIDE';axes.position.set(0,34,0);axes.visible=false;scene.add(axes);
  return {root,pivot:pendulum,spinRig:wheel,rows,leds,restraintMeshes,seatPositions,axes};
}
