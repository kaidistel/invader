"use strict";
/* Movie Park Hollywood Christmas 2026/27 regression.
   Verify exact season range, preview, closures, UI wiring and offline delivery. */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const read=name=>fs.readFileSync(path.join(__dirname,name),"utf8");
const app=read("app.js"),html=read("index.html"),css=read("movie-christmas.css"),sw=read("sw.js");
const context={window:{}};
vm.runInNewContext(read("movie-park-config.js"),context,{filename:"movie-park-config.js"});
const park=context.window.NAEHEN_MOVIE_PARK;
assert.ok(park?.rides?.length>=32 && park?.worlds,"Movie Park's configured attractions missing");
const seasonCode=app.slice(app.indexOf("  // Holiday visuals begin 26 November"),app.indexOf("  const WINTERTRAUM_HERO"));
assert.ok(seasonCode.includes("MOVIE_CHRISTMAS_BREAK_IDS"),"Movie Park season constants missing");
const getState=new Function("WINTERTRAUM_DATE","location","activeParkSlug",seasonCode+
  "\nreturn {active:MOVIE_CHRISTMAS_ACTIVE,eventActive:MOVIE_CHRISTMAS_EVENT_ACTIVE,preview:MOVIE_CHRISTMAS_PREVIEW,closed:MOVIE_CHRISTMAS_BREAK_IDS,special:MOVIE_CHRISTMAS_SPECIAL_IDS,zone:movieChristmasZone,hero:MOVIE_CHRISTMAS_HERO};");
const season=(date,search="")=>getState(date,{search},"movie-park-germany");
assert.equal(season("2026-11-25").active,false,"Before Nov 26 Movie Park must have its regular theme");
assert.equal(season("2026-11-26").active,true,"Christmas design must show by default from Nov 26");
assert.equal(season("2026-11-26").eventActive,false,"Official event starts Nov 27, not Nov 26");
assert.equal(season("2026-11-27").active,true,"Winter visual season remains on Nov 27");
assert.equal(season("2026-11-27").eventActive,true,"Official winter availability begins Nov 27");
assert.equal(season("2027-01-05").active,true,"Winter season must include Jan 5");
assert.equal(season("2027-01-06").active,false,"Theme must switch off automatically");
assert.equal(season("2026-11-25","?christmas=1").active,true,"Out-of-season design preview still works");
assert.equal(season("2027-02-01","?christmas=1").preview,true,"Preview must be explicitly opted in");
assert.equal(season("2026-12-10").zone("The Old West"),"Wild West Christmas");
assert.equal(season("2026-12-10").zone("Streets of New York"),"Rockefeller Plaza");
assert.equal(season("2026-12-10").zone("nickelodeon LAND"),"Nickelodeon HoHoHoliday Land");
assert.equal(getState("2026-12-10",{search:""},"phantasialand").zone("The Old West"),"The Old West","Other parks must keep original zone");
const winterClosed=["iron-claw","nyc-transformer","crazy-surfer","area-51-top-secret",
"doras-big-river-adventure","stormy-cruise","spongebob-splash-bash"];
assert.equal(season("2026-12-10").closed.size,7);
for (const id of winterClosed) {
  assert.ok(season("2026-12-10").closed.has(id),"Official winter break missing "+id);
  assert.ok(park.rides.some(ride=>ride.id===id),"Missing ride to mark "+id);
}
assert.ok(!season("2026-12-10").closed.has("van-helsings-factory"),"Do not wrongly close an active attraction");
for(const id of ["movie-park-studio-tour","roxy-4d"])
  assert.ok(season("2026-12-10").special.has(id),"Christmas edition indicator missing "+id);
for (const text of [
  'document.body.dataset.season = "hollywood-christmas"', 'christmasSection.hidden',
  'MOVIE_CHRISTMAS_EVENT_ACTIVE && MOVIE_CHRISTMAS_BREAK_IDS.has(ride.id)',
  '"WINTERPAUSE"',
  'movieWinterBreak || (publicLive', 'movieChristmasZone(ride.zone, activeParkSlug)',
  'protocolSeasonForDay(day, parkSlug)', 'hollywood-christmas" : ""'
]) assert.ok(app.includes(text),"Season behavior missing: "+text);
assert.ok(html.includes('id="movieChristmasSection"') && html.includes('aria-labelledby="movieChristmasTitle"') &&
  html.includes('movie-christmas.css?v=189'),"Christmas spotlight and stylesheet must load");
assert.equal((html.match(/class="mpcFeature mpcFeature--/g)||[]).length,4,"Four real Christmas highlight posters");
assert.ok(html.includes("SHOWS")||html.includes("Show"),"Show destinations must be visible");
assert.ok(html.includes("HC26_Parkplan_Flyer_Web.pdf"),"Official 2026 winter map required");
assert.ok(html.includes('movieChristmasSection" aria-labelledby="movieChristmasTitle" hidden'),
  "Christmas highlights must remain hidden outside Movie Park");
assert.ok(css.includes('body[data-park="movie-park-germany"][data-season="hollywood-christmas"]'),
  "Complete seasonal styling must be scoped to Movie Park");
for(const token of [
  '#homeView>.hero','.mpcFeatures','.mpcFeature','#rides .ride','#rideSheet .sheetCard',
  '#parkArchiveList .archiveDayCard','.parkChoice[data-park="movie-park-germany"]',
  'data-winter-break="true"','@media(max-width:530px)','prefers-reduced-motion:reduce'
]) assert.ok(css.includes(token),"Incomplete holiday UI: "+token);
assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length,"CSS braces mismatched");
assert.ok(sw.includes("naehen-v189")&&sw.includes("'./movie-christmas.css'"),
  "The Christmas skin must ship with the service worker");
console.log("PASS Movie Park Christmas: dates, preview, 32 rides, 7 winter breaks, 4 shows, UI, PWA v189");
