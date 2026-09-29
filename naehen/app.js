(() => {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const cfg = window.NAEHEN_CONFIG || {};
  const LIVE_DATA_URL = "./live.json";
  const LIVE_REFRESH_MS = 5 * 60 * 1000;
  const SR_FRESH_MINUTES = 30;
  const SR_VISIBLE_MINUTES = 60;
  const EXCLUDED_RIDE_IDS = new Set(["berliner-einlauten","berliner-einlaufen","berliner-einlauf"]);

  function isExcludedRide(name, id) {
    const normalizedName = String(name || "").toLowerCase().trim();
    const normalizedId = String(id || "");
    return EXCLUDED_RIDE_IDS.has(normalizedId) || /^berliner\s+einl/i.test(normalizedName);
  }

  const store = {
    get(key, fallback) {
      try {
        const value = JSON.parse(localStorage.getItem(key));
        return value === null || value === undefined ? fallback : value;
      } catch (_) {
        return fallback;
      }
    },
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
      localStorage.removeItem(key);
    }
  };

  const RIDE_CONFIG = {
    "taron": { singleRider: true },
    "raik": { singleRider: true },
    "fly": { singleRider: false },
    "black-mamba": { singleRider: false },
    "mystery-castle": { singleRider: false },
    "chiapas": { singleRider: false },
    "colorado-adventure": { singleRider: false },
    "talocan": { singleRider: false },
    "river-quest": { singleRider: false },
    "winjas-fear": { singleRider: false }, "winjas-force": { singleRider: false },
    "geister-rikscha": { singleRider: false }, "maus-au-chocolat": { singleRider: false },
    "crazy-bats": { singleRider: false }, "die-3-mausketiere": { singleRider: false },
    "deep-in-africa-adventure-trail": { singleRider: false }, "das-verrueckte-hotel-tartueff": { singleRider: false }
  };

  const FALLBACK_RIDES = [
    { id: "taron", name: "Taron", zone: "Mystery" },
    { id: "fly", name: "F.L.Y.", zone: "Rookburgh" },
    { id: "black-mamba", name: "Black Mamba", zone: "Deep in Africa" },
    { id: "mystery-castle", name: "Mystery Castle", zone: "Mystery" },
    { id: "chiapas", name: "Chiapas – DIE Wasserbahn", zone: "Mexico" },
    { id: "colorado-adventure", name: "Colorado Adventure", zone: "Mexico" },
    { id: "talocan", name: "Talocan", zone: "Mexico" },
    { id: "river-quest", name: "River Quest", zone: "Mystery" },
    { id: "raik", name: "Raik", zone: "Mystery" },
    { id: "winjas-fear", name: "Winja’s Fear", zone: "Fantasy" },
    { id: "winjas-force", name: "Winja’s Force", zone: "Fantasy" },
    { id: "geister-rikscha", name: "Geister Rikscha", zone: "China Town" },
    { id: "maus-au-chocolat", name: "Maus au Chocolat", zone: "Berlin" },
    { id: "crazy-bats", name: "Crazy Bats", zone: "Fantasy" },
    { id: "die-3-mausketiere", name: "Die 3 Mausketiere", zone: "Berlin" },
    { id: "deep-in-africa-adventure-trail", name: "Deep in Africa – Adventure Trail", zone: "Deep in Africa" },
    { id: "das-verrueckte-hotel-tartueff", name: "Das verrückte Hotel Tartüff", zone: "Berlin" }
  ].map((ride) => enrichRide(Object.assign({}, ride, {
    wait: null,
    isOpen: null,
    trend: "flat",
    delta: 0,
    source: "fallback",
    lastUpdated: null
  })));

  let deferredInstall = null;
  let supa = null;
  let user = null;
  let localMode = false;
  let authMode = "login";
  let rides = FALLBACK_RIDES.slice();
  let rideSearch = "";
  let onlyFavorites = false;
  let lastSheetFocus = null;
  const WORLD = {
    taron: {label:"KLUGHEIM · DER PULS", line:"Zwischen Basalt und glühendem Stahl.", art:"taron"},
    "river-quest": {label:"MYSTERY · WASSERWEG", line:"Die Burg verschluckt den Fluss.", art:"river-quest"},
    fly: {label:"ROOKBURGH · FLUGJOURNAL", line:"Die Flugmaschine ist bereit.", art:"fly"},
    "black-mamba": {label:"DEEP IN AFRICA · DSCHUNGEL", line:"Die Schlange erwacht im Fels.", art:"black-mamba"},
    chiapas: {label:"MEXICO · WASSERFÄLLE", line:"Der Fluss führt durch den Fels.", art:"chiapas"},
    talocan: {label:"MEXICO · FEUER & WASSER", line:"Im Bann der Elemente.", art:"talocan"},
    "mystery-castle": {label:"MYSTERY · DER TURM", line:"Ein Schritt durch das Burgtor.", art:"mystery-castle"},
    "winjas-fear": {label:"WUZE TOWN · FEAR", line:"Der Pfad der Winjas beginnt.", art:"winjas"},
    "winjas-force": {label:"WUZE TOWN · FORCE", line:"Die Kräfte der Wuze rufen.", art:"winjas"},
    "geister-rikscha": {label:"CHINA TOWN · UNTER DER ERDE", line:"Die Laternen weisen den Weg.", art:"geister-rikscha"},
    "colorado-adventure": {label:"MEXICO · EISENBAHN", line:"Die Lokomotive rollt durch den Canyon.", art:"colorado-adventure"},
    raik: {label:"KLUGHEIM · HIN UND ZURÜCK", line:"Ein Zug durch die dunklen Canyons.", art:"raik"},
    "maus-au-chocolat": {label:"BERLIN · KONDITOREI", line:"In der Backstube ist etwas los.", art:"maus-au-chocolat"},
    "crazy-bats": {label:"FANTASY · VR MISSION", line:"Die Fledermäuse übernehmen.", art:"crazy-bats"},
    "die-3-mausketiere": {label:"BERLIN · 4D ABENTEUER", line:"Drei Helden. Eine Mission.", art:"die-3-mausketiere"},
    "deep-in-africa-adventure-trail": {label:"DEEP IN AFRICA · WANDERKARTE", line:"Der Weg führt durch den Dschungel.", art:"deep-in-africa-adventure-trail"},
    "das-verrueckte-hotel-tartueff": {label:"BERLIN · HOTEL TARTÜFF", line:"Willkommen. Der Boden trügt.", art:"das-verrueckte-hotel-tartueff"},

    "wavy-battle": {
      label:"FANTASY · TAL DER WUZE",
      line:"An die Wasserspritzer, fertig, los.",
      artUrl:"https://static.phlcdn.de/files/uploads/themenpark/images/sommer/fantasy/fantasy-phenie-2025/wavy/fh-wavy_02.jpg"
    },
    "avoras": {
      label:"FANTASY · TAL DER WUZE",
      line:"Dem Himmel über dem Wuze Tal entgegen.",
      artUrl:"https://static.phlcdn.de/files/uploads/themenpark/images/sommer/fantasy/avoras/fh-avoras_01.jpg"
    },
    "wellenflug": {
      label:"BERLIN · KAISERPLATZ",
      line:"Über den Fontänen des goldenen Berlin.",
      artUrl:"https://static.phlcdn.de/files/uploads/themenpark/images/sommer/berlin/wellenflug/fh_wellenflug_04.jpg"
    },
    "pferdekarussell": {
      label:"BERLIN · KAISERPLATZ",
      line:"Eine klassische Runde durch das goldene Berlin.",
      artUrl:"https://static.phlcdn.de/files/uploads/themenpark/images/sommer/berlin/pferdekarussell/ga_pferdekarussell_02.jpg"
    },
    "tikal": {
      label:"MEXICO · COLORADO MOUNTAINS",
      line:"Kupferrote Türme und eine Portion Bauchkribbeln.",
      artUrl:"https://static.phlcdn.de/files/uploads/themenpark/images/sommer/mexico/tikal/fh-tikal_01.jpg"
    },
    "moptis-monkey-depot": {
      label:"DEEP IN AFRICA · MONKEY DEPOT",
      line:"Klettern, kraxeln und Afrika entdecken.",
      artUrl:"https://static.phlcdn.de/files/uploads/themenpark/images/sommer/deep-in-africa/mopti/fh_mopti_01.jpg"
    },
    "wuermling-express": {
      label:"FANTASY · WUZE TAL",
      line:"Hoch über dem Mondsee unterwegs.",
      artUrl:"https://static.phlcdn.de/files/uploads/themenpark/images/sommer/fantasy/wuermling-express/ga-wuermling-express_02.jpg"
    },
    "wakobato": {
      label:"FANTASY · MONDSEE",
      line:"Patrouillenfahrt durch Schilf und Wasser.",
      artUrl:"https://static.phlcdn.de/files/uploads/themenpark/images/sommer/fantasy/wakobato/ga-wakobato_01.jpg"
    },
    "wirtls-taubenturm": {
      label:"FANTASY · WUZE TAL",
      line:"Aus eigener Kraft hoch hinaus.",
      artUrl:"https://static.phlcdn.de/files/uploads/themenpark/images/sommer/fantasy/wirtls-taubenturm/ga-wirtls-taubenturm_02.jpg"
    },
    "woezls-wassertreter": {
      label:"FANTASY · MONDSEE",
      line:"Mit Muskelkraft über den Mondsee.",
      artUrl:"https://static.phlcdn.de/files/uploads/themenpark/images/sommer/fantasy/woezls-wassertreter/ga-woezls-wassertreter_02.jpg"
    },
    "tittle-tattle-tree": {
      label:"FANTASY · WUZE TOWN",
      line:"Schwerelos im Reich der Wuze.",
      artUrl:"https://static.phlcdn.de/files/uploads/themenpark/images/sommer/fantasy/tittle-tattle-tree/ga-tittle-tattle-tree_03.jpg"
    },
    "feng-ju-palace": {
      label:"CHINA TOWN · PALAST",
      line:"Wenn Gut und Böse die Welt auf den Kopf stellen.",
      artUrl:"https://static.phlcdn.de/files/uploads/themenpark/images/sommer/china-town/feng-ju-palace/fh-feng-ju-palace_01.jpg"
    },
    "winni-splash": {
      label:"FANTASY · TAL DER WUZE",
      line:"Kurbeln, spritzen und staunen.",
      artUrl:"https://static.phlcdn.de/files/uploads/themenpark/images/sommer/fantasy/fantasy-phenie-2025/winni/fh-winni_02.jpg"
    },
    "wolkes-luftpost": {
      label:"FANTASY · WUZE TOWN",
      line:"Ab geht die Post über den Dächern der Wuze.",
      artUrl:"https://static.phlcdn.de/files/uploads/themenpark/images/sommer/fantasy/wolkes-luftpost/2025/ga-wolkes-luftpost-2025_01.jpg"
    },
    "bolles-flugschule": {
      label:"BERLIN · FLUGSCHULE",
      line:"Mit Flugzeug und Zeppelin über Berlin.",
      artUrl:"https://static.phlcdn.de/files/uploads/themenpark/images/sommer/berlin/bolles-flugschule/fh-bolles-flugschule.jpg"
    },
    "die-froehliche-bienchenjagd": {
      label:"FANTASY · KINDERLAND",
      line:"Eine fröhliche Jagd durch die Wuze-Welt.",
      artUrl:"https://static.phlcdn.de/files/uploads/themenpark/images/sommer/fantasy/die-froehliche-bienchenjagd/fh_froehliche-bienchenjagd_01.jpg"
    },
    "der-lustige-papagei": {
      label:"FANTASY · KINDERLAND",
      line:"Bunter Flugspaß für kleine Abenteurer.",
      artUrl:"https://static.phlcdn.de/files/uploads/themenpark/images/sommer/fantasy/der-lustige-papagei/fh-der-lustige-papagei-2020_01.jpg"
    },
    "bolles-riesenrad": {
      label:"BERLIN · KAISERPLATZ",
      line:"Ein kleiner Höhenflug im goldenen Berlin.",
      artUrl:"https://static.phlcdn.de/files/uploads/themenpark/images/sommer/berlin/bolles-riesenrad/fh-bolles-riesenrad_01.jpg"
    },
    "bumper-klumpen": {
      label:"FANTASY · WUZE TOWN",
      line:"Kunterbunter Fahrspaß mit den Klumpen.",
      artUrl:"https://static.phlcdn.de/files/uploads/themenpark/images/sommer/fantasy/bumper-klumpen/fh-bumper-klumpen_01.jpg"
    },
    "woezls-duck-washer": {
      label:"FANTASY · WUZE TOWN",
      line:"Die Entenwäsche der Wuze ist eröffnet.",
      artUrl:"https://static.phlcdn.de/files/uploads/themenpark/images/sommer/fantasy/woezls-duck-washer/fh-woezls-duck-washer_01.jpg"
    },
    "wupis-wabi-wipper": {
      label:"FANTASY · WUZE TOWN",
      line:"Wippen, wirbeln und Wuze-Chaos.",
      artUrl:"https://static.phlcdn.de/files/uploads/themenpark/images/sommer/fantasy/wupis-wabi-wipper/fh-wupis-wabi-wipper_01.jpg"
    }
  };

  const ATTRACTION_FONTS = {
    "taron": { fontFamily: "'Germania One', serif", theme: "klugheim" },
    "fly": { fontFamily: "'Steampunk Machinery Font', 'Steampunk Machinery', 'Stardos Stencil', 'Barlow Condensed', sans-serif", theme: "rookburgh" },
    "black-mamba": { fontFamily: "'African', 'Staatliches', serif", theme: "african" },
    "mystery-castle": { fontFamily: "'Old London', 'UnifrakturCook', serif", theme: "gothic-castle" },
    "river-quest": { fontFamily: "'IM Fell English SC', serif", theme: "medieval" },
    "chiapas": { fontFamily: "'Sancreek', serif", theme: "mexican-adventure" },
    "colorado-adventure": { fontFamily: "'Rye', serif", theme: "western-goldrush" },
    "talocan": { fontFamily: "'Caesar Dressing', serif", theme: "mesoamerican-temple" },
    "raik": { fontFamily: "'Almendra SC', serif", theme: "klugheim-medieval" },
    "winjas-fear": { fontFamily: "'Macondo', serif", theme: "wuze-dark-fantasy" },
    "winjas-force": { fontFamily: "'Grenze Gotisch', serif", theme: "wuze-dark-power" },
    "geister-rikscha": { fontFamily: "'Gang of Three', 'ZCOOL XiaoWei', sans-serif", theme: "chinese-ghost" },
    "maus-au-chocolat": { fontFamily: "'Emilys Candy', serif", theme: "patisserie" },
    "crazy-bats": { fontFamily: "'Creepster', cursive", theme: "cartoon-horror" },
    "die-3-mausketiere": { fontFamily: "'Almendra Display', serif", theme: "french-musketeer" },
    "deep-in-africa-adventure-trail": { fontFamily: "'Trade Winds', sans-serif", theme: "african-expedition" },
    "das-verrueckte-hotel-tartueff": { fontFamily: "'Fredericka the Great', serif", theme: "eccentric-hotel" },

    "wavy-battle": { fontFamily: "'Bungee Spice', sans-serif", theme: "wuze-water-battle" },
    "avoras": { fontFamily: "'Macondo Swash Caps', serif", theme: "wuze-organic-fantasy" },
    "wellenflug": { fontFamily: "'Limelight', sans-serif", theme: "berlin-1920s" },
    "pferdekarussell": { fontFamily: "'Poiret One', sans-serif", theme: "berlin-belle-epoque" },
    "tikal": { fontFamily: "'Sancreek', serif", theme: "expedition" },
    "moptis-monkey-depot": { fontFamily: "'Ribeye', serif", theme: "african-cartoon" },
    "wuermling-express": { fontFamily: "'Henny Penny', serif", theme: "wuze-fantasy" },
    "wakobato": { fontFamily: "'Macondo', serif", theme: "wuze-water-fantasy" },
    "wirtls-taubenturm": { fontFamily: "'Mystery Quest', serif", theme: "wuze-mystery" },
    "woezls-wassertreter": { fontFamily: "'Ribeye Marrow', serif", theme: "wuze-water" },
    "tittle-tattle-tree": { fontFamily: "'Flavors', serif", theme: "wuze-fantasy" },
    "feng-ju-palace": { fontFamily: "'ZCOOL XiaoWei', serif", theme: "chinese-palace" },
    "winni-splash": { fontFamily: "'Jolly Lodger', serif", theme: "wuze-water" },
    "wolkes-luftpost": { fontFamily: "'Henny Penny', serif", theme: "wuze-airmail" },
    "bolles-flugschule": { fontFamily: "'Special Elite', monospace", theme: "berlin-aviation" },
    "die-froehliche-bienchenjagd": { fontFamily: "'Chela One', sans-serif", theme: "wuze-kids" },
    "der-lustige-papagei": { fontFamily: "'Ribeye', serif", theme: "tropical-cartoon" },
    "bolles-riesenrad": { fontFamily: "'Fascinate Inline', sans-serif", theme: "vintage-fairground" },
    "bumper-klumpen": { fontFamily: "'Luckiest Guy', sans-serif", theme: "comic-bumpercars" },
    "woezls-duck-washer": { fontFamily: "'Freckle Face', sans-serif", theme: "wuze-comic" },
    "wupis-wabi-wipper": { fontFamily: "'Kablammo', sans-serif", theme: "wuze-chaotic" }
  };

  const RIDE_ALIASES = {
    "winja‘s fear":"winjas-fear", "winja‘s force":"winjas-force",
    "winja’s fear":"winjas-fear", "winja’s force":"winjas-force",
    "winja's fear":"winjas-fear", "winja's force":"winjas-force",
    "deep in africa – adventure trail":"deep-in-africa-adventure-trail",
    "das verrückte hotel tartüff":"das-verrueckte-hotel-tartueff",
    "die 3 mausketiere":"die-3-mausketiere",
    "mopti's monkey depot":"moptis-monkey-depot", "mopti’s monkey depot":"moptis-monkey-depot", "mopti‘s monkey depot":"moptis-monkey-depot",
    "würmling express":"wuermling-express",
    "wirtl's taubenturm":"wirtls-taubenturm", "wirtl’s taubenturm":"wirtls-taubenturm", "wirtl‘s taubenturm":"wirtls-taubenturm",
    "wözl's wassertreter":"woezls-wassertreter", "wözl’s wassertreter":"woezls-wassertreter", "wözl‘s wassertreter":"woezls-wassertreter",
    "wolke's luftpost":"wolkes-luftpost", "wolke’s luftpost":"wolkes-luftpost", "wolke‘s luftpost":"wolkes-luftpost",
    "die fröhliche bienchenjagd":"die-froehliche-bienchenjagd",
    "wözl's duck washer":"woezls-duck-washer", "wözl’s duck washer":"woezls-duck-washer", "wözl‘s duck washer":"woezls-duck-washer",
    "wupi's wabi wipper":"wupis-wabi-wipper", "wupi’s wabi wipper":"wupis-wabi-wipper", "wupi‘s wabi wipper":"wupis-wabi-wipper"
  };
  let selectedRide = null;
  let selectedDetailRide = null;
  let queueType = "regular";
  let parkDay = store.get("naehen:parkDay", null);
  let sessions = store.get("naehen:sessions", []);
  let active = store.get("naehen:active", null);
  let favorites = store.get("naehen:favorites", ["taron", "fly", "black-mamba"]);
  let favoriteSettings = store.get("naehen:favoriteSettings", {});
  let totalRideCount = store.get("naehen:totalRideCount", sessions.filter((s) => s.status === "ridden").length);
  let srReportsLocal = store.get("naehen:srReports", []);

  function attractionFontConfig(rideId) {
    return ATTRACTION_FONTS[rideId] || null;
  }

  function applyAttractionTypography(element, rideId) {
    if (!element) return;
    const config = attractionFontConfig(rideId);
    if (!config) {
      element.style.removeProperty("--attraction-font");
      element.removeAttribute("data-theme");
      return;
    }
    element.style.setProperty("--attraction-font", config.fontFamily);
    element.dataset.theme = config.theme;
  }

  function enrichRide(ride) {
    const config = RIDE_CONFIG[ride.id] || { singleRider: false };
    ride.singleRider = !!config.singleRider;
    return ride;
  }

  function slugRide(name) {
    const known = {
      "f.l.y.": "fly",
      "taron": "taron",
      "raik": "raik",
      "black mamba": "black-mamba",
      "mystery castle": "mystery-castle",
      "colorado adventure": "colorado-adventure",
      "river quest": "river-quest",
      "talocan": "talocan"
    };
    const low = String(name || "").toLowerCase().trim();
    if (known[low]) return known[low];
    if (RIDE_ALIASES[low]) return RIDE_ALIASES[low];
    if (low.startsWith("chiapas")) return "chiapas";
    return low.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function toast(text) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = text;
    el.classList.add("show");
    window.clearTimeout(el._timer);
    el._timer = window.setTimeout(() => el.classList.remove("show"), 2400);
  }

  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  }

  function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }

  function hideGate(id) {
    const el = $(id);
    if (el) el.classList.remove("show");
  }

  function showGate(id) {
    ["#installGate", "#setupGate", "#authGate"].forEach((selector) => {
      const el = $(selector);
      if (el) el.classList.remove("show");
    });
    const target = $(id);
    if (target) target.classList.add("show");
  }

  function openSheet(id) {
    const el = $("#" + id);
    if (el) { lastSheetFocus = document.activeElement; el.classList.add("show"); document.body.classList.add("modalOpen"); el.querySelector("button")?.focus(); }
  }

  function closeSheet(id, options = {}) {
    const el = $("#" + id);
    if (el) el.classList.remove("show");
    if (!document.querySelector(".sheet.show")) document.body.classList.remove("modalOpen");
    if (lastSheetFocus?.isConnected) lastSheetFocus.focus();

    if (id === "rideSheet" && !options.fromPopState && history.state?.naehenRideDetail) {
      history.back();
    }
  }

  function pushRideDetailHistory(rideId) {
    if (history.state?.naehenRideDetail) return;
    history.pushState(
      Object.assign({}, history.state || {}, { naehenRideDetail: true, rideId: rideId }),
      "",
      location.href
    );
  }

  function formatElapsed(ms) {
    let seconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
    return [hours, minutes, seconds].map((x) => String(x).padStart(2, "0")).join(":");
  }

  function minutesRounded(ms) {
    return Math.round(Math.max(0, ms) / 60000);
  }

  function createId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "local-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  }

  function defaultSetting(rideId) {
    const existing = favoriteSettings[rideId];
    if (existing) return existing;
    return {
      rideId: rideId,
      waitLimit: 25,
      notifyBelow: true,
      notifyDrop: true,
      notifyReopen: true,
      notifySr: false,
      dropMinutes: 15
    };
  }

  function persistLocalState() {
    store.set("naehen:parkDay", parkDay);
    store.set("naehen:sessions", sessions);
    if (active) store.set("naehen:active", active);
    else store.remove("naehen:active");
    store.set("naehen:favorites", favorites);
    store.set("naehen:favoriteSettings", favoriteSettings);
    store.set("naehen:totalRideCount", totalRideCount);
    store.set("naehen:srReports", srReportsLocal);
  }

  function supabaseConfigured() {
    return !!(cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase);
  }

  function currentUserId() {
    return user && user.id ? user.id : null;
  }

  async function bootstrap() {
    bindStaticEvents();

    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("./sw.js?v=34", {
          scope: "./",
          updateViaCache: "none"
        });
        registration.update().catch(() => {});

        let reloadingForUpdate = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (reloadingForUpdate) return;
          reloadingForUpdate = true;
          window.location.reload();
        });
      } catch (_) {}
    }

    if (supabaseConfigured()) {
      supa = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
    }

    const skippedInstall = store.get("naehen:skipInstall", false);
    if (!isStandalone() && !skippedInstall) {
      showGate("#installGate");
      return;
    }

    await continueAfterInstall();
  }

  async function continueAfterInstall() {
    if (!supa) {
      showGate("#setupGate");
      return;
    }

    const result = await supa.auth.getSession();
    const session = result && result.data ? result.data.session : null;
    if (session && session.user) {
      await enterApp(session.user, false);
    } else {
      showGate("#authGate");
    }
  }

  async function enterApp(appUser, useLocalMode) {
    user = appUser || null;
    localMode = !!useLocalMode;
    ["#installGate", "#setupGate", "#authGate"].forEach(hideGate);
    $("#app").classList.remove("hidden");
    $("#nav").classList.remove("hidden");

    if (localMode) {
      $("#accountMode").textContent = "Lokaler Testmodus";
      $("#profileName").textContent = "Lokaler Parkfan";
      $("#profileMail").textContent = "Nur auf diesem Gerät";
      parkDay = store.get("naehen:parkDay", null);
      sessions = store.get("naehen:sessions", []);
      active = store.get("naehen:active", null);
      favorites = store.get("naehen:favorites", favorites);
      favoriteSettings = store.get("naehen:favoriteSettings", favoriteSettings);
      totalRideCount = store.get("naehen:totalRideCount", totalRideCount);
    } else {
      $("#accountMode").textContent = appUser.email || "Account";
      $("#profileName").textContent = (appUser.user_metadata && appUser.user_metadata.username) || (appUser.email ? appUser.email.split("@")[0] : "Parkfan");
      $("#profileMail").textContent = appUser.email || "";
      await loadAccountState();
    }

    favorites = favorites.filter((id) => !EXCLUDED_RIDE_IDS.has(id));
    EXCLUDED_RIDE_IDS.forEach((id) => delete favoriteSettings[id]);
    persistLocalState();

    renderAll();
    loadLiveWaits();
    window.setInterval(loadLiveWaits, LIVE_REFRESH_MS);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") loadLiveWaits();
    }, { passive: true });
  }

  async function loadAccountState() {
    if (!supa || !currentUserId()) return;

    const activeDayResult = await supa
      .from("park_days")
      .select("*")
      .eq("user_id", currentUserId())
      .is("ended_at", null)
      .order("started_at", { ascending: false })
      .limit(1);

    if (!activeDayResult.error && activeDayResult.data && activeDayResult.data.length) {
      parkDay = activeDayResult.data[0];
    } else {
      parkDay = null;
    }

    if (parkDay) {
      const sessionResult = await supa
        .from("queue_sessions")
        .select("*")
        .eq("user_id", currentUserId())
        .eq("park_day_id", parkDay.id)
        .order("started_at", { ascending: false });

      if (!sessionResult.error) sessions = (sessionResult.data || []).map(dbSessionToClient);

      const waiting = sessions.find((s) => s.status === "waiting");
      if (waiting) active = waiting;
      else active = null;
    } else {
      sessions = [];
      active = null;
    }

    const favoriteResult = await supa
      .from("favorites")
      .select("*")
      .eq("user_id", currentUserId());

    if (!favoriteResult.error) {
      favorites = (favoriteResult.data || []).map((row) => row.ride_id);
      favoriteSettings = {};
      (favoriteResult.data || []).forEach((row) => {
        favoriteSettings[row.ride_id] = {
          rideId: row.ride_id,
          waitLimit: row.wait_limit === null ? 25 : row.wait_limit,
          notifyBelow: row.notify_below !== false,
          notifyDrop: row.notify_drop !== false,
          notifyReopen: row.notify_reopen !== false,
          notifySr: row.notify_sr === true,
          dropMinutes: row.drop_minutes || 15
        };
      });
    }

    const countResult = await supa
      .from("queue_sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", currentUserId())
      .eq("status", "ridden");

    if (!countResult.error && typeof countResult.count === "number") totalRideCount = countResult.count;

    persistLocalState();
  }

  function dbSessionToClient(row) {
    return {
      id: row.id,
      rideId: row.ride_id,
      rideName: row.ride_name,
      type: row.queue_type,
      posted: row.posted_wait,
      startedAt: new Date(row.started_at).getTime(),
      endedAt: row.ended_at ? new Date(row.ended_at).getTime() : null,
      duration: typeof row.wait_seconds === "number" ? row.wait_seconds * 1000 : null,
      status: row.status,
      parkDayId: row.park_day_id,
      synced: true
    };
  }

  async function loadLiveWaits() {
    const label = $("#dataLabel");
    if (!label) return;

    try {
      label.textContent = "LIVE WIRD GELADEN…";
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 6500);
      const response = await fetch(LIVE_DATA_URL + "?t=" + Date.now(), {
        cache: "no-store",
        signal: controller.signal
      });
      window.clearTimeout(timer);
      if (!response.ok) throw new Error("Live-Snapshot HTTP " + response.status);

      const data = await response.json();
      const previous = store.get("naehen:lastWaits", {});
      const flattened = [];

      (data.lands || []).forEach((land) => {
        (land.rides || []).forEach((ride) => {
          flattened.push(Object.assign({}, ride, { zone: land.name || "Phantasialand" }));
        });
      });
      (data.rides || []).forEach((ride) => {
        flattened.push(Object.assign({}, ride, { zone: "Phantasialand" }));
      });
      if (!flattened.length) throw new Error("Keine Attraktionen in Live-Snapshot");

      const nowState = {};
      rides = flattened.map((raw) => {
        const id = slugRide(raw.name);
        if (isExcludedRide(raw.name, id)) return null;
        const old = previous[id];
        const wait = Number(raw.wait_time) || 0;
        let delta = 0;
        let trend = "flat";

        if (old && old.isOpen && raw.is_open) {
          delta = wait - Number(old.wait || 0);
          if (delta <= -5) trend = "down";
          else if (delta >= 5) trend = "up";
        }

        nowState[id] = { wait: wait, isOpen: !!raw.is_open, at: Date.now() };
        return enrichRide({
          id: id,
          name: raw.name,
          zone: raw.zone,
          wait: wait,
          isOpen: !!raw.is_open,
          trend: trend,
          delta: delta,
          source: "queue-times",
          lastUpdated: raw.last_updated || null
        });
      }).filter(Boolean);

      const liveIds = new Set(rides.map(ride => ride.id));
      FALLBACK_RIDES.forEach(ride => { if (!liveIds.has(ride.id)) rides.push(Object.assign({}, ride)); });

      rides.sort((a, b) => {
        const aFav = favorites.includes(a.id) ? 0 : 1;
        const bFav = favorites.includes(b.id) ? 0 : 1;
        return aFav - bFav || a.name.localeCompare(b.name, "de");
      });

      store.set("naehen:lastWaits", nowState);
      label.textContent = "LIVE · GITHUB SYNC";
      renderRides();
    } catch (error) {
      console.warn("Live-Snapshot konnte nicht geladen werden", error);
      label.textContent = "LIVE NICHT ERREICHBAR";
      if (!rides.some((r) => r.source === "queue-times")) rides = FALLBACK_RIDES.slice();
      renderRides();
    }
  }

  function renderAll() {
    renderParkDay();
    renderRides();
    renderStats();
    renderLog();
    renderProfile();
    updateActiveTimer();
  }

  function renderParkDay() {
    const button = $("#parkDayBtn");
    const headline = $("#parkDayHeadline");
    if (!button || !headline) return;

    if (parkDay) {
      button.textContent = "PARKTAG BEENDEN";
      button.classList.remove("primary");
      button.classList.add("secondary");
      const start = new Date(parkDay.started_at || parkDay.startedAt || Date.now());
      headline.textContent = "Seit " + start.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) + " wird genäht.";
      $("#logDayLabel").textContent = "AKTUELLER PARKTAG";
    } else {
      button.textContent = "PARKTAG STARTEN";
      button.classList.remove("secondary");
      button.classList.add("primary");
      headline.textContent = sessions.length ? "Letzte Nähbilanz steht." : "Heute wird genäht.";
      $("#logDayLabel").textContent = sessions.length ? "LETZTER PARKTAG" : "NOCH NICHT GESTARTET";
    }
  }

  function renderRides() {
    const container = $("#rides");
    if (!container) return;

    const visibleRides = rides.filter(ride => !isExcludedRide(ride.name, ride.id) && (!onlyFavorites || favorites.includes(ride.id)) && ride.name.toLowerCase().includes(rideSearch));
    const cards = visibleRides.map((ride) => {
      const fav = favorites.includes(ride.id);
      const world = WORLD[ride.id];
      const artSrc = world ? (world.artUrl || (world.art ? "./assets/" + world.art + ".webp" : "")) : "";
      const hasLive = ride.source === "queue-times";
      const closed = hasLive && !ride.isOpen;
      const unknown = !hasLive || ride.isOpen === null;
      const waitMain = closed ? "ZU" : unknown ? "–" : String(ride.wait);
      const waitSub = closed ? "GESCHLOSSEN" : unknown ? "KEINE LIVE-DATEN" : "MIN · LIVE";
      const arrow = ride.trend === "down" ? "↓" : ride.trend === "up" ? "↑" : "→";
      const trendText = !hasLive ? "warte auf Live-Daten" : closed ? "aktuell geschlossen" : ride.delta ? arrow + " " + Math.abs(ride.delta) + " min" : "→ stabil";
      const updated = ride.lastUpdated ? " · Stand " + new Date(ride.lastUpdated).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) : "";
      const sr = ride.singleRider ? "<span>👤 SR</span><span>·</span>" : "";
      const queueDisabled = closed ? " disabled" : "";

      return "<article class=\"ride\" data-world=\"" + escapeHtml(ride.id) + "\" data-detail=\"" + escapeHtml(ride.id) + "\">" +
        (artSrc ? "<img class=\"rideArt\" src=\"" + escapeHtml(artSrc) + "\" alt=\"\" loading=\"lazy\" decoding=\"async\">" : "") +
        "<div class=\"rideMain\">" +
          "<div class=\"rideTop\">" +
            "<button class=\"fav " + (fav ? "on" : "") + "\" data-fav=\"" + ride.id + "\" aria-label=\"Favorit für " + escapeHtml(ride.name) + "\" aria-pressed=\"" + fav + "\">★</button>" +
            "<div><h3>" + escapeHtml(ride.name) + "</h3><div class=\"zone\">" + escapeHtml(ride.zone + updated) + "</div></div>" +
          "</div>" +
          "<div class=\"meta\">" + sr +
            "<span class=\"trend " + ride.trend + "\">" + escapeHtml(trendText) + "</span><span>·</span>" +
            "<button class=\"btn secondary\" style=\"padding:7px 10px;font-size:11px\" data-queue=\"" + ride.id + "\"" + queueDisabled + ">" + (closed ? "ZU" : "ANSTELLEN") + "</button>" +
            "<button class=\"btn ghost\" style=\"padding:7px 4px;font-size:11px\" data-detail-btn=\"" + ride.id + "\">DETAILS</button>" +
          "</div>" +
        "</div>" +
        "<div class=\"wait\"><strong>" + waitMain + "</strong><small>" + waitSub + "</small></div>" +
      "</article>";
    }).join("");

    container.innerHTML = (cards || "<div class=\"empty\">Keine passenden Attraktionen. Passe deine Suche oder den Favoritenfilter an.</div>") +
      "<a class=\"attribution\" href=\"https://queue-times.com/\" target=\"_blank\" rel=\"noopener\">Powered by <b style=\"color:var(--text)\">Queue-Times.com</b> · Live-Daten ca. alle 5 Min.</a>";

    container.querySelectorAll(".ride[data-detail]").forEach((card) => {
      applyAttractionTypography(card, card.dataset.detail);
    });

    $$("[data-fav]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        event.stopPropagation();
        await toggleFavorite(button.dataset.fav);
      });
    });

    $$("[data-queue]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        if (!button.disabled) openQueue(button.dataset.queue);
      });
    });

    $$("[data-detail-btn]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        openRideDetail(button.dataset.detailBtn);
      });
    });

    $$("[data-detail]").forEach((card) => {
      card.addEventListener("click", () => openRideDetail(card.dataset.detail));
    });
  }

  async function toggleFavorite(rideId) {
    const wasFavorite = favorites.includes(rideId);
    if (wasFavorite) {
      favorites = favorites.filter((id) => id !== rideId);
      delete favoriteSettings[rideId];
      if (supa && currentUserId()) {
        await supa.from("favorites").delete().eq("user_id", currentUserId()).eq("ride_id", rideId);
      }
    } else {
      favorites.push(rideId);
      favoriteSettings[rideId] = defaultSetting(rideId);
      if (supa && currentUserId()) {
        await saveFavoriteRow(rideId);
      }
    }
    persistLocalState();
    renderRides();
    renderPushSettings();
  }

  async function saveFavoriteRow(rideId) {
    if (!supa || !currentUserId()) return;
    const setting = defaultSetting(rideId);
    const result = await supa.from("favorites").upsert({
      user_id: currentUserId(),
      ride_id: rideId,
      wait_limit: Number(setting.waitLimit) || 25,
      notify_below: !!setting.notifyBelow,
      notify_drop: !!setting.notifyDrop,
      notify_reopen: !!setting.notifyReopen,
      notify_sr: !!setting.notifySr,
      drop_minutes: Number(setting.dropMinutes) || 15,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id,ride_id" });
    if (result.error) console.warn("Favorit konnte nicht synchronisiert werden", result.error);
  }

  async function startParkDay() {
    if (parkDay) return;

    const now = new Date().toISOString();
    const id = createId();
    const nextDay = { id: id, park_slug: "phantasialand", started_at: now, ended_at: null };

    if (supa && currentUserId()) {
      const result = await supa.from("park_days").insert({
        id: id,
        user_id: currentUserId(),
        park_slug: "phantasialand",
        started_at: now
      }).select("*").single();

      if (result.error) {
        toast("Parktag konnte nicht synchronisiert werden");
        console.warn(result.error);
        return;
      }
      parkDay = result.data;
    } else {
      parkDay = nextDay;
    }

    sessions = [];
    active = null;
    persistLocalState();
    renderAll();
    toast("🧵 Parktag gestartet. Jetzt wird genäht.");
  }

  async function endParkDay() {
    if (!parkDay) return;
    if (active) {
      toast("Erst die aktive Queue abschließen oder vernähen.");
      openActive();
      return;
    }

    const endedAt = new Date().toISOString();
    if (supa && currentUserId()) {
      const result = await supa.from("park_days").update({ ended_at: endedAt }).eq("id", parkDay.id).eq("user_id", currentUserId());
      if (result.error) {
        toast("Parktag konnte nicht beendet werden");
        console.warn(result.error);
        return;
      }
    }

    renderRecap(sessions);
    openSheet("recapSheet");
    parkDay = null;
    persistLocalState();
    renderParkDay();
  }

  function renderStats() {
    const ridden = sessions.filter((s) => s.status === "ridden");
    const queueMs = ridden.reduce((sum, s) => sum + (s.duration || 0), 0);
    $("#ridesToday").textContent = ridden.length + "×";
    $("#queueToday").textContent = minutesRounded(queueMs) + "m";
    $("#srToday").textContent = ridden.filter((s) => s.type === "single").length + "×";
    $("#totalRides").textContent = totalRideCount;
  }

  function renderLog() {
    const container = $("#log");
    if (!container) return;
    if (!sessions.length) {
      container.innerHTML = "<div class=\"empty\">Noch nichts genäht. Das ändern wir.</div>";
      return;
    }

    container.innerHTML = sessions.slice().sort((a, b) => b.startedAt - a.startedAt).map((session) => {
      const duration = session.duration === null || session.duration === undefined ? "läuft" : minutesRounded(session.duration) + " min";
      const state = session.status === "ridden" ? "🧵 genäht" : session.status === "aborted" ? "💀 vernäht" : "⏱ läuft";
      return "<div class=\"logItem\"><div><b>" + escapeHtml(session.rideName) + "</b><br><small>" +
        (session.type === "single" ? "👤 Single Rider" : "Regular") + " · " +
        new Date(session.startedAt).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) +
        "</small></div><div style=\"text-align:right\"><b>" + duration + "</b><br><small>" + state + "</small></div></div>";
    }).join("");
  }

  function renderProfile() {
    $("#totalRides").textContent = totalRideCount;
  }

  function openQueue(rideId) {
    if (!parkDay) {
      toast("Erst Parktag starten – dann wird genäht.");
      return;
    }
    if (active) {
      openActive();
      return;
    }

    selectedRide = rides.find((ride) => ride.id === rideId) || FALLBACK_RIDES.find((ride) => ride.id === rideId);
    if (!selectedRide) return;

    queueType = "regular";
    $("#sheetRide").textContent = selectedRide.name;
    $("#postedWait").value = selectedRide.source === "queue-times" && selectedRide.isOpen ? selectedRide.wait : "";

    const singleButton = $("[data-qtype=\"single\"]");
    singleButton.disabled = !selectedRide.singleRider;
    singleButton.textContent = selectedRide.singleRider ? "Single Rider" : "Single Rider · nicht vorhanden";

    $$("[data-qtype]").forEach((button, index) => button.classList.toggle("on", index === 0));
    openSheet("queueSheet");
  }

  async function startQueue() {
    if (!selectedRide || !parkDay) return;

    const input = $("#postedWait").value.trim();
    const posted = input === "" ? null : Math.max(0, Number(input));
    const now = Date.now();
    const id = createId();

    active = {
      id: id,
      rideId: selectedRide.id,
      rideName: selectedRide.name,
      type: queueType,
      posted: Number.isFinite(posted) ? posted : null,
      startedAt: now,
      endedAt: null,
      duration: null,
      status: "waiting",
      parkDayId: parkDay.id,
      synced: false
    };

    sessions = [active].concat(sessions.filter((s) => s.id !== active.id));
    persistLocalState();
    closeSheet("queueSheet");
    updateActiveTimer();
    openActive();

    if (supa && currentUserId()) {
      const result = await supa.from("queue_sessions").insert({
        id: id,
        user_id: currentUserId(),
        park_day_id: parkDay.id,
        ride_id: active.rideId,
        ride_name: active.rideName,
        queue_type: active.type,
        posted_wait: active.posted,
        started_at: new Date(active.startedAt).toISOString(),
        status: "waiting"
      });
      if (!result.error) {
        active.synced = true;
        const found = sessions.find((s) => s.id === active.id);
        if (found) found.synced = true;
        persistLocalState();
      } else {
        console.warn("Queue-Start nur lokal gespeichert", result.error);
        toast("Timer läuft – Cloud-Sync gerade fehlgeschlagen.");
      }
    }

    toast(queueType === "single" ? "👤 SR-Nähung gestartet" : "🧵 Timer läuft");
  }

  function updateActiveTimer() {
    const bar = $("#queueBar");
    if (!bar) return;
    if (!active) {
      bar.classList.remove("show");
      return;
    }

    const value = formatElapsed(Date.now() - active.startedAt);
    bar.classList.add("show");
    $("#queueRide").textContent = active.rideName;
    $("#queueTime").textContent = value;
    $("#queueLabel").textContent = active.type === "single" ? "SINGLE RIDER WIRD GENÄHT" : "QUEUE WIRD GENÄHT";
    $("#activeTime").textContent = value;
    $("#activeRide").textContent = active.rideName;
    $("#activeMeta").textContent = (active.type === "single" ? "Single Rider" : "Regular Queue") +
      (active.posted !== null ? " · ausgeschildert " + active.posted + " min" : "");
  }

  function openActive() {
    if (!active) return;
    updateActiveTimer();
    openSheet("activeSheet");
  }

  async function finishSession(status) {
    if (!active) return;

    const ended = Date.now();
    const finished = Object.assign({}, active, {
      endedAt: ended,
      duration: ended - active.startedAt,
      status: status
    });

    sessions = sessions.map((session) => session.id === finished.id ? finished : session);
    if (!sessions.some((session) => session.id === finished.id)) sessions.unshift(finished);

    if (status === "ridden") {
      totalRideCount += 1;
    }

    if (supa && currentUserId()) {
      const result = await supa.from("queue_sessions").update({
        ended_at: new Date(ended).toISOString(),
        wait_seconds: Math.round(finished.duration / 1000),
        status: status
      }).eq("id", finished.id).eq("user_id", currentUserId());

      if (result.error) console.warn("Queue-Ende konnte nicht synchronisiert werden", result.error);
    }

    if (status === "ridden" && finished.type === "single") {
      await recordSrReport(finished);
    }

    active = null;
    persistLocalState();
    closeSheet("activeSheet");
    renderAll();
    toast(status === "ridden" ? "🎢 Sauber genäht." : "💀 Vernäht.");
  }

  async function recordSrReport(session) {
    const report = {
      id: createId(),
      rideId: session.rideId,
      waitSeconds: Math.round(session.duration / 1000),
      measuredAt: Date.now(),
      queueSessionId: session.id
    };

    srReportsLocal.unshift(report);
    srReportsLocal = srReportsLocal.slice(0, 100);
    persistLocalState();

    if (supa && currentUserId()) {
      const result = await supa.from("sr_reports").insert({
        id: report.id,
        user_id: currentUserId(),
        queue_session_id: session.id,
        ride_id: session.rideId,
        wait_seconds: report.waitSeconds,
        measured_at: new Date(report.measuredAt).toISOString()
      });
      if (result.error) console.warn("SR-Messung konnte nicht geteilt werden", result.error);
    }
  }

  async function openRideDetail(rideId) {
    selectedDetailRide = rides.find((ride) => ride.id === rideId) || FALLBACK_RIDES.find((ride) => ride.id === rideId);
    if (!selectedDetailRide) return;

    const world = WORLD[selectedDetailRide.id] || null;
    const artSrc = world ? (world.artUrl || (world.art ? "./assets/" + world.art + ".webp" : "")) : "";
    const rideSheet = $("#rideSheet");
    const worldArtImage = $("#worldArtImage");
    rideSheet.dataset.world = world ? selectedDetailRide.id : "default";
    applyAttractionTypography(rideSheet, selectedDetailRide.id);
    if (worldArtImage) {
      if (artSrc) {
        worldArtImage.src = artSrc;
        worldArtImage.hidden = false;
      } else {
        worldArtImage.removeAttribute("src");
        worldArtImage.hidden = true;
      }
    }
    $("#worldCaption").textContent = world?.line || "Deine nächste Nähung.";
    $("#rideTitle").textContent = selectedDetailRide.name;
    $("#rideZone").textContent = world?.label || selectedDetailRide.zone || "Phantasialand";

    if (selectedDetailRide.source === "queue-times") {
      $("#rideDetailWait").textContent = selectedDetailRide.isOpen ? selectedDetailRide.wait + " min" : "Geschlossen";
      $("#rideDetailStatus").textContent = selectedDetailRide.isOpen ? "Als geöffnet gemeldet · Daten von Queue-Times, keine offizielle Park-Livezeit." : "Attraktion wird aktuell als geschlossen gemeldet.";
    } else {
      $("#rideDetailWait").textContent = "–";
      $("#rideDetailStatus").textContent = "Aktuell keine Live-Wartezeit verfügbar.";
    }

    $("#rideQueueBtn").disabled = selectedDetailRide.source === "queue-times" && !selectedDetailRide.isOpen;
    $("#srCommunity").innerHTML = "<div class=\"message\">Single-Rider-Informationen laden…</div>";
    openSheet("rideSheet");
    pushRideDetailHistory(selectedDetailRide.id);
    await renderSrCommunity(selectedDetailRide);
  }

  async function renderSrCommunity(ride) {
    const box = $("#srCommunity");
    if (!ride.singleRider) {
      box.innerHTML = "<div class=\"srBox\"><b>👤 Single Rider</b><p class=\"meta\">Für diese Attraktion ist in NÄHEN keine separate Single-Rider-Nutzung hinterlegt.</p></div>";
      return;
    }

    let reports = [];
    const cutoff = Date.now() - SR_VISIBLE_MINUTES * 60000;

    if (supa && currentUserId()) {
      const result = await supa
        .from("sr_reports")
        .select("wait_seconds,measured_at")
        .eq("ride_id", ride.id)
        .gte("measured_at", new Date(cutoff).toISOString())
        .order("measured_at", { ascending: false })
        .limit(8);

      if (!result.error) {
        reports = (result.data || []).map((row) => ({
          waitSeconds: row.wait_seconds,
          measuredAt: new Date(row.measured_at).getTime()
        }));
      }
    } else {
      reports = srReportsLocal.filter((report) => report.rideId === ride.id && report.measuredAt >= cutoff).slice(0, 8);
    }

    if (selectedDetailRide?.id !== ride.id) return;
    const freshCount = reports.filter((report) => Date.now() - report.measuredAt <= SR_FRESH_MINUTES * 60000).length;
    let reportHtml = reports.length ? reports.map((report) => {
      const age = Math.max(0, Math.round((Date.now() - report.measuredAt) / 60000));
      return "<span class=\"chip\">" + Math.round(report.waitSeconds / 60) + " min · vor " + age + "m</span>";
    }).join("") : "<span class=\"mini\">Noch keine Community-Messung in der letzten Stunde.</span>";

    box.innerHTML = "<div class=\"srBox\"><b>👤 Single Rider</b>" +
      "<p class=\"meta\">Keine offizielle SR-Livezeit. NÄHEN zeigt nur tatsächlich gestoppte Community-Messungen.</p>" +
      "<div class=\"mini\">" + freshCount + " frische Messung(en) in den letzten " + SR_FRESH_MINUTES + " Minuten</div>" +
      "<div class=\"srReports\">" + reportHtml + "</div></div>";
  }

  function renderPushSettings() {
    const container = $("#pushRideSettings");
    if (!container) return;

    if (!favorites.length) {
      container.innerHTML = "<div class=\"empty\">Markiere zuerst Attraktionen mit ★ als Favorit.</div>";
      return;
    }

    container.innerHTML = favorites.map((rideId) => {
      const ride = rides.find((item) => item.id === rideId) || FALLBACK_RIDES.find((item) => item.id === rideId) || { id: rideId, name: rideId };
      const setting = defaultSetting(rideId);
      favoriteSettings[rideId] = setting;
      return "<div class=\"pushSetting\" data-setting=\"" + rideId + "\">" +
        "<h3>" + escapeHtml(ride.name) + "</h3>" +
        "<div class=\"limitRow\"><span>Push unter Wartezeit</span><input class=\"settingInput\" data-field=\"waitLimit\" type=\"number\" min=\"0\" value=\"" + Number(setting.waitLimit || 25) + "\"></div>" +
        toggleHtml("notifyBelow", "Unter persönlichem Limit", setting.notifyBelow) +
        toggleHtml("notifyDrop", "Starker Queue-Drop", setting.notifyDrop) +
        "<div class=\"limitRow\"><span>Drop ab Minuten</span><input class=\"settingInput\" data-field=\"dropMinutes\" type=\"number\" min=\"5\" value=\"" + Number(setting.dropMinutes || 15) + "\"></div>" +
        toggleHtml("notifyReopen", "Wiedereröffnung", setting.notifyReopen) +
        (ride.singleRider ? toggleHtml("notifySr", "Neue frische SR-Messung", setting.notifySr) : "") +
      "</div>";
    }).join("");
  }

  function toggleHtml(field, label, checked) {
    return "<label class=\"toggleRow\"><span>" + escapeHtml(label) + "</span><input type=\"checkbox\" data-field=\"" + field + "\"" + (checked ? " checked" : "") + "></label>";
  }

  async function savePushSettings() {
    $$("[data-setting]").forEach((box) => {
      const rideId = box.dataset.setting;
      const setting = defaultSetting(rideId);
      box.querySelectorAll("[data-field]").forEach((input) => {
        const field = input.dataset.field;
        setting[field] = input.type === "checkbox" ? input.checked : Number(input.value);
      });
      favoriteSettings[rideId] = setting;
    });

    persistLocalState();

    if (supa && currentUserId()) {
      for (const rideId of favorites) {
        await saveFavoriteRow(rideId);
      }
    }

    toast("🔔 Näh-Alarme gespeichert");
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from(Array.from(rawData).map((char) => char.charCodeAt(0)));
  }

  async function enablePush() {
    if (isIOS() && !isStandalone()) {
      toast("Auf iPhone zuerst NÄHEN zum Home-Bildschirm hinzufügen.");
      return;
    }
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      toast("Push wird von diesem Browser nicht unterstützt.");
      return;
    }
    if (!cfg.vapidPublicKey) {
      toast("VAPID-Key fehlt noch im einmaligen Backend-Setup.");
      return;
    }
    if (!supa || !currentUserId()) {
      toast("Echte Pushes benötigen einen NÄHEN-Account.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      toast("Push wurde nicht freigegeben.");
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(cfg.vapidPublicKey)
      });
    }

    const json = subscription.toJSON();
    const result = await supa.from("push_subscriptions").upsert({
      user_id: currentUserId(),
      endpoint: subscription.endpoint,
      p256dh: json.keys && json.keys.p256dh ? json.keys.p256dh : "",
      auth: json.keys && json.keys.auth ? json.keys.auth : "",
      user_agent: navigator.userAgent,
      updated_at: new Date().toISOString()
    }, { onConflict: "endpoint" });

    if (result.error) {
      console.warn(result.error);
      toast("Push-Abo konnte nicht gespeichert werden.");
      return;
    }

    $("#enablePushBtn").textContent = "🔔 PUSH AKTIV ✓";
    toast("🔔 Näh-Alarme sind scharf.");
  }

  function renderRecap(sourceSessions) {
    const ridden = sourceSessions.filter((s) => s.status === "ridden");
    const aborted = sourceSessions.filter((s) => s.status === "aborted");
    const queueMs = ridden.reduce((sum, s) => sum + (s.duration || 0), 0);
    const srCount = ridden.filter((s) => s.type === "single").length;
    const counts = {};
    ridden.forEach((s) => { counts[s.rideName] = (counts[s.rideName] || 0) + 1; });
    let topRide = "–";
    let topCount = 0;
    Object.keys(counts).forEach((name) => {
      if (counts[name] > topCount) {
        topRide = name;
        topCount = counts[name];
      }
    });

    const postedComparable = ridden.filter((s) => s.posted !== null && s.duration !== null);
    const savedMinutes = Math.round(postedComparable.reduce((sum, s) => sum + (Number(s.posted) * 60000 - s.duration), 0) / 60000);

    $("#recapContent").innerHTML =
      "<div class=\"recapBox\"><div class=\"recapGrid\">" +
      recapStat(ridden.length + "×", "genäht") +
      recapStat(minutesRounded(queueMs) + "m", "echte Queue") +
      recapStat(srCount + "×", "Single Rider") +
      recapStat(aborted.length + "×", "vernäht") +
      "</div></div>" +
      "<div class=\"recapBox\"><b>🏆 meistgenäht</b><p>" + escapeHtml(topRide + (topCount ? " ×" + topCount : "")) + "</p></div>" +
      "<div class=\"recapBox\"><b>⏱ vs. ausgeschildert</b><p>" +
      (postedComparable.length ? (savedMinutes >= 0 ? savedMinutes + " Minuten weniger gewartet." : Math.abs(savedMinutes) + " Minuten länger gewartet.") : "Noch nicht genug Vergleichsdaten.") +
      "</p></div>";
  }

  function recapStat(value, label) {
    return "<div class=\"recapStat\"><b>" + escapeHtml(String(value)) + "</b><span class=\"mini\">" + escapeHtml(label) + "</span></div>";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function switchView(viewId) {
    ["homeView", "logView", "profileView"].forEach((id) => {
      $("#" + id).classList.toggle("hidden", id !== viewId);
    });
    $$("[data-view]").forEach((button) => button.classList.toggle("active", button.dataset.view === viewId));
  }

  window.addEventListener("popstate", () => {
    const rideSheet = $("#rideSheet");
    if (rideSheet?.classList.contains("show")) {
      closeSheet("rideSheet", { fromPopState: true });
    }
  });

  function bindStaticEvents() {
    $("#rideSearch").addEventListener("input", e => { rideSearch = e.target.value.trim().toLowerCase(); renderRides(); });
    $("#favoriteFilter").addEventListener("click", e => { onlyFavorites = !onlyFavorites; e.currentTarget.setAttribute("aria-pressed", onlyFavorites); renderRides(); });
    $("#queueBar").addEventListener("keydown", e => { if(e.key === "Enter" || e.key === " ") { e.preventDefault(); openActive(); } });
    $$(".sheet").forEach(sheet => sheet.addEventListener("click", e => { if(e.target === sheet) closeSheet(sheet.id); }));
    document.addEventListener("keydown", e => {
      const modal = document.querySelector(".sheet.show");
      if (!modal) return;
      if (e.key === "Escape") closeSheet(modal.id);
      if (e.key === "Tab") {
        const items = Array.from(modal.querySelectorAll("button:not(:disabled),input:not(:disabled),a[href]")).filter(el => el.getClientRects().length);
        const first=items[0], last=items[items.length-1];
        if(e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if(!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    });
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredInstall = event;
    });

    $("#installBtn").addEventListener("click", async () => {
      if (isIOS()) {
        $("#iosSteps").classList.remove("hidden");
        return;
      }
      if (deferredInstall) {
        deferredInstall.prompt();
        await deferredInstall.userChoice;
        deferredInstall = null;
        store.set("naehen:skipInstall", true);
        await continueAfterInstall();
      } else {
        toast("Browser-Menü → App installieren / Zum Startbildschirm");
      }
    });

    $("#previewBtn").addEventListener("click", async () => {
      store.set("naehen:skipInstall", true);
      await continueAfterInstall();
    });

    $("#localModeBtn").addEventListener("click", async () => {
      localMode = true;
      await enterApp({ id: "local", email: "", user_metadata: { username: "Lokaler Parkfan" } }, true);
    });

    $$("[data-authmode]").forEach((button) => {
      button.addEventListener("click", () => {
        authMode = button.dataset.authmode;
        $$("[data-authmode]").forEach((item) => item.classList.toggle("on", item === button));
        const signup = authMode === "signup";
        $("#username").classList.toggle("hidden", !signup);
        $("#usernameLabel").classList.toggle("hidden", !signup);
        $("#authBtn").textContent = signup ? "ACCOUNT ERSTELLEN" : "EINLOGGEN";
      });
    });

    $("#authBtn").addEventListener("click", async () => {
      if (!supa) return;
      const email = $("#email").value.trim();
      const password = $("#password").value;
      if (!email || password.length < 6) {
        $("#authMessage").textContent = "Bitte gültige E-Mail und mindestens 6 Zeichen Passwort eingeben.";
        return;
      }

      if (authMode === "signup") {
        const result = await supa.auth.signUp({
          email: email,
          password: password,
          options: { data: { username: $("#username").value.trim() || "Parkfan" } }
        });
        if (result.error) {
          $("#authMessage").textContent = result.error.message;
          return;
        }
        if (result.data && result.data.session && result.data.user) {
          await enterApp(result.data.user, false);
        } else {
          $("#authMessage").textContent = "Account erstellt. Bitte E-Mail bestätigen und anschließend einloggen.";
        }
      } else {
        const result = await supa.auth.signInWithPassword({ email: email, password: password });
        if (result.error) {
          $("#authMessage").textContent = result.error.message;
          return;
        }
        await enterApp(result.data.user, false);
      }
    });

    $("#parkDayBtn").addEventListener("click", () => parkDay ? endParkDay() : startParkDay());
    $("#startQueue").addEventListener("click", startQueue);
    $("#boardBtn").addEventListener("click", () => finishSession("ridden"));
    $("#abortBtn").addEventListener("click", () => finishSession("aborted"));
    $("#queueBar").addEventListener("click", openActive);
    $("#rideQueueBtn").addEventListener("click", () => {
      if (!selectedDetailRide) return;
      closeSheet("rideSheet");
      openQueue(selectedDetailRide.id);
    });

    $$("[data-qtype]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.disabled) return;
        queueType = button.dataset.qtype;
        $$("[data-qtype]").forEach((item) => item.classList.toggle("on", item === button));
      });
    });

    $$("[data-close]").forEach((button) => {
      button.addEventListener("click", () => closeSheet(button.dataset.close));
    });

    $$("[data-view]").forEach((button) => {
      button.addEventListener("click", () => switchView(button.dataset.view));
    });

    $("#avatarBtn").addEventListener("click", () => switchView("profileView"));
    $("#pushSettingsBtn").addEventListener("click", () => {
      renderPushSettings();
      openSheet("pushSheet");
    });
    $("#savePushSettingsBtn").addEventListener("click", savePushSettings);
    $("#enablePushBtn").addEventListener("click", enablePush);

    $("#logoutBtn").addEventListener("click", async () => {
      if (supa && !localMode) await supa.auth.signOut();
      store.remove("naehen:skipInstall");
      location.reload();
    });

    window.setInterval(updateActiveTimer, 1000);
  }

  bootstrap();
})();