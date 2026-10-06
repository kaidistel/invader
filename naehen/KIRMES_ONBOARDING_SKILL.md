# NÄHEN — Kirmes Onboarding Skill

This skill defines how temporary fairs, Volksfeste and Kirmes events are added to NÄHEN.

The goal is not to fake a theme park model. A Kirmes is an event with a dated lineup, operators, changing rides and usually no public live wait-time feed.

---

# 1. Event Identity

Every Kirmes module must define:

- stable event slug including year where the lineup is year-specific
- event name
- city / location
- official event dates
- event type: `kind: "fair"`
- source / provenance for the date
- independent-app disclaimer

Example:

```js
park: {
  slug: "soest-allerheiligenkirmes-2026",
  kind: "fair",
  name: "Soester Allerheiligenkirmes 2026",
  location: "Soest · 04.–08.11.2026"
}
```

Year-specific lineups must never reuse a yearless slug.

---

# 2. Lineup Is the Core Dataset

For every ride record store:

- stable prefixed ID
- user-facing ride name
- operator / Schausteller
- whether it is new for that event/year
- event grouping / zone if useful
- optional manufacturer / ride type / technical metadata when verified

If the user explicitly supplies a confirmed lineup, treat that supplied lineup as the working source of truth unless they ask for external verification.

Do not silently add, remove or rename rides from a user-supplied lineup.

Correct obvious spelling only when identity is unambiguous. Preserve genuine ride brand names.

---

# 3. Stable IDs

Kirmes rides must be namespaced because the same traveling ride can appear in many events.

Use event-scoped IDs such as:

```
soest26-punk-flasher
soest26-hangover-the-tower
```

Do not reuse generic park IDs.

The display name may stay the same while the scoped ID remains unique.

---

# 4. Operators Are First-Class Data

The Schausteller/operator must be visible in the UI whenever known.

Examples:

- Punk Flasher · Glöss
- Hangover The Tower · Schneider
- Shake & Roll · Schäfer

Operator names must not be hidden only inside code metadata.

If an operator is unknown, leave it empty instead of inventing one.

---

# 5. New-for-Year Markers

If a lineup identifies a ride as new, store this explicitly, e.g.:

```js
new2026: true
```

Render a visible badge such as:

`✦ NEU 2026`

Do not infer “new” merely because NÄHEN has not seen the ride before.

---

# 6. No Fake Live Wait Times

Kirmes events normally have no public structured live wait-time feed.

Default fair configuration:

```js
liveDataUrl: null,
liveWaits: false,
supportsPostedWait: false
```

Consequences:

- no Queue-Times polling
- no fake 0-minute values
- no “LIVE” labels
- no wait-time push alerts
- no public wait-time box in ride details
- no displayed-wait input when the event does not publish one

The personal queue timer remains fully available.

NÄHEN measures the user’s real queue duration itself.

---

# 7. Kirmestag Terminology

For `kind: "fair"`, user-facing copy must use Kirmes terminology:

- Kirmestag starten
- Kirmestag beenden
- aktueller Kirmestag
- Kirmestag-Archiv
- gespeicherte Kirmestage

Do not show “Parktag” for a fair.

Underlying database tables may keep generic historic names such as `park_days`; this must not leak into the UI.

---

# 8. Queue Timer

The personal queue timer is a major fair feature.

It must work without public wait data:

1. user starts Kirmestag
2. opens a ride
3. taps ANSTELLEN
4. timer measures actual queue time
5. BOARDING · GENÄHT closes the session
6. ride and wait time are stored in the Kirmestag archive

If no official posted wait exists, the posted-wait field must be hidden.

---

# 9. Achievements and Nerd Stats

Measured queue achievements can work normally on fairs.

Example:

- “Ich hab mir das nicht Ausgesucht” unlocks from the actual NÄHEN timer

Speed or technical achievements must only use verified metadata.

Never invent ride speed, height, manufacturer or forces simply to populate nerd statistics.

---

# 10. Ordering

For fairs with a supplied lineup, preserve configured lineup order by default.

This is useful when the lineup intentionally groups:

- new rides first
- major rides
- returning rides

Use:

```js
sortMode: "configured"
```

Do not alphabetically reorder unless explicitly desired.

---

# 11. Visual Identity

A Kirmes module should feel different from a permanent park.

Recommended visual language:

- bulbs / neon / painted panels
- operator signage
- ride-specific lettering
- night-fair contrast
- event-year badges
- city/fair atmosphere

Avoid one generic carnival template for every ride.

Major rides should receive individual detail themes.

Operational controls must remain familiar NÄHEN UI.

---

# 12. Dates

Verify public event dates from an official organizer or city source when possible.

Store exact start/end dates in the event config.

Do not infer dates from prior years.

---

# 13. Picker UX

The main selector must support both parks and fairs.

Fair cards should clearly show:

- KIRMES
- location
- date
- event name
- lineup summary

Use “Kirmes öffnen” rather than “Park öffnen”.

The selector count should use neutral wording such as “Ziele verfügbar”.

---

# 14. Push Behavior

Without public live wait data:

- disable wait-threshold alerts
- disable queue-drop alerts
- disable reopen alerts based on live providers

Future fair-specific push features may include:

- event opening reminders
- lineup changes
- ride arrival / cancellation updates
- personal planned-ride reminders

Do not route a fair through the live-wait push pipeline unless a real structured source exists.

---

# 15. Definition of Done

A Kirmes onboarding is complete only when:

- [ ] event slug is year-safe
- [ ] official dates are verified
- [ ] full supplied/verified lineup is represented
- [ ] all known operators are stored and visible
- [ ] all confirmed new-for-year rides are visibly marked
- [ ] no public wait times are fabricated
- [ ] personal queue timer works
- [ ] posted-wait field is hidden when unsupported
- [ ] Kirmestag terminology is used throughout the UI
- [ ] park/fair selector distinguishes the event correctly
- [ ] event-specific ride IDs cannot collide with park rides
- [ ] detail views have fair-specific visual identity
- [ ] PWA cache/version is bumped
- [ ] mobile QA passes
- [ ] deploy is checked
