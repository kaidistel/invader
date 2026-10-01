(()=>{
 const sim=window.__nightfly,results=[];
 const click=id=>document.getElementById(id).click();
 const check=(name,ok)=>{results.push({name,pass:!!ok});if(!ok)throw new Error(name);};
 sim.reset();click('raise');sim.advance(10);check('Fahrstellung erreicht',sim.state.ready&&sim.state.lift===1);
 click('pendulum');click('release');sim.advance(8);const angles=sim.getStats().gondolas.map(g=>g.angle);
 check('Pendelantrieb bewegt Arm',Math.abs(sim.state.arm)>.1);
 check('Freie Gondeln reagieren',angles.some(a=>Math.abs(a)>.05));
 click('brake');const held=sim.getStats().gondolas.map(g=>g.angle);sim.advance(3);
 check('Gondelbremsen halten exakt',sim.getStats().gondolas.every((g,i)=>Math.abs(g.angle-held[i])<1e-10&&g.speed===0));
 click('gondola-0');check('Einzelbremse unabhängig',!sim.getStats().gondolas[0].braked&&sim.getStats().gondolas.slice(1).every(g=>g.braked));
 click('right');click('loop-right');const start=sim.state.arm;sim.advance(16);
 check('Kreuz +12 U/min',sim.state.rpm===12);check('Arm voller Überschlag rechts',sim.state.arm-start>2*Math.PI);
 click('left');click('loop-left');const turn=sim.state.arm;sim.advance(22);
 check('Kreuz -12 U/min',sim.state.rpm===-12);check('Arm voller Überschlag links',sim.state.arm-turn<-2*Math.PI);
 click('pause');const frozen=JSON.stringify(sim.getStats());sim.advance(3);check('Pause hält Zustand',JSON.stringify(sim.getStats())===frozen);click('pause');
 click('estop');sim.advance(8);check('Not-Halt bremst',sim.state.rpm===0&&Math.abs(sim.state.armSpeed)<.02&&sim.getStats().gondolas.every(g=>g.braked));
 click('raise');click('lower');sim.advance(75);
 check('Rückkehr in Ladestellung',sim.state.lift===0&&!sim.state.parking&&Math.abs(sim.state.arm)<.001&&sim.state.rpm===0);
 check('Gelenke bleiben verbunden',sim.getStats().gondolas.every(g=>g.pivotError<1e-6));
 sim.reset();return results;
})()