"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict"),path=require("node:path"),cp=require("node:child_process");
const root=__dirname;
for(const name of ["app.js","muenster-herbstsend-2026-config.js"]){cp.execFileSync(process.execPath,["--check",path.join(root,name)]);}
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,"muenster-herbstsend-2026-config.js"),"utf8"),sandbox);
const event=sandbox.window.NAEHEN_MUENSTER_HERBSTSEND_2026;
assert.ok(event&&event.park.kind==="fair");
assert.equal(event.park.startDate,"2026-10-24");
assert.equal(event.park.endDate,"2026-11-01");
assert.equal(event.park.specialMap,undefined,"No map in this module");
assert.equal(event.park.liveWaits,false);
assert.equal(event.park.supportsPostedWait,false);
assert.equal(event.park.lineupStatus,"provisional","Lineup may grow later");
const expected=[
 ["Highway No. 1","Schneider"],["Formel 1","Heitmann"],["Disco Jet","Heitmann"],["Break Dance","Bruch"],
 ["Airborne","Ordelman"],["Hangover The Ride","Richter"],["Kanurah","Vallentgoed"],["MayDay – The Ultimate Thrill","Horlbeck/Meyer"],
 ["Nightfly","Boers"],["Wellenflug","Fahrenschon"],["Wonderwheel","Klemm"],["Magic House","Hinrichs"],
 ["Crystals City","Oberschelp"],["Diablos Residenz","Hoefnagels"],["Spinning Mouse","Boos"],["Bugs & Bees","Kaiser"]
];
assert.equal(event.rides.length,16);
assert.equal(new Set(Array.from(event.rides,r=>r.id)).size,16);
assert.equal(new Set(Object.values(event.fonts).map(f=>f.fontFamily)).size,16,"Distinct fonts for all rides");
event.rides.forEach((r,i)=>{
 assert.equal(r.name,expected[i][0]);assert.equal(r.operator,expected[i][1]);assert.equal(r.priceEuro,null);
 assert.ok(r.id.startsWith("muenster-herbstsend26-"));
 assert.ok(r.imageUrl&&r.imageCredit&&(r.imageSourceUrl||r.imageUrl.startsWith('./assets/')),"Missing art metadata for "+r.name);
 assert.ok(event.worlds[r.id]&&event.fonts[r.id]&&event.rideConfig[r.id],"Missing detail config for "+r.name);
});
assert.ok(event.rides.find(r=>r.id.endsWith("-nightfly")).description.includes("Boers"));
assert.ok(event.rides.find(r=>r.id.endsWith("-hangover-the-ride")).description.includes("Richters"));
assert.equal(event.rides.find(r=>r.id.endsWith("-mayday")).imageUrl,"./assets/mayday-the-ultimate-thrill.webp");
assert.ok(fs.existsSync(path.join(root,"assets/mayday-the-ultimate-thrill.webp")));
assert.ok(event.park.cardImage.includes("send-in-muenster"));
assert.ok(event.park.cardCopy.includes("16 bislang"));
assert.ok(event.park.disclaimer.includes("vorläufig"));
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
assert.ok(html.includes("muenster-herbstsend-2026-config.js?v=124"));
assert.ok(app.includes("NAEHEN_MUENSTER_HERBSTSEND_2026"));
assert.ok(sw.includes("naehen-v124")&&sw.includes("./muenster-herbstsend-2026-config.js"));
console.log("PASS Münster Herbstsend: 16 named rides, operators, distinct art, no map, provisional lineup and PWA integration");
