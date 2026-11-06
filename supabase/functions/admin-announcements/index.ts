import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import webpush from "npm:web-push@3.6.7";

const PUBLIC_VAPID = "BDxPEYxaMC9ldXnE5X7NHO35E0VvkFAFH9BS1ICNZKQXfeifjLSqBF9x7hsK2posMXjoKPDj1Q1kOnlzCRonX58";
const VAPID_CONTACT = "https://kaidistel.github.io/invader/naehen/";
const SITE = "https://kaidistel.github.io";

const respond = (value: unknown, status = 200) => new Response(JSON.stringify(value), {
  status,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": SITE,
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  },
});

const valid = (value: unknown, max: number) => typeof value === "string" &&
  value.trim().length > 0 && [...value.trim()].length <= max &&
  !/[\u0000-\u001f]/.test(value);

function allowedPushEndpoint(raw: string): boolean {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.port || url.username || url.password) return false;
    const host = url.hostname.toLowerCase();
    return host === "fcm.googleapis.com" || host === "android.googleapis.com" ||
      host === "updates.push.services.mozilla.com" ||
      /^jmt[0-9]+\.google\.com$/.test(host) ||
      host === "push.apple.com" || host.endsWith(".push.apple.com") ||
      host.endsWith(".notify.windows.com");
  } catch { return false; }
}

async function deliver(db: any, recipientId: string, title: string, body: string) {
  let privateKey = Deno.env.get("NAEHEN_VAPID_PRIVATE_KEY") || "";
  if (!privateKey) {
    // The original VAPID private key is transferred by GitHub Actions directly
    // to Supabase Vault (encrypted at rest), never committed or sent to a browser.
    // This RPC is executable by service_role ONLY, not authenticated clients.
    const { data: vaultedKey, error: vaultError } = await db.rpc("naehen_read_vapid_key");
    if (vaultError) {
      console.warn("Vault push key unavailable", vaultError.code || "rpc_error");
      return "not_configured";
    }
    if (typeof vaultedKey === "string") privateKey = vaultedKey;
  }
  if (!privateKey) return "not_configured";
  const { data: subs, error } = await db.from("push_subscriptions")
    .select("id,endpoint,p256dh,auth").eq("user_id", recipientId).limit(10);
  if (error) throw error;
  if (!subs?.length) return "no_subscription";
  webpush.setVapidDetails(VAPID_CONTACT, PUBLIC_VAPID, privateKey);
  let delivered = 0;
  for (const s of subs) {
    try {
      if (!allowedPushEndpoint(s.endpoint)) throw new Error("Unsupported push service");
      await webpush.sendNotification({
        endpoint: s.endpoint,
        keys: { p256dh: s.p256dh, auth: s.auth },
      }, JSON.stringify({ title, body, url: "./" }), { TTL: 86400, urgency: "high" });
      delivered++;
    } catch (error: any) {
      console.warn("Push device error", error?.statusCode || "unknown");
      if (error?.statusCode === 404 || error?.statusCode === 410) {
        await db.from("push_subscriptions").delete().eq("id", s.id).eq("user_id", recipientId);
      }
    }
  }
  return delivered ? "sent" : "failed";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return respond({}, 200);
  if (req.method !== "POST") return respond({ error: "Method not allowed" }, 405);
  const authorization = req.headers.get("authorization") || "";
  if (!authorization.startsWith("Bearer ")) return respond({ error: "Not authenticated" }, 401);
  const url = Deno.env.get("SUPABASE_URL") || "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!url || !serviceKey) return respond({ error: "Server credentials unavailable" }, 503);
  const db = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

  try {
    const { data: identified, error: identityError } = await db.auth.getUser(authorization.slice(7));
    if (identityError || !identified?.user) return respond({ error: "Invalid session" }, 401);
    const senderId = identified.user.id;
    const { data: account, error: accountError } = await db.auth.admin.getUserById(senderId);
    if (accountError) throw accountError;
    const admin = account?.user?.app_metadata?.naehen_role === "admin";
    const payload = await req.json().catch(() => ({}));
    if (payload.action === "status") return respond({ admin });
    if (payload.action === "register-device") {
      // Re-bind a browser's existing push subscription after an account switch.
      // The original client-side upsert could fail RLS when another account
      // previously owned the same unique endpoint on this device.
      const endpoint = payload.endpoint;
      const p256dh = payload.p256dh;
      const authKey = payload.authKey;
      let parsed: URL;
      try { parsed = new URL(String(endpoint)); }
      catch { return respond({ error: "Ungültiger Push-Endpunkt" }, 400); }
      if (!allowedPushEndpoint(endpoint) || !valid(endpoint, 2048) ||
          !valid(p256dh, 512) || !valid(authKey, 512) ||
          !/^[A-Za-z0-9_-]{20,}$/.test(p256dh) || !/^[A-Za-z0-9_-]{10,}$/.test(authKey)) {
        return respond({ error: "Push-Abonnement unvollständig" }, 400);
      }
      const { data: saved, error } = await db.from("push_subscriptions").upsert({
        user_id: senderId,
        endpoint, p256dh, auth: authKey,
        user_agent: typeof payload.userAgent === "string" ? payload.userAgent.slice(0, 512) : "",
        updated_at: new Date().toISOString()
      }, { onConflict: "endpoint" }).select("id,user_id").single();
      if (error) throw error;
      if (saved?.user_id !== senderId) throw new Error("Push subscription was not saved for this account");
      return respond({ registered: true });
    }


    if (payload.action === "test-push") {
      // A signed-in user may test ONLY their own registered push subscription.
      // The message goes through the real push transport, not Notification() on this page.
      const { data: devices, error: deviceError } = await db.from("push_subscriptions")
        .select("id").eq("user_id", senderId).limit(1);
      if (deviceError) throw deviceError;
      if (!devices?.length) return respond({ error: "Kein Push-Gerät registriert. Bitte Push aktivieren." }, 409);

      const title = "🔔 NÄHEN Hintergrund-Push-Test";
      const { data: recent, error: recentError } = await db.from("admin_messages")
        .select("id").eq("sender_id", senderId).eq("recipient_id", senderId)
        .eq("title", title)
        .gte("created_at", new Date(Date.now() - 5 * 60_000).toISOString()).limit(1);
      if (recentError) throw recentError;
      if (recent?.length) return respond({ error: "Bitte 5 Minuten bis zum nächsten Push-Test warten." }, 429);

      const body = "Wenn diese Meldung bei geschlossener NÄHEN-App erscheint, funktioniert der echte Hintergrund-Push. 🧵";
      const { data: inserted, error: saveError } = await db.from("admin_messages")
        .insert({ sender_id: senderId, recipient_id: senderId, title, body })
        .select("id").single();
      if (saveError) throw saveError;
      let pushStatus = "failed";
      try { pushStatus = await deliver(db, senderId, title, body); }
      catch (error) { console.warn("Push self-test delivery error", String(error)); }
      const { error: updateError } = await db.from("admin_messages")
        .update({ push_status: pushStatus }).eq("id", inserted.id);
      if (updateError) throw updateError;
      return respond({ saved: true, pushStatus, testId: inserted.id });
    }

    if (!admin) return respond({ error: "Administrator permission required" }, 403);

    if (payload.action === "recipients") {
      // Account membership, not an extra opt-in checkbox, controls the list.
      // The caller must already have passed the server-owned admin-role check.
      const { data: profiles, error } = await db.from("profiles")
        .select("id,username").neq("id", senderId).order("username", { ascending: true }).limit(250);
      if (error) throw error;
      const people = profiles || [];
      const ids = people.map((p: any) => p.id);
      if (!ids.length) return respond({ recipients: [] });
      const [subscriptions, visits] = await Promise.all([
        db.from("push_subscriptions").select("user_id").in("user_id", ids),
        db.from("park_days").select("user_id,park_slug,started_at")
          .in("user_id", ids).is("ended_at", null)
          .gte("started_at", new Date(Date.now() - 18 * 3600 * 1000).toISOString()),
      ]);
      for (const result of [subscriptions, visits]) if (result.error) throw result.error;
      const pushIds = new Set((subscriptions.data || []).map((p: any) => p.user_id));
      const parks = new Map((visits.data || []).map((p: any) => [p.user_id, p.park_slug]));
      return respond({ recipients: people.map((person: any) => ({
        id: person.id,
        name: String(person.username || "NÄHEN-Account").slice(0, 60),
        activePark: parks.get(person.id) || null,
        hasPush: pushIds.has(person.id),
      })) });
    }

    if (payload.action === "send") {
      const recipientId = payload.recipientId;
      const title = payload.title?.trim();
      const body = payload.body?.trim();
      if (typeof recipientId !== "string" ||
          !/^[0-9a-f]{8}-[0-9a-f-]{27,}$/.test(recipientId) ||
          recipientId === senderId || !valid(title, 72) || !valid(body, 240)) {
        return respond({ error: "Invalid message or recipient" }, 400);
      }
      // Only send to an actual registered NÄHEN account; no separate app consent
      // is required. Device-level push permission remains under browser control.
      const { data: recipient, error: recipientError } = await db.from("profiles")
        .select("id").eq("id", recipientId).maybeSingle();
      if (recipientError) throw recipientError;
      if (!recipient) return respond({ error: "Empfänger-Account existiert nicht" }, 404);

      const { data: inserted, error: insertError } = await db.from("admin_messages")
        .insert({ sender_id: senderId, recipient_id: recipientId, title, body })
        .select("id").single();
      if (insertError) throw insertError;
      let pushStatus = "failed";
      try { pushStatus = await deliver(db, recipientId, title, body); }
      catch (error) { console.warn("Push delivery error", String(error)); }
      await db.from("admin_messages").update({ push_status: pushStatus }).eq("id", inserted.id);
      return respond({ saved: true, pushStatus });
    }
    return respond({ error: "Unknown action" }, 400);
  } catch (error) {
    console.error("Private announcement request failed", String(error));
    return respond({ error: "Server error" }, 500);
  }
});
