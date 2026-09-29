const fs = require("fs");
const webpush = require("web-push");

const livePath = process.argv[2] || "naehen/live.json";
const SUPABASE_URL = process.env.NAEHEN_SUPABASE_URL || "";
const SERVICE_KEY = process.env.NAEHEN_SUPABASE_SERVICE_ROLE_KEY || "";
const VAPID_PUBLIC_KEY = process.env.NAEHEN_VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.NAEHEN_VAPID_PRIVATE_KEY || "";
const VAPID_SUBJECT = process.env.NAEHEN_VAPID_SUBJECT || "mailto:admin@example.com";

if (!SUPABASE_URL || !SERVICE_KEY || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.log("NÄHEN push backend not configured; skipping push evaluation.");
  process.exit(0);
}

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const headers = {
  apikey: SERVICE_KEY,
  Authorization: "Bearer " + SERVICE_KEY,
  "Content-Type": "application/json"
};

function slugRide(name) {
  const known = {
    "f.l.y.": "fly",
    "taron": "taron",
    "raik": "raik",
    "black mamba": "black-mamba",
    "mystery castle": "mystery-castle",
    "colorado adventure": "colorado-adventure",
    "river quest": "river-quest",
    "talocan": "talocan"
  };
  const low = String(name || "").toLowerCase().trim();
  if (known[low]) return known[low];
  if (low.startsWith("chiapas")) return "chiapas";
  return low.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function rest(path, options) {
  const response = await fetch(SUPABASE_URL + "/rest/v1/" + path, Object.assign({
    headers: headers
  }, options || {}));
  if (!response.ok) {
    const body = await response.text();
    throw new Error(path + " -> " + response.status + " " + body);
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function flattenLive(data) {
  const rows = [];
  (data.lands || []).forEach((land) => {
    (land.rides || []).forEach((ride) => rows.push(ride));
  });
  (data.rides || []).forEach((ride) => rows.push(ride));
  return rows.map((ride) => ({
    ride_id: slugRide(ride.name),
    ride_name: ride.name,
    wait_time: Number(ride.wait_time) || 0,
    is_open: !!ride.is_open,
    source_updated_at: ride.last_updated || null,
    synced_at: new Date().toISOString()
  }));
}

function eventPayload(type, ride, extra) {
  if (type === "reopen") {
    return { title: "🧵 Wieder am Nähen", body: ride.ride_name + " ist wieder geöffnet.", url: "./" };
  }
  if (type === "below") {
    return { title: "🧵 Nähchance", body: ride.ride_name + " ist auf " + ride.wait_time + " Minuten gefallen.", url: "./" };
  }
  if (type === "drop") {
    return { title: "📉 Brutale Nähung", body: ride.ride_name + " ist um " + extra.drop + " Minuten gefallen · jetzt " + ride.wait_time + " min.", url: "./" };
  }
  if (type === "sr") {
    return { title: "👤 SR-Nähung", body: "Neue echte Single-Rider-Messung bei " + extra.rideName + ": " + Math.round(extra.waitSeconds / 60) + " min.", url: "./" };
  }
  return { title: "🧵 Näh-Alarm", body: "Da wird genäht.", url: "./" };
}

async function sendToUser(userId, payload, subscriptions) {
  const userSubs = subscriptions.filter((sub) => sub.user_id === userId);
  for (const sub of userSubs) {
    try {
      await webpush.sendNotification({
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth }
      }, JSON.stringify(payload), { TTL: 300 });
    } catch (error) {
      console.warn("Push failed", error.statusCode || "", error.message || error);
      if (error.statusCode === 404 || error.statusCode === 410) {
        const encoded = encodeURIComponent(sub.endpoint);
        await rest("push_subscriptions?endpoint=eq." + encoded, { method: "DELETE", headers: headers });
      }
    }
  }
}

(async () => {
  const live = flattenLive(JSON.parse(fs.readFileSync(livePath, "utf8")));
  const previous = await rest("live_ride_state?select=*") || [];
  const favorites = await rest("favorites?select=*") || [];
  const subscriptions = await rest("push_subscriptions?select=*") || [];
  const since = new Date(Date.now() - 7 * 60 * 1000).toISOString();
  const srReports = await rest("sr_reports?select=id,ride_id,wait_seconds,measured_at&measured_at=gte." + encodeURIComponent(since) + "&order=measured_at.desc") || [];
  const recentLogs = await rest("push_event_log?select=event_key&created_at=gte." + encodeURIComponent(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString())) || [];
  const logged = new Set(recentLogs.map((row) => row.event_key));
  const previousMap = new Map(previous.map((row) => [row.ride_id, row]));
  const liveMap = new Map(live.map((row) => [row.ride_id, row]));
  const logRows = [];

  for (const favorite of favorites) {
    const ride = liveMap.get(favorite.ride_id);
    if (!ride) continue;
    const old = previousMap.get(favorite.ride_id);
    const events = [];

    if (favorite.notify_reopen && old && !old.is_open && ride.is_open) {
      events.push({ type: "reopen", key: "reopen:" + favorite.user_id + ":" + ride.ride_id + ":" + String(ride.source_updated_at || ride.synced_at), extra: {} });
    }

    if (favorite.notify_below && ride.is_open && favorite.wait_limit !== null && ride.wait_time <= Number(favorite.wait_limit)) {
      const crossed = !old || !old.is_open || Number(old.wait_time) > Number(favorite.wait_limit);
      if (crossed) events.push({ type: "below", key: "below:" + favorite.user_id + ":" + ride.ride_id + ":" + String(ride.source_updated_at || ride.synced_at) + ":" + favorite.wait_limit, extra: {} });
    }

    if (favorite.notify_drop && old && old.is_open && ride.is_open) {
      const drop = Number(old.wait_time) - Number(ride.wait_time);
      const threshold = Number(favorite.drop_minutes || 15);
      if (drop >= threshold) {
        events.push({ type: "drop", key: "drop:" + favorite.user_id + ":" + ride.ride_id + ":" + String(ride.source_updated_at || ride.synced_at) + ":" + drop, extra: { drop: drop } });
      }
    }

    if (favorite.notify_sr) {
      const matching = srReports.filter((report) => report.ride_id === ride.ride_id);
      for (const report of matching) {
        events.push({
          type: "sr",
          key: "sr:" + favorite.user_id + ":" + report.id,
          extra: { rideName: ride.ride_name, waitSeconds: report.wait_seconds }
        });
      }
    }

    for (const event of events) {
      if (logged.has(event.key)) continue;
      await sendToUser(favorite.user_id, eventPayload(event.type, ride, event.extra), subscriptions);
      logged.add(event.key);
      logRows.push({ event_key: event.key, user_id: favorite.user_id, event_type: event.type, ride_id: ride.ride_id });
    }
  }

  if (logRows.length) {
    await rest("push_event_log", {
      method: "POST",
      headers: Object.assign({}, headers, { Prefer: "resolution=merge-duplicates" }),
      body: JSON.stringify(logRows)
    });
  }

  if (live.length) {
    await rest("live_ride_state?on_conflict=ride_id", {
      method: "POST",
      headers: Object.assign({}, headers, { Prefer: "resolution=merge-duplicates" }),
      body: JSON.stringify(live)
    });
  }

  console.log("NÄHEN push evaluation complete:", logRows.length, "notifications/events.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});