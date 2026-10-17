// Run: node test-unified-archive.cjs
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=__dirname;
const code=fs.readFileSync(path.join(root,"app.js"),"utf8");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
assert.ok(html.includes('data-view="allDaysView"'));
assert.ok(html.includes('id="pickerAllDaysBtn"'));
assert.ok(html.includes('id="allDaysList"'));
assert.ok(html.includes('data-archive-filter="fair"'));
assert.ok(html.includes('data-archive-filter="park"'));
assert.ok(sw.includes("naehen-v124"));
assert.ok(code.includes('async function loadGlobalCloudArchive('));
assert.ok(code.includes('.eq("user_id", userId).not("ended_at", "is", null)'));
assert.ok(code.includes('dbSessionToClient(row, day.park_slug || "phantasialand")'));
assert.ok(code.includes('globalEntry || parkArchive.find('));
assert.ok(code.includes('class=\\\"archiveOperator'));
assert.ok(code.includes('class=\\\"logOperator'));
const sourceStart=code.indexOf("  function mergeGlobalArchiveEntries(...sources) {");
const sourceEnd=code.indexOf("  async function loadGlobalCloudArchive(",sourceStart);
assert.ok(sourceStart>0&&sourceEnd>sourceStart);
const records={
 "naehen:parkArchive:phantasialand":[{
  day:{id:"p-1",park_slug:"phantasialand",started_at:"2026-08-03T09:00:00Z",ended_at:"2026-08-03T16:00:00Z"},
  sessions:[{rideId:"taron",rideName:"Taron",status:"ridden"}]
 }],
 "naehen:parkArchive:hamburg-winterdom-2026":[{
  day:{id:"f-1",started_at:"2026-11-14T12:00:00Z",ended_at:"2026-11-14T23:00:00Z"},
  sessions:[{rideId:"winterdom26-mayday",rideName:"Mayday",priceEuro:8,status:"ridden"}]
 }]
};
const read={get:(key,fallback)=>records[key]??fallback};
const utilities=new Function("store","PARKS","parkStoreKey","activeParkSlug","parkArchive","normalizeArchiveEntry","parkDayStartMs",
  code.slice(sourceStart,sourceEnd)+"\nreturn {localGlobalArchive,mergeGlobalArchiveEntries};");
const normal=(entry,slug)=>({day:entry.day,sessions:entry.sessions.map(session=>({...session,parkSlug:slug}))});
const tools=utilities(read,{"phantasialand":{},"hamburg-winterdom-2026":{}},
 (base,slug)=>base+":"+slug,null,[],normal,day=>new Date(day.started_at).getTime());
const local=tools.localGlobalArchive();
assert.equal(local.length,2);
assert.equal(local[0].day.park_slug,"hamburg-winterdom-2026");
assert.equal(tools.mergeGlobalArchiveEntries(local,local).length,2);
const operatorStart=code.indexOf("  function operatorForSession(");
const operatorEnd=code.indexOf("  function renderSpecialVenueMap(",operatorStart);
assert.ok(operatorStart>0&&operatorEnd>operatorStart);
const park={slug:"hamburg-winterdom-2026",kind:"fair",name:"Hamburger Winterdom",receiptTitle:"WINTERDOM"};
const entries={"winterdom26-mayday":{id:"winterdom26-mayday",name:"Mayday",operatorFull:"Meyer / Horlbeck"}};
const ctx=new Function("PARKS","venueIsFair","canonicalRideForPark","fallbackRidesFor","activeParkSlug","escapeHtml","formatEuro","rideTimeLabel",
 code.slice(operatorStart,operatorEnd)+"\nreturn {operatorForSession,fairReceiptHtml};")(
 {[park.slug]:park},slug=>slug===park.slug,
 (id)=>entries[id]||null,()=>Object.values(entries),park.slug,
 s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),
 n=>Number(n).toFixed(2)+" €",()=>"13:30");
const day={park_slug:park.slug,started_at:"2026-11-14T12:00:00Z"};
const receipt=ctx.fairReceiptHtml([
 {rideId:"winterdom26-mayday",rideName:"Mayday",status:"ridden",priceEuro:0,startedAt:10},
 {rideId:"winterdom26-mayday",rideName:"Mayday",status:"ridden",priceEuro:null,startedAt:20}
],day);
assert.ok(receipt.includes("Schausteller: Meyer / Horlbeck"));
assert.ok(receipt.includes("0.00 €"));
assert.ok(receipt.includes("PREIS FEHLT"));
assert.ok(receipt.includes("1 Preis fehlt"));
console.log("PASS: combined local archive, deduplication, menu access, fair operator and null-vs-zero prices");
