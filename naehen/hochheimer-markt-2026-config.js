(() => {
  "use strict";
  // Vorab-Onboarding 540. Hochheimer Markt 2026: die vollständige Freigabe der Beschickung folgt laut Veranstalter ab 20.10.2026.
  // Keine Live-Wartezeiten, kein Lageplan, keine automatisch recherchierten Fahrpreise.
  const rides=[
  {
    "id": "hochheim-markt26-ffh-riesenrad",
    "name": "FFH-Riesenrad",
    "operator": "Barth (vorläufig)",
    "operatorFull": "Barth (2025 als Sonnenrad; für 2026 noch vorläufig)",
    "zone": "Aussicht & Klassiker",
    "type": "Riesenrad / Sonnenrad",
    "description": "Das 45 Meter hohe FFH-Riesenrad ist das leuchtende Wahrzeichen des Marktes: 32 geschlossene Gondeln für den Ausblick über Hochheim und die Weinberge.",
    "priceEuro": null,
    "new2026": false,
    "manufacturer": "Mondial",
    "year": null,
    "dimensions": "45 m Höhe",
    "capacity": "32 Gondeln · max. 6 Personen je Gondel",
    "rideIndexUrl": "https://www.ummet-eck.de/regionen/101438-Sonnenrad-Barth-/",
    "imageUrl": "https://www.hochheim-tourismus.de/_Resources/Persistent/86827756f81790ba26c6150fc062b5324d3ba1bc/Markt-Riesenrad-Abend-800x533.jpg",
    "imageCredit": "Hochheim Tourismus · FFH-Riesenrad am Abend (Originalaufnahme vom Markt)",
    "imageSourceUrl": "https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt/fahrgeschaefte",
    "imageFallbackUrls": [],
    "sourceUrl": "https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt/fahrgeschaefte",
    "operatorConfirmed": false
  },
  {
    "id": "hochheim-markt26-wellenflug",
    "name": "Wellenflug",
    "operator": "Ludwig Roie & Söhne",
    "operatorFull": "Ludwig Roie & Söhne",
    "zone": "Aussicht & Klassiker",
    "type": "Kettenflieger / Wellenflug",
    "description": "Barockmalerei und bewegte Ketten: Der Wellenflug von Roie schwebt in eleganten Wellen über das Marktgeschehen.",
    "priceEuro": null,
    "new2026": false,
    "manufacturer": "Zierer",
    "year": null,
    "dimensions": null,
    "capacity": null,
    "rideIndexUrl": null,
    "imageUrl": "https://img.main-spitze.de/lokales/kreis-main-taunus/hochheim-kreis-main-taunus/jy0z4i-hochheim-hochheimer-markt/alternates/OG_IMAGE_1200/hochheim%20hochheimer%20markt",
    "imageCredit": "Main-Spitze · Roies beleuchteter Wellenflug auf dem Hochheimer Markt",
    "imageSourceUrl": "https://www.main-spitze.de/lokales/kreis-gross-gerau/ruesselsheim/das-2024-ausgeweitete-fahrangebot-bleibt-bestehen-5109923",
    "imageFallbackUrls": [],
    "sourceUrl": "https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt/fahrgeschaefte",
    "operatorConfirmed": true
  },
  {
    "id": "hochheim-markt26-heidi",
    "name": "Heidi The Coaster",
    "operator": "Schneider",
    "operatorFull": "Schneider & Co. OHG",
    "zone": "Achterbahn",
    "type": "Spinning Coaster",
    "description": "Schnelle Kurven, frei drehende Vierergondeln und bayrische Kulisse: Heidi liefert eine abwechslungsreiche Runde mit einer Auffahrt auf 13 Meter.",
    "priceEuro": null,
    "new2026": false,
    "manufacturer": "Reverchon",
    "year": 2019,
    "dimensions": "430 m Strecke · 13 m Höhe",
    "capacity": "40 Personen · 10 Gondeln",
    "rideIndexUrl": "https://ride-index.de/2019/09/26/heidi-the-coaster/",
    "imageUrl": "https://www.heidi-thecoaster.de/download/Heidi-Coaster-Presse-1.jpeg",
    "imageCredit": "Schneider & Co. OHG · offizielles Heidi-Coaster-Pressebild",
    "imageSourceUrl": "https://www.heidi-thecoaster.de/",
    "imageFallbackUrls": [],
    "sourceUrl": "https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt/fahrgeschaefte",
    "operatorConfirmed": true
  },
  {
    "id": "hochheim-markt26-xxl-racer",
    "name": "XXL-Racer",
    "operator": "Goetzke-Bergmann",
    "operatorFull": "Franz und Hilde Goetzke & Arnd Bergmann GbR",
    "zone": "Thrill",
    "type": "Fabbri Booster Maxx 55/16",
    "description": "Zwei Gondeln mit je acht Plätzen kreisen in bis zu 55 Metern Höhe um den mächtigen Propellerarm. Der XXL-Racer gehört zu den auffälligsten Thrillrides des Marktes.",
    "priceEuro": null,
    "new2026": false,
    "manufacturer": "Fabbri",
    "year": 2017,
    "dimensions": "bis 55 m Höhe",
    "capacity": "16 Personen · 2 Gondeln",
    "rideIndexUrl": "https://ride-index.de/2017/07/18/xxl-racer/",
    "imageUrl": "https://kermisplanner.nl/uploads/attractions/attraction-xxl-racer/1682208078_959dd252d7685e7525b8.jpg",
    "imageCredit": "Kermisplanner · XXL-Racer von Goetzke-Bergmann",
    "imageSourceUrl": "https://kermisplanner.nl/de/attraktion/xxl-racer-P3iX7qSt",
    "imageFallbackUrls": [],
    "sourceUrl": "https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt/fahrgeschaefte",
    "operatorConfirmed": true
  },
  {
    "id": "hochheim-markt26-hip-hop-fly",
    "name": "Hip Hop Fly",
    "operator": "Lagerin",
    "operatorFull": "Freizeittechnologie Romano Lagerin",
    "zone": "Thrill",
    "type": "Pendel-Rundfahrgeschäft",
    "description": "Sechs Gondeln, Schwingbewegungen und starke Dreheffekte: Der Hip Hop Fly von Lagerin verbindet Beats mit echtem Fluggefühl.",
    "priceEuro": null,
    "new2026": false,
    "manufacturer": null,
    "year": null,
    "dimensions": "26 m Höhe",
    "capacity": "24 Personen · 6 Gondeln",
    "rideIndexUrl": "https://coaster.cloud/en/attractions/c34b5339-hip-hop-fly-lagerin",
    "imageUrl": "https://cdn.coaster.cloud/attractions/VU/Fd/VUFd53JjP5QE47bDriuJA1.jpg?class=large",
    "imageCredit": "coaster.cloud · Hip Hop Fly von Lagerin",
    "imageSourceUrl": "https://coaster.cloud/en/attractions/c34b5339-hip-hop-fly-lagerin",
    "imageFallbackUrls": [],
    "sourceUrl": "https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt/fahrgeschaefte",
    "operatorConfirmed": true
  },
  {
    "id": "hochheim-markt26-break-dancer",
    "name": "Break Dancer",
    "operator": "Schramm",
    "operatorFull": "Alexander Schramm & Sohn",
    "zone": "Thrill",
    "type": "HUSS Break Dance 1",
    "description": "Vier Gondelkreuze mit 16 frei rotierenden Gondeln, markantes Casino-Design und kräftige Reko: Schramms Break Dancer ist ein Klassiker in Hochheim.",
    "priceEuro": null,
    "new2026": false,
    "manufacturer": "HUSS",
    "year": null,
    "dimensions": null,
    "capacity": "32 Personen · 16 Gondeln",
    "rideIndexUrl": null,
    "imageUrl": "https://www.kirmesecke.de/Bilder/poi/678/bd-schramm-waeldchestag23-c-UMM-s-schoen.jpg",
    "imageCredit": "Ummet-Eck / Christian Schön · Break Dancer von Schramm (nicht Hannen / Dreher / Bonner)",
    "imageSourceUrl": "https://www.kirmesecke.de/regionen/101349-Break-Dancer-Schramm-/",
    "imageFallbackUrls": [],
    "sourceUrl": "https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt/fahrgeschaefte",
    "operatorConfirmed": true
  },
  {
    "id": "hochheim-markt26-autoscooter",
    "name": "Autoscooter",
    "operator": "Rudolf Barth & Sohn",
    "operatorFull": "Rudolf Barth & Sohn (Mainz)",
    "zone": "Aussicht & Klassiker",
    "type": "Autoscooter",
    "description": "Klassische Skooter-Duelle für Freunde und Familien: Barth & Sohn bringen die bewährte Fahrfläche samt Kirmesmusik auf das Weihergelände.",
    "priceEuro": null,
    "new2026": false,
    "manufacturer": null,
    "year": null,
    "dimensions": null,
    "capacity": null,
    "rideIndexUrl": null,
    "imageUrl": "https://kermisplanner.nl/uploads/attractions/attraction-autoscooter-ldquo-route-66-rdquo/1683834752_b26d8fa8b61821304870.jpg",
    "imageCredit": "Kermisplanner · Autoscooter Route 66 von Barth (Betreiberfamilie)",
    "imageSourceUrl": "https://kermisplanner.nl/de/attraktion/autoscooter-route-66-bcYP9zm3",
    "imageFallbackUrls": [],
    "sourceUrl": "https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt/fahrgeschaefte",
    "operatorConfirmed": true
  },
  {
    "id": "hochheim-markt26-1001-nacht",
    "name": "1001 Nacht",
    "operator": "Hartmann & Söhne",
    "operatorFull": "Michael Hartmann & Söhne",
    "zone": "Thrill",
    "type": "Weber Fliegender Teppich",
    "description": "Der große Fliegende Teppich schwingt seine Sitzreihe in bis zu 27 Metern Fahrhöhe. Märchenhafte Oriental-Optik trifft auf klassisches Kirmesgefühl.",
    "priceEuro": null,
    "new2026": false,
    "manufacturer": "Weber",
    "year": 1983,
    "dimensions": "27 m Fahrhöhe",
    "capacity": "40 Personen",
    "rideIndexUrl": "https://kuestenkirmes.de/1001-nacht-hartmann/",
    "imageUrl": "https://www.ummet-eck.de/Bilder/fotosets/678/1001-nacht-hartmann-gertruedchen-c-ummeteck-schoen-04.jpg",
    "imageCredit": "Ummet-Eck / Christian Schön · 1001 Nacht von Hartmann",
    "imageSourceUrl": "https://www.ummet-eck.de/bildgalerien/354-1001-Nacht-Hartmann-Kirmes-Fahrgeschaeft-bild-5233/",
    "imageFallbackUrls": [],
    "sourceUrl": "https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt/fahrgeschaefte",
    "operatorConfirmed": true
  },
  {
    "id": "hochheim-markt26-disco-express",
    "name": "Disco Express 2",
    "operator": "Roie",
    "operatorFull": "Roie (Altenstadt)",
    "zone": "Aussicht & Klassiker",
    "type": "Bertazzon Musik-Express",
    "description": "Die neuere Bertazzon-Anlage von Roie, nicht der alte Mack-Express: Berg-und-Tal-Fahrt, bunte Lichteffekte und kräftiger Sound.",
    "priceEuro": null,
    "new2026": false,
    "manufacturer": "Bertazzon",
    "year": 2024,
    "dimensions": null,
    "capacity": null,
    "rideIndexUrl": "https://ride-index.de/2025/04/04/disco-express-roie-2/",
    "imageUrl": "https://www.usinger-anzeiger.de/assets/images/39/446/39446272-die-berg-und-talbahn-hat-ihren-stammplatz-an-der-schwalbacher-strasse-bezogen-1N70.jpg",
    "imageCredit": "Usinger Anzeiger · neuer Bertazzon Disco Express 2 von Roie (2025)",
    "imageSourceUrl": "https://www.kirmesforum.de/threads/bad-homburg-v-d-h%C3%B6he-61350-laternenfest-29-8-1-9-2025.74634/",
    "imageFallbackUrls": [],
    "sourceUrl": "https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt/fahrgeschaefte",
    "operatorConfirmed": true
  },
  {
    "id": "hochheim-markt26-time-factory",
    "name": "Time Factory",
    "operator": "Hartmann-Griehs",
    "operatorFull": "Hartmann / Griehs",
    "zone": "Laufgeschäfte",
    "type": "Funhouse / Laufgeschäft",
    "description": "Die Time Factory stellt mit Spiegeln, begehbaren Hindernissen und Verwirreffekten das Raumgefühl auf den Kopf.",
    "priceEuro": null,
    "new2026": false,
    "manufacturer": "Dietz",
    "year": 2006,
    "dimensions": "18,6 × 11 × 9 m",
    "capacity": null,
    "rideIndexUrl": null,
    "imageUrl": "https://www.hochheim-tourismus.de/_Resources/Persistent/810e8ce1bb4ef3152ad109b6249d4d0484507e82/Markt-Fahrgeschaefte-Time-Factory-800x479.jpg",
    "imageCredit": "Hochheim Tourismus · Time Factory, Originalbild von Hochheim",
    "imageSourceUrl": "https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt/fahrgeschaefte",
    "imageFallbackUrls": [],
    "sourceUrl": "https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt/fahrgeschaefte",
    "operatorConfirmed": true
  },
  {
    "id": "hochheim-markt26-crazy-time-2",
    "name": "Crazy Time 2",
    "operator": "Thoma",
    "operatorFull": "Toni Thoma (Andernach)",
    "zone": "Kinderfahrgeschäfte",
    "type": "Kinderautoscooter",
    "description": "Die kleinen Fahrerinnen und Fahrer dürfen bei Toni Thomas Crazy Time 2 selbst das Steuer übernehmen – mit eigener Scooterbahn.",
    "priceEuro": null,
    "new2026": false,
    "manufacturer": null,
    "year": null,
    "dimensions": null,
    "capacity": null,
    "rideIndexUrl": null,
    "imageUrl": "https://kermisplanner.nl/uploads/attractions/attraction-crazy-time-2/1675977400_c5567c2fccbe4664694b.jpg",
    "imageCredit": "Kermisplanner · Crazy Time 2 von Toni Thoma",
    "imageSourceUrl": "https://kermisplanner.nl/de/attraktion/crazy-time-2-p5y2FEDO",
    "imageFallbackUrls": [],
    "sourceUrl": "https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt/fahrgeschaefte",
    "operatorConfirmed": true
  },
  {
    "id": "hochheim-markt26-euro-car",
    "name": "Euro-Car",
    "operator": "Sottile / Barth",
    "operatorFull": "Aldo Sottile & Margit Barth",
    "zone": "Kinderfahrgeschäfte",
    "type": "Kinder-Fahrschleife",
    "description": "Sprechende Autos und originelle Figuren machen die Rundfahrt im Euro-Car zu einem kleinen Abenteuer für Kinder.",
    "priceEuro": null,
    "new2026": false,
    "manufacturer": null,
    "year": null,
    "dimensions": null,
    "capacity": null,
    "rideIndexUrl": null,
    "imageUrl": "https://www.hochheim-tourismus.de/_Resources/Persistent/1449a1405552a3af63fd84d4314f41778391ee6a/Markt-Fahrgeschaefte-Euro-Car-2023-640x449.jpg",
    "imageCredit": "Hochheim Tourismus · Euro-Car am Markt, Originalaufnahme",
    "imageSourceUrl": "https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt/fahrgeschaefte",
    "imageFallbackUrls": [],
    "sourceUrl": "https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt/fahrgeschaefte",
    "operatorConfirmed": true
  },
  {
    "id": "hochheim-markt26-maerchen-karussell",
    "name": "Märchen-Karussell",
    "operator": "Noch nicht bestätigt",
    "operatorFull": "Noch nicht bestätigt",
    "zone": "Kinderfahrgeschäfte",
    "type": "Kinderkarussell",
    "description": "Märchenfiguren, Pferde und Kutschen sorgen für eine gemütliche Karussellrunde für die jüngsten Marktbesucher. Betreiber und Foto werden nach finaler Bekanntgabe ergänzt.",
    "priceEuro": null,
    "new2026": false,
    "manufacturer": null,
    "year": null,
    "dimensions": null,
    "capacity": null,
    "rideIndexUrl": "https://ride-index.de/2009/12/14/maerchen-kinderkarusell-koehler-pfeiffer/",
    "imageUrl": "",
    "imageCredit": "",
    "imageSourceUrl": "",
    "imageFallbackUrls": [],
    "sourceUrl": "https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt/fahrgeschaefte",
    "operatorConfirmed": false
  },
  {
    "id": "hochheim-markt26-mini-jet",
    "name": "Mini Jet",
    "operator": "Noch nicht bestätigt",
    "operatorFull": "Noch nicht bestätigt",
    "zone": "Kinderfahrgeschäfte",
    "type": "Kinderflieger / Pressluft-Jet",
    "description": "Kleine Piloten steigen in farbenfrohe Flieger und können ihre Flughöhe selbst bestimmen. Der aktuelle Betreiber und eine eindeutige Fotoreferenz stehen noch aus.",
    "priceEuro": null,
    "new2026": false,
    "manufacturer": null,
    "year": null,
    "dimensions": null,
    "capacity": null,
    "rideIndexUrl": null,
    "imageUrl": "",
    "imageCredit": "",
    "imageSourceUrl": "",
    "imageFallbackUrls": [],
    "sourceUrl": "https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt/fahrgeschaefte",
    "operatorConfirmed": false
  }
];
  const worlds={
  "hochheim-markt26-ffh-riesenrad": {
    "label": "FFH-RIESENRAD · BARTH (VORLÄUFIG)",
    "line": "Das 45 Meter hohe FFH-Riesenrad ist das leuchtende Wahrzeichen des Marktes: 32 geschlossene Gondeln für den Ausblick über Hochheim und die Weinberge.",
    "artUrl": "https://www.hochheim-tourismus.de/_Resources/Persistent/86827756f81790ba26c6150fc062b5324d3ba1bc/Markt-Riesenrad-Abend-800x533.jpg",
    "imageCredit": "Hochheim Tourismus · FFH-Riesenrad am Abend (Originalaufnahme vom Markt)",
    "imageSourceUrl": "https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt/fahrgeschaefte"
  },
  "hochheim-markt26-wellenflug": {
    "label": "WELLENFLUG · LUDWIG ROIE & SÖHNE",
    "line": "Barockmalerei und bewegte Ketten: Der Wellenflug von Roie schwebt in eleganten Wellen über das Marktgeschehen.",
    "artUrl": "https://img.main-spitze.de/lokales/kreis-main-taunus/hochheim-kreis-main-taunus/jy0z4i-hochheim-hochheimer-markt/alternates/OG_IMAGE_1200/hochheim%20hochheimer%20markt",
    "imageCredit": "Main-Spitze · Roies beleuchteter Wellenflug auf dem Hochheimer Markt",
    "imageSourceUrl": "https://www.main-spitze.de/lokales/kreis-gross-gerau/ruesselsheim/das-2024-ausgeweitete-fahrangebot-bleibt-bestehen-5109923"
  },
  "hochheim-markt26-heidi": {
    "label": "HEIDI THE COASTER · SCHNEIDER",
    "line": "Schnelle Kurven, frei drehende Vierergondeln und bayrische Kulisse: Heidi liefert eine abwechslungsreiche Runde mit einer Auffahrt auf 13 Meter.",
    "artUrl": "https://www.heidi-thecoaster.de/download/Heidi-Coaster-Presse-1.jpeg",
    "imageCredit": "Schneider & Co. OHG · offizielles Heidi-Coaster-Pressebild",
    "imageSourceUrl": "https://www.heidi-thecoaster.de/"
  },
  "hochheim-markt26-xxl-racer": {
    "label": "XXL-RACER · GOETZKE-BERGMANN",
    "line": "Zwei Gondeln mit je acht Plätzen kreisen in bis zu 55 Metern Höhe um den mächtigen Propellerarm. Der XXL-Racer gehört zu den auffälligsten Thrillrides des Marktes.",
    "artUrl": "https://kermisplanner.nl/uploads/attractions/attraction-xxl-racer/1682208078_959dd252d7685e7525b8.jpg",
    "imageCredit": "Kermisplanner · XXL-Racer von Goetzke-Bergmann",
    "imageSourceUrl": "https://kermisplanner.nl/de/attraktion/xxl-racer-P3iX7qSt"
  },
  "hochheim-markt26-hip-hop-fly": {
    "label": "HIP HOP FLY · LAGERIN",
    "line": "Sechs Gondeln, Schwingbewegungen und starke Dreheffekte: Der Hip Hop Fly von Lagerin verbindet Beats mit echtem Fluggefühl.",
    "artUrl": "https://cdn.coaster.cloud/attractions/VU/Fd/VUFd53JjP5QE47bDriuJA1.jpg?class=large",
    "imageCredit": "coaster.cloud · Hip Hop Fly von Lagerin",
    "imageSourceUrl": "https://coaster.cloud/en/attractions/c34b5339-hip-hop-fly-lagerin"
  },
  "hochheim-markt26-break-dancer": {
    "label": "BREAK DANCER · SCHRAMM",
    "line": "Vier Gondelkreuze mit 16 frei rotierenden Gondeln, markantes Casino-Design und kräftige Reko: Schramms Break Dancer ist ein Klassiker in Hochheim.",
    "artUrl": "https://www.kirmesecke.de/Bilder/poi/678/bd-schramm-waeldchestag23-c-UMM-s-schoen.jpg",
    "imageCredit": "Ummet-Eck / Christian Schön · Break Dancer von Schramm (nicht Hannen / Dreher / Bonner)",
    "imageSourceUrl": "https://www.kirmesecke.de/regionen/101349-Break-Dancer-Schramm-/"
  },
  "hochheim-markt26-autoscooter": {
    "label": "AUTOSCOOTER · RUDOLF BARTH & SOHN",
    "line": "Klassische Skooter-Duelle für Freunde und Familien: Barth & Sohn bringen die bewährte Fahrfläche samt Kirmesmusik auf das Weihergelände.",
    "artUrl": "https://kermisplanner.nl/uploads/attractions/attraction-autoscooter-ldquo-route-66-rdquo/1683834752_b26d8fa8b61821304870.jpg",
    "imageCredit": "Kermisplanner · Autoscooter Route 66 von Barth (Betreiberfamilie)",
    "imageSourceUrl": "https://kermisplanner.nl/de/attraktion/autoscooter-route-66-bcYP9zm3"
  },
  "hochheim-markt26-1001-nacht": {
    "label": "1001 NACHT · HARTMANN & SÖHNE",
    "line": "Der große Fliegende Teppich schwingt seine Sitzreihe in bis zu 27 Metern Fahrhöhe. Märchenhafte Oriental-Optik trifft auf klassisches Kirmesgefühl.",
    "artUrl": "https://www.ummet-eck.de/Bilder/fotosets/678/1001-nacht-hartmann-gertruedchen-c-ummeteck-schoen-04.jpg",
    "imageCredit": "Ummet-Eck / Christian Schön · 1001 Nacht von Hartmann",
    "imageSourceUrl": "https://www.ummet-eck.de/bildgalerien/354-1001-Nacht-Hartmann-Kirmes-Fahrgeschaeft-bild-5233/"
  },
  "hochheim-markt26-disco-express": {
    "label": "DISCO EXPRESS 2 · ROIE",
    "line": "Die neuere Bertazzon-Anlage von Roie, nicht der alte Mack-Express: Berg-und-Tal-Fahrt, bunte Lichteffekte und kräftiger Sound.",
    "artUrl": "https://www.usinger-anzeiger.de/assets/images/39/446/39446272-die-berg-und-talbahn-hat-ihren-stammplatz-an-der-schwalbacher-strasse-bezogen-1N70.jpg",
    "imageCredit": "Usinger Anzeiger · neuer Bertazzon Disco Express 2 von Roie (2025)",
    "imageSourceUrl": "https://www.kirmesforum.de/threads/bad-homburg-v-d-h%C3%B6he-61350-laternenfest-29-8-1-9-2025.74634/"
  },
  "hochheim-markt26-time-factory": {
    "label": "TIME FACTORY · HARTMANN-GRIEHS",
    "line": "Die Time Factory stellt mit Spiegeln, begehbaren Hindernissen und Verwirreffekten das Raumgefühl auf den Kopf.",
    "artUrl": "https://www.hochheim-tourismus.de/_Resources/Persistent/810e8ce1bb4ef3152ad109b6249d4d0484507e82/Markt-Fahrgeschaefte-Time-Factory-800x479.jpg",
    "imageCredit": "Hochheim Tourismus · Time Factory, Originalbild von Hochheim",
    "imageSourceUrl": "https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt/fahrgeschaefte"
  },
  "hochheim-markt26-crazy-time-2": {
    "label": "CRAZY TIME 2 · THOMA",
    "line": "Die kleinen Fahrerinnen und Fahrer dürfen bei Toni Thomas Crazy Time 2 selbst das Steuer übernehmen – mit eigener Scooterbahn.",
    "artUrl": "https://kermisplanner.nl/uploads/attractions/attraction-crazy-time-2/1675977400_c5567c2fccbe4664694b.jpg",
    "imageCredit": "Kermisplanner · Crazy Time 2 von Toni Thoma",
    "imageSourceUrl": "https://kermisplanner.nl/de/attraktion/crazy-time-2-p5y2FEDO"
  },
  "hochheim-markt26-euro-car": {
    "label": "EURO-CAR · SOTTILE / BARTH",
    "line": "Sprechende Autos und originelle Figuren machen die Rundfahrt im Euro-Car zu einem kleinen Abenteuer für Kinder.",
    "artUrl": "https://www.hochheim-tourismus.de/_Resources/Persistent/1449a1405552a3af63fd84d4314f41778391ee6a/Markt-Fahrgeschaefte-Euro-Car-2023-640x449.jpg",
    "imageCredit": "Hochheim Tourismus · Euro-Car am Markt, Originalaufnahme",
    "imageSourceUrl": "https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt/fahrgeschaefte"
  },
  "hochheim-markt26-maerchen-karussell": {
    "label": "MÄRCHEN-KARUSSELL · NOCH NICHT BESTÄTIGT",
    "line": "Märchenfiguren, Pferde und Kutschen sorgen für eine gemütliche Karussellrunde für die jüngsten Marktbesucher. Betreiber und Foto werden nach finaler Bekanntgabe ergänzt.",
    "artUrl": "",
    "imageCredit": "",
    "imageSourceUrl": ""
  },
  "hochheim-markt26-mini-jet": {
    "label": "MINI JET · NOCH NICHT BESTÄTIGT",
    "line": "Kleine Piloten steigen in farbenfrohe Flieger und können ihre Flughöhe selbst bestimmen. Der aktuelle Betreiber und eine eindeutige Fotoreferenz stehen noch aus.",
    "artUrl": "",
    "imageCredit": "",
    "imageSourceUrl": ""
  }
};
  const fonts={
  "hochheim-markt26-ffh-riesenrad": {
    "fontFamily": "'Cinzel Decorative',serif",
    "theme": "hochheim26-ffh-riesenrad"
  },
  "hochheim-markt26-wellenflug": {
    "fontFamily": "'Rye',serif",
    "theme": "hochheim26-wellenflug"
  },
  "hochheim-markt26-heidi": {
    "fontFamily": "'Trade Winds',cursive",
    "theme": "hochheim26-heidi"
  },
  "hochheim-markt26-xxl-racer": {
    "fontFamily": "'Black Ops One',sans-serif",
    "theme": "hochheim26-xxl-racer"
  },
  "hochheim-markt26-hip-hop-fly": {
    "fontFamily": "'Orbitron',sans-serif",
    "theme": "hochheim26-hip-hop-fly"
  },
  "hochheim-markt26-break-dancer": {
    "fontFamily": "'Fascinate Inline',serif",
    "theme": "hochheim26-break-dancer"
  },
  "hochheim-markt26-autoscooter": {
    "fontFamily": "'Monoton',sans-serif",
    "theme": "hochheim26-autoscooter"
  },
  "hochheim-markt26-1001-nacht": {
    "fontFamily": "'Almendra Display',serif",
    "theme": "hochheim26-1001-nacht"
  },
  "hochheim-markt26-disco-express": {
    "fontFamily": "'Bungee Shade',sans-serif",
    "theme": "hochheim26-disco-express"
  },
  "hochheim-markt26-time-factory": {
    "fontFamily": "'Rubik Glitch',sans-serif",
    "theme": "hochheim26-time-factory"
  },
  "hochheim-markt26-crazy-time-2": {
    "fontFamily": "'Chango',sans-serif",
    "theme": "hochheim26-crazy-time-2"
  },
  "hochheim-markt26-euro-car": {
    "fontFamily": "'Bangers',cursive",
    "theme": "hochheim26-euro-car"
  },
  "hochheim-markt26-maerchen-karussell": {
    "fontFamily": "'IM Fell English SC',serif",
    "theme": "hochheim26-maerchen-karussell"
  },
  "hochheim-markt26-mini-jet": {
    "fontFamily": "'Poiret One',sans-serif",
    "theme": "hochheim26-mini-jet"
  }
};
  const aliases={
  "ffh-riesenrad": "hochheim-markt26-ffh-riesenrad",
  "wellenflug": "hochheim-markt26-wellenflug",
  "heidi the coaster": "hochheim-markt26-heidi",
  "xxl-racer": "hochheim-markt26-xxl-racer",
  "hip hop fly": "hochheim-markt26-hip-hop-fly",
  "break dancer": "hochheim-markt26-break-dancer",
  "autoscooter": "hochheim-markt26-autoscooter",
  "1001 nacht": "hochheim-markt26-1001-nacht",
  "disco express 2": "hochheim-markt26-disco-express",
  "time factory": "hochheim-markt26-time-factory",
  "crazy time 2": "hochheim-markt26-crazy-time-2",
  "euro-car": "hochheim-markt26-euro-car",
  "märchen-karussell": "hochheim-markt26-maerchen-karussell",
  "mini jet": "hochheim-markt26-mini-jet",
  "breakdance": "hochheim-markt26-break-dancer",
  "disco express": "hochheim-markt26-disco-express",
  "sonnenrad": "hochheim-markt26-ffh-riesenrad"
};
  const rideConfig={
  "hochheim-markt26-ffh-riesenrad": {
    "singleRider": false
  },
  "hochheim-markt26-wellenflug": {
    "singleRider": false
  },
  "hochheim-markt26-heidi": {
    "singleRider": false
  },
  "hochheim-markt26-xxl-racer": {
    "singleRider": false
  },
  "hochheim-markt26-hip-hop-fly": {
    "singleRider": false
  },
  "hochheim-markt26-break-dancer": {
    "singleRider": false
  },
  "hochheim-markt26-autoscooter": {
    "singleRider": false
  },
  "hochheim-markt26-1001-nacht": {
    "singleRider": false
  },
  "hochheim-markt26-disco-express": {
    "singleRider": false
  },
  "hochheim-markt26-time-factory": {
    "singleRider": false
  },
  "hochheim-markt26-crazy-time-2": {
    "singleRider": false
  },
  "hochheim-markt26-euro-car": {
    "singleRider": false
  },
  "hochheim-markt26-maerchen-karussell": {
    "singleRider": false
  },
  "hochheim-markt26-mini-jet": {
    "singleRider": false
  }
};
  window.NAEHEN_HOCHHEIMER_MARKT_2026={
    park:{
      slug:"hochheimer-markt-2026",
      kind:"fair",
      name:"540. Hochheimer Markt 2026",
      location:"Hochheim am Main · Weihergelände · 06.–10.11.2026",
      startDate:"2026-11-06",endDate:"2026-11-10",
      officialUrl:"https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt",dateSourceUrl:"https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt/programm-oeffnungszeiten",lineupSourceUrl:"https://www.hochheim-tourismus.de/veranstaltungen/hochheimer-markt/fahrgeschaefte",
      liveDataUrl:null,liveWaits:false,supportsPostedWait:false,sortMode:"configured",
      fairZones:["Thrill","Achterbahn","Aussicht & Klassiker","Laufgeschäfte","Kinderfahrgeschäfte"],
      receiptTitle:"540. HOCHHEIMER MARKT 2026",receiptLocation:"HOCHHEIM AM MAIN · WEIHERGELÄNDE",
      cardImage:"https://www.rheinmain4family.de/fileadmin/bilder/RheinMain4Family/Events/2010-HM-Fahrgeschaefte_25.jpg",
      cardImageFallback:"https://www.hochheim-tourismus.de/_Resources/Persistent/86827756f81790ba26c6150fc062b5324d3ba1bc/Markt-Riesenrad-Abend-800x533.jpg",
      cardImageCredit:"RheinMain4Family · Hochheimer Markt (historisches Eventfoto vom Riesenrad)",
      cardImageSourceUrl:"https://www.rheinmain4family.de/events/show/event/hochheimer-markt.html",
      cardCopy:"6.–10. November · 540. Markt · 14 vorläufig gelistete Attraktionen · Finale am Dienstag 19 Uhr",
      noLiveLabel:"MARKT · KEINE LIVE-WARTEZEITEN",
      noLiveMessage:"Für den Hochheimer Markt gibt es keine öffentlich zugänglichen Live-Wartezeiten. NÄHEN misst nur deine persönliche Queue.",
      noLiveAlarmMessage:"Öffentliche Wartezeit-Alarme sind ohne Live-Feed deaktiviert.",
      disclaimer:"Unabhängiger NÄHEN-Fan-Begleiter, kein offizielles Angebot der Stadt Hochheim. Vorläufige Attraktionsübersicht: 14 auf der Veranstalterseite gelistete Geschäfte (Abruf 12.10.2026). Die Veranstalterseite kündigt die endgültige Bekanntgabe ab 20.10.2026 an. Betreiberangaben sind, soweit 2026 nicht bestätigt, als vorläufig gekennzeichnet; bei Märchen-Karussell und Mini Jet fehlen eindeutige Betreiber und Fotos. Für Disco Express verwenden wir die neue Bertazzon-Anlage von Roie, für Break Dancer Schramms Geschäft – keine Bilder fremder Anlagen. Fahrpreise ausschließlich manuell."
    },
    rides,worlds,fonts,aliases,rideConfig,
    exclusions:{ids:[],namePatterns:[]}
  };
})();