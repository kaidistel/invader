"use strict";
// Wintertraum Atelier: maintain park app structure while completely reskinning its components.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=__dirname,read=n=>fs.readFileSync(path.join(root,n),"utf8");
const html=read("index.html"),app=read("app.js"),css=read("wintertraum-atelier.css"),detailCSS=read("wintertraum-details.css"),sw=read("sw.js");
for(const id of ["homeView","nightPlanner","rides","wintertraumSection","parkDayBtn","nightPlannerOpen","winterExperienceTotal"])
 assert.ok(html.includes('id="'+id+'"'),"Original app component missing "+id);
assert.ok(!html.includes('id="wtOverture"')&&!html.includes('id="wtNightworlds"'),"No duplicate seasonal content sections");
assert.ok(html.indexOf('class="hero"') < html.indexOf('id="nightPlanner"') &&
  html.indexOf('id="nightPlanner"') < html.indexOf('id="rides"') &&
  html.indexOf('id="rides"') < html.indexOf('id="wintertraumSection"'),"Preserve original order");
assert.ok(app.includes('WINTERTRAUM_ACTIVE')&&app.includes('wtRideActions'),"Retain conditional winter mode and ride logging");
assert.ok(app.includes('isWinterRideCard ? favoriteButton : ""'),"Winter favorite must be on ticket, not inside details");
assert.ok(app.includes('winterShows.hidden = !(parkSlug === "phantasialand" && WINTERTRAUM_ACTIVE)'),"Winter show isolation");
assert.ok(html.includes('wintertraum-atelier.css?v=180'),"New design stylesheet must be used");
assert.ok(!html.includes('wintertraum-experience.css'),"Old skin must not layer over new one");
assert.ok(html.includes('wintertraum-details.css?v=180')&&html.includes('class="winterDetailKicker"'),"Winter details and seasonal label required");
assert.ok(sw.includes("'./wintertraum-details.css'"),"Offline winter detail screen must be cached");
assert.ok(html.indexOf('wintertraum-atelier.css?v=180') < html.indexOf('wintertraum-details.css?v=180'),"Detail override must load after winter skin");
assert.ok(detailCSS.includes('.winterDetailKicker{display:none}')&&detailCSS.includes('body[data-park="phantasialand"][data-season="wintertraum"] #rideSheet'),"Winter sheet must be seasonal only");
for(const token of ['#rideTitle','.rideDetailWait','#rideQuickPass','#rideExtraFacts','#srCommunity','#rideQueueBtn','.worldArt','.close']){
 assert.ok(detailCSS.includes(token),"Existing detail UI not restyled: "+token);
}
assert.ok(detailCSS.includes('prefers-reduced-motion:no-preference'),"Detail animation must respect reduced motion");
assert.ok(detailCSS.includes('-webkit-text-fill-color:#fff2dd!important'),"Winter title must override transparent FLY lettering");
assert.ok(detailCSS.includes('clip-path:none!important'),"Taron stone-edge title clipping must be removed in winter");
assert.ok(detailCSS.includes('#rideTitle::before')&&detailCSS.includes('content:none!important'),"Old title ornaments should be hidden");
assert.ok(detailCSS.includes('position:absolute!important;top:16px!important;right:16px!important'),"Close action must stay at photo top");
assert.ok(sw.includes("naehen-v180")&&sw.includes("'./wintertraum-atelier.css'"),"PWA must precache newest skin");
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
assert.ok(css.includes("linear-gradient(90deg,rgba(6,20,36,.98)") && css.includes('url("./assets/wintertraum-taron-original.jpg") center 43%/cover no-repeat'),"Night planner must use a unified dark photo background");
assert.ok(css.includes("color:#f9edda"),"Ride title must be high-contrast warm ivory");
for(const keyframe of ["wt-arrival","wt-photo-breathe","wt-warm-glint","wt-button-light"])
  assert.ok(css.includes("@keyframes "+keyframe),"Missing winter animation "+keyframe);
assert.ok(css.includes("@media(prefers-reduced-motion:reduce)")&&css.includes("animation:none!important"),"Reduced motion must disable continuous effects");
assert.ok(!css.includes("background:#f2e9d9"),"Light cream ticket panels must be removed");
assert.ok(css.includes('url("./assets/wintertraum-taron-original.jpg") center 43%/cover no-repeat'),"Night planner photo must remain original");
assert.ok(css.includes('.nightPlanner::before,')&&css.includes('content:none!important;display:none!important'),"Night planner ticket pseudo elements must be disabled");
assert.ok(!css.includes("border-left:2px dashed"),"No perforated ticket separator in night planner");
assert.ok(html.includes("family=Berkshire+Swash")&&html.includes("family=Inter:wght@"),"Both seasonal font families must load");
assert.ok(css.includes('--winter-display:"Berkshire Swash",Georgia,serif'),"Display headlines use Berkshire Swash");
assert.ok(css.includes('--winter-font:"Inter",Arial,system-ui,sans-serif'),"Small UI must use original clear Inter");
assert.ok(css.includes('font-family:var(--winter-display)!important'),"Ride names must retain Berkshire despite theme overrides");
assert.ok(css.includes('font-family:var(--winter-font)!important'),"Controls and labels must use Inter");
assert.ok(!css.includes('--winter-font:"Fraunces"'),"The previous decorative body font must not override Inter");
assert.ok(css.includes('--winter-font:"Inter",Arial,system-ui,sans-serif;'),"Readable sans-serif fallback must remain available");
assert.ok(css.includes("@media(max-width:390px)")&&css.includes("@media(max-width:650px)"),"Responsive breakpoints");
assert.ok(css.includes('body[data-park="phantasialand"][data-season="wintertraum"]'),"Theme must be park+season scoped");
assert.ok(html.indexOf('night-planner.css?v=180')<html.indexOf('wintertraum-atelier.css?v=180'),"Latest skin must load last");
const snow=read("wintertraum-snow.js"),snowCss=read("wintertraum-snow.css");
const recapCss=read("wintertraum-recap.css");
assert.ok(html.includes('wintertraum-recap.css?v=180'),"Winter recap CSS must be loaded");
assert.ok(sw.includes("'./wintertraum-recap.css'"),"Offline recap CSS required");
assert.ok(recapCss.includes('#recapSheet[data-wintertraum="true"]')&&recapCss.includes('#archiveDetailSheet[data-wintertraum="true"]'),"Recap and archive must be seasonal");
assert.ok(recapCss.includes("wintertraum-berlin-original.jpg"),"Official winter Berlin background required");
assert.ok(recapCss.includes("prefers-reduced-motion:no-preference"),"Recap animation respects reduced motion");
assert.ok(app.includes("function isWintertraumDay(day, parkSlug)")&&app.includes('timeZone: "Europe/Berlin"'),"Seasonal archive day detector required");
assert.ok(app.includes("function winterRecapHtml")&&app.includes("wtRecapTimeline"),"Winter recap requires chronological moments");
assert.ok(app.includes("recapSheet.dataset.wintertraum")&&app.includes("archiveSheet.dataset.wintertraum"),"Recap and archive must set style marker");
assert.ok(snow.includes('#recapSheet.show[data-wintertraum="true"]')&&snow.includes('#archiveDetailSheet.show[data-wintertraum="true"]'),"Snow should continue in seasonal recap and archive");
assert.ok(html.includes('id="winterSnowCanvas"')&&html.includes('id="winterSnowToggle"'),"Snow controls must exist");
assert.ok(html.includes('wintertraum-snow.js?v=180')&&html.includes('wintertraum-snow.css?v=180'),"Snow feature must be versioned");
assert.ok(sw.includes("'./wintertraum-snow.css'")&&sw.includes("'./wintertraum-snow.js'"),"Snow effect must work offline");
assert.ok(snow.includes('winterParkVisible')&&snow.includes('dataset.park === "phantasialand"')&&snow.includes('dataset.season === "wintertraum"'),"Snowfall must only run in Phantasialand Wintertraum");
assert.ok(snow.includes('requestAnimationFrame')&&snow.includes("document.hidden"),"Snow animation must be driven by rAF and pause when invisible");
assert.ok(snow.includes('prefers-reduced-motion: reduce')&&snowCss.includes("prefers-reduced-motion:reduce"),"Respect reduced motion");
assert.ok(snowCss.includes("pointer-events:none")&&snowCss.includes('#winterSnowCanvas[hidden]'),"Snow canvas must not block controls");
assert.ok(snow.includes('Math.min(80, Math.max(18'),"Snow particles must remain bounded for mobile performance");
assert.ok(snow.includes("function createSnowSprite")&&snow.includes("createRadialGradient"),"Winter snow must have soft pre-rendered texture");
assert.ok(snow.includes('far: [createSnowSprite(8, "far")')&&snow.includes('near: [createSnowSprite(22, "near")'),"Snow must include multiple sprite variants in distance layers");
assert.ok(snow.includes("sprite: pickSnowSprite(layer)")&&snow.includes("ctx.drawImage(sprite"),"Snowfall must render textured sprites instead of flat circles");
assert.ok(!snow.includes("ctx.arc(flake.x, flake.y, flake.radius"),"Old flat-dot drawing should be gone");
assert.ok(snow.includes("Math.min(80, Math.max(18"),"Keep particle counts bounded");
assert.ok(snowCss.includes("opacity:.65;"),"Snow overlay must keep the stronger but restrained winter visibility");
assert.ok(snow.includes('naehen:wintertraum:snowfall'),"Snow switch preference must persist");
assert.ok(snow.includes('const winterDetailOpen')&&snow.includes('#rideSheet.show, #nightPlannerSheet.show'),
  "Winter detail and planner should keep snow falling");
assert.ok(snow.includes('modalBlocksSnow')&&snow.includes('.sheet.show:not(#rideSheet):not(#nightPlannerSheet)'),
  "Other modals must still pause snowfall");
assert.ok(snowCss.includes('#winterSnowCanvas[data-detail-overlay="true"]')&&snowCss.includes("z-index:35"),
  "Snow canvas must rise above sheets, but remain noninteractive");
console.log("PASS Wintertraum Atelier: original UX, original photos, component redesign, PWA and season isolation");
