"use strict";
// Wintertraum Atelier: maintain park app structure while completely reskinning its components.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=__dirname,read=n=>fs.readFileSync(path.join(root,n),"utf8");
const html=read("index.html"),app=read("app.js"),css=read("wintertraum-atelier.css"),sw=read("sw.js");
for(const id of ["homeView","nightPlanner","rides","wintertraumSection","parkDayBtn","nightPlannerOpen","winterExperienceTotal"])
 assert.ok(html.includes('id="'+id+'"'),"Original app component missing "+id);
assert.ok(!html.includes('id="wtOverture"')&&!html.includes('id="wtNightworlds"'),"No duplicate seasonal content sections");
assert.ok(html.indexOf('class="hero"') < html.indexOf('id="nightPlanner"') &&
  html.indexOf('id="nightPlanner"') < html.indexOf('id="rides"') &&
  html.indexOf('id="rides"') < html.indexOf('id="wintertraumSection"'),"Preserve original order");
assert.ok(app.includes('WINTERTRAUM_ACTIVE')&&app.includes('wtRideActions'),"Retain conditional winter mode and ride logging");
assert.ok(app.includes('isWinterRideCard ? favoriteButton : ""'),"Winter favorite must be on ticket, not inside details");
assert.ok(app.includes('winterShows.hidden = !(parkSlug === "phantasialand" && WINTERTRAUM_ACTIVE)'),"Winter show isolation");
assert.ok(html.includes('wintertraum-atelier.css?v=169'),"New design stylesheet must be used");
assert.ok(!html.includes('wintertraum-experience.css'),"Old skin must not layer over new one");
assert.ok(sw.includes("naehen-v169")&&sw.includes("'./wintertraum-atelier.css'"),"PWA must precache newest skin");
for(const attr of ["ridesToday","showsToday","queueToday","srToday"])assert.ok(html.includes('id="'+attr+'"'),"Stat values intact");
assert.equal((html.match(/data-wt-symbol=/g)||[]).length,4,"Four editorial stat ornaments");
for(const photo of ["wintertraum-berlin-original.jpg","wintertraum-taron-original.jpg","wintertraum-fly-original.jpg"]){
 const buf=fs.readFileSync(path.join(root,"assets",photo));
 assert.ok(buf.length>400000 && buf[0]===0xff&&buf[1]===0xd8,"Authentic photo missing "+photo);
}
for(const token of ["--winter-cream","#homeView>.hero .stat","#rides .ride .rideMain","#rides .ride .wtRideActions",
 ".wintertraumShowBody","#nightPlannerSheet .sheetCard",".nav button.active"]){
 assert.ok(css.includes(token),"Missing redesigned component "+token);
}
assert.ok(css.includes("linear-gradient(145deg,#19374c,#0d2438 76%,#0a1c30)"),"Attraction ticket must have dark blue information section");
assert.ok(css.includes("background:linear-gradient(140deg,#163047,#091c30 82%)"),"Night planner must be midnight blue");
assert.ok(css.includes("color:#f9edda"),"Ride title must be high-contrast warm ivory");
for(const keyframe of ["wt-arrival","wt-photo-breathe","wt-warm-glint","wt-button-light"])
  assert.ok(css.includes("@keyframes "+keyframe),"Missing winter animation "+keyframe);
assert.ok(css.includes("@media(prefers-reduced-motion:reduce)")&&css.includes("animation:none!important"),"Reduced motion must disable continuous effects");
assert.ok(!css.includes("background:#f2e9d9"),"Light cream ticket panels must be removed");
assert.ok(html.includes("family=Fraunces:wght@"),"Wintertraum font must be linked in HTML");
assert.ok(css.includes('--winter-font:"Fraunces",Georgia,serif'),"All seasonal components need the one winter font");
assert.ok(css.includes('font-family:var(--winter-font)!important'),"Ride custom font overrides should not fragment winter typography");
assert.ok(!css.includes('system-ui,sans-serif'),"Seasonal UI should not mix system and winter fonts");
assert.ok(css.includes("@media(max-width:390px)")&&css.includes("@media(max-width:650px)"),"Responsive breakpoints");
assert.ok(css.includes('body[data-park="phantasialand"][data-season="wintertraum"]'),"Theme must be park+season scoped");
assert.ok(html.indexOf('night-planner.css?v=169')<html.indexOf('wintertraum-atelier.css?v=169'),"Latest skin must load last");
console.log("PASS Wintertraum Atelier: original UX, original photos, component redesign, PWA and season isolation");
