(()=>{
const sim=window.__nightfly,checks=[];
const key=k=>document.dispatchEvent(new KeyboardEvent('keydown',{key:k,bubbles:true,cancelable:true}));
const check=(name,pass)=>{checks.push({name,pass:!!pass});if(!pass)throw new Error(name);};
check('16 open hinges',sim.getStats().restraintAngles.length===16&&sim.getStats().restraintAngles.every(a=>Math.abs(a-1.15)<1e-8));
key('u');check('open restraints block lifting',sim.state.liftTarget===0);
key('r');check('open restraints block gondola release',sim.getStats().gondolas.every(g=>g.braked));
key('1');check('individual release also blocked',sim.getStats().gondolas[0].braked);
key('l');sim.advance(1);check('closing visibly interpolates',sim.state.restraints>0&&sim.state.restraints<1&&sim.getStats().restraintAngles.every(a=>a>0&&a<1.15));
key('u');check('closing is not locked',sim.state.liftTarget===0);
sim.advance(2);check('all 16 closed and locked',sim.state.restraintsLocked&&sim.getStats().restraintAngles.every(a=>a<1e-7));
key('u');key('o');check('open blocked as soon as lift requested',sim.state.restraintTarget===0);
sim.advance(10);check('closed restraints permit lift',sim.state.lift===1);
key('o');check('opening blocked in operating position',sim.state.restraintTarget===0);
key('j');sim.advance(60);check('return to station',sim.state.lift===0&&!sim.state.parking);
key('c');sim.advance(3);check('C opens',sim.state.restraints===1);
key('c');sim.advance(3);check('C closes',sim.state.restraintsLocked);
return checks;
})()