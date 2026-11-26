"use strict";
/* Movie Park Christmas UX: snow reuses Wintertraum engine; Horrorwood only
 * disappears from the current queue list, not historical visit records. */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const read=name=>fs.readFileSync(path.join(__dirname,name),"utf8");
const app=read("app.js"),html=read("index.html");
const snow=read("wintertraum-snow.js"),snowCss=read("wintertraum-snow.css");
const movieCss=read("movie-christmas.css"),sw=read("sw.js");
const start=app.indexOf("  // Halloween Horror Festival content must never leak");
const end=app.indexOf("  // Christmas-specific attraction artwork",start);
assert.ok(start>0&&end>start,"Cannot isolate seasonal horror-maze exclusion");
const isMaze=new Function(app.slice(start,end)+"\nreturn movieChristmasHorrorMaze;")();
const mazes=[
 "Jason Universe","PHOBIA","Blood Moon Trailer Park","Ahoj Brause Horror Lab",
 "A Quiet Place","Hell House","Final Stop","Murder Museum",
 "Secrets of St. Elmo","The Slaughterhouse","Circus of Freaks","Unhallowed 2"
];
for(const maze of mazes){
 assert.ok(isMaze(maze,""),"Forgotten seasonal Halloween maze: "+maze);
 assert.ok(isMaze("",maze.toLowerCase().replaceAll(" ","-")),"Maze identifier not covered: "+maze);
}
for(const ride of ["Van Helsing's Factory","Ghost Chasers","The High Fall","Excalibur",
 "Movie Park Studio Tour","Journey to the Forbidden Chamber"]){
 assert.equal(isMaze(ride,""),false,"Do not accidentally remove permanent ride: "+ride);
}
assert.ok(app.includes('parkSlug === "movie-park-germany" && MOVIE_CHRISTMAS_ACTIVE &&') &&
 app.includes("movieChristmasHorrorMaze(normalizedName, normalizedId)") &&
 app.includes("if (isExcludedRide(raw.name, id, park.slug)) return null;") &&
 app.includes("!isExcludedRide(ride.name, ride.id, activeParkSlug)"),
 "Halloween mazes must be filtered in the Christmas live feed and displayed rides");
assert.ok(!/parkArchive\.filter\([^)]*movieChristmasHorrorMaze/.test(app),
 "Historical Halloween visit archives must remain untouched");

// The large Christmas promo must not occupy the ride list by default.
assert.match(html,/<details class="movieChristmasSection" id="movieChristmasSection"[^>]+hidden>/);
assert.match(html,/<summary class="mpcSummary">/);
assert.equal((html.match(/class="mpcFeature mpcFeature--/g)||[]).length,4,
 "Official Christmas show links must still be accessible on expand");
assert.ok(!html.includes('class="mpcSectionIntro"')&&!html.includes('class="mpcIntroMeta"') &&
 !html.includes('class="mpcFootnote"')&&!html.includes('class="mpcDisclaimer"'),
 "Long redundant info blocks must be removed");
assert.ok(movieCss.includes(".movieChristmasSection:not([open]) .mpcProgram{display:none!important}") &&
 movieCss.includes(".mpcSummary")&&movieCss.includes(".mpcQuickLinks"),
 "Program drawer should be compact and closed until requested");

const storage=new Map();
const body={dataset:{park:"movie-park-germany",season:"hollywood-christmas"},
  classList:{contains:()=>false}};
const canvas={hidden:true,dataset:{},width:0,height:0,
  getContext:()=>({clearRect(){},setTransform(){}})};
const appEl={classList:{contains:()=>false}};
const handlers={};
const button={hidden:true,disabled:false,title:"",
  setAttribute(name,val){this[name]=val},
  addEventListener(name,fn){handlers[name]=fn}};
const motion={matches:false,addEventListener(name,fn){handlers.motion=fn}};
const fakeDocument={
  body,hidden:false,
  getElementById(id){return {
    winterSnowCanvas:canvas,winterSnowToggle:button,app:appEl
  }[id]||null},
  querySelector(){return null},querySelectorAll(){return []},
  addEventListener(){},
};
const fakeWindow={
  innerWidth:390,innerHeight:800,devicePixelRatio:1,
  matchMedia(){return motion},
  addEventListener(){},
  requestAnimationFrame(){return 1},
  cancelAnimationFrame(){},
};
const localStorage={
  getItem(key){return storage.has(key)?storage.get(key):null},
  setItem(key,val){storage.set(key,val)}
};
const ctx={window:fakeWindow,document:fakeDocument,localStorage,
  MutationObserver:class{observe(){}},Math};
vm.runInNewContext(snow,ctx,{filename:"wintertraum-snow.js"});
const engine=fakeWindow.NAEHEN_WINTER_SNOW;
assert.ok(engine,"Shared snow engine must be available");
assert.equal(engine.getState().enabled,true,"Movie Park Christmas snow starts on");
assert.equal(engine.getState().running,true,"Movie Park Christmas snow starts animating");
assert.equal(canvas.hidden,false,"Canvas visible in Movie Park");
assert.equal(button.hidden,false,"Snow toggle visible in Movie Park");
assert.ok(handlers.click,"Button must toggle snow");
handlers.click();
assert.equal(engine.getState().enabled,false,"User can disable Movie Park snow");
assert.equal(storage.get("naehen:movie-christmas:snowfall"),"off",
 "Movie Park snowfall preference must save separately");
body.dataset.park="phantasialand";body.dataset.season="wintertraum";
engine.refresh();
assert.equal(engine.getState().enabled,true,
 "Turning off Movie Park snow must not switch off Phantasialand snowfall");
assert.equal(button.hidden,false);
body.dataset.park="movie-park-germany";body.dataset.season="hollywood-christmas";
engine.refresh();
assert.equal(engine.getState().enabled,false,"Movie Park preference must be restored");
handlers.click();
assert.equal(engine.getState().running,true,"Reenabled snowfall should resume");
motion.matches=true;handlers.motion();
assert.equal(engine.getState().running,false,
 "Reduced-motion preference must stop the animation");
assert.equal(button.disabled,true,"Reduced-motion setting is reflected in control");
motion.matches=false;handlers.motion();
body.dataset.park="europa-park";body.dataset.season="hallowinter";
engine.refresh();
assert.equal(canvas.hidden,true,"Snow must not appear in Europa-Park");
assert.equal(button.hidden,true,"Snow toggle must not appear in Europa-Park");
assert.ok(snowCss.includes('body[data-park="movie-park-germany"][data-season="hollywood-christmas"] #winterSnowCanvas') &&
 snowCss.includes("prefers-reduced-motion:reduce") &&
 snowCss.includes('body[data-park="phantasialand"][data-season="wintertraum"]'),
 "Snow CSS must style both winter parks without leaking to other parks");
assert.ok(sw.includes("naehen-v191") &&
 html.includes('wintertraum-snow.js?v=191') &&
 html.includes('wintertraum-snow.css?v=191') &&
 html.includes('movie-christmas.css?v=191'),
 "New snow design must be delivered through versioned PWA assets");
console.log("PASS Movie Park Christmas cleanup: snowfall toggles, separate preferences, reduced motion, Halloween maze filter, compact show rail, PWA v191");
