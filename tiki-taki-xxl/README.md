# Tiki Taki XXL · Modell V4 (Fan-Rekonstruktion)

Eine eigenständige, clientseitige Three.js-Anwendung für die KMG-XXL-Riesenschaukel von Robert Paulsen.

## Simulator / GitHub Pages
https://kaidistel.github.io/invader/tiki-taki-xxl/

- `index.html`: Bedienpult, fester Physik-Zeitschritt, Lade-/Verriegelungslogik, 20 LEDs, GLB-Loader, Kamera und GLB-Exporter.
- `model.js`: V4 des **prozeduralen Web-Modells**, einschließlich detaillierterer A-Träger, LED-Strips, Tiki-Dekoration, Kasse, Vulkan, Sitze, Wartungsdetails und Bedienkabine.

Die **fototexturierte V4-GLB** (5,5 MB, 3.719 Meshes) wurde zusätzlich separat als herunterladbare Datei erzeugt und kann mit dem Dateidialog des Simulators importiert werden. Diese GLB ist derzeit **nicht automatisch im Repository gehostet**. Der Import benötigt die Knoten `MAIN_PENDULUM_PIVOT`, `GONDOLA_SPIN_PIVOT`, `GONDOLA_1`…`GONDOLA_4`, `SEAT_01`…`SEAT_20`, `RESTRAINT_01`…`RESTRAINT_20`, `LOCK_INDICATOR_S01`…`S20`.

## Quellenabgleich
- Eigene Referenz: 4 vom Nutzer bereitgestellte Aufnahmen von Tiki Taki XXL.
- Hersteller-Typenschild (Fotografie): https://onride.de/onride-upic584757@1120 — max. Pendelwinkel **120°**, max. Gondelrotation **16 U/min** und **20 Sitzplätze**.
- https://ride-index.de/2025/11/02/tiki-taxi-xxl/ — Baujahr 2025, Aufstellfläche 18 × 13 m und Marketinghöhe 46,5 m.
- https://nordkirmes.net/article/3503-tiki-taki-xxl-hamburger-dom-erlebt-emotionale-weltpremiere-einer-mega-schaukel/ — Gesamteindruck, Kasse und Farbgestaltung.
- https://www.kirmesforum.de/threads/tiki-taki-xxl-paulsen-kmg-rides.68941/page-5 — Design/Farbgebung und LEDs.

## Grenzen und Vorsicht
Die originalen KMG-CAD-Dateien und Original-Steuerpläne sind nicht verfügbar. Unbekannte Maße bleiben Annäherungen. Die Typenschild-Höhenangabe 38,80 m und die verbreitete Angabe 46,5 m sind nicht offensichtlich äquivalent. Kein Teil der simulierten Sicherheitslogik ist eine echte KMG-Steuerung, Bedienungsanleitung oder Betriebsfreigabe.

Geprüft wurden die Quellcode-Syntax, die zwingenden Modellknoten und die Existenz von exakt 20 benannten LEDs. Ein Live-GitHub-Pages-End-to-End-Test wurde bislang nicht durchgeführt.

## Foto-Rekonstruktion (11.11.2026)

Das Standardmodell lädt die vom Nutzer bereitgestellten Fototexturen nun **automatisch** aus `photo-textures.js`. Der Nutzer muss für die neue Bemalung keine GLB mehr manuell auswählen. Verwendet werden: Panorama-Rückwand, TIKI/TAKI-Front, detaillierte komplette Ticketkasse mit Vulkanaufbau und Fenstern, geschnitzte Eingangsfigur und Bedienkabinen-Fenster. Die Fotos sind in diesem Repository als eigenständiges, base64-kodiertes WebP-Atlas-Modul enthalten und benötigen deshalb keine externen Bildhoster. Teile der Fotos sind aus perspektivischen Aufnahmen entzerrt; eine millimetergenaue Geometrie wird dadurch nicht ersetzt.

Fehlgeschlagene Fototextur-Loads zeigen einen Fehler im Simulator an; der mechanische 3D-Basisaufbau bleibt sichtbar. Die Prozeduralgeometrie ist weiterhin ein **Prototyp**, nicht KMG-CAD. Der Import einer separat erstellten, benannten GLB bleibt optional verfügbar. Der Simulator benötigt weiterhin Three.js vom CDN. Ein vollständig visueller Live-Browsertest konnte nicht durchgeführt werden.
