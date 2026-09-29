// NÄHEN public client configuration.
// Supabase URL + anon/publishable key are intentionally public in a browser app.
// RLS in supabase.sql protects user data. NEVER put a service-role key here.
window.NAEHEN_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: "",

  // Web Push public VAPID key. The private key belongs only in the push backend.
  vapidPublicKey: "BDxPEYxaMC9ldXnE5X7NHO35E0VvkFAFH9BS1ICNZKQXfeifjLSqBF9x7hsK2posMXjoKPDj1Q1kOnlzCRonX58"
};
