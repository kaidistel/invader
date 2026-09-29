const fs = require("fs");
const path = require("path");

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; NAEHEN-Park-Art/1.0)"
    },
    redirect: "follow"
  });
  if (!response.ok) throw new Error("HTTP " + response.status + " " + url);
  return response.text();
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractMeta(html, key) {
  const patterns = [
    new RegExp('<meta[^>]+property=["\\\']' + key + '["\\\'][^>]+content=["\\\']([^"\\\']+)["\\\']', "i"),
    new RegExp('<meta[^>]+content=["\\\']([^"\\\']+)["\\\'][^>]+property=["\\\']' + key + '["\\\']', "i"),
    new RegExp('<meta[^>]+name=["\\\']' + key + '["\\\'][^>]+content=["\\\']([^"\\\']+)["\\\']', "i"),
    new RegExp('<meta[^>]+content=["\\\']([^"\\\']+)["\\\'][^>]+name=["\\\']' + key + '["\\\']', "i")
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) return decodeHtml(match[1]);
  }
  return "";
}

async function main() {
  const configPath = process.argv[2];
  const globalName = process.argv[3];
  const outputPath = process.argv[4];
  if (!configPath || !globalName || !outputPath) {
    throw new Error("Usage: node build-official-art-manifest.cjs <config.js> <globalName> <output.json>");
  }

  global.window = {};
  require(path.resolve(configPath));
  const module = global.window[globalName];
  if (!module || !module.park || !module.worlds) {
    throw new Error("Park module not found: " + globalName);
  }

  const result = {
    generatedAt: new Date().toISOString(),
    park: module.park.slug,
    parkCardImage: "",
    rides: {}
  };

  const entries = Object.entries(module.worlds);
  for (const [rideId, world] of entries) {
    if (!world || !world.officialUrl) continue;
    try {
      const html = await fetchText(world.officialUrl);
      const image =
        extractMeta(html, "og:image") ||
        extractMeta(html, "twitter:image") ||
        extractMeta(html, "twitter:image:src");
      if (image) {
        result.rides[rideId] = image;
        if (!result.parkCardImage && rideId === module.park.cardSourceRide) {
          result.parkCardImage = image;
        }
        process.stdout.write("✓ " + rideId + "\n");
      } else {
        process.stdout.write("! no image: " + rideId + "\n");
      }
    } catch (error) {
      process.stdout.write("! failed: " + rideId + " — " + error.message + "\n");
    }
  }

  if (!result.parkCardImage && module.park.cardSourceRide) {
    result.parkCardImage = result.rides[module.park.cardSourceRide] || "";
  }

  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + "\n");
  process.stdout.write(
    "Generated " + outputPath + " with " +
    Object.keys(result.rides).length + "/" + entries.length + " attraction images.\n"
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
