#!/usr/bin/env python3
"""Import licensed photos for Köln-Deutz from Wikimedia into local NÄHEN assets."""
import io
import json
import re
import urllib.request
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "naehen" / "assets"
CONFIG = ROOT / "naehen" / "koeln-deutz-herbstvolksfest-2026-config.js"
PHOTOS = [
    {
        "file": "koeln-deutz-herbst-2026-background.webp",
        "url": "https://upload.wikimedia.org/wikipedia/commons/b/bf/Europa_Rad_%28208058101%29.jpeg",
        "source": "https://commons.wikimedia.org/wiki/File:Europa_Rad_(208058101).jpeg",
        "credit": "Eric Austermühl / Wikimedia Commons · CC BY 3.0 · bearbeitet (WebP)",
        "license": "https://creativecommons.org/licenses/by/3.0/",
    },
    {
        "file": "koeln-deutz-herbst-2026-mr-gravity.webp",
        "url": "https://upload.wikimedia.org/wikipedia/commons/9/9a/2018-09-07-bonn-puetzchens-markt-2018-40.jpg",
        "source": "https://commons.wikimedia.org/wiki/File:2018-09-07-bonn-puetzchens-markt-2018-40.jpg",
        "credit": "Andreas Axel Kirch / Wikimedia Commons · CC BY-SA 4.0 · bearbeitet (WebP)",
        "license": "https://creativecommons.org/licenses/by-sa/4.0/",
    },
]

def download_webp(item):
    req = urllib.request.Request(
        item["url"],
        headers={"User-Agent": "NAEHEN-Fan-App/1.0 (https://github.com/kaidistel/invader; Creative Commons photo import)"}
    )
    with urllib.request.urlopen(req, timeout=45) as response:
        data = response.read(12_000_000)
        if len(data) < 10000 or not response.headers.get("Content-Type", "").startswith("image/"):
            raise ValueError("Invalid photo source " + item["url"])
    with Image.open(io.BytesIO(data)) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        if min(image.size) < 850:
            raise ValueError("Image too small: " + str(image.size))
        image.thumbnail((2000, 2000), Image.Resampling.LANCZOS)
        ASSETS.mkdir(parents=True, exist_ok=True)
        output = ASSETS / item["file"]
        image.save(output, "WEBP", quality=86, method=6)
        print("Saved", output.relative_to(ROOT), image.size, output.stat().st_size, "bytes")

def main():
    for photo in PHOTOS:
        download_webp(photo)

    cfg = CONFIG.read_text(encoding="utf-8")
    marker = "const rides="
    start = cfg.index(marker) + len(marker)
    end = cfg.index("\n];", start)
    rides = json.loads(cfg[start:end + 2])
    gravity = next(ride for ride in rides if ride["id"] == "koeln-deutz-herbst26-mr-gravity")
    mr = PHOTOS[1]
    gravity.update(
        imageUrl="./assets/" + mr["file"],
        imageCredit=mr["credit"],
        imageSourceUrl=mr["source"],
        imageLicenseUrl=mr["license"],
        imageFallbackUrls=[],
        manufacturer="Technical Park",
        operatorFull="Frank Oberschelp",
    )
    cfg = cfg[:start] + json.dumps(rides, indent=2, ensure_ascii=False) + cfg[end + 2:]

    bg = PHOTOS[0]
    for pattern, replacement in [
        (r'cardImage:"[^"]*"', 'cardImage:"./assets/' + bg["file"] + '"'),
        (r'cardImageCredit:"[^"]*"', 'cardImageCredit:"' + bg["credit"] + '"'),
        (r'cardImageSourceUrl:"[^"]*"', 'cardImageSourceUrl:"' + bg["source"] + '"'),
    ]:
        cfg, n = re.subn(pattern, replacement, cfg, count=1)
        if n != 1:
            raise ValueError("Missing event artwork field " + pattern)
    CONFIG.write_text(cfg, encoding="utf-8")

    licenses = "# Köln-Deutz 2026 · Creative Commons Bildnachweise\n\n"
    for item in PHOTOS:
        licenses += (
            "- " + item["file"] + " — " + item["credit"] + "\n"
            + "  - Original: " + item["source"] + "\n"
            + "  - Lizenz: " + item["license"] + "\n"
            + "  - Bearbeitung: auf maximal 2000 px verkleinert und als WebP gespeichert.\n\n"
        )
    (ASSETS / "KOELN_DEUTZ_LICENSES.md").write_text(licenses, encoding="utf-8")

    page = ROOT / "naehen" / "index.html"
    page_text = page.read_text(encoding="utf-8")
    if "?v=128" not in page_text:
        raise ValueError("Unexpected PWA version: index")
    page.write_text(page_text.replace("?v=128", "?v=129"), encoding="utf-8")
    worker = ROOT / "naehen" / "sw.js"
    sw_text = worker.read_text(encoding="utf-8")
    if "naehen-v128" not in sw_text:
        raise ValueError("Unexpected PWA version: service worker")
    worker.write_text(sw_text.replace("naehen-v128", "naehen-v129"), encoding="utf-8")
    print("Local photo import completed.")

if __name__ == "__main__":
    main()
