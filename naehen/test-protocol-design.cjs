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
const functions=new Function("isWintertraumDay","worldForRide","PARKS","escapeHtml",
  app.slice(start,end)+"\nreturn {protocolSeasonForDay,protocolArtwork,protocolPhoto,protocolDayPhoto,protocolCardAttrs};");
const h = functions(
  (day,slug)=>slug==="phantasialand" && new Date(day?.started_at || day?.startedAt || 0).getUTCFullYear()===2026 &&
    new Date(day?.started_at || day?.startedAt || 0).getUTCMonth()===11,
  (ride,slug)=>({artUrl:slug==="europa-park"?"https://example.org/ep-ride.webp":"./assets/ride-photo.webp"}),
  {"phantasialand":{cardImage:"./assets/park.webp"},"europa-park":{cardImage:"./assets/park-picker-bg.webp"}},
  s=>String(s).replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;")
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
for(const token of ["protocolPhoto(session.rideId, logSlug, season)","protocolDayPhoto(entry, slug","protocolTimelineRow","archiveVisual","wtRecapMoment","protocolCardAttrs("]){
  assert.ok(app.includes(token),"App integration missing: "+token);
}
for(const token of ["#log .logItem",".archiveDayCard",".protocolPhoto",".protocolTimelineRow",".wtRecapMoment",".protocolDetailHero","@media(max-width:360px)","prefers-reduced-motion:reduce"]){
  assert.ok(css.includes(token),"Protocol styles missing: "+token);
}
assert.ok(css.includes("linear-gradient") && css.includes("opacity:.88!important"),
  "Readable overlays must sit above pictures, without changing foreground opacity");
assert.ok(html.includes('protocols.css?v=186') && html.includes('app.js?v=186') &&
  sw.includes("'./protocols.css'") && sw.includes("naehen-v186"),
  "PWA must ship the photo protocol redesign as version 186");
console.log("PASS: photo-backed protocol, archives, seasonal images, responsive layout, PWA v186");
