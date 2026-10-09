"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict"),path=require("node:path"),cp=require("node:child_process");
for(const name of ["app.js","muenster-herbstsend-2026-config.js"]){cp.execFileSync(process.execPath,["--check",path.join(__dirname,name)]);}
const w={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,"muenster-herbstsend-2026-config.js"),"utf8"),w);
const c=w.window.NAEHEN_MUENSTER_HERBSTSEND_2026;
assert(c&&c.park.kind==="fair");assert.equal(c.rides.length,5);
assert.equal(c.park.startDate,"2026-10-24");assert.equal(c.park.endDate,"2026-11-01");
assert.equal(c.park.specialMap,undefined);
assert.deepEqual(Array.from(c.rides,x=>x.name),["Mayday","Airborne","Kanurah","Break Dance","Disco Jet"]);
assert.equal(new Set(c.rides.map(x=>x.id)).size,5);
assert(c.rides.every(x=>x.imageUrl&&x.imageCredit&&x.imageSourceUrl), "all five rides must have attributable image URLs");
for(const x of c.rides){assert.equal(x.priceEuro,null);assert(x.id.startsWith("muenster-herbstsend26-"));assert(x.operator);assert(c.worlds[x.id]);}
const h=fs.readFileSync(path.join(__dirname,"index.html"),"utf8");
const a=fs.readFileSync(path.join(__dirname,"app.js"),"utf8");
const sw=fs.readFileSync(path.join(__dirname,"sw.js"),"utf8");
assert(h.includes("muenster-herbstsend-2026-config.js"));
assert(a.includes("NAEHEN_MUENSTER_HERBSTSEND_2026"));
assert(sw.includes("muenster-herbstsend-2026-config.js"));
console.log("PASS: Münster Herbstsend 2026, no map, exactly five unique rides, prices blank, event and PWA integration");
