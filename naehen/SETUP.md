# NÄHEN · einmaliges Backend-Setup

## Status

- ✅ GitHub Pages läuft
- ✅ Queue-Times Live-Sync läuft
- ✅ `supabase.sql` ist vorbereitet
- ✅ VAPID-Schlüsselpaar wurde erzeugt
- ✅ VAPID Public Key ist bereits in `config.js` eingetragen
- ✅ Supabase-Projekt erstellt und verbunden
- ✅ Datenbankschema, RLS, Indizes und Trigger eingespielt
- ✅ Supabase URL + Publishable Key in `config.js` eingetragen
- ⏳ private GitHub Actions Secrets hinterlegen

Die App ist so gebaut, dass GitHub Pages weiterhin das kostenlose Frontend-Hosting übernimmt. Für Accounts und Web Push wird ein kostenloses Supabase-Projekt benötigt.

## Backend-Status

- Supabase-Projekt: `NAEHEN`
- Region: Frankfurt (`eu-central-1`)
- Security Advisor: **0 offene Security-Lints**
- Die App nutzt den modernen Supabase Publishable Key im Browser.
- Private Server-Schlüssel werden nicht ins öffentliche Repo geschrieben.

## 1. Supabase-Projekt erstellen

1. Neues Supabase-Projekt anlegen.
2. Im SQL Editor den kompletten Inhalt von `naehen/supabase.sql` ausführen.
3. Unter Authentication die E-Mail/Passwort-Anmeldung aktiviert lassen.
4. Als Site URL die GitHub-Pages-Adresse setzen:
   `https://kaidistel.github.io/invader/naehen/`
5. Dieselbe Adresse bei den erlaubten Redirect URLs eintragen.

## 2. Öffentliche Client-Daten eintragen

In `naehen/config.js`:

- `supabaseUrl`: Project URL
- `supabaseAnonKey`: Publishable/anon key

Der anon/publishable Key ist für Browser-Apps gedacht und darf öffentlich sein. Der Service-Role-Key darf niemals in `config.js` landen. Die Tabellen sind mit Row Level Security abgesichert.

## 3. VAPID für Web Push

✅ Bereits erledigt: Das VAPID-Schlüsselpaar wurde erzeugt und der **Public Key** ist bereits in `naehen/config.js` eingetragen.

Der **Private Key** darf niemals committed werden und muss nur als GitHub Actions Secret hinterlegt werden.

## 4. GitHub Actions Secrets setzen

Repository → Settings → Secrets and variables → Actions → New repository secret

Benötigt werden:

- `NAEHEN_SUPABASE_URL` = Supabase Project URL
- `NAEHEN_SUPABASE_SERVICE_ROLE_KEY` = Supabase Service Role Key
- `NAEHEN_VAPID_PUBLIC_KEY` = erzeugter VAPID Public Key
- `NAEHEN_VAPID_PRIVATE_KEY` = erzeugter VAPID Private Key
- `NAEHEN_VAPID_SUBJECT` = z. B. `mailto:deine-adresse@example.com`

Danach wertet der bestehende GitHub-Actions-Live-Sync ungefähr alle fünf Minuten die Näh-Alarme aus.

## Was danach funktioniert

- echte Registrierung und Login
- geräteübergreifende Sessions
- Parktag starten und beenden
- echte Queue-Stoppuhr mit Cloud-Sync
- Ride-History pro Account
- persönliche Favoriten
- persönliche Wartezeitlimits
- Push bei Unterschreiten des Limits
- Push bei starkem Queue-Drop
- Push bei Wiedereröffnung
- Push bei frischen Single-Rider-Community-Messungen
- anonyme Community-SR-Messungen aus tatsächlich gestoppten Queue-Sessions
- Nähbilanz nach Parktag

## Single Rider

NÄHEN führt keine erfundene offizielle Single-Rider-Wartezeit. Eine SR-Wartezeit entsteht nur, wenn ein Nutzer beim Anstellen den Single-Rider-Modus auswählt und die Stoppuhr beim Boarding beendet.

Aktuell sind Taron und Raik in `app.js` als Single-Rider-fähig hinterlegt. Weitere Attraktionen werden erst ergänzt, wenn die Nutzung verlässlich bestätigt ist.

## Für Astra / Design-Arbeit

Astra sollte primär diese Dateien bearbeiten:

- `naehen/index.html` — Screens und semantische Struktur
- `naehen/styles.css` — gesamtes visuelles Design

Die Funktionslogik liegt separat in:

- `naehen/app.js`

Die Live-/Backend-Dateien sollten beim reinen Design-Pass nicht umgebaut werden:

- `naehen/supabase.sql`
- `naehen/push-alerts.cjs`
- `naehen/sw.js`
- `.github/workflows/pages.yml`

Wichtige DOM-IDs und `data-*` Attribute aus `index.html` müssen erhalten bleiben, da `app.js` sie verwendet.
