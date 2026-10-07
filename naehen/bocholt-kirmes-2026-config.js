(() => {
  "use strict";

  const adultSource = "https://www.bocholt.de/freizeit-und-tourismus/veranstaltungen/kirmes/attraktionen?category=46782";
  const kidsSource = "https://www.bocholt.de/freizeit-und-tourismus/veranstaltungen/kirmes/attraktionen?category=46726";

  const rawRides = [
    {id:"look-360",name:"Look 360° Panorama",operator:"Schneider",operatorFull:"F. T. Schneider GmbH",new2026:true,manufacturer:"Funtime (A)",type:"Aussichtsturm",year:2024,dimensions:"ca. 71 m hoch",capacity:"80 Personen · 4 Kabinen",priceEuro:null,sourceUrl:adultSource,imageUrl:"./assets/bocholt-look-360.webp",imageCredit:"LOOK 360° Panorama",imageSourceUrl:"https://look-panorama.com/"},
    {id:"skyfall",name:"Skyfall",operator:"Goetzke",operatorFull:"Alexander Goetzke",new2026:false,manufacturer:"Funtime (A)",type:"Free Fall",year:null,dimensions:"80 m hoch",capacity:"24 Personen",priceEuro:null,sourceUrl:adultSource,imageUrl:"./assets/bocholt-skyfall.webp",imageCredit:"oktoberfest.de",imageSourceUrl:"https://www.oktoberfest.de/"},
    {id:"break-dance",name:"Break Dance",operator:"Bruch",operatorFull:"William Christian Bruch (Düsseldorf)",new2026:false,manufacturer:"HUSS (D)",type:"Break Dance 1 (Nr. 37)",year:1990,dimensions:"20 × 21 × 15 m",capacity:"32 Personen · 16 Gondeln",priceEuro:null,sourceUrl:adultSource,rideIndexUrl:"https://ride-index.de/2005/01/04/break-dance-bruch/",imageUrl:"./assets/bocholt-break-dance.webp",imageCredit:"Stadtmarketing Bocholt · Originalfoto ohne Text-Overlay",imageSourceUrl:"https://www.bocholt.de/freizeit-und-tourismus/veranstaltungen/kirmes/attraktionen/fahrgeschaefte-fuer-erwachsene/break-dance"},
    {id:"roue-parisienne",name:"Roue Parisienne",operator:"Kleuser",operatorFull:"Burkhard Kleuser",new2026:false,manufacturer:null,type:"Riesenrad",year:null,dimensions:"ca. 48 m hoch",capacity:"36 Gondeln · bis 6 Personen",priceEuro:null,sourceUrl:adultSource,imageUrl:"https://www.grafik2308.de/Feste/Jahrmarkt/Riesenrad/Riesenrad14.jpg",imageCredit:"grafik2308.de",imageSourceUrl:"https://www.grafik2308.de/"},
    {id:"invader",name:"Invader",operator:"Dreßen",operatorFull:"Marvin Dreßen (Mönchengladbach)",new2026:true,manufacturer:"SAD Maschinenbau",type:"Rundfahrgeschäft",year:2026,dimensions:null,capacity:"32 Personen · 16 Gondeln",priceEuro:null,sourceUrl:"https://funfair-entertainment.de/news/bocholter-kirmes-2026-invader-ersetzt-devil-rock-320-betriebe-raupenbahn",rideIndexUrl:"https://ride-index.de/",imageUrl:"./assets/bocholt-invader.webp",imageCredit:"FunFair Entertainment",imageSourceUrl:"https://funfair-entertainment.de/"},
    {id:"excalibur",name:"Excalibur",operator:"Bruch",operatorFull:"Harry P. E. Bruch",new2026:false,manufacturer:"KMG (NL)",type:"XXL",year:2022,dimensions:"ca. 47 m Flughöhe",capacity:"20 Personen",priceEuro:null,sourceUrl:adultSource,imageUrl:"./assets/bocholt-excalibur.webp",imageCredit:"Ummet-Eck",imageSourceUrl:"https://www.ummet-eck.de/"},
    {id:"disco-jet",name:"Disco Jet",operator:"Heitmann",operatorFull:"Heitmann GbR",new2026:false,manufacturer:null,type:"Musik-Express",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:adultSource,imageUrl:"./assets/bocholt-disco-jet.webp",imageCredit:"Heitmann GbR / Stadt Bocholt",imageSourceUrl:"https://www.bocholt.de/kirmes/attraktionen/fahrgeschaefte-fuer-erwachsene/disco-jet"},
    {id:"number-1",name:"Autoscooter Number 1",operator:"Isken",operatorFull:"Rudolf Isken (Dortmund)",new2026:false,manufacturer:"Mack (D)",type:"2-Säulen-Skooter",year:1981,dimensions:"Fahrbahn ca. 348 m²",capacity:null,priceEuro:null,sourceUrl:adultSource,imageUrl:"./assets/soest-number-1.webp",imageCredit:"Ummet-Eck · Christian Schön",imageSourceUrl:"https://www.ummet-eck.de/regionen/103142-Autoscooter-Number-1-Isken-/"},
    {id:"fighter",name:"Fighter",operator:"Mages",operatorFull:"Marco Mages / MMV Betriebs GmbH",new2026:false,manufacturer:"KMG (NL)",type:"Speed",year:2017,dimensions:"bis ca. 42 m",capacity:"8 Personen",speedKmh:120,priceEuro:null,sourceUrl:adultSource,imageUrl:"./assets/bocholt-fighter.webp",imageCredit:"Ummet-Eck · Silke Schön",imageSourceUrl:"https://www.ummet-eck.de/regionen/103131-Fighter-Mages-/"},
    {id:"die-krake",name:"Die Krake",operator:"Markmann",operatorFull:"Markmann",new2026:false,manufacturer:null,type:"Polyp / Rundfahrgeschäft",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:adultSource,imageUrl:"https://www.ummet-eck.de/Bilder/poi/1024/krake-markmann-essen-stadion23-c-UMM-s-schoen.jpg",imageCredit:"Ummet-Eck",imageSourceUrl:"https://www.ummet-eck.de/"},
    {id:"looping-the-loop",name:"Looping the Loop",operator:"Marquis",operatorFull:"Marquis",new2026:false,manufacturer:null,type:"Historische Überschlagschaukel",year:null,dimensions:null,capacity:"16 Personen · 8 Gondeln",priceEuro:null,sourceUrl:adultSource,imageUrl:"https://www.ummet-eck.de/Bilder/fotosets/1024/sterkrader-fronleichnamskirmes-2022-028.jpg",imageCredit:"Ummet-Eck",imageSourceUrl:"https://www.ummet-eck.de/"},
    {id:"shake-and-roll",name:"Shake & Roll",operator:"Schäfer",operatorFull:"Schäfer GmbH (Schwerte)",new2026:false,manufacturer:"Mondial (NL)",type:"Shake R5",year:1991,dimensions:"23 × 23 × 14 m",capacity:"40 Personen · 20 Gondeln",priceEuro:null,sourceUrl:adultSource,imageUrl:"./assets/bocholt-shake-and-roll.webp",imageCredit:"Ummet-Eck · Christian Schön",imageSourceUrl:"https://www.ummet-eck.de/"},
    {id:"villa-wahnsinn",name:"Villa Wahnsinn",operator:"von Olnhausen",operatorFull:"von Olnhausen",new2026:false,manufacturer:null,type:"2-Etagen-Laufgeschäft",year:null,dimensions:"ca. 24 m breit",capacity:null,priceEuro:null,sourceUrl:adultSource,imageUrl:"./assets/bocholt-villa-wahnsinn.webp",imageCredit:"Ummet-Eck · Christian Schön",imageSourceUrl:"https://www.ummet-eck.de/"},
    {id:"action-house",name:"Action House",operator:"Schmelter-Dreßen",operatorFull:"Schmelter-Dreßen GbR",new2026:false,manufacturer:null,type:"Laufgeschäft",year:null,dimensions:"ca. 13 m breit · 10 m hoch",capacity:null,priceEuro:null,sourceUrl:adultSource,imageUrl:"https://www.rheinkirmes.com/fileadmin/Attraktionen/Laufgeschaefte/Action_House/ActionHouse.jpg",imageCredit:"Rheinkirmes",imageSourceUrl:"https://www.rheinkirmes.com/"},
    {id:"fahrt-zur-hoelle-2",name:"Fahrt zur Hölle 2.0",operator:"Fellerhoff",operatorFull:"Hermann Fellerhoff & Söhne",new2026:true,manufacturer:null,type:"Geisterbahn",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:adultSource,imageUrl:"./assets/bocholt-fahrt-zur-hoelle.webp",imageCredit:"Fellerhoff Geisterbahn",imageSourceUrl:"https://www.fellerhoff-geisterbahn.de/"},
    {id:"jumpstreet",name:"JumpStreet",operator:"Klaasen",operatorFull:"Marlon Klaasen",new2026:false,manufacturer:null,type:"Rundfahrgeschäft",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:adultSource,imageUrl:"./assets/bocholt-jumpstreet.webp",imageCredit:"Kermisplanner.nl",imageSourceUrl:"https://kermisplanner.nl/"},
    {id:"wellenflug",name:"Wellenflug",operator:"Wendler",operatorFull:"Wendler (Unna)",new2026:false,manufacturer:"Zierer (D)",type:"Wellenflug / Kettenflieger",year:1988,dimensions:null,capacity:"48 Personen",priceEuro:null,sourceUrl:adultSource,imageUrl:"./assets/bocholt-wellenflug.webp",imageCredit:"Wellenflug Wendler",imageSourceUrl:"https://www.wellenflug.com/"},
    {id:"circus-circus",name:"Circus Circus",operator:"Circus Circus",operatorFull:"Circus Circus GmbH & Co. KG",new2026:false,manufacturer:null,type:"Rundfahrgeschäft",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:adultSource,imageUrl:"https://rheinkirmes.com/fileadmin/Attraktionen/Rundfahrgeschaefte/Circus_Circus/circus2.jpg",imageCredit:"Rheinkirmes",imageSourceUrl:"https://www.rheinkirmes.com/"},
    {id:"sound-wave",name:"Sound Wave",operator:"Schwerin",operatorFull:"Danny Schwerin",new2026:true,manufacturer:"SBF Vista (I)",type:"Super Jump",year:2024,dimensions:"18,5 × 17 m",capacity:"30 Personen · 10 Gondeln",priceEuro:null,sourceUrl:adultSource,imageUrl:"./assets/bocholt-sound-wave.webp",imageCredit:"Ummet-Eck · Christian Schön",imageSourceUrl:"https://www.ummet-eck.de/"},
    {id:"raupenbahn",name:"Raupenbahn",operator:"Buchholz",operatorFull:"Buchholz",new2026:false,manufacturer:null,type:"Historische Raupenbahn",year:1926,dimensions:null,capacity:null,priceEuro:null,sourceUrl:adultSource,imageUrl:"./assets/bocholt-raupenbahn.webp",imageCredit:"Kirmesfoto",imageSourceUrl:"https://i.postimg.cc/"},
    {id:"highway-no-1",name:"Highway No. 1",operator:"Schneider",operatorFull:"Johann Schneider & Sohn (Münster)",new2026:false,manufacturer:null,type:"2-Säulen-Skooter",year:null,dimensions:"Fahrbahn ca. 30 × 16 m",capacity:null,priceEuro:null,sourceUrl:adultSource,imageUrl:"./assets/bocholt-highway-no-1.webp",imageCredit:"Ummet-Eck · Christian Schön",imageSourceUrl:"https://www.ummet-eck.de/"},

    {id:"1001-nacht",name:"1001 Nacht",operator:"Breuer",operatorFull:"Breuer",new2026:false,manufacturer:null,type:"Kinder-Rundfahrt",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:kidsSource,imageUrl:"./assets/bocholt-1001-nacht.webp",imageCredit:"Breuer / Stadt Bocholt",imageSourceUrl:"https://www.bocholt.de/kirmes/attraktionen/fahrgeschaefte-fuer-kinder/1001-nacht"},
    {id:"action-bungy",name:"Action-Bungy",operator:"Bossle",operatorFull:"Bossle",new2026:false,manufacturer:null,type:"Bungee-Trampolin",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:kidsSource,imageUrl:"https://www.bocholt.de/kirmes/attraktionen/fahrgeschaefte-fuer-kinder/action-bungy/_/ActionBungy.jpg?height=1600&width=2400",imageCredit:"polyweb.eu / Stadt Bocholt",imageSourceUrl:"https://www.bocholt.de/kirmes/attraktionen/fahrgeschaefte-fuer-kinder/action-bungy"},
    {id:"barock-kinderkettenkarussell",name:"Barock Kinderkettenkarussell",operator:"Sobotta",operatorFull:"Sobotta",new2026:false,manufacturer:null,type:"Kinder-Kettenkarussell",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:kidsSource,imageUrl:"https://www.bocholt.de/kirmes/attraktionen/fahrgeschaefte-fuer-kinder/barock-kinderkettenkarussell/_/Sobotta_Kinder%20Barock%20Kettenkarussell.jpg",imageCredit:"Sobotta / Stadt Bocholt",imageSourceUrl:"https://www.bocholt.de/kirmes/attraktionen/fahrgeschaefte-fuer-kinder/barock-kinderkettenkarussell"},
    {id:"crazy-jungle",name:"Crazy Jungle",operator:"Luxem",operatorFull:"Tanja Luxem",new2026:false,manufacturer:null,type:"Kinderachterbahn",year:null,dimensions:"ca. 28 × 12 × 7 m",capacity:"bis 24 Personen",priceEuro:null,sourceUrl:kidsSource,imageUrl:"./assets/bocholt-crazy-jungle.webp",imageCredit:"Kirmesecke / Ummet-Eck",imageSourceUrl:"https://www.kirmesecke.de/"},
    {id:"kater-carlos-weltreise",name:"Kater Carlos Weltreise",operator:"Schneider",operatorFull:"Thomas Schneider (Soest)",new2026:false,manufacturer:"Völz (D)",type:"Sportkarussell",year:null,dimensions:"6 × 8 m",capacity:null,priceEuro:null,sourceUrl:kidsSource,rideIndexUrl:"https://ride-index.de/2007/11/24/kater-carlos-weltreise/",imageUrl:"https://www.bocholt.de/nl/kirmes/attracties/ritjes-voor-kinderen/carlos-kat-reist-de-wereld-rond/_/Kinderkarussell_Kater%20Carlos%20Weltreise_Thomas%20Schneider.jpg",imageCredit:"Thomas Schneider / Stadt Bocholt",imageSourceUrl:"https://www.bocholt.de/kirmes/attraktionen/fahrgeschaefte-fuer-kinder/kater-carlos-weltreise"},
    {id:"kindersport-karussell",name:"Kindersport-Karussell",operator:"Voss",operatorFull:"Voss",new2026:false,manufacturer:null,type:"Kinder-Sportkarussell",year:null,dimensions:"ca. 9 m Durchmesser",capacity:null,priceEuro:null,sourceUrl:kidsSource,imageUrl:"https://kermisplanner.nl/uploads/attractions/attraction-karussell-disneyland/1678391282_85d69011c5b3467b215b.jpg",imageCredit:"Kermisplanner.nl",imageSourceUrl:"https://kermisplanner.nl/"},
    {id:"kinderzauber",name:"Kinderzauber",operator:"Zajuntz",operatorFull:"Zajuntz",new2026:false,manufacturer:null,type:"Kinder-Rundfahrt",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:kidsSource,imageUrl:"https://www.bocholt.de/freizeit-und-tourismus/veranstaltungen/kirmes/attraktionen/fahrgeschaefte-fuer-kinder/kinderzauber/_/Kinderkarussell_Kinderzauber_Zajuntz.jpg?height=1600&width=2400",imageCredit:"Zajuntz / Stadtmarketing Bocholt",imageSourceUrl:"https://www.bocholt.de/freizeit-und-tourismus/veranstaltungen/kirmes/attraktionen?category=46726"},
    {id:"mini-jet",name:"Mini-Jet",operator:"Dreßen",operatorFull:"Dreßen (Mönchengladbach)",new2026:false,manufacturer:"Lutz (F)",type:"Baby Flug",year:1971,dimensions:"11 m",capacity:"12 Fahrzeuge",priceEuro:null,sourceUrl:kidsSource,rideIndexUrl:"https://ride-index.de/2015/05/25/kinder-mini-jet-mueller/",imageUrl:"https://www.bocholt.de/kirmes/attraktionen/fahrgeschaefte-fuer-kinder/mini-jet/_/MiniJet.jpg?height=1600&width=2400",imageCredit:"Dreßen / Stadt Bocholt",imageSourceUrl:"https://www.bocholt.de/kirmes/attraktionen/fahrgeschaefte-fuer-kinder/mini-jet"},
    {id:"rainbow-truck",name:"Rainbow Truck",operator:"Kaiser-Benna",operatorFull:"Kaiser-Benna",new2026:false,manufacturer:null,type:"Kinder-Rennpiste",year:null,dimensions:"ca. 14 × 7 m",capacity:null,priceEuro:null,sourceUrl:kidsSource,imageUrl:"https://www.bocholt.de/kirmes/attraktionen/fahrgeschaefte-fuer-kinder/rainbow-truck/_/Kinderkarussell_Rainbow%20Truck_Kaiser-Benna.jpg",imageCredit:"Stadtmarketing Bocholt",imageSourceUrl:kidsSource},
    {id:"sieben-himmelfahrten",name:"Sieben Himmelfahrten",operator:"Schmelter",operatorFull:"Schmelter",new2026:false,manufacturer:null,type:"Kinderkarussell",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:kidsSource,imageUrl:"./assets/bocholt-sieben-himmelfahrten.webp",imageCredit:"Stadtmarketing Bocholt",imageSourceUrl:kidsSource},
    {id:"rallye-master",name:"Rallye Master",operator:"Enders",operatorFull:"Enders & Sohn",new2026:false,manufacturer:null,type:"Kinder-Autoscooter",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:kidsSource,imageUrl:"./assets/bocholt-rallye-master.webp",imageCredit:"Enders / Stadt Bocholt",imageSourceUrl:"https://www.bocholt.de/kirmes/attraktionen/fahrgeschaefte-fuer-kinder/the-rallye-master"},
    {id:"traumflug",name:"Traumflug",operator:"Phillip/Schmelter",operatorFull:"Phillip / Schmelter",new2026:false,manufacturer:null,type:"Kinder-Flugkarussell",year:null,dimensions:null,capacity:null,priceEuro:null,sourceUrl:kidsSource,imageUrl:"https://www.bocholt.de/nl/kirmes/attracties/ritjes-voor-kinderen/droomvlucht/_/Traumflug.jpg",imageCredit:"Stadtmarketing Bocholt",imageSourceUrl:"https://www.bocholt.de/kirmes/attraktionen/fahrgeschaefte-fuer-kinder/traumflug"},
    {id:"ufo-jet-star-trek",name:"Ufo-Jet · Star Trek",operator:"Krenz",operatorFull:"Krenz",new2026:false,manufacturer:null,type:"Kinder-Flugkarussell",year:null,dimensions:"bis ca. 6 m Flughöhe",capacity:"14 Raumgleiter",priceEuro:null,sourceUrl:kidsSource,imageUrl:"./assets/bocholt-ufo-jet.webp",imageCredit:"Stadtmarketing Bocholt",imageSourceUrl:"https://www.bocholt.de/freizeit-und-tourismus/veranstaltungen/kirmes/attraktionen/fahrgeschaefte-fuer-kinder/ufo-jet"},
    {id:"world-of-fantasy",name:"World of Fantasy",operator:"Bruch",operatorFull:"H. P. Bruch (Düsseldorf)",new2026:false,manufacturer:"Dietz (D)",type:"Doppel-8-Schleife",year:1991,dimensions:"19,50 × 11 m",capacity:null,priceEuro:null,sourceUrl:kidsSource,rideIndexUrl:"https://ride-index.de/2006/12/23/world-of-fantasy-bruch/",imageUrl:"https://www.bocholt.de/en/funfair/attractions/rides-for-children/world-of-fantasy/_/Kinderkraussell_World%20of%20Fantasy_Bruch.jpg",imageCredit:"Bruch / Stadt Bocholt",imageSourceUrl:"https://www.bocholt.de/freizeit-und-tourismus/veranstaltungen/kirmes/attraktionen/fahrgeschaefte-fuer-kinder/world-of-fantasy"}
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
          {rideId:"bocholt26-world-of-fantasy",x:25.7,y:25.7,w:12.0,h:3.7,labelHitbox:true},
          {rideId:"bocholt26-villa-wahnsinn",x:30.2,y:32.4,w:17.0,h:8.1,labelHitbox:true},
          {rideId:"bocholt26-mini-jet",x:49.0,y:34.3,w:11.6,h:3.8,labelHitbox:true},
          {rideId:"bocholt26-kater-carlos-weltreise",x:62.1,y:30.5,w:12.4,h:5.0,labelHitbox:true},
          {rideId:"bocholt26-kindersport-karussell",x:78.4,y:30.3,w:11.8,h:5.2,labelHitbox:true},
          {rideId:"bocholt26-sound-wave",x:92.0,y:28.8,w:12.8,h:4.2,labelHitbox:true},
          {rideId:"bocholt26-fighter",x:31.4,y:39.3,w:7.4,h:3.8,labelHitbox:true},
          {rideId:"bocholt26-action-bungy",x:61.9,y:38.1,w:6.9,h:6.0,labelHitbox:true},
          {rideId:"bocholt26-looping-the-loop",x:10.5,y:36.1,w:15.0,h:4.1,labelHitbox:true},
          {rideId:"bocholt26-1001-nacht",x:78.7,y:40.9,w:11.6,h:4.0,labelHitbox:true},
          {rideId:"bocholt26-number-1",x:13.7,y:40.8,w:12.6,h:5.2,labelHitbox:true},
          {rideId:"bocholt26-ufo-jet-star-trek",x:90.9,y:44.2,w:8.3,h:3.8,labelHitbox:true},
          {rideId:"bocholt26-excalibur",x:7.2,y:46.3,w:8.9,h:5.8,labelHitbox:true},
          {rideId:"bocholt26-rallye-master",x:35.5,y:55.3,w:11.9,h:5.8,labelHitbox:true},
          {rideId:"bocholt26-circus-circus",x:84.1,y:49.3,w:16.1,h:4.0,labelHitbox:true},
          {rideId:"bocholt26-crazy-jungle",x:84.1,y:53.5,w:16.1,h:4.0,labelHitbox:true},
          {rideId:"bocholt26-roue-parisienne",x:54.1,y:62.6,w:13.0,h:3.6,labelHitbox:true},
          {rideId:"bocholt26-invader",x:5.8,y:62.0,w:11.0,h:4.2,labelHitbox:true,replacementLabel:"INVADER"},
          {rideId:"bocholt26-skyfall",x:17.2,y:62.3,w:11.2,h:3.4,labelHitbox:true},
          {rideId:"bocholt26-look-360",x:79.5,y:61.1,w:15.9,h:4.9,labelHitbox:true},
          {rideId:"bocholt26-break-dance",x:53.6,y:69.1,w:11.9,h:3.6,labelHitbox:true},
          {rideId:"bocholt26-sieben-himmelfahrten",x:19.0,y:70.7,w:11.6,h:3.6,labelHitbox:true},
          {rideId:"bocholt26-kinderzauber",x:89.4,y:66.8,w:13.2,h:4.0,labelHitbox:true},
          {rideId:"bocholt26-disco-jet",x:20.2,y:74.2,w:10.1,h:5.6,labelHitbox:true},
          {rideId:"bocholt26-shake-and-roll",x:54.4,y:74.0,w:14.0,h:4.0,labelHitbox:true},
          {rideId:"bocholt26-raupenbahn",x:67.8,y:67.1,w:12.0,h:4.0,labelHitbox:true},
          {rideId:"bocholt26-jumpstreet",x:20.2,y:75.0,w:10.5,h:4.0,labelHitbox:true},
          {rideId:"bocholt26-fahrt-zur-hoelle-2",x:50.1,y:78.5,w:24.6,h:5.6,labelHitbox:true},
          {rideId:"bocholt26-rainbow-truck",x:68.2,y:74.5,w:14.0,h:4.0,labelHitbox:true},
          {rideId:"bocholt26-barock-kinderkettenkarussell",x:15.3,y:80.4,w:18.6,h:5.1,labelHitbox:true},
          {rideId:"bocholt26-highway-no-1",x:26.0,y:84.1,w:13.9,h:5.8,labelHitbox:true},
          {rideId:"bocholt26-wellenflug",x:56.4,y:85.7,w:21.9,h:4.0,labelHitbox:true},
          {rideId:"bocholt26-die-krake",x:51.7,y:90.8,w:21.0,h:3.6,labelHitbox:true},
          {rideId:"bocholt26-action-house",x:23.8,y:88.6,w:24.8,h:6.7,labelHitbox:true},
          {rideId:"bocholt26-traumflug",x:32.1,y:91.2,w:12.3,h:5.6,labelHitbox:true}
        ]
      },
      cardImage:"./assets/bocholt-kirmes-2026-background.webp",
      cardCopy:"35 Fahrgeschäfte · 4 Neuheiten · vier Tage Kirmes mitten in der Bocholter Innenstadt.",
      noLiveLabel:"KIRMES · KEINE LIVE-WARTEZEITEN",
      noLiveMessage:"Auf der Bocholter Kirmes gibt es keine öffentlichen strukturierten Live-Wartezeiten. NÄHEN misst stattdessen deine persönliche Queue.",
      noLiveAlarmMessage:"Für Kirmessen ohne öffentliche Wartezeitdaten sind Wartezeit-Alarme deaktiviert.",
      disclaimer:"Unabhängige Fan-Übersicht zur Bocholter Kirmes 2026. Kein offizielles Angebot der Stadt Bocholt. Lageplan und Hintergrund: Stadtmarketing Bocholt. Aktueller NÄHEN-Stand: Invader ersetzt Devil Rock."
    },
    rides,
    worlds,
    fonts,
    aliases,
    rideConfig,
    exclusions:{ids:[],namePatterns:["devil rock"]}
  };
})();
