(() => {
  "use strict";
  // Cranger Weihnachtszauber 2026. Stand: 12.10.2026.
  // 15 Attraktionen stehen auf der aktuellen (nicht abschließend bestätigten) Veranstalter-Liste.
  // Plus 2026 bestätigte Wichtelfabrik (Remmi Demmi) von Wilhelm, Quelle AufCrange.
  // Keine live Wartezeiten / keine Karte / keine übernommenen Fahrpreise.
  const rides=[
  {
    "id": "crange-weihnacht26-wichtelfabrik",
    "name": "Die Wichtelfabrik",
    "operator": "Wilhelm",
    "confirmed2026": true,
    "zone": "Winterliche Abenteuer",
    "type": "Mehrstöckiges Actioncenter / Laufgeschäft",
    "description": "Aus Remmi Demmi wird 2026 die Wichtelfabrik: Wilhelm verwandelt den interaktiven Hindernisparcours in eine festliche Werkstatt voller Wichtel und Überraschungen.",
    "imageUrl": "https://aufcrange.de/images/weihnachtszauber2026/news/wichtelfabrik.jpg",
    "imageCredit": "AufCrange / Wilhelm · offizielle Gestaltung Wichtelfabrik 2026",
    "imageSourceUrl": "https://aufcrange.de/cranger-weihnachtszauber/cranger-weihnachtszauber-2026/cranger-weihnachtszauber-news-2026/cranger-weihnachtszauber-2026-die-wichtelfabrik.html",
    "imageFallbackUrls": [],
    "operatorFull": "Wilhelm",
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://aufcrange.de/cranger-weihnachtszauber/cranger-weihnachtszauber-2026/cranger-weihnachtszauber-news-2026/cranger-weihnachtszauber-2026-die-wichtelfabrik.html"
  },
  {
    "id": "crange-weihnacht26-rentier-express",
    "name": "Rentier-Express",
    "operator": "",
    "zone": "Winterliche Abenteuer",
    "type": "Familien-Eisenbahn",
    "description": "Die kleine Weihnachtsbahn rollt vorbei an Schneemännern, Eisbären und Elfen durch die liebevoll gestaltete Märchenwald-Landschaft.",
    "imageUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2024/09/CrangerWeihnachtszauber-Rentierexpress3-426x284-1.jpg",
    "imageCredit": "Cranger Weihnachtszauber · Rentier-Express im Märchenwald",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/",
    "imageFallbackUrls": [],
    "operatorFull": "",
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  {
    "id": "crange-weihnacht26-alt-wiener-pferdekarussell",
    "name": "Alt Wiener Pferdekarussell",
    "operator": "",
    "zone": "Weihnachtsklassiker",
    "type": "Historisches Pferdekarussell",
    "capacity": "40 Pferde",
    "description": "Das große nostalgische Pferdekarussell: 40 Pferde bewegen sich auf und ab, während das Dach gegenläufig rotiert.",
    "imageUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2022/05/3-Alt-Wiener-Pferdekarussell-Cranger-Weihnachtszauber-426x284-1.jpg",
    "imageCredit": "Cranger Weihnachtszauber · Alt Wiener Pferdekarussell",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/",
    "imageFallbackUrls": [],
    "operatorFull": "",
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  {
    "id": "crange-weihnacht26-kinderparadies",
    "name": "Kinderparadies",
    "operator": "",
    "zone": "Für Kinder",
    "type": "Kinderkarussell",
    "description": "Einsteigen in Feuerwehrauto, Traktor oder Flieger: farbenfroher Karussellspaß für die jüngsten Weihnachtsfans.",
    "imageUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2022/06/kinderparadies-01-1-800.jpg",
    "imageCredit": "Cranger Weihnachtszauber · Kinderparadies",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/",
    "imageFallbackUrls": [],
    "operatorFull": "",
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  {
    "id": "crange-weihnacht26-autoscooter",
    "name": "Crazy Christmas Drive – Autoscooter No. 2",
    "operator": "Küchenmeister",
    "confirmed2026": true,
    "zone": "Weihnachtsklassiker",
    "type": "Autoscooter",
    "dimensions": "über 500 m² Fahrfläche",
    "description": "Küchenmeisters Autoscooter im Weihnachtsmodus: Zweisitzer-Chaisen, bunte LED-Beleuchtung und Musik in der festlich dekorierten Skooterhalle.",
    "imageUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2022/05/automatic-scooter-426x284-1.jpg",
    "imageCredit": "Cranger Weihnachtszauber · Autoscooter No. 2 von Küchenmeister",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/",
    "imageFallbackUrls": [],
    "operatorFull": "Küchenmeister",
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  {
    "id": "crange-weihnacht26-rentier-flug",
    "name": "Rentier Flug / Flying Santa",
    "operator": "Vermolen",
    "confirmed2026": true,
    "zone": "Für Kinder",
    "type": "Rentierschlitten-Flugkarussell",
    "dimensions": "bis 8 m Flughöhe",
    "capacity": "10 Gondeln",
    "description": "Zehn festlich gestaltete Rentierschlitten steigen bis acht Meter hoch – mit Rentier Rudolph und dem Weihnachtsmann in der Mitte.",
    "imageUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2022/06/Rentier-Flug-2-2-600.jpg",
    "imageCredit": "Cranger Weihnachtszauber · Rentier Flug (Vermolen)",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/",
    "imageFallbackUrls": [],
    "operatorFull": "Vermolen",
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  {
    "id": "crange-weihnacht26-white-wheel",
    "name": "White Wheel",
    "operator": "Küchenmeister",
    "operatorVerifiedPriorYear": true,
    "zone": "Aussicht & Winterlicht",
    "type": "Event-Riesenrad",
    "capacity": "24 geschlossene Gondeln · eine barrierefreie Gondel",
    "description": "Das moderne White Wheel eröffnet einen Panoramablick über das winterliche Crange. Mit geschlossenen Gondeln und großem LED-Display im Radzentrum.",
    "imageUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2022/09/CrangerWeihnachtszauber-Attraktion-WhiteWheel-426x284-1.jpg",
    "imageCredit": "Cranger Weihnachtszauber · White Wheel von Küchenmeister",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/",
    "imageFallbackUrls": [],
    "operatorFull": "Küchenmeister",
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  {
    "id": "crange-weihnacht26-spuk",
    "name": "Spuk",
    "operator": "",
    "zone": "Grusel & Abenteuer",
    "type": "Geistercoaster / Geisterbahn",
    "description": "Der zweistöckige Geistercoaster schickt drehende Gondeln durch dunkle Szenen und schaurige Effekte – so präsentiert ihn die Veranstalterseite.",
    "imageUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2024/09/CrangerWeihnachtszauber-Spuk-Geistercoaster-428x284-1.jpg",
    "imageCredit": "Cranger Weihnachtszauber · Spuk-Geistercoaster, Archivaufnahme",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/",
    "imageFallbackUrls": [],
    "operatorFull": "",
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  {
    "id": "crange-weihnacht26-love-express",
    "name": "Love Express",
    "operator": "Kreft",
    "confirmed2026": true,
    "zone": "Weihnachtsklassiker",
    "type": "Musik-Express / Berg-und-Tal-Bahn",
    "description": "Der Love Express von Kreft wirbelt mit bis zu drei Personen je Gondel über kleine Hügel und durch den beleuchteten Tunnel.",
    "imageUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2022/06/love-express-03-800.jpg",
    "imageCredit": "Cranger Weihnachtszauber · Love Express von Kreft",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/",
    "imageFallbackUrls": [],
    "operatorFull": "Kreft",
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  {
    "id": "crange-weihnacht26-mexico-city",
    "name": "Mexico City",
    "operator": "Meeß-Gusik",
    "confirmed2026": true,
    "zone": "Achterbahnen",
    "type": "SDC Familienachterbahn",
    "manufacturer": "SDC",
    "year": 1994,
    "rideIndexUrl": "https://ride-index.de/2005/01/06/mexico-city/",
    "description": "Die mobile Familienachterbahn von Meeß-Gusik schlängelt sich durch enge Kurven und buntes Mexiko-Theming – ein winterliches Coaster-Abenteuer.",
    "imageUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2024/09/CrangerWeihnachtszauber-Mexicocity-426x284-1.jpg",
    "imageCredit": "Cranger Weihnachtszauber · Mexico City von Meeß-Gusik",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/",
    "imageFallbackUrls": [],
    "operatorFull": "Meeß-Gusik",
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  {
    "id": "crange-weihnacht26-konga",
    "name": "KONGA",
    "operator": "Küchenmeister",
    "operatorVerifiedPriorYear": true,
    "zone": "Adrenalin",
    "type": "XXL-Großschaukel",
    "dimensions": "bis 45 m Höhe",
    "description": "Dschungelrufe statt Weihnachtsglocken: KONGA schwingt in 45 Meter Höhe und kombiniert große Pendelbewegungen mit einem drehenden Gondelring.",
    "imageUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2022/11/Konga-426x284-1.jpg",
    "imageCredit": "Cranger Weihnachtszauber · KONGA (Küchenmeister)",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/",
    "imageFallbackUrls": [],
    "operatorFull": "Küchenmeister",
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  {
    "id": "crange-weihnacht26-der-polyp",
    "name": "Der Polyp",
    "operator": "Dreßen",
    "confirmed2026": true,
    "zone": "Adrenalin",
    "type": "Polyp-Rundfahrgeschäft",
    "description": "Mehrere bewegliche Arme und rotierende Zweiergondeln sorgen für ein unberechenbares Fahrgefühl – die Polyp-Anlage von Dreßen.",
    "imageUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2025/11/CrangerWeihnachtszauber-Polyp5-426x284-1.jpg",
    "imageCredit": "Cranger Weihnachtszauber · Der Polyp von Dreßen (2025)",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/",
    "imageFallbackUrls": [],
    "operatorFull": "Dreßen",
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  {
    "id": "crange-weihnacht26-space-x",
    "name": "Space X",
    "operator": "Marquis",
    "operatorVerifiedPriorYear": true,
    "zone": "Adrenalin",
    "type": "Fabbri Booster / Propeller",
    "manufacturer": "Fabbri",
    "year": 2025,
    "dimensions": "bis 45 m Höhe",
    "capacity": "8 Personen",
    "rideIndexUrl": "https://ride-index.de/2025/09/26/space-x/",
    "description": "Der futuristische Fabbri-Propeller von Gilbert Marquis jun. dreht zwei Gondeln hoch über den Winterlichtern – volle Geschwindigkeit und Überschläge.",
    "imageUrl": "https://ride-index.de/wp-content/uploads/2025/09/SPACEX_MarquisbyHM2025-1.jpg",
    "imageCredit": "Ride-Index · Space X von Gilbert Marquis jun. (2025)",
    "imageSourceUrl": "https://ride-index.de/2025/09/26/space-x/",
    "imageFallbackUrls": [
      "https://cranger-weihnachtszauber.de/wp-content/uploads/2025/10/CrangerWeihnachtszauber-AttraktionSpaceX2-426x568-1.jpg"
    ],
    "operatorFull": "Marquis",
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  {
    "id": "crange-weihnacht26-bounty",
    "name": "Bounty",
    "operator": "Bossle",
    "confirmed2026": true,
    "zone": "Für Kinder",
    "type": "Kinder-Piratenschaukel",
    "description": "Die kleine Piratenschaukel von Bossle lädt Nachwuchskapitäne zu einer sanften Seefahrt im Winterkirmes-Stil ein.",
    "imageUrl": "https://www.ummet-eck.de/Bilder/poi/678/kinder-schiffsschaukel-bounty-piratenschiff-menden-2022.jpg",
    "imageCredit": "Ummet-Eck / Christian Schön · Bounty, Bossle (2022)",
    "imageSourceUrl": "https://www.ummet-eck.de/regionen/103087-Bounty-Bossle/",
    "imageFallbackUrls": [],
    "operatorFull": "Bossle",
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  {
    "id": "crange-weihnacht26-happy-slide",
    "name": "Happy Slide",
    "operator": "",
    "zone": "Winterliche Abenteuer",
    "type": "Sechsbahn-Wellenrutsche",
    "dimensions": "18 m hoch · 40 m lang",
    "description": "Wettrutschen auf sechs Wellenbahnen: Auf Matten geht es hinunter durch den Weihnachtsmarkt-Trubel.",
    "imageUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2024/11/CrangerWeihnachtszauber-HappySlide-428x284-1.jpg",
    "imageCredit": "Cranger Weihnachtszauber · Happy Slide",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/",
    "imageFallbackUrls": [],
    "operatorFull": "",
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  {
    "id": "crange-weihnacht26-brunos-freche-farm",
    "name": "Brunos freche Farm",
    "operator": "",
    "zone": "Für Kinder",
    "type": "Kinder-Fahrschleife",
    "description": "Eine eigene Runde auf bunten Traktoren: Brunos freche Farm führt kleine Landwirte vorbei an niedlichen Bauernhoftieren.",
    "imageUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2025/10/CrangerWeihnachtszauber-AttraktionBrunosFrecheFarm2-426x568-1.jpg",
    "imageCredit": "Cranger Weihnachtszauber · Brunos freche Farm",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/",
    "imageFallbackUrls": [],
    "operatorFull": "",
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  }
];
  const worlds={
  "crange-weihnacht26-wichtelfabrik": {
    "label": "DIE WICHTELFABRIK · WILHELM",
    "line": "Aus Remmi Demmi wird 2026 die Wichtelfabrik: Wilhelm verwandelt den interaktiven Hindernisparcours in eine festliche Werkstatt voller Wichtel und Überraschungen.",
    "artUrl": "https://aufcrange.de/images/weihnachtszauber2026/news/wichtelfabrik.jpg",
    "imageCredit": "AufCrange / Wilhelm · offizielle Gestaltung Wichtelfabrik 2026",
    "imageSourceUrl": "https://aufcrange.de/cranger-weihnachtszauber/cranger-weihnachtszauber-2026/cranger-weihnachtszauber-news-2026/cranger-weihnachtszauber-2026-die-wichtelfabrik.html"
  },
  "crange-weihnacht26-rentier-express": {
    "label": "RENTIER-EXPRESS",
    "line": "Die kleine Weihnachtsbahn rollt vorbei an Schneemännern, Eisbären und Elfen durch die liebevoll gestaltete Märchenwald-Landschaft.",
    "artUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2024/09/CrangerWeihnachtszauber-Rentierexpress3-426x284-1.jpg",
    "imageCredit": "Cranger Weihnachtszauber · Rentier-Express im Märchenwald",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  "crange-weihnacht26-alt-wiener-pferdekarussell": {
    "label": "ALT WIENER PFERDEKARUSSELL",
    "line": "Das große nostalgische Pferdekarussell: 40 Pferde bewegen sich auf und ab, während das Dach gegenläufig rotiert.",
    "artUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2022/05/3-Alt-Wiener-Pferdekarussell-Cranger-Weihnachtszauber-426x284-1.jpg",
    "imageCredit": "Cranger Weihnachtszauber · Alt Wiener Pferdekarussell",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  "crange-weihnacht26-kinderparadies": {
    "label": "KINDERPARADIES",
    "line": "Einsteigen in Feuerwehrauto, Traktor oder Flieger: farbenfroher Karussellspaß für die jüngsten Weihnachtsfans.",
    "artUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2022/06/kinderparadies-01-1-800.jpg",
    "imageCredit": "Cranger Weihnachtszauber · Kinderparadies",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  "crange-weihnacht26-autoscooter": {
    "label": "CRAZY CHRISTMAS DRIVE – AUTOSCOOTER NO. 2 · KÜCHENMEISTER",
    "line": "Küchenmeisters Autoscooter im Weihnachtsmodus: Zweisitzer-Chaisen, bunte LED-Beleuchtung und Musik in der festlich dekorierten Skooterhalle.",
    "artUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2022/05/automatic-scooter-426x284-1.jpg",
    "imageCredit": "Cranger Weihnachtszauber · Autoscooter No. 2 von Küchenmeister",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  "crange-weihnacht26-rentier-flug": {
    "label": "RENTIER FLUG / FLYING SANTA · VERMOLEN",
    "line": "Zehn festlich gestaltete Rentierschlitten steigen bis acht Meter hoch – mit Rentier Rudolph und dem Weihnachtsmann in der Mitte.",
    "artUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2022/06/Rentier-Flug-2-2-600.jpg",
    "imageCredit": "Cranger Weihnachtszauber · Rentier Flug (Vermolen)",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  "crange-weihnacht26-white-wheel": {
    "label": "WHITE WHEEL · KÜCHENMEISTER",
    "line": "Das moderne White Wheel eröffnet einen Panoramablick über das winterliche Crange. Mit geschlossenen Gondeln und großem LED-Display im Radzentrum.",
    "artUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2022/09/CrangerWeihnachtszauber-Attraktion-WhiteWheel-426x284-1.jpg",
    "imageCredit": "Cranger Weihnachtszauber · White Wheel von Küchenmeister",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  "crange-weihnacht26-spuk": {
    "label": "SPUK",
    "line": "Der zweistöckige Geistercoaster schickt drehende Gondeln durch dunkle Szenen und schaurige Effekte – so präsentiert ihn die Veranstalterseite.",
    "artUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2024/09/CrangerWeihnachtszauber-Spuk-Geistercoaster-428x284-1.jpg",
    "imageCredit": "Cranger Weihnachtszauber · Spuk-Geistercoaster, Archivaufnahme",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  "crange-weihnacht26-love-express": {
    "label": "LOVE EXPRESS · KREFT",
    "line": "Der Love Express von Kreft wirbelt mit bis zu drei Personen je Gondel über kleine Hügel und durch den beleuchteten Tunnel.",
    "artUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2022/06/love-express-03-800.jpg",
    "imageCredit": "Cranger Weihnachtszauber · Love Express von Kreft",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  "crange-weihnacht26-mexico-city": {
    "label": "MEXICO CITY · MEESS-GUSIK",
    "line": "Die mobile Familienachterbahn von Meeß-Gusik schlängelt sich durch enge Kurven und buntes Mexiko-Theming – ein winterliches Coaster-Abenteuer.",
    "artUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2024/09/CrangerWeihnachtszauber-Mexicocity-426x284-1.jpg",
    "imageCredit": "Cranger Weihnachtszauber · Mexico City von Meeß-Gusik",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  "crange-weihnacht26-konga": {
    "label": "KONGA · KÜCHENMEISTER",
    "line": "Dschungelrufe statt Weihnachtsglocken: KONGA schwingt in 45 Meter Höhe und kombiniert große Pendelbewegungen mit einem drehenden Gondelring.",
    "artUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2022/11/Konga-426x284-1.jpg",
    "imageCredit": "Cranger Weihnachtszauber · KONGA (Küchenmeister)",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  "crange-weihnacht26-der-polyp": {
    "label": "DER POLYP · DRESSEN",
    "line": "Mehrere bewegliche Arme und rotierende Zweiergondeln sorgen für ein unberechenbares Fahrgefühl – die Polyp-Anlage von Dreßen.",
    "artUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2025/11/CrangerWeihnachtszauber-Polyp5-426x284-1.jpg",
    "imageCredit": "Cranger Weihnachtszauber · Der Polyp von Dreßen (2025)",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  "crange-weihnacht26-space-x": {
    "label": "SPACE X · MARQUIS",
    "line": "Der futuristische Fabbri-Propeller von Gilbert Marquis jun. dreht zwei Gondeln hoch über den Winterlichtern – volle Geschwindigkeit und Überschläge.",
    "artUrl": "https://ride-index.de/wp-content/uploads/2025/09/SPACEX_MarquisbyHM2025-1.jpg",
    "imageCredit": "Ride-Index · Space X von Gilbert Marquis jun. (2025)",
    "imageSourceUrl": "https://ride-index.de/2025/09/26/space-x/"
  },
  "crange-weihnacht26-bounty": {
    "label": "BOUNTY · BOSSLE",
    "line": "Die kleine Piratenschaukel von Bossle lädt Nachwuchskapitäne zu einer sanften Seefahrt im Winterkirmes-Stil ein.",
    "artUrl": "https://www.ummet-eck.de/Bilder/poi/678/kinder-schiffsschaukel-bounty-piratenschiff-menden-2022.jpg",
    "imageCredit": "Ummet-Eck / Christian Schön · Bounty, Bossle (2022)",
    "imageSourceUrl": "https://www.ummet-eck.de/regionen/103087-Bounty-Bossle/"
  },
  "crange-weihnacht26-happy-slide": {
    "label": "HAPPY SLIDE",
    "line": "Wettrutschen auf sechs Wellenbahnen: Auf Matten geht es hinunter durch den Weihnachtsmarkt-Trubel.",
    "artUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2024/11/CrangerWeihnachtszauber-HappySlide-428x284-1.jpg",
    "imageCredit": "Cranger Weihnachtszauber · Happy Slide",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  },
  "crange-weihnacht26-brunos-freche-farm": {
    "label": "BRUNOS FRECHE FARM",
    "line": "Eine eigene Runde auf bunten Traktoren: Brunos freche Farm führt kleine Landwirte vorbei an niedlichen Bauernhoftieren.",
    "artUrl": "https://cranger-weihnachtszauber.de/wp-content/uploads/2025/10/CrangerWeihnachtszauber-AttraktionBrunosFrecheFarm2-426x568-1.jpg",
    "imageCredit": "Cranger Weihnachtszauber · Brunos freche Farm",
    "imageSourceUrl": "https://cranger-weihnachtszauber.de/attraktionen/"
  }
};
  const fonts={
  "crange-weihnacht26-wichtelfabrik": {
    "fontFamily": "'UnifrakturCook',serif",
    "theme": "crange26-wichtelfabrik"
  },
  "crange-weihnacht26-rentier-express": {
    "fontFamily": "'Rye',serif",
    "theme": "crange26-rentier-express"
  },
  "crange-weihnacht26-alt-wiener-pferdekarussell": {
    "fontFamily": "'Cinzel Decorative',serif",
    "theme": "crange26-alt-wiener-pferdekarussell"
  },
  "crange-weihnacht26-kinderparadies": {
    "fontFamily": "'Bangers',cursive",
    "theme": "crange26-kinderparadies"
  },
  "crange-weihnacht26-autoscooter": {
    "fontFamily": "'Audiowide',sans-serif",
    "theme": "crange26-autoscooter"
  },
  "crange-weihnacht26-rentier-flug": {
    "fontFamily": "'Chewy',cursive",
    "theme": "crange26-rentier-flug"
  },
  "crange-weihnacht26-white-wheel": {
    "fontFamily": "'Poiret One',sans-serif",
    "theme": "crange26-white-wheel"
  },
  "crange-weihnacht26-spuk": {
    "fontFamily": "'Creepster',cursive",
    "theme": "crange26-spuk"
  },
  "crange-weihnacht26-love-express": {
    "fontFamily": "'Monoton',sans-serif",
    "theme": "crange26-love-express"
  },
  "crange-weihnacht26-mexico-city": {
    "fontFamily": "'Chango',sans-serif",
    "theme": "crange26-mexico-city"
  },
  "crange-weihnacht26-konga": {
    "fontFamily": "'Metal Mania',cursive",
    "theme": "crange26-konga"
  },
  "crange-weihnacht26-der-polyp": {
    "fontFamily": "'Rubik Glitch',sans-serif",
    "theme": "crange26-der-polyp"
  },
  "crange-weihnacht26-space-x": {
    "fontFamily": "'Orbitron',sans-serif",
    "theme": "crange26-space-x"
  },
  "crange-weihnacht26-bounty": {
    "fontFamily": "'Pirata One',cursive",
    "theme": "crange26-bounty"
  },
  "crange-weihnacht26-happy-slide": {
    "fontFamily": "'Faster One',sans-serif",
    "theme": "crange26-happy-slide"
  },
  "crange-weihnacht26-brunos-freche-farm": {
    "fontFamily": "'DM Serif Display',serif",
    "theme": "crange26-brunos-freche-farm"
  }
};
  const aliases={
  "die wichtelfabrik": "crange-weihnacht26-wichtelfabrik",
  "rentier-express": "crange-weihnacht26-rentier-express",
  "alt wiener pferdekarussell": "crange-weihnacht26-alt-wiener-pferdekarussell",
  "kinderparadies": "crange-weihnacht26-kinderparadies",
  "crazy christmas drive – autoscooter no. 2": "crange-weihnacht26-autoscooter",
  "rentier flug / flying santa": "crange-weihnacht26-rentier-flug",
  "white wheel": "crange-weihnacht26-white-wheel",
  "spuk": "crange-weihnacht26-spuk",
  "love express": "crange-weihnacht26-love-express",
  "mexico city": "crange-weihnacht26-mexico-city",
  "konga": "crange-weihnacht26-konga",
  "der polyp": "crange-weihnacht26-der-polyp",
  "space x": "crange-weihnacht26-space-x",
  "bounty": "crange-weihnacht26-bounty",
  "happy slide": "crange-weihnacht26-happy-slide",
  "brunos freche farm": "crange-weihnacht26-brunos-freche-farm",
  "crazy christmas drive": "crange-weihnacht26-autoscooter",
  "autoscooter": "crange-weihnacht26-autoscooter",
  "rentierflug": "crange-weihnacht26-rentier-flug",
  "flying santa": "crange-weihnacht26-rentier-flug",
  "remmi demmi": "crange-weihnacht26-wichtelfabrik",
  "der polyp dreßen": "crange-weihnacht26-der-polyp"
};
  const rideConfig={
  "crange-weihnacht26-wichtelfabrik": {
    "singleRider": false
  },
  "crange-weihnacht26-rentier-express": {
    "singleRider": false
  },
  "crange-weihnacht26-alt-wiener-pferdekarussell": {
    "singleRider": false
  },
  "crange-weihnacht26-kinderparadies": {
    "singleRider": false
  },
  "crange-weihnacht26-autoscooter": {
    "singleRider": false
  },
  "crange-weihnacht26-rentier-flug": {
    "singleRider": false
  },
  "crange-weihnacht26-white-wheel": {
    "singleRider": false
  },
  "crange-weihnacht26-spuk": {
    "singleRider": false
  },
  "crange-weihnacht26-love-express": {
    "singleRider": false
  },
  "crange-weihnacht26-mexico-city": {
    "singleRider": false
  },
  "crange-weihnacht26-konga": {
    "singleRider": false
  },
  "crange-weihnacht26-der-polyp": {
    "singleRider": false
  },
  "crange-weihnacht26-space-x": {
    "singleRider": false
  },
  "crange-weihnacht26-bounty": {
    "singleRider": false
  },
  "crange-weihnacht26-happy-slide": {
    "singleRider": false
  },
  "crange-weihnacht26-brunos-freche-farm": {
    "singleRider": false
  }
};
  window.NAEHEN_CRANGER_WEIHNACHTSZAUBER_2026={
    park:{
      slug:"cranger-weihnachtszauber-2026",
      kind:"fair",
      name:"Cranger Weihnachtszauber 2026",
      location:"Herne-Crange · Kirmesplatz · 19.11.–30.12.2026",
      startDate:"2026-11-19",
      endDate:"2026-12-30",
      closedDates:["2026-12-24","2026-12-25"],
      officialUrl:"https://cranger-weihnachtszauber.de/",
      dateSourceUrl:"https://cranger-weihnachtszauber.de/",
      lineupSourceUrl:"https://cranger-weihnachtszauber.de/attraktionen/",
      additionalLineupSourceUrl:"https://www.aufcrange.de/component/tags/tag/353-weihnachtskirmes.html",
      liveDataUrl:null,liveWaits:false,supportsPostedWait:false,
      sortMode:"configured",
      fairZones:["Adrenalin","Achterbahnen","Grusel & Abenteuer","Winterliche Abenteuer","Weihnachtsklassiker","Aussicht & Winterlicht","Für Kinder"],
      receiptTitle:"CRANGER WEIHNACHTSZAUBER 2026",
      receiptLocation:"HERNE · CRANGER KIRMESPLATZ",
      cardImage:"https://dev.derwesten.de/wp-content/uploads/sites/8/2022/05/Cranger-Weihnachtszauber-1.jpg",
      cardImageFallback:"https://www.24rhein.de/assets/images/33/291/33291466-ausblick-auf-den-cranger-weihnachtszauber-mit-riesenrad-und-weihnachstbaum-28MH.jpg",
      cardImageCredit:"DerWesten · Eingang Cranger Weihnachtszauber (Archivfoto)",
      cardImageSourceUrl:"https://dev.derwesten.de/region/cranger-weihnachtszauber-corona-regeln-herne-maskenpflicht-2g-id233952567.html",
      cardCopy:"19. November – 30. Dezember · 16 vorläufig erfasste Attraktionen · 24./25. Dezember geschlossen",
      noLiveLabel:"WEIHNACHTSKIRMES · KEINE LIVE-WARTEZEITEN",
      noLiveMessage:"Der Cranger Weihnachtszauber veröffentlicht keine Echtzeit-Wartezeiten. NÄHEN misst deine persönliche Queue.",
      noLiveAlarmMessage:"Keine Wartezeit-Alarme ohne öffentlichen Live-Feed.",
      disclaimer:"Unabhängige Fan-Übersicht, keine offizielle App. Vorläufiger Datenstand 12.10.2026: 15 Attraktionen werden aktuell auf der Veranstalterseite aufgeführt, dazu die für 2026 namentlich angekündigte Wichtelfabrik von Wilhelm. Die AufCrange-Vorab-Beschickung weicht teilweise ab (etwa Geister Villa statt Spuk). Alle Einträge und Schausteller ohne ausdrückliche 2026-Bestätigung bleiben vorläufig; einige Fotos zeigen ältere Aufnahmen derselben Anlagen. Die frühere große Weihnachtsbaum-Ausschankanlage entfällt 2026; Archivbilder geben nicht den endgültigen Aufbau wieder. 24. und 25. Dezember geschlossen. Fahrpreise werden nur je Fahrt manuell erfasst.",
      eventNotice:"2026-VORABLISTE · Änderungen möglich | Ruhetage 24. & 25. Dezember"
    },
    rides,worlds,fonts,aliases,rideConfig,exclusions:{ids:[],namePatterns:[]}
  };
})();