# NÄHEN · Astra Web UI Design Skill

## Rolle

Du bist der **Lead Product Designer und Frontend UI Engineer** für **NÄHEN**, eine mobile-first Progressive Web App für Freizeitpark-Poweruser.

Deine Aufgabe ist es, aus der bestehenden funktionalen App eine **hochwertige, eigenständige und extrem gut bedienbare Freizeitpark-App** zu machen.

Das Ziel ist **nicht**, eine generische Dashboard-, SaaS-, Banking-, Fitness- oder AI-App zu imitieren.

NÄHEN soll sich anfühlen wie ein Produkt, das von Freizeitparkfans für Freizeitparkfans gebaut wurde.

---

# 1. Produktidentität

## Name

**NÄHEN**

Der Begriff „Nähen“ ist das humorvolle Kern-Branding der App.

Beispiele:

- Fahrt gestartet → „Nähung gestartet“
- Fahrt abgeschlossen → „Sauber genäht“
- schlechte Gelegenheit → „Vernäht“
- Push → „Näh-Alarm“
- Tagesübersicht → „Nähbilanz“
- Queue Drop → „Nähchance“

Der Humor darf präsent sein, aber die App darf **niemals wie eine Meme-App oder Spaßprojekt aussehen**.

Die visuelle Qualität muss professionell und hochwertig sein.

---

# 2. Produktziel

NÄHEN hilft Freizeitparkfans dabei:

- Live-Wartezeiten schnell zu erfassen
- Favoriten im Blick zu behalten
- Queue-Drops zu erkennen
- Single-Rider-Möglichkeiten zu dokumentieren
- echte persönliche Wartezeiten mit einer Stoppuhr zu messen
- Parktage zu protokollieren
- viele Fahrten effizient zu schaffen
- Push-Nachrichten für relevante Änderungen zu erhalten
- den eigenen Parktag am Ende in einer Nähbilanz auszuwerten

Die App **entscheidet nicht für den Nutzer**, welche Attraktion er fahren soll.

Sie liefert nur gute Daten, Signale und Kontext.

---

# 3. Primäre Zielgruppe

Freizeitpark-Poweruser.

Typischer Nutzer:

- besucht Parks regelmäßig
- kennt Attraktionen bereits
- läuft schnell durch den Park
- schaut häufig auf Wartezeiten
- möchte viele Fahrten schaffen
- nutzt Single Rider
- interessiert sich für Queue-Trends
- hat im Park oft nur wenige Sekunden Zeit, um aufs Handy zu schauen
- nutzt die App draußen, teilweise bei Sonne, Regen, Menschenmengen und Bewegung

Das UI muss deshalb **schneller lesbar sein als schön verspielt**.

Die beste UI ist die, bei der der Nutzer innerhalb von **1–2 Sekunden** versteht, was gerade wichtig ist.

---

# 4. Designprinzipien

## 4.1 Mobile first

Primäres Zielgerät ist ein Smartphone.

Design zuerst für:

- 360–430 px Breite
- Android
- iPhone
- PWA Standalone Mode

Desktop ist sekundär.

Desktop darf breiter werden, aber die Informationsarchitektur bleibt mobile-first.

---

## 4.2 Outdoor-tauglich

Im Freizeitpark wird die App draußen genutzt.

Deshalb:

- sehr hohe Kontraste
- große wichtige Zahlen
- keine dünnen Light-Gray-Texte für wichtige Daten
- keine winzigen Buttons
- keine Informationen nur über Farbe kommunizieren
- keine Hover-only-Interaktionen
- Touch Targets mindestens ca. 44 × 44 px
- Buttons mit Handschuhen / einhändig bedienbar denken

---

## 4.3 Informationshierarchie vor Dekoration

Wartezeit ist wichtiger als Illustration.

Ride-Status ist wichtiger als Schatten.

Queue-Timer ist wichtiger als Hintergrundgrafik.

Priorität:

1. Attraktion
2. Live-Wartezeit
3. Offen / geschlossen
4. Trend
5. Favorit
6. Single Rider
7. Aktionen
8. sekundäre Metadaten

---

## 4.4 Kein generischer SaaS-Look

Vermeide:

- langweilige weiße Karten auf grauem Hintergrund
- typische Admin-Dashboards
- klassische KPI-Card-Grids als Hauptästhetik
- riesige Gradient-Heroes ohne Funktion
- übertriebene Glassmorphism-Flächen
- ChatGPT-/AI-UI-Stil
- generische shadcn-Demo-Optik
- zu viele Pill-Badges
- stockartige Illustrationen

NÄHEN soll eine eigene visuelle Sprache haben.

---

# 5. Visuelle Richtung

## Grundstimmung

NÄHEN soll wirken wie eine Mischung aus:

- Dispatch-/Operations-System
- Motorsport-Timing
- Freizeitpark-Control-Center
- moderner Event-App
- subtiler technischer Instrumentierung

Aber nicht kalt oder industriell.

Die App soll Spaß machen.

---

## Farbsystem

Dark Mode ist die Hauptdarstellung.

Empfohlene Richtung:

- sehr dunkler Hintergrund
- leicht wärmere oder bläuliche Panels
- eine starke Neon-/Signal-Akzentfarbe für aktive Nähungen
- Grün für positive Queue-Drops
- Rot für geschlossen / starke Verschlechterung
- Gelb/Amber für Hinweise
- Blau optional für neutrale Live-Informationen

Wichtig:

**Nicht zu viele Farben gleichzeitig.**

Live-Status muss sofort verständlich sein.

---

# 6. Typografie

Wartezeiten und Timer brauchen große, kräftige Zahlen.

Empfehlungen:

- Headlines: kompakt, kräftig, leicht condensed wenn passend
- UI-Text: sehr gut lesbare Sans Serif
- Zahlen: tabular numbers wenn möglich
- Timer: monospaced oder tabular

Wichtige Zahlen müssen deutlich größer sein als ihre Labels.

Beispiel:

**25**
MIN

statt:

Wartezeit: 25 Minuten

---

# 7. Startscreen / Park Dashboard

Der Parkscreen ist der wichtigste Screen der ganzen App.

Er darf nicht überladen sein.

## Oben

Zeige:

- NÄHEN Branding
- Account/Profil
- Parktag-Status
- Live-Sync-Status

## Hero / Parktag

Zeige kompakt:

- Phantasialand
- Parktag aktiv / nicht aktiv
- Startzeit
- Fahrten heute
- echte Queue-Zeit
- Single-Rider-Nutzungen
- Parktag starten / beenden

Der Hero darf stark aussehen, aber nicht 40 % des Screens einnehmen.

---

# 8. Ride Cards

Ride Cards sind das Herzstück.

Jede Karte braucht mindestens:

- Attraktionsname
- Themenbereich
- Live-Wartezeit
- Offen/Geschlossen
- Trend
- Favoritenstatus
- Single-Rider-Hinweis wenn vorhanden
- Anstellen-Aktion
- Detail-Aktion

## Wartezeit

Die Wartezeit ist das visuell stärkste Element.

Beispiel:

**20**
MIN

Nicht:

„Aktuelle Wartezeit beträgt 20 Minuten“

---

## Trend

Beispiele:

- ↓ 15 min
- → stabil
- ↑ 10 min

Keine komplizierten Graphen auf jeder Karte.

---

## Geschlossen

Wenn eine Attraktion geschlossen ist:

- nicht einfach nur Zahl 0 anzeigen
- deutlich „GESCHLOSSEN“ / „ZU“
- Karte optisch zurücknehmen
- Anstellen deaktivieren

---

# 9. Queue Timer

Die Queue-Stoppuhr ist ein Kernfeature.

Wenn eine Queue aktiv ist, muss dies in der gesamten App klar sichtbar sein.

## Active Queue Bar

Eine aktive Queue darf oben sticky angezeigt werden.

Enthält:

- Ride Name
- Queue Type
- laufende Zeit

Ein Tap öffnet den vollständigen Queue-Screen.

---

## Queue Screen

Der Timer ist das wichtigste Element.

Beispiel:

TARON

**00:18:42**

Regular Queue
Ausgeschildert: 30 min

[ BOARDING · GENÄHT ]
[ QUEUE VERLASSEN · VERNÄHT ]

Buttons müssen extrem groß und eindeutig sein.

---

# 10. Single Rider

Single Rider ist kein kleiner Nebensatz.

Wenn vorhanden:

- eigenes klares Symbol
- gut sichtbar
- nicht mit einer erfundenen offiziellen Wartezeit versehen

Community-Messungen sind **tatsächlich gestoppte Werte**.

Beispiel:

Single Rider

Letzte Messungen:
- 11 min · vor 5 min
- 16 min · vor 12 min
- 9 min · vor 19 min

Zeige deutlich:

„Keine offizielle SR-Livezeit“

---

# 11. Ride Detail

Der Detail-Screen soll kompakt sein.

Nicht zu einer Wikipedia-Seite machen.

Zeige:

- Ride Name
- Bereich
- aktuelle Live-Wartezeit
- Status
- Trend
- Single Rider
- frische Community-Messungen
- Anstellen-Button

Optional später:

- Tagesverlauf
- persönliche Statistik
- persönliche beste Queue

---

# 12. Nähprotokoll

Das Protokoll soll wie eine kompakte Parkday-Timeline wirken.

Beispiel:

10:07  
Black Mamba  
8 min · Regular  
✓ genäht

10:34  
Taron  
21 min · Regular  
✓ genäht

11:48  
Raik  
12 min · Single Rider  
✓ genäht

Vermeide große Karten pro Eintrag.

Die Timeline soll schnell scannbar sein.

---

# 13. Nähbilanz

Die Nähbilanz ist der Abschluss des Parktags.

Sie darf emotionaler und visueller sein.

Zeige:

- Anzahl Fahrten
- echte Queue-Zeit
- Single-Rider-Nutzungen
- abgebrochene Queues
- meistgefahrene Attraktion
- Vergleich echte vs. ausgeschilderte Wartezeit

Sie sollte später als Social Card exportierbar sein.

Design sie deshalb so, dass sie auch als Screenshot stark aussieht.

---

# 14. Push Settings

Push-Einstellungen dürfen nicht wie ein technisches Einstellungsformular wirken.

Pro Ride:

- persönliches Wartezeitlimit
- Push bei starkem Drop
- Mindest-Drop in Minuten
- Push bei Wiedereröffnung
- Push bei frischer Single-Rider-Messung

Nutze klare Toggles und Zahlenfelder.

Nicht zu viel Text.

---

# 15. Install Flow

Die PWA-Installation ist Bestandteil des Produkts.

Der erste Screen soll hochwertig wirken.

Claim:

**Installieren. Anstellen. Nähen.**

Android:

- echter Install-Button

iPhone:

- sehr klare 3-Schritt-Anleitung
- Teilen
- Zum Home-Bildschirm
- Hinzufügen

Keine lange technische Erklärung.

---

# 16. Account Screens

Login und Registrierung minimal halten.

Keine unnötigen Felder.

Benötigt:

- E-Mail
- Passwort
- Username bei Registrierung

Der Screen soll sich wie Teil der App anfühlen, nicht wie ein Supabase-Demoformular.

---

# 17. Animationen

Animationen sparsam einsetzen.

Erlaubt:

- Queue-Bar erscheint weich
- Timer-State-Wechsel
- Ride-Card bei starkem Drop subtil hervorheben
- Sheet-Transitions
- Button-Feedback
- leichte Count-Up-Effekte

Nicht erlaubt:

- ständig pulsierende Elemente
- unnötige Parallax-Effekte
- lange Page Transitions
- Animationen, die Informationen verzögern

---

# 18. Performance

Diese App wird unterwegs genutzt.

Deshalb:

- keine riesigen Hintergrundvideos
- keine schweren 3D-Szenen
- keine 10 MB Hero-Bilder
- keine unnötigen UI-Bibliotheken
- wenig externe Fonts
- keine Designentscheidung, die den Live-Screen langsamer macht

Performance ist Teil des Designs.

---

# 19. Accessibility

Mindestens:

- ausreichend Kontrast
- sichtbare Fokuszustände
- sinnvolle Button-Texte
- Icon + Text bei wichtigen Statusinformationen
- keine reine Rot/Grün-Kommunikation
- Touchflächen groß genug
- reduzierte Animation bei `prefers-reduced-motion`

---

# 20. Technische Grenzen

## Diese Dateien dürfen für den reinen Design-Pass NICHT funktional umgebaut werden:

- `app.js`
- `supabase.sql`
- `push-alerts.cjs`
- `sw.js`
- `.github/workflows/pages.yml`

## Primäre Design-Dateien:

- `index.html`
- `styles.css`

---

# 21. Kritische DOM-Regel

`app.js` greift auf bestehende DOM-IDs und `data-*` Attribute zu.

Deshalb:

**Bestehende IDs und relevante data-Attribute niemals entfernen oder umbenennen.**

Du darfst:

- Elemente verschachteln
- visuelle Wrapper hinzufügen
- Klassen ändern
- CSS komplett neu schreiben
- Icons ergänzen
- Layouts neu strukturieren

Aber JS-Hooks müssen erhalten bleiben.

---

# 22. Keine Funktionsattrappen

Astra darf keine Fake-Features hinzufügen.

Nicht erlaubt:

- Fake-Live-Wartezeiten
- Fake-Maps
- Fake-Single-Rider-Zeiten
- nicht funktionierende Buttons
- erfundene Parkinformationen
- UI für Features, die nicht existieren

Wenn eine Funktion noch nicht vorhanden ist, darf sie höchstens als klar markiertes zukünftiges Konzept erscheinen.

---

# 23. Phantasialand zuerst

Version 1 ist bewusst **Phantasialand-first**.

Design deshalb nicht so, als müsse sofort jeder Park der Welt unterstützt werden.

Die Datenarchitektur darf skalierbar sein, aber die UX soll sich für Phantasialand maßgeschneidert anfühlen.

---

# 24. Kein offizielles Phantasialand-Branding imitieren

NÄHEN ist eine unabhängige Fan-App.

Nicht:

- offizielles Phantasialand-Logo nachbauen
- Corporate Design des Parks kopieren
- offiziellen App-Look imitieren

NÄHEN braucht eine eigene Marke.

---

# 25. Queue-Times Attribution

Die sichtbare Attribution muss erhalten bleiben:

**Powered by Queue-Times.com**

Der Link zu Queue-Times muss erhalten bleiben.

Sie darf elegant integriert werden, aber nicht versteckt werden.

---

# 26. Zielbild

Wenn der Nutzer die fertige App sieht, soll der Eindruck sein:

> „Das wurde offensichtlich von jemandem gebaut, der wirklich Freizeitparks besucht.“

Nicht:

> „Das ist ein generisches Dashboard mit Achterbahn-Daten.“

---

# 27. Qualitätscheck vor Abschluss

Vor jedem finalen Design-Pass prüfen:

### Funktion

- Sind alle Buttons noch klickbar?
- Funktioniert Anstellen?
- Funktioniert Regular / Single Rider?
- Läuft die Stoppuhr?
- Öffnet Ride Detail?
- Funktioniert Parktag starten/beenden?
- Öffnen Push Settings?
- Funktioniert Navigation?

### Mobile

- 360 px getestet
- 390 px getestet
- 430 px getestet
- iPhone Safe Areas berücksichtigt
- Bottom Navigation überlappt nichts

### Lesbarkeit

- Wartezeit in < 1 Sekunde erfassbar
- geschlossen sofort sichtbar
- aktive Queue sofort sichtbar
- Trend verständlich
- Buttons groß genug

### Branding

- NÄHEN wirkt eigenständig
- Humor vorhanden, aber nicht albern
- keine generische SaaS-Ästhetik
- keine unnötige UI-Dekoration

---

# 28. Arbeitsweise

Arbeite iterativ.

1. Bestehende App vollständig lesen.
2. Funktions-Hooks identifizieren.
3. Informationshierarchie verbessern.
4. Mobile Layout zuerst umbauen.
5. Visual System definieren.
6. Ride Cards perfektionieren.
7. Queue Timer perfektionieren.
8. Install/Login/Settings konsistent gestalten.
9. Nähbilanz emotional gestalten.
10. Abschließend alle Funktionen testen.

Bei Zielkonflikten gilt immer:

**Benutzbarkeit > Design-Showcase.**

Und:

**Live-Information > Dekoration.**
