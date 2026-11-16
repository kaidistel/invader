"use strict";
// Wintertraum is a seasonal skin for the existing park flow, NOT another attraction catalogue.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=__dirname,read=name=>fs.readFileSync(path.join(root,name),"utf8");
const html=read("index.html"),app=read("app.js"),css=read("wintertraum-experience.css"),sw=read("sw.js");
for(const id of ["homeView","nightPlanner","rides","wintertraumSection","parkDayBtn","nightPlannerOpen"])
  assert.ok(html.includes('id="'+id+'"'),"Missing existing park UI: "+id);
assert.ok(!html.includes('id="wtOverture"')&&!html.includes('id="wtNightworlds"'),"No duplicate seasonal sections");
assert.ok(!app.includes('$("#wtNightworlds")'),"No obsolete tile handler");
const hero=html.indexOf('class="hero"'),planner=html.indexOf('id="nightPlanner"'),rides=html.indexOf('id="rides"'),shows=html.indexOf('id="wintertraumSection"');
assert.ok(hero>0&&hero<planner&&planner<rides&&rides<shows,"Preserve hero → planner → rides → shows order");
assert.ok(app.includes('winterShows.hidden = !(parkSlug === "phantasialand" && WINTERTRAUM_ACTIVE)'),"Shows must be seasonal");
assert.ok(app.includes('const isWinterRideCard = activeParkSlug === "phantasialand" && WINTERTRAUM_ACTIVE'),"Ride layout must be winter-only");
assert.ok(app.includes('wtRideActions')&&css.includes('#rides .ride .wtRideActions'),"Seasonal ride buttons should align");
assert.ok(css.includes('grid-template-columns:repeat(2,minmax(0,1fr))'),"Two evenly aligned ride buttons");
assert.ok(css.includes('justify-content:flex-end'),"Large ride content should align to bottom");
assert.ok(css.includes('min-height:clamp(445px,49vw,585px)'),"Winter hero must feature an expansive photographic masthead");
assert.ok(css.includes('url("./assets/wintertraum-berlin-original.jpg")'),"Seasonal art must use the original Berlin photograph");
assert.ok(css.includes('position:relative!important;z-index:3!important'),"Ride text and controls must sit above the photo gradient");
assert.ok(html.includes('wintertraum-experience.css?v=166'),"Visual assets require updated version");
assert.ok(sw.includes("naehen-v166")&&sw.includes("'./wintertraum-experience.css'"),"PWA must update design stylesheet");
for(const name of ["wintertraum-berlin-original.jpg","wintertraum-taron-original.jpg","wintertraum-fly-original.jpg"]){
 const file=path.join(root,"assets",name),bytes=fs.readFileSync(file);
 assert.ok(bytes.length>400000&&bytes[0]===0xff&&bytes[1]===0xd8,"Keep original Phantasialand photo: "+name);
}
assert.ok(css.includes('@media(max-width:650px)')&&css.includes('@media(max-width:390px)')&&css.includes('@media(min-width:1500px)'),"Mobile, small phone and wide desktop layouts required");
assert.ok(!css.includes('.wtWorldGrid')&&!css.includes('.wtOverture'),"Unused structures removed from CSS");
assert.ok(css.includes('body[data-park="phantasialand"][data-season="wintertraum"]'),"Winter skin stays park-scoped");
assert.ok(html.indexOf('night-planner.css?v=166')<html.indexOf('wintertraum-experience.css?v=166'),"Seasonal CSS last");
console.log("PASS Wintertraum: original page flow, aligned large rides, seasonal photos, responsive UI and cache");
