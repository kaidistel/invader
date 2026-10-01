(()=>{
const sim=window.__nightfly,results=[];
const key=(key,type='keydown')=>document.dispatchEvent(new KeyboardEvent(type,{key,bubbles:true,cancelable:true}));
const check=(name,pass)=>{results.push({name,pass:!!pass});if(!pass)throw new Error(name)};
key('d');check('D rotor stop',sim.state.rpmTarget===0);key('q');check('Q trim',sim.state.rpmTarget===-.5);key('e');check('E trim',sim.state.rpmTarget===0);
key('w');check('W pendulum',sim.state.mode==='pendulum');
key('r');check('R release',sim.getStats().gondolas.every(g=>!g.braked));
sim.advance(12);key('b');const held=sim.getStats().gondolas.map(g=>g.angle);sim.advance(3);check('B hold angles',sim.getStats().gondolas.every((g,i)=>g.braked&&Math.abs(g.angle-held[i])<1e-9));
for(const [i,k] of ['1','2','3','4'].entries()){key(k);check('individual '+k,!sim.getStats().gondolas[i].braked);}
key('v');check('V all toggle',sim.getStats().gondolas.every(g=>g.braked));
key('+');check('power plus',Math.abs(sim.state.power-.70)<1e-9);key('-');check('power minus',Math.abs(sim.state.power-.65)<1e-9);
key('y');check('Y left loop',sim.state.mode==='left');sim.advance(25);const left=sim.state.arm;check('left completes rotation',left<-Math.PI*2);
key('x');sim.advance(40);check('X right rotation',sim.state.arm-left>Math.PI*2);
key('ArrowLeft');check('manual left',sim.state.manual===-1);key('ArrowLeft','keyup');check('manual released',sim.state.manual===0);
key('ArrowRight');check('manual right',sim.state.manual===1);key('ArrowRight','keyup');key('h');check('H hold',sim.state.mode==='hold');
for(const [k,c] of [['5','orbit'],['6','front'],['7','seat']]){key(k);check('camera '+k,sim.getStats().camera===c);}
key('n');check('night',sim.getStats().night);key('n');
key('p');const time=sim.state.time;sim.advance(1);check('pause',sim.state.time===time);key('p');
key('F1');check('help opens',document.getElementById('help-dialog').open);key('Escape');check('help closes',!document.getElementById('help-dialog').open);
key(' ');sim.advance(20);check('emergency stop',sim.state.estopped&&sim.state.rpm===0&&Math.abs(sim.state.armSpeed)<.002);
key('u');key('j');sim.advance(100);check('J loading',sim.state.lift===0&&!sim.state.parking);
key('0');check('reset',sim.state.arm===0&&sim.state.rpm===0&&sim.state.lift===0);
return results;
})()