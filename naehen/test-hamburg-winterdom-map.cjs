// Regression test: the Winterdom plan must be attached to the park config
// because renderSpecialVenueMap() reads activeParkConfig().specialMap.
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=__dirname;
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,"hamburg-winterdom-2026-config.js"),"utf8"),context,{filename:"hamburg-winterdom-2026-config.js"});
const event=context.window.NAEHEN_HAMBURG_WINTERDOM_2026;
assert.ok(event,"Winterdom module missing");
assert.equal(event.park.slug,"hamburg-winterdom-2026");
assert.equal(event.park.kind,"fair");
assert.ok(event.park.specialMap,"specialMap MUST be inside park, not next to it");
assert.equal(event.specialMap,undefined,"Do not place the map at the module root");
const map=event.park.specialMap;
assert.equal(map.aspectRatio,"2048 / 1448");
assert.equal(map.imageUrl,"./assets/hamburg-winterdom-2026-lageplan.png");
assert.equal(map.points.length,36);
assert.ok(map.sourceUrl&&map.imageCredit);
const ids=new Set(event.rides.map(r=>r.id));
assert.equal(ids.size,36);
const seen=new Set();
for(const point of map.points){
  assert.ok(ids.has(point.rideId),"No matching Winterdom ride: "+point.rideId);
  assert.ok(!seen.has(point.rideId),"Duplicate map link: "+point.rideId);
  seen.add(point.rideId);
  assert.ok(point.x>0&&point.x<100&&point.y>0&&point.y<100,"Off-image hotspot "+point.rideId);
  assert.ok(point.labelHitbox&&point.w>0&&point.h>0,"Invisible field hitbox missing: "+point.rideId);
}
const imagePath=path.join(root,map.imageUrl);
const bytes=fs.readFileSync(imagePath);
assert.ok(bytes.length>100000,"Map asset missing or suspiciously small");
assert.equal(bytes.subarray(0,8).toString("hex"),"89504e470d0a1a0a","Not a PNG");
assert.equal(bytes.readUInt32BE(16),2048);
assert.equal(bytes.readUInt32BE(20),1448);
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const css=fs.readFileSync(path.join(root,"styles.css"),"utf8");
const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
assert.ok(app.includes("window.NAEHEN_HAMBURG_WINTERDOM_2026"));
assert.ok(app.includes("const map = activeParkConfig()?.specialMap;"));
assert.ok(html.includes("hamburg-winterdom-2026-config.js?v=155"));
// Asset versions evolve with each new event. Keep CSS and PWA cache in sync
// without pinning this older Winterdom test to a retired global version.
const styleVersion=html.match(/styles\\.css\\?v=(\\d+)/)?.[1];
assert.ok(styleVersion,"Versioned stylesheet must be loaded");
assert.ok(sw.includes("naehen-v"+styleVersion),"PWA cache must match stylesheet version");
assert.ok(css.includes('body[data-park="hamburg-winterdom-2026"] .venueSpecialMap'));
assert.ok(css.includes('body[data-park="hamburg-winterdom-2026"] .soestPlanLink.mapLabelHitbox'));
console.log("PASS: Winterdom map is visible by app config, PNG exists and 36 click targets resolve");
