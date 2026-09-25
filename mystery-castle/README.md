# Mystery Castle — Turmkontrolle

Independent fan simulation, statically hosted at `/invader/mystery-castle/`.

## Concept

The simulator deliberately uses a RideSims-like 2D cutaway instead of a free 3D camera. The tower view shows six vertical carriers, guide rails, cable paths, upper/lower braking zones, station deck and a stylised machinery booth. The visual language is based on public photos of the real Mystery Castle station: stone walls, vertical technical hardware, pale bucket seats, dark restraints and strong blue work lighting.

## Play

Power on → select 2/4/6 active carriers and one of three reconstructed ride programs → board → close gates → close restraints → check each active carrier → clear the ride area → dispatch. After the ride: open restraints → open gates → unload.

Emergency stop cancels the current sequence, brakes the carriers and latches a fault. After standstill, release the emergency stop, recover elevated carriers to the station if necessary and reset.

## Facts and simulation assumptions

- Official park information: enclosed 65 m tower and advertised speed up to 72 km/h.
- Public technical descriptions: six carriers with eight seats each and pneumatic acceleration in both directions.
- Three publicly described ride sequences are represented as Program I (short), II (additional rebound) and III (half-height prelude, pause, main run).
- Public sources disagree on exact naming and operational use of the three programs. The simulator therefore does not claim original PLC program names, timings or operator procedures.
- 48.6 m is used as the game travel reference from published technical summaries. Motion curves, seconds, pressure reserve, interlocks, operator panel and emergency behaviour are simulation values.
- No original soundtrack, announcements, ride software or copyrighted photos are embedded.

Sources checked 2026-09-25:

- https://www.phantasialand.de/de/themenpark/einzigartige-attraktionen/mystery-castle/
- https://www.intamin.com/project/mystery-castle/
- https://de.wikipedia.org/wiki/Mystery_Castle

## Development

Serve the repository root with `python -m http.server 8765`, then open `/mystery-castle/`.

Run the deterministic engine tests with:

`node --test mystery-castle/tests/engine.test.mjs`

`engine.mjs` contains the simulation state machine and motion model. `app.mjs` renders the 2D SVG cutaway and binds the operator UI. The legacy `scene.mjs` is no longer loaded by the page.
