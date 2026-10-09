(() => {
 "use strict";
 const dateSource="https://www.stadt-muenster.de/send";
 const lineupSource="https://www.kirmesforum.de/threads/m%C3%BCnster-herbstsend-24-10-01-11-2026.78036/";
 const rawRides=[
  {
    "id": "mayday",
    "name": "Mayday",
    "operator": "Meyer / Horlbeck",
    "operatorFull": "Meyer / Horlbeck",
    "type": "Pegasus 16",
    "year": 2026,
    "new2026": true,
    "description": "Flugthemen-Neuheit mit beweglichen Gondeln und großflächiger Lichtshow.",
    "imageUrl": "https://i.ytimg.com/vi/Yby3vjj4Fv8/maxresdefault.jpg",
    "imageCredit": "Offride-Video Mayday · Onride.de eingebettetes Video (2026)",
    "imageSourceUrl": "https://www.youtube.com/watch?v=Yby3vjj4Fv8",
    "manufacturer": "Technical Park",
    "capacity": "16 Personen",
    "rideIndexUrl": "https://ride-index.de/2026/07/05/mayday/"
  },
  {
    "id": "airborne",
    "name": "Airborne",
    "operator": "Ordelman",
    "operatorFull": "Willy Ordelman (NL)",
    "type": "Speed 32",
    "new2026": false,
    "description": "Airborne von Ordelman: Hochfahrgeschäft mit markanter LED-Inszenierung.",
    "imageUrl": "https://www.ummet-eck.de/Bilder/fotosets/1024/airborne-sommersend23-c-UMM-s-schoen-3.jpg",
    "imageCredit": "Ummet-Eck · Silke Schön",
    "imageSourceUrl": "https://www.kirmesforum.de/threads/m%C3%BCnster-herbstsend-24-10-01-11-2026.78036/",
    "manufacturer": "KMG",
    "year": 2020,
    "height": "65 m",
    "capacity": "32 Personen",
    "rideIndexUrl": "https://ride-index.de/2021/11/03/airborne-nl/"
  },
  {
    "id": "kanurah",
    "name": "Kanurah",
    "operator": "Vallentgoed",
    "operatorFull": "Louis Vallentgoed (NL)",
    "type": "Jet Fighter",
    "manufacturer": "Technical Park",
    "year": 2026,
    "new2026": true,
    "height": "26 m",
    "capacity": "20 Personen",
    "description": "Technical Park Jet Fighter mit zwei frei beweglichen Gondeln und bis zu 26 Metern Höhe.",
    "imageUrl": "https://funfactorevents.nl/.cm4all/mediadb/Banners/Attracties/Kanurah/Kermisattractie-Kanurah-huren-Fun-Factor-Events.png",
    "imageCredit": "Fun Factor Events · 2026 Konzeptillustration (kein Foto)",
    "imageSourceUrl": "https://funfair-entertainment.de/news/rheiner-herbstkirmes-2026-nordic-tower-hangover-wilde-maus-beschickung"
  },
  {
    "id": "break-dance-bruch",
    "name": "Break Dance",
    "operator": "Bruch",
    "operatorFull": "Bruch (Düsseldorf)",
    "type": "Break Dance No. 1",
    "manufacturer": "HUSS",
    "year": 1990,
    "capacity": "32 Personen / 16 Gondeln",
    "new2026": false,
    "description": "HUSS Break Dance No. 1 der Familie Bruch, Baujahr 1990 – vier Kreuze und frei rotierende Zweiergondeln.",
    "imageUrl": "https://kuestenkirmes.de/wp-content/uploads/Break-Dance-Bruch.jpg",
    "imageCredit": "Küstenkirmes · Stefan Rathmann (Bruch, Originalaufnahme)",
    "imageSourceUrl": "https://kuestenkirmes.de/break-dance-bruch/",
    "rideIndexUrl": "https://ride-index.de/2005/01/04/break-dance-bruch/"
  },
  {
    "id": "disco-jet",
    "name": "Disco Jet",
    "operator": "Heitmann",
    "operatorFull": "Arno Heitmann (Münster)",
    "type": "Musik-Express / Berg- und Talbahn",
    "manufacturer": "Bertazzon",
    "year": 2021,
    "dimensions": "19 × 17 × 10 m",
    "new2026": false,
    "description": "Der neue Disco Jet von Arno Heitmann (2021): Musik-Express mit computergesteuerten Disco-Lichtern, Nebel und moderner LED-Show.",
    "imageUrl": "https://www.radioherne.de/externalimages/?crop=0x138x1920x864&dt=202308030804460&resize=1920x864&source=jpg552%2Fpm-cranger-kirmes-2023---disco-jet--stadtmarketing-herne.jpg",
    "imageCredit": "Stadtmarketing Herne / Radio Herne",
    "imageSourceUrl": "https://www.radioherne.de/artikel/neuer-disco-jet-gewinnt-crange-preis-1725174"
  }
];
 const rides=rawRides.map(ride=>({...ride,id:"muenster-herbstsend26-"+ride.id,zone:"Schlossplatz",priceEuro:null,sourceUrl:ride.imageSourceUrl||lineupSource}));
 const worlds={},fonts={},aliases={},rideConfig={};
 const typefaces=["'Bebas Neue',sans-serif","'Orbitron',sans-serif","'Bungee Shade','Bungee',sans-serif","'Bangers',cursive","'Monoton',sans-serif"];
 rides.forEach((ride,i)=>{
  worlds[ride.id]={label:(ride.name+" · "+ride.operator).toUpperCase(),line:ride.description,artUrl:ride.imageUrl||"",imageCredit:ride.imageCredit||"",imageSourceUrl:ride.imageSourceUrl||lineupSource};
  fonts[ride.id]={fontFamily:typefaces[i],theme:"herbstsend26-"+ride.id};
  aliases[ride.name.toLowerCase()]=ride.id;
  rideConfig[ride.id]={singleRider:false};
 });
 window.NAEHEN_MUENSTER_HERBSTSEND_2026={
  park:{slug:"muenster-herbstsend-2026",kind:"fair",name:"Münsteraner Herbstsend 2026",
  location:"Münster · Schlossplatz · 24.10.–01.11.2026",
  startDate:"2026-10-24",endDate:"2026-11-01",officialUrl:dateSource,dateSourceUrl:dateSource,lineupSourceUrl:lineupSource,
  liveDataUrl:null,liveWaits:false,supportsPostedWait:false,sortMode:"configured",
  receiptTitle:"HERBSTSEND MÜNSTER 2026",receiptLocation:"MÜNSTER",
  cardImage:"https://www.24rhein.de/assets/images/27/340/27340014-der-send-in-muenster-mit-besucherinnen-und-besuchern-und-den-fahrgeschaeften-3oe9.jpg",
  cardImageCredit:"24RHEIN · Archivfoto Send Münster (2021)",
  cardImageSourceUrl:"https://www.24rhein.de/rheinland-nrw/send-kirmes-muenster-2021-oeffnungszeiten-attraktionen-corona-regeln-familientag-studentenabend-91056542.html",
  cardCopy:"24. Oktober – 1. November · Schlossplatz · 5 bisher bekannte Fahrgeschäfte",
  noLiveLabel:"KIRMES · KEINE LIVE-WARTEZEITEN",
  noLiveMessage:"Keine öffentlichen Live-Wartezeiten. NÄHEN misst deine persönliche Queue.",
  noLiveAlarmMessage:"Wartezeit-Alarme sind hier deaktiviert.",
  disclaimer:"Unabhängige Fan-Übersicht. Derzeit fünf benannte Fahrgeschäfte nach Nutzervorgabe, keine vollständige Schlussbeschickung. Weitere Geschäfte können folgen. Kein offizielles Angebot der Stadt Münster."},
  rides,worlds,fonts,aliases,rideConfig,exclusions:{ids:[],namePatterns:[]}
 };
})();