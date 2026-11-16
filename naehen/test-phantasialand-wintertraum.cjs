// Run: node naehen/test-phantasialand-wintertraum.cjs
// Regression checks for the seasonal park card, show ordering and visit recording.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = __dirname;
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");

new Function(app);
const build = html.match(/app[.]js[?]v=([0-9]+)/)?.[1];
assert.ok(build, "Versioned app shell needed");
assert.ok(sw.includes("naehen-v" + build), "PWA cache must match shipped app");
assert.ok(html.includes("styles.css?v=" + build), "CSS version must match app");
assert.ok(app.includes('WINTERTRAUM_DATE >= "2026-11-14"'));
assert.ok(app.includes('WINTERTRAUM_DATE <= "2027-01-24"'));
assert.ok(app.includes('timeZone: "Europe/Berlin"'));

const ridesIndex = html.indexOf('id="rides"');
const showsIndex = html.indexOf('id="wintertraumSection"');
const disclaimerIndex = html.indexOf('id="parkDisclaimer"');
assert.ok(ridesIndex > 0 && showsIndex > ridesIndex && disclaimerIndex > showsIndex,
  "Shows must render below all ride cards and before the disclaimer");
const ids = [...html.matchAll(/data-record-winter-show="([^"]+)"/g)].map(match => match[1]);
assert.deepEqual(ids, ["kaiserplatz-illumination","tiempo-de-fuego","pulse-of-rookburgh","magic-symphony"]);
assert.equal(new Set(ids).size, 4, "Four distinct outdoor shows");
assert.ok(app.includes("wintershow-"), "Persisted show ID must differ from ride ID");
assert.ok(app.includes('type: "regular"'), "Show session must satisfy existing queue_type constraint");
assert.ok(app.includes("saveFinishedToCloud(session, currentUserId())"));
assert.ok(app.includes("renderWinterShowStatus()"), "Dynamic show and combined counters");
assert.ok(app.includes('isShowSession(session) ? "✨ Show gesehen"'), "Show entries must be distinct in log");
assert.ok(app.includes('fact.experiences + "×", "Erlebnisse gesamt"'),
  "Daily recap must include Rides + Shows combined");
assert.ok(app.includes('fact.shows ? fact.shows + "×" : fact.uniqueRides'),
  "Archived days must show correct show count");
assert.ok(app.includes('!isShowSession(session)') && app.includes('!isShowSession(item)'),
  "Ride-only metrics must not count show entries");
assert.ok(css.includes("inset:auto!important;left:auto!important;bottom:auto!important;"),
  "Winter picker badge must not cover the entire park card");
assert.ok(css.includes(".wintertraumRecordBtn") && css.includes(".wintertraumShowScore"));
const iceImage = fs.readFileSync(path.join(root, "assets/berliner-eislaufen-original.jpg"));
assert.ok(iceImage.length > 100000 && iceImage[0] === 0xff && iceImage[1] === 0xd8, "Official Berliner Eislaufen photo must be an actual committed JPEG");
assert.ok(app.includes('"berliner-eislaufen": "./assets/berliner-eislaufen-original.jpg"'), "Seasonal ice rink photo mapping missing");
assert.ok(app.includes('{ id: "berliner-eislaufen", name: "Berliner Eislaufen", zone: "Berlin" }'), "Berliner Eislaufen must be listed as seasonal experience");
assert.ok(app.includes('ice[\\s-]*skate'), "Ice Skate Hire rental listing must remain excluded");
console.log("PASS Phantasialand Wintertraum: four recordable bottom shows, tracked visits, count, archive, overlays, version");
