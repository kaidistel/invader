(() => {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const cfg = window.NAEHEN_CONFIG || {};
  const PARKS = {
    phantasialand: {
      slug: "phantasialand",
      name: "Phantasialand",
      location: "Brühl · Nordrhein-Westfalen",
      liveDataUrl: "./live.json",
      cardImage: "./assets/park.webp",
      cardCopy: "Live-Wartezeiten, Nähprotokoll und deine Phantasialand-Attraktionen.",
      disclaimer: "Kein offizielles Angebot des Phantasialands."
    }
  };
  const EXTERNAL_PARK_MODULES = [
    window.NAEHEN_MOVIE_PARK,
    window.NAEHEN_WALIBI_HOLLAND,
    window.NAEHEN_WALIBI_BELGIUM,
    window.NAEHEN_EUROPA_PARK,
    window.NAEHEN_HANSA_PARK,
    window.NAEHEN_SOEST_ALLERHEILIGENKIRMES_2026,
    window.NAEHEN_BOCHOLT_KIRMES_2026,
    window.NAEHEN_SALZBERGEN_HERBSTKIRMES_2026
  ].filter((module) => module && module.park && module.park.slug);

  const PARK_MODULES = {};
  EXTERNAL_PARK_MODULES.forEach((module) => {
    PARK_MODULES[module.park.slug] = module;
    PARKS[module.park.slug] = module.park;
  });

  function parkModuleFor(parkSlug = activeParkSlug || "phantasialand") {
    return PARK_MODULES[parkSlug] || null;
  }

  const LIVE_REFRESH_MS = 60 * 1000;
  const SR_FRESH_MINUTES = 30;
  const SR_VISIBLE_MINUTES = 60;
  const EXCLUDED_RIDE_IDS = new Set(["berliner-einlauten","berliner-einlaufen","berliner-einlauf"]);

  function isExcludedRide(name, id, parkSlug = activeParkSlug || "phantasialand") {
    const normalizedName = String(name || "").toLowerCase().trim();
    const normalizedId = String(id || "");
    const module = parkModuleFor(parkSlug);

    if (module) {
      const excludedIds = new Set(module.exclusions?.ids || []);
      const patterns = module.exclusions?.namePatterns || [];
      return excludedIds.has(normalizedId) || patterns.some((pattern) =>
        normalizedName.includes(String(pattern).toLowerCase())
      );
    }

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
    "taron": { singleRider: true, speedKmh: 117 },
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

  const ACHIEVEMENT_DEFINITIONS = {
    beschleunigger: {
      id: "beschleunigger",
      title: "Beschleunigger",
      icon: "⚡",
      description: "Mindestens 100 km/h genäht.",
      thresholdKmh: 100
    },
    "ich-hab-mir-das-nicht-ausgesucht": {
      id: "ich-hab-mir-das-nicht-ausgesucht",
      title: "Ich hab mir das nicht Ausgesucht",
      icon: "🐋",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Humpback_whale_in_ocean.jpg?width=640",
      imageAlt: "Buckelwal im Meer",
      description: "Mindestens 30 Minuten Wartezeit überstanden.",
      lockedDescription: "Warte bei einer Fahrt mindestens 30 Minuten.",
      thresholdWaitMs: 30 * 60 * 1000
    }
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
  }), "phantasialand"));

  const EXTERNAL_FALLBACK_RIDES = {};
  EXTERNAL_PARK_MODULES.forEach((module) => {
    EXTERNAL_FALLBACK_RIDES[module.park.slug] = (module.rides || []).map((ride) =>
      enrichRide(Object.assign({}, ride, {
        wait: null,
        isOpen: null,
        trend: "flat",
        delta: 0,
        source: "fallback",
        lastUpdated: null
      }), module.park.slug)
    );
  });

  function fallbackRidesFor(parkSlug = activeParkSlug || "phantasialand") {
    return EXTERNAL_FALLBACK_RIDES[parkSlug] || FALLBACK_RIDES;
  }

  function canonicalRideForPark(rideId, parkSlug = activeParkSlug || "phantasialand") {
    return fallbackRidesFor(parkSlug).find((ride) => ride.id === rideId) || null;
  }

  function canonicalRideName(rideId, parkSlug = activeParkSlug || "phantasialand", fallbackName = "") {
    return canonicalRideForPark(rideId, parkSlug)?.name || fallbackName || rideId;
  }

  function canonicalRideZone(rideId, parkSlug = activeParkSlug || "phantasialand", fallbackZone = "") {
    return canonicalRideForPark(rideId, parkSlug)?.zone || fallbackZone || PARKS[parkSlug]?.name || "Park";
  }

  function localizeStoredSession(session, parkSlug = activeParkSlug || "phantasialand") {
    if (!session) return session;
    return Object.assign({}, session, {
      rideName: canonicalRideName(session.rideId, parkSlug, session.rideName),
      parkSlug: session.parkSlug || parkSlug
    });
  }

  function normalizeArchiveEntry(entry, parkSlug = activeParkSlug || "phantasialand") {
    if (!entry) return null;
    const day = entry.day || entry.parkDay || entry;
    const archivedSessions = (entry.sessions || []).map((session) => localizeStoredSession(session, parkSlug));
    return { day: day, sessions: archivedSessions };
  }

  function parkDayStartMs(day) {
    const value = day?.started_at || day?.startedAt;
    const time = value ? new Date(value).getTime() : 0;
    return Number.isFinite(time) ? time : 0;
  }

  function parkDayEndMs(day) {
    const value = day?.ended_at || day?.endedAt;
    const time = value ? new Date(value).getTime() : 0;
    return Number.isFinite(time) ? time : 0;
  }

  function formatDurationHuman(ms) {
    const totalMinutes = Math.max(0, Math.round(Number(ms || 0) / 60000));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours && minutes) return hours + " Std. " + minutes + " Min.";
    if (hours) return hours + " Std.";
    return totalMinutes + " Min.";
  }

  function median(numbers) {
    const values = numbers.filter(Number.isFinite).slice().sort((a, b) => a - b);
    if (!values.length) return 0;
    const middle = Math.floor(values.length / 2);
    return values.length % 2 ? values[middle] : (values[middle - 1] + values[middle]) / 2;
  }

  let deferredInstall = null;
  let supa = null;
  let user = null;
  let localMode = false;
  let authMode = "login";
  let rides = FALLBACK_RIDES.slice();
  let rideSearch = "";
  let onlyFavorites = false;
  let lastSheetFocus = null;
  let activeParkSlug = null;
  let liveRefreshTimer = null;
  let liveVisibilityBound = false;
  const WORLD = {
    taron: {
      label:"KLUGHEIM · DER PULS",
      line:"Zwischen Basalt, Schienen und dem Widder von Klugheim.",
      art:"taron",
      badgeUrl:"https://www.phantasialand.de/files/uploads/schmuckelemente/mystery/se-widderkopf-lila_01.svg",
      officialUrl:"https://www.phantasialand.de/de/themenpark/einzigartige-attraktionen/taron/",
      source:"official-attraction-page"
    },
    "river-quest": {label:"MYSTERY · WASSERWEG", line:"Die Burg verschluckt den Fluss.", art:"river-quest"},
    fly: {
      label:"ROOKBURGH · FLUGJOURNAL",
      line:"Die Flugmaschine schneidet durch Stahl, Dampf und Rookburgh.",
      art:"fly",
      badgeUrl:"./assets/fly-logo-user.webp",
      officialUrl:"https://www.phantasialand.de/de/rookburgh/fly/",
      source:"user-supplied-logo"
    },
    "black-mamba": {
      label:"DEEP IN AFRICA · DSCHUNGEL",
      line:"Zwischen Fels, Wasserfall und der Königin der Schlangen.",
      art:"black-mamba",
      badgeUrl:"https://www.phantasialand.de/files/uploads/schmuckelemente/africa/se-maske-gelb_01.svg",
      officialUrl:"https://www.phantasialand.de/de/themenpark/einzigartige-attraktionen/black-mamba/",
      source:"official-attraction-page"
    },
    chiapas: {
      label:"MEXICO · EXPEDITION",
      line:"Zwischen Maya-Ruinen, Wasserfällen und dem Chiapas-Boot.",
      artUrl:"https://static.phlcdn.de/files/uploads/themenpark/images/sommer/mexico/chiapas/2026/ga-chiapas-2026_03.jpg",
      badgeUrl:"./assets/chiapas-logo-user.webp",
      officialUrl:"https://www.phantasialand.de/de/themenpark/einzigartige-attraktionen/chiapas-die-wasserbahn/",
      source:"user-supplied-logo"
    },
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
  let parkArchive = [];
  let achievements = {};
  let fairPrices = {};

  function attractionFontConfig(rideId, parkSlug = activeParkSlug || "phantasialand") {
    const module = parkModuleFor(parkSlug);
    if (module) return module.fonts?.[rideId] || null;
    return ATTRACTION_FONTS[rideId] || null;
  }

  function worldForRide(rideId, parkSlug = activeParkSlug || "phantasialand") {
    const module = parkModuleFor(parkSlug);
    if (module) return module.worlds?.[rideId] || null;
    return WORLD[rideId] || null;
  }

  function aliasesForPark(parkSlug = activeParkSlug || "phantasialand") {
    const module = parkModuleFor(parkSlug);
    if (module) return module.aliases || {};
    return RIDE_ALIASES;
  }

  function rideConfigForPark(parkSlug = activeParkSlug || "phantasialand") {
    const module = parkModuleFor(parkSlug);
    if (module) return module.rideConfig || {};
    return RIDE_CONFIG;
  }

  function rideSpeedKmh(rideId, parkSlug = activeParkSlug || "phantasialand") {
    const value = Number(rideConfigForPark(parkSlug)?.[rideId]?.speedKmh);
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  function achievementStoreKey() {
    return currentUserId()
      ? "naehen:achievements:" + currentUserId()
      : "naehen:achievements:local";
  }

  function loadAchievementState(appUser = user) {
    const local = store.get(achievementStoreKey(), {});
    const cloud = !localMode && appUser?.user_metadata?.naehen_achievements;
    achievements = cloud && typeof cloud === "object" && !Array.isArray(cloud)
      ? Object.assign({}, local, cloud)
      : local;
    store.set(achievementStoreKey(), achievements);
  }

  async function persistAchievements() {
    store.set(achievementStoreKey(), achievements);
    if (!supa || localMode || !currentUserId()) return;

    try {
      const result = await supa.auth.updateUser({
        data: { naehen_achievements: achievements }
      });
      if (result?.data?.user) user = result.data.user;
      if (result?.error) console.warn("Achievements konnten nicht synchronisiert werden", result.error);
    } catch (error) {
      console.warn("Achievements konnten nicht synchronisiert werden", error);
    }
  }

  async function unlockAchievement(id, context = {}) {
    const definition = ACHIEVEMENT_DEFINITIONS[id];
    if (!definition || achievements[id]) return null;

    achievements[id] = {
      id: id,
      unlockedAt: Date.now(),
      rideId: context.rideId || null,
      rideName: context.rideName || null,
      parkSlug: context.parkSlug || null,
      speedKmh: context.speedKmh || null,
      waitedMinutes: context.waitedMinutes || null
    };
    await persistAchievements();
    renderProfile();
    return Object.assign({}, definition, achievements[id]);
  }

  async function evaluateRideAchievements(session) {
    if (!session || session.status !== "ridden") return [];
    const unlockedNow = [];
    const parkSlug = session.parkSlug || activeParkSlug || "phantasialand";
    const speedKmh = Number(session.speedKmh) || rideSpeedKmh(session.rideId, parkSlug);
    const speedAchievement = ACHIEVEMENT_DEFINITIONS.beschleunigger;

    if (speedKmh !== null && speedKmh >= speedAchievement.thresholdKmh) {
      const unlocked = await unlockAchievement("beschleunigger", {
        rideId: session.rideId,
        rideName: session.rideName,
        parkSlug: parkSlug,
        speedKmh: speedKmh
      });
      if (unlocked) unlockedNow.push(unlocked);
    }

    const waitAchievement = ACHIEVEMENT_DEFINITIONS["ich-hab-mir-das-nicht-ausgesucht"];
    if (Number(session.duration) >= waitAchievement.thresholdWaitMs) {
      const waitedMinutes = Math.floor(Number(session.duration) / 60000);
      const unlocked = await unlockAchievement("ich-hab-mir-das-nicht-ausgesucht", {
        rideId: session.rideId,
        rideName: session.rideName,
        parkSlug: parkSlug,
        waitedMinutes: waitedMinutes
      });
      if (unlocked) unlockedNow.push(unlocked);
    }

    return unlockedNow;
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

  function enrichRide(ride, parkSlug = activeParkSlug || "phantasialand") {
    const config = rideConfigForPark(parkSlug)[ride.id] || { singleRider: false };
    ride.singleRider = !!config.singleRider;
    ride.speedKmh = Number.isFinite(Number(config.speedKmh)) ? Number(config.speedKmh) : null;
    ride.parkSlug = parkSlug;
    return ride;
  }

  function slugRide(name, parkSlug = activeParkSlug || "phantasialand") {
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
    const low = String(name || "")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .toLowerCase()
      .trim();
    const aliases = aliasesForPark(parkSlug);

    if (parkSlug === "phantasialand" && known[low]) return known[low];
    if (aliases[low]) return aliases[low];
    if (parkSlug === "phantasialand" && low.startsWith("chiapas")) return "chiapas";

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

  function isDesktopDevMode() {
    const enabled = new URLSearchParams(window.location.search).get("dev") === "1";
    const mobile = /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
    return enabled && !mobile;
  }

  function canEnterApp() {
    return isStandalone() || isDesktopDevMode();
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
    if (id === "archiveDetailSheet" && !options.fromPopState && history.state?.naehenArchiveDetail) {
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

  function parkStoreKey(base, parkSlug = activeParkSlug || "phantasialand") {
    return base + ":" + parkSlug;
  }

  function loadLocalParkState(parkSlug) {
    const legacy = parkSlug === "phantasialand";
    parkDay = store.get(parkStoreKey("naehen:parkDay", parkSlug), legacy ? store.get("naehen:parkDay", null) : null);
    sessions = store.get(parkStoreKey("naehen:sessions", parkSlug), legacy ? store.get("naehen:sessions", []) : [])
      .map((session) => localizeStoredSession(session, parkSlug));
    active = localizeStoredSession(
      store.get(parkStoreKey("naehen:active", parkSlug), legacy ? store.get("naehen:active", null) : null),
      parkSlug
    );
    favorites = store.get(parkStoreKey("naehen:favorites", parkSlug), legacy ? store.get("naehen:favorites", []) : []);
    favoriteSettings = store.get(parkStoreKey("naehen:favoriteSettings", parkSlug), legacy ? store.get("naehen:favoriteSettings", {}) : {});
    fairPrices = store.get(parkStoreKey("naehen:fairPrices", parkSlug), {});
    if (!fairPrices || typeof fairPrices !== "object" || Array.isArray(fairPrices)) fairPrices = {};
    srReportsLocal = store.get(parkStoreKey("naehen:srReports", parkSlug), legacy ? store.get("naehen:srReports", []) : []);
    parkArchive = store.get(parkStoreKey("naehen:parkArchive", parkSlug), [])
      .map((entry) => normalizeArchiveEntry(entry, parkSlug))
      .filter(Boolean);

    // One-time migration: preserve the last pre-v60 local park day before a new day clears it.
    if (!parkDay && !parkArchive.length) {
      const legacySessions = sessions.filter((session) => session.status !== "waiting" && session.endedAt);
      if (legacySessions.length) {
        const starts = legacySessions.map((session) => Number(session.startedAt)).filter(Number.isFinite);
        const ends = legacySessions.map((session) => Number(session.endedAt)).filter(Number.isFinite);
        if (starts.length && ends.length) {
          const syntheticDay = {
            id: "legacy-" + parkSlug + "-" + Math.min(...starts),
            park_slug: parkSlug,
            started_at: new Date(Math.min(...starts)).toISOString(),
            ended_at: new Date(Math.max(...ends)).toISOString(),
            migrated: true
          };
          parkArchive = [{ day: syntheticDay, sessions: legacySessions.map((session) => Object.assign({}, session)) }];
          store.set(parkStoreKey("naehen:parkArchive", parkSlug), parkArchive);
        }
      }
    }

    totalRideCount = store.get(
      parkStoreKey("naehen:totalRideCount", parkSlug),
      sessions.filter((session) => session.status === "ridden").length
    );
  }

  async function loadParkArtManifest(parkSlug) {
    const module = parkModuleFor(parkSlug);
    const park = PARKS[parkSlug];
    if (!module || !park?.artManifestUrl || module._artManifestLoaded) return;

    try {
      const response = await fetch(park.artManifestUrl + "?t=" + Date.now(), { cache: "no-store" });
      if (!response.ok) throw new Error("Art manifest HTTP " + response.status);
      const manifest = await response.json();

      Object.entries(manifest.rides || {}).forEach(([rideId, imageUrl]) => {
        if (module.worlds?.[rideId] && imageUrl) module.worlds[rideId].artUrl = imageUrl;
      });

      if (manifest.parkCardImage) park.cardImage = manifest.parkCardImage;
      module._artManifestLoaded = true;
    } catch (error) {
      console.warn("Park-Art konnte nicht geladen werden", parkSlug, error);
    }
  }

  function hydrateParkPickerArt() {
    Object.values(PARKS).forEach(async (park) => {
      if (!park.artManifestUrl) return;
      await loadParkArtManifest(park.slug);
      const img = document.querySelector('.parkChoice[data-park="' + park.slug + '"] .parkChoiceArt');
      if (img && park.cardImage) {
        img.src = park.cardImage;
        img.hidden = false;
      }
    });
  }

  function activeParkConfig() {
    return activeParkSlug ? PARKS[activeParkSlug] || null : null;
  }

  function venueIsFair(parkSlug = activeParkSlug) {
    return !!(parkSlug && PARKS[parkSlug]?.kind === "fair");
  }

  function visitDayWord(parkSlug = activeParkSlug) {
    return venueIsFair(parkSlug) ? "Kirmestag" : "Parktag";
  }

  function visitDayPlural(parkSlug = activeParkSlug) {
    return venueIsFair(parkSlug) ? "Kirmestage" : "Parktage";
  }

  function parkHasPublicLiveWaits(parkSlug = activeParkSlug) {
    const park = parkSlug ? PARKS[parkSlug] : null;
    return !!(park && park.liveWaits !== false && park.liveDataUrl);
  }

  let selectedVenueKind = null;
  function renderParkPicker() {
    const grid = $("#parkGrid");
    if (!grid) return;

    const category = selectedVenueKind;
    const today = new Date(); today.setHours(0,0,0,0);
    const available = Object.values(PARKS).filter(p => category && (p.kind === "fair" ? "fair" : "park") === category)
      .sort((a,b) => {
        if (category !== "fair") return a.name.localeCompare(b.name,"de");
        const rank = p => {
          const start = new Date(p.startDate || "2100-01-01T00:00:00");
          const end = new Date((p.endDate || p.startDate || "2100-01-01") + "T23:59:59");
          return end >= today && start <= today ? 0 : start > today ? 1 : 2;
        };
        const ar=rank(a),br=rank(b);
        if(ar!==br)return ar-br;
        return ar===2 ? (b.startDate||"").localeCompare(a.startDate||"") : (a.startDate||"").localeCompare(b.startDate||"");
      });
    const chooser = $("#venueKindChooser");
    const listing = $("#venueListing");
    if(chooser) chooser.classList.toggle("hidden",!!category);
    if(listing) listing.classList.toggle("hidden",!category);
    const heading=$("#venueKindHeading");
    if(heading) heading.textContent=category==="fair"?"Kirmessen":"Freizeitparks";
    grid.innerHTML = available.map((park) => {
      const fair = park.kind === "fair";
      return "<button class=\"parkChoice\" type=\"button\" data-park=\"" + escapeHtml(park.slug) + "\" data-kind=\"" + (fair ? "fair" : "park") + "\">" +
        (park.cardImage
          ? "<img class=\"parkChoiceArt\" src=\"" + escapeHtml(park.cardImage) + "\" alt=\"\" loading=\"eager\">"
          : "<img class=\"parkChoiceArt\" alt=\"\" loading=\"eager\" hidden>") +
        "<span class=\"parkChoiceCopy\">" +
          "<span class=\"parkChoiceMeta\">" + (fair ? "KIRMES · " : "") + escapeHtml(park.location) + "</span>" +
          "<h2>" + escapeHtml(park.name) + "</h2>" +
          "<p>" + escapeHtml(park.cardCopy) + "</p>" +
          "<span class=\"parkChoiceOpen\"><span>" + (fair ? "Kirmes öffnen" : "Park öffnen") + "</span><span class=\"parkChoiceArrow\" aria-hidden=\"true\">→</span></span>" +
        "</span>" +
      "</button>";
    }).join("");

    const count = $("#parkCount");
    if (count) count.textContent = available.length + (available.length === 1 ? " Ziel verfügbar" : " Ziele verfügbar");

    grid.querySelectorAll("[data-park]").forEach((button) => {
      button.addEventListener("click", () => openPark(button.dataset.park));
    });

    if(category) hydrateParkPickerArt();
  }

  function setVenueKind(kind) {
    if(kind!=="fair" && kind!=="park") return;
    selectedVenueKind=kind;
    renderParkPicker();
  }

  function stopLiveRefresh() {
    if (liveRefreshTimer) {
      window.clearInterval(liveRefreshTimer);
      liveRefreshTimer = null;
    }
  }

  function startLiveRefresh() {
    stopLiveRefresh();
    if (!parkHasPublicLiveWaits()) return;

    liveRefreshTimer = window.setInterval(() => {
      if (activeParkSlug && parkHasPublicLiveWaits()) loadLiveWaits();
    }, LIVE_REFRESH_MS);

    if (!liveVisibilityBound) {
      liveVisibilityBound = true;
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible" && activeParkSlug && parkHasPublicLiveWaits()) loadLiveWaits();
      }, { passive: true });
    }
  }

  function showParkPicker(options = {}) {
    stopLiveRefresh();
    activeParkSlug = null;
    document.body.removeAttribute("data-park");
    $("#app")?.classList.add("hidden");
    $("#nav")?.classList.add("hidden");
    $("#parkPicker")?.classList.remove("hidden");
    document.body.classList.remove("modalOpen");
    document.querySelectorAll(".sheet.show").forEach((sheet) => sheet.classList.remove("show"));
    selectedVenueKind = null;
    renderParkPicker();

    if (options.replaceHistory) {
      history.replaceState({ naehenParkPicker: true }, "", location.href);
    }
  }

  async function openPark(parkSlug, options = {}) {
    const park = PARKS[parkSlug];
    if (!park) return;

    activeParkSlug = parkSlug;
    await loadParkArtManifest(parkSlug);
    document.body.dataset.park = parkSlug;
    if (park.cardImage) {
      document.body.style.setProperty("--park-hero-image", 'url("' + park.cardImage.replace(/"/g, '\"') + '")');
    } else {
      document.body.style.removeProperty("--park-hero-image");
    }
    rides = fallbackRidesFor(parkSlug).map((ride) => Object.assign({}, ride));
    selectedRide = null;
    selectedDetailRide = null;
    $("#parkPicker")?.classList.add("hidden");
    $("#app")?.classList.remove("hidden");
    $("#nav")?.classList.remove("hidden");

    if (options.pushHistory !== false) {
      history.pushState({ naehenPark: parkSlug }, "", location.href);
    }

    const dayWord = visitDayWord(parkSlug);
    const eyebrow = $("#parkDayEyebrow");
    if (eyebrow) eyebrow.textContent = park.name + " · " + dayWord;
    const dayIndex = $("#visitDayIndex");
    if (dayIndex) dayIndex.textContent = "01 / " + (venueIsFair(parkSlug) ? "KIRMESTAG" : "PARKDAY");
    const archiveTitle = $("#archiveViewTitle");
    if (archiveTitle) archiveTitle.textContent = dayWord + "-Archiv";
    const archiveIntroTitle = $("#archiveIntroTitle");
    if (archiveIntroTitle) archiveIntroTitle.textContent = "Deine " + visitDayPlural(parkSlug) + " verschwinden nicht mehr.";
    const archiveIntroCopy = $("#archiveIntroCopy");
    if (archiveIntroCopy) archiveIntroCopy.textContent = "Jeder abgeschlossene " + dayWord + " bleibt mit Fahrten, echten Queue-Zeiten und Nerd-Statistiken erhalten.";
    const profileDayCountLabel = $("#profileDayCountLabel");
    if (profileDayCountLabel) profileDayCountLabel.textContent = "Gespeicherte " + visitDayPlural(parkSlug) + " in diesem " + (venueIsFair(parkSlug) ? "Event" : "Park");
    const recapEyebrow = $("#recapDayEyebrow");
    if (recapEyebrow) recapEyebrow.textContent = dayWord + " abgeschlossen";
    const archiveDetailEyebrow = $("#archiveDetailEyebrow");
    if (archiveDetailEyebrow) archiveDetailEyebrow.textContent = "Gespeicherter " + dayWord;
    const disclaimer = $("#parkDisclaimer");
    if (disclaimer) disclaimer.innerHTML = "NÄHEN · Dein unabhängiger " + (venueIsFair(parkSlug) ? "Kirmesbegleiter" : "Parkbegleiter") + ".<br>" + escapeHtml(park.disclaimer);

    rideSearch = "";
    onlyFavorites = false;
    const rideSearchInput = $("#rideSearch");
    if (rideSearchInput) rideSearchInput.value = "";
    const favoriteFilter = $("#favoriteFilter");
    if (favoriteFilter) favoriteFilter.setAttribute("aria-pressed", "false");

    // Always hydrate the last local snapshot first so the park can render immediately,
    // even when Supabase is slow or temporarily unavailable.
    loadLocalParkState(parkSlug);

    persistLocalState();
    switchView("homeView");
    renderAll();

    // Public live waits are independent from account sync.
    startLiveRefresh();
    const livePromise = loadLiveWaits();

    if (!localMode) {
      loadAccountState(parkSlug)
        .then(() => {
          if (activeParkSlug !== parkSlug) return;
          persistLocalState();

          // Keep whatever live ride objects may already have arrived.
          // Account sync only refreshes personal state around them.
          renderParkDay();
          renderStats();
          renderLog();
          renderProfile();
          renderRides();
        })
        .catch((error) => {
          console.warn("Account-Parkdaten konnten nicht geladen werden", error);
          if (activeParkSlug === parkSlug) renderAll();
        });

      loadCloudParkArchive(parkSlug)
        .then(() => {
          if (activeParkSlug !== parkSlug) return;
          persistLocalState();
          renderParkArchive();
          renderProfile();
        })
        .catch((error) => console.warn("Parktag-Archiv konnte im Hintergrund nicht geladen werden", error));
    }

    await livePromise;
  }

  function persistLocalState() {
    if (!activeParkSlug) return;
    const slug = activeParkSlug;
    store.set(parkStoreKey("naehen:parkDay", slug), parkDay);
    store.set(parkStoreKey("naehen:sessions", slug), sessions);
    if (active) store.set(parkStoreKey("naehen:active", slug), active);
    else store.remove(parkStoreKey("naehen:active", slug));
    store.set(parkStoreKey("naehen:favorites", slug), favorites);
    store.set(parkStoreKey("naehen:favoriteSettings", slug), favoriteSettings);
    store.set(parkStoreKey("naehen:fairPrices", slug), fairPrices);
    store.set(parkStoreKey("naehen:totalRideCount", slug), totalRideCount);
    store.set(parkStoreKey("naehen:srReports", slug), srReportsLocal);
    store.set(parkStoreKey("naehen:parkArchive", slug), parkArchive);
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
        const registration = await navigator.serviceWorker.register("./sw.js?v=80", {
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

    // Installation is mandatory for normal visitors. Desktop ?dev=1 is the explicit test bypass.
    store.remove("naehen:skipInstall");
    if (!canEnterApp()) {
      showGate("#installGate");
      return;
    }

    await continueAfterInstall();
  }

  async function continueAfterInstall() {
    // Defense in depth: auth is only reachable from the installed PWA or explicit desktop dev mode.
    if (!canEnterApp()) {
      showGate("#installGate");
      return;
    }

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
    if (!canEnterApp()) {
      showGate("#installGate");
      return;
    }

    user = appUser || null;
    localMode = !!useLocalMode;
    if (isDesktopDevMode()) document.documentElement.dataset.devMode = "browser";
    else delete document.documentElement.dataset.devMode;
    ["#installGate", "#setupGate", "#authGate"].forEach(hideGate);
    $("#app").classList.add("hidden");
    $("#nav").classList.add("hidden");

    if (localMode) {
      $("#accountMode").textContent = isDesktopDevMode() ? "DEV-BROWSER · Lokaler Testmodus" : "Lokaler Testmodus";
      $("#profileName").textContent = "Lokaler Parkfan";
      $("#profileMail").textContent = "Nur auf diesem Gerät";
      parkDay = null;
      sessions = [];
      active = null;
      favorites = [];
      favoriteSettings = {};
      parkArchive = [];
      totalRideCount = 0;
    } else {
      $("#accountMode").textContent = (isDesktopDevMode() ? "DEV-BROWSER · " : "") + (appUser.email || "Account");
      $("#profileName").textContent = (appUser.user_metadata && appUser.user_metadata.username) || (appUser.email ? appUser.email.split("@")[0] : "Parkfan");
      $("#profileMail").textContent = appUser.email || "";
    }

    loadAchievementState(appUser);

    const pickerAccount = $("#parkPickerAccount");
    if (pickerAccount) {
      pickerAccount.textContent = localMode
        ? (isDesktopDevMode() ? "DEV-BROWSER · Lokaler Testmodus" : "Lokaler Testmodus")
        : ((isDesktopDevMode() ? "DEV-BROWSER · " : "") + ((appUser.user_metadata && appUser.user_metadata.username) || appUser.email || "Account"));
    }

    renderParkPicker();
    showParkPicker({ replaceHistory: true });
  }

  async function loadCloudParkArchive(parkSlug = activeParkSlug || "phantasialand") {
    if (!supa || !currentUserId()) {
      parkArchive = [];
      return;
    }

    const daysResult = await supa
      .from("park_days")
      .select("*")
      .eq("user_id", currentUserId())
      .eq("park_slug", parkSlug)
      .not("ended_at", "is", null)
      .order("started_at", { ascending: false });

    if (daysResult.error) {
      console.warn("Parktag-Archiv konnte nicht geladen werden", daysResult.error);
      parkArchive = [];
      return;
    }

    const days = daysResult.data || [];
    if (!days.length) {
      parkArchive = [];
      return;
    }

    const dayIds = days.map((day) => day.id);
    const sessionResult = await supa
      .from("queue_sessions")
      .select("*")
      .eq("user_id", currentUserId())
      .in("park_day_id", dayIds)
      .order("started_at", { ascending: true });

    if (sessionResult.error) {
      console.warn("Archiv-Fahrten konnten nicht geladen werden", sessionResult.error);
      parkArchive = days.map((day) => ({ day: day, sessions: [] }));
      return;
    }

    const grouped = new Map();
    (sessionResult.data || []).forEach((row) => {
      if (!grouped.has(row.park_day_id)) grouped.set(row.park_day_id, []);
      grouped.get(row.park_day_id).push(dbSessionToClient(row, parkSlug));
    });

    parkArchive = days.map((day) => ({
      day: day,
      sessions: grouped.get(day.id) || []
    }));
  }

  async function loadAccountState(parkSlug = activeParkSlug || "phantasialand") {
    if (!supa || !currentUserId()) return;

    const activeDayResult = await supa
      .from("park_days")
      .select("*")
      .eq("user_id", currentUserId())
      .eq("park_slug", parkSlug)
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

      if (!sessionResult.error) sessions = (sessionResult.data || []).map((row) => dbSessionToClient(row, parkSlug));

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
      const activeRideIds = new Set(fallbackRidesFor(parkSlug).map((ride) => ride.id));
      const parkFavoriteRows = (favoriteResult.data || []).filter((row) => activeRideIds.has(row.ride_id));
      favorites = parkFavoriteRows.map((row) => row.ride_id);
      favoriteSettings = {};
      parkFavoriteRows.forEach((row) => {
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

  function dbSessionToClient(row, parkSlug = activeParkSlug || "phantasialand") {
    return {
      id: row.id,
      rideId: row.ride_id,
      rideName: canonicalRideName(row.ride_id, parkSlug, row.ride_name),
      parkSlug: parkSlug,
      type: row.queue_type,
      posted: row.posted_wait,
      startedAt: new Date(row.started_at).getTime(),
      endedAt: row.ended_at ? new Date(row.ended_at).getTime() : null,
      duration: typeof row.wait_seconds === "number" ? row.wait_seconds * 1000 : null,
      status: row.status,
      priceEuro: row.price_euro === null || row.price_euro === undefined ? null : Number(row.price_euro),
      parkDayId: row.park_day_id,
      synced: true
    };
  }

  async function fetchRealtimeLivePayload(park) {
    if (!supa || !currentUserId() || !cfg.supabaseUrl || !cfg.supabaseAnonKey) return null;

    try {
      const sessionResult = await supa.auth.getSession();
      const accessToken = sessionResult?.data?.session?.access_token;
      if (!accessToken) return null;

      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 6500);
      const response = await fetch(
        cfg.supabaseUrl.replace(/\/$/, "") + "/functions/v1/live-waits?park=" + encodeURIComponent(park.slug) + "&t=" + Date.now(),
        {
          cache: "no-store",
          signal: controller.signal,
          headers: {
            "Accept": "application/json",
            "apikey": cfg.supabaseAnonKey,
            "Authorization": "Bearer " + accessToken
          }
        }
      );
      window.clearTimeout(timer);
      if (!response.ok) throw new Error("Edge-Live HTTP " + response.status);
      return await response.json();
    } catch (error) {
      console.warn("Realtime-Liveproxy nicht erreichbar", error);
      return null;
    }
  }

  async function fetchSnapshotFallback(park) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 6500);
    try {
      const response = await fetch(park.liveDataUrl + "?t=" + Date.now(), {
        cache: "no-store",
        signal: controller.signal
      });
      if (!response.ok) throw new Error("Live-Snapshot HTTP " + response.status);
      const data = await response.json();
      data._naehen = Object.assign({}, data._naehen || {}, { source: "github-fallback" });
      return data;
    } finally {
      window.clearTimeout(timer);
    }
  }

  async function loadLiveWaits() {
    const label = $("#dataLabel");
    if (!label) return;

    const park = activeParkConfig();
    if (!park) return;

    if (!parkHasPublicLiveWaits(park.slug)) {
      rides = fallbackRidesFor(park.slug).map((ride) => Object.assign({}, ride));
      label.textContent = park.noLiveLabel || "KEINE ÖFFENTLICHEN LIVE-WARTEZEITEN";
      renderRides();
      return;
    }

    try {
      label.textContent = "LIVE WIRD GELADEN…";

      let data = await fetchRealtimeLivePayload(park);
      if (!data) data = await fetchSnapshotFallback(park);
      const previous = store.get("naehen:lastWaits:" + park.slug, {});
      const flattened = [];

      (data.lands || []).forEach((land) => {
        (land.rides || []).forEach((ride) => {
          flattened.push(Object.assign({}, ride, { zone: land.name || park.name }));
        });
      });
      (data.rides || []).forEach((ride) => {
        flattened.push(Object.assign({}, ride, { zone: park.name }));
      });
      if (!flattened.length) throw new Error("Keine Attraktionen in Live-Snapshot");

      const nowState = {};
      const mappedLiveRides = flattened.map((raw) => {
        const id = slugRide(raw.name, park.slug);
        if (isExcludedRide(raw.name, id, park.slug)) return null;
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
          name: canonicalRideName(id, park.slug, raw.name),
          zone: canonicalRideZone(id, park.slug, raw.zone),
          providerName: raw.name,
          wait: wait,
          isOpen: !!raw.is_open,
          trend: trend,
          delta: delta,
          source: "queue-times",
          lastUpdated: raw.last_updated || null
        }, park.slug);
      }).filter(Boolean);

      const liveById = new Map();
      mappedLiveRides.forEach((ride) => {
        const existing = liveById.get(ride.id);
        if (!existing || (!existing.isOpen && ride.isOpen)) liveById.set(ride.id, ride);
      });
      rides = Array.from(liveById.values());

      const liveIds = new Set(rides.map(ride => ride.id));
      fallbackRidesFor(park.slug).forEach(ride => { if (!liveIds.has(ride.id)) rides.push(Object.assign({}, ride)); });

      rides.sort((a, b) => {
        const aFav = favorites.includes(a.id) ? 0 : 1;
        const bFav = favorites.includes(b.id) ? 0 : 1;
        return aFav - bFav || a.name.localeCompare(b.name, "de");
      });

      store.set("naehen:lastWaits:" + park.slug, nowState);

      const liveMeta = data._naehen || {};
      const ageMs = Number(liveMeta.ageMs) || 0;
      if (liveMeta.source === "queue-times-direct") {
        label.textContent = "LIVE · DIREKT";
      } else if (liveMeta.source === "edge-cache") {
        label.textContent = "LIVE · " + Math.max(0, Math.round(ageMs / 1000)) + "s ALT";
      } else if (liveMeta.source === "stale-cache") {
        label.textContent = "LIVE-FALLBACK · " + Math.max(1, Math.round(ageMs / 60000)) + " MIN ALT";
      } else {
        label.textContent = "LIVE · BACKUP-SNAPSHOT";
      }
      renderRides();
    } catch (error) {
      console.warn("Live-Snapshot konnte nicht geladen werden", error);
      label.textContent = "LIVE NICHT ERREICHBAR";
      if (!rides.some((r) => r.source === "queue-times")) rides = fallbackRidesFor(park.slug).map((ride) => Object.assign({}, ride));
      renderRides();
    }
  }

  function renderAll() {
    renderParkDay();
    renderRides();
    renderStats();
    renderLog();
    renderParkArchive();
    renderProfile();
    updateActiveTimer();
  }

  function renderParkDay() {
    const button = $("#parkDayBtn");
    const headline = $("#parkDayHeadline");
    if (!button || !headline) return;

    const fair = venueIsFair();
    const dayWord = fair ? "KIRMESTAG" : "PARKTAG";

    if (parkDay) {
      button.textContent = dayWord + " BEENDEN";
      button.classList.remove("primary");
      button.classList.add("secondary");
      const start = new Date(parkDay.started_at || parkDay.startedAt || Date.now());
      headline.textContent = "Seit " + start.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) + " wird genäht.";
      $("#logDayLabel").textContent = "AKTUELLER " + dayWord;
    } else {
      button.textContent = dayWord + " STARTEN";
      button.classList.remove("secondary");
      button.classList.add("primary");
      headline.textContent = sessions.length ? "Letzte Nähbilanz steht." : "Heute wird genäht.";
      $("#logDayLabel").textContent = sessions.length ? "LETZTER " + dayWord : "NOCH NICHT GESTARTET";
    }
  }

  function manualFairPrice(rideId) {
    const value = Number(fairPrices?.[rideId]);
    return Number.isFinite(value) && value >= 0 ? value : null;
  }

  function formatEuro(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "–";
    return number.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + " €";
  }

  function ridePriceText(ride) {
    const value = manualFairPrice(ride?.id);
    return value === null ? "manuell eintragen" : formatEuro(value);
  }

  function fairReceiptHtml(sourceSessions, sourceDay) {
    const sessionsForReceipt = (sourceSessions || [])
      .filter((session) => session.status === "ridden")
      .slice()
      .sort((a, b) => Number(a.startedAt || 0) - Number(b.startedAt || 0));

    const rows = sessionsForReceipt.map((session, index) => {
      const price = Number(session.priceEuro);
      const hasPrice = Number.isFinite(price) && price >= 0;
      return "<div class=\"fairReceiptRow\">" +
        "<span class=\"fairReceiptQty\">" + String(index + 1).padStart(2, "0") + "</span>" +
        "<div><b>" + escapeHtml(session.rideName || "Fahrt") + "</b><small>" + escapeHtml(rideTimeLabel(session)) + "</small></div>" +
        "<strong>" + escapeHtml(hasPrice ? formatEuro(price) : "PREIS FEHLT") + "</strong>" +
      "</div>";
    }).join("");

    const priced = sessionsForReceipt
      .map((session) => Number(session.priceEuro))
      .filter((price) => Number.isFinite(price) && price >= 0);
    const total = priced.reduce((sum, price) => sum + price, 0);
    const missing = sessionsForReceipt.length - priced.length;
    const average = priced.length ? total / priced.length : 0;
    const dayDate = sourceDay?.started_at || sourceDay?.startedAt || Date.now();
    const receiptParkSlug = sourceDay?.park_slug || sourceDay?.parkSlug || sessionsForReceipt[0]?.parkSlug || activeParkSlug || "phantasialand";
    const receiptPark = PARKS[receiptParkSlug] || {};
    const receiptTitle = String(receiptPark.receiptTitle || receiptPark.name || "Kirmes").toUpperCase();
    const receiptLocation = receiptPark.receiptLocation ? "<br>" + escapeHtml(String(receiptPark.receiptLocation).toUpperCase()) : "";

    return "<div class=\"fairReceipt\">" +
      "<div class=\"fairReceiptBrand\">NÄHEN.</div>" +
      "<div class=\"fairReceiptMeta\">" + escapeHtml(receiptTitle) + receiptLocation + "<br>" +
        escapeHtml(new Date(dayDate).toLocaleDateString("de-DE")) +
      "</div>" +
      "<div class=\"fairReceiptRule\"></div>" +
      (rows || "<div class=\"fairReceiptEmpty\">Noch keine Fahrt auf diesem Kirmestag.</div>") +
      "<div class=\"fairReceiptRule\"></div>" +
      "<div class=\"fairReceiptTotal\"><span>GESAMT</span><b>" + escapeHtml(formatEuro(total)) + "</b></div>" +
      "<div class=\"fairReceiptFoot\">" +
        sessionsForReceipt.length + " Fahrt" + (sessionsForReceipt.length === 1 ? "" : "en") +
        (priced.length ? " · Ø " + escapeHtml(formatEuro(average)) + " / Fahrt" : "") +
        (missing ? "<br>" + missing + " Preis" + (missing === 1 ? "" : "e") + " fehlt/fehlen" : "") +
        "<br>Alle Fahrpreise wurden pro Fahrt manuell von dir eingetragen." +
        "<br><b>Danke fürs Nähen.</b>" +
      "</div>" +
    "</div>";
  }


  function renderSpecialVenueMap() {
    const section = $("#venueSpecialMap");
    const canvas = $("#venueMapCanvas");
    const key = $("#venueMapKey");
    const source = $("#venueMapSource");
    const title = $("#venueMapTitle");
    const eyebrow = $("#venueMapEyebrow");
    const subtitle = $("#venueMapSubtitle");
    const note = $("#venueMapNote");
    if (!section || !canvas || !key) return;

    const map = activeParkConfig()?.specialMap;
    if (!map) {
      section.classList.add("hidden");
      canvas.innerHTML = "";
      key.innerHTML = "";
      return;
    }

    section.classList.remove("hidden");
    if (eyebrow) eyebrow.textContent = map.eyebrow || "KIRMES · LAGEPLAN";
    if (title) title.textContent = map.title || "Kirmesplan";
    if (subtitle) subtitle.textContent = map.subtitle || "";
    if (note) note.textContent = map.note || "";

    if (source) {
      source.href = map.sourceUrl || "#";
      source.textContent = map.sourceLabel || "Originalplan öffnen";
      source.hidden = !map.sourceUrl;
    }

    const points = (map.points || []).map((point) => {
      const ride = rides.find((item) => item.id === point.rideId) ||
        fallbackRidesFor().find((item) => item.id === point.rideId);
      return ride ? Object.assign({}, point, { ride }) : null;
    }).filter(Boolean);

    const pointHtml = points.map((point) => {
      const hitbox = point.labelHitbox && Number(point.w) > 0 && Number(point.h) > 0;
      const classes = "soestPlanLink" + (point.alwaysLabel ? " mapAlwaysLabel" : "") + (hitbox ? " mapLabelHitbox" : "");
      const sizeStyle = hitbox ? ";--map-w:" + Number(point.w) + "%;--map-h:" + Number(point.h) + "%" : "";
      const replacement = point.replacementLabel
        ? "<em class=\"mapReplacementLabel\">" + escapeHtml(point.replacementLabel) + "</em>"
        : "";
      return "<button type=\"button\" class=\"" + classes + "\" data-map-ride=\"" + escapeHtml(point.ride.id) + "\"" +
        " style=\"--map-x:" + Number(point.x) + "%;--map-y:" + Number(point.y) + "%" + sizeStyle + "\"" +
        " aria-label=\"" + escapeHtml(point.ride.name + " öffnen") + "\">" +
        "<span aria-hidden=\"true\">↗</span>" +
        replacement +
        "<b>" + escapeHtml(point.ride.name) + "</b>" +
      "</button>";
    }).join("");

    const imageUrl = map.imageUrl || "";
    const imageAlt = map.imageAlt || ("Lageplan " + (activeParkConfig()?.name || "Kirmes"));
    canvas.innerHTML =
      "<div class=\"soestOriginalPlanWrap\" style=\"--plan-aspect:" + escapeHtml(map.aspectRatio || "1310 / 1841") + "\">" +
        "<img class=\"soestOriginalPlan\" src=\"" + escapeHtml(imageUrl) + "\" alt=\"" + escapeHtml(imageAlt) + "\" loading=\"eager\" decoding=\"async\">" +
        "<div class=\"soestPlanHotspots\" aria-label=\"Fahrgeschäfte auf dem Lageplan\">" + pointHtml + "</div>" +
      "</div>";

    key.innerHTML = "";
    section.querySelectorAll("[data-map-ride]").forEach((button) => {
      button.addEventListener("click", () => openRideDetail(button.dataset.mapRide));
    });
  }

  function renderRides() {
    const container = $("#rides");
    if (!container) return;

    renderSpecialVenueMap();
    const hasPublicLive = parkHasPublicLiveWaits();
    const visibleRides = rides
      .filter(ride => !isExcludedRide(ride.name, ride.id, activeParkSlug) && (!onlyFavorites || favorites.includes(ride.id)) && ride.name.toLowerCase().includes(rideSearch))
      .sort((a, b) => {
        if (!hasPublicLive) {
          if (activeParkConfig()?.sortMode === "configured") return 0;
          return a.name.localeCompare(b.name, "de");
        }

        const aHasLive = a.source === "queue-times";
        const bHasLive = b.source === "queue-times";
        const aClosed = aHasLive && a.isOpen === false;
        const bClosed = bHasLive && b.isOpen === false;
        const aUnknown = !aHasLive || a.isOpen === null || a.isOpen === undefined;
        const bUnknown = !bHasLive || b.isOpen === null || b.isOpen === undefined;

        const rank = (closed, unknown) => closed ? 2 : unknown ? 1 : 0;
        const rankDiff = rank(aClosed, aUnknown) - rank(bClosed, bUnknown);
        if (rankDiff) return rankDiff;

        if (!aClosed && !aUnknown && !bClosed && !bUnknown) {
          const waitDiff = (Number(b.wait) || 0) - (Number(a.wait) || 0);
          if (waitDiff) return waitDiff;
        }

        return a.name.localeCompare(b.name, "de");
      });
    const cards = visibleRides.map((ride) => {
      const fav = favorites.includes(ride.id);
      const world = worldForRide(ride.id);
      const artSrc = world ? (world.artUrl || (world.art ? "./assets/" + world.art + ".webp" : "")) : "";
      const hasLive = hasPublicLive && ride.source === "queue-times";
      const closed = hasLive && !ride.isOpen;
      const unknown = !hasLive || ride.isOpen === null;
      const waitMain = closed ? "ZU" : unknown ? "–" : String(ride.wait);
      const waitSub = closed ? "GESCHLOSSEN" : unknown ? "KEINE LIVE-DATEN" : "MIN · LIVE";
      const arrow = ride.trend === "down" ? "↓" : ride.trend === "up" ? "↑" : "→";
      const trendText = !hasLive ? "warte auf Live-Daten" : closed ? "aktuell geschlossen" : ride.delta ? arrow + " " + Math.abs(ride.delta) + " min" : "→ stabil";
      const updated = hasPublicLive && ride.lastUpdated ? " · Stand " + new Date(ride.lastUpdated).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) : "";
      const sr = ride.singleRider ? "<span>👤 SR</span><span>·</span>" : "";
      const newBadge = ride.new2026 ? "<span class=\"rideBadgeNew\">✦ NEU 2026</span>" : "";
      const fair = venueIsFair();
      const priceBadge = fair ? "<span class=\"ridePricePill\"><span>FAHRPREIS</span><b>" + escapeHtml(ridePriceText(ride)) + "</b></span>" : "";
      const operatorLine = fair && ride.operator
        ? "Schausteller: " + ride.operator + " · " + ride.zone
        : ride.zone;
      const queueDisabled = closed ? " disabled" : "";

      return "<article class=\"ride\" data-park=\"" + escapeHtml(activeParkSlug || "phantasialand") + "\" data-world=\"" + escapeHtml(ride.id) + "\" data-detail=\"" + escapeHtml(ride.id) + "\">" +
        (artSrc ? "<img class=\"rideArt\" src=\"" + escapeHtml(artSrc) + "\" alt=\"\" loading=\"lazy\" decoding=\"async\">" : "") +
        "<div class=\"rideMain\">" +
          "<div class=\"rideTop\">" +
            "<button class=\"fav " + (fav ? "on" : "") + "\" data-fav=\"" + ride.id + "\" aria-label=\"Favorit für " + escapeHtml(ride.name) + "\" aria-pressed=\"" + fav + "\">★</button>" +
            "<div><h3>" + escapeHtml(ride.name) + "</h3><div class=\"zone\">" + escapeHtml(operatorLine + updated) + "</div></div>" +
          "</div>" +
          "<div class=\"meta\">" + newBadge + priceBadge + sr +
            (hasPublicLive ? "<span class=\"trend " + ride.trend + "\">" + escapeHtml(trendText) + "</span><span>·</span>" : "") +
            "<button class=\"btn secondary\" style=\"padding:7px 10px;font-size:11px\" data-queue=\"" + ride.id + "\"" + queueDisabled + ">" + (closed ? "ZU" : "ANSTELLEN") + "</button>" +
            "<button class=\"btn ghost\" style=\"padding:7px 4px;font-size:11px\" data-detail-btn=\"" + ride.id + "\">DETAILS</button>" +
          "</div>" +
        "</div>" +
        (hasPublicLive ? "<div class=\"wait\"><strong>" + waitMain + "</strong><small>" + waitSub + "</small></div>" : "") +
      "</article>";
    }).join("");

    container.innerHTML = (cards || "<div class=\"empty\">Keine passenden Attraktionen. Passe deine Suche oder den Favoritenfilter an.</div>") +
      (hasPublicLive
        ? "<a class=\"attribution\" href=\"https://queue-times.com/\" target=\"_blank\" rel=\"noopener\">Powered by <b style=\"color:var(--text)\">Queue-Times.com</b> · Liveproxy ca. alle 45 Sek. frisch · App prüft jede Minute</a>"
        : "");

    // Remote fairground photo hosts can block hotlinking. Never leave a ride card visually empty:
    // retry once with the event artwork, while local ride assets remain the preferred source.
    const rideArtFallback = activeParkSlug === "bocholt-kirmes-2026" ? "" : (activeParkConfig()?.cardImage || "./assets/park-picker-bg.webp");
    container.querySelectorAll("img.rideArt").forEach((img) => {
      const useFallback = () => {
        if (rideArtFallback && !img.dataset.fallbackTried) {
          img.dataset.fallbackTried = "1";
          img.src = rideArtFallback;
          return;
        }
        img.remove();
      };
      img.addEventListener("error", useFallback, { once:true });
      // A cached failed image can finish before the listener above is attached.
      if (img.complete && img.naturalWidth === 0) useFallback();
    });

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

  function buildDayFacts(day, sourceSessions, parkSlug = activeParkSlug || day?.park_slug || "phantasialand") {
    const allSessions = (sourceSessions || []).map((session) => localizeStoredSession(session, parkSlug));
    const ridden = allSessions.filter((session) => session.status === "ridden");
    const aborted = allSessions.filter((session) => session.status === "aborted");
    const queueDurations = ridden
      .map((session) => Number(session.duration))
      .filter((value) => Number.isFinite(value) && value >= 0);
    const queueMs = queueDurations.reduce((sum, value) => sum + value, 0);
    const startMs = parkDayStartMs(day);
    const endMs = parkDayEndMs(day) || (day === parkDay ? Date.now() : startMs);
    const parkMs = Math.max(0, endMs - startMs);
    const sortedRidden = ridden.slice().sort((a, b) => Number(a.startedAt || 0) - Number(b.startedAt || 0));
    const uniqueRideIds = new Set(ridden.map((session) => session.rideId));
    const counts = {};

    ridden.forEach((session) => {
      const key = session.rideId || session.rideName;
      if (!counts[key]) counts[key] = { name: session.rideName, count: 0 };
      counts[key].count += 1;
    });

    const topRideEntry = Object.values(counts).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "de"))[0] || null;
    const withDuration = ridden.filter((session) => Number.isFinite(Number(session.duration)));
    const longest = withDuration.slice().sort((a, b) => Number(b.duration) - Number(a.duration))[0] || null;
    const shortest = withDuration.slice().sort((a, b) => Number(a.duration) - Number(b.duration))[0] || null;
    const singleCount = ridden.filter((session) => session.type === "single").length;
    const postedComparable = ridden.filter((session) =>
      session.posted !== null &&
      session.posted !== undefined &&
      Number.isFinite(Number(session.posted)) &&
      Number.isFinite(Number(session.duration))
    );
    const savedMs = postedComparable.reduce((sum, session) =>
      sum + (Number(session.posted) * 60000 - Number(session.duration)), 0
    );

    const speedRows = ridden.map((session) => ({
      session: session,
      speedKmh: rideSpeedKmh(session.rideId, parkSlug)
    })).filter((row) => Number.isFinite(Number(row.speedKmh)));
    const topSpeedRow = speedRows.slice().sort((a, b) => Number(b.speedKmh) - Number(a.speedKmh))[0] || null;
    const hundredPlusCount = speedRows.filter((row) => Number(row.speedKmh) >= 100).length;

    return {
      parkSlug: parkSlug,
      rides: ridden.length,
      aborted: aborted.length,
      uniqueRides: uniqueRideIds.size,
      rerides: Math.max(0, ridden.length - uniqueRideIds.size),
      queueMs: queueMs,
      avgQueueMs: ridden.length ? queueMs / ridden.length : 0,
      medianQueueMs: median(queueDurations),
      parkMs: parkMs,
      outsideQueueMs: Math.max(0, parkMs - queueMs),
      queueShare: parkMs ? queueMs / parkMs : 0,
      ridesPerHour: parkMs ? ridden.length / (parkMs / 3600000) : 0,
      singleCount: singleCount,
      singleShare: ridden.length ? singleCount / ridden.length : 0,
      topRide: topRideEntry,
      longest: longest,
      shortest: shortest,
      firstRide: sortedRidden[0] || null,
      lastRide: sortedRidden[sortedRidden.length - 1] || null,
      postedComparableCount: postedComparable.length,
      savedMinutes: Math.round(savedMs / 60000),
      topSpeed: topSpeedRow ? Number(topSpeedRow.speedKmh) : null,
      topSpeedRide: topSpeedRow ? topSpeedRow.session : null,
      hundredPlusCount: hundredPlusCount
    };
  }

  function parkDayDateLabel(day) {
    const startMs = parkDayStartMs(day);
    if (!startMs) return "Unbekannter Parktag";
    return new Date(startMs).toLocaleDateString("de-DE", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  function rideTimeLabel(session) {
    if (!session?.startedAt) return "–";
    return new Date(session.startedAt).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  }

  function renderParkArchive() {
    const summary = $("#archiveSummary");
    const list = $("#parkArchiveList");
    if (!summary || !list) return;

    const parkLabel = $("#archiveParkLabel");
    if (parkLabel) parkLabel.textContent = (activeParkConfig()?.name || "DIESER PARK").toUpperCase();

    const entries = parkArchive.slice().sort((a, b) => parkDayStartMs(b.day) - parkDayStartMs(a.day));
    const dayWord = visitDayWord();
    const dayPlural = visitDayPlural();
    const facts = entries.map((entry) => buildDayFacts(entry.day, entry.sessions, entry.day?.park_slug || activeParkSlug));
    const totalRides = facts.reduce((sum, fact) => sum + fact.rides, 0);
    const totalQueueMs = facts.reduce((sum, fact) => sum + fact.queueMs, 0);
    const bestDay = entries.map((entry, index) => ({ entry, fact: facts[index] }))
      .sort((a, b) => b.fact.rides - a.fact.rides || b.fact.parkMs - a.fact.parkMs)[0] || null;

    summary.innerHTML =
      "<div class=\"archiveSummaryGrid\">" +
        recapStat(entries.length, "gespeicherte " + dayPlural) +
        recapStat(totalRides + "×", "Fahrten im Archiv") +
        recapStat(formatDurationHuman(totalQueueMs), "Queue insgesamt") +
        recapStat(entries.length ? (totalRides / entries.length).toFixed(1) : "0", "Fahrten / " + dayWord) +
      "</div>" +
      (bestDay && bestDay.fact.rides
        ? "<div class=\"archiveRecord\"><span>🏆 Tagesrekord</span><b>" + escapeHtml(parkDayDateLabel(bestDay.entry.day)) + " · " + bestDay.fact.rides + " Fahrten</b></div>"
        : "");

    if (!entries.length) {
      list.innerHTML = "<div class=\"empty\">Noch kein abgeschlossener " + dayWord + " gespeichert. Dein nächster wird hier dauerhaft archiviert.</div>";
      return;
    }

    list.innerHTML = entries.map((entry) => {
      const day = entry.day;
      const fact = buildDayFacts(day, entry.sessions, day?.park_slug || activeParkSlug);
      const parkName = PARKS[day?.park_slug || activeParkSlug]?.name || "Park";
      const topRide = fact.topRide ? fact.topRide.name + (fact.topRide.count > 1 ? " ×" + fact.topRide.count : "") : "Noch keine Fahrt";
      return "<button class=\"archiveDayCard\" type=\"button\" data-archive-day=\"" + escapeHtml(day.id) + "\">" +
        "<div class=\"archiveDayTop\"><div><span class=\"eyebrow\">" + escapeHtml(parkName) + "</span><h3>" + escapeHtml(parkDayDateLabel(day)) + "</h3></div><span class=\"archiveChevron\">›</span></div>" +
        "<div class=\"archiveDayStats\">" +
          "<span><b>" + fact.rides + "×</b> Fahrten</span>" +
          "<span><b>" + escapeHtml(formatDurationHuman(fact.queueMs)) + "</b> Queue</span>" +
          "<span><b>" + escapeHtml(formatDurationHuman(fact.parkMs)) + "</b> Besuchszeit</span>" +
        "</div>" +
        "<div class=\"archiveDayFoot\">meistgenäht: <b>" + escapeHtml(topRide) + "</b></div>" +
      "</button>";
    }).join("");

    list.querySelectorAll("[data-archive-day]").forEach((button) => {
      button.addEventListener("click", () => openArchiveDay(button.dataset.archiveDay));
    });
  }

  function openArchiveDay(dayId) {
    const entry = parkArchive.find((item) => String(item.day?.id) === String(dayId));
    if (!entry) return;

    const day = entry.day;
    const parkSlug = day?.park_slug || activeParkSlug || "phantasialand";
    const parkName = PARKS[parkSlug]?.name || "Park";
    const dayWord = visitDayWord(parkSlug);
    const supportsPostedWait = PARKS[parkSlug]?.supportsPostedWait !== false;
    const fact = buildDayFacts(day, entry.sessions, parkSlug);
    const detail = $("#archiveDetailContent");
    if (!detail) return;

    $("#archiveDetailTitle").textContent = parkDayDateLabel(day);
    $("#archiveDetailMeta").textContent = parkName + " · " + formatDurationHuman(fact.parkMs);

    const comparisonText = fact.postedComparableCount
      ? (fact.savedMinutes >= 0
        ? fact.savedMinutes + " Min. weniger als ausgeschildert gewartet"
        : Math.abs(fact.savedMinutes) + " Min. länger als ausgeschildert gewartet")
      : "Keine ausreichenden Soll-/Ist-Wartezeitdaten";

    const chronological = entry.sessions.slice().sort((a, b) => Number(a.startedAt || 0) - Number(b.startedAt || 0));
    const timeline = chronological.length
      ? chronological.map((session) => {
          const duration = Number.isFinite(Number(session.duration)) ? minutesRounded(session.duration) + " min" : "–";
          const state = session.status === "ridden" ? "genäht" : session.status === "aborted" ? "vernäht" : "offen";
          return "<div class=\"archiveRideRow\"><div><b>" + escapeHtml(session.rideName) + "</b><small>" +
            escapeHtml(rideTimeLabel(session)) + " · " + (session.type === "single" ? "Single Rider" : "Regular") +
            "</small></div><div><b>" + escapeHtml(duration) + "</b><small>" + escapeHtml(state) + "</small></div></div>";
        }).join("")
      : "<div class=\"empty\">Keine Fahrten für diesen Parktag gespeichert.</div>";

    detail.innerHTML =
      "<div class=\"archiveHeroFacts\">" +
        recapStat(fact.rides + "×", "genäht") +
        recapStat(fact.uniqueRides, "verschiedene Rides") +
        recapStat(formatDurationHuman(fact.queueMs), "echte Queue") +
        recapStat(formatDurationHuman(fact.outsideQueueMs), "Zeit außerhalb Queue") +
      "</div>" +
      "<div class=\"nerdSection\"><div class=\"nerdTitle\">NERD-MODUS</div><div class=\"nerdGrid\">" +
        recapStat(minutesRounded(fact.avgQueueMs) + "m", "Ø Queue") +
        recapStat(minutesRounded(fact.medianQueueMs) + "m", "Median-Queue") +
        recapStat(Math.round(fact.queueShare * 100) + "%", (venueIsFair(parkSlug) ? "Kirmeszeit" : "Parkzeit") + " in Queue") +
        recapStat(fact.ridesPerHour ? fact.ridesPerHour.toFixed(2) : "0", "Fahrten / Stunde") +
        recapStat(Math.round(fact.singleShare * 100) + "%", "Single-Rider-Anteil") +
        recapStat(fact.rerides + "×", "Rerides") +
        recapStat(fact.hundredPlusCount + "×", "100+ km/h") +
        recapStat(fact.topSpeed ? fact.topSpeed + " km/h" : "–", "Top-Speed") +
      "</div><div class=\"nerdDataNote\">Speed-Werte berücksichtigen nur Attraktionen mit hinterlegten technischen Daten.</div></div>" +
      "<div class=\"archiveFactList\">" +
        "<div><span>🏆 Meistgenäht</span><b>" + escapeHtml(fact.topRide ? fact.topRide.name + " ×" + fact.topRide.count : "–") + "</b></div>" +
        "<div><span>🐌 Längste Queue</span><b>" + escapeHtml(fact.longest ? fact.longest.rideName + " · " + minutesRounded(fact.longest.duration) + " min" : "–") + "</b></div>" +
        "<div><span>⚡ Kürzeste Queue</span><b>" + escapeHtml(fact.shortest ? fact.shortest.rideName + " · " + minutesRounded(fact.shortest.duration) + " min" : "–") + "</b></div>" +
        "<div><span>🌅 Erste Fahrt</span><b>" + escapeHtml(fact.firstRide ? rideTimeLabel(fact.firstRide) + " · " + fact.firstRide.rideName : "–") + "</b></div>" +
        "<div><span>🌙 Letzte Fahrt</span><b>" + escapeHtml(fact.lastRide ? rideTimeLabel(fact.lastRide) + " · " + fact.lastRide.rideName : "–") + "</b></div>" +
        (supportsPostedWait ? "<div><span>📊 Soll vs. Realität</span><b>" + escapeHtml(comparisonText) + "</b></div>" : "") +
        (fact.topSpeedRide ? "<div><span>🚀 Schnellste Fahrt</span><b>" + escapeHtml(fact.topSpeedRide.rideName + " · " + fact.topSpeed + " km/h") + "</b></div>" : "") +
      "</div>" +
      (venueIsFair(parkSlug) ? fairReceiptHtml(entry.sessions, day) : "") +
      "<div class=\"sectionHead archiveTimelineHead\"><h2>Tagesprotokoll</h2><span>" + chronological.length + " Einträge</span></div>" +
      "<div class=\"archiveTimeline\">" + timeline + "</div>";

    openSheet("archiveDetailSheet");
    if (!history.state?.naehenArchiveDetail) {
      history.pushState(
        Object.assign({}, history.state || {}, { naehenArchiveDetail: true, archiveDayId: dayId }),
        "",
        location.href
      );
    }
  }

  async function startParkDay() {
    if (parkDay) return;

    const now = new Date().toISOString();
    const id = createId();
    const parkSlug = activeParkSlug || "phantasialand";
    const nextDay = { id: id, park_slug: parkSlug, started_at: now, ended_at: null };

    if (supa && currentUserId()) {
      const result = await supa.from("park_days").insert({
        id: id,
        user_id: currentUserId(),
        park_slug: parkSlug,
        started_at: now
      }).select("*").single();

      if (result.error) {
        toast(visitDayWord(parkSlug) + " konnte nicht synchronisiert werden");
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
    if (Math.random() < 0.15) {
      toast("🧵 " + visitDayWord(parkSlug) + " gestartet. Ich näh gern.");
    } else {
      toast("🧵 " + visitDayWord(parkSlug) + " gestartet. Jetzt wird genäht.");
    }
  }

  async function endParkDay() {
    if (!parkDay) return;
    if (active) {
      toast("Erst die aktive Queue abschließen oder vernähen.");
      openActive();
      return;
    }

    const endedAt = new Date().toISOString();
    const completedDay = Object.assign({}, parkDay, { ended_at: endedAt });

    if (supa && currentUserId()) {
      const result = await supa.from("park_days").update({ ended_at: endedAt }).eq("id", parkDay.id).eq("user_id", currentUserId());
      if (result.error) {
        toast(visitDayWord(completedDay.park_slug || activeParkSlug) + " konnte nicht beendet werden");
        console.warn(result.error);
        return;
      }
    }

    const archiveEntry = {
      day: completedDay,
      sessions: sessions.map((session) => Object.assign({}, session))
    };
    parkArchive = [
      archiveEntry,
      ...parkArchive.filter((entry) => String(entry.day?.id) !== String(completedDay.id))
    ];

    renderRecap(sessions, completedDay);
    openSheet("recapSheet");
    parkDay = null;
    persistLocalState();
    renderAll();
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
    const parkDays = $("#totalParkDays");
    if (parkDays) parkDays.textContent = parkArchive.length;

    const list = $("#achievementList");
    const count = $("#achievementCount");
    if (!list) return;

    const definitions = Object.values(ACHIEVEMENT_DEFINITIONS);
    const unlockedCount = definitions.filter((definition) => !!achievements[definition.id]).length;
    if (count) count.textContent = unlockedCount + " / " + definitions.length;

    list.innerHTML = definitions.map((definition) => {
      const unlocked = achievements[definition.id] || null;
      const iconMarkup = definition.imageUrl
        ? "<div class=\"achievementImageWrap\"><img class=\"achievementImage\" src=\"" + escapeHtml(definition.imageUrl) + "\" alt=\"" + escapeHtml(definition.imageAlt || "") + "\" loading=\"lazy\"></div>"
        : "<div class=\"achievementIcon\" aria-hidden=\"true\">" + escapeHtml(definition.icon || "🏅") + "</div>";

      if (unlocked) {
        const detail = [
          unlocked.rideName || "",
          unlocked.speedKmh ? unlocked.speedKmh + " km/h" : "",
          unlocked.waitedMinutes ? unlocked.waitedMinutes + " min gewartet" : ""
        ].filter(Boolean).join(" · ");

        return "<div class=\"achievementBadge unlocked\" data-achievement=\"" + escapeHtml(definition.id) + "\">" +
          iconMarkup +
          "<div class=\"achievementCopy\"><b>" + escapeHtml(definition.title) + "</b>" +
          "<span>" + escapeHtml(definition.description) + "</span>" +
          (detail ? "<small>Freigeschaltet mit " + escapeHtml(detail) + "</small>" : "") +
          "</div><div class=\"achievementState\">✓</div>" +
        "</div>";
      }

      const lockedText = definition.lockedDescription ||
        (definition.thresholdKmh ? "Fahre eine Attraktion mit mindestens " + definition.thresholdKmh + " km/h." : definition.description);

      return "<div class=\"achievementBadge locked\" data-achievement=\"" + escapeHtml(definition.id) + "\">" +
        iconMarkup +
        "<div class=\"achievementCopy\"><b>" + escapeHtml(definition.title) + "</b>" +
        "<span>" + escapeHtml(lockedText) + "</span>" +
        "<small>Noch nicht freigeschaltet</small></div>" +
        "<div class=\"achievementState\" aria-hidden=\"true\">🔒</div>" +
      "</div>";
    }).join("");
  }

  function openQueue(rideId) {
    if (!parkDay) {
      toast("Erst " + visitDayWord() + " starten – dann wird genäht.");
      return;
    }
    if (active) {
      openActive();
      return;
    }

    selectedRide = rides.find((ride) => ride.id === rideId) || fallbackRidesFor().find((ride) => ride.id === rideId);
    if (!selectedRide) return;

    queueType = "regular";
    $("#sheetRide").textContent = selectedRide.name;
    const postedWaitField = $("#postedWaitField");
    const supportsPostedWait = activeParkConfig()?.supportsPostedWait !== false;
    if (postedWaitField) postedWaitField.classList.toggle("hidden", !supportsPostedWait);
    $("#postedWait").value = supportsPostedWait && selectedRide.source === "queue-times" && selectedRide.isOpen ? selectedRide.wait : "";

    const fairPriceField = $("#fairPriceField");
    const fairPriceInput = $("#fairPriceInput");
    const fair = venueIsFair();
    if (fairPriceField) fairPriceField.classList.toggle("hidden", !fair);
    if (fairPriceInput) {
      // Every fair ride gets a fresh, explicit price from the visitor.
      // No cached/default price is prefilled because vouchers and prices can differ per ride.
      fairPriceInput.value = "";
    }

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

    let manualPrice = null;
    if (venueIsFair()) {
      const priceInput = $("#fairPriceInput");
      const rawPrice = (priceInput?.value || "").trim().replace(",", ".");
      const parsedPrice = Number(rawPrice);
      if (!rawPrice || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
        toast("💶 Fahrpreis bitte manuell eintragen.");
        priceInput?.focus();
        return;
      }
      manualPrice = Math.round(parsedPrice * 100) / 100;
      fairPrices[selectedRide.id] = manualPrice;
    }

    const now = Date.now();
    const id = createId();

    active = {
      id: id,
      rideId: selectedRide.id,
      rideName: selectedRide.name,
      parkSlug: activeParkSlug || "phantasialand",
      speedKmh: selectedRide.speedKmh || rideSpeedKmh(selectedRide.id),
      type: queueType,
      posted: Number.isFinite(posted) ? posted : null,
      priceEuro: manualPrice,
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
        price_euro: active.priceEuro,
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
      (active.posted !== null ? " · ausgeschildert " + active.posted + " min" : "") +
      (Number.isFinite(Number(active.priceEuro)) ? " · " + formatEuro(active.priceEuro) : "");
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
        price_euro: finished.priceEuro,
        status: status
      }).eq("id", finished.id).eq("user_id", currentUserId());

      if (result.error) console.warn("Queue-Ende konnte nicht synchronisiert werden", result.error);
    }

    if (status === "ridden" && finished.type === "single") {
      await recordSrReport(finished);
    }

    const unlockedAchievements = status === "ridden"
      ? await evaluateRideAchievements(finished)
      : [];

    active = null;
    persistLocalState();
    closeSheet("activeSheet");
    renderAll();

    if (unlockedAchievements.length === 1) {
      const unlockedAchievement = unlockedAchievements[0];
      const extra = unlockedAchievement.speedKmh
        ? " · " + unlockedAchievement.speedKmh + " km/h"
        : unlockedAchievement.waitedMinutes
          ? " · " + unlockedAchievement.waitedMinutes + " min"
          : "";
      toast("🏅 " + unlockedAchievement.title + " freigeschaltet!" + extra);
    } else if (unlockedAchievements.length > 1) {
      toast("🏅 " + unlockedAchievements.length + " Achievements freigeschaltet!");
    } else {
      toast(status === "ridden" ? "🎢 Sauber genäht." : "💀 Vernäht.");
    }
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

  function renderRideExtraFacts(ride, world) {
    const box = $("#rideExtraFacts");
    if (!box) return;

    const hasFacts = ride && (
      ride.operatorFull || ride.operator || ride.manufacturer || ride.type ||
      ride.year || ride.dimensions || ride.capacity || ride.rideIndexUrl ||
      ride.priceEuro !== undefined
    );

    if (!hasFacts) {
      box.innerHTML = "";
      box.classList.add("hidden");
      return;
    }

    const fair = venueIsFair();
    const facts = [];
    if (fair) facts.push(["Fahrpreis", ridePriceText(ride), "price"]);
    if (ride.operatorFull || ride.operator) facts.push(["Schausteller", ride.operatorFull || ride.operator, "operator"]);
    if (ride.manufacturer) facts.push(["Hersteller", ride.manufacturer, ""]);
    if (ride.type) facts.push(["Typ", ride.type, ""]);
    if (ride.year) facts.push(["Baujahr", String(ride.year), ""]);
    if (ride.dimensions) facts.push(["Maße / Höhe", ride.dimensions, ""]);
    if (ride.capacity) facts.push(["Kapazität", ride.capacity, ""]);

    const factHtml = facts.map(([label, value, extraClass]) =>
      "<div class=\"rideFactCard " + escapeHtml(extraClass || "") + "\">" +
        "<span>" + escapeHtml(label) + "</span><b>" + escapeHtml(value) + "</b>" +
      "</div>"
    ).join("");

    const links = [];
    if (ride.rideIndexUrl) {
      links.push("<a href=\"" + escapeHtml(ride.rideIndexUrl) + "\" target=\"_blank\" rel=\"noopener\">Ride-Index Steckbrief ↗</a>");
    }
    if (world?.imageSourceUrl || ride.imageSourceUrl) {
      const sourceUrl = world?.imageSourceUrl || ride.imageSourceUrl;
      const credit = world?.imageCredit || ride.imageCredit || "Bildquelle";
      links.push("<a href=\"" + escapeHtml(sourceUrl) + "\" target=\"_blank\" rel=\"noopener\">Bild: " + escapeHtml(credit) + " ↗</a>");
    }

    box.innerHTML =
      (fair ? "<div class=\"rideFactsEyebrow\">KIRMES-NERD-DATEN</div>" : "") +
      "<div class=\"rideFactGrid\">" + factHtml + "</div>" +
      (fair
        ? "<div class=\"ridePriceNote\">Fahrpreise kommen ausschließlich von dir. Beim Anstellen gibst du den aktuellen Preis manuell ein; NÄHEN recherchiert oder übernimmt nichts automatisch.</div>"
        : "") +
      (links.length ? "<div class=\"rideFactSources\">" + links.join("") + "</div>" : "");

    box.classList.remove("hidden");
  }

  async function openRideDetail(rideId) {
    selectedDetailRide = rides.find((ride) => ride.id === rideId) || fallbackRidesFor().find((ride) => ride.id === rideId);
    if (!selectedDetailRide) return;

    const world = worldForRide(selectedDetailRide.id);
    const artSrc = world ? (world.artUrl || (world.art ? "./assets/" + world.art + ".webp" : "")) : "";
    const rideSheet = $("#rideSheet");
    const worldArtImage = $("#worldArtImage");
    const worldProp = $("#worldProp");
    const worldPropImage = $("#worldPropImage");
    const worldBadgeImage = $("#worldBadgeImage");
    rideSheet.dataset.park = activeParkSlug || "phantasialand";
    rideSheet.dataset.world = world ? selectedDetailRide.id : "default";
    applyAttractionTypography(rideSheet, selectedDetailRide.id);
    if (worldArtImage) {
      if (artSrc) {
        const detailFallback = activeParkSlug === "bocholt-kirmes-2026" ? "" : (activeParkConfig()?.cardImage || "./assets/park-picker-bg.webp");
        worldArtImage.onerror = () => {
          if (detailFallback && worldArtImage.src !== new URL(detailFallback, location.href).href) {
            worldArtImage.onerror = null;
            worldArtImage.src = detailFallback;
          } else {
            worldArtImage.hidden = true;
          }
        };
        worldArtImage.src = artSrc;
        worldArtImage.hidden = false;
      } else {
        worldArtImage.removeAttribute("src");
        worldArtImage.hidden = true;
      }
    }
    if (worldPropImage && worldProp) {
      if (world?.propUrl) {
        worldPropImage.src = world.propUrl;
        worldProp.classList.add("show");
      } else {
        worldPropImage.removeAttribute("src");
        worldProp.classList.remove("show");
      }
    }
    if (worldBadgeImage) {
      if (world?.badgeUrl) {
        worldBadgeImage.src = world.badgeUrl;
        worldBadgeImage.classList.add("show");
      } else {
        worldBadgeImage.removeAttribute("src");
        worldBadgeImage.classList.remove("show");
      }
    }
    $("#worldCaption").textContent = world?.line || "Deine nächste Nähung.";
    $("#rideTitle").textContent = selectedDetailRide.name;
    $("#rideZone").textContent = world?.label || selectedDetailRide.zone || activeParkConfig()?.name || "Park";

    const publicLive = parkHasPublicLiveWaits();
    const waitCaption = $("#rideSheet .waitCaption");
    $("#rideDetailWait").classList.toggle("hidden", !publicLive);
    waitCaption?.classList.toggle("hidden", !publicLive);

    if (!publicLive) {
      const park = activeParkConfig();
      const rideFacts = [
        selectedDetailRide.operator ? "Betreiber: " + selectedDetailRide.operator : "",
        selectedDetailRide.new2026 ? "Neu 2026" : ""
      ].filter(Boolean);
      const noLiveText = park?.noLiveMessage ||
        ("Für " + (park?.name || "dieses Ziel") + " sind in NÄHEN keine öffentlichen Live-Wartezeiten hinterlegt. Deinen eigenen Queue-Timer kannst du trotzdem nutzen.");
      $("#rideDetailStatus").textContent = (rideFacts.length ? rideFacts.join(" · ") + " · " : "") + noLiveText;
    } else if (selectedDetailRide.source === "queue-times") {
      $("#rideDetailWait").textContent = selectedDetailRide.isOpen ? selectedDetailRide.wait + " min" : "Geschlossen";
      $("#rideDetailStatus").textContent = selectedDetailRide.isOpen ? "Als geöffnet gemeldet · Daten von Queue-Times, keine offizielle Park-Livezeit." : "Attraktion wird aktuell als geschlossen gemeldet.";
    } else {
      $("#rideDetailWait").textContent = "–";
      $("#rideDetailStatus").textContent = "Aktuell keine Live-Wartezeit verfügbar.";
    }

    renderRideExtraFacts(selectedDetailRide, world);

    $("#rideQueueBtn").disabled = publicLive && selectedDetailRide.source === "queue-times" && !selectedDetailRide.isOpen;
    $("#srCommunity").innerHTML = venueIsFair()
      ? ""
      : "<div class=\"message\">Single-Rider-Informationen laden…</div>";
    openSheet("rideSheet");
    pushRideDetailHistory(selectedDetailRide.id);
    await renderSrCommunity(selectedDetailRide);
  }

  async function renderSrCommunity(ride) {
    const box = $("#srCommunity");
    if (venueIsFair() && !ride.singleRider) {
      box.innerHTML = "";
      return;
    }
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

    if (!parkHasPublicLiveWaits()) {
      const park = activeParkConfig();
      const message = park?.noLiveAlarmMessage ||
        ("Für " + (park?.name || "dieses Ziel") + " gibt es keine öffentlichen Live-Wartezeiten. Wartezeit-Alarme sind deshalb hier deaktiviert.");
      container.innerHTML = "<div class=\"empty\">" + escapeHtml(message) + "</div>";
      return;
    }

    const activeRideIds = new Set(fallbackRidesFor().map((ride) => ride.id).concat(rides.map((ride) => ride.id)));
    const parkFavorites = favorites.filter((rideId) => activeRideIds.has(rideId));

    if (!parkFavorites.length) {
      container.innerHTML = "<div class=\"empty\">Markiere zuerst Attraktionen mit ★ als Favorit.</div>";
      return;
    }

    container.innerHTML = parkFavorites.map((rideId) => {
      const ride = rides.find((item) => item.id === rideId) || fallbackRidesFor().find((item) => item.id === rideId) || { id: rideId, name: rideId };
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

  function renderRecap(sourceSessions, sourceDay = parkDay) {
    const day = sourceDay || {
      park_slug: activeParkSlug || "phantasialand",
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString()
    };
    const dayParkSlug = day.park_slug || activeParkSlug || "phantasialand";
    const dayWord = visitDayWord(dayParkSlug);
    const supportsPostedWait = PARKS[dayParkSlug]?.supportsPostedWait !== false;
    const fact = buildDayFacts(day, sourceSessions, dayParkSlug);
    const comparisonText = fact.postedComparableCount
      ? (fact.savedMinutes >= 0
        ? fact.savedMinutes + " Minuten weniger gewartet."
        : Math.abs(fact.savedMinutes) + " Minuten länger gewartet.")
      : "Noch nicht genug Vergleichsdaten.";

    $("#recapContent").innerHTML =
      "<div class=\"recapBox\"><div class=\"recapGrid\">" +
        recapStat(fact.rides + "×", "genäht") +
        recapStat(formatDurationHuman(fact.queueMs), "echte Queue") +
        recapStat(fact.uniqueRides, "verschiedene Rides") +
        recapStat(formatDurationHuman(fact.parkMs), dayWord) +
      "</div></div>" +
      "<div class=\"recapBox nerdRecap\"><b>🤓 Nerd-Modus</b><div class=\"nerdGrid\">" +
        recapStat(minutesRounded(fact.avgQueueMs) + "m", "Ø Queue") +
        recapStat(minutesRounded(fact.medianQueueMs) + "m", "Median") +
        recapStat(Math.round(fact.queueShare * 100) + "%", "Zeit in Queue") +
        recapStat(fact.ridesPerHour ? fact.ridesPerHour.toFixed(2) : "0", "Fahrten / Std.") +
        recapStat(Math.round(fact.singleShare * 100) + "%", "Single Rider") +
        recapStat(fact.rerides + "×", "Rerides") +
        recapStat(fact.hundredPlusCount + "×", "100+ km/h") +
        recapStat(fact.topSpeed ? fact.topSpeed + " km/h" : "–", "Top-Speed") +
      "</div><div class=\"nerdDataNote\">Speed-Werte nur soweit technische Daten hinterlegt sind.</div></div>" +
      "<div class=\"recapBox\"><b>🏆 Meistgenäht</b><p>" +
        escapeHtml(fact.topRide ? fact.topRide.name + " ×" + fact.topRide.count : "–") +
      "</p></div>" +
      "<div class=\"recapBox\"><b>🐌 Queue-Extremwerte</b><p>" +
        escapeHtml(fact.longest ? "Längste: " + fact.longest.rideName + " · " + minutesRounded(fact.longest.duration) + " min" : "Längste: –") +
        "<br>" +
        escapeHtml(fact.shortest ? "Kürzeste: " + fact.shortest.rideName + " · " + minutesRounded(fact.shortest.duration) + " min" : "Kürzeste: –") +
      "</p></div>" +
      (supportsPostedWait ? "<div class=\"recapBox\"><b>📊 vs. ausgeschildert</b><p>" + escapeHtml(comparisonText) + "</p></div>" : "") +
      (venueIsFair(dayParkSlug) ? fairReceiptHtml(sourceSessions, day) : "") +
      "<div class=\"recapBox\"><b>💾 Dauerhaft gespeichert</b><p>Dieser " + dayWord + " liegt jetzt im Archiv und bleibt auch nach dem nächsten " + dayWord + " erhalten.</p></div>";
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
    ["homeView", "logView", "archiveView", "profileView"].forEach((id) => {
      $("#" + id)?.classList.toggle("hidden", id !== viewId);
    });
    if (viewId === "archiveView") renderParkArchive();
    $$("[data-view]").forEach((button) => button.classList.toggle("active", button.dataset.view === viewId));
  }

  window.addEventListener("popstate", (event) => {
    const rideSheet = $("#rideSheet");
    if (rideSheet?.classList.contains("show")) {
      closeSheet("rideSheet", { fromPopState: true });
      return;
    }

    const archiveSheet = $("#archiveDetailSheet");
    if (archiveSheet?.classList.contains("show")) {
      closeSheet("archiveDetailSheet", { fromPopState: true });
      return;
    }

    if (event.state?.naehenPark) {
      if (activeParkSlug !== event.state.naehenPark) {
        openPark(event.state.naehenPark, { pushHistory: false });
      }
      return;
    }

    if (event.state?.naehenParkPicker || activeParkSlug) {
      showParkPicker();
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
        const status = $("#installStatus");
        if (status) status.textContent = "Nach dem Hinzufügen NÄHEN über das neue Home-Bildschirm-Icon öffnen.";
        return;
      }
      if (deferredInstall) {
        deferredInstall.prompt();
        const choice = await deferredInstall.userChoice;
        deferredInstall = null;
        if (choice && choice.outcome === "accepted") {
          $("#installBtn").textContent = "INSTALLIERT · ÜBER APP-ICON ÖFFNEN";
          $("#installBtn").disabled = true;
          const status = $("#installStatus");
          if (status) status.textContent = "Installation abgeschlossen. Schließe diesen Browser-Tab und öffne NÄHEN über das installierte App-Icon. Erst dort erscheint der Login.";
          toast("✓ Installiert · jetzt über das NÄHEN-Icon öffnen");
        }
      } else {
        const status = $("#installStatus");
        if (status) status.textContent = "Installiere NÄHEN über das Browser-Menü und öffne anschließend die installierte App.";
        toast("Browser-Menü → App installieren / Zum Startbildschirm");
      }
    });

    window.addEventListener("appinstalled", () => {
      deferredInstall = null;
      const button = $("#installBtn");
      if (button) {
        button.textContent = "INSTALLIERT · ÜBER APP-ICON ÖFFNEN";
        button.disabled = true;
      }
      const status = $("#installStatus");
      if (status) status.textContent = "Installation abgeschlossen. Login und Registrierung sind ausschließlich in der installierten NÄHEN-App verfügbar.";
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
      if (!canEnterApp()) {
        showGate("#installGate");
        return;
      }
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

    $("#parkSwitchBtn").addEventListener("click", () => {
      if (history.state?.naehenPark) history.back();
      else showParkPicker({ replaceHistory: true });
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
