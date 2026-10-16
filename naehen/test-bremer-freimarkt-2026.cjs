// node test-bremer-freimarkt-2026.cjs
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const root=__dirname;
const src=fs.readFileSync(path.join(root,"bremer-freimarkt-2026-config.js"),"utf8");
const sandbox={window:{}};vm.runInNewContext(src,sandbox);
const event=sandbox.window.NAEHEN_BREMER_FREIMARKT_2026;
assert.ok(event);assert.equal(event.park.slug,"bremer-freimarkt-2026");assert.equal(event.park.kind,"fair");
assert.equal(event.park.startDate,"2026-10-16");assert.equal(event.park.endDate,"2026-11-01");
assert.equal(event.park.liveWaits,false);assert.equal(event.park.supportsPostedWait,false);
assert.equal(event.rides.length,29);assert.equal(new Set(Array.from(event.rides,r=>r.id)).size,29);
assert.equal(event.park.specialMap.points.length,29);
assert.equal(new Set(Array.from(event.park.specialMap.points,p=>p.rideId)).size,29);
assert.equal(event.rides.filter(r=>r.zone==="Fahr- und Laufgeschäfte").length,24);
assert.equal(event.rides.filter(r=>r.zone==="Geister-, Achter- und Schienenbahnen").length,5);
assert.equal(new Set(Object.values(event.fonts).map(f=>f.fontFamily)).size,29);
assert.ok(event.park.specialMap.imageUrl.endsWith(".png"));
for(const point of event.park.specialMap.points){
 assert.ok(event.rides.some(r=>r.id===point.rideId),"Unknown map ride "+point.rideId);
 assert.ok(point.x>15&&point.x<90&&point.y>20&&point.y<75);
 assert.ok(point.group==="yellow"||point.group==="green");
}
for(const ride of event.rides){
 assert.ok(ride.id.startsWith("bremen-freimarkt26-"));
 assert.ok(ride.operator,"Missing operator "+ride.name);
 assert.equal(ride.priceEuro,null);
 assert.ok(ride.new2026===false,"Only explicitly confirmed first visits are marked");
 assert.ok(event.worlds[ride.id]&&event.fonts[ride.id]&&event.rideConfig[ride.id]);
 if(ride.imageUrl)assert.ok(ride.imageSourceUrl,"Missing image source for "+ride.name);
}
assert.equal(event.rides.find(r=>r.name==="Break Dancer No. 2").operator,"Dreher-Vespermann");
assert.equal(event.rides.find(r=>r.name==="Troika – Musikexpress").operator,"Steinmann");
assert.ok(event.rides.find(r=>r.name==="Wilde Maus – Das Original").imageUrl.includes("wilde-maus-aschaff"));
const sourceMap=event.park.specialMap;
assert.ok(sourceMap.imageUrl.endsWith(".png"));
const pngPath=path.join(root,"assets/bremer-freimarkt-2026-map.png");
assert.ok(fs.existsSync(pngPath),"Original 2026 map PNG must be committed, not just referenced");
const pngBytes=fs.readFileSync(pngPath);
assert.ok(pngBytes.length>400000,"Map PNG must not be replaced by a tiny preview");
assert.equal(pngBytes.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
assert.equal(pngBytes.readUInt32BE(16),2048);
assert.equal(pngBytes.readUInt32BE(20),1448);
assert.equal(sourceMap.aspectRatio,"2048 / 1448");
assert.equal(sourceMap.points.length,29);
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const index=fs.readFileSync(path.join(root,"index.html"),"utf8");
const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
assert.ok(app.includes("window.NAEHEN_BREMER_FREIMARKT_2026"));
assert.ok(index.includes("bremer-freimarkt-2026-config.js?v=120"));
assert.ok(sw.includes("naehen-v120")&&sw.includes("./assets/bremer-freimarkt-2026-map.png"));
assert.ok(event.rides.every(r=>r.imageUrl&&r.imageCredit&&r.imageSourceUrl));
console.log("PASS: Bremen 2026, 29 rides, two zones, 29 accurate click points, 29 fonts, no live waits, manual prices");
