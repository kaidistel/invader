# NÄHEN · Persönliche Admin-Durchsagen

## Status
Die zwei Datenbank-Migrationen wurden am 06.11.2026 auf das Projekt angewendet. Die Edge Function `admin-announcements` wurde mit JWT-Prüfung bereitgestellt. Die UI ist ab NÄHEN v143 verfügbar.

## Berechtigungen
Nur der von Supabase selbst verwaltete Auth-Wert `app_metadata.naehen_role = "admin"` berechtigt zum Versenden. Die Edge Function prüft dies bei jeder Anfrage direkt über `auth.admin.getUserById`; niemals `user_metadata`, eine E-Mail aus dem Client oder lokale Schalter vertrauen. Empfänger müssen die persönliche Einwilligung im Profil aktivieren (standardmäßig aus). Normale Clients können ausschließlich Nachrichten an den eingeloggten Nutzer lesen.

## Versand
Admin: Profil → NÄHEN-Zentrale → Empfänger → Titel und Inhalt → Senden. Empfänger: Profil → persönliche Durchsagen erlauben. Nachrichten werden in der Datenbank gespeichert und in der App alle 30 Sekunden bzw. per Aktualisieren angezeigt. Spam-Bremse: maximal 10 pro Stunde und mindestens 90 Sekunden Abstand je Empfänger.

## Für echte Betriebssystem-Pushs (auch bei geschlossener App)
In Supabase **Edge Functions → Secrets** den bestehenden privaten VAPID-Schlüssel als `NAEHEN_VAPID_PRIVATE_KEY` konfigurieren. Er muss zum öffentlichen Schlüssel in `naehen/config.js` gehören. Nur dort hinzufügen, NICHT in Git oder dem Browser. Ohne diesen geheimen Schlüssel wird eine Durchsage korrekt im In-App-Postfach gespeichert, jedoch kein Hintergrund-Push gesendet. Ein aktives Geräte-Push-Abonnement ist zusätzlich erforderlich.

## Laufende Tests
Nie eine echte Durchsage versenden, ohne sie im Admin-Panel bewusst auszulösen. Funktioniert die Auflistung nicht, prüfen: Admin-Rolle, JWT, Einwilligung, Edge-Logs. NÄHEN meldet Push-Zustellstatus separat und zeigt keine falsche Erfolgsmeldung für System-Pushs.