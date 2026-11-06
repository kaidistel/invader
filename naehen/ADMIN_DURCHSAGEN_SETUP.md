# NÄHEN · Admin-Durchsagen

Die NÄHEN-Zentrale ist nur für Accounts mit dem serverseitig gepflegten Merkmal `app_metadata.naehen_role = "admin"` sichtbar. Der Server prüft das Merkmal bei jeder Aktion erneut.

## Empfänger
Alle registrierten NÄHEN-Accounts außer dem Absender können direkt ausgewählt werden. Eine zusätzliche App-Einwilligung ist nicht erforderlich. Eine Durchsage wird sofort im privaten Postfach des Empfängers gespeichert. Der Empfänger kann es im Profil öffnen.

**System-Push** bei geschlossener App erfordert weiterhin eine auf dem jeweiligen Gerät erteilte Push-Erlaubnis und ein Push-Abonnement. Browser-/Geräteberechtigungen werden nicht umgangen. Die Edge Function benötigt außerdem den passenden privaten VAPID-Schlüssel als Supabase Secret `NAEHEN_VAPID_PRIVATE_KEY`. Dieser Schlüssel darf niemals im Repository liegen. Ist er nicht konfiguriert, funktioniert ausschließlich das In-App-Postfach.

## Sicherheit
- Der Admin wird bei jeder Anfrage durch die Edge Function gegen Supabase Auth geprüft, nicht durch Browserzustand oder frei veränderbare `user_metadata`.
- RLS erlaubt Empfängern nur das Lesen eigener Nachrichten. Das Schreiben ist ausschließlich über den Admin-Serverprozess möglich.
- Versand nur an vorhandene Accounts, keine freie Massenadresse.
- Maximal zehn Nachrichten pro Stunde; mindestens 90 Sekunden Abstand je Empfänger.
- Die bisherigen Datenbanktabellen `admin_message_preferences` und `admin_messages` bleiben erhalten; die alte Einwilligungstabelle wird nicht mehr verwendet.

## Bedienung
Startauswahl → 📯 NÄHEN-Zentrale (oder Profil) → Empfänger wählen → Titel und Nachricht → **Durchsage senden**.
