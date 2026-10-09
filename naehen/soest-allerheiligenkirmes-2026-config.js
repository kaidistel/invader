(() => {
  "use strict";

  const rawRides = [
    {
      id:"mythos", name:"Mythos", operator:"Högerle", operatorFull:"Jacqueline Högerle & Christian Göbel",
      new2026:true, manufacturer:"Technical Park (I)", type:"Heavy Rotation", year:2024,
      dimensions:"19 × 18 × 18 m", capacity:"20 Personen · 10 Gondeln", priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2024/06/28/mythos/",
      imageUrl:"https://www.pz-news.de/cms_media/module_img/10280/5140079_1_detailinline_Mythos_eine_Bratpfanne_der_ganz_besonderen_Art._Hoegerle.jpg",
      imageCredit:"Pforzheimer Zeitung", imageSourceUrl:"https://www.pz-news.de/"
    },
    {
      id:"eyecatcher", name:"Eyecatcher", operator:"Kipp", operatorFull:"Kipp & Sohn KG (Bonn)",
      new2026:true, manufacturer:"Mondial (NL)", type:"Riesenrad RR5542", year:2025,
      dimensions:"23 × 19 × 55 m", capacity:"252 Personen · 42 Gondeln", priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2025/11/02/eyecatcher-kipp/",
      imageUrl:"https://img.allgemeine-zeitung.de/incoming/lbii9m-eyecatcher1.jpg/alternates/GOOGLE_1200_4_3/eyecatcher1.jpg.webp",
      imageCredit:"Allgemeine Zeitung", imageSourceUrl:"https://www.allgemeine-zeitung.de/"
    },
    {
      id:"punk-flasher", name:"Punk Flasher", operator:"Glöss", operatorFull:"Dajana Glöss (Leer)",
      new2026:true, manufacturer:"Fabbri (I)", type:"Booster 27/8", year:2025,
      dimensions:"19 × 7,5 × 27 m", capacity:"8 Personen", priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2025/11/16/punk-flasher/",
      imageUrl:"https://i.imgur.com/nKpH7nh.jpeg",
      imageCredit:"Funfair2304 / polypweb.eu", imageSourceUrl:"https://www.polypweb.eu/viewtopic.php?t=25276"
    },
    {
      id:"shock-wave", name:"Shock Wave", operator:"Hortz", operatorFull:"Karl Hortz (Langen/Emsland)",
      new2026:true, manufacturer:"Tivoli Enterprises (GB)", type:"Remix", year:2025,
      dimensions:"Ø 16 m · max. 10 m hoch", capacity:"24 Personen", priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2025/10/03/shock-wave/",
      imageUrl:"https://i.imgur.com/JdnEI3w.jpeg",
      imageCredit:"polypweb.eu", imageSourceUrl:"https://www.polypweb.eu/viewtopic.php?t=25019"
    },
    {
      id:"avenger", name:"Avenger", operator:"Kirschbaum", operatorFull:"Florian Kirschbaum (Gollhofen)",
      new2026:true, manufacturer:"KMG (NL)", type:"Inversion 12", year:2013,
      dimensions:"20 × 16 × 24 m", capacity:"12 Personen · 3 Gondeln", priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2013/03/31/avenger/",
      imageUrl:"https://www.ummet-eck.de/Bilder/fotosets/1024/avenger-royal-bad-griesbach23-c-KIE-c-schoen-4.jpg",
      imageCredit:"Ummet-Eck · Christian Schön", imageSourceUrl:"https://www.ummet-eck.de/"
    },
    {
      id:"big-bamboo", name:"Big Bamboo", operator:"Hempen", operatorFull:"Hempen oHG (Oldenburg)",
      new2026:true, manufacturer:"Dietz (D)", type:"Laufgeschäft", year:2011,
      dimensions:"22,5 × 13 × 16 m", capacity:null, priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2011/07/16/big-bamboo-hempen/",
      imageUrl:"./assets/soest-big-bamboo.webp",
      imageCredit:"Kermisplanner.nl", imageSourceUrl:"https://kermisplanner.nl/en/attraction/big-bamboo-sbOMEqfV"
    },
    {
      id:"sound-wave", name:"Sound Wave", operator:"Schwerin", operatorFull:"Danny Schwerin (Trappenkamp-Soest)",
      new2026:true, manufacturer:"SBF Vista (I)", type:"Super Jump", year:2024,
      dimensions:"18,5 × 17 m", capacity:"30 Personen · 10 Gondeln", priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2024/08/17/sound-wave/",
      imageUrl:"https://nordkirmes.net/media/1541-l%C3%BCn23-jpg/",
      imageCredit:"Nordkirmes.net", imageSourceUrl:"https://nordkirmes.net/"
    },
    {
      id:"tiki-taki", name:"Tiki Taki XXL", operator:"Paulsen", operatorFull:"Robert Paulsen (Handorf)",
      new2026:true, manufacturer:"KMG (NL)", type:"XXL", year:2025,
      dimensions:"18 × 13 × 46,5 m", capacity:"20 Personen", priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2025/11/02/tiki-taxi-xxl/",
      imageUrl:"https://nordkirmes.net/media/1398-whatsapp-image-2025-11-01-at-15-46-31-2-jpeg/?thumbnail=large",
      imageCredit:"Nordkirmes.net", imageSourceUrl:"https://nordkirmes.net/article/3503-tiki-taki-xxl-hamburger-dom-erlebt-emotionale-weltpremiere-einer-mega-schaukel/"
    },
    {
      id:"number-1", name:"Number 1", operator:"Isken", operatorFull:"Rudolf Isken (Dortmund)",
      new2026:false, manufacturer:"Mack (D)", type:"2-Säulen-Skooter", year:1981,
      dimensions:"Fahrbahn 34,5 × 18,5 m", capacity:null, priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2007/07/10/as-isken/",
      imageUrl:"./assets/soest-number-1.webp",
      imageCredit:"Ummet-Eck · Christian Schön", imageSourceUrl:"https://www.ummet-eck.de/regionen/103142-Autoscooter-Number-1-Isken-/"
    },
    {
      id:"hangover-the-tower", name:"Hangover The Tower", operator:"Schneider", operatorFull:"Schneider & Co. oHG (München)",
      new2026:false, manufacturer:"Funtime (A)", type:"Free Fall", year:2015,
      dimensions:"21 × 18 × 85 m", capacity:"24 Personen", priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2015/07/19/hangover/",
      imageUrl:"https://images.coasterpedia.net/thumb/f/f9/HangOver_The_Tower_01.jpg/1000px-HangOver_The_Tower_01.jpg.webp",
      imageCredit:"Coasterpedia", imageSourceUrl:"https://coasterpedia.net/wiki/HangOver_The_Tower"
    },
    {
      id:"heidi-the-coaster", name:"Heidi the Coaster", operator:"Schneider", operatorFull:"Schneider (Bielefeld/München)",
      new2026:false, manufacturer:"Reverchon (F)", type:"Spinning Coaster", year:2019,
      dimensions:"42 × 22 × 13 m · 430 m Strecke", capacity:"40 Personen · 10 Gondeln", priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2019/09/26/heidi-the-coaster/",
      imageUrl:"https://www.ummet-eck.de/Bilder/fotosets/1024/5-heidi-coaster-soest22-c-ummeteck-chr-schoen.jpg",
      imageCredit:"Ummet-Eck · Christian Schön", imageSourceUrl:"https://www.ummet-eck.de/"
    },
    {
      id:"look-360", name:"Look 360°", operator:"Schneider", operatorFull:"F. T. Schneider GmbH (Soest)",
      new2026:false, manufacturer:"Funtime (A)", type:"Aussichtsturm", year:2024,
      dimensions:"71 m hoch", capacity:"80 Personen · 4 Kabinen", priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2024/07/14/look-schneider/",
      imageUrl:"https://look-panorama.com/_ipx/f_jpeg%26s_2048x1366/https%3A/cdn.cityoffer.net/generated/file-manager/cms-551/content/crop-focalpoint-0-5-0-5-1-2040-1360-look360panorama-personen-01-web.jpg",
      imageCredit:"LOOK 360° Panorama", imageSourceUrl:"https://look-panorama.com/"
    },
    {
      id:"the-beast", name:"The Beast", operator:"Ahrend", operatorFull:"Frank Ahrend (Bremen)",
      new2026:false, manufacturer:"KMG (NL)", type:"Move It 24 2.0 (Nr. 2)", year:2021,
      dimensions:"15 × 15 × 10 m", capacity:"24 Personen · 6 Gondeln", priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2024/12/06/the-beast-ahrend/",
      imageUrl:"https://i.postimg.cc/kG97LL3h/Lingen-25-38.jpg",
      imageCredit:"polypweb.eu", imageSourceUrl:"https://www.polypweb.eu/viewtopic.php?t=21618"
    },
    {
      id:"nessy", name:"Nessy", operator:"Markmann", operatorFull:"Hans-Peter Markmann (Bonn)",
      new2026:false, manufacturer:"Kalbfleisch (D)", type:"Großschaukel", year:1978,
      dimensions:"22 × 9 m", capacity:"50 Personen", priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2005/01/11/nessy/",
      imageUrl:"https://www.medienwerkstatt-online.de/lws_wissen/bilder/35984-1.jpg",
      imageCredit:"Medienwerkstatt Mühlacker", imageSourceUrl:"https://www.medienwerkstatt-online.de/lws_wissen/vorlagen/showcard.php?id=35984"
    },
    {
      id:"hexentanz", name:"Hexentanz", operator:"Markmann", operatorFull:"Markmann (Bonn)",
      new2026:false, manufacturer:"Zierer (D)", type:"Hexentanz (Nr. 2)", year:1984,
      dimensions:"23 × 25 × 16 m", capacity:null, priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2005/01/08/hexentanz/",
      imageUrl:"https://cdn.coaster.cloud/attractions/F9/2x/F92xXqWxBDSqZyNuhc7yWN.jpg?class=large",
      imageCredit:"coaster.cloud", imageSourceUrl:"https://coaster.cloud/"
    },
    {
      id:"big-monster", name:"Big Monster", operator:"Krameyer", operatorFull:"Raoul Hermann Krameyer (Herford)",
      new2026:false, manufacturer:"Schwarzkopf (D)", type:"Monster 3", year:1981,
      dimensions:"22 × 22,5 m", capacity:"50 Personen · 25 Gondeln", priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2005/01/04/big-monster/",
      imageUrl:"https://www.ummet-eck.de/Bilder/fotosets/1024/1-big-monster-rheinkirmes-c-ummeteck-christian-schoen.jpg",
      imageCredit:"Ummet-Eck · Christian Schön", imageSourceUrl:"https://www.ummet-eck.de/"
    },
    {
      id:"intoxx", name:"Intoxx", operator:"Benning", operatorFull:"Benning (Theine)",
      new2026:false, manufacturer:"Fabbri (I)", type:"Kamikaze III", year:2003,
      dimensions:"18,5 × 5 × 22 m", capacity:"16 Personen", priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2009/09/02/intoxx/",
      imageUrl:"https://cdn.coaster.cloud/attractions/HE/qD/HEqDcFZqi17XJt82yfZDri.jpg?class=large",
      imageCredit:"coaster.cloud", imageSourceUrl:"https://coaster.cloud/"
    },
    {
      id:"jules-verne-tower", name:"Jules Verne Tower", operator:"Götzke", operatorFull:"Alexander Goetzke (München)",
      new2026:false, manufacturer:"Funtime (A)", type:"Starflyer / Kettenflieger", year:2017,
      dimensions:"21 × 21 × 80 m", capacity:"32 Personen · 16 Gondeln", priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2017/04/19/jules-verne-tower/",
      imageUrl:"https://cdn.coaster.cloud/attractions/EJ/2w/EJ2wQPe3dNqCxMzNRSjcDc.jpg?class=large",
      imageCredit:"coaster.cloud", imageSourceUrl:"https://coaster.cloud/"
    },
    {
      id:"shake-and-roll", name:"Shake & Roll", operator:"Schäfer", operatorFull:"Schäfer GmbH (Schwerte)",
      new2026:false, manufacturer:"Mondial (NL)", type:"Shake R5 (Nr. 1)", year:1991,
      dimensions:"23 × 23 × 14 m", capacity:"40 Personen · 20 Gondeln", priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2005/01/13/shake-roll/",
      imageUrl:"https://www.ummet-eck.de/Bilder/fotosets/1024/9-shake-roll--simjue-2022-c-ummeteck-christian-schoen.jpg",
      imageCredit:"Ummet-Eck · Christian Schön", imageSourceUrl:"https://www.ummet-eck.de/"
    },
    {
      id:"musik-express", name:"Musik Express", operator:"Schneider/Krause", operatorFull:"Eduard Krause KG (Bielefeld) · ehem. Schneider-Krause",
      new2026:false, manufacturer:"Mack (D)", type:"2-Säulen-Musik-Express / Berg- und Talbahn", year:1979,
      dimensions:"20 × 18 × 7 m", capacity:"60 Personen · 20 Gondeln", priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2005/01/10/musik-express-schneider-krause/",
      imageUrl:"https://www.ummet-eck.de/Bilder/fotosets/1024/me-schneider-krause-puetzchens23-c-UMM-c-schoen-1.jpg",
      imageCredit:"Ummet-Eck · Christian Schön", imageSourceUrl:"https://www.ummet-eck.de/"
    },
    {
      id:"aqua-velis", name:"Aqua Velis", operator:"Hofmann", operatorFull:"Hannes Hofmann (Rudolstadt)",
      new2026:false, manufacturer:"Dietz (D)", type:"3-Etagen-Laufgeschäft", year:1996,
      dimensions:"20 × 11 × 14 m", capacity:null, priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2005/01/03/aqua-velis/",
      imageUrl:"https://www.ummet-eck.de/Bilder/fotosets/1024/1-aqua-velis-rheinkirmes22-c-UMM-chr-schoen.jpg",
      imageCredit:"Ummet-Eck · Christian Schön", imageSourceUrl:"https://www.ummet-eck.de/"
    },
    {
      id:"wellenflieger", name:"Wellenflieger", operator:"Wendler", operatorFull:"Wendler (Unna)",
      new2026:false, manufacturer:"Zierer (D)", type:"Wellenflug / Kettenflieger", year:1988,
      dimensions:null, capacity:"48 Personen", priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2005/01/14/wellenflug-wendler/",
      imageUrl:"https://www.ummet-eck.de/Bilder/fotosets/1024/3-wellenflieger-simjue22-c-ummeteck-chr-schoen.jpg",
      imageCredit:"Ummet-Eck · Christian Schön", imageSourceUrl:"https://www.ummet-eck.de/"
    },
    {
      id:"highway-no-1", name:"Highway No. 1", operator:"Schneider", operatorFull:"Johann Schneider & Sohn (Münster)",
      new2026:false, manufacturer:null, type:"2-Säulen-Skooter", year:null,
      dimensions:"Fahrbahn 30 × 16 m", capacity:null, priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2007/07/11/as-schneider-johann-1/",
      imageUrl:"https://www.ummet-eck.de/Bilder/fotosets/678/1-highwayno1-herbstsend22-c-ummeteck-chr-schoen.jpg",
      imageCredit:"Ummet-Eck · Christian Schön", imageSourceUrl:"https://www.ummet-eck.de/"
    },
    {
      id:"fahrt-zur-hoelle", name:"Fahrt zur Hölle", operator:"Fellerhoff", operatorFull:"Hermann Fellerhoff & Söhne (Düsseldorf / Bedburg/Erft)",
      new2026:false, manufacturer:"Arcadia (I)", type:"Geisterbahn", year:2001,
      dimensions:"29 × 14,5 × 14 m", capacity:null, priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2005/01/06/fahrt-zur-hoelle/",
      imageUrl:"https://www.fellerhoff-geisterbahn.de/gallery/20250718_113412.jpg",
      imageCredit:"Fellerhoff Geisterbahn", imageSourceUrl:"https://www.fellerhoff-geisterbahn.de/"
    }
  ];

  const rides = rawRides.map((ride) => Object.assign({}, ride, {
    id:"soest26-" + ride.id,
    zone:"Allerheiligenkirmes 2026"
  }));

  const rawWorlds = {
    "mythos":{label:"MYTHOS · HÖGERLE · NEU 2026",line:"Heavy Rotation mit zehn frei drehenden Gondeln: Kreisfahrt, Schwenkarm und Überschläge bis rund 18 Meter Höhe."},
    "eyecatcher":{label:"EYECATCHER · KIPP · NEU 2026",line:"55 Meter Riesenrad mit 42 geschlossenen Gondeln – der neue ruhige Aussichtspunkt direkt am Bahnhofsvorplatz."},
    "punk-flasher":{label:"PUNK FLASHER · GLÖSS · NEU 2026",line:"Fabbri Booster 27/8: acht Plätze an einem rotierenden Propellerarm – kompakt, schnell und kopfüber."},
    "shock-wave":{label:"SHOCK WAVE · HORTZ · NEU 2026",line:"Tivoli Remix mit frei schwingenden Gondeln: Rotation, Richtungswechsel und Fliehkraft auf engem Raum."},
    "avenger":{label:"AVENGER · KIRSCHBAUM · NEU 2026",line:"KMG Inversion 12: drei Gondeln am Überschlagarm, bis rund 24 Meter hoch und konsequent über Kopf."},
    "big-bamboo":{label:"BIG BAMBOO · HEMPEN · NEU 2026",line:"Großes Laufgeschäft mit Bambus- und Dschungelthema, beweglichen Hindernissen und mehreren Ebenen."},
    "sound-wave":{label:"SOUND WAVE · SCHWERIN · NEU 2026",line:"SBF Super Jump mit zehn Gondeln: Heben, Drehen und Fliehkraft für bis zu 30 Fahrgäste."},
    "tiki-taki":{label:"TIKI TAKI XXL · PAULSEN · NEU 2026",line:"KMG XXL-Pendel mit 20 Plätzen: bis rund 46,5 Meter hoch, mit drehender Gondel und markantem Tiki-Thema."},
    "number-1":{label:"NUMBER 1 · ISKEN",line:"Klassischer Zwei-Säulen-Autoscooter von Mack – große Fahrbahn, freie Fahrt und Kirmes-Dauerbrenner."},
    "hangover-the-tower":{label:"HANGOVER THE TOWER · SCHNEIDER",line:"85 Meter Funtime-Freefall: langsamer Aufstieg über Soest, dann freier Fall mit 24 Plätzen."},
    "heidi-the-coaster":{label:"HEIDI THE COASTER · SCHNEIDER",line:"Mobile Reverchon-Spinning-Achterbahn mit 430 Metern Strecke und frei drehenden Vierer-Gondeln."},
    "look-360":{label:"LOOK 360° · SCHNEIDER",line:"71 Meter hoher Aussichtsturm mit vier rotierenden Panorama-Kabinen – ausdrücklich Aussicht statt Thrillride."},
    "the-beast":{label:"THE BEAST · AHREND",line:"KMG Move It 24 2.0: sechs Gondeln kombinieren Plattformrotation, Hubbewegung und Überschläge."},
    "nessy":{label:"NESSY · MARKMANN",line:"Klassische Großschaukel von Markmann mit bis zu 50 Fahrgästen – 2026 zurück in Soest."},
    "hexentanz":{label:"HEXENTANZ · MARKMANN",line:"Zierer Hexentanz: große Rundfahrt mit frei beweglichen Gondeln, Wellenbewegung und klassischer Soest-Tradition."},
    "big-monster":{label:"BIG MONSTER · KRAMEYER",line:"Schwarzkopf Monster 3: 25 drehende Gondeln an fünf Armen – Familienklassiker mit ordentlich Eigenrotation."},
    "intoxx":{label:"INTOXX · BENNING",line:"Fabbri Kamikaze III mit zwei gegenläufigen Armen und Überschlägen bis rund 22 Meter Höhe."},
    "jules-verne-tower":{label:"JULES VERNE TOWER · GÖTZKE",line:"80 Meter Starflyer: offene Zweier-Sitze kreisen hoch über den Dächern der Soester Altstadt."},
    "shake-and-roll":{label:"SHAKE & ROLL · SCHÄFER",line:"Mondial Shake R5 mit 20 Gondeln: mehrere Rotationsachsen, schnelle Richtungswechsel und echte Kultmaschine."},
    "musik-express":{label:"MUSIK EXPRESS · SCHNEIDER/KRAUSE",line:"Mack Musik-Express mit 20 Gondeln: schnelle Berg-und-Tal-Rundfahrt, Musik und klassische Rekommandation."},
    "aqua-velis":{label:"AQUA VELIS · HOFMANN",line:"Dreistöckiges Dietz-Laufgeschäft mit Wasser-, Geschicklichkeits- und Überraschungselementen."},
    "wellenflieger":{label:"WELLENFLIEGER · WENDLER",line:"Zierer Wellenflug mit 48 Plätzen: klassische Kettenflieger-Runde zwischen Rathaus und St. Patrokli."},
    "highway-no-1":{label:"HIGHWAY NO. 1 · SCHNEIDER",line:"Zwei-Säulen-Autoscooter mit großer Fahrbahn – klassischer Treffpunkt für freie Runden und Rempler."},
    "fahrt-zur-hoelle":{label:"FAHRT ZUR HÖLLE · FELLERHOFF",line:"Große transportable Geisterbahn mit aufwendig gestalteter Fassade und klassischer Fahrt durch mehrere Gruselszenen."}
  };

  const rideByRawId = Object.fromEntries(rawRides.map((ride) => [ride.id, ride]));
  Object.entries(rawWorlds).forEach(([id, world]) => {
    const ride = rideByRawId[id];
    if (!ride) return;
    world.artUrl = ride.imageUrl;
    world.imageCredit = ride.imageCredit;
    world.imageSourceUrl = ride.imageSourceUrl;
  });

  const rawFonts = {
    "mythos":{fontFamily:"'Cinzel Decorative', serif",theme:"fair-mythos"},
    "eyecatcher":{fontFamily:"'Monoton', sans-serif",theme:"fair-eyecatcher"},
    "punk-flasher":{fontFamily:"'Rubik Glitch', sans-serif",theme:"fair-punk"},
    "shock-wave":{fontFamily:"'Audiowide', sans-serif",theme:"fair-shock"},
    "avenger":{fontFamily:"'Black Ops One', sans-serif",theme:"fair-avenger"},
    "big-bamboo":{fontFamily:"'Trade Winds', cursive",theme:"fair-bamboo"},
    "sound-wave":{fontFamily:"'Bungee Shade', sans-serif",theme:"fair-sound"},
    "tiki-taki":{fontFamily:"'Chango', sans-serif",theme:"fair-tiki"},
    "number-1":{fontFamily:"'Faster One', sans-serif",theme:"fair-number1"},
    "hangover-the-tower":{fontFamily:"'Special Elite', monospace",theme:"fair-hangover"},
    "heidi-the-coaster":{fontFamily:"'Rye', serif",theme:"fair-heidi"},
    "look-360":{fontFamily:"'Poiret One', sans-serif",theme:"fair-look360"},
    "the-beast":{fontFamily:"'Metal Mania', cursive",theme:"fair-beast"},
    "nessy":{fontFamily:"'UnifrakturCook', cursive",theme:"fair-nessy"},
    "hexentanz":{fontFamily:"'Creepster', cursive",theme:"fair-hexentanz"},
    "big-monster":{fontFamily:"'Nosifer', cursive",theme:"fair-monster"},
    "intoxx":{fontFamily:"'Wallpoet', sans-serif",theme:"fair-intoxx"},
    "jules-verne-tower":{fontFamily:"'Ewert', serif",theme:"fair-jules-verne"},
    "shake-and-roll":{fontFamily:"'Fascinate Inline', cursive",theme:"fair-shake"},
    "musik-express":{fontFamily:"'Limelight', sans-serif",theme:"fair-musikexpress"},
    "aqua-velis":{fontFamily:"'Zen Tokyo Zoo', sans-serif",theme:"fair-aqua"},
    "wellenflieger":{fontFamily:"'Diplomata SC', serif",theme:"fair-wellenflieger"},
    "highway-no-1":{fontFamily:"'Bungee', sans-serif",theme:"fair-highway"},
    "fahrt-zur-hoelle":{fontFamily:"'Pirata One', serif",theme:"fair-hoelle"}
  };

  const prefix = (id) => "soest26-" + id;
  const worlds = Object.fromEntries(Object.entries(rawWorlds).map(([id,value]) => [prefix(id),value]));
  const fonts = Object.fromEntries(Object.entries(rawFonts).map(([id,value]) => [prefix(id),value]));
  const aliases = {};
  rides.forEach((ride) => { aliases[ride.name.toLowerCase()] = ride.id; });

  const rideConfig = {};
  rides.forEach((ride) => { rideConfig[ride.id] = {singleRider:false}; });
  rideConfig["soest26-punk-flasher"].speedKmh = 145;
  rideConfig["soest26-heidi-the-coaster"].speedKmh = 57;

  window.NAEHEN_SOEST_ALLERHEILIGENKIRMES_2026 = {
    park:{
      slug:"soest-allerheiligenkirmes-2026",
      startDate:"2026-11-04",
      endDate:"2026-11-08",
      kind:"fair",
      name:"Soester Allerheiligenkirmes 2026",
      location:"Soest · 04.–08.11.2026",
      officialUrl:"https://www.so-ist-soest.de/de/veranstaltungen/herbst/allerheiligenkirmes/",
      liveDataUrl:null,
      liveWaits:false,
      supportsPostedWait:false,
      sortMode:"configured",
      specialMap:{
        title:"Kirmesplan 2026",
        subtitle:"Die roten Linkpunkte sitzen direkt an den Fahrgeschäften des offiziellen Plans.",
        sourceLabel:"Originalplan als PDF öffnen",
        sourceUrl:"https://www.so-ist-soest.de/de-wAssets/docs/veranstaltungen/Allerheiligenkirmes/Allerheiligenkirmes-Soest-Programmplan-2026.pdf",
        imageUrl:"./assets/soest-allerheiligenkirmes-2026-lageplan.png",
        note:"Originaler Soester Lageplan 2026. Linkpunkt antippen → NÄHEN-Detailansicht.",
        aspectRatio:"1310 / 1841",
        points:[
          {rideId:"soest26-eyecatcher",x:25.95,y:4.62},
          {rideId:"soest26-mythos",x:23.28,y:6.68},
          {rideId:"soest26-number-1",x:23.28,y:9.51},
          {rideId:"soest26-sound-wave",x:19.47,y:17.00},
          {rideId:"soest26-tiki-taki",x:18.70,y:20.32},
          {rideId:"soest26-fahrt-zur-hoelle",x:27.86,y:47.37},
          {rideId:"soest26-shock-wave",x:36.41,y:59.26},
          {rideId:"soest26-jules-verne-tower",x:40.69,y:61.27},
          {rideId:"soest26-musik-express",x:53.82,y:65.62},
          {rideId:"soest26-hexentanz",x:47.33,y:69.64},
          {rideId:"soest26-punk-flasher",x:53.74,y:70.45},
          {rideId:"soest26-big-bamboo",x:62.82,y:45.95},
          {rideId:"soest26-nessy",x:65.50,y:48.72},
          {rideId:"soest26-the-beast",x:63.89,y:58.72},
          {rideId:"soest26-big-monster",x:76.49,y:42.91},
          {rideId:"soest26-intoxx",x:79.39,y:40.58},
          {rideId:"soest26-highway-no-1",x:88.55,y:63.23},
          {rideId:"soest26-hangover-the-tower",x:92.90,y:62.95},
          {rideId:"soest26-heidi-the-coaster",x:90.46,y:66.00},
          {rideId:"soest26-look-360",x:57.02,y:79.09},
          {rideId:"soest26-avenger",x:61.83,y:78.11},
          {rideId:"soest26-aqua-velis",x:72.37,y:78.98},
          {rideId:"soest26-wellenflieger",x:76.34,y:76.48},
          {rideId:"soest26-shake-and-roll",x:61.07,y:84.46}
        ]
      },
      cardImage:"./assets/soest-background.webp",
      cardCopy:"24 Fahrgeschäfte · 8 Neuheiten · fünf Tage Kirmes mitten in der Soester Altstadt.",
      noLiveLabel:"KIRMES · KEINE LIVE-WARTEZEITEN",
      noLiveMessage:"Auf der Soester Allerheiligenkirmes gibt es keine öffentlichen Live-Wartezeiten. NÄHEN misst stattdessen deine persönliche Queue.",
      noLiveAlarmMessage:"Für Kirmessen ohne öffentliche Wartezeitdaten sind Wartezeit-Alarme deaktiviert.",
      disclaimer:"Unabhängige Fan-Übersicht zur Allerheiligenkirmes 2026. Kein offizielles Angebot der Stadt Soest. Hintergrundfoto: Wirtschaft und Marketing Soest GmbH / Gero Sliwa."
    },
    rides,
    worlds,
    fonts,
    aliases,
    rideConfig,
    exclusions:{ids:[],namePatterns:[]}
  };
})();