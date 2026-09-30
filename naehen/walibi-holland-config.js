(() => {
  "use strict";

  const P = "https://www.walibi.nl/nl/park/attracties/";
  const Z = "https://www.walibi.nl/nl/park/Zones/";

  const IMG = {
    yoy: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--6220150f-ff8f-44c6-b5a3-1218028c4461/2025-walibiholland-yoy-8494.jpg?preferwebp=true&quality=85",
    eatMyDust: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--d3707bec-609c-484a-8691-c717e30e1273/attractie-eatmydust-gezin-7.jpg?preferwebp=true&quality=85",
    drako: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--78771a64-e20e-4913-9b03-11bad3d7fd93/attractie-drako-gezin-1.jpg?preferwebp=true&quality=85",
    crazyRiver: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--19203e38-fe08-4cf8-9ed2-7a0c0f9ca049/attractie-crazyriver-gezin-1.jpg?preferwebp=true&quality=85",
    splashBattle: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--327210aa-f06c-4d08-8156-e8f8c0c1a39f/attractie-splashbattle-2.jpg?preferwebp=true&quality=85",
    elRioGrande: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--546a07a3-659b-4f96-ac26-ac1e83fd42d5/attractie-elriogrande-gezin-1.jpg?preferwebp=true&quality=85",
    merlin: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--d2ce72b9-fd41-4c06-a5ad-09c338872463/attractie-merlinsmagiccastle-1.jpg?preferwebp=true&quality=85",
    laGrandeRoue: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--cd5dc01e-7199-4a85-98ae-19d06e1833ff/attractie-lagranderoue-gezin-4.jpg?preferwebp=true&quality=85",
    superSwing: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--a70de395-81b2-4733-b2f6-3ee675fdcb0e/super-swing-1.jpg?preferwebp=true&quality=85",
    untamed: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--8480ee71-4f44-4a63-91af-fb5d63e648e7/attractie-untamed-2.jpg?preferwebp=true&quality=85",
    lostGravity: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--011b91cb-bb7d-4968-8d99-cc3fbc508303/attractie-lostgravity-26.jpg?preferwebp=true&quality=85",
    xpress: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--99a90510-5199-4498-936a-0cc951d58bb6/attracties-xpress-taya-4.jpg?preferwebp=true&quality=85",
    condor: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--41b192d6-5c5f-4ae2-9860-6df5705b9354/attractie-condor-1.jpg?preferwebp=true&quality=85",
    goliath: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--20d688c6-e5ae-4ff9-a15e-62a536bd1f4f/attractie-goliath-taya-2.jpg?preferwebp=true&quality=85",
    spaceShot: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--fb4b014c-4264-41b4-bf09-20ce479fd196/attractie-spaceshot-17.jpg?preferwebp=true&quality=85",
    gForce: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--512b5942-8911-456d-a377-a1750eaaeb5c/attractie-gforce-6.jpg?preferwebp=true&quality=85",
    blast: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--49f1fb8c-a7a3-4c6c-a621-adc926cb1cb2/attractie-blast-taya-2.jpg?preferwebp=true&quality=85",
    funRecorder: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--a7afca38-3bf5-466e-a269-7d6f846a7702/attractie-funrecorder-6.jpg?preferwebp=true&quality=85",
    worldTour: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--07d3a6ee-caaf-4799-9a78-b5589820b6cb/walibi-play-land-26-12.jpg?preferwebp=true&quality=85",
    bubbleSwirl: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--7a0a198d-f9e4-4918-8b23-503a9b4ed03e/walibi-play-land-26-2.jpg?preferwebp=true&quality=85",
    garage: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--0db3614f-e254-43ab-8da0-8d44ecd254c6/attractie-haazgarage-3.jpg?preferwebp=true&quality=85",
    skydiver: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--109c521b-e50e-4b9a-ab05-271f6d2cdb24/attractie-skydiver-5.jpg?preferwebp=true&quality=85",
    cooldown: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--f78007b5-dc45-419a-bbaa-d183989a23e8/attractie-cooldown-gezin-5.jpg?preferwebp=true&quality=85",
    spinningVibe: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--94b0d478-f40b-40ed-b147-fb140e940580/attractie-spinningvibe-4-oud.jpg?preferwebp=true&quality=85",
    tequilaTaxis: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--65f72555-d721-4792-8bdc-a3a634466e16/attractie-tequillataxis-13.jpg?preferwebp=true&quality=85",
    windSeekers: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--8d9455f0-63c5-400a-8e4d-8ec8575a13af/attracties-windseekers-gezin-3.jpg?preferwebp=true&quality=85",
    walibiShuttle: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--e72783b9-eb17-41fc-9831-9d027a1ae0f8/walibi-play-land-26-10.jpg?preferwebp=true&quality=85",
    leTour: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--e34e0066-ac84-4f7b-b072-ac20aef67175/attractie-letourdesjardins-4.jpg?preferwebp=true&quality=85",
    merrie: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--23f42799-8583-408a-b987-a85584d3a671/attractie-merriegoround-5.jpg?preferwebp=true&quality=85",
    pavillon: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--c2a556ae-8682-4b1c-99b3-44d5f6fe24f4/attractie-paviliondethe-4.jpg?preferwebp=true&quality=85",
    speedOfSound: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--eeb0635e-73f6-4cc8-a001-7723e719683b/attractie-speedofsound-6.jpg?preferwebp=true&quality=85",
    tomahawk: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--72903adb-7d9f-43dc-8342-75acca77242f/attractie-thomahawk-5.jpg?preferwebp=true&quality=85",
    exoticZone: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--fe7e3df0-6ca0-4e7b-854a-24d491989678/exotic-zone-1.jpg?preferwebp=true&quality=85",
    playLandZone: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--50c9cc4c-a1f8-464c-8b84-3c2d32f3508b/attractie-haazgarage-gezin-1.jpg?preferwebp=true&quality=85",
    mainStreetZone: "https://www.walibi.nl/adobe/dynamicmedia/deliver/dm-aid--d714384a-5fd4-4299-b82c-ae7c5501e287/mainstreet-zone-1.jpg?preferwebp=true&quality=85"
  };

  const rides = [
    ["yoy-chill","YOY CHILL","YOY"],
    ["yoy-thrill","YOY THRILL","YOY"],
    ["eat-my-dust","Eat My Dust","Speed Zone - OFF ROAD"],
    ["drako","Drako","Play Ground"],
    ["crazy-river","Crazy River","Zero Zone"],
    ["splash-battle","Splash Battle","Play Ground"],
    ["el-rio-grande","El Rio Grande","Exotic"],
    ["merlins-magic-castle","Merlin's Magic Castle","Wilderness"],
    ["pavillon-de-the","Pavillon de Thé","Exotic"],
    ["los-sombreros","Los Sombreros","Exotic"],
    ["la-grande-roue","La Grande Roue","Main Street"],
    ["super-swing","Super Swing","Play Ground"],
    ["walibi-express","Walibi Express","Main Street"],
    ["speed-of-sound","Speed of Sound","Play Ground"],
    ["untamed","UNTAMED","Wilderness"],
    ["lost-gravity","Lost Gravity","Zero Zone"],
    ["xpress-platform-13","Xpress: Platform 13","Main Street"],
    ["condor","Condor","Exotic"],
    ["goliath","Goliath","Speed Zone"],
    ["the-tomahawk","The Tomahawk","Play Ground"],
    ["space-shot","Space Shot","Speed Zone"],
    ["g-force","G-Force","Speed Zone"],
    ["blast","Blast","Zero Zone"],
    ["walibis-fun-recorder","Walibi's Fun Recorder","Walibi Play Land"],
    ["walibis-world-tour","Walibi's World Tour","Walibi Play Land"],
    ["bubble-swirl","Bubble Swirl","Walibi Play Land"],
    ["garage","Garage","Walibi Play Land"],
    ["mini-taxis","Mini Taxi's","Walibi Play Land"],
    ["stunt-flight","Stunt Flight","Walibi Play Land"],
    ["space-kidz","Space Kidz","Walibi Play Land"],
    ["skydiver","Skydiver","Speed Zone"],
    ["cooldown","Cooldown","Speed Zone - OFF ROAD"],
    ["spinning-vibe","Spinning Vibe","Zero Zone"],
    ["tequila-taxis","Tequila Taxi's","Exotic"],
    ["wind-seekers","Wind Seekers","Speed Zone - OFF ROAD"],
    ["walibis-shuttle","Walibi's Shuttle","Zero Zone"],
    ["le-tour-des-jardins","Le Tour des Jardins","Wilderness"],
    ["merrie-goround","Merrie Go'Round","Play Ground"]
  ].map(([id,name,zone]) => ({id,name,zone}));

  const worlds = {
    "yoy-chill": {label:"YOY · CHILL SIDE",line:"Blau, schnell und kompromisslos – ohne Inversionen, aber alles andere als harmlos.",officialUrl:P+"yoy",artUrl:IMG.yoy},
    "yoy-thrill": {label:"YOY · THRILL SIDE",line:"Grün, 80 km/h schnell und sechs Inversionen – die wilde Seite von YOY.",officialUrl:P+"yoy",artUrl:IMG.yoy},
    "eat-my-dust": {label:"OFF ROAD · QUAD TRACK",line:"Staub aufwirbeln und Gas geben – dein erster Offroad-Coaster-Run.",officialUrl:P+"eat-my-dust",artUrl:IMG.eatMyDust},
    "drako": {label:"PLAY GROUND · DRAKO",line:"Klein gebaut, aber bereit für deine erste richtige Achterbahnrunde.",officialUrl:P+"drako",artUrl:IMG.drako},
    "crazy-river": {label:"ZERO ZONE · WILD WATER",line:"Rein in den Baumstamm. Trocken wieder raus? Keine Garantie.",officialUrl:P+"crazy-river",artUrl:IMG.crazyRiver},
    "splash-battle": {label:"PLAY GROUND · WATERFIGHT",line:"Wasserkanonen bereit – hier bleibt niemand lange trocken.",officialUrl:P+"splash-battle",artUrl:IMG.splashBattle},
    "el-rio-grande": {label:"EXOTIC · RÍO SALVAJE",line:"Das runde Boot entscheidet selbst, wen der Wasserfall voll erwischt.",officialUrl:P+"el-rio-grande",artUrl:IMG.elRioGrande},
    "merlins-magic-castle": {label:"WILDERNESS · MERLINS CASTLE",line:"Die Natur hat sich das Schloss zurückgeholt. Im Inneren lebt die Magie weiter.",officialUrl:P+"merlins-magic-castle",artUrl:IMG.merlin},
    "pavillon-de-the": {label:"EXOTIC · PAVILLON",line:"Teetassen, Farbe und genau etwas mehr Drehung, als vernünftig wäre.",officialUrl:P+"pavillon-de",artUrl:IMG.pavillon},
    "los-sombreros": {label:"EXOTIC · FIESTA",line:"Sombreros hoch – an Siesta ist hier nicht zu denken.",officialUrl:P+"los-sombreros",artUrl:IMG.exoticZone,artSource:"official-zone-fallback"},
    "la-grande-roue": {label:"MAIN STREET · SKYLINE",line:"45 Meter Ruhe über dem Park, bevor es wieder richtig zur Sache geht.",officialUrl:P+"la-grande-roue",artUrl:IMG.laGrandeRoue},
    "super-swing": {label:"PLAY GROUND · FLY HIGH",line:"Der Sitz hebt ab, die Beine baumeln frei in der Luft.",officialUrl:P+"super-swing",artUrl:IMG.superSwing},
    "walibi-express": {label:"MAIN STREET · WALIBI EXPRESS",line:"Gemütlich durch den Park – einmal kurz durchatmen zwischen den nächsten Rides.",officialUrl:P+"walibi-express-station-1",artUrl:IMG.mainStreetZone,artSource:"official-zone-fallback"},
    "speed-of-sound": {label:"PLAY GROUND · SOUND SYSTEM",line:"Vorwärts, rückwärts und mitten durch den Soundtrack.",officialUrl:P+"speed-sound",artUrl:IMG.speedOfSound},
    "untamed": {label:"WILDERNESS · RECLAIMED",line:"Holz und Stahl verschwinden in einer Landschaft, die sich die Natur zurückerobert hat.",officialUrl:P+"untamed",artUrl:IMG.untamed},
    "lost-gravity": {label:"ZERO ZONE · GRAVITY ERROR",line:"Schwarz, Gelb und eine Welt, die nicht mehr weiß, wo oben und unten ist.",officialUrl:P+"lost-gravity",artUrl:IMG.lostGravity},
    "xpress-platform-13": {label:"MAIN STREET · PLATFORM 13",line:"Im verlassenen U-Bahnhof steht noch genau ein Zug für dich bereit.",officialUrl:P+"xpress-platform-13",artUrl:IMG.xpress},
    "condor": {label:"EXOTIC · ORANGE FLIGHT",line:"Beine frei, Schiene über dir – der klassische Inverted-Coaster-Flug.",officialUrl:P+"condor",artUrl:IMG.condor},
    "goliath": {label:"SPEED ZONE · 106 KM/U",line:"Blaue Schiene, jede Menge Airtime und 1.214 Meter zum Austoben.",officialUrl:P+"goliath",artUrl:IMG.goliath},
    "the-tomahawk": {label:"PLAY GROUND · TOMAHAWK",line:"Die Scheibe dreht sich, während die Bahn unter dir hin und her schießt.",officialUrl:P+"tomahawk",artUrl:IMG.tomahawk},
    "space-shot": {label:"SPEED ZONE · 3 · 2 · 1",line:"In wenigen Sekunden auf 60 Meter. Danach übernimmt wieder die Schwerkraft.",officialUrl:P+"space-shot",artUrl:IMG.spaceShot},
    "g-force": {label:"SPEED ZONE · G-FORCE",line:"Kompakt, mechanisch und gebaut, um dir jede Orientierung zu nehmen.",officialUrl:P+"g-force",artUrl:IMG.gForce},
    "blast": {label:"ZERO ZONE · CHAOS MODE",line:"Die Gondeln entscheiden selbst, wann sich die Welt auf den Kopf stellt.",officialUrl:P+"blast",artUrl:IMG.blast},
    "walibis-fun-recorder": {label:"WALIBI PLAY LAND · RECORD",line:"Kleine Walibi-Fans drehen hier ihre erste fröhliche Runde.",officialUrl:P+"walibis-fun-recorder",artUrl:IMG.funRecorder},
    "walibis-world-tour": {label:"WALIBI PLAY LAND · WORLD TOUR",line:"Eine farbenfrohe kleine Reise durch die Welt von Walibi.",officialUrl:P+"walibis-world-tour",artUrl:IMG.worldTour},
    "bubble-swirl": {label:"WALIBI PLAY LAND · BUBBLES",line:"Ballons, Drehungen und genau die richtige Portion Bauchkribbeln.",officialUrl:P+"bubble-swirl",artUrl:IMG.bubbleSwirl},
    "garage": {label:"WALIBI PLAY LAND · GARAGE",line:"Motor an – hier beginnt die erste kleine Autofahrt.",officialUrl:P+"garage",artUrl:IMG.garage},
    "mini-taxis": {label:"WALIBI PLAY LAND · MINI TAXI",line:"Kein Führerschein nötig. Zusammenstöße ausdrücklich erlaubt.",officialUrl:P+"mini-taxis",artUrl:IMG.playLandZone,artSource:"official-zone-fallback"},
    "stunt-flight": {label:"WALIBI PLAY LAND · STUNT FLIGHT",line:"Du entscheidest selbst, wie hoch dein erster eigener Flug geht.",officialUrl:P+"stunt-flight",artUrl:IMG.playLandZone,artSource:"official-zone-fallback"},
    "space-kidz": {label:"WALIBI PLAY LAND · MINI LAUNCH",line:"Die kleinsten Astronauten bekommen hier ihren eigenen Start.",officialUrl:P+"space-kidz",artUrl:IMG.playLandZone,artSource:"official-zone-fallback"},
    "skydiver": {label:"SPEED ZONE · SKYDIVE",line:"Nach oben, loslassen – und plötzlich liegt der ganze Park unter dir.",officialUrl:P+"skydiver",artUrl:IMG.skydiver},
    "cooldown": {label:"OFF ROAD · COOL DOWN",line:"Tanzende Fontänen zwischen Staub, Reifen und echter Offroad-Energie.",officialUrl:P+"cooldown",artUrl:IMG.cooldown},
    "spinning-vibe": {label:"ZERO ZONE · SPINNING VIBE",line:"Magnetisches Chaos mit einem Rhythmus, der niemals ganz gerade läuft.",officialUrl:P+"spinning-vibe",artUrl:IMG.spinningVibe},
    "tequila-taxis": {label:"EXOTIC · TEQUILA TAXI",line:"Fahrkönnen optional. Zusammenstöße ausdrücklich erlaubt.",officialUrl:P+"tequila-taxis",artUrl:IMG.tequilaTaxis},
    "wind-seekers": {label:"OFF ROAD · WIND SEEKERS",line:"Über dem Gelände fliegen, während sich die Offroad-Welt unter dir dreht.",officialUrl:P+"wind-seekers",artUrl:IMG.windSeekers},
    "walibis-shuttle": {label:"ZERO ZONE · SHUTTLE",line:"Einsteigen, hin und her – Walibi hält es hier angenehm unkompliziert.",officialUrl:P+"walibis-shuttle",artUrl:IMG.walibiShuttle},
    "le-tour-des-jardins": {label:"WILDERNESS · JARDINS",line:"Eine ruhige Entdeckungstour durch das Grün von Wilderness.",officialUrl:P+"le-tour-des-jardins",artUrl:IMG.leTour},
    "merrie-goround": {label:"PLAY GROUND · CAROUSEL",line:"Klassische Kirmesatmosphäre mitten im farbenfrohen Play Ground.",officialUrl:P+"merrie-goround",artUrl:IMG.merrie}
  };

  const fonts = {
    "yoy-chill": {fontFamily:"'Bebas Neue', 'Barlow Condensed', sans-serif",theme:"yoy-chill"},
    "yoy-thrill": {fontFamily:"'Bangers', 'Bebas Neue', sans-serif",theme:"yoy-thrill"},
    "eat-my-dust": {fontFamily:"'Stardos Stencil', sans-serif",theme:"offroad"},
    "drako": {fontFamily:"'Luckiest Guy', sans-serif",theme:"playground-coaster"},
    "crazy-river": {fontFamily:"'Rye', serif",theme:"crazy-river"},
    "splash-battle": {fontFamily:"'Bangers', sans-serif",theme:"splash-battle"},
    "el-rio-grande": {fontFamily:"'Sancreek', serif",theme:"exotic-river"},
    "merlins-magic-castle": {fontFamily:"'Almendra SC', serif",theme:"merlin-castle"},
    "pavillon-de-the": {fontFamily:"'Poiret One', sans-serif",theme:"exotic-pavillon"},
    "los-sombreros": {fontFamily:"'Ribeye', serif",theme:"exotic-fiesta"},
    "la-grande-roue": {fontFamily:"'Limelight', sans-serif",theme:"mainstreet-wheel"},
    "super-swing": {fontFamily:"'Fascinate Inline', sans-serif",theme:"playground-swing"},
    "walibi-express": {fontFamily:"'Special Elite', monospace",theme:"walibi-express"},
    "speed-of-sound": {fontFamily:"'Bungee Spice', sans-serif",theme:"speed-of-sound"},
    "untamed": {fontFamily:"'Trade Winds', serif",theme:"untamed"},
    "lost-gravity": {fontFamily:"'Bebas Neue', sans-serif",theme:"lost-gravity"},
    "xpress-platform-13": {fontFamily:"'Special Elite', monospace",theme:"xpress-platform"},
    "condor": {fontFamily:"'Bebas Neue', sans-serif",theme:"condor"},
    "goliath": {fontFamily:"'Graduate', serif",theme:"goliath"},
    "the-tomahawk": {fontFamily:"'Bangers', sans-serif",theme:"tomahawk"},
    "space-shot": {fontFamily:"'Orbitron', sans-serif",theme:"space-shot"},
    "g-force": {fontFamily:"'Orbitron', sans-serif",theme:"g-force"},
    "blast": {fontFamily:"'Bangers', sans-serif",theme:"blast"},
    "walibis-fun-recorder": {fontFamily:"'Freckle Face', sans-serif",theme:"walibi-kids"},
    "walibis-world-tour": {fontFamily:"'Chela One', sans-serif",theme:"walibi-kids"},
    "bubble-swirl": {fontFamily:"'Henny Penny', serif",theme:"walibi-kids"},
    "garage": {fontFamily:"'Luckiest Guy', sans-serif",theme:"walibi-kids"},
    "mini-taxis": {fontFamily:"'Freckle Face', sans-serif",theme:"walibi-kids"},
    "stunt-flight": {fontFamily:"'Special Elite', monospace",theme:"walibi-kids-flight"},
    "space-kidz": {fontFamily:"'Orbitron', sans-serif",theme:"walibi-kids-space"},
    "skydiver": {fontFamily:"'Bebas Neue', sans-serif",theme:"skydiver"},
    "cooldown": {fontFamily:"'Kablammo', sans-serif",theme:"offroad-water"},
    "spinning-vibe": {fontFamily:"'Bungee Spice', sans-serif",theme:"zero-zone"},
    "tequila-taxis": {fontFamily:"'Ribeye', serif",theme:"exotic-fiesta"},
    "wind-seekers": {fontFamily:"'Stardos Stencil', sans-serif",theme:"offroad"},
    "walibis-shuttle": {fontFamily:"'Bungee Spice', sans-serif",theme:"zero-zone"},
    "le-tour-des-jardins": {fontFamily:"'Macondo', serif",theme:"wilderness-garden"},
    "merrie-goround": {fontFamily:"'Fascinate Inline', sans-serif",theme:"playground-carousel"}
  };

  const aliases = {
    "yoy chill":"yoy-chill",
    "yoy thrill":"yoy-thrill",
    "untamed":"untamed",
    "eat my dust":"eat-my-dust",
    "​eat my dust":"eat-my-dust",
    "xpress: platform 13":"xpress-platform-13",
    "merlin's magic castle":"merlins-magic-castle",
    "merlin’s magic castle":"merlins-magic-castle",
    "pavillon de thé":"pavillon-de-the",
    "the tomahawk":"the-tomahawk",
    "walibi's fun recorder":"walibis-fun-recorder",
    "walibi’s fun recorder":"walibis-fun-recorder",
    "walibi's world tour":"walibis-world-tour",
    "walibi’s world tour":"walibis-world-tour",
    "mini taxi's":"mini-taxis",
    "mini taxi’s":"mini-taxis",
    "tequila taxi's":"tequila-taxis",
    "tequila taxi’s":"tequila-taxis",
    "walibi's shuttle":"walibis-shuttle",
    "walibi’s shuttle":"walibis-shuttle",
    "merrie go'round":"merrie-goround",
    "merrie go’round":"merrie-goround",
    "skydive":"skydiver",
    "skydiver":"skydiver",
    "walibi express":"walibi-express",
    "walibi express station 1":"walibi-express",
    "walibi express station 2":"walibi-express"
  };

  const singleRiderIds = new Set([
    "space-shot","yoy-chill","yoy-thrill","goliath",
    "lost-gravity","speed-of-sound","condor","untamed"
  ]);
  const rideConfig = {};
  rides.forEach((ride) => {
    rideConfig[ride.id] = {singleRider: singleRiderIds.has(ride.id)};
  });
  rideConfig["goliath"].speedKmh = 106;

  window.NAEHEN_WALIBI_HOLLAND = {
    park: {
      slug:"walibi-holland",
      name:"Walibi Holland",
      location:"Biddinghuizen · Flevoland",
      liveDataUrl:"./live-walibi-holland.json",
      cardImage:IMG.yoy,
      cardCopy:"38 Attraktionen · Live-Wartezeiten, Single Rider und dein Nähprotokoll.",
      disclaimer:"Kein offizielles Angebot von Walibi Holland."
    },
    rides,
    worlds,
    fonts,
    aliases,
    rideConfig,
    exclusions: {
      ids: [
        "jefferson-manor","psychoshock","the-villa",
        "camp-of-curiosities","wicked-woods"
      ],
      namePatterns: [
        "jefferson manor","psychoshock","the villa",
        "camp of curiosities","wicked woods"
      ]
    }
  };
})();