# Nightfly / Pegasus 16 — interactive ride controls

Static application for GitHub Pages at `/invader/nightfly/`. The repository's existing root page and Pages workflow remain unchanged.

## Controls

- Lift: loading/operating presets, plus a height slider. Drives unlock near full operating height.
- Main arm: oscillation with adjustable amplitude and speed.
- Gondola carrier: continuous reversible rotation, −12 to +12 rpm.
- Four gondolas: independent pendulum hinges; collective brake and individual brake buttons. Braking retains the current relative angle rather than snapping upright.
- Loading preset: stop and centre the drives, align gondolas, apply brakes, then lower the lift.
- Pause, reset, camera presets and corrected GLB download.

The parked rotor and all four gondola axles are level: all hinge origins have Z = 2.37 m and all hinge directions have Z = 0. The articulated model has separate static, lift, rotor, carrier and four seat-row groups. Hydraulic endpoints follow the lift.

## Implementation

Plain HTML/CSS/ES modules; vendored Three.js 0.180.0 (MIT license in `vendor/LICENSE`). No build step or external CDN dependency. Modern browser with WebGL and DecompressionStream support required.

The indexed mesh data and standalone corrected GLB are gzip-compressed at rest. They are decompressed in the browser. Artwork textures come from user-provided reference images. The geometry is a simplified visual reconstruction, not manufacturer CAD. The free-gondola simulation uses fixed 1/120-second integration with gravity, support acceleration, carrier angular velocity/acceleration, damping and braking. It is not a validated engineering dynamics model. The loading sequence uses an automatic alignment servo.

To regenerate geometry: `python tools/build_model.py` (numpy, Pillow, matplotlib, scipy; DejaVu Sans).
To check dynamics: `node tools/check_physics.mjs`.

Source references: user-provided technical drawing and Nightfly photographs; https://www.technicalpark.com/amusement-rides/pegasus-16/
