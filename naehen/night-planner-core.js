(function core(root) {
"use strict";
const SHOWS=Object.freeze([
{id:"kaiserplatz-illumination",name:"Kaiserplatz Illumination",zone:"Berlin",location:"Kaiserplatz",minutes:10,buffer:10,estimatedDuration:true},
{id:"tiempo-de-fuego",name:"Tiempo de Fuego",zone:"Mexico",location:"Plaza Mariachi",minutes:25,buffer:15},
{id:"pulse-of-rookburgh",name:"Pulse of Rookburgh",zone:"Rookburgh",location:"Rookburgh",minutes:10,buffer:5},
{id:"magic-symphony",name:"Magic Symphony",zone:"Berlin",location:"Kaiserplatz",minutes:10,buffer:15}]);
const QUICK_PASS=Object.freeze({"taron":"Taron After Dark / Quick Pass","black-mamba":"Quick Pass","colorado-adventure":"Quick Pass","winjas-fear":"Quick Pass","winjas-force":"Quick Pass","maus-au-chocolat":"Quick Pass","mystery-castle":"Quick Pass","talocan":"Quick Pass","chiapas":"Quick Pass (vor Ort prüfen)","fly":"Nur Quick Pass Ultimate"});
const SHOP_URL="https://shop.phantasialand.de/de/quick-pass";
const CLOSED_DATES=new Set(["2026-12-24","2026-12-25","2027-01-01","2027-01-12","2027-01-13"]);
function parseTime(t){if(typeof t!=="string"||!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(t))return null;const [h,m]=t.split(":").map(Number);return h*60+m;}
function asTime(t){t=Math.max(0,Math.round(t));return String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0");}
function walking(from,to,walk){if(!from)return 0;return from===to?5:Math.max(5,Math.min(10,Math.round(Number(walk)||8)));}
function dateInSeason(d){return /^\d{4}-\d\d-\d\d$/.test(d||"")&&d>="2026-11-14"&&d<="2027-01-24";}
function buildSchedule(o){
o=o||{};const selected=(Array.isArray(o.entries)?o.entries:[]).filter(e=>e&&e.id&&e.selected);
const start=parseTime(o.start),end=parseTime(o.end),unplanned=[],steps=[],done=[],warnings=[];
const invalid=m=>({valid:false,steps,done,unplanned,warnings:[m]});
if(start===null||end===null||end<=start)return invalid("Das Zeitfenster ist ungültig.");
if(!dateInSeason(o.date)||CLOSED_DATES.has(o.date))return invalid("An diesem Tag findet kein regulärer Wintertraum statt.");
if(end>(o.date==="2026-12-31"?1080:1200))return invalid(o.date==="2026-12-31"?"Silvester schließt der Park um 18 Uhr.":"Der Wintertraum schließt regulär um 20 Uhr.");
const effectiveStart=Math.max(start,o.isToday&&Number.isFinite(o.nowMinutes)?o.nowMinutes:start);
let cursor=effectiveStart,zone=o.origin||"";const walk=Math.max(5,Math.min(10,Number(o.walkMinutes)||8));
const reserve=Math.max(0,Math.min(15,Number(o.reserveMinutes)||0)),rides=[],shows=[];
for(const entry of selected){
if(entry.done){done.push({id:entry.id,name:entry.name,kind:entry.kind});continue;}
if(entry.kind==="show"){const at=parseTime(entry.time);if(at===null)unplanned.push({id:entry.id,name:entry.name,reason:"Tagesaktuelle Showzeit bitte eintragen"});else shows.push({...entry,at,minutes:Math.max(1,Number(entry.minutes)||10),buffer:Math.max(0,Number(entry.buffer)||0)});}
else{if(o.isToday&&entry.isOpen===false&&entry.hasLive){unplanned.push({id:entry.id,name:entry.name,reason:"Attraktion momentan geschlossen"});continue;}rides.push({...entry,queue:Math.max(0,Math.round(entry.useQuickPass?Number(entry.quickWait)||0:Number(entry.wait)||0)),minutes:Math.max(1,Number(entry.minutes)||5)});}
}
shows.sort((a,b)=>a.at-b.at);
function insertRides(beforeShow){
while(rides.length){
const limit=beforeShow?beforeShow.at-beforeShow.buffer:end-reserve;
const fits=rides.map((ride,i)=>{const travel=walking(zone,ride.zone,walk),finish=cursor+travel+ride.queue+ride.minutes,ret=beforeShow?walking(ride.zone,beforeShow.zone,walk):0;return {ride,i,travel,finish,fits:finish+ret<=limit,score:(ride.priority?-30:0)+travel*2+ride.queue*.08+(Number.isFinite(ride.order)?ride.order:i)*2};}).filter(x=>x.fits).sort((a,b)=>a.score-b.score);
if(!fits.length)break;const x=fits[0],ride=x.ride;
steps.push({id:ride.id,name:ride.name,kind:"ride",zone:ride.zone,depart:cursor,arrival:cursor+x.travel,start:cursor+x.travel,end:x.finish,walk:x.travel,queue:ride.queue,minutes:ride.minutes,useQuickPass:!!ride.useQuickPass,hasLive:!!ride.hasLive,assumedWait:!ride.hasLive||!!ride.useQuickPass});
cursor=x.finish;zone=ride.zone;rides.splice(x.i,1);
}}
for(const show of shows){
if(show.at+show.minutes>end||show.at<start||show.at-show.buffer<effectiveStart){unplanned.push({id:show.id,name:show.name,reason:"Show liegt außerhalb des verfügbaren Zeitfensters"});continue;}
insertRides(show);const travel=walking(zone,show.zone,walk),arrival=show.at-show.buffer;
if(cursor+travel>arrival){unplanned.push({id:show.id,name:show.name,reason:"Zeitkonflikt mit Weg oder vorheriger Show"});continue;}
steps.push({id:show.id,name:show.name,kind:"show",zone:show.zone,depart:cursor,arrival,start:show.at,end:show.at+show.minutes,walk:travel,buffer:show.buffer,minutes:show.minutes,estimatedDuration:!!show.estimatedDuration});
cursor=show.at+show.minutes;zone=show.zone;
}
insertRides(null);for(const ride of rides)unplanned.push({id:ride.id,name:ride.name,reason:"Nicht genug Zeit für Weg, Queue und Fahrt"});
if(steps.some(s=>s.assumedWait))warnings.push("Einige Wartezeiten sind Planwerte, keine Live-Prognosen.");
if(steps.some(s=>s.useQuickPass))warnings.push("Quick-Pass-Restwartezeiten sind frei gesetzte Annahmen.");
if(steps.some(s=>s.estimatedDuration))warnings.push("Die Kaiserplatz-Illumination-Dauer ist ein Planwert.");
if(unplanned.length)warnings.push("Nicht alle gewählten Erlebnisse passen ins Zeitfenster.");
return {valid:true,start,end,effectiveStart,steps,done,unplanned,warnings,minutesFree:Math.max(0,end-cursor),count:selected.length};
}
const api=Object.freeze({SHOWS,QUICK_PASS,SHOP_URL,CLOSED_DATES,parseTime,asTime,walking,dateInSeason,buildSchedule});
root.NAEHEN_NIGHT_CORE=api;if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
