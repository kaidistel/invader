"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=__dirname;const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,"koeln-deutz-herbstvolksfest-2026-config.js"),"utf8"),sandbox);
const mod=sandbox.window.NAEHEN_KOELN_DEUTZ_HERBST_2026;assert.ok(mod);
assert.equal(mod.park.kind,"fair");assert.equal(mod.park.slug,"koeln-deutz-herbstvolksfest-2026");
assert.equal(mod.park.startDate,"2026-10-24");assert.equal(mod.park.endDate,"2026-11-01");
assert.equal(mod.park.liveWaits,false);assert.equal(mod.park.specialMap,undefined);
assert.equal(mod.rides.length,15);assert.equal(new Set(Array.from(mod.rides,r=>r.id)).size,15);
assert.equal(mod.park.lineupStatus,"provisional");
for(const r of mod.rides){assert.ok(r.operator);assert.equal(r.priceEuro,null);assert.ok(mod.worlds[r.id]&&mod.fonts[r.id]);}
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
assert.ok(html.includes("koeln-deutz-herbstvolksfest-2026-config.js?v=125"));
assert.ok(app.includes("window.NAEHEN_KOELN_DEUTZ_HERBST_2026"));
assert.ok(sw.includes("naehen-v125")&&sw.includes("./koeln-deutz-herbstvolksfest-2026-config.js"));
console.log("PASS Köln Deutz autumn fair: 15 provisional attractions and PWA inclusion");
