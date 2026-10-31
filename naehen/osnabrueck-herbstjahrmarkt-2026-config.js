(() => {
  "use strict";
  // NÄHEN · Herbstjahrmarkt Osnabrück 2026. Beschickung: Kirmesforum Stand 31.10.2026.
  // Ohne Lageplan: Es liegt kein bestätigter, attraktionsexakter Plan vor.
  const officialDateSource = "https://erleben.osnabrueck.de/de/stadt-erleben/city-events/jahrmaerkte/";
  const lineupSource = "https://www.kirmesforum.de/threads/osnabr%C3%BCck-49074-herbstjahrsmarkt-30-10-08-11-2026.77877/";
  const rawRides = [
  {
    "id": "racing-cars",
    "name": "Racing Cars",
    "operator": "Tovar",
    "operatorFull": "Bernhard Tovar",
    "zone": "Autoscooter",
    "type": "Autoscooter",
    "description": "Racing Cars von Tovar – der klassische Autoscooter auf dem Herbstjahrmarkt."
  },
  {
    "id": "super-cars",
    "name": "Super Cars",
    "operator": "Barber",
    "operatorFull": "Bärbel Barber",
    "zone": "Autoscooter",
    "type": "Mack 2-Säulen-Autoscooter",
    "rideIndexUrl": "https://ride-index.de/2005/04/05/as-barber/",
    "imageUrl": "https://primary.jwwb.nl/public/l/q/u/temp-iffnycaazqhfiudsmtnb/img_0675-high.jpg?enable=upscale&enable-io=true&fit=bounds&width=1200",
    "imageCredit": "Kermisreporter · Super Cars von Barber",
    "imageSourceUrl": "https://kermisreporter.nl/",
    "description": "Der Autoscooter Super Cars von Bärbel Barber."
  },
  {
    "id": "musik-express",
    "name": "Musik Express",
    "operator": "Welte-Noack",
    "operatorFull": "Welte-Noack (Detmold)",
    "zone": "Kirmesklassiker",
    "type": "Cosmont Berg- und Talbahn",
    "manufacturer": "Cosmont",
    "year": 1979,
    "capacity": "60 Personen · 20 Gondeln",
    "rideIndexUrl": "https://ride-index.de/2006/04/08/musik-express-welte-noack/",
    "imageUrl": "https://onride.de/onride-upic520799@1120",
    "imageCredit": "onride.de · Dewey · Musik Express Welte-Noack",
    "imageSourceUrl": "https://onride.de/viewtopic.php?t=44392",
    "description": "Musik-Express von Welte-Noack – bergauf, bergab und jede Menge Musik."
  },
  {
    "id": "power-express",
    "name": "Power Express",
    "operator": "Welte",
    "operatorFull": "Timm Welte (Bramsche)",
    "zone": "Kirmesklassiker",
    "type": "Mack 2-Säulen-Musik-Express",
    "manufacturer": "Mack",
    "year": 1974,
    "capacity": "40–60 Personen · 20 Chaisen",
    "rideIndexUrl": "https://ride-index.de/2005/01/13/power-express/",
    "description": "Weltes Power Express ist ein Mack-Musikexpress aus dem Jahr 1974."
  },
  {
    "id": "lounge-360",
    "name": "Lounge 360°",
    "operator": "Hanstein",
    "operatorFull": "Sascha Hanstein (Bremen)",
    "zone": "Hochfahrgeschäfte",
    "type": "Riesenrad RL 33",
    "manufacturer": "Lamberink",
    "year": 2017,
    "height": "ca. 33 m",
    "capacity": "144 Personen · 24 Gondeln",
    "rideIndexUrl": "https://ride-index.de/2017/06/24/lounge-360-grad/",
    "description": "Hansteins 33 Meter hohes Riesenrad bietet den Blick über die Halle Gartlage."
  },
  {
    "id": "break-dance",
    "name": "Break Dance",
    "operator": "Welte",
    "operatorFull": "Fredi Welte (Bramsche)",
    "zone": "Kirmesklassiker",
    "type": "HUSS Break Dance 1",
    "manufacturer": "HUSS",
    "year": 1994,
    "capacity": "32 Personen · 16 Gondeln",
    "rideIndexUrl": "https://ride-index.de/2019/02/02/break-dance-welte-2/",
    "imageUrl": "https://www.ummet-eck.de/Bilder/fotosets/1024/1-breakdance-no1-welte-menden22-c-UMM-chr-schoen.jpg",
    "imageCredit": "Ummet-Eck · Christian Schön · Weltes Break Dance",
    "imageSourceUrl": "https://www.ummet-eck.de/bildgalerien/251-Break-Dance-No-1-Welte-Fahrgeschaeft-auf-der-Kirmes-bild-4351/",
    "description": "HUSS Break Dance von Fredi Welte: drehende Gondeln und Reko."
  },
  {
    "id": "willy-der-wurm",
    "name": "Willy der Wurm",
    "operator": "Spindler",
    "operatorFull": "Spindler",
    "zone": "Familienfahrgeschäfte",
    "type": "Mini-Achterbahn MX 48",
    "manufacturer": "SBF Visa",
    "year": 2019,
    "capacity": "24 Personen",
    "rideIndexUrl": "https://ride-index.de/2026/03/08/willy-der-wurm-spindler/",
    "description": "Familienachterbahn von Spindler – der Wurm ist seit 2026 als Willy der Wurm unterwegs."
  },
  {
    "id": "phantom",
    "name": "Phantom",
    "operator": "Ordelman",
    "operatorFull": "Willy Ordelman (Apeldoorn, NL)",
    "zone": "Hochfahrgeschäfte",
    "type": "KMG XXL-Riesenschaukel",
    "manufacturer": "KMG",
    "year": 2025,
    "height": "bis 45 m",
    "capacity": "20 Personen",
    "dimensions": "18 × 14 × max. 45 m",
    "rideIndexUrl": "https://ride-index.de/2025/05/26/phantom-nl/",
    "imageUrl": "https://klassik.onride.de/onride-upic582045@640",
    "imageCredit": "onride.de · Phantom von Ordelman (2025)",
    "imageSourceUrl": "https://onride.de/viewtopic.php?t=92083",
    "description": "Das Phantom von Ordelman: die 2025 eröffnete KMG XXL-Schaukel mit aufwendiger Theaterfassade."
  },
  {
    "id": "symphonica-tower",
    "name": "Symphonica Tower",
    "operator": "van Reken-Venekamp",
    "operatorFull": "van Reken-Venekamp (NL)",
    "zone": "Hochfahrgeschäfte",
    "type": "Kettenflieger",
    "manufacturer": "Lamberink",
    "year": 2025,
    "height": "60 m",
    "capacity": "32 Personen · 16 Gondeln",
    "rideIndexUrl": "https://ride-index.de/2026/05/01/symphonica-nl/",
    "imageUrl": "https://www.looopings.nl/img/foto/26/0504symsym2.jpg",
    "imageCredit": "Looopings · Symphonica Tower, Detailaufnahme",
    "imageSourceUrl": "https://www.looopings.nl/weblog/32000/Nieuwe-zweefmolen-op-de-kermis-staat-in-het-teken-van-klassieke-muziek.html",
    "description": "Orchester-Thema hoch über der Kirmes: 60 Meter hoher Kettenflieger von Lamberink."
  },
  {
    "id": "caribbean-star",
    "name": "Caribbean Star",
    "operator": "Schneider",
    "operatorFull": "Schneider (Bürstadt)",
    "zone": "Kirmesklassiker",
    "type": "Explorer",
    "manufacturer": "Reverchon",
    "year": 1982,
    "capacity": "40 Personen · 20 Gondeln",
    "rideIndexUrl": "https://ride-index.de/2005/01/04/caribbean-star/",
    "description": "Tropisch gestalteter Reverchon Explorer, seit 2026 unter Schneider unterwegs."
  },
  {
    "id": "phantastische-reise",
    "name": "Die phantastische Reise",
    "operator": "Kutschenbauer",
    "operatorFull": "Kutschenbauer (Delmenhorst)",
    "zone": "Lauf- und Erlebnisgeschäfte",
    "type": "Simulator",
    "manufacturer": "Ferretti",
    "year": 1998,
    "capacity": "27 Personen",
    "rideIndexUrl": "https://ride-index.de/2005/01/11/new-world-3000/",
    "description": "Simulator von Kutschenbauer, früher bekannt als New World 3000."
  },
  {
    "id": "looping-star",
    "name": "Looping Star",
    "operator": "Kortekamp",
    "operatorFull": "Kortekamp (Bremen)",
    "zone": "Kirmesklassiker",
    "type": "Überschlagschaukel",
    "manufacturer": "Höpler",
    "year": 1988,
    "capacity": "12 Personen · 6 Gondeln",
    "rideIndexUrl": "https://ride-index.de/2005/04/05/looping-star/",
    "imageUrl": "https://cdn.coaster.cloud/attractions/Qq/Yb/QqYbWhAmJvwQHjDdrGqPds.jpg?class=large",
    "imageCredit": "coaster.cloud · Looping Star (Kortekamp)",
    "imageSourceUrl": "https://coaster.cloud/pt/attractions/dd3d0b6c-looping-star-kortekamp",
    "description": "Kortekamps klassische Überschlagschaukel von Höpler."
  },
  {
    "id": "ghost-villa",
    "name": "Ghost Villa",
    "operator": "van Reken",
    "operatorFull": "van Reken (NL)",
    "zone": "Lauf- und Erlebnisgeschäfte",
    "type": "Geisterbahn",
    "description": "Geisterbahn als Ersatz für das abgesagte No Limit. Betreiber laut Kirmesforum: van Reken."
  },
  {
    "id": "heroes-city-xxl",
    "name": "Heroes City XXL",
    "operator": "Zuidema",
    "operatorFull": "Frank Zuidema (Breda, NL)",
    "zone": "Lauf- und Erlebnisgeschäfte",
    "type": "Laufgeschäft",
    "manufacturer": "Gosetto",
    "year": 2008,
    "rideIndexUrl": "https://ride-index.de/2015/12/18/heroes-city-nl/",
    "imageUrl": "https://www.ummet-eck.de/Bilder/poi/678/heroes-city-xxl-zuidema-puetzchens-markt-2023.jpg",
    "imageCredit": "Ummet-Eck · Christian Schön · Heroes City XXL (2023)",
    "imageSourceUrl": "https://www.ummet-eck.de/regionen/101564-Heroes-City-XXL-Zuidema-/",
    "description": "Mehrstöckiges Superhelden-Laufgeschäft mit Hindernissen und Spiegeln."
  },
  {
    "id": "kristallpalast",
    "name": "Kristallpalast",
    "operator": "Sturm",
    "operatorFull": "Marly Sturm / Ralf Sturm (Bad Neuenahr)",
    "zone": "Lauf- und Erlebnisgeschäfte",
    "type": "Glasirrgarten / Laufgeschäft",
    "manufacturer": "Eigenbau Anton Gormanns",
    "year": 1946,
    "rideIndexUrl": "https://ride-index.de/2005/01/09/kristallpalast/",
    "imageUrl": "https://www.kirmesecke.de/Bilder/poi/678/5-kristall-palast-waeldchestag23-ffm-c-UMM-c-schoen.jpg",
    "imageCredit": "Kirmesecke / Christian Schön · Kristallpalast Sturm",
    "imageSourceUrl": "https://www.kirmesecke.de/regionen/103208-Kristall-Palast-Sturm-/",
    "description": "Traditionsreicher Glasirrgarten mit eisblauer Kristallfassade."
  }
];
  const typefaces = ["'Faster One',sans-serif","'Bungee Shade',sans-serif","'Monoton',sans-serif","'Bangers',cursive","'Limelight',serif","'Black Ops One',sans-serif","'Chango',sans-serif","'Cinzel Decorative',serif","'Audiowide',sans-serif","'Trade Winds',cursive","'Zen Tokyo Zoo',sans-serif","'Graduate',serif","'Creepster',cursive","'Bungee',sans-serif","'Fascinate Inline',serif"];
  const rides = rawRides.map((r) => ({ ...r, id: "osnabrueck-herbst26-" + r.id, priceEuro: null, new2026: false, sourceUrl: r.rideIndexUrl || lineupSource }));
  const worlds = {}, fonts = {}, aliases = {}, rideConfig = {};
  rides.forEach((r, i) => {
    worlds[r.id] = { label: (r.name + " · " + r.operator).toUpperCase(), line: r.description || "", artUrl: r.imageUrl || "", imageCredit: r.imageCredit || "", imageSourceUrl: r.imageSourceUrl || r.rideIndexUrl || lineupSource };
    fonts[r.id] = { fontFamily: typefaces[i], theme: "osnabrueck26-" + rawRides[i].id };
    aliases[r.name.toLowerCase()] = r.id;
    rideConfig[r.id] = { singleRider: false };
  });
  window.NAEHEN_OSNABRUECK_HERBSTJAHRMARKT_2026 = {
    park: {
      slug: "osnabrueck-herbstjahrmarkt-2026", kind: "fair",
      name: "Osnabrücker Herbstjahrmarkt 2026",
      location: "Osnabrück · Halle Gartlage · 30.10.–08.11.2026",
      startDate: "2026-10-30", endDate: "2026-11-08",
      officialUrl: officialDateSource, dateSourceUrl: officialDateSource, lineupSourceUrl: lineupSource,
      lineupStatus: "provisional", sortMode: "configured",
      fairZones: ["Autoscooter", "Kirmesklassiker", "Familienfahrgeschäfte", "Hochfahrgeschäfte", "Lauf- und Erlebnisgeschäfte"],
      liveDataUrl: null, liveWaits: false, supportsPostedWait: false,
      receiptTitle: "HERBSTJAHRMARKT OSNABRÜCK 2026", receiptLocation: "OSNABRÜCK · HALLE GARTLAGE",
      cardImage: "https://erleben.osnabrueck.de/fileadmin/_processed_/b/1/csm_Marketing_Osnabrueck_Herbstjahrmarkt-77_9a11333ea3.jpg",
      cardImageCredit: "Stadt Osnabrück / Marketing Osnabrück · Herbstjahrmarkt (Archivaufnahme)",
      cardImageSourceUrl: officialDateSource,
      cardCopy: "30. Oktober – 8. November · 15 gemeldete Fahr-, Lauf- und Erlebnisgeschäfte · Feuerwerk freitags · Familientag 04.11.",
      noLiveLabel: "HERBSTJAHRMARKT · KEINE LIVE-WARTEZEITEN",
      noLiveMessage: "Keine öffentlichen Live-Wartezeiten. NÄHEN misst deine persönliche Queue.",
      noLiveAlarmMessage: "Keine öffentlichen Wartezeit-Alarme verfügbar.",
      disclaimer: "Unabhängiger Fan-Begleiter, keine offizielle App. Vorläufige Beschickung nach Kirmesforum vom 31.10.2026; kurzfristige Änderungen möglich. Shock Wave, Heart Breaker und No Limit wurden nicht aufgenommen (Absagen). Der zuvor genannte Speed Drive XXL steht nicht in der jüngsten vollständigen Kirmesforum-Liste. Ohne Lageplan. Fahrpreise werden pro Fahrt manuell eingegeben."
    },
    rides, worlds, fonts, aliases, rideConfig, exclusions: { ids: [], namePatterns: [] }
  };
})();
