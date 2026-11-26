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
vm.runInNewContext(read("movie-park-config.js"),ctx,{filename:"movie-park-config.js"});
vm.runInNewContext(read("attraction-facts.js"),ctx,{filename:"attraction-facts.js"});
const ep=ctx.window.NAEHEN_EUROPA_PARK;
const mpg=ctx.window.NAEHEN_MOVIE_PARK;
const data=ctx.window.NAEHEN_ATTRACTION_FACTS;
assert.ok(ep?.rides?.length>=60,"Europa-Park's full list was not loaded");
assert.ok(data&&data["europa-park"]&&data.phantasialand&&data["movie-park-germany"],"All three park catalogs required");
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
assert.equal(mpg.rides.length,32,"Movie Park should have 32 configured attractions");
const mpIds=mpg.rides.map(ride=>ride.id);
assert.equal(new Set(mpIds).size,mpIds.length,"Duplicate Movie Park attraction ids");
assert.equal(Object.keys(data["movie-park-germany"]).length,mpIds.length,"Unexpected or missing Movie Park fact entries");
for(const id of mpIds){
  const facts=data["movie-park-germany"][id];
  assert.ok(facts&&facts.type,"Movie Park attraction type missing: "+id);
  assert.match(facts.technicalSourceUrl,/^https:\/\/(?:rcdb\.com|www\.movieparkgermany\.de)\//,"Technical source missing: "+id);
  assert.match(facts.safetySourceUrl,/^https:\/\/www\.movieparkgermany\.de\/erlebnisse\/attraktionen\//,"Official safety source missing: "+id);
}
const mp=data["movie-park-germany"];
assert.equal(mp["movie-park-studio-tour"].speedKmh,60);
assert.equal(mp["movie-park-studio-tour"].trackLengthM,532);
assert.equal(mp["movie-park-studio-tour"].capacityPerHour,900);
assert.equal(mp["the-high-fall"].speedKmh,98);
assert.equal(mp["the-high-fall"].towerHeightM,60);
assert.equal(mp["ghost-chasers"].speedKmh,45);
assert.equal(mp["ghost-chasers"].trackLengthM,370);
assert.equal(mp["star-trek-operation-enterprise"].speedKmh,90);
assert.equal(mp["star-trek-operation-enterprise"].inversions,3);
assert.equal(mp["star-trek-operation-enterprise"].trackLengthM,720);
assert.equal(mp["iron-claw"].inversions,5);
assert.equal(mp["iron-claw"].trackLengthM,689);
assert.equal(mp["the-bandit"].speedKmh,78);
assert.equal(mp["the-bandit"].trackLengthM,1100);
assert.equal(mp["van-helsings-factory"].speedKmh,36);
assert.equal(mp["van-helsings-factory"].trackLengthM,400);
assert.equal(mp["jimmy-neutrons-atomic-flyer"].speedKmh,47);
assert.equal(mp["jimmy-neutrons-atomic-flyer"].minHeightCm,95);
assert.equal(mp["santa-monica-wheel"].heightM,20);
assert.equal(mp["roxy-4d"].speedKmh,undefined,"Do not invent a speed for a 4D movie");
assert.equal(mp["zumas-zoomers"].minHeightCm,undefined,"Conditional accompaniment is not a hard height minimum");
assert.ok(Object.values(mp).filter(x=>Number.isFinite(x.speedKmh)).length>=9,"Too few researched Movie Park ride speeds");
assert.ok(Object.values(mp).filter(x=>Number.isFinite(x.minHeightCm)).length>=20,"Too few official Movie Park minimum sizes");
assert.ok(Object.values(mp).filter(x=>x.manufacturer&&x.year).length>=8,"Too few coaster make/opening records");
const all=[...Object.values(data["europa-park"]),...Object.values(data.phantasialand),...Object.values(mp)];
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
assert.ok(css.includes('body[data-park="movie-park-germany"] #rides .parkRideSpecs') &&
  css.includes('body[data-park="movie-park-germany"] #rideSheet .rideFactGrid') &&
  css.includes('body[data-park="movie-park-germany"] #rideSheet .rideFactSources'),
  "Movie Park real specs must have responsive, readable cards and source links");
assert.ok(html.includes('attraction-facts.js?v=185')&&html.includes('attraction-facts.css?v=185'));
assert.ok(html.indexOf('attraction-facts.js?v=185')<html.indexOf('app.js?v=191'),"Catalog must load first");
assert.ok(sw.includes("naehen-v191")&&sw.includes("'./attraction-facts.js'")&&sw.includes("'./attraction-facts.css'"));
assert.ok(css.includes("parkRideSpecs")&&css.includes("rideFactGrid"));
console.log("PASS attraction facts: "+epIds.length+" Europa-Park rides, "+phlIds.length+
  " Phantasialand rides, "+mpIds.length+" Movie Park attractions, sourced technical data, responsive cards, offline v192");
