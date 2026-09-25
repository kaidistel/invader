const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const fmt=s=>Math.floor(s/60).toString().padStart(2,'0')+':'+Math.floor(s%60).toString().padStart(2,'0');
const smooth=t=>t*t*t*(10+t*(-15+6*t));

const TOWER_HEIGHT=85;
const TOP_POS=72;
const HALF_POS=40;
const BRAKE_TOP=19;
const LOAD_POS=0;

const state={
  power:false,phase:'off',mode:'auto',loaded:0,gatesOpen:true,restraints:false,clear:false,brakeReady:true,
  estop:false,height:0,velocity:0,rotation:0,rotationDir:0,rotationRpm:0.9,rideTime:0,time:0,queue:120,
  rides:0,served:0,stage:'ANLAGE AUS',target:null,segment:null,hold:0,magic:false,manualHold:0,
  events:[],sound:false,fx:null,lastHeight:0
};

const labels={off:'ANLAGE AUS',boot:'SELBSTTEST',station:'STATION BEREIT',boarding:'EINLASS',locking:'BÜGEL VERRIEGELN',running:'FAHRT AKTIV',manual:'MANUELL',dropping:'FREIER FALL',braking:'MAGNETBREMSE',returning:'RÜCKHOLUNG',unloading:'AUSLASS',halted:'STÖRUNG'};

function log(text){state.events.unshift({t:state.time,text});state.events.length=24;renderLog();}
function interlocksOK(){return state.power&&state.loaded>0&&!state.gatesOpen&&state.restraints&&state.clear&&state.brakeReady&&!state.estop&&state.phase==='station';}
function moving(){return ['running','dropping','braking','returning'].includes(state.phase)||(state.phase==='manual'&&(Math.abs(state.velocity)>.08||state.segment||state.manualHold!==0));}
function atStation(){return state.height<.08&&Math.abs(state.velocity)<.08;}
function atRest(){return Math.abs(state.velocity)<.08;}

function setPhase(p,stage){state.phase=p;state.stage=stage||labels[p]||p;render();}

function can(action){
  switch(action){
    case 'power':return !moving()&&atStation()&&state.loaded===0&&!state.estop;
    case 'board':return state.power&&state.phase==='station'&&state.gatesOpen&&!state.restraints&&state.loaded===0&&!state.estop;
    case 'unload':return state.power&&state.phase==='station'&&state.gatesOpen&&!state.restraints&&state.loaded>0&&!state.estop;
    case 'gates':return state.power&&state.phase==='station'&&atStation()&&!state.estop;
    case 'restraints':return state.power&&state.phase==='station'&&!state.gatesOpen&&state.loaded>0&&!state.estop;
    case 'clear':return state.power&&state.phase==='station'&&!state.gatesOpen&&state.restraints&&!state.estop;
    case 'dispatch':return state.mode==='auto'&&interlocksOK();
    case 'manualDrop':return state.mode==='manual'&&state.power&&!state.estop&&state.loaded>0&&!state.gatesOpen&&state.restraints&&state.clear&&state.brakeReady&&atRest()&&state.height>=25;
    case 'magic':return state.power&&state.loaded>0&&!state.estop&&state.height>3;
    case 'rotLeft':case 'rotRight':case 'rotStop':return state.power&&!state.estop&&state.loaded>0&&!state.gatesOpen&&state.restraints;
    case 'estop':return state.power&&!state.estop;
    case 'releaseEstop':return state.estop&&['halted','station'].includes(state.phase);
    case 'recover':return !state.estop&&state.power&&state.phase==='halted'&&!atStation();
    case 'reset':return !state.estop&&state.power&&state.phase==='halted'&&atStation();
    default:return false;
  }
}

function command(action){
  if(!can(action))return false;
  if(action==='power'){
    state.power=!state.power;
    if(state.power){setPhase('boot','SELBSTTEST');state.hold=3;log('Hauptschalter EIN · Selbsttest läuft.');}
    else{setPhase('off','ANLAGE AUS');state.rotationDir=0;log('Anlage abgeschaltet.');}
  }
  if(action==='board'){setPhase('boarding','EINLASS');state.hold=5;log('Einlass geöffnet. 24 Fahrgäste steigen ein.');}
  if(action==='unload'){setPhase('unloading','AUSLASS');state.hold=4;log('Auslass läuft.');}
  if(action==='gates'){state.gatesOpen=!state.gatesOpen;state.clear=false;log(state.gatesOpen?'Stationstore geöffnet.':'Stationstore geschlossen.');}
  if(action==='restraints'){
    state.clear=false;
    if(state.restraints){state.restraints=false;log('Schoßbügel entriegelt.');}
    else{setPhase('locking','BÜGEL VERRIEGELN');state.hold=2.4;log('Bügel schließen · Verriegelung wird geprüft.');}
  }
  if(action==='clear'){state.clear=!state.clear;log(state.clear?'Fahrbereich freigegeben.':'Fahrbereich-Freigabe zurückgenommen.');}
  if(action==='dispatch')startAuto();
  if(action==='manualDrop')startDrop('MANUELLER DROP');
  if(action==='rotLeft'){state.rotationDir=-1;log('Gondelrotation gegen Uhrzeigersinn.');}
  if(action==='rotRight'){state.rotationDir=1;log('Gondelrotation im Uhrzeigersinn.');}
  if(action==='rotStop'){state.rotationDir=0;log('Gondelrotation gestoppt.');}
  if(action==='magic')triggerMagic();
  if(action==='estop')emergencyStop();
  if(action==='releaseEstop'){state.estop=false;setPhase('halted','STÖRUNG · NOT-HALT ENTRIEGELT');log('Not-Halt entriegelt. Rückholung oder Quittierung erforderlich.');}
  if(action==='recover'){startMove(0,8,'returning','RÜCKHOLUNG');log('Kontrollierte Rückholung zur Station.');}
  if(action==='reset'){setPhase('station','STATION BEREIT');state.clear=false;log('Störung quittiert.');}
  render();return true;
}

function startAuto(){
  state.rideTime=0;state.clear=false;state.rotationDir=1;
  setPhase('running','AUFFAHRT ZU 40 m');
  startMove(HALF_POS,10,'running','AUFFAHRT ZU 40 m',()=>{
    state.hold=2.3;state.segment={type:'hold40'};state.stage='HALT · 40 m';log('40-m-Position erreicht. Erster Fall wird vorbereitet.');
  });
  log('Signaturprogramm gestartet · Doppelfall 40 m + Top.');
}
