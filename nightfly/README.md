# Nightfly – spielbare Browser-Simulation

## Starten
Doppelklick auf **Start-Simulation.cmd** in diesem Ordner.
Der lokale Server läuft ausschließlich auf 127.0.0.1:4173. Die Simulation öffnet sich im Standardbrowser.
Node.js muss vorhanden sein (auf diesem PC bereits installiert). Keine Paketinstallation und keine Internetverbindung erforderlich.
Alternativ: `node server.mjs`, danach http://127.0.0.1:4173 öffnen.
Die HTML-Datei nicht direkt per Doppelklick öffnen: Browser benötigen HTTP zum Laden des GLB-Modells.

## Bedienung
1. **Fahrstellung** hebt den Hauptträger in etwa 9 Sekunden an.
2. **Gondelkreuz**: Regler von −12 bis +12 U/min; maximal 0,8 U/min pro Sekunde Beschleunigung, mit sanftem Kraftaufbau.
3. **Pendeln**: Der Antrieb baut die Schaukelbewegung auf. Der Leistungsregler bestimmt die Auslenkung.
4. **Überschlag links/rechts**: Der Arm läuft ohne Winkelbegrenzung rundherum.
5. **Pfeil links / rechts halten**: manueller Armantrieb; loslassen lässt den Arm frei auspendeln.
6. **Frei schwingen** / **Festbremsen**: alle Gondeln lösen oder ihre aktuellen relativen Winkel halten.
   Die vier G1–G4-Tasten schalten einzelne Bremsen.
7. **Ladestellung** stoppt und indexiert Arm, Kreuz und Gondeln, bevor das Hauptgestell abgesenkt wird.

**R**: Gondeln freigeben. **B**: Gondeln festbremsen. **V**: alle Bremsen umschalten. **P**: Pause. **Leertaste**: Not-Halt.
Der Not-Halt bremst die Antriebe und setzt die Gondelbremsen. Mit Fahrstellung wird wieder freigegeben.
Zurücksetzen stellt die anfängliche Ladestellung wieder her.

Kamera: linke Maustaste drehen, Mausrad zoomen, rechte Maustaste verschieben.
Übersicht, Frontansicht und Mitfahrkamera sowie Abendlicht sind über die Ansichtstasten erreichbar.

## Modell und Dynamik
- Verwendet den aktuellen Export von Desktop/nightfly.blend mit kompaktem 3,10-m-Gondelkreuz.
- Originale Texturabbildungen und Grundmaterialien sind im GLB eingebettet. Blender-Prozedurshader werden durch glTF nicht vollständig übertragen.
- Visuelle Geometrie wird nach Material und bewegter Baugruppe zusammengefasst.
- Fester Physikzeitschritt: 1/120 s, unabhängig von der Bildrate.
- Arm: vereinfachtes motorisiertes Pendel mit Schwerkraft, Dämpfung, Drehmoment und unbegrenztem Winkel.
- Gondeln: vier unabhängige eindimensionale Drehgelenke. Schwerkraft, Beschleunigung der Aufhängung und Coriolisanteil wirken auf einen modellierten Schwerpunkt unter der Achse; erhöhtes Trägheitsmoment, viskose und geschwindigkeitsabhängige Dämpfung.
- Gondelbremsen sperren den aktuellen relativen Winkel.
- Die sichtbaren Gelenke bleiben miteinander verbunden; Hydraulikzylinder folgen dem Hub.
- Keine vollständige Kollisionsphysik zwischen Gondeln, Gestell und Station. Keine technische Auslegung oder verifizierte Herstellerphysik.
- Das Blender-Original wird beim Spielen nicht verändert.

## Dateien
- src/main.js: Three.js-Ansicht, Modellaufbereitung, Gelenke, Gondeldynamik und Bedienoberfläche.
- src/dynamics.js: unabhängige Fahrzustände und Armdynamik.
- public/nightfly.glb: exportiertes Modell.
- vendor/: lokale Three.js-Version 0.158.0 (MIT-Lizenz liegt bei).
- server.mjs: lokaler statischer HTTP-Server.
- tests/dynamics.test.mjs: automatische Verhaltenstests.

Tests: `npm test` oder `node --test tests/dynamics.test.mjs`.

Verwendete offizielle technische Referenzen:
https://threejs.org/docs/pages/GLTFLoader.html
https://threejs.org/docs/pages/Object3D.html

Hubkorrektur: Der Hauptarm behält beim Anheben seinen festen Montagewinkel zum Hauptgestell. Die automatische Gegenrotation wurde entfernt; in Fahrstellung steht die Armachse etwa 23,3 Grad geneigt. Die Ladestellung bleibt erhalten.

## Vollständige Hotkey-Belegung

Die gleichen Tasten stehen direkt an den Bedienelementen; F1 öffnet die Übersicht.

| Taste | Funktion |
|---|---|
| O | Alle 16 Bügel öffnen |
| L | Alle 16 Bügel schließen |
| C | Bügel auf / zu umschalten |
| U | Fahrstellung anheben |
| J | In Ladestellung zurückfahren |
| A | Gondelkreuz links (−12 U/min) |
| S | Gondelkreuz rechts (+12 U/min) |
| D | Gondelkreuz stoppen |
| Q | Drehzahl −0,5 U/min |
| E | Drehzahl +0,5 U/min |
| W | Pendelprogramm |
| H | Arm sanft anhalten |
| Y | Überschläge links |
| X | Überschläge rechts |
| ← | Arm manuell links (halten) |
| → | Arm manuell rechts (halten) |
| + | Antriebsleistung +5 % |
| − | Antriebsleistung −5 % |
| R | Alle Gondeln frei |
| B | Alle Gondeln festbremsen |
| V | Alle Gondelbremsen umschalten |
| 1 | Bremse Gondel 1 |
| 2 | Bremse Gondel 2 |
| 3 | Bremse Gondel 3 |
| 4 | Bremse Gondel 4 |
| P | Pause / weiter |
| Leertaste | Not-Halt |
| 0 | Simulation zurücksetzen |
| 5 | Kamera Übersicht |
| 6 | Kamera Front |
| 7 | Mitfahrkamera |
| N | Abendlicht umschalten |
| F1 | Tastenübersicht öffnen / schließen |
| Esc | Hilfe schließen |

Buchstabentasten folgen der Tastaturbeschriftung (auch deutsches Y). Strg-/Alt-/Windows-Kombinationen werden nicht abgefangen. Pfeiltasten in einem fokussierten Schieberegler bedienen den Regler.
## Sicherheitsbügel
Alle 16 originalen Bügelscharniere sind animiert. Öffnen und Schließen dauert jeweils etwa 2,8 Sekunden, mit sanftem Anlauf und Abbremsen. Öffnungswinkel: etwa 66 Grad.
Öffnen ist nur in vollständig stehender Ladestellung mit ausgerichteten und gebremsten Gondeln möglich. Während offene Bügel oder eine laufende Schließbewegung vorliegen, bleibt das Anheben gesperrt. Gondelbremsen können erst nach vollständigem Schließen wieder gelöst werden. Reset startet mit geschlossenen Bügeln.
