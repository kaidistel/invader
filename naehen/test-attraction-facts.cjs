"use strict";
/* Regression: real attraction data must resolve for every configured ride, without
   changing live queue behaviour or inventing numeric placeholders. */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const dir=__dirname;
const read=file=>fs.readFileSync(path.join(dir,file),"utf8");
const ctx={window:{}};
vm.runInNewContext(read("europa-park-config.js"),ctx,{filename:"europa-park-config.js"});
vm.runInNewContext(read("attraction-facts.js"),ctx,{filename:"attraction-facts.js"});
const ep=ctx.window.NAEHEN_EUROPA_PARK;
const data=ctx.window.NAEHEN_ATTRACTION_FACTS;
assert.ok(ep?.rides?.length>=60,"Europa-Park's full list was not loaded");
assert.ok(data&&data["europa-park"]&&data.phantasialand,"Both park catalogs required");
const epIds=ep.rides.map(ride=>ride.id);
assert.equal(new Set(epIds).size,epIds.length,"Duplicate Europa-Park ride IDs");
for(const id of epIds){
  const facts=data["europa-park"][id];
  assert.ok(facts&&facts.type, "Missing Europa-Park ride type: "+id);
}
const app=read("app.js");
const fallbackPart=app.split("const FALLBACK_RIDES = [")[1]?.split("].map((ride) => enrichRide")[0];
assert.ok(fallbackPart,"Can't find Phantasialand ride list");
const phlIds=[...fallbackPart.matchAll(/\{ id: "([^"]+)", name: /g)].map(m=>m[1]);
assert.ok(phlIds.length>=17,"Phantasialand core rides missing");
for(const id of phlIds){
  const facts=data.phantasialand[id];
  assert.ok(facts&&facts.type,"Missing Phantasialand ride type: "+id);
}
assert.ok(data.phantasialand["berliner-eislaufen"]?.type,"Seasonal activity must be covered");
const all=[...Object.values(data["europa-park"]),...Object.values(data.phantasialand)];
const numeric=["heightM","towerHeightM","trackLengthM","speedKmh","maxG","minHeightCm","maxHeightCm","minAgeYears","capacityPerHour"];
for(const facts of all){
  for(const key of numeric){
    if(facts[key]!==undefined) assert.ok(Number.isFinite(facts[key])&&facts[key]>0, "Invalid numeric "+key);
  }
  if(facts.inversions!==undefined) assert.ok(Number.isInteger(facts.inversions)&&facts.inversions>=0,"Invalid inversions");
  if(facts.launches!==undefined) assert.ok(Number.isInteger(facts.launches)&&facts.launches>0,"Invalid launches");
  if(facts.minHeightCm!==undefined&&facts.maxHeightCm!==undefined)
    assert.ok(facts.minHeightCm<=facts.maxHeightCm,"Inconsistent min/max size");
}
assert.equal(data["europa-park"]["voltron-nevera"].trackLengthM,1385);
assert.equal(data["europa-park"]["voltron-nevera"].inversions,7);
assert.equal(data.phantasialand.taron.trackLengthM,1320);
assert.equal(data.phantasialand.taron.speedKmh,117);
assert.ok(Object.values(data["europa-park"]).filter(x=>x.manufacturer&&x.year).length>=25,"Too few detailed Europa-Park records");
assert.ok(Object.values(data.phantasialand).filter(x=>x.manufacturer||x.year||x.technicalSourceUrl).length>=10,"Too few detailed Phantasialand records");
assert.ok(app.includes("Object.assign(ride, facts)")&&app.includes("parkRideSpecPreview(ride)"),
  "Static specs must appear in live/fallback rides and cards");
assert.ok(app.includes("ATTRAKTIONS-STECKBRIEF")&&app.includes("rideFactSources"),
  "Sourced detail facts must be rendered");
const html=read("index.html"),sw=read("sw.js"),css=read("attraction-facts.css");
assert.ok(html.includes('attraction-facts.js?v=185')&&html.includes('attraction-facts.css?v=185'));
assert.ok(html.indexOf('attraction-facts.js?v=185')<html.indexOf('app.js?v=185'),"Catalog must load first");
assert.ok(sw.includes("naehen-v185")&&sw.includes("'./attraction-facts.js'")&&sw.includes("'./attraction-facts.css'"));
assert.ok(css.includes("parkRideSpecs")&&css.includes("rideFactGrid"));
console.log("PASS attraction facts: "+epIds.length+" Europa-Park rides, "+phlIds.length+
  " Phantasialand rides, documented technical data, visible sourced details and offline v185");
