# Tiki Taki XXL — Detailabgleich und Qualitätskontrolle

**Aktueller Stand: 11.11.2026.** Schrittweise Rekonstruktion der XXL von Robert Paulsen, keine originale KMG-Konstruktion.

## Verbindliche Referenzen

1. Vier Nutzerfotos: Gesamtansicht, A-Rahmen, Gondeln/20 Bügel, Rückwand/Kasse
2. [KMG XXL – technisches Grundmodell](https://kmgrides.com/de/attraktion/xxl/): 4 Gondeln, 20 Sitze, 3 Mittelbauwagen; allgemeine KMG-XXL-Spezifikation 15,5 × 12,7 × 45,0 m
3. [Ride-Index Tiki Taki XXL](https://ride-index.de/2025/11/02/tiki-taxi-xxl/): Paulsen-spezifisch 18 × 13 × max. 46,5 m
4. [Volksfestefinder – Fotos / Videos](https://volksfestefinder.de/fahrgeschaeft/tiki-taki-xxl-paulsen): quadratische Sitzanordnung, Blick nach innen, weitere Fotoansichten
5. [Nordkirmes – Premieredekoration](https://nordkirmes.net/article/3503-tiki-taki-xxl-hamburger-dom-erlebt-emotionale-weltpremiere-einer-mega-schaukel/): vollständiger Frontaufbau mit Ticketkasse

**Quellenregel:** Keine unbestätigten Abstände, Lager-/Antriebsarten, Sicherheitsfunktionen oder Abmessungen als bestätigte KMG-Konstruktionsdaten bezeichnen.

## Vorgehensweise: jeweils einen Block modellieren, testen, erst dann weiter

| Nr. | Teil / sichtbares Detail | Status | Prüfung |
|---|---|---|---|
| 01 | Drei Trag-/Mittelbauunterrahmen unter der Plattform | Erste 3D-Fassung | Geometrie vorhanden, Verteilung angenähert |
| 02 | Vier große gelbe, schrägstehende Kastenprofil-Stützen | Erste 3D-Fassung | Gemeinsamer fester Tragrahmen |
| 03 | Lagerwelle, Flansche, Kränze, Schraubenköpfe | Erste 3D-Fassung | Nur Hauptpendel rotiert |
| 04 | Fußplatten, Verstärkungsbleche und geschraubte Stützenbefestigungen | Erste 3D-Fassung | Alle Teile am statischen Rahmen |
| 05 | Stahlseile/Kabelhalter am Hauptgerüst | Erste 3D-Fassung | Keine künstliche Bewegungsachse |
| 06 | Geschraubtes Checkerplate-Ladepodium mit gelben Streifen | Erste 3D-Fassung | Kollisionshöhe ca. 0,4 m |
| 07 | Pendelarm: Stahlprofil, Außenribben, Leitungen, Lichtkanten | Erste 3D-Fassung | Nur oberes Lager als Pendel-Pivot |
| 08 | Zentraler mechanischer Gondelstern mit vier starren Auslegern | Erste 3D-Fassung | Eine lokale Spin-Achse |
| 09 | Vier Fünfergruppen, je 5 nach innen gerichtete Sitzschalen | Erste 3D-Fassung | 20 unterschiedlich benannte Seats |
| 10 | Rote Polster, schwarzer hoher Rücken und seitliche Sitzwangen | Erste 3D-Fassung | Separat pro Sitz |
| 11 | 20 U-förmige Schulterbügel und Gelenkabdeckungen | Erste 3D-Fassung | Separate `RESTRAINT_01` bis `20` |
| 12 | Fünf Kontrolllinsen pro Gondel **über dem mittleren Sitz** | Erste 3D-Fassung | 20 eindeutige LED-Knoten |
| 13 | Grün nur bei bestätigtem Verriegelungszustand | Logik vorhanden | Unverriegelter Platz verhindert Start |
| 14 | Rückwand: zwei Tiki-Köpfe, Surfer, Welle und Blumen | Fototextur integriert | Ansicht aus Nutzerfoto; perspektivische Verzerrung möglich |
| 15 | Großflächige gelbe TIKI-/TAKI-Verkleidungen | Fototextur + Relief | Relief hinter dem Foto erhalten |
| 16 | Plastische mittige Tiki-Treppe/-Maske | Foto + Rückseitengeometrie | 3D-Seitenansicht noch nicht originalgetreu |
| 17 | Ticketkasse rechts, Bambusfenster, zweigeteilte Front | Foto + 3D-Schichten | Kassenposition approximiert |
| 18 | Blumenkrone und lila Vulkan der Ticketkasse | Foto + tiefer liegende 3D-Elemente | 3D-Silhouette in Seitenansicht noch ungenau |
| 19 | Tiki-Plaketten an den diagonal gelben Stützen | Erste 3D-Fassung | Farblagen/Größe noch abzugleichen |
| 20 | Lampenleisten an Trägern und Pendelarm | Erste 3D-Fassung | Sechs einzeln kontrollierbare InstancedMesh-Strips |
| 21 | Dynamische Lichtsequenzen (pink/cyan/gelb) | Simulator integriert | Unabhängig von 20 Sicherheits-LEDs |
| 22 | Gondel-, Kassen-, Gesamt-, Technik- und Onridekamera | Simulator integriert | 20 Sitzplätze anwählbar |
| 23 | Performance für entfernte Schrauben/Bolzen | Erste Optimierung | 603 kleinere Hardwareobjekte in Gesamtansicht ausgeblendet |
| 24 | Asphaltplatz, Schatten und ferne Herbstbäume | Erste 3D-Fassung | Umgebung illustrativ, keine genaue Standplatzaufnahme |
| 25 | Originale 3D-Form des Tiki-Kopfes statt Foto-Billboard | **Offen** | Benötigt eigene Sculpt-/Meshrekonstruktion |
| 26 | Fotorealistische, verzerrungsarme Rücken-, Sitz- und Bügelprofile | **Offen** | Benötigt bessere seitliche Detailfotos |
| 27 | Fahrgast-/Bügelanimation samt Ein-/Ausstieg und Körperbewegung | **Offen** | Render-/Physikabgleich |
| 28 | Originalgetreue Lautsprecher-/Lichtanordnung | **Offen** | Weitere Bilder des Aufbaus nötig |
| 29 | Komplette realitätsnahe Bedienpult-Optik | **Offen** | Originalpult bislang nicht ausreichend dokumentiert |
| 30 | Kamerafahrten, Musikplayer und Rekommandeur-Mikrofon | **Offen** | Browserberechtigungen / Audiosignalweg |
| 31 | Ende-zu-Ende-Test im echten GitHub-Pages-Browser | **Noch nicht nachgewiesen** | Browser-Test mit sichtbarem Modell und Bedienelementen |

## Nachvollziehbarkeit / aktuelle Änderungen

- Detail 01: Hauptstützen, Mittelbauunterrahmen, Lager/Flansche, Schrauben
- Detail 02: Gondelstern, 20 Sitze, Schulterbügel und Monitorrahmen
- Detail 03: Fotobasierte Tiki-Front mit zusätzlichen echten Seitenflächen
- Detail 04: sechs prüfbare Kamerapositionen
- Detail 05: animierte RGB-Lichtstreifen ohne Eingriff in die Sicherheitsanzeigen
- Detail 06: Hardware-LOD / keine dynamischen Schatten für Kleinbauteile
- Detail 07: Asphalt, schattenfähiger Boden, zurückhaltende Baumkulisse

## Feststehende Tests (aus Quellcode-Initialisierung)

- 20 `SEAT_XX`-Nodes, viermal fünf Plätze
- 20 unabhängige Schulterbügel und 20 unabhängige Kontroll-LEDs
- 6 dekorative InstancedMesh-Strips
- 603 kleinste Hardwareobjekte in LOD-Gruppe
- Quellcode der drei Module syntaktisch korrekt
- Kein Nachweis des finalen Live-Renderings; keine Behauptung von 1:1-Fotorealismus
