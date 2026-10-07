(() => {
  "use strict";

  const adultSource = "https://www.bocholt.de/freizeit-und-tourismus/veranstaltungen/kirmes/attraktionen?category=46782";
  const kidsSource = "https://www.bocholt.de/freizeit-und-tourismus/veranstaltungen/kirmes/attraktionen?category=46726";

  const rawRides = [
    {id:"look-360",name:"Look 360° Panorama",operator:"Schneider",operatorFull:"F. T. Schneider GmbH",new2026:true,manufacturer:"Funtime (A)",type:"Aussichtsturm",year:2024,dimensions:"ca. 71 m hoch",capacity:"80 Personen · 4 Kabinen",priceEuro:null,sourceUrl:adultSource,imageUrl:"https://look-panorama.com/_ipx/f_jpeg%26s_2048x1366/https%3A/cdn.cityoffer.net/generated/file-manager/cms-551/content/crop-focalpoint-0-5-0-5-1-2040-1360-look360panorama-personen-01-web.jpg",imageCredit:"LOOK 360° Panorama",imageSourceUrl:"https://look-panorama.com/"},
    {id:"skyfall",name:"Skyfall",operator:"Goetzke",operatorFull:"Alexander Goetzke",new2026:false,manufacturer:"Funtime (A)",type:"Free Fall",year:null,dimensions:"80 m hoch",capacity:"24 Personen",priceEuro:null,sourceUrl:adultSource,imageUrl:"https://www.oktoberfest.de/sites/default/files/styles/3_2_w1216/public/2023-08/skyfall_sebastian_lehner-0291.jpg?h=56d0ca2e",imageCredit:"oktoberfest.de",imageSourceUrl:"https://www.oktoberfest.de/"},
    {id:"break-dance",name:"Break Dance",operator:"Bruch",operatorFull:"Bruch",new2026:false,manufacturer:"HUSS (D)",type:"Break Dance",year:1990,dimensions:"ca. 20 × 21 × 15 m",capacity:"32 Personen · 16 Gondeln",priceEuro:null,sourceUrl:adultSource,imageUrl:"https://ride-index.de/content/images/BREAKDANCE_Bruch2012.JPG",imageCredit:"Ride-Index",imageSourceUrl:"https://ride-index.de/"},
    {id:"roue-parisienne",name:"Roue Parisienne",operator:"Kleuser",operatorFull:"Burkhard Kleuser",new2026:false,manufacturer:null,type:"Riesenrad",year:null,dimensions:"ca. 48 m hoch",capacity:"36 Gondeln · bis 6 Personen",priceEuro:null,sourceUrl:adultSource,imageUrl:"https://www.grafik2308.de/Feste/Jahrmarkt/Riesenrad/Riesenrad14.jpg",imageCredit:"grafik2308.de",imageSourceUrl:"https://www.grafik2308.de/"},
    {id:"invader",name:"Invader",operator:"Dreßen",operatorFull:"Marvin Dreßen (Mönchengladbach)",new2026:true,manufacturer:"SAD Maschinenbau",type:"Rundfahrgeschäft",year:2026,dimensions:null,capacity:"32 Personen · 16 Gondeln",priceEuro:null,sourceUrl:"https://funfair-entertainment.de/news/bocholter-kirmes-2026-invader-ersetzt-devil-rock-320-betriebe-raupenbahn",rideIndexUrl:"https://ride-index.de/",imageUrl:"https://funfair-entertainment.de/assets/news/funfair-news-20260622-125325-a3cef81b-1200.webp",imageCredit:"FunFair Entertainment",imageSourceUrl:"https://funfair-entertainment.de/"},
    {id:"excalibur",name:"Excalibur",operator:"Bruch",operatorFull:"Harry P. E. Bruch",new2026:false,manufacturer:"KMG (NL)",type:"XXL",year:2022,dimensions:"ca. 47 m Flughöhe",capacity:"20 Personen",priceEuro:null,sourceUrl:adultSource,imageUrl:"https://www.ummet-eck.de/Bilder/fotosets/678/excalibur-hpe-bruch-palmkirmes-c-ummet-eck-13.jpg",imageCredit:"Ummet-Eck",imageSourceUrl:"https://www.ummet-eck.de/"},
    {id:"disco-jet",name:"Disco Jet",operator:"Heitmann",operatorFull:"Heitmann",new2026:false,manufacturer:null,type:"Musik-Express",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:adultSource,imageUrl:"https://nordkirmes.net/media/1485-2019-jpg/",imageCredit:"Nordkirmes.net",imageSourceUrl:"https://nordkirmes.net/"},
    {id:"number-1",name:"Autoscooter Number 1",operator:"Isken",operatorFull:"Rudolf Isken (Dortmund)",new2026:false,manufacturer:"Mack (D)",type:"2-Säulen-Skooter",year:1981,dimensions:"Fahrbahn ca. 348 m²",capacity:null,priceEuro:null,sourceUrl:adultSource,imageUrl:"./assets/soest-number-1.webp",imageCredit:"Ummet-Eck · Christian Schön",imageSourceUrl:"https://www.ummet-eck.de/regionen/103142-Autoscooter-Number-1-Isken-/"},
    {id:"fighter",name:"Fighter",operator:"Mages",operatorFull:"Marco Mages / MMV Betriebs GmbH",new2026:false,manufacturer:"KMG (NL)",type:"Speed",year:null,dimensions:"bis ca. 42 m",capacity:null,speedKmh:120,priceEuro:null,sourceUrl:adultSource,imageUrl:null,imageCredit:null,imageSourceUrl:null},
    {id:"die-krake",name:"Die Krake",operator:"Markmann",operatorFull:"Markmann",new2026:false,manufacturer:null,type:"Polyp / Rundfahrgeschäft",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:adultSource,imageUrl:"https://www.ummet-eck.de/Bilder/poi/678/krake-markmann-essen-stadion23-c-UMM-s-schoen.jpg",imageCredit:"Ummet-Eck",imageSourceUrl:"https://www.ummet-eck.de/"},
    {id:"looping-the-loop",name:"Looping the Loop",operator:"Marquis",operatorFull:"Marquis",new2026:false,manufacturer:null,type:"Historische Überschlagschaukel",year:null,dimensions:null,capacity:"16 Personen · 8 Gondeln",priceEuro:null,sourceUrl:adultSource,imageUrl:"https://www.ummet-eck.de/Bilder/fotosets/1024/sterkrader-fronleichnamskirmes-2022-028.jpg",imageCredit:"Ummet-Eck",imageSourceUrl:"https://www.ummet-eck.de/"},
    {id:"shake-and-roll",name:"Shake & Roll",operator:"Schäfer",operatorFull:"Schäfer GmbH (Schwerte)",new2026:false,manufacturer:"Mondial (NL)",type:"Shake R5",year:1991,dimensions:"23 × 23 × 14 m",capacity:"40 Personen · 20 Gondeln",priceEuro:null,sourceUrl:adultSource,imageUrl:"https://www.ummet-eck.de/Bilder/fotosets/1024/9-shake-roll--simjue-2022-c-ummeteck-christian-schoen.jpg",imageCredit:"Ummet-Eck · Christian Schön",imageSourceUrl:"https://www.ummet-eck.de/"},
    {id:"villa-wahnsinn",name:"Villa Wahnsinn",operator:"von Olnhausen",operatorFull:"von Olnhausen",new2026:false,manufacturer:null,type:"2-Etagen-Laufgeschäft",year:null,dimensions:"ca. 24 m breit",capacity:null,priceEuro:null,sourceUrl:adultSource,imageUrl:"https://www.ummet-eck.de/Bilder/fotosets/1024/24-allerheiligenkirmes-soest-2022-c-ummeteck-chr-schoen.jpg",imageCredit:"Ummet-Eck · Christian Schön",imageSourceUrl:"https://www.ummet-eck.de/"},
    {id:"action-house",name:"Action House",operator:"Schmelter-Dreßen",operatorFull:"Schmelter-Dreßen GbR",new2026:false,manufacturer:null,type:"Laufgeschäft",year:null,dimensions:"ca. 13 m breit · 10 m hoch",capacity:null,priceEuro:null,sourceUrl:adultSource,imageUrl:"https://www.rheinkirmes.com/fileadmin/Attraktionen/Laufgeschaefte/Action_House/ActionHouse.jpg",imageCredit:"Rheinkirmes",imageSourceUrl:"https://www.rheinkirmes.com/"},
    {id:"fahrt-zur-hoelle-2",name:"Fahrt zur Hölle 2.0",operator:"Fellerhoff",operatorFull:"Hermann Fellerhoff & Söhne",new2026:true,manufacturer:null,type:"Geisterbahn",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:adultSource,imageUrl:"https://www.fellerhoff-geisterbahn.de/gallery/20250718_113412.jpg",imageCredit:"Fellerhoff Geisterbahn",imageSourceUrl:"https://www.fellerhoff-geisterbahn.de/"},
    {id:"jumpstreet",name:"JumpStreet",operator:"Klaasen",operatorFull:"Marlon Klaasen",new2026:false,manufacturer:null,type:"Rundfahrgeschäft",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:adultSource,imageUrl:"https://kermisplanner.nl/uploads/attractions/attraction-jump-street/1676322585_6ae2d8f1392e7c8b4ca5.jpg",imageCredit:"Kermisplanner.nl",imageSourceUrl:"https://kermisplanner.nl/"},
    {id:"wellenflug",name:"Wellenflug",operator:"Wendler",operatorFull:"Wendler (Unna)",new2026:false,manufacturer:"Zierer (D)",type:"Wellenflug / Kettenflieger",year:1988,dimensions:null,capacity:"48 Personen",priceEuro:null,sourceUrl:adultSource,imageUrl:"https://www.wellenflug.com/files/images/1920/67.jpg",imageCredit:"Wellenflug Wendler",imageSourceUrl:"https://www.wellenflug.com/"},
    {id:"circus-circus",name:"Circus Circus",operator:"Circus Circus",operatorFull:"Circus Circus GmbH & Co. KG",new2026:false,manufacturer:null,type:"Rundfahrgeschäft",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:adultSource,imageUrl:"https://rheinkirmes.com/fileadmin/Attraktionen/Rundfahrgeschaefte/Circus_Circus/circus2.jpg",imageCredit:"Rheinkirmes",imageSourceUrl:"https://www.rheinkirmes.com/"},
    {id:"sound-wave",name:"Sound Wave",operator:"Schwerin",operatorFull:"Danny Schwerin",new2026:true,manufacturer:"SBF Vista (I)",type:"Super Jump",year:2024,dimensions:"18,5 × 17 m",capacity:"30 Personen · 10 Gondeln",priceEuro:null,sourceUrl:adultSource,imageUrl:"https://nordkirmes.net/media/1541-l%C3%BCn23-jpg/",imageCredit:"Nordkirmes.net",imageSourceUrl:"https://nordkirmes.net/"},
    {id:"raupenbahn",name:"Raupenbahn",operator:"Buchholz",operatorFull:"Buchholz",new2026:false,manufacturer:null,type:"Historische Raupenbahn",year:1926,dimensions:null,capacity:null,priceEuro:null,sourceUrl:adultSource,imageUrl:"https://i.postimg.cc/BnjTvqFb/IMGP4296.jpg",imageCredit:"Kirmesfoto",imageSourceUrl:"https://i.postimg.cc/"},
    {id:"highway-no-1",name:"Highway No. 1",operator:"Schneider",operatorFull:"Johann Schneider & Sohn (Münster)",new2026:false,manufacturer:null,type:"2-Säulen-Skooter",year:null,dimensions:"Fahrbahn ca. 30 × 16 m",capacity:null,priceEuro:null,sourceUrl:adultSource,imageUrl:"https://www.ummet-eck.de/Bilder/fotosets/678/1-highwayno1-herbstsend22-c-ummeteck-chr-schoen.jpg",imageCredit:"Ummet-Eck · Christian Schön",imageSourceUrl:"https://www.ummet-eck.de/"},

    {id:"1001-nacht",name:"1001 Nacht",operator:"Breuer",operatorFull:"Breuer",new2026:false,manufacturer:null,type:"Kinder-Rundfahrt",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:kidsSource,imageUrl:null,imageCredit:null,imageSourceUrl:null},
    {id:"action-bungy",name:"Action-Bungy",operator:"Bossle",operatorFull:"Bossle",new2026:false,manufacturer:null,type:"Bungee-Trampolin",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:kidsSource,imageUrl:null,imageCredit:null,imageSourceUrl:null},
    {id:"barock-kinderkettenkarussell",name:"Barock Kinderkettenkarussell",operator:"Sobotta",operatorFull:"Sobotta",new2026:false,manufacturer:null,type:"Kinder-Kettenkarussell",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:kidsSource,imageUrl:null,imageCredit:null,imageSourceUrl:null},
    {id:"crazy-jungle",name:"Crazy Jungle",operator:"Luxem",operatorFull:"Tanja Luxem",new2026:false,manufacturer:null,type:"Kinderachterbahn",year:null,dimensions:"ca. 28 × 12 × 7 m",capacity:"bis 24 Personen",priceEuro:null,sourceUrl:kidsSource,imageUrl:"https://www.kirmesecke.de/Bilder/fotosets/1024/crazy-jungle-puetzchens-markt23-c-UMM-c-schoen-1.jpg",imageCredit:"Kirmesecke / Ummet-Eck",imageSourceUrl:"https://www.kirmesecke.de/"},
    {id:"kater-carlos-weltreise",name:"Kater Carlos Weltreise",operator:"Schneider",operatorFull:"Schneider",new2026:false,manufacturer:null,type:"Kinder-Rundfahrt",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:kidsSource,imageUrl:null,imageCredit:null,imageSourceUrl:null},
    {id:"kindersport-karussell",name:"Kindersport-Karussell",operator:"Voss",operatorFull:"Voss",new2026:false,manufacturer:null,type:"Kinder-Sportkarussell",year:null,dimensions:"ca. 9 m Durchmesser",capacity:null,priceEuro:null,sourceUrl:kidsSource,imageUrl:"https://kermisplanner.nl/uploads/attractions/attraction-karussell-disneyland/1678391282_85d69011c5b3467b215b.jpg",imageCredit:"Kermisplanner.nl",imageSourceUrl:"https://kermisplanner.nl/"},
    {id:"kinderzauber",name:"Kinderzauber",operator:"Zajuntz",operatorFull:"Zajuntz",new2026:false,manufacturer:null,type:"Kinder-Rundfahrt",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:kidsSource,imageUrl:null,imageCredit:null,imageSourceUrl:null},
    {id:"mini-jet",name:"Mini-Jet",operator:"Dreßen",operatorFull:"Dreßen",new2026:false,manufacturer:null,type:"Kinder-Flugkarussell",year:null,dimensions:null,capacity:"12 Fahrzeuge",priceEuro:null,sourceUrl:kidsSource,imageUrl:null,imageCredit:null,imageSourceUrl:null},
    {id:"rainbow-truck",name:"Rainbow Truck",operator:"Kaiser-Benna",operatorFull:"Kaiser-Benna",new2026:false,manufacturer:null,type:"Kinder-Rennpiste",year:null,dimensions:"ca. 14 × 7 m",capacity:null,priceEuro:null,sourceUrl:kidsSource,imageUrl:"https://www.bocholt.de/kirmes/attraktionen/fahrgeschaefte-fuer-kinder/rainbow-truck/_/Kinderkarussell_Rainbow%20Truck_Kaiser-Benna.jpg",imageCredit:"Stadtmarketing Bocholt",imageSourceUrl:kidsSource},
    {id:"sieben-himmelfahrten",name:"Sieben Himmelfahrten",operator:"Schmelter",operatorFull:"Schmelter",new2026:false,manufacturer:null,type:"Kinderkarussell",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:kidsSource,imageUrl:"https://www.bocholt.de/en/funfair/attractions/rides-for-children/seven-ascensions/_/Kinderkarussell_Sieben%20Himmelfahrten_Schmelzer.jpg?height=3379&width=4635",imageCredit:"Stadtmarketing Bocholt",imageSourceUrl:kidsSource},
    {id:"rallye-master",name:"Rallye Master",operator:"Enders",operatorFull:"Enders",new2026:false,manufacturer:null,type:"Kinder-Autoscooter",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:kidsSource,imageUrl:null,imageCredit:null,imageSourceUrl:null},
    {id:"traumflug",name:"Traumflug",operator:"Phillip/Schmelter",operatorFull:"Phillip / Schmelter",new2026:false,manufacturer:null,type:"Kinder-Flugkarussell",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:kidsSource,imageUrl:null,imageCredit:null,imageSourceUrl:null},
    {id:"ufo-jet-star-trek",name:"Ufo-Jet · Star Trek",operator:"Krenz",operatorFull:"Krenz",new2026:false,manufacturer:null,type:"Kinder-Flugkarussell",year:null,dimensions:"bis ca. 6 m Flughöhe",capacity:"14 Raumgleiter",priceEuro:null,sourceUrl:kidsSource,imageUrl:null,imageCredit:null,imageSourceUrl:null},
    {id:"world-of-fantasy",name:"World of Fantasy",operator:"Bruch",operatorFull:"Bruch",new2026:false,manufacturer:null,type:"Kinder-Autorallye",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:kidsSource,imageUrl:null,imageCredit:null,imageSourceUrl:null}
  ];

  const rides = rawRides.map((ride) => Object.assign({}, ride, {
    id:"bocholt26-" + ride.id,
    zone:"Bocholter Kirmes 2026"
  }));

  const descriptions = {
    "look-360":"Rund 71 Meter entspannt nach oben: 360°-Panorama über Kirmes und Bocholter Innenstadt.",
    "skyfall":"80 Meter Freefall von Goetzke: hochziehen, Aussicht mitnehmen und dann echter freier Fall.",
    "break-dance":"Bruchs Break Dance: 16 Zweiergondeln, Drehscheibe, Gondelkreuze und freie Eigenrotation.",
    "roue-parisienne":"Rund 48 Meter hohes Riesenrad mit offenen und geschlossenen Gondeln für den Blick über Bocholt.",
    "invader":"Marvin Dreßens brandneuer Invader von SAD Maschinenbau: 16 Gondeln und 32 Plätze. Kurzfristiger Ersatz für Devil Rock.",
    "excalibur":"KMG XXL von Bruch mit bis zu rund 47 Metern Flughöhe und 20 Plätzen.",
    "disco-jet":"Moderner Musik-Express von Heitmann mit Berg-und-Tal-Fahrt, Musik, LEDs, Laser und Nebel.",
    "number-1":"Großer Autoscooter-Klassiker von Isken mit rund 348 m² Fahrbahn.",
    "fighter":"KMG Speed von Mages: bis rund 42 Meter, maximal etwa 120 km/h und bis zu 4,5 G.",
    "die-krake":"Markmanns Kirmesklassiker: Hubbewegung der Arme plus drehende Gondeln.",
    "looping-the-loop":"Historische Überschlagschaukel aus den 1930ern – die Überschläge entstehen durch eigenen Körpereinsatz.",
    "shake-and-roll":"Mondial Shake R5 von Schäfer mit mehreren Rotationsachsen und Überschlägen.",
    "villa-wahnsinn":"Zweistöckiges Laufgeschäft mit Wackelböden, Spiegel-Labyrinth, Tonnen, Hindernissen und Spiralrutsche.",
    "action-house":"Zwei Etagen Laufgeschäft mit Laufbändern, Brücken, Treppen und Geschicklichkeitselementen.",
    "fahrt-zur-hoelle-2":"Fellerhoffs Geisterbahn 2.0 mit dunklen Szenen, Effekten und klassischen Schreckmomenten.",
    "jumpstreet":"Rasante Rundfahrt von Marlon Klaasen mit eigenständiger Show- und Lichtoptik.",
    "wellenflug":"Klassischer Zierer-Wellenflug von Wendler mit 48 Plätzen.",
    "circus-circus":"Große Rundfahrt mit Zirkusoptik, mehreren Bewegungsabläufen und klassischer Kirmes-Show.",
    "sound-wave":"SBF Super Jump von Danny Schwerin mit zehn Gondeln, Hubbewegung und Rotation.",
    "raupenbahn":"Buchholz' historische Raupenbahn feiert 2026 ihr 100-jähriges Jubiläum.",
    "highway-no-1":"Zwei-Säulen-Autoscooter von Schneider – freie Fahrt und klassische Kirmesrunde.",
    "1001-nacht":"Orientalisch gestaltete Kinder-Rundfahrt von Breuer.",
    "action-bungy":"Bungee-Trampolin von Bossle: gesichert springen und mit Mut bis zum Salto.",
    "barock-kinderkettenkarussell":"Nostalgisches Kinderkettenkarussell von Sobotta im Barockstil.",
    "crazy-jungle":"Kinderachterbahn von Luxem mit Dschungelthema und Nebeleffekten.",
    "kater-carlos-weltreise":"Bunte Kinder-Rundfahrt von Schneider mit Weltreise-Thema.",
    "kindersport-karussell":"Klassisches Sportkarussell von Voss aus den 1960er-Jahren.",
    "kinderzauber":"Bunte Kinder-Rundfahrt von Zajuntz für die jüngsten Kirmesgäste.",
    "mini-jet":"Zwölf Flugzeuge und Raumschiffe, deren Höhe die Kinder selbst per Joystick steuern.",
    "rainbow-truck":"Kinder-Rennpiste von Kaiser-Benna über Berg und Tal.",
    "sieben-himmelfahrten":"Großes Kinderkarussell von Schmelter mit verschiedenen Fahrzeugen.",
    "rallye-master":"Kinder-Autoscooter von Enders mit kleinen Flitzern und echtem Scootergefühl.",
    "traumflug":"Kinder-Flugkarussell von Phillip/Schmelter mit selbst steuerbaren Gondeln.",
    "ufo-jet-star-trek":"14 selbstlenkbare Raumgleiter von Krenz, steuerbar bis rund sechs Meter Höhe.",
    "world-of-fantasy":"Kinder-Autorallye von Bruch auf einer Doppel-8-Strecke über zwei Ebenen."
  };

  const worlds = {};
  rides.forEach((ride) => {
    const rawId = ride.id.replace(/^bocholt26-/, "");
    worlds[ride.id] = {
      label:(ride.name + " · " + (ride.operator || "") + (ride.new2026 ? " · NEU 2026" : "")).toUpperCase(),
      line:descriptions[rawId] || "Bocholter Kirmes 2026.",
      artUrl:ride.imageUrl || "",
      imageCredit:ride.imageCredit || "",
      imageSourceUrl:ride.imageSourceUrl || ride.sourceUrl || ""
    };
  });

  const fontFamilies = [
    "'Poiret One', sans-serif","'Bebas Neue', sans-serif","'Faster One', sans-serif","'Cinzel Decorative', serif",
    "'Black Ops One', sans-serif","'UnifrakturCook', cursive","'Limelight', sans-serif","'Bungee', sans-serif",
    "'Orbitron', sans-serif","'Nosifer', cursive","'Rye', serif","'Fascinate Inline', cursive",
    "'Creepster', cursive","'Wallpoet', sans-serif","'Pirata One', serif","'Bangers', cursive",
    "'Diplomata SC', serif","'Chango', sans-serif","'Bungee Shade', sans-serif","'Audiowide', sans-serif",
    "'Special Elite', monospace","'Ewert', serif","'Trade Winds', cursive","'Graduate', serif",
    "'Zen Tokyo Zoo', sans-serif","'Monoton', sans-serif","'Rubik Glitch', sans-serif","'Staatliches', sans-serif",
    "'Stardos Stencil', serif","'Metal Mania', cursive"
  ];
  const fonts = {};
  rides.forEach((ride, index) => {
    fonts[ride.id] = {
      fontFamily:fontFamilies[index % fontFamilies.length],
      theme:"fair-bocholt-" + ride.id.replace(/^bocholt26-/, "")
    };
  });

  const aliases = {};
  rides.forEach((ride) => { aliases[ride.name.toLowerCase()] = ride.id; });
  aliases["number 1"] = "bocholt26-number-1";
  aliases["look 360"] = "bocholt26-look-360";

  const rideConfig = {};
  rides.forEach((ride) => { rideConfig[ride.id] = {singleRider:false}; });
  rideConfig["bocholt26-fighter"].speedKmh = 120;

  window.NAEHEN_BOCHOLT_KIRMES_2026 = {
    park:{
      slug:"bocholt-kirmes-2026",
      kind:"fair",
      name:"Bocholter Kirmes 2026",
      location:"Bocholt · 16.–19.10.2026",
      officialUrl:"https://www.bocholt.de/freizeit-und-tourismus/veranstaltungen/kirmes",
      liveDataUrl:null,
      liveWaits:false,
      supportsPostedWait:false,
      sortMode:"configured",
      receiptTitle:"BOCHOLTER KIRMES 2026",
      receiptLocation:"BOCHOLT",
      specialMap:{
        eyebrow:"BOCHOLT · LAGEPLAN",
        title:"Kirmesplan 2026",
        subtitle:"Plan des Stadtmarketings · NÄHEN berücksichtigt die kurzfristige Änderung Devil Rock → Invader.",
        sourceLabel:"Offizielle Attraktionen öffnen",
        sourceUrl:adultSource,
        imageUrl:"./assets/bocholt-kirmes-2026-plan.webp",
        imageAlt:"Lageplan der Bocholter Kirmes 2026",
        note:"WICHTIG: Die Druckgrafik nennt am alten Feuerwehrgelände noch Devil Rock. Aktueller Stand: Invader von Marvin Dreßen übernimmt diesen Standplatz.",
        aspectRatio:"1 / 1",
        points:[
          {rideId:"bocholt26-world-of-fantasy",x:31,y:26},
          {rideId:"bocholt26-villa-wahnsinn",x:36,y:30},
          {rideId:"bocholt26-mini-jet",x:54,y:34},
          {rideId:"bocholt26-kater-carlos-weltreise",x:62,y:35},
          {rideId:"bocholt26-kindersport-karussell",x:78,y:35},
          {rideId:"bocholt26-sound-wave",x:91,y:39},
          {rideId:"bocholt26-fighter",x:37,y:40},
          {rideId:"bocholt26-action-bungy",x:65,y:44},
          {rideId:"bocholt26-looping-the-loop",x:18,y:47},
          {rideId:"bocholt26-1001-nacht",x:80,y:47},
          {rideId:"bocholt26-number-1",x:22,y:50},
          {rideId:"bocholt26-ufo-jet-star-trek",x:89,y:52},
          {rideId:"bocholt26-excalibur",x:15,y:54},
          {rideId:"bocholt26-rallye-master",x:39,y:57},
          {rideId:"bocholt26-circus-circus",x:87,y:58},
          {rideId:"bocholt26-crazy-jungle",x:86,y:63},
          {rideId:"bocholt26-roue-parisienne",x:55,y:66},
          {rideId:"bocholt26-invader",x:14,y:68,alwaysLabel:true},
          {rideId:"bocholt26-skyfall",x:24,y:68},
          {rideId:"bocholt26-look-360",x:79,y:70},
          {rideId:"bocholt26-break-dance",x:55,y:72},
          {rideId:"bocholt26-sieben-himmelfahrten",x:25,y:72},
          {rideId:"bocholt26-kinderzauber",x:90,y:76},
          {rideId:"bocholt26-disco-jet",x:31,y:76},
          {rideId:"bocholt26-shake-and-roll",x:55,y:77},
          {rideId:"bocholt26-raupenbahn",x:72,y:78},
          {rideId:"bocholt26-jumpstreet",x:37,y:82},
          {rideId:"bocholt26-fahrt-zur-hoelle-2",x:53,y:84},
          {rideId:"bocholt26-rainbow-truck",x:68,y:84},
          {rideId:"bocholt26-barock-kinderkettenkarussell",x:28,y:86},
          {rideId:"bocholt26-highway-no-1",x:37,y:91},
          {rideId:"bocholt26-wellenflug",x:58,y:91},
          {rideId:"bocholt26-die-krake",x:54,y:94},
          {rideId:"bocholt26-action-house",x:39,y:96},
          {rideId:"bocholt26-traumflug",x:47,y:96}
        ]
      },
      cardImage:"./assets/bocholt-kirmes-2026-plan.webp",
      cardCopy:"35 Fahrgeschäfte · 4 Neuheiten · vier Tage Kirmes mitten in der Bocholter Innenstadt.",
      noLiveLabel:"KIRMES · KEINE LIVE-WARTEZEITEN",
      noLiveMessage:"Auf der Bocholter Kirmes gibt es keine öffentlichen strukturierten Live-Wartezeiten. NÄHEN misst stattdessen deine persönliche Queue.",
      noLiveAlarmMessage:"Für Kirmessen ohne öffentliche Wartezeitdaten sind Wartezeit-Alarme deaktiviert.",
      disclaimer:"Unabhängige Fan-Übersicht zur Bocholter Kirmes 2026. Kein offizielles Angebot der Stadt Bocholt. Lageplan: Stadtmarketing Bocholt. Aktueller NÄHEN-Stand: Invader ersetzt Devil Rock."
    },
    rides,
    worlds,
    fonts,
    aliases,
    rideConfig,
    exclusions:{ids:[],namePatterns:["devil rock"]}
  };
})();
