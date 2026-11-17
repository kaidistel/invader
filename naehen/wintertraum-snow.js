/* NÄHEN Wintertraum — textured, layered, opt-in-controllable atmospheric snow.
   Six pre-rendered soft snow sprites, a single transparent canvas, no library.
   Automatically pauses when off-screen, hidden, in a modal or reduced motion. */
(() => {
  "use strict";

  const canvas = document.getElementById("winterSnowCanvas");
  const button = document.getElementById("winterSnowToggle");
  const app = document.getElementById("app");
  if (!canvas || !button || !app) return;

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const saveKey = "naehen:wintertraum:snowfall";
  let enabled = true;
  try { enabled = localStorage.getItem(saveKey) !== "off"; } catch (_) {}

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    button.hidden = true;
    return;
  }

  let flakes = [];
  let snowSprites = null;
  let width = 0;
  let height = 0;
  let density = 1;
  let raf = 0;
  let running = false;
  let last = 0;
  let drawnFrames = 0;
  let needsResize = true;

  const winterParkVisible = () =>
    document.body.dataset.park === "phantasialand" &&
    document.body.dataset.season === "wintertraum" &&
    !app.classList.contains("hidden");

  const modalOpen = () => document.body.classList.contains("modalOpen") ||
    !!document.querySelector(".sheet.show,.gate.show,.auth.show");

  const shouldAnimate = () => winterParkVisible() && enabled &&
    !motion.matches && !document.hidden && !modalOpen();

  const random = (min, max) => min + Math.random() * (max - min);

  /* Render small translucent snow textures only once. The visible core is
     softly irregular; far flakes are finer while near flakes have mild bokeh. */
  function createSnowSprite(coreSize, layer) {
    const sprite = document.createElement("canvas");
    const padding = Math.ceil(coreSize * .75);
    const full = coreSize + padding * 2;
    sprite.width = full;
    sprite.height = full;
    const g = sprite.getContext("2d");
    const center = full / 2;
    const radius = coreSize / 2;
    const halo = g.createRadialGradient(center, center, radius * .04,
      center, center, radius * 1.35);
    halo.addColorStop(0, "rgba(255,255,255,.98)");
    halo.addColorStop(.27, "rgba(247,252,255,.82)");
    halo.addColorStop(.60, "rgba(230,241,251,.35)");
    halo.addColorStop(1, "rgba(211,232,248,0)");

    g.fillStyle = halo;
    g.beginPath();
    g.arc(center, center, radius * 1.35, 0, Math.PI * 2);
    g.fill();

    // Few irregular highlights per texture, not hundreds of DOM particles.
    const dots = layer === "near" ? 7 : layer === "mid" ? 5 : 3;
    g.globalAlpha = layer === "far" ? .11 : .17;
    for (let i = 0; i < dots; i++) {
      const dx = random(-.45, .45) * radius;
      const dy = random(-.45, .45) * radius;
      const grain = radius * random(.09, .25);
      g.fillStyle = "rgba(255,255,255,.84)";
      g.beginPath();
      g.arc(center + dx, center + dy, grain, 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = 1;
    if (layer !== "far") {
      const core = g.createRadialGradient(center, center, 0,
        center, center, radius * .42);
      core.addColorStop(0, "rgba(255,255,255,.22)");
      core.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = core;
      g.beginPath();
      g.arc(center, center, radius * .42, 0, Math.PI * 2);
      g.fill();
    }
    return sprite;
  }

  function buildSnowSprites() {
    snowSprites = {
      far: [createSnowSprite(8, "far"), createSnowSprite(10, "far")],
      mid: [createSnowSprite(14, "mid"), createSnowSprite(16, "mid")],
      near: [createSnowSprite(22, "near"), createSnowSprite(26, "near")]
    };
  }

  function pickSnowSprite(layer) {
    const variants = snowSprites && snowSprites[layer];
    return variants ? variants[Math.floor(Math.random() * variants.length)] : null;
  }

  function makeFlake(enterFromTop = false) {
    const roll = Math.random();
    // Mostly distant flakes, with occasional softly out-of-focus foreground.
    const layer = roll < .56 ? "far" : roll < .92 ? "mid" : "near";
    const sizes = { far: [4.5, 8], mid: [8, 13], near: [13, 19] };
    const speeds = { far: [10, 18], mid: [16, 26], near: [23, 35] };
    const alphas = { far: [.18, .34], mid: [.34, .56], near: [.52, .78] };
    const sways = { far: [.4, 1.6], mid: [1, 3.1], near: [2, 5.4] };
    return {
      x: random(0, width),
      y: enterFromTop ? random(-height * .3, -3) : random(0, height),
      radius: random(...sizes[layer]),
      opacity: random(...alphas[layer]),
      fall: random(...speeds[layer]),
      sway: random(...sways[layer]),
      phase: random(0, Math.PI * 2),
      drift: layer === "far" ? random(-1.6, .8) :
        layer === "near" ? random(-3.2, 2) : random(-2.4, 1.4),
      layer,
      sprite: pickSnowSprite(layer)
    };
  }

  function resize() {
    const newWidth = Math.max(1, Math.round(window.innerWidth));
    const newHeight = Math.max(1, Math.round(window.innerHeight));
    const ratio = Math.min(1.6, window.devicePixelRatio || 1);
    const previousWidth = width || newWidth;
    const previousHeight = height || newHeight;

    width = newWidth;
    height = newHeight;
    density = ratio;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (!snowSprites) buildSnowSprites();

    // Around 27-30 flakes on a typical phone, max 80 on large desktop monitors.
    const count = Math.min(80, Math.max(18, Math.round((width * height) / 12500)));
    if (!flakes.length) {
      flakes = Array.from({ length: count }, () => makeFlake());
    } else {
      for (const flake of flakes) {
        flake.x = flake.x * width / previousWidth;
        flake.y = flake.y * height / previousHeight;
      }
      if (flakes.length > count) flakes.length = count;
      while (flakes.length < count) flakes.push(makeFlake());
    }
    needsResize = false;
  }

  function draw(time) {
    if (!running) return;
    if (!shouldAnimate()) { refresh(); return; }
    raf = window.requestAnimationFrame(draw);
    // Cap drawing at about 30fps; tab throttling cannot cause huge particle jumps.
    if (time - last < 32) return;
    const elapsed = last ? Math.min((time - last) / 1000, .06) : .033;
    last = time;
    if (needsResize) resize();
    ctx.clearRect(0, 0, width, height);

    for (const flake of flakes) {
      flake.y += flake.fall * elapsed;
      flake.x += (flake.drift + Math.sin(time / 2100 + flake.phase) * flake.sway) * elapsed;
      if (flake.y > height + 6) {
        flake.y = random(-20, -3);
        flake.x = random(0, width);
        flake.sprite = pickSnowSprite(flake.layer);
      }
      if (flake.x < -7) flake.x = width + 5;
      if (flake.x > width + 7) flake.x = -5;

      // Draw a cached textured sprite. No per-frame gradients or blur filters.
      const sprite = flake.sprite;
      if (sprite) {
        const scale = flake.layer === "far" ? 2.2 :
          flake.layer === "near" ? 2.7 : 2.4;
        const size = flake.radius * scale;
        ctx.globalAlpha = flake.opacity;
        ctx.drawImage(sprite, flake.x - size / 2, flake.y - size / 2, size, size);
        ctx.globalAlpha = 1;
      }
    }
    drawnFrames++;
  }

  function stop() {
    running = false;
    if (raf) window.cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
    canvas.hidden = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function refresh() {
    const visible = winterParkVisible();
    button.hidden = !visible;
    button.disabled = !!motion.matches;
    button.setAttribute("aria-pressed", String(visible && enabled && !motion.matches));
    button.setAttribute("aria-label", motion.matches
      ? "Schneefall deaktiviert: Bewegung reduzieren ist aktiv"
      : (enabled ? "Schneefall ausschalten" : "Schneefall einschalten"));
    button.title = motion.matches
      ? "Schneefall aus: Bewegung reduzieren"
      : (enabled ? "Schneefall ausschalten" : "Schneefall einschalten");
    if (!shouldAnimate()) {
      if (running || !canvas.hidden) stop();
      return;
    }
    canvas.hidden = false;
    if (!running) {
      running = true;
      needsResize = true;
      last = 0;
      raf = window.requestAnimationFrame(draw);
    }
  }

  button.addEventListener("click", () => {
    if (motion.matches) return;
    enabled = !enabled;
    try { localStorage.setItem(saveKey, enabled ? "on" : "off"); } catch (_) {}
    refresh();
  });
  window.addEventListener("resize", () => { needsResize = true; }, { passive: true });
  window.addEventListener("pagehide", stop);
  window.addEventListener("pageshow", refresh);
  document.addEventListener("visibilitychange", refresh, { passive: true });
  if (motion.addEventListener) motion.addEventListener("change", refresh);
  else if (motion.addListener) motion.addListener(refresh);

  const observer = new MutationObserver(refresh);
  observer.observe(document.body, { attributes: true, attributeFilter: ["data-park", "data-season", "class"] });
  observer.observe(app, { attributes: true, attributeFilter: ["class"] });
  document.querySelectorAll(".sheet,.gate,.auth").forEach(
    el => observer.observe(el, { attributes: true, attributeFilter: ["class"] })
  );

  window.NAEHEN_WINTER_SNOW = Object.freeze({
    refresh,
    getState: () => ({
      enabled, running, flakes: flakes.length, frames: drawnFrames, reducedMotion: motion.matches,
      spriteVariants: snowSprites ? 6 : 0,
      layers: { far: flakes.filter(f => f.layer === "far").length,
        mid: flakes.filter(f => f.layer === "mid").length,
        near: flakes.filter(f => f.layer === "near").length }
    })
  });
  refresh();
})();
