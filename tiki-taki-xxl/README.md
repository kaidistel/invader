# Tiki Taki XXL – Operator Simulator (Fan-Projekt)

Browserbasierter Simulator der KMG XXL von Robert Paulsen. Keine originale KMG-Steuerungssoftware und kein Hersteller-CAD.

## In GitHub Pages
`https://kaidistel.github.io/invader/tiki-taki-xxl/`

- `index.html`: Steuerpult, Game-Loop, Verriegelungsprüfung und GLB-Importer
- `model.js`: lokal ohne zusätzliche GLB prozedural generiertes Tiki-Taki-Rig
- Der Nutzer kann die detailliertere, fototexturierte **Tiki_Taki_XXL_V3_Reference_Reconstruction.glb** über „Modell laden (.glb)“ in derselben Seite aktivieren. Diese GLB wurde separat in ChatGPT aus den bereitgestellten Referenzfotos erzeugt; sie ist noch **nicht** im Repository hochgeladen.
- „Eigenes Tiki Taki Modell als GLB exportieren“ speichert die jeweils aktive Geometrie als GLB.

## Referenzabgleich
Gesichert dokumentiert: KMG XXL, Paulsen, Baujahr 2025, 20 Sitzplätze, 18 × 13 m Standfläche, 46,5 m maximale Bewegungshöhe. Weitere Abmessungen sind mangels Zeichnungen approximiert.

- 4 Sitzreihen à 5 Sitze an einem starren rotierenden Stern, nach innen ausgerichtet
- je 5 grüne Verriegelungs-LEDs auf einer zentralen Anzeige **über dem mittleren Sitz**
- 20 individuell benannte Bügel `RESTRAINT_01`–`RESTRAINT_20`
- `MAIN_PENDULUM_PIVOT`: Hauptpendelachse am oberen Lager
- `GONDOLA_SPIN_PIVOT`: zweite, mit dem Pendel bewegte lokale Rotationsachse
- gelbe A-Rahmen-Stützen, pinke Lauflichter, riesige Tiki-Masken, Vorderfront TIKI/TAKI, Tropenkulisse, Vulkan, TICKETS-Kasse

## Bedienung
1. Hauptschalter einschalten
2. Steuerung aktivieren
3. Bügel schließen (damit zunächst nur `CLOSED_UNLOCKED`)
4. Verriegelungen prüfen, anschließend leuchten alle 20 LEDs grün
5. Fahrprogramm und gewünschte Amplitude wählen und starten
6. Kontrolliert stoppen; Ausstieg erst bei stillstehenden Achsen

Not-Halt und Grenzwerte bilden **ausschließlich eine spielerische Simulation** ab.

## Technische Einschränkungen
- Nicht alle Profile, Bemalungsdetails, Bolzenpositionen, LEDs, Programme und Führungen sind durch die vier Fotos eindeutig bestimmt.
- Die lokal erstellte GLB nutzt Fototexturen aus den vom Nutzer bereitgestellten Bildern. Die `model.js`-Standardversion ersetzt sie durch selbst gezeichnete Canvas-Kulissen.
- Hosting ist über den bestehenden GitHub-Pages-Pfad vorgesehen; ein vollständiger Browser-End-to-End-Test wurde noch nicht durchgeführt.
- Der Simulator ist ein Fanprojekt, kein Fahrbetriebs- oder Sicherheitsnachweis.
