(() => {
  const A = "https://www.movieparkgermany.de/content/dam/mpg/images/attractions/";
  const P = "https://www.movieparkgermany.de/erlebnisse/attraktionen/";

  const rides = [
    ["journey-to-the-forbidden-chamber","Journey to the Forbidden Chamber","The Hollywood Street Set"],
    ["movie-park-studio-tour","Movie Park Studio Tour","The Hollywood Studio Set"],
    ["the-high-fall","The High Fall","The Old West"],
    ["ghost-chasers","Ghost Chasers","nickelodeon LAND"],
    ["splat-o-sphere","Splat-O-Sphere","nickelodeon LAND"],
    ["jimmy-neutrons-atomic-flyer","Jimmy Neutron's Atomic Flyer","nickelodeon LAND"],
    ["zumas-zoomers","Zuma's Zoomers","nickelodeon LAND"],
    ["nyc-transformer","NYC Transformer","Streets of New York"],
    ["iron-claw","Iron Claw","The Old West"],
    ["backyardigans-mission-to-mars","Backyardigans Mission to Mars","nickelodeon LAND"],
    ["santa-monica-wheel","Santa Monica Wheel","Santa Monica Pier"],
    ["sea-swing","Sea Swing","nickelodeon LAND"],
    ["van-helsings-factory","Van Helsing's Factory","Streets of New York"],
    ["rescue-112","Rescue 112","Santa Monica Pier"],
    ["side-kick","Side Kick","The Old West"],
    ["crazy-surfer","Crazy Surfer","Santa Monica Pier"],
    ["paw-patrol-adventure-tour","PAW Patrol Adventure Tour","nickelodeon LAND"],
    ["star-trek-operation-enterprise","Star Trek™: Operation Enterprise","Federation Plaza"],
    ["pier-side-carousel","Pier Side Carousel","Santa Monica Pier"],
    ["the-bandit","The Bandit","The Old West"],
    ["doras-big-river-adventure","Dora's Big River Adventure","nickelodeon LAND"],
    ["area-51-top-secret","Area 51 - Top Secret","The Hollywood Street Set"],
    ["spongebob-splash-bash","SpongeBob Splash Bash","nickelodeon LAND"],
    ["time-riders","Time Riders","Streets of New York"],
    ["avatar-air-glider","Avatar Air Glider","nickelodeon LAND"],
    ["fairy-world-spin","Fairy World Spin","nickelodeon LAND"],
    ["stormy-cruise","Stormy Cruise","Santa Monica Pier"],
    ["skyes-high-flyer","Skye's High Flyer","nickelodeon LAND"],
    ["teenage-mutant-ninja-turtles-license-to-drive","Teenage Mutant Ninja Turtles: License to Drive","nickelodeon LAND"],
    ["excalibur-secrets-of-the-dark-forest","Excalibur - Secrets of the Dark Forest","The Hollywood Studio Set"],
    ["spielplatz-santa-monica","Spielplatz Santa Monica","Santa Monica Pier"],
    ["roxy-4d","Roxy 4D","The Hollywood Street Set"]
  ].map(([id,name,zone]) => ({ id,name,zone }));

  const worlds = {
    "journey-to-the-forbidden-chamber": {
      label:"PARAMOUNT STUDIOS · FORBIDDEN CHAMBER",
      line:"Scheinwerfer an. Du bist Statist in einem mystischen Abenteuerfilm.",
      officialUrl:P+"journey-to-the-forbidden-chamber",
      artUrl:A+"jttfc/update/JTTFC_web%20%281%29.jpg"
    },
    "movie-park-studio-tour": {
      label:"HOLLYWOOD STUDIO SET · TAKE ONE",
      line:"Kamera läuft: Beschleunigung, Drehplattform und Filmsets warten.",
      officialUrl:P+"movie-park-studio-tour",
      artUrl:A+"movie-park-studio-tour/2024/MPST_MAIN_2024.jpg"
    },
    "the-high-fall": {
      label:"THE OLD WEST · HIGH NOON",
      line:"Erst Aussicht. Dann freier Fall.",
      officialUrl:P+"the-high-fall",
      artUrl:A+"the-high-fall/The-High-Fall-Attractions-Movie-Park-main.jpg"
    },
    "ghost-chasers": {
      label:"NICKELODEON LAND · BIKINI BOTTOM",
      line:"Der fliegende Holländer ist hinter euch her.",
      officialUrl:P+"ghost-chasers",
      artUrl:A+"ghost-chasers/Ghost-Chasers-Attractions-Movie-Park-main.jpg"
    },
    "splat-o-sphere": {
      label:"NICKELODEON LAND · ÜBER DEN STUDIOS",
      line:"Fast 30 Meter hoch und die Flugroute selbst in der Hand.",
      officialUrl:P+"splat-o-sphere",
      artUrl:A+"splat-o-sphere/Splat-O-Sphere-Attractions-Movie-Park-main.jpg"
    },
    "jimmy-neutrons-atomic-flyer": {
      label:"NICKELODEON LAND · JIMMYS LABOR",
      line:"Jimmys neueste Erfindung ist bereit für den Testflug.",
      officialUrl:P+"jimmy-neutrons-atomic-flyer",
      artUrl:A+"jimmy-neutron%27s-atomic-flyer/Jimmy-Neutron%27s-Atomic-Flyer-Attractions-Movie-Park-main.jpg"
    },
    "zumas-zoomers": {
      label:"ADVENTURE BAY · ZUMA",
      line:"Mit dem Luftkissenboot durch die Kurven am Strand.",
      officialUrl:P+"zumas-zoomers",
      artUrl:A+"zuma%27s-zoomers/Zumas-Zoomers-Attractions-Movie-Park-main.jpg"
    },
    "nyc-transformer": {
      label:"STREETS OF NEW YORK · POWER GRID",
      line:"Der überdimensionale Transformator setzt Energie frei.",
      officialUrl:P+"nyc-transformer",
      artUrl:A+"nyc-transformer/NYC-Transformer-Attractions-Movie-Park-main.jpg"
    },
    "iron-claw": {
      label:"THE OLD WEST · ABANDONED STUDIOS",
      line:"Wingo Stars verfallenes Western-Filmset erwacht wieder.",
      officialUrl:P+"ironclaw",
      artUrl:A+"ironclaw/Eingang.jpg"
    },
    "backyardigans-mission-to-mars": {
      label:"NICKELODEON LAND · MARS MISSION",
      line:"Raumschiff startklar: Familienmission zum roten Planeten.",
      officialUrl:P+"backyardigans-mission-to-mars",
      artUrl:A+"backyardigans-mission-to-mars/Backyardigans-Mission-to-Mars-Attractions-Movie-Park-main.jpg"
    },
    "santa-monica-wheel": {
      label:"SANTA MONICA PIER · PACIFIC VIEW",
      line:"Eine ruhige Runde über der kalifornischen Promenade.",
      officialUrl:P+"santa-monica-wheel",
      artUrl:A+"santa-monica-wheel/Santa-Monica-Wheel-Attractions-Movie-Park-main.jpg"
    },
    "sea-swing": {
      label:"NICKELODEON LAND · JELLYFISH FIELD",
      line:"Mit SpongeBob durch das Quallenfeld von Bikini Bottom.",
      officialUrl:P+"sea-swing",
      artUrl:A+"sea-swing/Sea-Swing-Attractions-Movie-Park-main.jpg"
    },
    "van-helsings-factory": {
      label:"STREETS OF NEW YORK · VAMPIRE HUNT",
      line:"Die alte Tankstelle ist dunkel. Van Helsing wartet.",
      officialUrl:P+"vanhelsings-factory",
      artUrl:A+"van-helsing%27s-factory/Van-Helsing%27s-Factory-Attractions-Movie-Park-main.jpg"
    },
    "rescue-112": {
      label:"SANTA MONICA PIER · FIRE RESCUE",
      line:"Sirene an: Das brennende Hotel braucht eure Hilfe.",
      officialUrl:P+"rescue-112",
      artUrl:A+"rescue-112/Rescue-112-Attractions-Movie-Park-main.jpg"
    },
    "side-kick": {
      label:"THE OLD WEST · SPINNING STEEL",
      line:"Schwingen und drehen gleichzeitig – festhalten.",
      officialUrl:P+"side-kick",
      artUrl:A+"side-kick/Side-Kick-Attractions-Movie-Park-main.jpg"
    },
    "crazy-surfer": {
      label:"SANTA MONICA PIER · SURF SPOT",
      line:"Die perfekte Welle rollt über den Pier.",
      officialUrl:P+"crazy-surfer",
      artUrl:A+"crazy-surfer/Crazy-Surfer-Attractions-Movie-Park-main.jpg"
    },
    "paw-patrol-adventure-tour": {
      label:"ADVENTURE BAY · RESCUE MISSION",
      line:"Einsteigen: Die Welpenwache ist auf neuer Mission.",
      officialUrl:P+"paw-patrol-adventure",
      artUrl:A+"paw-patrol-adventure-tour/PAW-Patrol-Adventure-Tour-Attractions-Movie-Park-main.jpg"
    },
    "star-trek-operation-enterprise": {
      label:"FEDERATION PLAZA · STARFLEET",
      line:"Die U.S.S. Enterprise braucht eure Crew.",
      officialUrl:P+"star-trek-operation-enterprise",
      artUrl:A+"star-trek-operation-enterprise/Star-Trek-Operation%20Enterprise-Attractions-Movie-Park-main.jpg"
    },
    "pier-side-carousel": {
      label:"SANTA MONICA PIER · 1960s",
      line:"Nostalgischer Flug über der Promenade.",
      officialUrl:P+"pier-side-carousel",
      artUrl:A+"pier-side-carousel/Pier-Side-Carousel-Attractions-Movie-Park-main.jpg"
    },
    "the-bandit": {
      label:"THE OLD WEST · OUTLAW RUN",
      line:"Holz, Stahl und eine wilde Verfolgungsjagd.",
      officialUrl:P+"the-bandit",
      artUrl:A+"the-bandit/The-Bandit-Attractions-Movie-Park-main.jpg"
    },
    "doras-big-river-adventure": {
      label:"NICKELODEON LAND · DORAS DSCHUNGEL",
      line:"Mit Dora und Boots auf eine verrückt-feuchte Expedition.",
      officialUrl:P+"doras-big-river-adventure",
      artUrl:A+"dora%27s-big-river-adventure/Doras-Big-River-Adventure-Attractions-Movie-Park-main.jpg"
    },
    "area-51-top-secret": {
      label:"HOLLYWOOD STREET SET · CLASSIFIED",
      line:"Zutritt zur geheimen Air Force Base. Aliens nicht ausgeschlossen.",
      officialUrl:P+"area-51-top-secret",
      artUrl:A+"area-51-top-secret/Area-51-Top-Secret-Attractions-Movie-Park-main.jpg"
    },
    "spongebob-splash-bash": {
      label:"NICKELODEON LAND · BIKINI BOTTOM",
      line:"Wasserkanonen bereit: Bikini Bottom wird klatschnass.",
      officialUrl:P+"spongebob-splash-bash",
      artUrl:A+"spongebob-splash-bash/SpongeBob-Splash-Bash-Attractions-Movie-Park-3.jpg"
    },
    "time-riders": {
      label:"STREETS OF NEW YORK · DR. WELLS LAB",
      line:"Das Geheimlabor öffnet ein Tor durch Raum und Zeit.",
      officialUrl:P+"time-riders",
      artUrl:A+"time-riders/Time-Riders-Attractions-Movie-Park-main.jpg"
    },
    "avatar-air-glider": {
      label:"NICKELODEON LAND · AIR TEMPLE",
      line:"Auf dem Bauch liegend zum Luftbändiger werden.",
      officialUrl:P+"avatar-air-glider",
      artUrl:A+"avatar-air-glider/Avatar-Air-Glider-Attractions-Movie-Park-main.jpg"
    },
    "fairy-world-spin": {
      label:"NICKELODEON LAND · FAIRY WORLD",
      line:"Cosmo und Wanda lassen die Elfenwelt kreisen.",
      officialUrl:P+"fairy-world-spin",
      artUrl:A+"fairy-world-spin/Fairy-World-Spin-Attractions-Movie-Park-main.jpg"
    },
    "stormy-cruise": {
      label:"SANTA MONICA PIER · STORM WARNING",
      line:"Ahoi: Auf dem Pier zieht ein kleiner Sturm auf.",
      officialUrl:P+"stormy-cruise",
      artUrl:A+"stormy-cruise/Stormy-Cruise-Attractions-Movie-Park-main.jpg"
    },
    "skyes-high-flyer": {
      label:"ADVENTURE BAY · SKYE",
      line:"Neue Abenteuer liegen über Adventure Bay in der Luft.",
      officialUrl:P+"skyes-high-flyer",
      artUrl:A+"skye%27s-high-flyer/Skyes-High-Flyer-Attractions-Movie-Park-main.jpg"
    },
    "teenage-mutant-ninja-turtles-license-to-drive": {
      label:"NICKELODEON LAND · TURTLES NYC",
      line:"Mit den Turtles sicher durch die Straßen von New York.",
      officialUrl:P+"tmnt-license-to-drive",
      artUrl:A+"teenage-mutant-ninja-turtles-license-to-drive/Teenage-Mutant-Ninja-Turtles-License-to-Drive-Attractions-Movie-Park-main.jpg"
    },
    "excalibur-secrets-of-the-dark-forest": {
      label:"HOLLYWOOD STUDIO SET · DARK FOREST",
      line:"Merlin ruft: Das legendäre Schwert muss befreit werden.",
      officialUrl:P+"excalibur-secrets-of-the-dark-forest",
      artUrl:A+"excalibur-secrets-of-the-dark-forest/Excalibur-Secrets-of-the-Dark-Forest-Attractions-Movie-Park-main.jpg"
    },
    "spielplatz-santa-monica": {
      label:"SANTA MONICA PIER · BEACH SET",
      line:"Baywatch-Tower, Wasser und kalifornischer Spielplatz.",
      officialUrl:P+"spielplatz-santa-monica",
      artUrl:A+"spielplatz-santa-monica/Spielplatz%20Santa%20Monica.jpg"
    },
    "roxy-4d": {
      label:"HOLLYWOOD STREET SET · ROXY CINEMA",
      line:"Vorhang auf: Bikini Bottom kommt als 4D-Film ins Roxy.",
      officialUrl:P+"roxy-4d",
      artUrl:A+"roxy-4d/Roxy_Web_%28800%20x%20600%20px%29.jpg"
    }
  };

  const fonts = {
    "journey-to-the-forbidden-chamber": {fontFamily:"'Cinzel Decorative', 'Almendra SC', serif",theme:"paramount-adventure"},
    "movie-park-studio-tour": {fontFamily:"'Limelight', sans-serif",theme:"hollywood-studio"},
    "the-high-fall": {fontFamily:"'Rye', serif",theme:"old-west-drop"},
    "ghost-chasers": {fontFamily:"'Creepster', cursive",theme:"bikini-ghost"},
    "splat-o-sphere": {fontFamily:"'Bungee Spice', sans-serif",theme:"nick-sky"},
    "jimmy-neutrons-atomic-flyer": {fontFamily:"'Orbitron', sans-serif",theme:"science-cartoon"},
    "zumas-zoomers": {fontFamily:"'Chela One', sans-serif",theme:"paw-water"},
    "nyc-transformer": {fontFamily:"'Graduate', serif",theme:"nyc-power"},
    "iron-claw": {fontFamily:"'Bebas Neue', sans-serif",theme:"abandoned-western"},
    "backyardigans-mission-to-mars": {fontFamily:"'Bungee Spice', sans-serif",theme:"kids-space"},
    "santa-monica-wheel": {fontFamily:"'Limelight', sans-serif",theme:"pier-sunset"},
    "sea-swing": {fontFamily:"'Ribeye', serif",theme:"bikini-sea"},
    "van-helsings-factory": {fontFamily:"'Special Elite', monospace",theme:"vampire-factory"},
    "rescue-112": {fontFamily:"'Bebas Neue', sans-serif",theme:"fire-rescue"},
    "side-kick": {fontFamily:"'Rye', serif",theme:"old-west-thrill"},
    "crazy-surfer": {fontFamily:"'Trade Winds', sans-serif",theme:"california-surf"},
    "paw-patrol-adventure-tour": {fontFamily:"'Luckiest Guy', sans-serif",theme:"paw-rescue"},
    "star-trek-operation-enterprise": {fontFamily:"'Orbitron', sans-serif",theme:"starfleet"},
    "pier-side-carousel": {fontFamily:"'Fascinate Inline', sans-serif",theme:"pier-vintage"},
    "the-bandit": {fontFamily:"'Rye', serif",theme:"wild-west-wood"},
    "doras-big-river-adventure": {fontFamily:"'Chela One', sans-serif",theme:"dora-jungle"},
    "area-51-top-secret": {fontFamily:"'Stardos Stencil', sans-serif",theme:"secret-base"},
    "spongebob-splash-bash": {fontFamily:"'Luckiest Guy', sans-serif",theme:"bikini-water"},
    "time-riders": {fontFamily:"'IM Fell English SC', serif",theme:"victorian-time"},
    "avatar-air-glider": {fontFamily:"'Macondo', serif",theme:"air-temple"},
    "fairy-world-spin": {fontFamily:"'Henny Penny', serif",theme:"fairy-world"},
    "stormy-cruise": {fontFamily:"'Trade Winds', sans-serif",theme:"stormy-pier"},
    "skyes-high-flyer": {fontFamily:"'Chela One', sans-serif",theme:"paw-air"},
    "teenage-mutant-ninja-turtles-license-to-drive": {fontFamily:"'Bangers', sans-serif",theme:"tmnt-city"},
    "excalibur-secrets-of-the-dark-forest": {fontFamily:"'Almendra SC', serif",theme:"dark-forest"},
    "spielplatz-santa-monica": {fontFamily:"'Freckle Face', sans-serif",theme:"pier-play"},
    "roxy-4d": {fontFamily:"'Limelight', sans-serif",theme:"roxy-cinema"}
  };

  const aliases = {
    "star trek":"star-trek-operation-enterprise",
    "star trek™: operation enterprise":"star-trek-operation-enterprise",
    "star trek: operation enterprise":"star-trek-operation-enterprise",
    "excalibur":"excalibur-secrets-of-the-dark-forest",
    "excalibur - secrets of the dark forest":"excalibur-secrets-of-the-dark-forest",
    "jimmy neutron atomic flyer":"jimmy-neutrons-atomic-flyer",
    "jimmy neutron's atomic flyer":"jimmy-neutrons-atomic-flyer",
    "jimmy neutron’s atomic flyer":"jimmy-neutrons-atomic-flyer",
    "dora’s big river adventure":"doras-big-river-adventure",
    "dora's big river adventure":"doras-big-river-adventure",
    "van helsing’s factory":"van-helsings-factory",
    "van helsing's factory":"van-helsings-factory",
    "side-kick":"side-kick",
    "tmnt license to drive":"teenage-mutant-ninja-turtles-license-to-drive",
    "teenage mutant ninja turtles: license to drive":"teenage-mutant-ninja-turtles-license-to-drive",
    "paw patrol adventure tour":"paw-patrol-adventure-tour",
    "skye's high flyer":"skyes-high-flyer",
    "skye’s high flyer":"skyes-high-flyer",
    "zuma's zoomers":"zumas-zoomers",
    "zuma’s zoomers":"zumas-zoomers"
  };

  window.NAEHEN_MOVIE_PARK = {
    park: {
      slug:"movie-park-germany",
      name:"Movie Park Germany",
      location:"Bottrop-Kirchhellen · Nordrhein-Westfalen",
      liveDataUrl:"./live-movie-park.json",
      cardImage:A+"movie-park-studio-tour/2024/MPST_MAIN_2024.jpg",
      cardCopy:"Hollywood in Germany · Live-Wartezeiten, Nähprotokoll und 32 Attraktionen.",
      disclaimer:"Kein offizielles Angebot des Movie Park Germany."
    },
    rides,
    worlds,
    fonts,
    aliases,
    rideConfig:{
      "van-helsings-factory":{singleRider:true},
      "movie-park-studio-tour":{singleRider:true},
      "ghost-chasers":{singleRider:true}
    },
    exclusions:{
      ids:["ahoj-brause-horror-lab","unhallowed-2-show","the-lost-temple"],
      namePatterns:["horror lab","unhallowed","the lost temple"]
    }
  };
})();