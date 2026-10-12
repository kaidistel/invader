// Run: node test-cranger-weihnachtszauber-2026.cjs
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=__dirname;
const code=fs.readFileSync(path.join(root,"cranger-weihnachtszauber-2026-config.js"),"utf8");
const sandbox={window:{}};vm.runInNewContext(code,sandbox);
const fair=sandbox.window.NAEHEN_CRANGER_WEIHNACHTSZAUBER_2026;
assert.ok(fair);assert.equal(fair.park.slug,"cranger-weihnachtszauber-2026");
assert.equal(fair.park.kind,"fair");assert.equal(fair.park.startDate,"2026-11-19");assert.equal(fair.park.endDate,"2026-12-30");
assert.equal(fair.park.specialMap,undefined,"Crange currently onboarded without map");
assert.equal(fair.park.liveWaits,false);assert.equal(fair.park.supportsPostedWait,false);
assert.equal(fair.park.closedDates.length,2);
assert.equal(fair.rides.length,16);assert.equal(new Set(Array.from(fair.rides,r=>r.id)).size,16);
assert.equal(new Set(Object.values(fair.fonts).map(x=>x.fontFamily)).size,16);
for(const ride of fair.rides){
 assert.ok(ride.id.startsWith("crange-weihnacht26-"));
 assert.equal(ride.priceEuro,null);
 assert.equal(ride.new2026,false,"No unverified debut markers");
 assert.ok(ride.imageUrl&&ride.imageCredit&&ride.imageSourceUrl,"Unattributed picture: "+ride.name);
 assert.ok(fair.worlds[ride.id]&&fair.fonts[ride.id]&&fair.rideConfig[ride.id]);
}
const get=id=>fair.rides.find(r=>r.id==="crange-weihnacht26-"+id);
assert.equal(get("wichtelfabrik").operator,"Wilhelm");
assert.ok(get("wichtelfabrik").imageUrl.includes("wichtelfabrik.jpg"));
assert.equal(get("autoscooter").operator,"Küchenmeister");
assert.equal(get("mexico-city").operator,"Meeß-Gusik");
assert.equal(get("space-x").operator,"Marquis");
assert.equal(get("bounty").operator,"Bossle");
assert.ok(fair.park.disclaimer.includes("vorläufig"));
assert.ok(fair.park.disclaimer.includes("Geister Villa statt Spuk"));
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
assert.ok(app.includes("window.NAEHEN_CRANGER_WEIHNACHTSZAUBER_2026"));
assert.ok(html.includes('cranger-weihnachtszauber-2026-config.js?v=117'));
assert.ok(sw.includes("naehen-v117")&&sw.includes("./cranger-weihnachtszauber-2026-config.js"));
console.log("PASS Crange: 16 tentative attractions, themed photos, known operators, no map, dates/closures and cached module");
