/* NÄHEN: geprüfte Attraktionsdaten · Stand 20.11.2026.
 * Messwerte sind keine Schätzungen. Nicht öffentlich bestätigte Werte fehlen absichtlich.
 * Europa-Park: offizielle Attraktionsseiten (europapark.de).
 * Phantasialand: offizielle Nutzungsübersicht (Mindest-/Maximalgrößen),
 * technische Achterbahndaten: Roller Coaster DataBase (rcdb.com).
 * Kapazitätsangaben sind theoretische Anlagenwerte, keine Live-Operatorleistung.
 */
(() => {
  "use strict";
  const ep={}, phl={};
  function group(target,type,ids){
    ids.trim().split(/\s+/).forEach(id=>{
      if(target[id]) throw Error("Doppelte Attraktionsart: "+id);
      target[id]={type};
    });
  }
  const coaster=ep;
  group(coaster,"Achterbahn","alpenexpress-enzian ba-a-a-express blue-fire-megacoaster euro-mir eurosat-cancan-coaster matterhorn-blitz pegasus schweizer-bobbahn silver-star voltron-nevera wodan-timburcoaster wasserachterbahn-poseidon");
  group(ep,"Suspended Powered Coaster","arthur");
  group(ep,"Wasserattraktion","atlantica-supersplash fjord-rafting tiroler-wildwasserbahn whale-adventures-northern-lights quipse-paddle-boats");
  group(ep,"Themenfahrt / Dark Ride","castello-dei-medici madame-freudenreich-curiosites marionetten-bootsfahrt piccolo-mondo piraten-in-batavia schlittenfahrt-schneefloeckchen snorri-touren wichtelhausen elfenfahrt");
  group(ep,"Themenfahrt / Bootsfahrt","josefinas-kaiserliche-zauberreise");
  group(ep,"Interaktive Themenfahrt","abenteuer-atlantis grand-prix-edventure");
  group(ep,"Parkbahn / Rundfahrt","ep-express monorail-bahn panoramabahn donau-dampfer jim-knopf-reise-durch-lummerland old-mac-donalds-tractor-fun oldtimer-fahrt silverstone-piste lada-autodrom");
  group(ep,"Karussell / Rundfahrgeschäft","british-carousel muel-muels-karussell koffiekopjes liechtensteiner-ballonfahrt roter-baron spinning-dragons");
  group(ep,"Familienfahrgeschäft","crazy-taxi dancing-dingie fliegender-hollaender kolumbusjolle london-bus poppy-towers sheep-rock");
  group(ep,"Kettenkarussell","feria-swing wiener-wellenflieger");
  group(ep,"Rundfahrgeschäft / Flugattraktion","jungfrau-gletscherflieger");
  group(ep,"Interaktives Rundfahrgeschäft","volo-da-vinci");
  group(ep,"Schiffschaukel","vindjammer");
  group(ep,"Mad House / Illusionsfahrt","fluch-der-kassandra");
  group(ep,"Aussichtsturm","euro-tower");
  group(ep,"Flying Theater / Flugsimulator","voletarium");
  group(ep,"Interaktiver Kletterturm","tower-tow");
  group(ep,"Autoscooter / Fahrgeschäft","arena-football mini-scooter");
  // 2026 Europa-Park, Angaben der jeweiligen offiziellen Attraktionsseite.
  const ed={
    "voltron-nevera":{manufacturer:"MACK Rides",year:2024,heightM:32.5,trackLengthM:1385,speedKmh:100,duration:"3:00",inversions:7,launches:4,maxG:4,minHeightCm:130,minAgeYears:8,capacityPerHour:1600,vehicles:"16 Personen pro Zug",special:"Steilster Launch: 105°; Inverted Stall: 2,2 s Schwerelosigkeit"},
    "silver-star":{manufacturer:"Bolliger & Mabillard",year:2002,heightM:73,speedKmh:130,duration:"3:00",maxG:4,minHeightCm:140,minAgeYears:11,capacityPerHour:1620,vehicles:"36 Personen pro Zug"},
    "blue-fire-megacoaster":{manufacturer:"MACK Rides",year:2009,heightM:38,trackLengthM:1000,speedKmh:100,duration:"2:20",inversions:4,launches:1,maxG:3.8,minHeightCm:130,minAgeYears:7,capacityPerHour:1450,vehicles:"20 Personen pro Zug",special:"0–100 km/h in 2,5 Sekunden"},
    "wodan-timburcoaster":{manufacturer:"Great Coasters International (GCI)",year:2012,heightM:40,trackLengthM:1050,speedKmh:100,duration:"2:30",inversions:0,maxG:3.5,minHeightCm:120,minAgeYears:6,capacityPerHour:1250,vehicles:"24 Personen pro Zug"},
    "euro-mir":{manufacturer:"MACK Rides",year:1997,heightM:28.3,speedKmh:80,duration:"5:00",maxG:4,minHeightCm:130,maxHeightCm:195,minAgeYears:8,capacityPerHour:1600,vehicles:"16 Personen pro Zug"},
    "eurosat-cancan-coaster":{manufacturer:"MACK Rides",year:2018,heightM:45,speedKmh:60,duration:"3:30",maxG:4,minHeightCm:120,maxHeightCm:195,minAgeYears:6,capacityPerHour:1280,vehicles:"14 Personen pro Zug"},
    "wasserachterbahn-poseidon":{manufacturer:"MACK Rides",year:2000,heightM:23,speedKmh:70,duration:"5:50",maxG:3,minHeightCm:120,minAgeYears:6,capacityPerHour:1600,vehicles:"8 Personen pro Boot"},
    "pegasus":{manufacturer:"MACK Rides",year:2006,heightM:13,speedKmh:65,duration:"2:11",minHeightCm:100,minAgeYears:4,capacityPerHour:1000,vehicles:"18 Personen pro Zug"},
    "matterhorn-blitz":{manufacturer:"MACK Rides",year:1999,heightM:16,speedKmh:60,duration:"2:20",minHeightCm:120,minAgeYears:6,capacityPerHour:969,vehicles:"4 Personen pro Wagen"},
    "schweizer-bobbahn":{manufacturer:"MACK Rides",year:1985,heightM:20,speedKmh:50,duration:"2:05",maxG:3,capacityPerHour:1220,vehicles:"12 Personen pro Zug"},
    "atlantica-supersplash":{manufacturer:"MACK Rides",year:2005,heightM:30,speedKmh:80,duration:"3:35",minHeightCm:100,minAgeYears:4,capacityPerHour:1400,vehicles:"16 Personen pro Boot"},
    "tiroler-wildwasserbahn":{manufacturer:"MACK Rides",year:"1978 / Wiedereröffnung 2024",heightM:18,duration:"4:30",minHeightCm:100,minAgeYears:4,capacityPerHour:1600,vehicles:"6 Personen pro Boot"},
    "fjord-rafting":{manufacturer:"Intamin",year:1991,duration:"4:25",minHeightCm:100,minAgeYears:4,capacityPerHour:1800,vehicles:"6 Personen pro Boot"},
    "alpenexpress-enzian":{manufacturer:"MACK Rides",year:"1984 / Neubau 2024",speedKmh:45,duration:"1:40",minHeightCm:90,minAgeYears:3,capacityPerHour:1050,vehicles:"38 Personen pro Zug"},
    "arthur":{manufacturer:"MACK Rides",year:2014,duration:"4:30",minHeightCm:100,minAgeYears:4,capacityPerHour:1100,vehicles:"12 Personen pro Zug"},
    "voletarium":{manufacturer:"Brogent / Kraftwerk Living Technologies",year:2017,duration:"4:45",minHeightCm:100,minAgeYears:4,capacityPerHour:1200,vehicles:"10 Personen pro Gondel"},
    "piraten-in-batavia":{manufacturer:"MACK Rides",year:2020,duration:"8:00",capacityPerHour:1800,vehicles:"16 Personen pro Boot"},
    "snorri-touren":{manufacturer:"MACK Rides",year:2019,duration:"4:30",vehicles:"4 Personen pro Gondel"},
    "grand-prix-edventure":{manufacturer:"MACK Rides",year:2025,duration:"6:00",minHeightCm:90,minAgeYears:3,capacityPerHour:1100,vehicles:"8 Personen pro Gondel"},
    "euro-tower":{manufacturer:"Intamin",year:1983,heightM:75,duration:"3:37",minHeightCm:120,minAgeYears:6,capacityPerHour:600,vehicles:"50 Sitzplätze"},
    "fluch-der-kassandra":{manufacturer:"MACK Rides",year:2000,duration:"3:30",minHeightCm:110,minAgeYears:5,vehicles:"52 Sitzplätze"},
    "tower-tow":{manufacturer:"Sunkid Heege",year:2016,heightM:9,duration:"1:40",minHeightCm:95,minAgeYears:3,capacityPerHour:192,vehicles:"8 Sitzplätze"},
    "volo-da-vinci":{manufacturer:"ETF",year:2011,heightM:7,trackLengthM:300,duration:"5:00",minHeightCm:90,minAgeYears:3,capacityPerHour:400,vehicles:"4 Personen pro Gondel"},
    "ba-a-a-express":{manufacturer:"MACK Rides",year:2016,duration:"1:30",capacityPerHour:400,vehicles:"10 Personen pro Zug"},
    "fliegender-hollaender":{manufacturer:"MACK Rides",year:1982,duration:"1:35",minHeightCm:100,minAgeYears:4,capacityPerHour:670,vehicles:"2 Personen pro Gondel"},
    "vindjammer":{manufacturer:"Huss",year:1993,duration:"2:00",minHeightCm:100,minAgeYears:4,capacityPerHour:1080,vehicles:"54 Sitzplätze"},
    "liechtensteiner-ballonfahrt":{manufacturer:"Morgan",year:"1996 / Neuer Standort 2023",duration:"2:00",capacityPerHour:600,vehicles:"4 Personen pro Gondel"},
    "piccolo-mondo":{manufacturer:"MACK Rides",year:1982,duration:"3:10",capacityPerHour:1000,vehicles:"6 Personen pro Zug"},
    "jungfrau-gletscherflieger":{manufacturer:"MACK Rides",year:1989,duration:"1:30",minHeightCm:120,minAgeYears:6,capacityPerHour:700,vehicles:"2 Personen pro Gondel"},
    "kolumbusjolle":{manufacturer:"MACK Rides",year:1994,duration:"1:30",minHeightCm:100,minAgeYears:4,capacityPerHour:900,vehicles:"2 Personen pro Gondel"},
    "wiener-wellenflieger":{manufacturer:"Zierer",year:2006,heightM:8.5,duration:"2:00",minHeightCm:100,minAgeYears:4,capacityPerHour:510,vehicles:"32 Sitzplätze"},
    "oldtimer-fahrt":{manufacturer:"MACK Rides",year:1976,duration:"2:38",capacityPerHour:570,vehicles:"4 Personen pro Auto"}
  };
  Object.entries(ed).forEach(([id,facts])=>Object.assign(ep[id]||(ep[id]={}),facts));
  // Phantasialand. Fahrtypen/Technik: RCDB; Größenvorgaben: offizielle Wintertraum-Übersicht.
  group(phl,"Multi-Launch-Coaster","taron");
  group(phl,"Flying Launch Coaster","fly");
  group(phl,"Inverted Coaster","black-mamba");
  group(phl,"Indoor-Freifallturm","mystery-castle");
  group(phl,"Wildwasserbahn","chiapas");
  group(phl,"Mine Train Coaster","colorado-adventure");
  group(phl,"Suspended Top Spin","talocan");
  group(phl,"Rafting","river-quest");
  group(phl,"Family Boomerang","raik");
  group(phl,"Indoor Spinning Coaster","winjas-fear winjas-force");
  group(phl,"Themenfahrt / Dark Ride","geister-rikscha die-3-mausketiere");
  group(phl,"Interaktiver 3D-Dark Ride","maus-au-chocolat");
  group(phl,"VR-Achterbahn","crazy-bats");
  group(phl,"Abenteuerpfad","deep-in-africa-adventure-trail");
  group(phl,"Interaktives Laufgeschäft","das-verrueckte-hotel-tartueff");
  group(phl,"Eislauffläche","berliner-eislaufen");
  const safety="https://www.phantasialand.de/de/themenpark/einzigartige-attraktionen/uebersicht-winter/";
  const pd={
    "taron":{manufacturer:"Intamin",year:2016,heightM:30,trackLengthM:1320,speedKmh:117,inversions:0,launches:2,capacityPerHour:1200,vehicles:"16 Personen pro Zug",minHeightCm:130,technicalSourceUrl:"https://rcdb.com/12723.htm"},
    "fly":{manufacturer:"Vekoma",year:2020,heightM:19.5,trackLengthM:1234,speedKmh:78,inversions:2,launches:2,capacityPerHour:1440,vehicles:"20 Personen pro Zug",minHeightCm:130,maxHeightCm:205,minAgeYears:8,technicalSourceUrl:"https://rcdb.com/15201.htm"},
    "black-mamba":{manufacturer:"Bolliger & Mabillard",year:2006,heightM:26,trackLengthM:768,speedKmh:80,inversions:4,maxG:4,capacityPerHour:1500,vehicles:"32 Personen pro Zug",minHeightCm:140,maxHeightCm:195,minAgeYears:10,technicalSourceUrl:"https://rcdb.com/3117.htm"},
    "colorado-adventure":{manufacturer:"Vekoma",year:1996,heightM:26,trackLengthM:1280,speedKmh:50,inversions:0,duration:"2:55",capacityPerHour:2300,minHeightCm:100,technicalSourceUrl:"https://rcdb.com/978.htm"},
    "raik":{manufacturer:"Vekoma",year:2016,heightM:25,trackLengthM:209,speedKmh:62,inversions:0,capacityPerHour:720,vehicles:"20 Personen pro Zug",minHeightCm:100,technicalSourceUrl:"https://rcdb.com/13689.htm"},
    "winjas-fear":{manufacturer:"Maurer Rides",year:2002,heightM:17.4,trackLengthM:465,speedKmh:66,inversions:0,minHeightCm:120,maxHeightCm:200,minAgeYears:6,vehicles:"4 Personen pro Wagen",technicalSourceUrl:"https://rcdb.com/1235.htm"},
    "winjas-force":{manufacturer:"Maurer Rides",year:2002,heightM:17.4,trackLengthM:410,speedKmh:60,inversions:0,minHeightCm:120,maxHeightCm:200,minAgeYears:6,vehicles:"4 Personen pro Wagen",technicalSourceUrl:"https://rcdb.com/1235.htm"},
    "mystery-castle":{manufacturer:"Intamin / Ride Trade",year:1998,towerHeightM:65,minHeightCm:130,maxHeightCm:195,minAgeYears:10,technicalSourceUrl:"https://www.phantasialand.de/de/themenpark/einzigartige-attraktionen/mystery-castle/"},
    "chiapas":{year:2014,minHeightCm:120,special:"Steilste Wildwasserbahn-Abfahrt: 53°",technicalSourceUrl:"https://www.phantasialand.de/de/themenpark/einzigartige-attraktionen/chiapas-die-wasserbahn/"},
    "talocan":{manufacturer:"Huss Rides",year:2007,minHeightCm:140,maxHeightCm:195,minAgeYears:10,technicalSourceUrl:"https://www.phantasialand.de/de/themenpark/einzigartige-attraktionen/talocan/"},
    "river-quest":{minHeightCm:120,technicalSourceUrl:"https://www.phantasialand.de/de/themenpark/einzigartige-attraktionen/river-quest/"},
    "geister-rikscha":{technicalSourceUrl:"https://www.phantasialand.de/de/themenpark/einzigartige-attraktionen/geister-rikscha/"},
    "maus-au-chocolat":{minHeightCm:90,technicalSourceUrl:"https://www.phantasialand.de/de/themenpark/einzigartige-attraktionen/maus-au-chocolat/"},
    "die-3-mausketiere":{minHeightCm:90},
    "crazy-bats":{manufacturer:"Vekoma",minHeightCm:100,technicalSourceUrl:"https://rcdb.com/980.htm"},
    "deep-in-africa-adventure-trail":{minHeightCm:90,minAgeYears:3},
    "das-verrueckte-hotel-tartueff":{minHeightCm:100},
    "berliner-eislaufen":{}
  };
  Object.entries(pd).forEach(([id,facts])=>Object.assign(phl[id]||(phl[id]={}),facts));
  Object.values(phl).forEach(v=>{v.safetySourceUrl=safety;});
  // Movie Park Germany · 32 catalog attractions, reviewed 26.11.2026.
  // Technical coaster figures: Roller Coaster DataBase (rcdb.com);
  // speed, access and non-coaster facts: official Movie Park attraction pages.
  // Foot/mph figures from RCDB are represented in rounded metric units.
  // Never synthesize missing height, speed, capacity, duration or opening year.
  const mpg={};
  group(mpg,"Film-/Effektsimulator","journey-to-the-forbidden-chamber");
  group(mpg,"Multi Dimension Coaster","movie-park-studio-tour");
  group(mpg,"Freifallturm","the-high-fall");
  group(mpg,"Wilde Maus / Achterbahn","ghost-chasers");
  group(mpg,"Interaktiver Flugturm","splat-o-sphere");
  group(mpg,"Suspended Family Coaster","jimmy-neutrons-atomic-flyer");
  group(mpg,"Familienfahrgeschäft","zumas-zoomers paw-patrol-adventure-tour");
  group(mpg,"Top Spin / Überschlagfahrgeschäft","nyc-transformer");
  group(mpg,"Inverted Coaster","iron-claw");
  group(mpg,"Junior Coaster","backyardigans-mission-to-mars");
  group(mpg,"Riesenrad","santa-monica-wheel");
  group(mpg,"Familienkarussell","sea-swing");
  group(mpg,"Indoor-Achterbahn","van-helsings-factory");
  group(mpg,"Interaktive Themenfahrt","rescue-112");
  group(mpg,"Frisbee / Pendelfahrgeschäft","side-kick");
  group(mpg,"Disk’O / Rundfahrgeschäft","crazy-surfer");
  group(mpg,"Launch Coaster","star-trek-operation-enterprise");
  group(mpg,"Kettenkarussell","pier-side-carousel");
  group(mpg,"Holzachterbahn","the-bandit");
  group(mpg,"Wildwasserbahn","doras-big-river-adventure");
  group(mpg,"Wasser-Dark-Ride","area-51-top-secret");
  group(mpg,"Interaktive Wasserfahrt","spongebob-splash-bash");
  group(mpg,"Bewegungssimulator","time-riders");
  group(mpg,"Flugkarussell","avatar-air-glider");
  group(mpg,"Teetassenkarussell","fairy-world-spin");
  group(mpg,"Rundfahrgeschäft / Boot","stormy-cruise");
  group(mpg,"Höhenkarussell","skyes-high-flyer");
  group(mpg,"Kinderfahrschule","teenage-mutant-ninja-turtles-license-to-drive");
  group(mpg,"Themenfahrt / Rafting","excalibur-secrets-of-the-dark-forest");
  group(mpg,"Spielplatz","spielplatz-santa-monica");
  group(mpg,"4D-Kino","roxy-4d");
  const mpSources={
    "journey-to-the-forbidden-chamber":"journey-to-the-forbidden-chamber",
    "movie-park-studio-tour":"movie-park-studio-tour",
    "the-high-fall":"the-high-fall",
    "ghost-chasers":"ghost-chasers",
    "splat-o-sphere":"splat-o-sphere",
    "jimmy-neutrons-atomic-flyer":"jimmy-neutrons-atomic-flyer",
    "zumas-zoomers":"zumas-zoomers",
    "nyc-transformer":"nyc-transformer",
    "iron-claw":"ironclaw",
    "backyardigans-mission-to-mars":"backyardigans-mission-to-mars",
    "santa-monica-wheel":"santa-monica-wheel",
    "sea-swing":"sea-swing",
    "van-helsings-factory":"vanhelsings-factory",
    "rescue-112":"rescue-112",
    "side-kick":"side-kick",
    "crazy-surfer":"crazy-surfer",
    "paw-patrol-adventure-tour":"paw-patrol-adventure-tour",
    "star-trek-operation-enterprise":"star-trek-operation-enterprise",
    "pier-side-carousel":"pier-side-carousel",
    "the-bandit":"the-bandit",
    "doras-big-river-adventure":"doras-big-river-adventure",
    "area-51-top-secret":"area-51-top-secret",
    "spongebob-splash-bash":"spongeBob-splash-bash",
    "time-riders":"time-riders",
    "avatar-air-glider":"avatar-air-glider",
    "fairy-world-spin":"fairy-world-spin",
    "stormy-cruise":"stormy-cruise",
    "skyes-high-flyer":"skyes-high-flyer",
    "teenage-mutant-ninja-turtles-license-to-drive":"tmnt-license-to-drive",
    "excalibur-secrets-of-the-dark-forest":"excalibur-secrets-of-the-dark-forest",
    "spielplatz-santa-monica":"spielplatz-santa-monica",
    "roxy-4d":"roxy-4d"
  };
  // Minima are with adult accompaniment where indicated in "special"; they
  // are not unconditional solo-admission permissions.
  const md={
    "journey-to-the-forbidden-chamber":{
      minHeightCm:100,
      special:"Ab 130 cm allein; 100–129 cm nur mit Begleitung."
    },
    "movie-park-studio-tour":{
      manufacturer:"Intamin",year:2021,heightM:12,trackLengthM:532,speedKmh:60,
      duration:"2:00",inversions:0,launches:2,capacityPerHour:900,
      vehicles:"12 Personen pro Zug",minHeightCm:110,minAgeYears:5,
      special:"110–129 cm nur mit Begleitung · Drehplattform und Vor-/Rückwärtsbeschleunigung.",
      technicalSourceUrl:"https://rcdb.com/18666.htm"
    },
    "the-high-fall":{
      towerHeightM:60,speedKmh:98,minHeightCm:145,maxHeightCm:195,minAgeYears:10,
      technicalSourceUrl:"https://www.movieparkgermany.de/erlebnisse/attraktionen/the-high-fall"
    },
    "ghost-chasers":{
      manufacturer:"MACK Rides",year:2000,heightM:14,trackLengthM:370,speedKmh:45,
      inversions:0,duration:"1:50",capacityPerHour:1120,vehicles:"4 Personen pro Wagen",
      minHeightCm:120,maxHeightCm:195,minAgeYears:6,
      technicalSourceUrl:"https://rcdb.com/966.htm"
    },
    "splat-o-sphere":{minHeightCm:120,minAgeYears:6},
    "jimmy-neutrons-atomic-flyer":{
      manufacturer:"Vekoma",year:2007,heightM:13,trackLengthM:295,speedKmh:47,
      inversions:0,duration:"0:48",vehicles:"16 Personen pro Zug",
      minHeightCm:95,maxHeightCm:205,minAgeYears:4,
      special:"Unter 130 cm nur mit Begleitung.",
      technicalSourceUrl:"https://rcdb.com/3675.htm"
    },
    "zumas-zoomers":{
      special:"Kinder unter 90 cm und unter 4 Jahren nur mit Begleitung."
    },
    "nyc-transformer":{minHeightCm:140,maxHeightCm:195},
    "iron-claw":{
      manufacturer:"Vekoma",year:2001,heightM:33.3,trackLengthM:689,speedKmh:80,
      inversions:5,duration:"1:36",capacityPerHour:1040,vehicles:"20 Personen pro Zug",
      minHeightCm:130,maxHeightCm:195,minAgeYears:10,
      technicalSourceUrl:"https://rcdb.com/969.htm"
    },
    "backyardigans-mission-to-mars":{
      manufacturer:"Vekoma",year:1996,heightM:8.5,trackLengthM:207,speedKmh:35,
      inversions:0,duration:"0:44",capacityPerHour:780,vehicles:"16 Personen pro Zug",
      minHeightCm:90,minAgeYears:4,
      special:"Unter 135 cm nur mit Begleitung.",
      technicalSourceUrl:"https://rcdb.com/968.htm"
    },
    "santa-monica-wheel":{
      heightM:20,special:"Unter 130 cm nur mit Begleitung."
    },
    "sea-swing":{minHeightCm:90,maxHeightCm:160},
    "van-helsings-factory":{
      manufacturer:"Gerstlauer",year:2011,heightM:8,trackLengthM:400,speedKmh:36,
      inversions:0,capacityPerHour:848,vehicles:"4 Personen pro Wagen",
      minHeightCm:120,minAgeYears:12,technicalSourceUrl:"https://rcdb.com/9539.htm"
    },
    "rescue-112":{special:"Unter 135 cm nur mit Begleitung."},
    "side-kick":{minHeightCm:145,maxHeightCm:195},
    "crazy-surfer":{
      minHeightCm:120,minAgeYears:6,
      special:"120–129 cm nur mit Begleitung."
    },
    "paw-patrol-adventure-tour":{
      special:"Kinder unter 90 cm nur gemäß Begleitregelung des Parks."
    },
    "star-trek-operation-enterprise":{
      manufacturer:"MACK Rides",year:2017,trackLengthM:720,speedKmh:90,
      inversions:3,launches:3,vehicles:"20 Personen pro Zug",minHeightCm:130,minAgeYears:7,
      special:"Multi-Pass-Launch und 40 m hoher Twisted Vertical Rollback.",
      technicalSourceUrl:"https://rcdb.com/13796.htm"
    },
    "pier-side-carousel":{minHeightCm:120},
    "the-bandit":{
      manufacturer:"Roller Coaster Corporation of America",year:1999,heightM:27.8,
      trackLengthM:1100,speedKmh:78,inversions:0,duration:"1:30",
      vehicles:"30 Personen pro Zug",minHeightCm:120,minAgeYears:6,
      technicalSourceUrl:"https://rcdb.com/967.htm"
    },
    "doras-big-river-adventure":{
      minHeightCm:100,minAgeYears:2,
      special:"100–119 cm nur mit Begleitung."
    },
    "area-51-top-secret":{
      minHeightCm:90,special:"90–119 cm nur mit Begleitung."
    },
    "spongebob-splash-bash":{
      minHeightCm:90,special:"90–119 cm nur mit Begleitung."
    },
    "time-riders":{minHeightCm:110,minAgeYears:4},
    "avatar-air-glider":{
      minHeightCm:120,minAgeYears:6,
      special:"120–139 cm nur mit Begleitung."
    },
    "fairy-world-spin":{
      minHeightCm:100,minAgeYears:2,
      special:"Ab 100 cm, nur mit Begleitung."
    },
    "stormy-cruise":{
      minAgeYears:4,
      special:"Kinder von 100–129 cm nur mit Begleitung."
    },
    "skyes-high-flyer":{
      minAgeYears:2,special:"Unter 135 cm nur mit Begleitung."
    },
    "teenage-mutant-ninja-turtles-license-to-drive":{
      minHeightCm:121,maxHeightCm:150,
      special:"Größenangaben beziehen sich auf den Trainings-Parcours."
    },
    "excalibur-secrets-of-the-dark-forest":{
      minHeightCm:110,vehicles:"Bis zu 9 Personen pro Boot",
      special:"110–139 cm nur mit Begleitung."
    },
    "spielplatz-santa-monica":{},
    "roxy-4d":{
      special:"Keine Mindestgröße laut Parkangaben."
    }
  };
  for (const [id,facts] of Object.entries(md)) {
    if (!mpg[id]) throw Error("Unbekannte Movie-Park-Attraktion in Technikdaten: "+id);
    Object.assign(mpg[id],facts);
  }
  for(const [id,facts] of Object.entries(mpg)){
    const slug=mpSources[id];
    if (!slug) throw Error("Movie-Park-Quellenlink fehlt: "+id);
    const official="https://www.movieparkgermany.de/erlebnisse/attraktionen/"+slug;
    facts.safetySourceUrl=official;
    if (!facts.technicalSourceUrl) facts.technicalSourceUrl=official;
  }
  window.NAEHEN_ATTRACTION_FACTS=Object.freeze({
    "europa-park":Object.freeze(ep),
    "phantasialand":Object.freeze(phl),
    "movie-park-germany":Object.freeze(mpg)
  });
})();
