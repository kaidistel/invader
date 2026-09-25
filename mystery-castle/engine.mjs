/** Pure simulation core. All durations, setpoints and safety logic are game models. */
export const TRAVEL = 48.6;
export const PROGRAMS = {
  1: {name:'Kurzprogramm', subtitle:'Direkter Abschuss · ein Bungee', stages:[
    ['Verdunklung',0,5],['Abschuss',48.6,4.6],['Scheitelpunkt',48.6,1.4],
    ['Abwärtsabschuss',7,3.9],['Bungee',29,3.3],['Abbremsen',0,6],['Station anfahren',0,2]]},
  2: {name:'Intensivprogramm', subtitle:'Direkter Abschuss · zwei Bungees', stages:[
    ['Verdunklung',0,5],['Abschuss',48.6,4.6],['Scheitelpunkt',48.6,1.4],
    ['Abwärtsabschuss',7,3.9],['Erster Bungee',29,3.3],['Zwischenfall',10,3],
    ['Zweiter Bungee',35,3.7],['Abbremsen',0,6],['Station anfahren',0,2]]},
  3: {name:'Langprogramm', subtitle:'Vorfahrt · Täuschung · Hauptabschuss', stages:[
    ['Verdunklung',0,5],['Vorfahrt',24,6],['Langsames Ablassen',0,10],
    ['Showpause',0,20],['Abschuss',48.6,4.6],['Scheitelpunkt',48.6,1.4],
    ['Abwärtsabschuss',7,3.9],['Bungee',29,3.3],['Abbremsen',0,6],['Station anfahren',0,2]]}
};
export const duration = p => PROGRAMS[p].stages.reduce((sum,s)=>sum+s[2],0);
export class Ride {
  constructor(){
    this.power=false;this.phase='off';this.program=3;this.active=6;this.gates=true;
    this.restraints=false;this.clear=false;this.pressure=0;this.emergency=false;
    this.cars=Array.from({length:6},()=>({height:0,velocity:0,guests:0,checked:false}));
    this.time=0;this.rideTime=0;this.stageTime=0;this.stageIndex=0;this.from=0;
    this.timer=0;this.queue=96;this.arrival=0;this.rides=0;this.served=0;this.aborted=0;
    this.events=[];this.report('Schichtbeginn. Hauptschalter einschalten.');
  }
  get occupied(){return this.cars.reduce((n,c)=>n+c.guests,0)}
  get atStation(){return this.cars.every(c=>c.height<.015&&Math.abs(c.velocity)<.01)}
  get moving(){return ['running','braking','recovery'].includes(this.phase)}
  get stage(){return this.phase==='running'?PROGRAMS[this.program].stages[this.stageIndex]?.[0]||'Station':'Station'}
  get checked(){return this.cars.slice(0,this.active).every(c=>c.checked)}
  get blockers(){return [!this.power&&'Anlage aus',this.emergency&&'Not-Halt aktiv',this.phase!=='station'&&'Station nicht verfügbar',!this.occupied&&'Keine Gäste',this.gates&&'Tore offen',!this.restraints&&'Bügel offen',!this.checked&&'Bügelprüfung fehlt',!this.clear&&'Fahrbereich nicht freigegeben',this.pressure<.98&&'Druckaufbau läuft',!this.atStation&&'Gondeln nicht in Station'].filter(Boolean)}
  report(text){this.events.unshift({time:this.time,text});this.events.length=Math.min(30,this.events.length)}
  allowed(action){switch(action){
    case 'power':return !this.occupied&&this.atStation&&['off','station'].includes(this.phase)&&!this.emergency;
    case 'board':return this.power&&this.phase==='station'&&this.gates&&!this.restraints&&!this.occupied&&!this.emergency&&this.queue>0;
    case 'gates':return this.power&&this.phase==='station'&&!this.emergency&&this.atStation;
    case 'restraints':return this.power&&this.phase==='station'&&!this.emergency&&this.atStation&&!this.gates&&this.occupied>0;
    case 'clear':return this.phase==='station'&&!this.emergency&&!this.gates&&this.restraints&&this.checked;
    case 'dispatch':return this.blockers.length===0;
    case 'unload':return this.power&&this.phase==='station'&&this.gates&&!this.restraints&&this.occupied>0&&!this.emergency;
    case 'stop':return this.power&&!this.emergency;
    case 'release':return this.emergency&&this.phase==='halted';
    case 'recover':return !this.emergency&&this.phase==='halted'&&!this.atStation;
    case 'reset':return !this.emergency&&this.phase==='halted'&&this.atStation;
    default:return false;
  }}
  command(action){
    if(!this.allowed(action))return false;
    switch(action){
      case 'power':this.power=!this.power;this.phase=this.power?'boot':'off';this.timer=4;this.pressure=0;this.report(this.power?'Selbsttest läuft. Kompressoren starten.':'Anlage abgeschaltet.');break;
      case 'board':this.phase='boarding';this.timer=10;this.report('Einlass läuft. Gäste nehmen Platz.');break;
      case 'gates':this.gates=!this.gates;this.clear=false;this.report(this.gates?'Stationstore geöffnet.':'Stationstore geschlossen.');break;
      case 'restraints':this.clear=false;this.cars.forEach(c=>c.checked=false);if(this.restraints){this.restraints=false;this.report('Bügel entriegelt. Tore zum Ausstieg öffnen.')}else{this.phase='locking';this.timer=3;this.report('Bügel schließen. Danach jede aktive Gondel prüfen.')}break;
      case 'clear':this.clear=!this.clear;this.report(this.clear?'Fahrbereich kontrolliert und freigegeben.':'Freigabe zurückgenommen.');break;
      case 'dispatch':this.phase='running';this.stageTime=0;this.stageIndex=0;this.rideTime=0;this.from=0;this.clear=false;this.report(`Programm ${this.program} gestartet · ${this.occupied} Gäste.`);break;
      case 'unload':this.phase='unloading';this.timer=8;this.report('Ausstieg läuft.');break;
      case 'stop':if(this.phase==='running')this.aborted++;this.phase=this.moving?'braking':'halted';this.emergency=true;this.clear=false;this.cars.forEach(c=>c.checked=false);this.report('NOT-HALT. Fahrbefehl verworfen. Bremsung eingeleitet.');break;
      case 'release':this.emergency=false;this.report(this.atStation?'Not-Halt entriegelt. Störung quittieren.':'Not-Halt entriegelt. Rückholung zur Station erforderlich.');break;
      case 'recover':this.phase='recovery';this.report('Kontrollierte Rückholung. Bügel bleiben verriegelt.');break;
      case 'reset':this.phase='station';this.clear=false;this.report('Störung quittiert. Bügel erneut prüfen oder Gäste aussteigen lassen.');break;
    }
    return true;
  }
  setProgram(p){if(!PROGRAMS[p]||this.phase==='running'||this.phase==='braking'||this.phase==='recovery')return false;this.program=p;return true}
  setActive(n){if(![2,4,6].includes(n)||this.occupied||!['off','station'].includes(this.phase)||this.emergency)return false;this.active=n;this.cars.forEach(c=>c.checked=false);this.clear=false;return true}
  check(i){if(this.phase!=='station'||this.emergency||!this.restraints||this.gates||i<0||i>=this.active)return false;this.cars[i].checked=true;this.report(`Gondel ${i+1}: ${this.cars[i].guests} Plätze geprüft.`);return true}
  update(dt){
    // Bound integration steps; no catch-up jump after a hidden tab.
    dt=Math.min(Math.max(dt,0),.05);this.time+=dt;
    this.arrival+=dt;while(this.arrival>=3){this.arrival-=3;this.queue=Math.min(240,this.queue+1)}
    if(this.power)this.pressure=Math.min(1,this.pressure+dt*(this.phase==='running'?.007:.035));else this.pressure=0;
    if(['boot','boarding','locking','unloading'].includes(this.phase)){
      this.timer-=dt;if(this.timer<=0){
        if(this.phase==='boarding'){let count=Math.min(this.active*8,this.queue);this.queue-=count;this.cars.forEach((c,i)=>{c.guests=i<this.active?Math.min(8,count):0;count-=c.guests;c.checked=false});this.report('Einlass beendet. Tore schließen und Bügel verriegeln.');}
        if(this.phase==='locking'){this.restraints=true;this.report('Bügel geschlossen. Gondeln einzeln prüfen.');}
        if(this.phase==='unloading'){this.cars.forEach(c=>{c.guests=0;c.checked=false});this.report('Station leer. Bereit für neue Gäste.');}
        if(this.phase==='boot')this.report('Selbsttest abgeschlossen. Station bereit.');
        this.phase='station';
      }
    }
    if(this.phase==='running'){
      const stages=PROGRAMS[this.program].stages;const [label,target,seconds]=stages[this.stageIndex];
      this.stageTime=Math.min(seconds,this.stageTime+dt);this.rideTime+=dt;
      const t=this.stageTime/seconds;
      // Quintic profile: continuous zero velocity/acceleration at endpoints, no teleports.
      const f=t*t*t*(10+t*(-15+6*t));const derivative=30*t*t*(1-t)*(1-t)/seconds;
      this.cars.forEach((c,i)=>{if(i<this.active){c.height=Math.max(0,Math.min(TRAVEL,this.from+(target-this.from)*f));c.velocity=(target-this.from)*derivative}});
      if(this.stageTime>=seconds){this.from=target;this.stageTime=0;this.stageIndex++;
        if(this.stageIndex===stages.length){this.phase='station';this.cars.forEach(c=>{c.height=0;c.velocity=0;c.checked=false});this.rides++;this.served+=this.occupied;this.report('Fahrt beendet. Bügel entriegeln, Tore öffnen und Ausstieg starten.');}
        else{const next=stages[this.stageIndex][0];if(next.includes('Abschuss')||next==='Abwärtsabschuss')this.pressure=Math.max(0,this.pressure-.18);this.report(next+'.');}
      }
    }
    if(this.phase==='braking'){
      this.cars.forEach(c=>{const v=c.velocity;c.velocity=Math.sign(v)*Math.max(0,Math.abs(v)-dt*12);c.height=Math.max(0,Math.min(TRAVEL,c.height+(v+c.velocity)*.5*dt));if(c.height===0||c.height===TRAVEL)c.velocity=0});
      if(this.cars.every(c=>Math.abs(c.velocity)<.01)){this.phase='halted';this.report('Gondeln angehalten. Not-Halt entriegeln; gegebenenfalls Rückholung starten.');}
    }
    if(this.phase==='recovery'){
      this.cars.forEach(c=>{const desired=-Math.min(1.5,Math.sqrt(2*c.height));c.velocity=Math.max(desired,c.velocity-dt);c.height=Math.max(0,c.height+c.velocity*dt);if(c.height<.005){c.height=0;c.velocity=0}});
      if(this.atStation){this.phase='halted';this.report('Alle Gondeln in Station. Störung quittieren.');}
    }
  }
}
