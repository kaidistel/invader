// node test-nordhorn-herbstkirmes-2026.cjs
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=__dirname;
const script=fs.readFileSync(path.join(root,"nordhorn-herbstkirmes-2026-config.js"),"utf8");
const sandbox={window:{}};vm.runInNewContext(script,sandbox);
const a=sandbox.window.NAEHEN_NORDHORN_HERBSTKIRMES_2026;
assert.ok(a);assert.equal(a.park.slug,"nordhorn-herbstkirmes-2026");
assert.equal(a.park.kind,"fair");
assert.equal(a.park.startDate,"2026-10-23");assert.equal(a.park.endDate,"2026-10-27");
assert.equal(a.park.specialMap,undefined,"Nordhorn explicitly without map");
assert.equal(a.park.liveWaits,false);assert.equal(a.park.supportsPostedWait,false);
assert.equal(a.rides.length,9);assert.equal(new Set(Array.from(a.rides,x=>x.id)).size,9);
assert.equal(new Set(Object.values(a.fonts).map(x=>x.fontFamily)).size,9);
const expected=[
 ["Mexico City","Gusik-Meeß"],["Space X","Marquis"],["Break Dance","Welte"],
 ["Musik-Express","Welte-Noack"],["Take Off","Langenscheidt"],["Aviator","Fischer"],
 ["Super Dance","Braun"],["AS Speed Drive XXL","Braun"],["Ghost","Burghard"]
];
a.rides.forEach((ride,i)=>{
 assert.equal(ride.name,expected[i][0]);assert.equal(ride.operator,expected[i][1]);
 assert.ok(ride.id.startsWith("nordhorn-herbst26-"));assert.equal(ride.priceEuro,null);
 assert.equal(ride.new2026,false);
 assert.ok(ride.imageUrl&&ride.imageCredit&&ride.imageSourceUrl,"Photo & credit required "+ride.name);
 assert.ok(a.worlds[ride.id]&&a.fonts[ride.id]&&a.rideConfig[ride.id]);
});
assert.ok(a.rides.find(x=>x.name==="AS Speed Drive XXL").imageUrl.includes("Braun-Speed-Drive-XXL-2026-R"));
assert.ok(a.rides.find(x=>x.name==="Break Dance").imageUrl.includes("welte"));
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const index=fs.readFileSync(path.join(root,"index.html"),"utf8");
const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
assert.ok(app.includes("window.NAEHEN_NORDHORN_HERBSTKIRMES_2026"));
assert.ok(index.includes("nordhorn-herbstkirmes-2026-config.js?v=124"));
assert.ok(sw.includes("naehen-v124")&&sw.includes("./nordhorn-herbstkirmes-2026-config.js"));
console.log("PASS Nordhorn: nine operator-specific rides, nine photos, no map, manual prices and original dates");
