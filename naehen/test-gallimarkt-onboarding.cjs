// Gallimarkt Leer 2026: read-only consistency smoke test (node test-gallimarkt-onboarding.cjs).
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const path=require("node:path");
const root=__dirname;
const source=fs.readFileSync(path.join(root,"gallimarkt-leer-2026-config.js"),"utf8");
const sandbox={window:{}};
vm.runInNewContext(source,sandbox,{filename:"gallimarkt-leer-2026-config.js"});
const event=sandbox.window.NAEHEN_GALLIMARKT_LEER_2026;
assert.ok(event);
assert.equal(event.park.slug,"gallimarkt-leer-2026");
assert.equal(event.park.kind,"fair");
assert.equal(event.park.startDate,"2026-10-14");
assert.equal(event.park.endDate,"2026-10-18");
assert.equal(event.park.liveWaits,false);
assert.equal(event.park.supportsPostedWait,false);
assert.ok(event.park.specialMap);
assert.equal(event.park.specialMap.points.length,21);
assert.equal(new Set(Array.from(event.park.specialMap.points,p=>p.rideId)).size,21);
for(const p of event.park.specialMap.points){
 assert.ok(event.rides.some(r=>r.id===p.rideId),"unknown ride referenced by map");
 assert.ok(p.x>0&&p.x<80&&p.y>0&&p.y<80,"map point not on printed number");
}
assert.equal(event.rides.length,21);
assert.equal(new Set(Array.from(event.rides,r=>r.id)).size,21);
assert.equal(Array.from(event.rides,r=>r.new2026).filter(Boolean).length,7);
assert.equal(new Set(Object.values(event.fonts).map(f=>f.fontFamily)).size,21);
for(const r of event.rides){
 assert.ok(r.id.startsWith("leer-gallimarkt26-"));
 assert.ok(r.operator,"missing operator: "+r.name);
 assert.equal(r.priceEuro,null,"price must be manual");
 assert.ok(event.worlds[r.id]&&event.fonts[r.id]&&event.rideConfig[r.id]);
 assert.ok(r.imageUrl,"missing photo: "+r.name);
 assert.ok(r.imageSourceUrl,"missing image attribution: "+r.name);
}
const infinity=event.rides.find(r=>r.name==="Infinity 2.0");
assert.ok(infinity.imageUrl.includes("INFINITY2-Hoefnagels2026"),"Photo must show the NEW 2026 Infinity");
assert.ok(!infinity.imageUrl.includes("DSC01740"),"Do not use predecessor photo");
const breaker=event.rides.find(r=>r.id==="leer-gallimarkt26-break-dancer");
assert.equal(breaker.operator,"Dreher-Vespermann");
assert.ok(breaker.rideIndexUrl.includes("dreher-vespermann"));
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
assert.ok(app.includes("window.NAEHEN_GALLIMARKT_LEER_2026"));
assert.ok(html.includes("./gallimarkt-leer-2026-config.js?v=110"));
assert.ok(sw.includes("./gallimarkt-leer-2026-config.js"));
assert.ok(sw.includes("naehen-v110"));
console.log("PASS Gallimarkt 2026: 21 unique rides, 7 first-time rides, prices, photos, module and PWA links.");
