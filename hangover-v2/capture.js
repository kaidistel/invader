import * as THREE from 'three';

// Capture the simulator scene without coupling the detail pass to app.js internals.
const originalAdd = THREE.Scene.prototype.add;
THREE.Scene.prototype.add = function (...objects) {
  window.__hangoverScene = this;
  return originalAdd.apply(this, objects);
};
