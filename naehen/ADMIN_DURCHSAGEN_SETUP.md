# NÄHEN · Admin-Durchsagen und Web-Push

Stand: NÄHEN v148 / 6. November 2026.

## Architektur

- **Supabase Edge Function `admin-announcements`:** Nach erfolgreicher Anmeldung und erneuter Admin-Prüfung wird eine persönliche Nachricht im eigenen Empfänger-Postfach gespeichert. Bei konfiguriertem VAPID-Schlüssel sendet die Funktion sofort einen echten Web-Push.
- **Supabase Vault:** Der private VAPID-Schlüssel ist hier verschlüsselt gespeichert. Er wurde serverseitig aus bereits vorhandenen GitHub Actions Secrets übernommen. Zugriff nur über die beiden eingeschränkten RPCs mit `service_role`. Niemals privaten VAPID-Schlüssel ins Git-Repository, in Browsercode oder einen öffentlichen API-Endpunkt schreiben.
- **GitHub Actions `NAEHEN Personal Push Delivery`:** Eigenständige geplante Rückfallebene für ältere oder temporär nicht sofort versendete Nachrichten, nicht mehr der Hauptversand. GitHub-Zeitpläne können sich verzögern.
- **Service Worker `naehen/sw.js`:** Registriert unabhängig von geöffneten App-Fenstern einen Push-Event-Handler und zeigt jede erhaltene Nachricht als System-Benachrichtigung an.
- **Client `naehen/app.js`:** Beim Login und nach Rückkehr in den Vordergrund wird ein vorhandenes Push-Abo erneut an den eingeloggten Account gebunden. Damit wird auch ein Accountwechsel am selben Gerät zuverlässig behandelt.

## Nutzer: echte Hintergrund-Zustellung prüfen

1. App auf dem Mobilgerät installiert öffnen. Auf iOS: NÄHEN zum Home-Bildschirm hinzufügen (iOS 16.4+). Web-Push aus einem normalen iPhone-Safari-Tab ist dafür nicht geeignet.
2. Profil → Näh-Alarme einstellen → PUSH AKTIVIEREN; Betriebssystembenachrichtigungen zulassen.
3. PUSH-STATUS PRÜFEN bestätigt die Speicherung und Accountzuordnung.
4. **LOKAL TESTEN** prüft nur die Anzeige, wenn die App bereits läuft.
5. **ECHTEN PUSH TESTEN** legt serverseitig eine eigene Testnachricht an. Anschließend NÄHEN vollständig schließen und auf die *System-Benachrichtigung* achten. Der Eingang im Postfach ist keine Bestätigung für Hintergrundzustellung.
6. Bei Problemen prüfen: iOS Fokus / Mitteilungen-Einstellungen, Android Akkuoptimierung, Push-Berechtigung, Browser/PWA-Installation und Netzverbindung.

## Zustellstatus

`sent` = Push-Gateway hat angenommen, **nicht** „vom Betriebssystem angezeigt“ oder „gelesen“.
`not_configured` = Edge konnte den Schlüssel nicht abrufen (soll nach Vault-Provisionierung nicht mehr auftreten).
`no_subscription` = es gibt kein gültiges gespeichertes Gerät.
`failed` = Versand fehlgeschlagen; Logs beachten.

## Berechtigung und Sicherheit

Nur der Server kontrolliert `app_metadata.naehen_role = admin`. Client-Benutzer können nur ihre eigenen Nachrichten lesen. Eigene Push-Selbsttests sind authentifiziert, auf das eigene Konto beschränkt und auf alle fünf Minuten begrenzt. Für Admin-Durchsagen gibt es weder ein stündliches Nachrichtenlimit noch eine Wartezeit zwischen Nachrichten an denselben Empfänger. Die serverseitige Admin-Prüfung, Empfängervalidierung und Push-Berechtigungen bleiben erhalten. Auf dem Gerät kann man die System-Push-Berechtigung jederzeit entziehen.

## Deployment

GitHub Pages ist unabhängig von der Edge-Funktion. NÄHEN v148 verwendet neue PWA-Cache-Version; Veröffentlichung über Pages-Workflow. Edge-Funktion und Vault-Provisionierung wurden im Projekt aktiviert. Einen Push auf fremden Geräten kann die serverseitige Prüfung nicht beweisen; erforderlich ist ein echter Test bei geschlossener App.
