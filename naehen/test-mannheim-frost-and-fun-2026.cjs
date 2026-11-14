// Run: node test-mannheim-frost-and-fun-2026.cjs
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=__dirname;
const source=fs.readFileSync(path.join(root,"mannheim-frost-and-fun-2026-config.js"),"utf8");
const sandbox={window:{}};vm.runInNewContext(source,sandbox);
const fair=sandbox.window.NAEHEN_MANNHEIM_FROST_AND_FUN_2026;
assert.ok(fair);
assert.equal(fair.park.slug,"mannheim-frost-and-fun-2026");
assert.equal(fair.park.kind,"fair");
assert.equal(fair.park.startDate,"2026-11-20");
assert.equal(fair.park.endDate,"2026-12-20");
assert.equal(fair.park.specialMap,undefined,"Mapless onboarding must have no specialMap");
assert.equal(fair.park.liveWaits,false);
assert.equal(fair.park.supportsPostedWait,false);
assert.equal(fair.park.liveDataUrl,null);
assert.equal(fair.rides.length,8);
assert.equal(new Set(Array.from(fair.rides,r=>r.id)).size,8);
assert.equal(fair.rides.filter(r=>r.lineupStatus==="confirmed").length,3);
assert.equal(fair.rides.filter(r=>r.lineupStatus==="provisional").length,5);
assert.equal(new Set(Object.values(fair.fonts).map(x=>x.fontFamily)).size,8);
assert.equal(fair.park.actionDates.length,4);
for(const ride of fair.rides){
  assert.ok(ride.id.startsWith("mannheim-frost26-"));
  assert.equal(ride.priceEuro,null);
  assert.equal(ride.new2026,false);
  assert.ok(ride.operator && ride.operatorFull && ride.rideIndexUrl);
  assert.ok(ride.imageUrl && ride.imageCredit && ride.imageSourceUrl);
  assert.ok(fair.worlds[ride.id] && fair.fonts[ride.id] && fair.rideConfig[ride.id]);
}
for(const name of ["Tiki Taki XXL","Avenger Royal","Bayern Breaker","Magic","Eyecatcher","Königlicher Wellenflug","Mike’s Pitstop","Musik Express"])assert.ok(fair.rides.some(ride=>ride.name===name));
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
const css=fs.readFileSync(path.join(root,"styles.css"),"utf8");
const portal=fs.readFileSync(path.join(root,"portals.css"),"utf8");
assert.ok(app.includes("window.NAEHEN_MANNHEIM_FROST_AND_FUN_2026"));
assert.ok(html.includes("mannheim-frost-and-fun-2026-config.js?v=157"));
const appVersion=/app\\.js\\?v=(\\d+)/.exec(html)?.[1];
assert.ok(appVersion, "Application shell must have a version");
assert.ok(sw.includes("naehen-v"+appVersion) && sw.includes("./mannheim-frost-and-fun-2026-config.js"),
  "PWA cache version must follow app.js version, not a hard-coded historic build");
assert.ok(css.includes('body[data-park="mannheim-frost-and-fun-2026"]'));
assert.ok(portal.includes('#rideSheet[data-park="mannheim-frost-and-fun-2026"]'));
console.log("PASS Mannheim Frost & Fun: mapless, 8 rides, 3 official, 5 provisional, prices, art, registration and version");
