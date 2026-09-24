"""Lokaler Test-Login für eine Hydra-Demo im Unterricht; nur Loopback."""

from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import parse_qs


HERE = Path(__file__).resolve().parent
USER = "demo"
PASSWORD = "Kirmes2026!"  # Nur ein bekanntes Testpasswort.


class DemoHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path not in ("/", "/index.html"):
            self.send_error(404)
            return
        body = (HERE / "index.html").read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        if self.path != "/api/login":
            self.send_error(404)
            return
        size = int(self.headers.get("Content-Length", "0"))
        if size < 0 or size > 4096:
            self.send_error(413)
            return
        fields = parse_qs(self.rfile.read(size).decode("utf-8", errors="replace"))
        valid = fields.get("username") == [USER] and fields.get("password") == [PASSWORD]
        body = b"LOGIN_OK" if valid else b"LOGIN_FAILED"
        self.send_response(200)  # Der Text markiert den Treffer für Hydras F=...-Prüfung.
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        # Keine Passwörter aus dem Request protokollieren.
        print(f"Anfrage von {self.client_address[0]}: {self.command} {self.path}")


if __name__ == "__main__":
    server = HTTPServer(("127.0.0.1", 8000), DemoHandler)
    print("Testserver: http://127.0.0.1:8000/ (beenden mit Strg+C)")
    server.serve_forever()
