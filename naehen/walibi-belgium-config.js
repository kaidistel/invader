(() => {
  "use strict";

  const B = "https://www.walibi.be/nl/ontdek-het-park/";
  const P = {
    thrill: B + "sensatie-attracties/",
    family: B + "familie-attracties/",
    kids: B + "kinderattracties/"
  };

  const IMG = {
    tousEnBoite:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--99c11948-8b7b-46f8-8256-fa51dc2f2898/tous-en-boite2.jpg?preferwebp=true&width=1280",
    stormy:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--ad47fef7-41d9-455b-92ad-2cd99312683d/stormy.jpg?preferwebp=true&width=1280",
    turbine:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--47cb6708-b135-432e-831c-9a80a257d6b4/turbine-dockworld-2025.jpg?preferwebp=true&width=1280",
    cinema4d:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--7d140245-8479-47da-b2fa-6851e2ca55dc/wanted-alive-title.jpg?preferwebp=true&width=1280",
    silverton:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--eff372b4-df83-413d-b5cb-0d0c37f023b1/14-silverton.jpg?preferwebp=true&width=1280",
    adventure4x4:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--c3df3679-4b9b-44ec-8bab-66f5c5abe7aa/31-4x4-adventure.jpg?preferwebp=true&width=1280",
    funRecorder:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--acd51f73-9f55-423a-b070-5210e528c578/fun-recorder.jpg?preferwebp=true&width=1280",
    graffitiShuttle:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--78247fc7-e42d-47c3-b89b-70a448836938/graffiti-shuttle-1280x800px-02.jpg?preferwebp=true&width=1280",
    bubbleSwirl:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--93265f37-73d1-4e89-9e32-910d0bb4ef20/34-bubble-swirl.jpg?preferwebp=true&width=1280",
    miniTour:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--36ee1689-97e9-4bc3-9ded-3a7b3b5c925d/37-mini-tour.jpg?preferwebp=true&width=1280",
    kondaala:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--1c724d0d-913e-4e68-a154-de6227d7feb0/22-kondaala.jpg?preferwebp=true&width=1280",
    littleSwing:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--82dfe6d0-84f7-40f0-b346-42ef91755345/little-swing.jpg?preferwebp=true&width=1280",
    guitarRiff:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--63136b7b-cf3d-43f4-a7e3-a79644068e22/guitar-riff2.jpg?preferwebp=true&width=1280",
    funPilot:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--296fae3e-41c6-4f95-9ad3-e25ffb29a91d/38-fun-pilot2.jpg?preferwebp=true&width=1280",
    palais:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--f94ad608-c45f-42ef-a4d5-d80d3c8b77e3/palais-de-g-nie.jpg?preferwebp=true&width=1280",
    flashBack:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--b50be301-08eb-4092-9329-06be886eb5df/29-flash-back.jpg?preferwebp=true&width=1280",
    grandCarrousel:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--e9a78a84-79e1-4686-94ea-d92e6e1a5d3a/grand-carroussel.jpg?preferwebp=true&width=1280",
    tutankhamon:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--1034ada9-88ea-4f60-b735-fd5f1558d1b9/25-cot.jpg?preferwebp=true&width=1280",
    treeHouse:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--a7095a81-90f3-47db-97e9-2003f5ce7e00/32-tree-house.jpg?preferwebp=true&width=1280",
    calamityMine:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--7275c416-d78c-4cea-a1e3-936be059b2b8/17-calamity-mine2.jpg?preferwebp=true&width=1280",
    poneys:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--b5ff7190-5693-401c-b720-a7933423b79b/poneys.jpg?preferwebp=true&width=1280",
    mecalodon:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--f8e4bc6c-ea62-4579-a9b2-1d9d1f1db8cc/mecalodon-kv--2025-1920x1080px.jpg?preferwebp=true&width=1280",
    tapisVolant:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--5834a9d2-e53f-487b-97aa-8da324b68fb4/tapis-volant.jpg?preferwebp=true&width=1280",
    popcorn:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--f4a01027-87f4-40d4-b1d6-4d6b4368e87c/popcorn-revenge.jpg?preferwebp=true&width=1280",
    radjaRiver:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--b289e603-3f19-49fd-a560-c1352afe69fa/40-radja-river.jpg?preferwebp=true&width=1280",
    melodyRoad:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--401f50a6-8223-4387-844f-d4b26e17f1de/3-melody-road.jpg?preferwebp=true&width=1280",
    tikiWaka:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--4bd472f7-8be2-4f83-b8fb-9f3d6f69e926/26-tiki-waka.jpg?preferwebp=true&width=1280",
    octopus:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--b12a42da-3427-47d5-b9aa-3615dafceb35/21-octopus.jpg?preferwebp=true&width=1280",
    waveSwinger:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--29cea618-cc1e-4e8d-ad8e-d14239f77779/4-wave-swinger.jpg?preferwebp=true&width=1280",
    tikiTrail:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--b4326ed4-efc5-4180-9cca-9c147ca10cd1/20-tiki-trail2.jpg?preferwebp=true&width=1280",
    pulsar:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--40d02a3a-93d9-417d-a7cf-cbe75cc431c0/8-pulsar.jpg?preferwebp=true&width=1280",
    vampire:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--2df5b61c-fb20-4573-8337-d33d49afcda8/1-vampire.jpg?preferwebp=true&width=1280",
    buzzsaw:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--4cc5067b-eefa-4f44-8b93-908cc810001e/buzzsaw1.jpg?preferwebp=true&width=1280",
    kondaa:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--27c16662-1c91-49f5-871e-01c3be10f00e/wbe-visuel-attractions-kondaa-facing-1920x1080px.jpg?preferwebp=true&width=1280",
    cobra:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--6c14cb87-4449-41a5-b7db-3b5fec900b25/43-cobra2.jpg?preferwebp=true&width=1280",
    dalton:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--b5115dd6-f79a-48fc-b3fa-1721ddec0777/16-dalton-terror.jpg?preferwebp=true&width=1280",
    spinningVibe:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--738eaaad-9ae5-4be4-862a-beb88c38255b/7-spinning-vibe.jpg?preferwebp=true&width=1280",
    kidsAirlines:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--14687794-664d-4d7d-9a4c-23b60397562d/kids-airline-2.jpg?preferwebp=true&width=1280",
    tchou:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--62cd3b43-db12-4412-a5fe-361f8d57a015/tchou-tchou-express2.jpg?preferwebp=true&width=1280",
    spinningTaxi:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--3cc100fc-9128-43be-905d-7bec025a2b9b/spinning-taxi.jpg?preferwebp=true&width=1280",
    loup:"https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--3a6eef87-0573-45bf-8459-1b64089e02aa/5-loup-garou.jpg?preferwebp=true&width=1280"
  };

  const rides = [
    ["tous-en-boite","Tous en Boite","Dock World"],["stormy","Stormy","Dock World"],["turbine","Turbine","Dock World"],
    ["4d-bioscoop","4D-bioscoop","Loup-Garou Zone"],["silverton","Silverton","Loup-Garou Zone"],
    ["4x4-adventure","4x4 Adventure","Fun World"],["fun-recorder","Fun Recorder","Fun World"],["graffiti-shuttle","Graffiti Shuttle","Fun World"],
    ["bubble-swirl","Bubble Swirl","Fun World"],["mini-tour","Mini Tour","Fun World"],["kondaala","Kondaala","Exotic World"],
    ["little-swing","Little Swing","Adventure World"],["guitar-riff","Guitar Riff","Adventure World"],["fun-pilot","Fun Pilot","Fun World"],
    ["palais-du-genie","Palais du Génie","Karma World"],["flash-back","Flash-Back","Dock World"],["grand-carrousel","Grand Carrousel","Adventure World"],
    ["challenge-of-tutankhamon","Challenge of Tutankhamon","Exotic World"],["tree-house","Tree House","Fun World"],["calamity-mine","Calamity Mine","Adventure World"],
    ["poneys","Poneys","Adventure World"],["mecalodon","Mecalodon","Dock World"],["tapis-volant","Tapis Volant","Karma World"],
    ["popcorn-revenge","Popcorn Revenge","Karma World"],["radja-river","Radja River","Karma World"],["melody-road","Melody Road","Loup-Garou Zone"],
    ["tiki-waka","Tiki-Waka","Exotic World"],["octopus","Octopus","Exotic World"],["wave-swinger","Wave Swinger","Loup-Garou Zone"],
    ["tiki-trail","Tiki-Trail","Exotic World"],["pulsar","PULSAR","Dock World"],["vampire","Vampire","Loup-Garou Zone"],
    ["buzzsaw","Buzzsaw","Adventure World"],["kondaa","Kondaa","Exotic World"],["cobra","Cobra","Karma World"],
    ["dalton-terror","Dalton Terror","Adventure World"],["spinning-vibe","Spinning Vibe","Loup-Garou Zone"],
    ["kids-airlines","Kids Airlines","Adventure World"],["tchou-tchou-express","Tchou-Tchou Express","Adventure World"],
    ["spinning-taxi","Spinning Taxi","Adventure World"],["loup-garou","Loup-Garou","Loup-Garou Zone"]
  ].map(([id,name,zone]) => ({id,name,zone}));

  const worlds = {
    "tous-en-boite":{label:"DOCK WORLD · CANNERY",line:"Ab in die Konservendose – die verrückte Hafenfabrik dreht auf.",officialUrl:P.family+"tous-en-boite",artUrl:IMG.tousEnBoite},
    stormy:{label:"DOCK WORLD · LITTLE STORM",line:"Kleine Seefahrer testen ihren Mut mitten im stürmischen Hafen.",officialUrl:P.kids+"stormy",artUrl:IMG.stormy},
    turbine:{label:"DOCK WORLD · TURBINE",line:"Die legendäre Shuttle-Achterbahn schießt durch die alte Dockhalle.",officialUrl:P.thrill+"turbine",artUrl:IMG.turbine},
    "4d-bioscoop":{label:"LOUP-GAROU ZONE · CINEMA",line:"Film, Effekte und Bewegung – der Kinosaal wird selbst zur Attraktion.",officialUrl:P.family+"4d-bioscoop",artUrl:IMG.cinema4d},
    silverton:{label:"LOUP-GAROU ZONE · SILVERTON",line:"Eine klassische Fahrt durch den wilden Westen von Walibi.",officialUrl:P.family+"silverton",artUrl:IMG.silverton},
    "4x4-adventure":{label:"FUN WORLD · 4X4",line:"Kleine Offroad-Fahrer drehen ihre eigene Abenteuer-Runde.",officialUrl:P.kids+"4x4-adventure",artUrl:IMG.adventure4x4},
    "fun-recorder":{label:"FUN WORLD · RECORD",line:"Walibi-Musik, Farbe und eine Runde für die kleinsten Parkfans.",officialUrl:P.kids+"fun-recorder",artUrl:IMG.funRecorder},
    "graffiti-shuttle":{label:"FUN WORLD · GRAFFITI",line:"Bunt, urban und immer wieder hin und her.",officialUrl:P.kids+"graffiti-shuttle",artUrl:IMG.graffitiShuttle},
    "bubble-swirl":{label:"FUN WORLD · BUBBLES",line:"Bunte Gondeln wirbeln durch eine Welt voller Seifenblasen.",officialUrl:P.kids+"bubble-swirl",artUrl:IMG.bubbleSwirl},
    "mini-tour":{label:"FUN WORLD · MINI TOUR",line:"Eine gemütliche kleine Rundfahrt durch Walibis farbenfrohe Welt.",officialUrl:P.kids+"mini-tour",artUrl:IMG.miniTour},
    kondaala:{label:"EXOTIC WORLD · KONDAALA",line:"Die kleine Schwester von Kondaa schlängelt sich durch Exotic World.",officialUrl:P.kids+"kondaala",artUrl:IMG.kondaala},
    "little-swing":{label:"ADVENTURE WORLD · LITTLE SWING",line:"Kleine Abenteurer heben in der Schiffsschaukel ab.",officialUrl:P.kids+"little-swing",artUrl:IMG.littleSwing},
    "guitar-riff":{label:"ADVENTURE WORLD · GUITAR RIFF",line:"Musik an – die Gondeln drehen zur nächsten Runde auf.",officialUrl:P.kids+"guitar-riff",artUrl:IMG.guitarRiff},
    "fun-pilot":{label:"FUN WORLD · FUN PILOT",line:"Abheben, drehen und selbst zum kleinen Piloten werden.",officialUrl:P.kids+"fun-pilot",artUrl:IMG.funPilot},
    "palais-du-genie":{label:"KARMA WORLD · PALAIS",line:"Ein geheimnisvoller Palast bringt Raum und Orientierung durcheinander.",officialUrl:P.family+"palais-du-genie",artUrl:IMG.palais},
    "flash-back":{label:"DOCK WORLD · FLASH-BACK",line:"Vorwärts, rückwärts und mitten in die nächste Welle.",officialUrl:P.family+"flash-back",artUrl:IMG.flashBack},
    "grand-carrousel":{label:"ADVENTURE WORLD · CARROUSEL",line:"Klassische Karussell-Nostalgie zwischen den großen Abenteuern.",officialUrl:P.family+"grand-carrousel",artUrl:IMG.grandCarrousel},
    "challenge-of-tutankhamon":{label:"EXOTIC WORLD · TUTANKHAMON",line:"Mit Laserblastern durch das verfluchte Grab des Pharaos.",officialUrl:P.family+"challenge-of-tutankhamon",artUrl:IMG.tutankhamon},
    "tree-house":{label:"FUN WORLD · TREE HOUSE",line:"Klettern, entdecken und Walibis Baumhaus erobern.",officialUrl:P.kids+"tree-house",artUrl:IMG.treeHouse},
    "calamity-mine":{label:"ADVENTURE WORLD · GOLD MINE",line:"Der Minenzug rast durch Fels, Holz und eine staubige Westernkulisse.",officialUrl:P.family+"calamity-mine",artUrl:IMG.calamityMine},
    poneys:{label:"ADVENTURE WORLD · PONEYS",line:"Eine ruhige Runde auf dem Rücken der Walibi-Ponys.",officialUrl:P.kids+"poneys",artUrl:IMG.poneys},
    mecalodon:{label:"DOCK WORLD · MECALODON",line:"Der Hai von Dock World jagt über und entlang des Wassers.",officialUrl:P.family+"mecalodon",artUrl:IMG.mecalodon},
    "tapis-volant":{label:"KARMA WORLD · TAPIS VOLANT",line:"Auf dem fliegenden Teppich geht es hoch über Karma World.",officialUrl:P.family+"tapis-volant",artUrl:IMG.tapisVolant},
    "popcorn-revenge":{label:"KARMA WORLD · CINEMA",line:"Das Popcorn schlägt zurück – interaktives Chaos in einem verrückten Kino.",officialUrl:P.family+"popcorn-revenge",artUrl:IMG.popcorn},
    "radja-river":{label:"KARMA WORLD · RADJA RIVER",line:"Stromschnellen, Felsen und eine nasse Expedition durch den Dschungel.",officialUrl:P.family+"radja-river",artUrl:IMG.radjaRiver},
    "melody-road":{label:"LOUP-GAROU ZONE · MELODY ROAD",line:"Eine musikalische Autofahrt mit ordentlich Retro-Walibi-Flair.",officialUrl:P.family+"melody-road",artUrl:IMG.melodyRoad},
    "tiki-waka":{label:"EXOTIC WORLD · TIKI-WAKA",line:"Wendiger Coaster-Run zwischen Tiki-Dekor und tropischem Grün.",officialUrl:P.family+"tiki-waka",artUrl:IMG.tikiWaka},
    octopus:{label:"EXOTIC WORLD · OCTOPUS",line:"Acht Arme, jede Menge Drehung und keine feste Blickrichtung.",officialUrl:P.family+"octopus",artUrl:IMG.octopus},
    "wave-swinger":{label:"LOUP-GAROU ZONE · WAVE SWINGER",line:"Kettenkarussell-Feeling mit freiem Blick über den Park.",officialUrl:P.family+"wave-swinger",artUrl:IMG.waveSwinger},
    "tiki-trail":{label:"EXOTIC WORLD · TIKI-TRAIL",line:"Klettern und balancieren durch den tropischen Abenteuerpfad.",officialUrl:P.family+"tiki-trail",artUrl:IMG.tikiTrail},
    pulsar:{label:"DOCK WORLD · PULSAR",line:"Launch, Höhe und der große Splash – Dock World dreht komplett auf.",officialUrl:P.thrill+"pulsar",artUrl:IMG.pulsar},
    vampire:{label:"LOUP-GAROU ZONE · VAMPIRE",line:"Beine frei, Schiene über dir – der Vampir zieht seine Kreise.",officialUrl:P.thrill+"vampire",artUrl:IMG.vampire},
    buzzsaw:{label:"ADVENTURE WORLD · BUZZSAW",line:"Die riesige Säge schwingt dich immer weiter über den Horizont.",officialUrl:P.thrill+"buzzsaw",artUrl:IMG.buzzsaw},
    kondaa:{label:"EXOTIC WORLD · KONDAA",line:"Die Schlange von Exotic World verbindet Höhe, Tempo und Airtime.",officialUrl:P.thrill+"kondaa",artUrl:IMG.kondaa},
    cobra:{label:"KARMA WORLD · COBRA",line:"Vorwärts durch die Strecke – und danach alles noch einmal rückwärts.",officialUrl:P.thrill+"cobra",artUrl:IMG.cobra},
    "dalton-terror":{label:"ADVENTURE WORLD · DALTON TERROR",line:"Der Turm kennt nur zwei Richtungen: ganz nach oben und direkt wieder runter.",officialUrl:P.thrill+"dalton-terror",artUrl:IMG.dalton},
    "spinning-vibe":{label:"LOUP-GAROU ZONE · SPINNING VIBE",line:"Eine rotierende Scheibe, eine Schiene und reichlich Chaos.",officialUrl:P.thrill+"spinning-vibe",artUrl:IMG.spinningVibe},
    "kids-airlines":{label:"ADVENTURE WORLD · KIDS AIRLINES",line:"Die kleinsten Piloten starten zu ihrer eigenen Flugrunde.",officialUrl:P.kids+"kids-airlines",artUrl:IMG.kidsAirlines},
    "tchou-tchou-express":{label:"ADVENTURE WORLD · TCHOU-TCHOU",line:"Der kleine Zug nimmt Kurs auf die nächste Familienrunde.",officialUrl:P.kids+"tchou-tchou-express",artUrl:IMG.tchou},
    "spinning-taxi":{label:"ADVENTURE WORLD · SPINNING TAXI",line:"Taxi fahren wäre einfach – wenn sich nicht alles gleichzeitig drehen würde.",officialUrl:P.kids+"spinning-taxi",artUrl:IMG.spinningTaxi},
    "loup-garou":{label:"LOUP-GAROU ZONE · WOODEN LEGEND",line:"Holz donnert durch den Wald – die letzte Saison der ursprünglichen Legende.",officialUrl:P.thrill+"loup-garou",artUrl:IMG.loup}
  };

  const fonts = {
    mecalodon:{fontFamily:"'Bebas Neue', sans-serif",theme:"dock-shark"},
    turbine:{fontFamily:"'Stardos Stencil', sans-serif",theme:"dock-industrial"},
    pulsar:{fontFamily:"'Orbitron', sans-serif",theme:"dock-powersplash"},
    "flash-back":{fontFamily:"'Bebas Neue', sans-serif",theme:"dock-water"},
    stormy:{fontFamily:"'Bangers', sans-serif",theme:"dock-kids"},
    "tous-en-boite":{fontFamily:"'Bangers', sans-serif",theme:"dock-kids"},
    kondaa:{fontFamily:"'Cinzel Decorative', serif",theme:"exotic-kondaa"},
    kondaala:{fontFamily:"'Cinzel Decorative', serif",theme:"exotic-kondaa"},
    "tiki-waka":{fontFamily:"'Bangers', sans-serif",theme:"exotic-tiki"},
    "tiki-trail":{fontFamily:"'Bangers', sans-serif",theme:"exotic-tiki"},
    octopus:{fontFamily:"'Bangers', sans-serif",theme:"exotic-tiki"},
    "challenge-of-tutankhamon":{fontFamily:"'Cinzel Decorative', serif",theme:"egypt-temple"},
    cobra:{fontFamily:"'Cinzel Decorative', serif",theme:"karma-bollywood"},
    "palais-du-genie":{fontFamily:"'Cinzel Decorative', serif",theme:"karma-genie"},
    "tapis-volant":{fontFamily:"'Cinzel Decorative', serif",theme:"karma-genie"},
    "popcorn-revenge":{fontFamily:"'Bangers', sans-serif",theme:"popcorn-cinema"},
    "radja-river":{fontFamily:"'Staatliches', sans-serif",theme:"karma-water"},
    "loup-garou":{fontFamily:"'Graduate', serif",theme:"loup-wood"},
    vampire:{fontFamily:"'Old London', 'Cinzel Decorative', serif",theme:"vampire-gothic"},
    "spinning-vibe":{fontFamily:"'Bebas Neue', sans-serif",theme:"loup-retro"},
    "melody-road":{fontFamily:"'Graduate', serif",theme:"loup-retro"},
    "wave-swinger":{fontFamily:"'Graduate', serif",theme:"loup-retro"},
    "4d-bioscoop":{fontFamily:"'Bebas Neue', sans-serif",theme:"loup-retro"},
    silverton:{fontFamily:"'Graduate', serif",theme:"loup-retro"},
    "calamity-mine":{fontFamily:"'Stardos Stencil', serif",theme:"western-mine"},
    "dalton-terror":{fontFamily:"'Stardos Stencil', serif",theme:"western-drop"},
    buzzsaw:{fontFamily:"'Stardos Stencil', serif",theme:"western-drop"},
    "grand-carrousel":{fontFamily:"'Graduate', serif",theme:"western-fair"},
    "little-swing":{fontFamily:"'Bangers', sans-serif",theme:"western-fair"},
    "guitar-riff":{fontFamily:"'Bangers', sans-serif",theme:"western-fair"},
    poneys:{fontFamily:"'Graduate', serif",theme:"western-fair"},
    "kids-airlines":{fontFamily:"'Bangers', sans-serif",theme:"western-fair"},
    "tchou-tchou-express":{fontFamily:"'Bangers', sans-serif",theme:"western-fair"},
    "spinning-taxi":{fontFamily:"'Bangers', sans-serif",theme:"western-fair"},
    "4x4-adventure":{fontFamily:"'Bangers', sans-serif",theme:"fun-world"},
    "fun-recorder":{fontFamily:"'Bangers', sans-serif",theme:"fun-world"},
    "graffiti-shuttle":{fontFamily:"'Bangers', sans-serif",theme:"fun-world"},
    "bubble-swirl":{fontFamily:"'Bangers', sans-serif",theme:"fun-world"},
    "mini-tour":{fontFamily:"'Bangers', sans-serif",theme:"fun-world"},
    "fun-pilot":{fontFamily:"'Bangers', sans-serif",theme:"fun-world"},
    "tree-house":{fontFamily:"'Bangers', sans-serif",theme:"fun-world"}
  };

  const aliases = {
    "flash back":"flash-back","flash-back":"flash-back",
    "palais du génie":"palais-du-genie","palais du genie":"palais-du-genie",
    "loup garou":"loup-garou","loup-garou":"loup-garou",
    "pulsar":"pulsar","kondaa":"kondaa","kondaala":"kondaala",
    "challenge of tutankhamon":"challenge-of-tutankhamon",
    "4d bioscoop":"4d-bioscoop","4d-bioscoop":"4d-bioscoop",
    "tous en boîte":"tous-en-boite","tous en boite":"tous-en-boite",
    "tiki waka":"tiki-waka","tiki-waka":"tiki-waka",
    "tiki trail":"tiki-trail","tiki-trail":"tiki-trail"
  };

  // Walibi Belgium gets park-scoped ride IDs to prevent collisions with
  // similarly named attractions at Walibi Holland and future parks.
  const prefixId = (id) => "wb-" + id;
  const scopedRides = rides.map((ride) => Object.assign({}, ride, { id: prefixId(ride.id) }));
  const scopedWorlds = Object.fromEntries(Object.entries(worlds).map(([id, value]) => [prefixId(id), value]));
  const scopedFonts = Object.fromEntries(Object.entries(fonts).map(([id, value]) => [prefixId(id), value]));
  const scopedAliases = Object.fromEntries(Object.entries(aliases).map(([name, id]) => [name, prefixId(id)]));
  rides.forEach((ride) => { scopedAliases[ride.name.toLowerCase()] = prefixId(ride.id); });

  const rideConfig = {};
  scopedRides.forEach((ride) => { rideConfig[ride.id] = {singleRider:false}; });

  window.NAEHEN_WALIBI_BELGIUM = {
    park:{
      slug:"walibi-belgium",
      name:"Walibi Belgium",
      location:"Waver · Waals-Brabant",
      liveDataUrl:"./live-walibi-belgium.json",
      cardImage:IMG.mecalodon,
      cardCopy:"Dock World, Kondaa, Mecalodon, Live-Wartezeiten und dein Nähprotokoll.",
      disclaimer:"Kein offizielles Angebot von Walibi Belgium."
    },
    rides:scopedRides,
    worlds:scopedWorlds,
    fonts:scopedFonts,
    aliases:scopedAliases,
    rideConfig,
    exclusions:{
      ids:[],
      namePatterns:[
        "aquarium","mine blast","silence","grand hotel","arachnophobia",
        "innocence","psycho circus","bill: a fairy tale","freaky pizza"
      ]
    }
  };
})();