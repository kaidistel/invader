(() => {
  "use strict";
  // NÄHEN Rathauskirmes Meppen 2026 · Nutzer-Beschickung · OHNE LAGEPLAN.
  const dateSource="https://www.wim-meppen.de/portal/seiten/rathauskirmes-16-19-10-2026-900000393-24701.html";
  const lineupSource="Nutzerangabe vom 12.10.2026";
  const rawRides=[
  {
    "id": "speed-drive-xxl",
    "name": "AS Speed Drive XXL",
    "operator": "Braun",
    "operatorFull": "Fritz Braun",
    "zone": "Autoscooter",
    "type": "Autoscooter",
    "manufacturer": "Adesko",
    "year": 2024,
    "rideIndexUrl": "https://ride-index.de/2024/05/04/as-braun-f-2-2/",
    "imageUrl": "https://ride-index.de/wp-content/uploads/2024/05/Braun-Speed-Drive-XXL-2026-R.jpg",
    "imageCredit": "Ride-Index · Speed Drive XXL (Braun)",
    "imageSourceUrl": "https://ride-index.de/2024/05/04/as-braun-f-2-2/",
    "description": "Brauns moderner XXL-Autoscooter mit großer Fahrfläche und LED-Inszenierung."
  },
  {
    "id": "musik-express",
    "name": "Musik Express",
    "operator": "Ahrend/Noack",
    "operatorFull": "Mike Erwin Ahrend / Elisabeth Noack",
    "zone": "Kirmesklassiker",
    "type": "Musik-Express / Berg- und Talbahn",
    "manufacturer": "Mack",
    "year": 1976,
    "dimensions": "18 × 17 m",
    "capacity": "60 Personen · 20 Gondeln",
    "rideIndexUrl": "https://ride-index.de/2005/08/07/musik-express-noack-ahrend/",
    "imageUrl": "https://www.ummet-eck.de/Bilder/fotosets/1024/8-musikexpress-noack-mhagen22-c-UMM-chr-schoen.jpg",
    "imageCredit": "Ummet-Eck · Christian Schön",
    "imageSourceUrl": "https://www.ummet-eck.de/bildgalerien/73-Musikexpress-Ahrend-Noack-Fahrgeschaeft-auf-der-Kirmes-bild-4485/",
    "description": "Musik Express von Mike Erwin Ahrend und Elisabeth Noack: klassische Berg-und-Tal-Fahrt mit Musik, Lichtshow und Rekommandieren."
  },
  {
    "id": "extrem",
    "name": "Extrem",
    "operator": "Karabeg",
    "operatorFull": "Melvin Karabeg",
    "zone": "Thrill",
    "type": "KMG Speed",
    "manufacturer": "KMG",
    "year": 2005,
    "height": "36 m",
    "capacity": "8 Personen",
    "rideIndexUrl": "https://ride-index.de/2007/01/22/extrem-agtsch/",
    "imageUrl": "https://www.ummet-eck.de/Bilder/fotosets/1024/2-extrem-remscheid23-c-UMM-c-schoen.jpg",
    "imageCredit": "Ummet-Eck · Christian Schön · Extrem (Karabeg), Remscheid 2023",
    "imageSourceUrl": "https://www.ummet-eck.de/bildgalerien/236-Extrem-Deinert-Karabeg-Fahrgeschaeft-Kirmes-bild-6217/",
    "dimensions": "16 × 6 × max. 36 m",
    "description": "Zwei Vierer-Gondeln kreisen am großen Propellerarm und fahren kopfüber über den Kirmesplatz."
  },
  {
    "id": "projekt-1",
    "name": "Projekt 1",
    "operator": "Freiwald",
    "operatorFull": "Dennis Freiwald",
    "zone": "Thrill",
    "type": "KMG Afterburner",
    "manufacturer": "KMG",
    "year": 2000,
    "height": "23 m",
    "capacity": "24 Personen",
    "rideIndexUrl": "https://ride-index.de/2005/01/13/projekt-1/",
    "imageUrl": "https://cdn.coaster.cloud/attractions/Ds/R6/DsR6m6KtjoVQANo6JFJwES.jpg?class=large",
    "imageCredit": "coaster.cloud · Projekt 1 (Freiwald), Foto Kirmesfan2002 (2025)",
    "imageSourceUrl": "https://coaster.cloud/en/attractions/d68542e2-projekt-1",
    "description": "Freiwalds KMG Afterburner schwingt seine 24 Plätze in die Höhe und dreht die Gondel mit."
  },
  {
    "id": "super-dance",
    "name": "Super Dance",
    "operator": "Braun",
    "operatorFull": "Fritz Braun",
    "zone": "Familienfahrgeschäft",
    "type": "Kilian Scheibenwischer",
    "manufacturer": "Kilian",
    "year": 2016,
    "capacity": "18 Personen",
    "rideIndexUrl": "https://ride-index.de/2016/05/28/superdance/",
    "imageUrl": "https://ride-index.de/wp-content/uploads/2016/05/Braun-SuperDance-2023-L.jpg",
    "imageCredit": "Ride-Index · Super Dance (Braun)",
    "imageSourceUrl": "https://ride-index.de/2016/05/28/superdance/",
    "description": "Brauns farbenfroher Scheibenwischer schwingt die Sitzreihe zu Musik nach links und rechts."
  },
  {
    "id": "crazy-machine",
    "name": "Crazy Machine",
    "operator": "Ahrend",
    "operatorFull": "Walter Oliver Ahrend",
    "zone": "Familienfahrgeschäft",
    "type": "Hurricane",
    "manufacturer": "Park Rides Lamborghini",
    "year": 2020,
    "capacity": "24 Personen",
    "rideIndexUrl": "https://ride-index.de/2021/06/08/hurricane-nl/",
    "imageUrl": "https://www.come-on.de/assets/images/42/690/42690010-neu-mit-dabei-die-crazy-machine-sorgt-fuer-adrenalin-und-jede-menge-spass-bei-den-fahrgaesten-P0BG.jpg",
    "imageCredit": "come-on.de · Crazy Machine (Ahrend)",
    "imageSourceUrl": "https://www.come-on.de/volmetal/meinerzhagen/meinerzhagen-feiert-kirmes-geisterhotel-nach-zehn-jahren-zurueck-94319306.html",
    "description": "Interaktiver Hurricane mit sechs drehbaren Gondeln und markanter Crazy-Machine-Fassade."
  }
];
  const rides=rawRides.map(r=>({...r,id:"meppen-herbst26-"+r.id,priceEuro:null,new2026:false,sourceUrl:r.rideIndexUrl||dateSource}));
  const worlds={},fonts={},aliases={},rideConfig={};
  const typefaces=["'Audiowide',sans-serif","'Monoton',sans-serif","'Black Ops One',sans-serif","'Bungee Shade',sans-serif","'Faster One',sans-serif","'Rubik Glitch',sans-serif"];
  rides.forEach((r,i)=>{
    worlds[r.id]={label:(r.name+" · "+r.operator).toUpperCase(),line:r.description,artUrl:r.imageUrl||"",imageCredit:r.imageCredit||"",imageSourceUrl:r.imageSourceUrl||r.rideIndexUrl||""};
    fonts[r.id]={fontFamily:typefaces[i],theme:"meppen26-"+rawRides[i].id};
    aliases[r.name.toLowerCase()]=r.id;
    rideConfig[r.id]={singleRider:false};
  });
  window.NAEHEN_MEPPEN_HERBSTKIRMES_2026={
    park:{slug:"meppen-herbstkirmes-2026",kind:"fair",name:"Meppener Rathauskirmes 2026",location:"Meppen · Innenstadt · 16.–19.10.2026",startDate:"2026-10-16",endDate:"2026-10-19",officialUrl:dateSource,dateSourceUrl:dateSource,lineupSourceUrl:lineupSource,liveDataUrl:null,liveWaits:false,supportsPostedWait:false,sortMode:"configured",fairZones:["Autoscooter","Kirmesklassiker","Thrill","Familienfahrgeschäft"],receiptTitle:"RATHAUSKIRMES MEPPEN 2026",receiptLocation:"MEPPEN · INNENSTADT",cardImage:"https://www.der-meppener.de/files/cache/images/5/d/df2bcce2b64d1c2cc2348d515d8f67.jpg",cardImageCredit:"Der Meppener · Kirmesabend in Meppens Innenstadt (Archivmotiv)",cardImageSourceUrl:"https://www.der-meppener.de/unsere-stadt",cardCopy:"16.–19. Oktober · 6 Fahrgeschäfte · Feuerwerk Freitag · Familientag Montag",noLiveLabel:"RATHAUSKIRMES · KEINE LIVE-WARTEZEITEN",noLiveMessage:"Keine öffentlichen Live-Wartezeiten. NÄHEN misst deine persönliche Queue.",noLiveAlarmMessage:"Keine öffentlichen Wartezeit-Alarme verfügbar.",disclaimer:"Unabhängiger Fan-Begleiter, keine offizielle Anwendung der Stadt Meppen. Die sechs Fahrgeschäfte stammen aus Nutzerangaben; Termine und Rahmenprogramm von WiM Meppen. Kein Lageplan. Fahrpreise werden ausschließlich pro Fahrt manuell erfasst. Der Musikexpress ist die Mack-Anlage von Noack-Ahrend (Lemgo), verifiziert über Ride-Index."},
    rides,worlds,fonts,aliases,rideConfig,exclusions:{ids:[],namePatterns:[]}
  };
})();
