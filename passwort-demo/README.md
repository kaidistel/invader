# Passwortangriffe – Unterrichtsdemo

Die [GitHub-Pages-Seite](https://kaidistel.github.io/invader/passwort-demo/) zeigt einen **fiktiven Login im Browser**. GitHub Pages kann selbst keine Passwörter auf einem Server prüfen. Deshalb ist die öffentliche Seite nur eine Simulation. Verwende dort ausschließlich die Testdaten `demo` / `Kirmes2026!`, niemals echte Zugangsdaten.

## Hydra-Versuch nur lokal

Benötigt werden Kali Linux, Python 3 und Hydra. Lade den Ordner `passwort-demo` aus diesem Repository herunter. Öffne darin zwei Terminals.

**Terminal 1: Testserver starten**

```bash
python3 server.py
```

Öffne `http://127.0.0.1:8000/`. Hier wird jeder Anmeldeversuch wirklich vom **lokalen** Python-Server geprüft. Er lauscht ausschließlich auf `127.0.0.1`.

**Terminal 2: vier Testpasswörter prüfen**

```bash
printf '%s\n' 'Passwort123' 'Sommer2026' 'Kirmes2026!' 'Geheim123' > woerter.txt
hydra -l demo -P woerter.txt -s 8000 -t 1 -f -V 127.0.0.1 http-post-form '/api/login:username=^USER^&password=^PASS^:F=LOGIN_FAILED'
```

Hydra findet `Kirmes2026!`, weil es in der Liste steht. Der Test zeigt einen Online-Wörterbuchangriff auf einen eigenen Demo-Login. Danach den Server in Terminal 1 mit **Strg+C** beenden.

Die Website auf GitHub Pages ist **kein** Hydra-Ziel. Für die Vorführung wird nur `127.0.0.1` verwendet.
