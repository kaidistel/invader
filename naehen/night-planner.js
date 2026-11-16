(function nightPlannerUI(){
"use strict";
const C=window.NAEHEN_NIGHT_CORE;
if(!C)return;
const $=id=>document.getElementById(id);
const esc=x=>String(x??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const fmt=C.asTime, allShows=C.SHOWS;
const MAIN_RIDES=["taron","fly","black-mamba","colorado-adventure","winjas-fear","winjas-force","mystery-castle","chiapas","talocan","raik","crazy-bats","maus-au-chocolat"];
let api=null,context={},state=null,choiceSignature="",initialized=false;
const localDate=()=>{
 const p=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Berlin",day:"2-digit",month:"2-digit",year:"numeric"}).formatToParts(new Date());
 const g=t=>p.find(x=>x.type===t)?.value||"";
 return g("year")+"-"+g("month")+"-"+g("day");
};
const nowMinutes=()=>{
 const p=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Berlin",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date());
 const g=t=>Number(p.find(x=>x.type===t)?.value||0);
 return g("hour")*60+g("minute");
};
const defaultPlan=date=>({date,start:date==="2026-12-31"?"15:00":"17:00",end:date==="2026-12-31"?"18:00":"20:00",
 origin:"",walk:8,reserve:5,quickWait:15,
 chosen:["kaiserplatz-illumination","taron","tiempo-de-fuego","magic-symphony"],
 showTimes:{"magic-symphony":date==="2026-12-31"?"":"19:50"},
 queueEstimates:{},quick:{},done:{}});
function key(date){return "naehen:night-planner:phantasialand:"+date;}
function load(date){
 const fallback=defaultPlan(date);
 try{
  const row=JSON.parse(localStorage.getItem(key(date))||"null");
  if(!row||typeof row!=="object")return fallback;
  return {...fallback,...row,date,chosen:Array.isArray(row.chosen)?row.chosen:fallback.chosen,showTimes:{...fallback.showTimes,...row.showTimes},queueEstimates:{...row.queueEstimates},quick:{...row.quick},done:{...row.done}};
 }catch(_){return fallback;}
}
function save(){if(!state)return;try{localStorage.setItem(key(state.date),JSON.stringify(state));}catch(e){console.warn("Night-Plan konnte nicht lokal gespeichert werden",e);}}
function inWinter(){return context.parkSlug==="phantasialand"&&context.winter===true;}
function liveRide(id){return (context.rides||[]).find(r=>r.id===id)||null;}
function actualCompleted(id){
 const before=C.parseTime(state?.start),after=C.parseTime(state?.end);
 return (context.sessions||[]).some(s=>{
  if(s.status!=="ridden"||s.parkSlug&&s.parkSlug!=="phantasialand")return false;
  if(s.rideId!==(allShows.some(show=>show.id===id)?"wintershow-"+id:id))return false;
  const timestamp=Number(s.startedAt||0);
  if(!timestamp||!Number.isFinite(timestamp))return false;
  const dt=new Date(timestamp);
  const p=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Berlin",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(dt);
  const get=t=>p.find(x=>x.type===t)?.value||"";
  const d=get("year")+"-"+get("month")+"-"+get("day"),t=Number(get("hour"))*60+Number(get("minute"));
  return d===state.date&&t>=before&&t<=after;
 });
}
function getRides(){
 const all=(context.rides||[]).filter(r=>r&&r.id&&r.name&&!/ice.?skate.?hire|schlittschuhverleih/i.test(r.id+" "+r.name));
 const sorted=all.slice().sort((a,b)=>{
  const x=MAIN_RIDES.indexOf(a.id),y=MAIN_RIDES.indexOf(b.id);
  return (x<0?1000:x)-(y<0?1000:y)||a.name.localeCompare(b.name,"de");
 });
 return sorted;
}
function rideData(r){
 const today=state.date===localDate();
 const stamp=Date.parse(r.lastUpdated||"");
 const fresh=Number.isFinite(stamp)&&Math.abs(Date.now()-stamp)<12*60*1000;
 const hasLive=today&&r.source==="queue-times"&&r.isOpen!==null&&r.isOpen!==undefined&&fresh;
 const manual=state.queueEstimates[r.id];
 const wait=hasLive?Number(r.wait||0):Math.max(0,Math.min(240,Number.isFinite(Number(manual))&&manual!==undefined?Number(manual):30));
 return {wait,hasLive,isOpen:hasLive?r.isOpen:null};
}
function getEntries(){
 const rides=getRides().map((r,i)=>{
  const d=rideData(r);
  return {id:r.id,name:r.name,zone:r.zone||"Park",kind:"ride",selected:state.chosen.includes(r.id),
   done:!!state.done[r.id]||actualCompleted(r.id),wait:d.wait,hasLive:d.hasLive,isOpen:d.isOpen,
   useQuickPass:!!state.quick[r.id]&&!!C.QUICK_PASS[r.id],quickWait:Math.max(0,Math.min(60,Number(state.quickWait)||0)),
   minutes:5,order:i,priority:state.chosen.indexOf(r.id)<0?false:state.chosen.indexOf(r.id)<4};
 });
 return allShows.map(s=>({...s,kind:"show",selected:state.chosen.includes(s.id),done:!!state.done[s.id]||actualCompleted(s.id),time:state.showTimes[s.id]||""})).concat(rides);
}
function compute(){
 if(!state)return null;
 return C.buildSchedule({date:state.date,start:state.start,end:state.end,walkMinutes:state.walk,
  reserveMinutes:state.reserve,origin:state.origin,isToday:state.date===localDate(),
  nowMinutes:nowMinutes(),entries:getEntries()});
}
function renderQuickPass(rideId){
 const target=$("rideQuickPass");
 if(!target)return;
 const available=inWinter()&&C.QUICK_PASS[rideId];
 target.hidden=!available;
 if(!available){target.innerHTML="";return;}
 const note=rideId==="fly"?"F.L.Y. laut Shop-Angebot nur im Ultimate-Paket; Verfügbarkeit im Shop prüfen.":
 "Die Verfügbarkeit und der tatsächliche Preis gelten nur nach Bestätigung im offiziellen Shop.";
 target.innerHTML='<span class="npr-detail-label">QUICK PASS</span><p>'+esc(C.QUICK_PASS[rideId])+'</p><a class="npr-detail-link" href="'+C.SHOP_URL+'" target="_blank" rel="noopener noreferrer">Im offiziellen Shop prüfen ↗</a><small>'+esc(note)+'</small>';
}
function renderChoices(force){
 const root=$("nightPlannerChoices");
 if(!root||!state)return;
 const rides=getRides(),signature=rides.map(r=>{const d=rideData(r);return [r.id,d.hasLive,d.wait,d.isOpen].join(":");}).join("|");
 if(!force&&signature===choiceSignature)return;
 if(!force&&root.contains(document.activeElement))return;
 choiceSignature=signature;
 const showsMarkup=allShows.map(s=>{
  const chosen=state.chosen.includes(s.id),t=state.showTimes[s.id]||"";
  return '<article class="npr-option '+(chosen?"is-picked":"")+'"><div class="npr-option-row"><label class="npr-option-title"><input data-npr-pick="'+esc(s.id)+'" type="checkbox" '+(chosen?"checked":"")+'><span><strong>'+esc(s.name)+'</strong><small>'+esc(s.location)+' · '+(s.estimatedDuration?"ca. 10 Min. Planwert":s.minutes+" Min.")+'</small></span></label></div>'+
   '<label class="npr-option-input">Beginn laut Park-Monitor<input type="time" data-npr-showtime="'+esc(s.id)+'" value="'+esc(t)+'" aria-label="'+esc(s.name)+' Beginn"></label>'+
   (s.id==="magic-symphony"?'<small class="npr-clarify">Regulär ca. 19:50 Uhr, am Besuchstag prüfen.</small>':'<small class="npr-clarify">Keine bestätigte feste Uhrzeit – bitte vor Ort eintragen.</small>')+'</article>';
 }).join("");
 const ridesMarkup=rides.map(r=>{
  const d=rideData(r),chosen=state.chosen.includes(r.id),qp=C.QUICK_PASS[r.id],qpOn=!!state.quick[r.id];
  const label=d.hasLive?(d.isOpen===false?"Aktuell geschlossen":d.wait+" Min. · Live"):"Wartezeit: Planwert";
  const estimate=state.queueEstimates[r.id]!==undefined?state.queueEstimates[r.id]:30;
  return '<article class="npr-option '+(chosen?"is-picked":"")+'"><div class="npr-option-row"><label class="npr-option-title"><input type="checkbox" data-npr-pick="'+esc(r.id)+'" '+(chosen?"checked":"")+'><span><strong>'+esc(r.name)+'</strong><small>'+esc(r.zone||"Phantasialand")+' · '+esc(label)+'</small></span></label></div>'+
   (!d.hasLive?'<label class="npr-option-input">Queue-Schätzung (Min.)<input type="number" min="0" max="240" step="5" data-npr-wait="'+esc(r.id)+'" value="'+esc(estimate)+'"></label>':'')+
   (qp?'<div class="npr-quick-row"><label><input type="checkbox" data-npr-quick="'+esc(r.id)+'" '+(qpOn?"checked":"")+'><span>Quick Pass vorhanden</span></label><a href="'+C.SHOP_URL+'" target="_blank" rel="noopener noreferrer">Shop ↗</a></div>'+
   (r.id==="fly"?'<small class="npr-clarify">F.L.Y. nur mit Ultimate-Pass einplanen.</small>':''):'')+
   '</article>';
 }).join("");
 root.innerHTML='<div class="npr-group-title"><h3>Abendshows</h3><span>Feste Zeiten haben Vorrang</span></div><div class="npr-option-grid">'+showsMarkup+'</div>'+
 '<div class="npr-group-title"><h3>Attraktionen</h3><span>Queue + 5 Min. Fahrt</span></div><div class="npr-option-grid">'+ridesMarkup+'</div>';
}
function renderPlan(){
 if(!state)return;const plan=compute(),result=$("nightPlannerResult"),preview=$("nightPlannerPreview");
 if(!result||!preview)return;
 const selected=state.chosen.length;
 const inPlan=plan?.steps?.length||0,done=plan?.done?.length||0;
 const notPlanned=plan?.unplanned?.length||0;
 if(plan&&!plan.valid){
  result.innerHTML='<p class="npr-error" role="alert">'+esc(plan.warnings.join(" "))+'</p>';
  preview.innerHTML='<span class="npr-preview-alert">'+esc(plan.warnings.join(" "))+'</span>';return;
 }
 if(plan?.valid){
  const timeline=plan.steps.map((s,i)=>{
   const time=s.kind==="show"?fmt(s.arrival)+" ankommen · "+fmt(s.start)+" Beginn":fmt(s.start)+" – "+fmt(s.end);
   const description=s.kind==="show"?s.buffer+" Min. Vorlauf · "+s.minutes+" Min. Show"+(s.walk?" · "+s.walk+" Min. Weg":""):
    (s.walk?s.walk+" Min. Weg · ":"")+(s.useQuickPass?"Quick Pass · ":"")+(s.hasLive&&!s.useQuickPass?"Live-Queue ":"geschätzte Queue ")+s.queue+" Min. + 5 Min. Fahrt";
   const button=s.kind==="ride"?'<button class="npr-inline-button" data-npr-queue="'+esc(s.id)+'" type="button">Anstellen</button>':
    '<button class="npr-inline-button" data-npr-record="'+esc(s.id)+'" type="button">Show eintragen</button>';
   const controls='<div class="npr-timeline-actions">'+button+'<button class="npr-inline-button npr-done-button" type="button" data-npr-done="'+esc(s.id)+'" title="Nur im Nachtplan abhaken, kein Ride-Log">Abhaken</button></div>';
   return '<li class="npr-timeline-item"><div class="npr-timeline-clock">'+esc(time)+'</div><div class="npr-timeline-info"><strong>'+esc(s.name)+'</strong><small>'+esc(description)+'</small></div>'+controls+'</li>';
  }).join("");
  const missed=plan.unplanned.map(x=>'<li><strong>'+esc(x.name)+'</strong><small>'+esc(x.reason)+'</small></li>').join("");
  const doneHtml=plan.done.length?'<p class="npr-done"><span aria-hidden="true">✓</span> '+plan.done.length+' bereits gefahren / gesehen oder im Plan abgehakt</p>':"";
  const warnings=plan.warnings.map(x=>'<p>'+esc(x)+'</p>').join("");
  result.innerHTML='<div class="npr-plan-summary"><span>'+inPlan+' geplant · '+done+' erledigt</span><strong>'+fmt(C.parseTime(state.start))+' – '+fmt(C.parseTime(state.end))+'</strong></div>'+
   (timeline?'<ol class="npr-timeline">'+timeline+'</ol>':'<p class="npr-empty">Noch kein Erlebnis im Zeitfenster eingeplant.</p>')+
   doneHtml+(notPlanned?'<div class="npr-unplanned"><h3>Noch nicht eingeplant ('+notPlanned+')</h3><ul>'+missed+'</ul></div>':'')+
   (warnings?'<div class="npr-warnings">'+warnings+'</div>':'');
  const next=plan.steps[0],missing=plan.unplanned.filter(x=>x.reason.includes("Showzeit")).length;
  preview.innerHTML='<span class="npr-preview-count">'+(inPlan+done)+' / '+selected+' Erlebnisse im Plan</span>'+
    (missing?'<span class="npr-preview-alert">'+missing+' Showzeit(en) noch offen</span>':
    next?'<span class="npr-preview-next">'+fmt(next.start)+' · '+esc(next.name)+'</span>':'<span class="npr-preview-next">Zeitfenster prüfen</span>');
 }
 const startEl=$("nightPlannerStart"),endEl=$("nightPlannerEnd"),dateEl=$("nightPlannerDate");
 if(startEl&&startEl!==document.activeElement)startEl.value=state.start;
 if(endEl&&endEl!==document.activeElement)endEl.value=state.end;
 if(dateEl&&dateEl!==document.activeElement)dateEl.value=state.date;
 const originEl=$("nightPlannerOrigin"),walkEl=$("nightPlannerWalk"),qpEl=$("nightPlannerQuickWait"),reserveEl=$("nightPlannerReserve");
 if(originEl&&originEl!==document.activeElement)originEl.value=state.origin;
 if(walkEl&&walkEl!==document.activeElement)walkEl.value=String(state.walk);
 if(qpEl&&qpEl!==document.activeElement)qpEl.value=String(state.quickWait);
 if(reserveEl&&reserveEl!==document.activeElement)reserveEl.value=String(state.reserve);
}
function updateStateField(field,value){
 if(!state)return;state[field]=value;save();renderPlan();
}
function onFormChange(e){
 const target=e.target,ds=target.dataset;
 if(ds.nprPick){
  const id=ds.nprPick;if(target.checked&&!state.chosen.includes(id))state.chosen.push(id);
  if(!target.checked)state.chosen=state.chosen.filter(x=>x!==id);
  target.closest(".npr-option")?.classList.toggle("is-picked",target.checked);
 }else if(ds.nprShowtime){state.showTimes[ds.nprShowtime]=target.value;}
 else if(ds.nprQuick){state.quick[ds.nprQuick]=target.checked;}
 else if(ds.nprWait){state.queueEstimates[ds.nprWait]=Math.max(0,Math.min(240,Number(target.value)||0));}
 else return;
 save();renderPlan();
}
function onActionClick(e){
 const queue=e.target.closest("[data-npr-queue]");
 if(queue){api?.onQueue?.(queue.dataset.nprQueue);return;}
 const record=e.target.closest("[data-npr-record]");
 if(record){api?.onShow?.(record.dataset.nprRecord);return;}
 const done=e.target.closest("[data-npr-done]");
 if(done){state.done[done.dataset.nprDone]=true;save();renderPlan();return;}
}
function init(callbacks){
 if(initialized)return;
 const root=$("nightPlanner");if(!root)return;
 initialized=true;api=callbacks||{};
 state=load(localDate());
 $("nightPlannerOpen")?.addEventListener("click",()=>{renderChoices(true);renderPlan();api.onOpen?.();});
 $("nightPlannerChoices")?.addEventListener("change",onFormChange);
 $("nightPlannerResult")?.addEventListener("click",onActionClick);
 $("nightPlannerDate")?.addEventListener("change",e=>{
  if(!e.target.value)return;save();state=load(e.target.value);choiceSignature="";renderChoices(true);renderPlan();
 });
 for(const [id,field,transform] of [
  ["nightPlannerStart","start",x=>x],["nightPlannerEnd","end",x=>x],["nightPlannerOrigin","origin",x=>x],
  ["nightPlannerWalk","walk",x=>Number(x)],["nightPlannerQuickWait","quickWait",x=>Number(x)],["nightPlannerReserve","reserve",x=>Number(x)]
 ])$(id)?.addEventListener("change",e=>updateStateField(field,transform(e.target.value)));
 $("nightPlannerReset")?.addEventListener("click",()=>{
  state=defaultPlan(state.date);save();choiceSignature="";renderChoices(true);renderPlan();
 });
 $("nightPlannerUseNow")?.addEventListener("click",()=>{
  const local=localDate();if(state.date!==local){state=load(local);choiceSignature="";}
  state.start=fmt(nowMinutes());state.end=local==="2026-12-31"?"18:00":"20:00";
  save();renderChoices(true);renderPlan();
 });
 refresh(context);
}
function refresh(next){
 context=next||context;
 const visible=inWinter();
 const root=$("nightPlanner");
 if(root)root.hidden=!visible;
 if(!visible||!initialized)return;
 renderChoices(false);renderPlan();
}
window.NAEHEN_NIGHT_PLANNER={init,refresh,renderQuickPass,open:()=>{renderChoices(true);renderPlan();api?.onOpen?.();},core:C};
})();
