"use strict";
const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const {execFileSync} = require("node:child_process");
const dir = __dirname;
for (const name of ["app.js","rheine-herbstkirmes-2026-config.js","salzbergen-herbstkirmes-2026-config.js"]) {
  execFileSync(process.execPath, ["--check", require("node:path").join(dir, name)]);
}
const context = {window:{}};
vm.runInNewContext(fs.readFileSync(require("node:path").join(dir,"rheine-herbstkirmes-2026-config.js"),"utf8"),context);
const mod=context.window.NAEHEN_RHEINE_HERBSTKIRMES_2026;
assert(mod && mod.park && mod.park.kind==="fair");
assert.equal(mod.rides.length,18);
assert.equal(mod.park.startDate,"2026-10-16");
assert.equal(mod.park.endDate,"2026-10-19");
assert.equal(mod.park.fairZones.length,2);
const byZone=Object.fromEntries(mod.park.fairZones.map(zone=>[zone,mod.rides.filter(ride=>ride.zone===zone)]));
assert.equal(byZone.Elisabethplatz.length,10);
assert.equal(byZone.Emstorplatz.length,8);
assert.equal(new Set(mod.rides.map(ride=>ride.id)).size,18);
assert(mod.rides.every(ride=>ride.id.startsWith("rheine26-")&&ride.priceEuro===null&&ride.operator));
assert(!mod.park.specialMap,"Unverified maps must not get fake click targets");
const html=fs.readFileSync(require("node:path").join(dir,"index.html"),"utf8");
assert(html.includes('id="fairZoneTabs"')&&html.includes("rheine-herbstkirmes-2026-config.js"));
const app=fs.readFileSync(require("node:path").join(dir,"app.js"),"utf8");
assert(app.includes("renderFairZoneTabs()")&&app.includes("activeFairZone === \"all\" || ride.zone === activeFairZone"));
assert(app.includes("NAEHEN_RHEINE_HERBSTKIRMES_2026"));
console.log("PASS: Rheine config syntax, 18 unique rides (10 Elisabethplatz, 8 Emstorplatz), manual prices, tabs and page wiring");
