# Mystery Castle — Die Turmkontrolle

Independent fan simulation, statically hosted at `/invader/mystery-castle/`.

## Play

Power on → choose 2/4/6 lanes and program → board → close gates → close restraints → check each active gondola → clear area → dispatch. After the ride: open restraints → open gates → unload.

An emergency stop cancels the sequence, brakes over time and latches a fault. Release the emergency stop only after standstill, recover elevated cars to the station, then reset. This is a game model, not original control or safety software.

Four camera views, mouse/touch orbit, worklight toggle, optional synthesized audio, telemetry and session statistics. The simulation pauses in a hidden tab. WebGL failure yields an explicit schematic fallback. Three.js and OrbitControls use the existing local vendor files in `nightfly/vendor`; no CDN dependency.

## Facts and assumptions

- Official park description: 65 m building, 72 km/h advertised launch speed, von Windhoven theme.
- Published ride descriptions: six carriers of eight, 2/4/6-lane operation, pneumatic drive in both directions, three programs.
- Program I: full launch, driven descent, a rebound and return.
- Program II: launch/descent, first rebound, intermediate fall, additional rebound and return.
- Program III: half-height prelude, return, show pause, main launch/descent, rebound and return.
- The 48.6 m travel reference is from published technical summaries. Heights, trajectories and timing are approximations; all selected carriers run synchronously.
- Program durations are simulation values. No fixed real-world daily switching time is claimed.
- Geometry, laboratory apparatus, control panel, interlocks, pressure reserve, emergency braking and sounds are original interpretations. No original music or announcements are included.

Sources checked 2026-09-25:

- https://www.phantasialand.de/de/themenpark/einzigartige-attraktionen/mystery-castle/
- https://www.intamin.com/project/mystery-castle/
- https://frei-zeit-blog.de/phantasialand/attraktionen/mystery-castle/
- https://de.wikipedia.org/wiki/Mystery_Castle

## Development

Serve the repository root with `python -m http.server 8765`, then open `/mystery-castle/`.

`node --test mystery-castle/tests/engine.test.mjs`

The deterministic core is in `engine.mjs`; `scene.mjs` renders the physical state and `app.mjs` binds the UI. Unit coverage includes all nine program/lane combinations, station interlocks, occupancy, uninterrupted height changes, emergency braking, recovery and reset.
