const THEMES = { chiapas: ['Chiapas · Expedition auf dem Wasser', '#39d5cc'], taron: ['Taron · Zwischen den Basaltfelsen', '#e8ae64'], 'black-mamba': ['Black Mamba · Über dem Dschungel', '#a6cd64'] };
export function buildDiorama(T, id) {
  const group = new T.Group();
  const material = color => new T.MeshStandardMaterial({ color, roughness: .65, metalness: .15 });
  const mats = new Map();
  const mesh = (geo, color, x=0, y=0, z=0) => { if (!mats.has(color)) mats.set(color, material(color)); const m = new T.Mesh(geo, mats.get(color)); m.position.set(x,y,z); group.add(m); return m; };
  const box = (w,h,d,c,x,y,z) => mesh(new T.BoxGeometry(w,h,d),c,x,y,z);
  const rod = (a,b,r,c) => { const start=new T.Vector3(...a), end=new T.Vector3(...b); const m=mesh(new T.CylinderGeometry(r,r,start.distanceTo(end),8),c); m.position.copy(start).add(end).multiplyScalar(.5); m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),end.sub(start).normalize()); return m; };
  const rail = (points,c,r=.045) => mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),48,r,6,false),c);
  const palm = (x,z,h) => { rod([x,.12,z],[x+.15,h,z],.09,0x725138); for(let i=0;i<6;i++){ const a=i*Math.PI/3; const leaf=mesh(new T.SphereGeometry(1,8,5),0x3d8051,x+.15+Math.cos(a)*.38,h,z+Math.sin(a)*.38); leaf.scale.set(.72,.055,.18); leaf.rotation.y=-a; leaf.rotation.z=.18; } };
  mesh(new T.CylinderGeometry(2.65,2.45,.28,64),id==='chiapas'?0x228e98:id==='taron'?0x343740:0x486443,0,-.16,0);
  if(id==='chiapas') {
    mesh(new T.CylinderGeometry(2.58,2.58,.035,64),0x49bcc4,0,.005,0);
    for(let i=0;i<5;i++) box(1.35-i*.2,.24,1.05-i*.14,0xc49560,-1.15,.13+i*.24,-.9);
    box(.32,.4,.35,0x775534,-1.15,1.38,-.9);
    box(1.08,.16,2.3,0xad6537,.55,.26,.25);
    box(.12,.44,2.4,0xd8a052,.02,.47,.25); box(.12,.44,2.4,0xd8a052,1.08,.47,.25);
    box(1.08,.42,.12,0xca8742,.55,.46,-.94); box(1.08,.42,.12,0xca8742,.55,.46,1.44);
    for(let i=0;i<3;i++){ box(.88,.13,.3,0x6d3e2b,.55,.42,-.5+i*.62); box(.88,.4,.1,0x753f29,.55,.59,-.65+i*.62); }
    for(let i=0;i<3;i++) rail([[-.12,.08,.8+i*.19],[-.35,.08,1+i*.19],[-.8,.08,1+i*.19]],0xb5eeee,.025);
    palm(1.55,-1.15,1.8);
  } else if(id==='taron') {
    for(let i=0;i<9;i++){ const a=i*.38; const h=.65+(i%3)*.5; mesh(new T.CylinderGeometry(.22,.3,h,6),i%2?0x4b4a49:0x62615a,-1.7+Math.sin(a)*.55,h/2,-1.7+i*.36); }
    for(const x of [-.43,.43]) rail([[x,.48,2.05],[x,.52,1],[x,.54,0],[x+.2,.8,-1],[x+.8,1.25,-1.9]],0x25282c,.065);
    for(let i=0;i<7;i++) rod([-.48,.46,1.8-i*.5],[.48,.46,1.8-i*.5],.035,0x9a8162);
    for(let car=0;car<2;car++){ const z=.7-car*1.05; box(1.04,.28,.9,0x76513b,0,.76,z); for(const x of [-.26,.26]){ box(.38,.12,.42,0x282a2c,x,.96,z); box(.38,.48,.12,0x282a2c,x,1.17,z-.22); rail([[x-.13,1.18,z+.08],[x,1.36,z+.13],[x+.13,1.18,z+.08]],0xc0a273); } }
    for(const x of [-.37,.37]) rail([[x,.9,1.1],[x*1.7,1.15,1.28],[x*1.5,1.45,1.25]],0xd5c098,.07);
  } else {
    for(const x of [-.18,.18]) rail([[-2,2.6,x-.6],[-1,2.85,x],[0,2.9,x+.25],[1,2.65,x],[2,2.3,x-.65]],0xb79b55,.055);
    rod([-1.85,0,-.7],[-1.85,2.65,-.7],.09,0x414b39); rod([1.85,0,-.7],[1.85,2.4,-.7],.09,0x414b39);
    rod([0,2.86,.2],[0,2.1,.2],.10,0x34393c); box(1.85,.15,.18,0x393f40,0,2.07,.2);
    for(let i=0;i<4;i++){ const x=-.69+i*.46; box(.39,.6,.18,0x242c2d,x,1.72,.2); box(.39,.13,.45,0x242c2d,x,1.4,.36); rail([[x-.13,1.48,.48],[x-.15,1.95,.43],[x+.15,1.95,.43],[x+.13,1.48,.48]],0xd2ae49,.04); }
    palm(-1.5,1,1.45); palm(1.5,-1.25,1.65);
    for(let i=0;i<5;i++){const m=mesh(new T.DodecahedronGeometry(.38),0x82816a,-.9+i*.45,.17,-1.3);m.scale.y=.7;}
  }
  return group;
}
if (typeof document !== 'undefined') {
  const sheet=document.getElementById('rideSheet');
  let current='', cleanup=()=>{}, ticket=0;
  async function sync(){
    const id=sheet?.dataset.world;
    const key=sheet?.classList.contains('show') && sheet.dataset.park==='phantasialand' && THEMES[id] ? id : '';
    if(key===current)return; current=key; const request=++ticket; cleanup(); cleanup=()=>{}; if(!key)return;
    const panel=document.createElement('section'); panel.className='ride3d'; panel.style.setProperty('--ride3d-accent',THEMES[key][1]);
    panel.innerHTML='<div class="ride3d-heading"><span>3D ENTDECKEN</span><span>STILISIERTES MODELL</span></div><div class="ride3d-stage" tabindex="0" role="img"></div><div class="ride3d-controls"><span>Ziehen oder Pfeiltasten zum Drehen</span><button type="button" aria-label="3D-Ansicht zurücksetzen">↺</button></div><div class="ride3d-status" role="status">3D-Szene wird geladen …</div>';
    document.getElementById('rideTitle').after(panel);
    const stage=panel.querySelector('.ride3d-stage'); stage.setAttribute('aria-label',THEMES[key][0]+'. Mit den Pfeiltasten drehen.');
    let renderer, model, resize; const dispose=()=>{resize?.disconnect(); if(model){const gs=new Set(),ms=new Set();model.traverse(o=>{if(o.geometry)gs.add(o.geometry);if(o.material)ms.add(o.material);});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());} renderer?.dispose(); renderer?.forceContextLoss(); panel.remove();}; cleanup=dispose;
    try {
      const T=await import('../nightfly/vendor/three.module.js'); if(request!==ticket)return;
      renderer=new T.WebGLRenderer({antialias:true,alpha:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,1.75)); stage.append(renderer.domElement);
      const scene=new T.Scene(); model=buildDiorama(T,key); scene.add(model); model.rotation.y=-.3;
      scene.add(new T.HemisphereLight(0xe7f6ff,0x433d36,2.4)); const light=new T.DirectionalLight(0xffe1b8,3); light.position.set(3,7,4); scene.add(light);
      const camera=new T.PerspectiveCamera(35,1,.1,40); camera.position.set(5,4.4,6.5); camera.lookAt(0,1.05,0);
      const draw=()=>renderer.render(scene,camera);
      resize=new ResizeObserver(()=>{const w=stage.clientWidth,h=stage.clientHeight;if(w&&h){renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();draw();}});resize.observe(stage);
      let last=null; stage.onpointerdown=e=>{last=e.clientX;stage.setPointerCapture(e.pointerId);}; stage.onpointermove=e=>{if(last===null)return; model.rotation.y+=(e.clientX-last)*.012;last=e.clientX;draw();}; stage.onpointerup=stage.onpointercancel=()=>{last=null;};
      stage.onkeydown=e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();model.rotation.y+=e.key==='ArrowLeft'?-.16:.16;draw();}};
      panel.querySelector('button').onclick=()=>{model.rotation.y=-.3;draw();};panel.querySelector('.ride3d-status').remove();
      renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();panel.querySelector('.ride3d-controls span').textContent='3D pausiert – Detailseite erneut öffnen.';});
    }catch(error){if(request===ticket){dispose();cleanup=()=>{};console.warn('3D-Ansicht nicht verfügbar',error);}}
  }
  if(sheet)new MutationObserver(sync).observe(sheet,{attributes:true,attributeFilter:['class','data-world','data-park']}); sync();
}
