"use strict";
// Guard the Wintertraum visual experience without coupling other park skins.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=__dirname;
const read=name=>fs.readFileSync(path.join(root,name),"utf8");
const html=read("index.html"),app=read("app.js"),css=read("wintertraum-experience.css"),sw=read("sw.js");
const ids=["wtOverture","wtOvertureTitle","wtNightworlds","wtNightworldsTitle","nightPlanner","rides","wintertraumSection"];
for(const id of ids)assert.ok(html.includes('id="'+id+'"'),"Seasonal experience element missing: "+id);
const opening=html.match(/<section class="wtOverture"[^>]*>/)?.[0]||"";
const worlds=html.match(/<section class="wtNightworlds"[^>]*>/)?.[0]||"";
assert.ok(opening.includes("hidden")&&worlds.includes("hidden"),"Winter-only sections must start hidden outside Wintertraum");
assert.ok(app.includes('for (const seasonalId of ["wtOverture", "wtNightworlds", "wintertraumSection"])'),"Seasonal visibility must be controlled by park state");
assert.ok(app.includes("section.hidden = !isWinterExperience;"),"Non-Wintertraum parks must not display seasonal sections");
assert.ok(app.includes('$("#wtNightworlds")?.addEventListener("click"'),"Featured ride tiles must open real attraction details");
assert.ok(app.includes("openRideDetail(tile.dataset.winterDetail)"),"Tile event must route into existing detail view");
assert.ok(html.includes('data-winter-detail="taron"')&&html.includes('data-winter-detail="fly"'),"Both featured night rides must be usable");
assert.ok(html.includes('href="#nightPlanner"')&&html.includes('href="#rides"'),"Seasonal entrance must link into working park sections");
const showArea=html.indexOf('id="wintertraumSection"');
const rideArea=html.indexOf('id="rides"');
assert.ok(showArea>rideArea,"Shows must remain below the attraction list");
assert.ok(html.includes('wintertraum-experience.css?v=164'),"Design stylesheet must be versioned");
assert.ok(sw.includes("naehen-v164")&&sw.includes("'./wintertraum-experience.css'"),"New stylesheet must be cached with the app shell");
const cssRefs=[...css.matchAll(/url\(["']?(\.\/assets\/[^)'"]+)[)"']/g)].map(x=>x[1]);
for(const asset of cssRefs)assert.ok(fs.existsSync(path.join(root,asset)),"Missing original photo: "+asset);
for(const asset of ["wintertraum-berlin-original.jpg","wintertraum-taron-original.jpg","wintertraum-fly-original.jpg"]){
 const buf=fs.readFileSync(path.join(root,"assets",asset));
 assert.ok(buf.length>400000&&buf[0]===0xff&&buf[1]===0xd8,"Original JPEG missing or replaced: "+asset);
}
assert.ok(css.includes("prefers-reduced-motion:reduce"),"Reduced-motion support missing");
assert.ok(css.includes("@media(max-width:620px)")&&css.includes("@media(min-width:800px)"),"Mobile or desktop layout missing");
assert.ok(!css.includes("imagegen")&&!html.includes("winterliches_rookburgh"),"AI outputs must not replace originals");
assert.ok(css.includes('body[data-park="phantasialand"][data-season="wintertraum"]'),"Winter styling must be park-scoped");
assert.ok(html.indexOf('night-planner.css?v=164')<html.indexOf('wintertraum-experience.css?v=164'),"Seasonal CSS must override the planner base");
console.log("PASS Wintertraum: authentic photos, seasonal isolation, cinema header, real ride actions, responsive layout and cache");
