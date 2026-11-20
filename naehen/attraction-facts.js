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
  group(ep,"Themenfahrt / Dark Ride","castello-dei-medici madame-freudenreich-curiosites marionetten-bootsfahrt pic colo-mondo piraten-in-batavia schlittenfahrt-schneefloeckchen snorri-touren wichtelhausen elfenfahrt".replace("pic colo-mondo","piccolo-mondo"));
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
  window.NAEHEN_ATTRACTION_FACTS=Object.freeze({
    "europa-park":Object.freeze(ep),
    "phantasialand":Object.freeze(phl)
  });
})();
