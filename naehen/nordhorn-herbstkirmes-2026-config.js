(() => {
  "use strict";
  // Nordhorn Herbstkirmes 2026. Neun vom Nutzer vorgegebene Geschäfte, keine erfundenen Neuheiten/Karte/Preise.
  // Datum: VVV Nordhorn; Schausteller: Nutzerbeschickung, Technik: Ride-Index.
  const rides=[
  {
    "id": "nordhorn-herbst26-mexico-city",
    "name": "Mexico City",
    "operator": "Gusik-Meeß",
    "operatorFull": "Familie Meeß-Gusik (Herne)",
    "zone": "Familienachterbahn",
    "type": "SDC Junior-Coaster",
    "manufacturer": "SDC",
    "year": 1994,
    "capacity": "24 Personen",
    "dimensions": "32 × 14 × 11 m",
    "rideIndexUrl": "https://ride-index.de/2005/01/06/mexico-city/",
    "description": "Mexiko-Flair auf dem Neumarkt: Die transportable Familienachterbahn kurvt mit ihren bunten Wagen durch eine kompakte Strecke. Unter Meeß-Gusik seit 2024 unterwegs.",
    "imageUrl": "https://www.kurier.de/media.media.5325ae68-1aea-4d30-9fda-0e2b76a36d88.original1024.jpg",
    "imageCredit": "Nordbayerischer Kurier · Mexico City, Gusik-Meeß beim Bayreuther Frühlingsfest 2025",
    "imageSourceUrl": "https://www.kurier.de/inhalt.aufbau-in-bayreuth-laeuft-diese-attraktionen-bietet-das-fruehlingsfest.de8967b7-158e-4202-a4f3-ae47fad59f65.html",
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://www.vvv-nordhorn.de/event/herbstkirmes"
  },
  {
    "id": "nordhorn-herbst26-space-x",
    "name": "Space X",
    "operator": "Marquis",
    "operatorFull": "Gilbert Marquis jun. (Dortmund)",
    "zone": "Thrill",
    "type": "Fabbri Booster / Propeller",
    "manufacturer": "Fabbri",
    "year": 2025,
    "capacity": "8 Personen · 2 Gondeln",
    "dimensions": "bis 45 m Höhe",
    "rideIndexUrl": "https://ride-index.de/2025/09/26/space-x/",
    "description": "Der 45 Meter hohe Fabbri-Propeller von Marquis lässt zwei Gondeln um den langen Hauptarm kreisen – spektakulär über Nordhorns Lichtermeer.",
    "imageUrl": "https://ride-index.de/wp-content/uploads/2025/09/SPACEX_MarquisbyHM2025-1.jpg",
    "imageCredit": "Ride-Index · Space X, Gilbert Marquis jun. (Aufnahme 2025)",
    "imageSourceUrl": "https://ride-index.de/2025/09/26/space-x/",
    "imageFallbackUrls": [
      "https://nordkirmes.net/media/1364-whatsapp-image-2025-09-27-at-18-13-19-jpeg/?thumbnail=large"
    ],
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://www.vvv-nordhorn.de/event/herbstkirmes"
  },
  {
    "id": "nordhorn-herbst26-break-dance",
    "name": "Break Dance",
    "operator": "Welte",
    "operatorFull": "Fredi Welte (Bramsche)",
    "zone": "Kirmesklassiker",
    "type": "HUSS Break Dance 1 (Nr. 50)",
    "manufacturer": "HUSS",
    "year": 1994,
    "capacity": "32 Personen · 16 Gondeln",
    "dimensions": "20 m Durchmesser",
    "rideIndexUrl": "https://ride-index.de/2019/02/02/break-dance-welte-2/",
    "description": "Weltes unverwechselbarer Break Dance No. 1: 16 Gondeln wirbeln über vier Gondelkreuze, dazu Musik, Reko und jede Menge Lichteffekte.",
    "imageUrl": "https://www.ummet-eck.de/Bilder/fotosets/1024/1-breakdance-no1-welte-menden22-c-UMM-chr-schoen.jpg",
    "imageCredit": "Ummet-Eck · Break Dance No. 1 von Fredi Welte (2022)",
    "imageSourceUrl": "https://www.ummet-eck.de/bildgalerien/251-Break-Dance-No-1-Welte-Fahrgeschaeft-auf-der-Kirmes-bild-4351/",
    "imageFallbackUrls": [
      "https://ride-index.de/wp-content/uploads/2019/02/BREAKDANCE_Welte2019.jpg"
    ],
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://www.vvv-nordhorn.de/event/herbstkirmes"
  },
  {
    "id": "nordhorn-herbst26-musik-express",
    "name": "Musik-Express",
    "operator": "Welte-Noack",
    "operatorFull": "Welte-Noack (Detmold)",
    "zone": "Kirmesklassiker",
    "type": "Cosmont Musik-Express",
    "manufacturer": "Cosmont",
    "year": 1979,
    "capacity": "60 Personen · 20 Gondeln",
    "dimensions": "19 × 17 m",
    "rideIndexUrl": "https://ride-index.de/2006/04/08/musik-express-welte-noack/",
    "description": "Berg-und-Tal-Fahrt mit Kultstatus: Der Super Musik-Express von Welte-Noack schickt seine Gondeln unter Neonlicht im Beat rundherum.",
    "imageUrl": "https://onride.de/onride-upic520799%401120",
    "imageCredit": "onride · Super Musik-Express Welte-Noack (Reisegeschäft)",
    "imageSourceUrl": "https://onride.de/viewtopic.php?t=44392",
    "imageFallbackUrls": [
      "https://ride-index.de/wp-content/uploads/2006/04/ME_Noack2007-1.jpg"
    ],
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://www.vvv-nordhorn.de/event/herbstkirmes"
  },
  {
    "id": "nordhorn-herbst26-take-off",
    "name": "Take Off",
    "operator": "Langenscheidt",
    "operatorFull": "Andreas Langenscheidt (Großefehn)",
    "zone": "Thrill",
    "type": "HUSS Take Off",
    "manufacturer": "HUSS",
    "year": 1994,
    "capacity": "40 Personen",
    "dimensions": "bis 14 m Höhe",
    "rideIndexUrl": "https://ride-index.de/2005/01/14/take-off-langenscheidt/",
    "description": "Die gesamte Plattform kippt nach oben, während sich vier Gondeln gemeinsam drehen. Ein echter HUSS-Klassiker mit wechselnden Blickrichtungen.",
    "imageUrl": "https://www.ummet-eck.de/Bilder/fotosets/1024/5-take-off-remscheid22-c-UMM-chr-schoen.jpg",
    "imageCredit": "Ummet-Eck · Take Off, Langenscheidt (2022)",
    "imageSourceUrl": "https://www.ummet-eck.de/bildgalerien/306-Take-Off-Langenscheidt-Fahrgeschaeft-auf-der-Kirmes-bild-4658/",
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://www.vvv-nordhorn.de/event/herbstkirmes"
  },
  {
    "id": "nordhorn-herbst26-aviator",
    "name": "Aviator",
    "operator": "Fischer",
    "operatorFull": "Louis Fischer & Sohn (Minden)",
    "zone": "Familienfahrgeschäft",
    "type": "The Aviator / Flugkarussell",
    "manufacturer": null,
    "year": null,
    "capacity": null,
    "dimensions": "bis 17 m Höhe",
    "rideIndexUrl": null,
    "description": "Fliegen, drehen und schwingen zugleich: Die Gondeln des Aviators heben sich bis auf 17 Meter und legen sich dynamisch in die Kurven.",
    "imageUrl": "https://www.ummet-eck.de/Bilder/fotosets/1024/4-aviator-herford23-c-UMM-silke-schoen.jpg",
    "imageCredit": "Ummet-Eck · The Aviator von Fischer, Herford 2023",
    "imageSourceUrl": "https://www.ummet-eck.de/bildgalerien/72-The-Aviator-Fischer-Fahrgeschaeft-bild-5645/",
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://www.vvv-nordhorn.de/event/herbstkirmes"
  },
  {
    "id": "nordhorn-herbst26-super-dance",
    "name": "Super Dance",
    "operator": "Braun",
    "operatorFull": "Fritz Braun (Bersenbrück)",
    "zone": "Familienfahrgeschäft",
    "type": "Kilian Scheibenwischer",
    "manufacturer": "Kilian",
    "year": 2016,
    "capacity": "18 Personen",
    "dimensions": "16 × 5,5 m",
    "rideIndexUrl": "https://ride-index.de/2016/05/28/superdance/",
    "description": "Der Scheibenwischer mit buntem Rock’n’Roll-Look: Die Sitzreihe schwingt rasant hin und her – inklusive Becherspiel und Stimmung.",
    "imageUrl": "https://ride-index.de/wp-content/uploads/2016/05/Braun-SuperDance-2023-L.jpg",
    "imageCredit": "Ride-Index · Super Dance Braun (2023)",
    "imageSourceUrl": "https://ride-index.de/2016/05/28/superdance/",
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://www.vvv-nordhorn.de/event/herbstkirmes"
  },
  {
    "id": "nordhorn-herbst26-speed-drive-xxl",
    "name": "AS Speed Drive XXL",
    "operator": "Braun",
    "operatorFull": "Fritz Braun (Osnabrück)",
    "zone": "Autoscooter",
    "type": "Adesko 2-Säulen-Autoscooter",
    "manufacturer": "Adesko",
    "year": 2024,
    "capacity": null,
    "dimensions": null,
    "rideIndexUrl": "https://ride-index.de/2024/05/04/as-braun-f-2-2/",
    "description": "Der 2024 neu gebaute XXL-Scooter von Braun mit moderner LED-Show, extra großer Fahrfläche und Drift-Funktion. Nicht die ältere Speed-Drive-Anlage.",
    "imageUrl": "https://ride-index.de/wp-content/uploads/2024/05/Braun-Speed-Drive-XXL-2026-R.jpg",
    "imageCredit": "Ride-Index · neuer Speed Drive XXL von Braun (Aufnahme 2026)",
    "imageSourceUrl": "https://ride-index.de/2024/05/04/as-braun-f-2-2/",
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://www.vvv-nordhorn.de/event/herbstkirmes"
  },
  {
    "id": "nordhorn-herbst26-ghost",
    "name": "Ghost",
    "operator": "Burghard",
    "operatorFull": "Burghard",
    "zone": "Laufgeschäft",
    "type": "Geister-Laufgeschäft / 2 Etagen",
    "manufacturer": null,
    "year": null,
    "capacity": null,
    "dimensions": "2 Etagen",
    "rideIndexUrl": null,
    "description": "Ghost – Der Geisterdschungel: Auf zwei Etagen führen schaurige Effekte, Nebel, ein Irrgarten und bewegte Hindernisse durch den Gruselwald.",
    "imageUrl": "https://www.ummet-eck.de/Bilder/fotosets/1024/2-ghost-burghard-megakirmes-wpt-2022-c-ummeteck-christian-schoen.jpg",
    "imageCredit": "Ummet-Eck · Ghost – Der Geisterdschungel von Burghard (Wuppertal 2022)",
    "imageSourceUrl": "https://www.ummet-eck.de/bildgalerien/175-Ghost-Der-Geisterdschungel-Burghard-Kirmes-Laufgeschaeft-bild-3462/",
    "priceEuro": null,
    "new2026": false,
    "sourceUrl": "https://www.vvv-nordhorn.de/event/herbstkirmes"
  }
];
  const worlds={
  "nordhorn-herbst26-mexico-city": {
    "label": "MEXICO CITY · GUSIK-MEESS",
    "line": "Mexiko-Flair auf dem Neumarkt: Die transportable Familienachterbahn kurvt mit ihren bunten Wagen durch eine kompakte Strecke. Unter Meeß-Gusik seit 2024 unterwegs.",
    "artUrl": "https://www.kurier.de/media.media.5325ae68-1aea-4d30-9fda-0e2b76a36d88.original1024.jpg",
    "imageCredit": "Nordbayerischer Kurier · Mexico City, Gusik-Meeß beim Bayreuther Frühlingsfest 2025",
    "imageSourceUrl": "https://www.kurier.de/inhalt.aufbau-in-bayreuth-laeuft-diese-attraktionen-bietet-das-fruehlingsfest.de8967b7-158e-4202-a4f3-ae47fad59f65.html"
  },
  "nordhorn-herbst26-space-x": {
    "label": "SPACE X · MARQUIS",
    "line": "Der 45 Meter hohe Fabbri-Propeller von Marquis lässt zwei Gondeln um den langen Hauptarm kreisen – spektakulär über Nordhorns Lichtermeer.",
    "artUrl": "https://ride-index.de/wp-content/uploads/2025/09/SPACEX_MarquisbyHM2025-1.jpg",
    "imageCredit": "Ride-Index · Space X, Gilbert Marquis jun. (Aufnahme 2025)",
    "imageSourceUrl": "https://ride-index.de/2025/09/26/space-x/"
  },
  "nordhorn-herbst26-break-dance": {
    "label": "BREAK DANCE · WELTE",
    "line": "Weltes unverwechselbarer Break Dance No. 1: 16 Gondeln wirbeln über vier Gondelkreuze, dazu Musik, Reko und jede Menge Lichteffekte.",
    "artUrl": "https://www.ummet-eck.de/Bilder/fotosets/1024/1-breakdance-no1-welte-menden22-c-UMM-chr-schoen.jpg",
    "imageCredit": "Ummet-Eck · Break Dance No. 1 von Fredi Welte (2022)",
    "imageSourceUrl": "https://www.ummet-eck.de/bildgalerien/251-Break-Dance-No-1-Welte-Fahrgeschaeft-auf-der-Kirmes-bild-4351/"
  },
  "nordhorn-herbst26-musik-express": {
    "label": "MUSIK-EXPRESS · WELTE-NOACK",
    "line": "Berg-und-Tal-Fahrt mit Kultstatus: Der Super Musik-Express von Welte-Noack schickt seine Gondeln unter Neonlicht im Beat rundherum.",
    "artUrl": "https://onride.de/onride-upic520799%401120",
    "imageCredit": "onride · Super Musik-Express Welte-Noack (Reisegeschäft)",
    "imageSourceUrl": "https://onride.de/viewtopic.php?t=44392"
  },
  "nordhorn-herbst26-take-off": {
    "label": "TAKE OFF · LANGENSCHEIDT",
    "line": "Die gesamte Plattform kippt nach oben, während sich vier Gondeln gemeinsam drehen. Ein echter HUSS-Klassiker mit wechselnden Blickrichtungen.",
    "artUrl": "https://www.ummet-eck.de/Bilder/fotosets/1024/5-take-off-remscheid22-c-UMM-chr-schoen.jpg",
    "imageCredit": "Ummet-Eck · Take Off, Langenscheidt (2022)",
    "imageSourceUrl": "https://www.ummet-eck.de/bildgalerien/306-Take-Off-Langenscheidt-Fahrgeschaeft-auf-der-Kirmes-bild-4658/"
  },
  "nordhorn-herbst26-aviator": {
    "label": "AVIATOR · FISCHER",
    "line": "Fliegen, drehen und schwingen zugleich: Die Gondeln des Aviators heben sich bis auf 17 Meter und legen sich dynamisch in die Kurven.",
    "artUrl": "https://www.ummet-eck.de/Bilder/fotosets/1024/4-aviator-herford23-c-UMM-silke-schoen.jpg",
    "imageCredit": "Ummet-Eck · The Aviator von Fischer, Herford 2023",
    "imageSourceUrl": "https://www.ummet-eck.de/bildgalerien/72-The-Aviator-Fischer-Fahrgeschaeft-bild-5645/"
  },
  "nordhorn-herbst26-super-dance": {
    "label": "SUPER DANCE · BRAUN",
    "line": "Der Scheibenwischer mit buntem Rock’n’Roll-Look: Die Sitzreihe schwingt rasant hin und her – inklusive Becherspiel und Stimmung.",
    "artUrl": "https://ride-index.de/wp-content/uploads/2016/05/Braun-SuperDance-2023-L.jpg",
    "imageCredit": "Ride-Index · Super Dance Braun (2023)",
    "imageSourceUrl": "https://ride-index.de/2016/05/28/superdance/"
  },
  "nordhorn-herbst26-speed-drive-xxl": {
    "label": "AS SPEED DRIVE XXL · BRAUN",
    "line": "Der 2024 neu gebaute XXL-Scooter von Braun mit moderner LED-Show, extra großer Fahrfläche und Drift-Funktion. Nicht die ältere Speed-Drive-Anlage.",
    "artUrl": "https://ride-index.de/wp-content/uploads/2024/05/Braun-Speed-Drive-XXL-2026-R.jpg",
    "imageCredit": "Ride-Index · neuer Speed Drive XXL von Braun (Aufnahme 2026)",
    "imageSourceUrl": "https://ride-index.de/2024/05/04/as-braun-f-2-2/"
  },
  "nordhorn-herbst26-ghost": {
    "label": "GHOST · BURGHARD",
    "line": "Ghost – Der Geisterdschungel: Auf zwei Etagen führen schaurige Effekte, Nebel, ein Irrgarten und bewegte Hindernisse durch den Gruselwald.",
    "artUrl": "https://www.ummet-eck.de/Bilder/fotosets/1024/2-ghost-burghard-megakirmes-wpt-2022-c-ummeteck-christian-schoen.jpg",
    "imageCredit": "Ummet-Eck · Ghost – Der Geisterdschungel von Burghard (Wuppertal 2022)",
    "imageSourceUrl": "https://www.ummet-eck.de/bildgalerien/175-Ghost-Der-Geisterdschungel-Burghard-Kirmes-Laufgeschaeft-bild-3462/"
  }
};
  const fonts={
  "nordhorn-herbst26-mexico-city": {
    "fontFamily": "'Rye',serif",
    "theme": "nordhorn26-mexico-city"
  },
  "nordhorn-herbst26-space-x": {
    "fontFamily": "'Orbitron',sans-serif",
    "theme": "nordhorn26-space-x"
  },
  "nordhorn-herbst26-break-dance": {
    "fontFamily": "'Fascinate Inline',serif",
    "theme": "nordhorn26-break-dance"
  },
  "nordhorn-herbst26-musik-express": {
    "fontFamily": "'Monoton',sans-serif",
    "theme": "nordhorn26-musik-express"
  },
  "nordhorn-herbst26-take-off": {
    "fontFamily": "'Black Ops One',sans-serif",
    "theme": "nordhorn26-take-off"
  },
  "nordhorn-herbst26-aviator": {
    "fontFamily": "'Bungee Shade',sans-serif",
    "theme": "nordhorn26-aviator"
  },
  "nordhorn-herbst26-super-dance": {
    "fontFamily": "'Faster One',sans-serif",
    "theme": "nordhorn26-super-dance"
  },
  "nordhorn-herbst26-speed-drive-xxl": {
    "fontFamily": "'Audiowide',sans-serif",
    "theme": "nordhorn26-speed-drive-xxl"
  },
  "nordhorn-herbst26-ghost": {
    "fontFamily": "'Creepster',cursive",
    "theme": "nordhorn26-ghost"
  }
};
  const aliases={
  "mexico city": "nordhorn-herbst26-mexico-city",
  "space x": "nordhorn-herbst26-space-x",
  "break dance": "nordhorn-herbst26-break-dance",
  "musik-express": "nordhorn-herbst26-musik-express",
  "take off": "nordhorn-herbst26-take-off",
  "aviator": "nordhorn-herbst26-aviator",
  "super dance": "nordhorn-herbst26-super-dance",
  "as speed drive xxl": "nordhorn-herbst26-speed-drive-xxl",
  "ghost": "nordhorn-herbst26-ghost",
  "the aviator": "nordhorn-herbst26-aviator",
  "super musik express": "nordhorn-herbst26-musik-express",
  "ghost – der geisterdschungel": "nordhorn-herbst26-ghost",
  "speed drive xxl": "nordhorn-herbst26-speed-drive-xxl"
};
  const rideConfig={
  "nordhorn-herbst26-mexico-city": {
    "singleRider": false
  },
  "nordhorn-herbst26-space-x": {
    "singleRider": false
  },
  "nordhorn-herbst26-break-dance": {
    "singleRider": false
  },
  "nordhorn-herbst26-musik-express": {
    "singleRider": false
  },
  "nordhorn-herbst26-take-off": {
    "singleRider": false
  },
  "nordhorn-herbst26-aviator": {
    "singleRider": false
  },
  "nordhorn-herbst26-super-dance": {
    "singleRider": false
  },
  "nordhorn-herbst26-speed-drive-xxl": {
    "singleRider": false
  },
  "nordhorn-herbst26-ghost": {
    "singleRider": false
  }
};
  window.NAEHEN_NORDHORN_HERBSTKIRMES_2026={
    park:{
      slug:"nordhorn-herbstkirmes-2026",
      kind:"fair",
      name:"Nordhorner Herbstkirmes 2026",
      location:"Nordhorn · Neumarkt · 23.–27.10.2026",
      startDate:"2026-10-23",
      endDate:"2026-10-27",
      officialUrl:"https://www.vvv-nordhorn.de/event/herbstkirmes",
      dateSourceUrl:"https://www.vvv-nordhorn.de/event/herbstkirmes",
      lineupSourceUrl:"https://www.vvv-nordhorn.de/event/herbstkirmes",
      liveDataUrl:null,
      liveWaits:false,
      supportsPostedWait:false,
      sortMode:"configured",
      fairZones:["Familienachterbahn","Thrill","Kirmesklassiker","Familienfahrgeschäft","Autoscooter","Laufgeschäft"],
      receiptTitle:"NORDHORNER HERBSTKIRMES 2026",
      receiptLocation:"NORDHORN · NEUMARKT",
      cardImage:"https://dam.destination.one/2616408/62c5d6ac5ed0ce4e41009b74b359822d20453acdf5ed55e5cb072dd58bf16411/dsc_0548b-jpg.jpg",
      cardImageCredit:"Grafschaft Bentheim Tourismus / destination.one · Herbstkirmes Nordhorn (Archivmotiv, CC BY-SA)",
      cardImageSourceUrl:"https://www.grafschaft-bentheim-tourismus.de/event/herbstkirmes",
      cardCopy:"23.–27. Oktober · 9 Hauptattraktionen · Neumarkt · Familientag Montag · Feuerwerk Dienstag",
      noLiveLabel:"HERBSTKIRMES · KEINE LIVE-WARTEZEITEN",
      noLiveMessage:"Für die Nordhorner Herbstkirmes gibt es keine öffentlichen Live-Wartezeiten. NÄHEN misst deine persönliche Queue.",
      noLiveAlarmMessage:"Hier sind keine öffentlichen Wartezeit-Alarme verfügbar.",
      disclaimer:"Unabhängiger Fan-Begleiter, keine offizielle App der Stadt Nordhorn. Genau neun vom Nutzer genannte Attraktionen mit Betreiberzuordnung, kein Lageplan. Datum, Neumarkt und Rahmenprogramm laut VVV-Stadtmarketing Nordhorn. Beschickung kann sich kurzfristig ändern. Die Familienachterbahn Mexico City ist zusätzlich als Nutzerangabe erfasst, obwohl sie in der offiziellen Highlight-Auswahl nicht namentlich genannt wird. Fahrpreise werden nur pro Fahrt manuell eingetragen; Bilder mit Quellenangabe in den Details."
    },
    rides,worlds,fonts,aliases,rideConfig,
    exclusions:{ids:[],namePatterns:[]}
  };
})();