(() => {
  "use strict";
  const source = "https://regionalupdate.de/2026/10/08/salzbergen-herbstkirmes-2026-programm-verkehr/";
  const rawRides = [
    {id:"intoxx",name:"Intoxx",operator:"Benning",operatorFull:"Benning (Theine)",new2026:false,type:"Kamikaze III",manufacturer:"Fabbri (I)",year:2003,dimensions:"18,5 × 5 × max. 22 m",capacity:"16 Personen",rideIndexUrl:"https://ride-index.de/2009/09/02/intoxx/",imageUrl:"https://www.ummet-eck.de/Bilder/poi/1024/intoxx-benning.jpg",imageCredit:"Ummet-Eck",imageSourceUrl:"https://www.ummet-eck.de/regionen/101125-Intoxx-Benning-/",description:"Zwei Gondelträger überschlagen sich um eine gemeinsame Achse – der Fabbri-Klassiker von Benning."},
    {id:"hip-hop-dancer",name:"Hip Hop Dancer",operator:"Westenberg und Reinhardt",operatorFull:"Westenberg / Reinhardt",new2026:false,type:"Scheibenwischer",year:2018,capacity:"18 Personen",imageUrl:"",imageCredit:"",imageSourceUrl:"https://www.ummet-eck.de/regionen/103094-HipHop-Dancer-Westenberg-Reinhardt-/",description:"2018 gebauter Scheibenwischer: Die Sitzreihe hebt abwechselnd die Seiten an und schwingt dynamisch hin und her."},
    {id:"musik-express",name:"Musik Express",operator:"Ahrend/Noack",operatorFull:"Ahrend / Noack",new2026:false,type:"Musik-Express / Berg- und Talbahn",imageUrl:"",imageCredit:"",imageSourceUrl:"https://www.ummet-eck.de/regionen/103021-Musikexpress-Noack-Ahrend-/",description:"Traditioneller Musik-Express mit Berg-und-Tal-Bewegung, schneller Rundfahrt und klassischem Rekommandieren."},
    {id:"break-dance",name:"Break Dance",operator:"Welte",operatorFull:"Fredi Welte (Bramsche)",new2026:false,type:"Break Dance 1 (Nr. 50)",manufacturer:"HUSS (D)",year:1994,dimensions:"Ø 20 m",capacity:"32 Personen · 16 Gondeln",rideIndexUrl:"https://ride-index.de/2019/02/02/break-dance-welte-2/",imageUrl:"https://www.ummet-eck.de/Bilder/fotosets/1024/3-breakdance-no1-welte-menden22-c-UMM-chr-schoen.jpg",imageCredit:"Ummet-Eck · Christian Schön",imageSourceUrl:"https://www.ummet-eck.de/bildgalerien/251-Break-Dance-No-1-Welte-Fahrgeschaeft-auf-der-Kirmes-bild-4352/",description:"Fredi Weltes HUSS Break Dance No. 1 aus dem Jahr 1994: vier Gondelkreuze, 16 Zweiergondeln und freie Rotation."},
    {id:"hangover-the-ride",name:"Hangover The Ride",operator:"Richter",operatorFull:"Kevin Richter (Leipzig)",new2026:true,type:"G-Force 16",manufacturer:"AK Rides",year:2026,capacity:"16 Personen · 8 Doppelsitze",imageUrl:"",imageCredit:"",imageSourceUrl:"https://www.ummet-eck.de/regionen/103576-Hangover-The-Ride-Richter-/",description:"Neuheit von Kevin Richter: Eine rotierende Scheibe mit acht Doppelsitzen neigt sich während der Fahrt fast in die Vertikale. Nicht mit Hangover – The Tower verwechseln."}
  ];
  const rides = rawRides.map(ride => Object.assign({},ride,{id:"salzbergen26-"+ride.id,zone:"Herbstkirmes Salzbergen 2026",priceEuro:null,sourceUrl:source}));
  const worlds = {};
  const fonts = {};
  const aliases = {};
  const rideConfig = {};
  rides.forEach((ride,index)=>{
    worlds[ride.id]={label:(ride.name+" · "+ride.operator).toUpperCase(),line:ride.description,artUrl:ride.imageUrl||"",imageCredit:ride.imageCredit||"",imageSourceUrl:ride.imageSourceUrl||source};
    fonts[ride.id]={fontFamily:["'Bebas Neue', sans-serif","'Bangers', cursive","'Rye', serif","'Staatliches', sans-serif","'Orbitron', sans-serif"][index],theme:"fair-salzbergen-"+index};
    aliases[ride.name.toLowerCase()]=ride.id;
    rideConfig[ride.id]={singleRider:false};
  });
  window.NAEHEN_SALZBERGEN_HERBSTKIRMES_2026={
    park:{
      slug:"salzbergen-herbstkirmes-2026",
      kind:"fair",
      name:"Herbstkirmes Salzbergen 2026",
      location:"Salzbergen · 10.–12.10.2026",
      startDate:"2026-10-10",
      endDate:"2026-10-12",
      officialUrl:"https://www.salzbergen.de/",
      dateSourceUrl:source,
      liveDataUrl:null,liveWaits:false,supportsPostedWait:false,
      sortMode:"configured",
      receiptTitle:"HERBSTKIRMES SALZBERGEN 2026",receiptLocation:"SALZBERGEN",
      cardCopy:"10.–12. Oktober · fünf Fahrgeschäfte, darunter die Neuheit Hangover The Ride.",
      noLiveLabel:"KIRMES · KEINE LIVE-WARTEZEITEN",
      noLiveMessage:"Keine öffentlichen Live-Wartezeiten. NÄHEN misst deine persönliche Queue.",
      noLiveAlarmMessage:"Wartezeit-Alarme sind hier deaktiviert.",
      disclaimer:"Unabhängige Fan-Übersicht zur Herbstkirmes Salzbergen 2026. Beschickung nach Nutzervorgabe; keine offizielle Seite der Gemeinde. Technikdaten: Ride-Index und Ummet-Eck."
    },
    rides,worlds,fonts,aliases,rideConfig,exclusions:{ids:[],namePatterns:[]}
  };
})();