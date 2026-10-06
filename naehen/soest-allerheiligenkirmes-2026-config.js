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
      imageUrl:"https://www.kirmes.photogalerien-bayern.eu/albums/userpics/10001/DSCN346800010029.JPG",
      imageCredit:"Kirmes Photogalerien Bayern", imageSourceUrl:"https://www.kirmes.photogalerien-bayern.eu/"
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
      id:"tiki-taki", name:"Tiki Taki", operator:"Paulsen", operatorFull:"Robert Paulsen (Handorf)",
      new2026:true, manufacturer:"KMG (NL)", type:"XXL", year:2025,
      dimensions:"18 × 13 × 46,5 m", capacity:"20 Personen", priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2025/11/02/tiki-taxi-xxl/",
      imageUrl:"https://nordkirmes.net/media/1398-whatsapp-image-2025-11-01-at-15-46-31-2-jpeg/?thumbnail=large",
      imageCredit:"Nordkirmes.net", imageSourceUrl:"https://nordkirmes.net/"
    },
    {
      id:"number-1", name:"Number 1", operator:"Isken", operatorFull:"Rudolf Isken (Dortmund)",
      new2026:false, manufacturer:"Mack (D)", type:"2-Säulen-Skooter", year:1981,
      dimensions:"Fahrbahn 34,5 × 18,5 m", capacity:null, priceEuro:null,
      rideIndexUrl:"https://ride-index.de/2007/07/10/as-isken/",
      imageUrl:"https://www.bocholt.de/kirmes/attraktionen/fahrgeschaefte-fuer-erwachsene/autoscooter-number-1/_/autoscooter-number-1.jpg",
      imageCredit:"Stadt Bocholt", imageSourceUrl:"https://www.bocholt.de/"
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
      imageUrl:"https://nordkirmes.net/media/888-d6-2-jpg/",
      imageCredit:"Nordkirmes.net", imageSourceUrl:"https://nordkirmes.net/"
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
      imageUrl:"https://nordkirmes.net/gallery/raw-image/923-aqua-velis-hofmann/",
      imageCredit:"Nordkirmes.net", imageSourceUrl:"https://nordkirmes.net/"
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
    "mythos":{label:"MYTHOS · HÖGERLE · NEU 2026",line:"Dunkle Mythologie trifft auf Kirmeslicht – eine der Soester Neuheiten 2026."},
    "eyecatcher":{label:"EYECATCHER · KIPP · NEU 2026",line:"Neon, Chrom und Aufmerksamkeit: Eyecatcher macht seinem Namen in Soest alle Ehre."},
    "punk-flasher":{label:"PUNK FLASHER · GLÖSS · NEU 2026",line:"Punk, grelles Licht und maximale Kirmesenergie – neu in Soest 2026."},
    "shock-wave":{label:"SHOCK WAVE · HORTZ · NEU 2026",line:"Elektrische Wellen, harte Kontraste und eine Neuheit für die Allerheiligenkirmes."},
    "avenger":{label:"AVENGER · KIRSCHBAUM · NEU 2026",line:"Metallisch, kompromisslos und neu: Avenger kommt 2026 nach Soest."},
    "big-bamboo":{label:"BIG BAMBOO · HEMPEN · NEU 2026",line:"Bambus, Dschungel und Kirmeschaos – eine der neuen Anlagen in Soest."},
    "sound-wave":{label:"SOUND WAVE · SCHWERIN · NEU 2026",line:"Bass, Licht und Bewegung: Sound Wave gehört zu den Soester Neuheiten 2026."},
    "tiki-taki":{label:"TIKI TAKI · PAULSEN · NEU 2026",line:"Tropisches Kirmesfeeling, grelle Farben und eine neue Herausforderung für 2026."},
    "number-1":{label:"NUMBER 1 · ISKEN",line:"Klassische Kirmesenergie mit Chrom, Licht und viel Bewegung."},
    "hangover-the-tower":{label:"HANGOVER THE TOWER · SCHNEIDER",line:"Hoch über der Altstadt – Hangover gehört zu den markanten Höhenfahrten in Soest."},
    "heidi-the-coaster":{label:"HEIDI THE COASTER · SCHNEIDER",line:"Alpenkirmes auf Schienen – eine mobile Achterbahn mitten in der Soester Altstadt."},
    "look-360":{label:"LOOK 360° · SCHNEIDER",line:"Soest von oben: ein Rundumblick über Dächer, Türme und Kirmeslichter."},
    "the-beast":{label:"THE BEAST · AHREND",line:"Dunkel, massiv und kompromisslos – The Beast steht für rohe Kirmesenergie."},
    "nessy":{label:"NESSY · MARKMANN",line:"Seeungeheuer-Flair und klassische Kirmesoptik zwischen den Soester Gassen."},
    "hexentanz":{label:"HEXENTANZ · MARKMANN",line:"Hexen, Nacht und wirbelnde Kirmesstimmung vor mittelalterlicher Kulisse."},
    "big-monster":{label:"BIG MONSTER · KRAMEYER",line:"Tentakel, Monsteraugen und klassischer Rundfahrgeschäft-Charme."},
    "intoxx":{label:"INTOXX · BENNING",line:"Giftige Farben, Industrie-Look und ein Name, der keine ruhige Runde verspricht."},
    "jules-verne-tower":{label:"JULES VERNE TOWER · GÖTZKE",line:"Retro-Futurismus über der Altstadt – Jules Verne trifft Soester Kirchtürme."},
    "shake-and-roll":{label:"SHAKE & ROLL · SCHÄFER",line:"Kultige Kirmesoptik, Musik und kontrolliertes Chaos auf engstem Raum."},
    "musik-express":{label:"MUSIK EXPRESS · SCHNEIDER/KRAUSE",line:"Musik, Geschwindigkeit und klassische Rundfahrt – Kirmes in Reinform."},
    "aqua-velis":{label:"AQUA VELIS · HOFMANN",line:"Wasser, Licht und eine maritime Note zwischen den Soester Kirmesplätzen."},
    "wellenflieger":{label:"WELLENFLIEGER · WENDLER",line:"Über den Köpfen schweben und dabei die Altstadtlichter unter sich sehen."},
    "highway-no-1":{label:"HIGHWAY NO. 1 · SCHNEIDER",line:"Straßen-, Neon- und Highway-Flair mitten auf der Allerheiligenkirmes."},
    "fahrt-zur-hoelle":{label:"FAHRT ZUR HÖLLE · FELLERHOFF",line:"Dunkelfahrt, Höllenfeuer und Geisterbahnklassik für die Soester Nacht."}
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
      kind:"fair",
      name:"Soester Allerheiligenkirmes 2026",
      location:"Soest · 04.–08.11.2026",
      officialUrl:"https://www.so-ist-soest.de/de/veranstaltungen/herbst/allerheiligenkirmes/",
      liveDataUrl:null,
      liveWaits:false,
      supportsPostedWait:false,
      sortMode:"configured",
      cardImage:rideByRawId["eyecatcher"].imageUrl,
      cardCopy:"24 Fahrgeschäfte · 8 Neuheiten · fünf Tage Kirmes mitten in der Soester Altstadt.",
      noLiveLabel:"KIRMES · KEINE LIVE-WARTEZEITEN",
      noLiveMessage:"Auf der Soester Allerheiligenkirmes gibt es keine öffentlichen Live-Wartezeiten. NÄHEN misst stattdessen deine persönliche Queue.",
      noLiveAlarmMessage:"Für Kirmessen ohne öffentliche Wartezeitdaten sind Wartezeit-Alarme deaktiviert.",
      disclaimer:"Unabhängige Fan-Übersicht zur Allerheiligenkirmes 2026. Kein offizielles Angebot der Stadt Soest."
    },
    rides,
    worlds,
    fonts,
    aliases,
    rideConfig,
    exclusions:{ids:[],namePatterns:[]}
  };
})();