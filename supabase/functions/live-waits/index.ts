import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PARKS: Record<string, number> = {
  "phantasialand": 56,
  "movie-park-germany": 310,
  "walibi-holland": 53,
  "walibi-belgium": 14,
  "europa-park": 51
};

const CACHE_TTL_MS = 45_000;
const STALE_FALLBACK_MS = 15 * 60_000;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "no-store"
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  const parkSlug = url.searchParams.get("park") || "";
  const parkId = PARKS[parkSlug];

  if (!parkId) {
    return new Response(JSON.stringify({ error: "unknown_park" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const db = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );

  const now = Date.now();
  const cachedResult = await db
    .from("live_wait_cache")
    .select("payload,fetched_at")
    .eq("park_slug", parkSlug)
    .maybeSingle();

  const cached = cachedResult.data;
  const cachedAt = cached?.fetched_at ? new Date(cached.fetched_at).getTime() : 0;
  const cacheAge = cachedAt ? now - cachedAt : Number.POSITIVE_INFINITY;

  if (cached?.payload && cacheAge < CACHE_TTL_MS) {
    return new Response(JSON.stringify({
      ...cached.payload,
      _naehen: { source: "edge-cache", fetchedAt: cached.fetched_at, ageMs: cacheAge }
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5500);

  try {
    const upstream = await fetch(`https://queue-times.com/parks/${parkId}/queue_times.json?t=${now}`, {
      headers: { "Accept": "application/json", "User-Agent": "NAEHEN-Park-Companion/1.0" },
      signal: controller.signal,
      cache: "no-store"
    });
    clearTimeout(timeout);
    if (!upstream.ok) throw new Error(`queue-times-http-${upstream.status}`);

    const payload = await upstream.json();
    const rideCount =
      (Array.isArray(payload?.rides) ? payload.rides.length : 0) +
      (Array.isArray(payload?.lands)
        ? payload.lands.reduce((sum: number, land: any) => sum + (Array.isArray(land?.rides) ? land.rides.length : 0), 0)
        : 0);

    if (!rideCount) throw new Error("queue-times-empty");

    const fetchedAt = new Date().toISOString();
    await db.from("live_wait_cache").upsert(
      { park_slug: parkSlug, payload, fetched_at: fetchedAt },
      { onConflict: "park_slug" }
    );

    return new Response(JSON.stringify({
      ...payload,
      _naehen: { source: "queue-times-direct", fetchedAt, ageMs: 0 }
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    clearTimeout(timeout);

    if (cached?.payload && cacheAge < STALE_FALLBACK_MS) {
      return new Response(JSON.stringify({
        ...cached.payload,
        _naehen: {
          source: "stale-cache",
          fetchedAt: cached.fetched_at,
          ageMs: cacheAge,
          upstreamError: String(error?.message || error)
        }
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({
      error: "live_waits_unavailable",
      detail: String(error?.message || error)
    }), {
      status: 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
