// Run: node test-hamburg-winterdom-onboarding.cjs
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const root=__dirname,sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,"hamburg-winterdom-2026-config.js"),"utf8"),sandbox);
const a=sandbox.window.NAEHEN_HAMBURG_WINTERDOM_2026;
assert.ok(a,"Module missing");assert.equal(a.park.slug,"hamburg-winterdom-2026");
assert.equal(a.park.kind,"fair");assert.equal(a.park.startDate,"2026-11-06");assert.equal(a.park.endDate,"2026-12-06");
assert.equal(a.park.specialMap,undefined,"Explicit no-map mode must be respected");
assert.equal(a.park.liveWaits,false);assert.equal(a.park.supportsPostedWait,false);
assert.equal(a.rides.length,36);
assert.equal(a.rides.filter(r=>!r.imageUrl||!r.imageCredit||!r.imageSourceUrl).length,0,
  "Every ride must have an attributed image");
assert.ok(a.rides.find(x=>x.id==="winterdom26-break-dancer-no-2").imageUrl.includes("3-breakdancer-no2-steinert22"),
  "Never use Bonner's photo for the Dreher-Vespermann Break Dancer");
assert.ok(a.rides.find(x=>x.id==="winterdom26-spass-allee").imageUrl.includes("2025"),
  "Use the redesigned 2025 Spaßallee, not old Crazy Town");assert.equal(new Set(Array.from(a.rides,x=>x.id)).size,36);
assert.equal(a.rides.filter(x=>x.new2026).length,4);
assert.equal(new Set(Object.values(a.fonts).map(x=>x.fontFamily)).size,36);
for(const r of a.rides){
 assert.ok(r.id.startsWith("winterdom26-"));assert.ok(r.operator);assert.equal(r.priceEuro,null);
 assert.ok(a.worlds[r.id]);assert.ok(a.fonts[r.id]);assert.ok(a.rideConfig[r.id]);
 if(r.imageUrl){assert.ok(r.imageSourceUrl,"Photo source missing: "+r.name);assert.ok(r.imageCredit,"Photo credit missing: "+r.name)}
}
const air=a.rides.find(x=>x.id==="winterdom26-air-power");
const bumper=a.rides.find(x=>x.id==="winterdom26-bumper-1");
assert.ok(air.imageUrl.includes("air_power_bremerhaven.jpg"),"Use actual photograph of Heine Air Power");
assert.ok(bumper.imageUrl.includes("media.tag24.de"),"Use directly loadable Bumper One DOM Scooter photo");
for (const r of [air,bumper]) {
  assert.ok(r.imageFallbackUrls.length>=1,"Require vetted backup images");
  assert.ok(!r.imageUrl.includes("onride.de"),"Avoid broken onride image endpoints");
  assert.ok(r.imageCredit&&r.imageSourceUrl&&r.rideIndexUrl);
}
assert.equal(a.rides.find(x=>x.id==="winterdom26-break-dancer-no-2").operator,"Dreher-Vespermann");
assert.ok(a.rides.find(x=>x.id==="winterdom26-infinity-2").imageSourceUrl.includes("infinity-2"));
assert.ok(a.rides.find(x=>x.id==="winterdom26-mayday").imageUrl.includes("mayday-the-ultimate-thrill.webp"));
assert.ok(fs.readFileSync(path.join(root,"index.html"),"utf8").includes("hamburg-winterdom-2026-config.js?v=113"));
assert.ok(fs.readFileSync(path.join(root,"app.js"),"utf8").includes("window.NAEHEN_HAMBURG_WINTERDOM_2026"));
assert.ok(fs.readFileSync(path.join(root,"sw.js"),"utf8").includes("naehen-v113"));
console.log("PASS Winterdom 2026: 36 rides, 5 categories, 4 debut markers, no map, manual prices, themed styles and PWA cache.");
