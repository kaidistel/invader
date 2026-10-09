(() => {
  "use strict";
  const source = "https://wirin.de/lokal-nachrichten/69-niedersachsen/35500-salzbergener-herbstkirmes-2026";
  const rawRides = [
    {id:"intoxx",name:"Intoxx",operator:"Benning",type:"Fabbri Kamikaze III / Überkopfgeschäft",manufacturer:"Fabbri (I)",year:2003,imageUrl:"https://www.ummet-eck.de/Bilder/poi/1024/intoxx-benning.jpg",imageCredit:"Ummet-Eck",imageSourceUrl:"https://www.ummet-eck.de/regionen/101125-Intoxx-Benning-/",description:"Überkopf-Fahrgeschäft mit frei hängenden Beinen und spektakulären Showeffekten."},
    {id:"hip-hop-dancer",name:"Hip Hop Dancer",operator:"Westenberg und Reinhardt",type:"Scheibenwischer",imageUrl:"",description:"Der Scheibenwischer schwingt seine Sitzreihe kraftvoll hin und her."},
    {id:"musik-express",name:"Musik Express",operator:"Ahrend/Noack",type:"Musikexpress / Berg- und Talbahn",imageUrl:"",imageSourceUrl:"https://www.ummet-eck.de/bildgalerien/73-Musikexpress-Ahrend-Noack-Fahrgeschaeft-auf-der-Kirmes-bild-4486/",description:"Klassische Berg-und-Tal-Rundfahrt mit Musik und Show."},
    {id:"break-dance",name:"Break Dance",operator:"Welte",type:"HUSS Break Dance No. 1",manufacturer:"HUSS (D)",year:1993,imageUrl:"https://commons.wikimedia.org/wiki/Special:Redirect/file/20240922%20092450%20Break%20Dance%2001.jpg?width=1400",imageCredit:"Wikimedia Commons",imageSourceUrl:"https://commons.wikimedia.org/wiki/Category:Break_Dance_(Welte)",description:"16 Gondeln auf vier Gondelkreuzen – Break-Dance-Klassiker von Welte."},
    {id:"hangover-the-ride",name:"Hangover The Ride",operator:"Richter",type:"Fahrgeschäft",imageUrl:"",description:"2026 erstmals auf der Salzbergener Herbstkirmes vertreten."}
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
      liveDataUrl:null,liveWaits:false,supportsPostedWait:false,
      sortMode:"configured",
      receiptTitle:"HERBSTKIRMES SALZBERGEN 2026",receiptLocation:"SALZBERGEN",
      cardCopy:"Fünf ausgewählte Fahrgeschäfte · drei Tage Kirmes im Salzbergener Ortskern.",
      noLiveLabel:"KIRMES · KEINE LIVE-WARTEZEITEN",
      noLiveMessage:"Keine öffentlichen Live-Wartezeiten. NÄHEN misst deine persönliche Queue.",
      noLiveAlarmMessage:"Wartezeit-Alarme sind hier deaktiviert.",
      disclaimer:"Unabhängige Fan-Übersicht zur Herbstkirmes Salzbergen 2026. Beschickung nach Nutzervorgabe; kein offizielles Veranstalterangebot."
    },
    rides,worlds,fonts,aliases,rideConfig,exclusions:{ids:[],namePatterns:[]}
  };
})();