(() => {
  "use strict";
  // NÄHEN · Frost & Fun Mannheim 2026 · OHNE LAGEPLAN.
  // 3 Fahrgeschäfte vom Veranstalter genannt, 5 weitere sekundär/vorläufig gemeldet.
  // Fahrpreise sind ausschließlich manuell pro Fahrt zu erfassen.
  const rawRides=[
  {
    "id": "tiki-taki-xxl",
    "name": "Tiki Taki XXL",
    "operator": "Paulsen",
    "operatorFull": "Robert Paulsen (Handorf)",
    "zone": "Adrenalin",
    "type": "KMG XXL-Pendelschaukel",
    "manufacturer": "KMG (NL)",
    "year": 2025,
    "dimensions": "18 × 13 × max. 46,5 m",
    "height": "46,5 m",
    "speedKmh": 130,
    "gForce": 4,
    "capacity": "20 Personen",
    "technicalSourceUrl": "https://volksfestefinder.de/fahrgeschaeft/tiki-taki-xxl-paulsen",
    "rideIndexUrl": "https://ride-index.de/2025/11/02/tiki-taxi-xxl/",
    "imageUrl": "https://www.hamburg-dom-fieber.de/images/hamburg-dom-fieberde/xxl-schaukel-tiki-taki-xxl-og.jpeg.webp",
    "imageCredit": "Hamburg DOM Fieber · Tiki Taki XXL (Paulsen), Archivaufnahme",
    "imageSourceUrl": "https://www.hamburg-dom-fieber.de/xxl-schaukel-tiki-taki-xxl",
    "description": "Tropische XXL-Schaukel mit vier nach innen gerichteten Sitzreihen, drehendem Gondelkreuz und großer Pendelbewegung.",
    "lineupStatus": "provisional"
  },
  {
    "id": "avenger-royal",
    "name": "Avenger Royal",
    "operator": "Kirschbaum",
    "operatorFull": "Florian Kirschbaum (Gollhofen)",
    "zone": "Adrenalin",
    "type": "Inversion 12",
    "manufacturer": "KMG (NL)",
    "year": 2013,
    "dimensions": "20 × 16 × max. 24 m",
    "height": "24 m",
    "capacity": "12 Personen · 3 Gondeln",
    "rideIndexUrl": "https://ride-index.de/2013/03/31/avenger/",
    "imageUrl": "https://www.ummet-eck.de/Bilder/fotosets/1024/avenger-royal-bad-griesbach23-c-KIE-c-schoen-4.jpg",
    "imageCredit": "Ummet-Eck · Christian Schön · Avenger Royal (Kirschbaum)",
    "imageSourceUrl": "https://www.ummet-eck.de/",
    "description": "KMG Inversion mit drei Gondeln, mehreren Drehachsen und Überkopfbewegungen.",
    "lineupStatus": "provisional"
  },
  {
    "id": "bayern-breaker",
    "name": "Bayern Breaker",
    "operator": "Lagerin",
    "operatorFull": "Monty Lagerin (Rodenbach)",
    "zone": "Kirmesklassiker",
    "type": "Break Dance 1",
    "manufacturer": "Huss (D)",
    "year": 1991,
    "dimensions": "20 × 20 × 14,8 m",
    "height": "14,8 m",
    "capacity": "32 Personen · 16 Gondeln",
    "rideIndexUrl": "https://ride-index.de/2005/01/04/bayernbreaker-lagerin/",
    "imageUrl": "https://kermisplanner.nl/uploads/attractions/attraction-bayern-breaker/1681937972_d5d8c39655e872a7cde3.jpg",
    "imageCredit": "Kermisplanner · Bayern Breaker (Lagerin)",
    "imageSourceUrl": "https://kermisplanner.nl/nl/attractie/bayern-breaker-0985NOo2",
    "description": "Blau-weißer Break Dance No. 1 mit 16 frei drehenden Zweiergondeln.",
    "lineupStatus": "confirmed"
  },
  {
    "id": "magic",
    "name": "Magic",
    "operator": "Spangenberger",
    "operatorFull": "Spangenberger (Püttlingen)",
    "zone": "Kirmesklassiker",
    "type": "Magic",
    "manufacturer": "Huss (D)",
    "year": 1996,
    "dimensions": "24 × 24 m Grundfläche",
    "capacity": "48 Personen · 12 Gondeln",
    "rideIndexUrl": "https://ride-index.de/2005/01/10/magic-spangenberger/",
    "imageUrl": "https://www.kirmesecke.de/Bilder/fotosets/1024/magic-spangenberger-aschaff2023-c-UMM-schoen-7.jpg",
    "imageCredit": "Kirmesecke · Christian Schön · Magic (Spangenberger)",
    "imageSourceUrl": "https://www.kirmesecke.de/bildgalerien/506-Magic-Spangenberger-Fahrgeschaeft-Kirmes-bild-7390/",
    "description": "Huss Magic mit mehreren gleichzeitig rotierenden und hebenden Gondelgruppen im Zirkusdesign.",
    "lineupStatus": "confirmed"
  },
  {
    "id": "eyecatcher",
    "name": "Eyecatcher",
    "operator": "Kipp",
    "operatorFull": "Kipp & Sohn KG (Bonn)",
    "zone": "Aussicht & Winterlicht",
    "type": "Riesenrad RR5542",
    "manufacturer": "Mondial (NL)",
    "year": 2025,
    "dimensions": "23 × 19 × 55 m",
    "height": "55 m",
    "capacity": "252 Personen · 42 Gondeln",
    "rideIndexUrl": "https://ride-index.de/2025/11/02/eyecatcher-kipp/",
    "imageUrl": "https://img.allgemeine-zeitung.de/incoming/lbii9m-eyecatcher1.jpg/alternates/GOOGLE_1200_4_3/eyecatcher1.jpg.webp",
    "imageCredit": "Allgemeine Zeitung · Eyecatcher (Kipp), Archivaufnahme",
    "imageSourceUrl": "https://www.allgemeine-zeitung.de/",
    "description": "55 Meter hohes Riesenrad mit 42 Gondeln; für die Winterveranstaltung sind beheizte Sitzmöglichkeiten angekündigt.",
    "lineupStatus": "confirmed"
  },
  {
    "id": "koeniglicher-wellenflug",
    "name": "Königlicher Wellenflug",
    "operator": "Kaplan",
    "operatorFull": "Manuel Kaplan (Worms)",
    "zone": "Familie & Spaß",
    "type": "Wellenflug / Kettenflieger",
    "manufacturer": "Zierer (D)",
    "year": 1986,
    "dimensions": "16 × 16 × 14 m",
    "height": "14 m",
    "rideIndexUrl": "https://ride-index.de/2005/01/14/wellenflug-kaplan/",
    "imageUrl": "https://i.postimg.cc/Vk1LFwBd/D-Rheinkirmes-23-81.jpg",
    "imageCredit": "polypweb.eu · MartijnH · Königlicher Wellenflug (Kaplan)",
    "imageSourceUrl": "https://www.polypweb.eu/viewtopic.php?t=21542",
    "description": "Klassischer, reich verzierter Kettenflieger mit schwingenden Sitzen und ansteigendem Dach.",
    "lineupStatus": "provisional"
  },
  {
    "id": "mikes-pitstop",
    "name": "Mike’s Pitstop",
    "operator": "Cornelius",
    "operatorFull": "Mike Cornelius (Wallenhorst)",
    "zone": "Familie & Spaß",
    "type": "4-Etagen-Laufgeschäft",
    "manufacturer": "Gosetto (I)",
    "year": 2022,
    "dimensions": "31/25 × 9 × 16 m",
    "height": "16 m",
    "rideIndexUrl": "https://ride-index.de/2022/08/29/mikes-pitstop/",
    "imageUrl": "https://www.ummet-eck.de/Bilder/fotosets/1024/mikespitstop-luedenscheid23-c-UMM-schoen.jpg",
    "imageCredit": "Ummet-Eck · Christian Schön · Mike’s Pitstop (Cornelius)",
    "imageSourceUrl": "https://www.ummet-eck.de/bildgalerien/399-Mikes-Pitstop-Cornelius-Laufgeschaeft-auf-der-Kirmes-bild-6373/",
    "description": "Vierstöckiges Laufgeschäft mit bunter Werkstatt- und Motorsport-Fassade.",
    "lineupStatus": "provisional"
  },
  {
    "id": "musik-express",
    "name": "Musik Express",
    "operator": "Schoeneseifen",
    "operatorFull": "Josef Schoeneseifen (Bergheim)",
    "zone": "Kirmesklassiker",
    "type": "2-Säulen-Musik-Express / Berg- und Talbahn",
    "manufacturer": "Mack (D)",
    "year": 1978,
    "dimensions": "18 × 17 m Grundfläche",
    "capacity": "60 Personen · 20 Gondeln",
    "rideIndexUrl": "https://ride-index.de/2005/01/08/musik-express-schoeneseifen/",
    "imageUrl": "https://www.ummet-eck.de/Bilder/fotosets/1024/1-musikExpress-waldbroel22-c-UMM-chr-schoen.jpg",
    "imageCredit": "Ummet-Eck · Christian Schön · Musik Express (Schoeneseifen)",
    "imageSourceUrl": "https://www.ummet-eck.de/bildgalerien/299-MusikExpress-Schoeneseifen-Kirmes-bild-4578/",
    "description": "Musik-Express mit 20 Gondeln, Berg-und-Tal-Fahrt und bunter Musik- und Lichtkulisse.",
    "lineupStatus": "provisional"
  }
];
  const rides=rawRides.map(ride=>({
    ...ride,
    id:"mannheim-frost26-"+ride.id,
    new2026:false,
    priceEuro:null,
    sourceUrl:ride.rideIndexUrl||"https://vtm-ma.de/veranstaltung/frost-fun/"
  }));
  const worlds={},fonts={},aliases={},rideConfig={};
  const typefaces=[
    "'Trade Winds',cursive",
    "'Black Ops One',sans-serif",
    "'Bangers',cursive",
    "'Rye',serif",
    "'Orbitron',sans-serif",
    "'Cinzel Decorative',serif",
    "'Graduate',serif",
    "'Monoton',sans-serif"
  ];
  rides.forEach((ride,index)=>{
    const key=rawRides[index].id;
    worlds[ride.id]={
      label:(ride.name+" · "+ride.operator).toUpperCase(),
      line:(ride.lineupStatus==="confirmed"?"OFFIZIELL GENANNT · ":"VORLÄUFIG GEMELDET · ")+ride.description,
      artUrl:ride.imageUrl,
      imageCredit:ride.imageCredit,
      imageSourceUrl:ride.imageSourceUrl
    };
    fonts[ride.id]={fontFamily:typefaces[index],theme:"mannheim-frost26-"+key};
    aliases[ride.name.toLocaleLowerCase("de")]=ride.id;
    rideConfig[ride.id]={singleRider:false};
  });
  aliases["tiki taki"]=aliases["tiki taki xxl"];
  aliases["mikes pitstop"]=aliases["mike’s pitstop"];
  aliases["bayernbreaker"]=aliases["bayern breaker"];
  aliases["avenger"]=aliases["avenger royal"];
  window.NAEHEN_MANNHEIM_FROST_AND_FUN_2026={
    park:{
      slug:"mannheim-frost-and-fun-2026",
      kind:"fair",
      name:"Frost & Fun Mannheim 2026",
      location:"Mannheim · Neuer Messplatz · 20.11.–20.12.2026",
      startDate:"2026-11-20",
      endDate:"2026-12-20",
      officialUrl:"https://vtm-ma.de/veranstaltung/frost-fun/",
      dateSourceUrl:"https://vtm-ma.de/veranstaltung/frost-fun/",
      lineupSourceUrl:"https://vtm-ma.de/mannheims-winter-wird-noch-vielfaeltiger-frost-fun-feiert-premiere/",
      additionalLineupSourceUrl:"https://kirmestermine.eu/events/mannheim-frost-fun-2026/",
      liveDataUrl:null,
      liveWaits:false,
      supportsPostedWait:false,
      sortMode:"configured",
      fairZones:["Adrenalin","Kirmesklassiker","Aussicht & Winterlicht","Familie & Spaß"],
      openingHours:{weekday:"15:00–21:30",weekend:"14:00–21:30"},
      actionDates:["2026-11-24","2026-12-01","2026-12-08","2026-12-15"],
      receiptTitle:"FROST & FUN MANNHEIM 2026",
      receiptLocation:"MANNHEIM · NEUER MESSPLATZ",
      cardImage:"https://img.allgemeine-zeitung.de/incoming/lbii9m-eyecatcher1.jpg/alternates/GOOGLE_1200_4_3/eyecatcher1.jpg.webp",
      cardImageCredit:"Allgemeine Zeitung · Eyecatcher von Kipp (Archivaufnahme, nicht Frost & Fun 2026)",
      cardImageSourceUrl:"https://www.allgemeine-zeitung.de/",
      cardCopy:"20. November – 20. Dezember · 8 gemeldete Attraktionen · dienstags Aktionstage",
      noLiveLabel:"WINTERJAHRMARKT · KEINE LIVE-WARTEZEITEN",
      noLiveMessage:"Auf Frost & Fun gibt es keine öffentlichen Live-Wartezeiten. Fahrten werden ohne Queue-Timer direkt mit dem tatsächlich gezahlten Preis eingetragen.",
      noLiveAlarmMessage:"Ohne Live-Wartezeiten sind keine Wartezeit-Alarme möglich.",
      eventNotice:"PREMIERE 2026 · 3 offiziell genannte Fahrgeschäfte + 5 vorläufig gemeldete · ohne Lageplan · Aktionstage 24.11., 01./08./15.12.",
      disclaimer:"Unabhängige Fan-App, kein offizielles Angebot der VTM Mannheim GmbH. Termine, Zeiten und die Fahrgeschäfte Eyecatcher, Bayern Breaker und Magic sind vom Veranstalter bzw. in dessen Pressemitteilung bestätigt. Die fünf übrigen Fahrgeschäfte sind sekundär gemeldet und vorläufig; kurzfristige Änderungen möglich. Fotos zeigen dieselben reisenden Anlagen an früheren Standorten, nicht den Aufbau von Frost & Fun. Es liegt kein Veranstaltungs-Lageplan vor. Jeder Fahrpreis wird bei jeder Fahrt neu und manuell erfasst."
    },
    rides,worlds,fonts,aliases,rideConfig,exclusions:{ids:[],namePatterns:[]}
  };
})();
