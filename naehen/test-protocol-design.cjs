"use strict";
// Regression: image backgrounds must be attached to real log and archive views,
// and a historical Wintertraum visit must retain its winter photography.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const read = name => fs.readFileSync(path.join(__dirname, name), "utf8");
const app=read("app.js"),css=read("protocols.css"),html=read("index.html"),sw=read("sw.js");

const start=app.indexOf("  function protocolSeasonForDay(");
const end=app.indexOf("  function renderGlobalArchive(", start);
assert.ok(start>0 && end>start,"Protocol helpers must load before the global archive");
const imageErrorHandlers=[];
const documentStub={addEventListener:(name,callback,capture)=>{
  if(name==="error" && capture) imageErrorHandlers.push(callback);
}};
const winterPhotos={
  taron:"./assets/wintertraum-taron-2026.webp",
  "black-mamba":"./assets/wintertraum-black-mamba-2026.webp",
  "colorado-adventure":"./assets/wintertraum-colorado-adventure-2026.webp",
  "mystery-castle":"./assets/wintertraum-mystery-castle-2026.webp",
  fly:"./assets/wintertraum-fly-original.jpg"
};
const worlds={
  "phantasialand":{
    taron:{art:"taron"},"black-mamba":{art:"black-mamba"},
    "mystery-castle":{art:"mystery-castle"},"colorado-adventure":{art:"colorado-adventure"},
    fly:{art:"fly"}
  },
  "europa-park":{"voltron-nevera":{artUrl:"https://example.org/voltron.jpg"}}
};
const functions=new Function(
  "isWintertraumDay","worldForRide","PARKS","escapeHtml","isShowSession",
  "WINTERTRAUM_RIDE_ART","EUROPA_HALLOWINTER_ART",
  "canonicalRideForPark","slugRide","document",
  app.slice(start,end)+"\nreturn {protocolSeasonForDay,protocolArtwork,protocolPhoto,protocolDayPhoto,protocolCardAttrs,protocolPhotoCandidates,protocolSessionRideId};");
const h = functions(
  (day,slug)=>slug==="phantasialand" &&
    new Date(day?.started_at || day?.startedAt || 0).getUTCFullYear()===2026 &&
    new Date(day?.started_at || day?.startedAt || 0).getUTCMonth()===11,
  (id,slug)=>worlds[slug]?.[id] || null,
  {"phantasialand":{cardImage:"./assets/park.webp"},"europa-park":{cardImage:"./assets/park-picker-bg.webp"}},
  s=>String(s).replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;"),
  session=>String(session?.rideId || "").startsWith("wintershow-"),
  winterPhotos,"https://example.org/voltron-hallowinter.jpg",
  (id,slug)=>worlds[slug]?.[id]?{id}:null,
  name=>name.toLowerCase().replace(/\s+/g,"-"),
  documentStub
);
assert.equal(h.protocolSeasonForDay({started_at:"2026-11-18T12:00:00Z"},"europa-park"),"hallowinter");
assert.equal(h.protocolSeasonForDay({started_at:"2026-12-03T12:00:00Z"},"europa-park"),"");
assert.equal(h.protocolSeasonForDay({started_at:"2026-12-18T12:00:00Z"},"phantasialand"),"wintertraum");
assert.ok(h.protocolArtwork("taron","phantasialand","wintertraum").includes("wintertraum-taron-2026.webp"));
assert.ok(h.protocolArtwork("mystery-castle","phantasialand","wintertraum").includes("wintertraum-mystery-castle-2026.webp"));
assert.ok(h.protocolArtwork("wintershow-magic-symphony","phantasialand","wintertraum").includes("wintertraum-night-planner-2026.webp"));
assert.ok(h.protocolArtwork("voltron-nevera","europa-park","hallowinter").startsWith("https://"));
assert.ok(h.protocolPhoto("taron","phantasialand","wintertraum").includes('alt="" aria-hidden="true"'));
assert.ok(h.protocolCardAttrs("phantasialand","wintertraum").includes('data-protocol-season="wintertraum"'));
const entry={sessions:[{rideId:"taron",rideName:"Taron",status:"ridden"}]};
assert.ok(h.protocolDayPhoto(entry,"phantasialand","wintertraum").includes("wintertraum-taron-2026.webp"));
assert.ok(h.protocolPhoto("taron","phantasialand","wintertraum").includes('data-protocol-ride="taron"'));
assert.ok(h.protocolPhoto("black-mamba","phantasialand","wintertraum").includes('wintertraum-black-mamba-2026.webp'));
assert.ok(h.protocolPhoto("colorado-adventure","phantasialand","wintertraum").includes('wintertraum-colorado-adventure-2026.webp'));
assert.equal(h.protocolPhotoCandidates("taron","phantasialand","wintertraum")[1],"./assets/taron.webp",
  "Failure fallback should stay on the SAME attraction");
assert.deepEqual(h.protocolPhotoCandidates("unmapped-ride","phantasialand","wintertraum"),[],
  "Missing ride photo must not become a misleading park or another attraction photo");
assert.equal(h.protocolPhoto("unmapped-ride","phantasialand","wintertraum"),"");
assert.equal(h.protocolSessionRideId({rideName:"Taron"},"phantasialand"),"taron",
  "Old archives without a ride ID must use the ride name");
const oldEntry={sessions:[{rideName:"Taron",status:"ridden"}]};
assert.ok(h.protocolDayPhoto(oldEntry,"phantasialand","wintertraum").includes("wintertraum-taron-2026.webp"));
assert.ok(imageErrorHandlers.length===1,"All dynamic protocol images need a shared fallback listener");
const fakeImage={
  classList:{contains:x=>x==="protocolPhoto"},
  dataset:{protocolFallbacks:JSON.stringify(["./assets/taron.webp"])},
  src:"./assets/wintertraum-taron-2026.webp",removed:false,remove(){this.removed=true}
};
imageErrorHandlers[0]({target:fakeImage});
assert.equal(fakeImage.src,"./assets/taron.webp","First fallback must keep ride identity");
imageErrorHandlers[0]({target:fakeImage});
assert.equal(fakeImage.removed,true,"Broken photo removed cleanly if no ride-specific image works");

for(const token of ["protocolPhoto(protocolSessionRideId(session, logSlug), logSlug, season)","protocolDayPhoto(entry, slug","protocolTimelineRow","archiveVisual","wtRecapMoment","protocolCardAttrs("]){
  assert.ok(app.includes(token),"App integration missing: "+token);
}
for(const token of ["#log .logItem",".archiveDayCard",".protocolPhoto",".protocolTimelineRow",".wtRecapMoment",".protocolDetailHero","@media(max-width:360px)","prefers-reduced-motion:reduce"]){
  assert.ok(css.includes(token),"Protocol styles missing: "+token);
}
assert.ok(css.includes("linear-gradient") && css.includes("opacity:.88!important"),
  "Readable overlays must sit above pictures, without changing foreground opacity");
assert.ok(html.includes('protocols.css?v=188') && html.includes('app.js?v=191') &&
  sw.includes("'./protocols.css'") && sw.includes("naehen-v191"),
  "PWA must ship the photo protocol redesign as version 186");
assert.ok(app.includes('admissionType: row.ticket_metadata?.admissionType') &&
  app.includes('admissionType: session.admissionType') &&
  app.includes('admissionNoteHtml(session)') &&
  app.includes('sessionQueueModeLabel(session)'), "Virtual Line must round-trip through cloud and appear in logs");
assert.ok(css.includes('.logAdmissionBadge'), "Virtual Line label must remain readable");
console.log("PASS: photo-backed protocol, archives, seasonal images, responsive layout, PWA v187");
