// Run: node test-hochheimer-markt-2026.cjs
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=__dirname;const s=fs.readFileSync(path.join(root,"hochheimer-markt-2026-config.js"),"utf8");
const sandbox={window:{}};vm.runInNewContext(s,sandbox);
const a=sandbox.window.NAEHEN_HOCHHEIMER_MARKT_2026;
assert.ok(a);assert.equal(a.park.slug,"hochheimer-markt-2026");
assert.equal(a.park.kind,"fair");assert.equal(a.park.startDate,"2026-11-06");
assert.equal(a.park.endDate,"2026-11-10");assert.equal(a.park.liveWaits,false);
assert.equal(a.park.supportsPostedWait,false);
assert.equal(a.park.specialMap,undefined,"Hochheim explicitly without a map");
assert.equal(a.rides.length,14);
assert.equal(new Set(Array.from(a.rides,x=>x.id)).size,14);
assert.equal(new Set(Object.values(a.fonts).map(x=>x.fontFamily)).size,14);
const names=["FFH-Riesenrad","Wellenflug","Heidi The Coaster","XXL-Racer","Hip Hop Fly","Break Dancer",
 "Autoscooter","1001 Nacht","Disco Express 2","Time Factory","Crazy Time 2","Euro-Car",
 "Märchen-Karussell","Mini Jet"];
a.rides.forEach((r,i)=>{
 assert.equal(r.name,names[i]);assert.equal(r.priceEuro,null);
 assert.equal(r.new2026,false,"Do not invent a debut");
 assert.ok(r.operator,"Operator status should be explicit");
 assert.ok(r.id.startsWith("hochheim-markt26-"));
 assert.ok(a.worlds[r.id]&&a.fonts[r.id]&&a.rideConfig[r.id]);
 if(r.imageUrl)assert.ok(r.imageCredit&&r.imageSourceUrl);
});
assert.equal(a.rides.filter(r=>r.imageUrl).length,12,"Two unverified children rides intentionally have no misleading image");
assert.ok(a.park.disclaimer.includes("vorläufig"));
assert.ok(a.park.disclaimer.includes("20.10.2026"));
assert.equal(a.rides.find(r=>r.name==="Break Dancer").operator,"Schramm");
assert.ok(a.rides.find(r=>r.name==="Break Dancer").imageUrl.includes("bd-schramm"));
assert.ok(a.rides.find(r=>r.name==="Disco Express 2").rideIndexUrl.includes("roie-2"));
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const index=fs.readFileSync(path.join(root,"index.html"),"utf8");
const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
assert.ok(app.includes("window.NAEHEN_HOCHHEIMER_MARKT_2026"));
assert.ok(index.includes('hochheimer-markt-2026-config.js?v=121'));
assert.ok(sw.includes("naehen-v121"));
assert.ok(sw.includes("./hochheimer-markt-2026-config.js"));
console.log("PASS: Hochheimer Markt 2026, 14 provisional rides, 12 matched photos, 14 fonts, no map");
