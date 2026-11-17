/* NÄHEN Wintertraum — light, opt-in-controllable atmospheric snow.
   Single transparent canvas, no library, no DOM elements per snowflake.
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

  function makeFlake(enterFromTop = false) {
    const size = random(.8, 2.45);
    return {
      x: random(0, width), y: enterFromTop ? random(-height * .3, -3) : random(0, height),
      radius: size, opacity: random(.24, .66), fall: random(13, 31) * (2.2 / (size + .7)),
      sway: random(.7, 5), phase: random(0, Math.PI * 2), drift: random(-2.5, 1.5)
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

    // ~22 flakes on a typical phone, max 68 on large desktop monitors.
    const count = Math.min(68, Math.max(16, Math.round((width * height) / 15000)));
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
      }
      if (flake.x < -7) flake.x = width + 5;
      if (flake.x > width + 7) flake.x = -5;

      ctx.beginPath();
      ctx.fillStyle = "rgba(241,249,255," + flake.opacity.toFixed(2) + ")";
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      ctx.fill();
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
    getState: () => ({ enabled, running, flakes: flakes.length, frames: drawnFrames, reducedMotion: motion.matches })
  });
  refresh();
})();
