(() => {
  "use strict";

  const rides = [
    ["mythos","Mythos","Högerle",true],
    ["eyecatcher","Eyecatcher","Kipp",true],
    ["punk-flasher","Punk Flasher","Glöss",true],
    ["shock-wave","Shock Wave","Hortz",true],
    ["avenger","Avenger","Kirschbaum",true],
    ["big-bamboo","Big Bamboo","Hempen",true],
    ["sound-wave","Sound Wave","Schwerin",true],
    ["tiki-taki","Tiki Taki","Paulsen",true],
    ["number-1","Number 1","Isken",false],
    ["hangover-the-tower","Hangover The Tower","Schneider",false],
    ["heidi-the-coaster","Heidi the Coaster","Schneider",false],
    ["look-360","Look 360°","Schneider",false],
    ["the-beast","The Beast","Ahrend",false],
    ["nessy","Nessy","Markmann",false],
    ["hexentanz","Hexentanz","Markmann",false],
    ["big-monster","Big Monster","Krameyer",false],
    ["intoxx","Intoxx","Benning",false],
    ["jules-verne-tower","Jules Verne Tower","Götzke",false],
    ["shake-and-roll","Shake & Roll","Schäfer",false],
    ["musik-express","Musik Express","Schneider/Krause",false],
    ["aqua-velis","Aqua Velis",null,false],
    ["wellenflieger","Wellenflieger","Wendler",false],
    ["highway-no-1","Highway No. 1","Schneider",false],
    ["fahrt-zur-hoelle","Fahrt zur Hölle","Fellerhoff",false]
  ].map(([id,name,operator,new2026]) => ({
    id:"soest26-"+id,
    name,
    zone:"Allerheiligenkirmes 2026",
    operator,
    new2026
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
    "aqua-velis":{label:"AQUA VELIS",line:"Wasser, Licht und eine maritime Note zwischen den Soester Kirmesplätzen."},
    "wellenflieger":{label:"WELLENFLIEGER · WENDLER",line:"Über den Köpfen schweben und dabei die Altstadtlichter unter sich sehen."},
    "highway-no-1":{label:"HIGHWAY NO. 1 · SCHNEIDER",line:"Straßen-, Neon- und Highway-Flair mitten auf der Allerheiligenkirmes."},
    "fahrt-zur-hoelle":{label:"FAHRT ZUR HÖLLE · FELLERHOFF",line:"Dunkelfahrt, Höllenfeuer und Geisterbahnklassik für die Soester Nacht."}
  };

  const rawFonts = {
    "mythos":{fontFamily:"'Cinzel Decorative', serif",theme:"fair-mythos"},
    "eyecatcher":{fontFamily:"'Orbitron', sans-serif",theme:"fair-eyecatcher"},
    "punk-flasher":{fontFamily:"'Bangers', cursive",theme:"fair-punk"},
    "shock-wave":{fontFamily:"'Staatliches', sans-serif",theme:"fair-shock"},
    "avenger":{fontFamily:"'Graduate', serif",theme:"fair-avenger"},
    "big-bamboo":{fontFamily:"'Bangers', cursive",theme:"fair-bamboo"},
    "sound-wave":{fontFamily:"'Orbitron', sans-serif",theme:"fair-sound"},
    "tiki-taki":{fontFamily:"'Bangers', cursive",theme:"fair-tiki"},
    "number-1":{fontFamily:"'Bebas Neue', sans-serif",theme:"fair-number1"},
    "hangover-the-tower":{fontFamily:"'Stardos Stencil', serif",theme:"fair-hangover"},
    "heidi-the-coaster":{fontFamily:"'Bangers', cursive",theme:"fair-heidi"},
    "look-360":{fontFamily:"'Graduate', serif",theme:"fair-look360"},
    "the-beast":{fontFamily:"'Staatliches', sans-serif",theme:"fair-beast"},
    "nessy":{fontFamily:"'Cinzel Decorative', serif",theme:"fair-nessy"},
    "hexentanz":{fontFamily:"'Old London', serif",theme:"fair-hexentanz"},
    "big-monster":{fontFamily:"'Bangers', cursive",theme:"fair-monster"},
    "intoxx":{fontFamily:"'Orbitron', sans-serif",theme:"fair-intoxx"},
    "jules-verne-tower":{fontFamily:"'Steampunk Machinery', serif",theme:"fair-jules-verne"},
    "shake-and-roll":{fontFamily:"'Bangers', cursive",theme:"fair-shake"},
    "musik-express":{fontFamily:"'Bebas Neue', sans-serif",theme:"fair-musikexpress"},
    "aqua-velis":{fontFamily:"'Cinzel Decorative', serif",theme:"fair-aqua"},
    "wellenflieger":{fontFamily:"'Graduate', serif",theme:"fair-wellenflieger"},
    "highway-no-1":{fontFamily:"'Bebas Neue', sans-serif",theme:"fair-highway"},
    "fahrt-zur-hoelle":{fontFamily:"'Old London', serif",theme:"fair-hoelle"}
  };

  const prefix = (id) => "soest26-" + id;
  const worlds = Object.fromEntries(Object.entries(rawWorlds).map(([id,value]) => [prefix(id),value]));
  const fonts = Object.fromEntries(Object.entries(rawFonts).map(([id,value]) => [prefix(id),value]));
  const aliases = {};
  rides.forEach((ride) => { aliases[ride.name.toLowerCase()] = ride.id; });

  const rideConfig = {};
  rides.forEach((ride) => { rideConfig[ride.id] = {singleRider:false}; });

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
      cardImage:null,
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