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

# 4.1 Fahrpreis Is Per-Ride-Session Manual Data

Fahrpreis is a first-class fair field, but for NÄHEN it is **not a static lineup value**.

Every fair ride config keeps:

```js
priceEuro: null
```

The actual amount paid is entered by the user **for every individual ride session**.

Hard rules:

- never web-research or infer a Fahrpreis
- never copy a price from another city, fair, date, social post or previous year
- never prefill the last price paid for that ride
- never treat an operator's published price as the user's actual paid amount
- the price input starts blank for every new fair ride session
- the user must enter the amount before the queue session starts
- vouchers, discounts, free rides and price changes must therefore be representable exactly
- `0,00 €` is valid when the user actually paid nothing

The session object stores the exact amount:

```js
priceEuro: 8.00
```

For synced accounts, persist it in `queue_sessions.price_euro` as an exact decimal, e.g.:

```sql
price_euro numeric(8,2)
check (price_euro is null or price_euro >= 0)
```

When loading sessions from the database, map `price_euro` back to `session.priceEuro`.

The ride detail/card may explain that the price is entered manually, but must not pretend there is a current official static price.

---

# 4.2 Ride-Index / Technical Nerd Data

For German travelling rides, Ride-Index is a preferred research source for:

- full Schausteller / operator name
- manufacturer
- ride type
- construction year
- dimensions / height
- capacity
- previous names / owners when useful
- premiere information

Store the source URL on the ride:

```js
rideIndexUrl: "https://ride-index.de/..."
```

Expose a source link in the detail view.

Do not fill missing technical facts from guesswork. If Ride-Index has no manufacturer/year, leave the field empty or verify it from an official operator/manufacturer source.

The Schausteller remains especially important and should be more visually prominent than secondary technical facts.

---

# 4.3 Attraction Images

Every important fair ride should receive an actual image of the correct travelling ride, not merely a generic ride of the same type.

Preferred source order:

1. official operator / attraction website
2. official event / city press image
3. Ride-Index or established fairground database
4. reputable fairground photo archive / community source

Store:

```js
imageUrl
imageCredit
imageSourceUrl
```

The detail page must provide the image credit/source when available.

Never use a photo of a similarly named but different operator's ride.

---

# 4.4 Font Variety Is Mandatory

Travelling rides often have unusually strong individual signage. Reflect that instead of applying one generic carnival font repeatedly.

For one fair lineup:

- compare all attraction fonts before completion
- avoid repeating the same font unless two rides genuinely share a visual identity
- use the ride's façade/sign/logo as the typography reference
- preserve readability and mobile safe areas
- operational NÄHEN UI remains in the normal product font

A 20+ ride fair should not visually collapse into four recycled font families.

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

# 15. Required Intake Before Implementation

Before building a new Kirmes module, collect the event input first.

Required inputs:

- event name
- city / location
- year
- event dates if known
- lineup, ideally with operators
- new-for-year markers if known
- **map mode**

The map mode is mandatory input and must be resolved before implementation:

```text
MAP MODE?
[1] MIT KARTE / LAGEPLAN
[2] OHNE KARTE / LAGEPLAN
```

Do **not** assume that every fair has a usable plan.

If the user has not said whether a map should be used, explicitly request this one choice before building the map-specific part.

The rest of the Kirmes module must not depend on a map existing.

---

# 16. Map Branch — With Map vs Without Map

## 16.1 With Map

If the input is **MIT KARTE / LAGEPLAN**, request or resolve the best available source:

1. official organizer/city map
2. official PDF/program containing the map
3. user-provided image/PDF
4. another source explicitly approved by the user

Preferred implementation:

- keep a stable local image asset for the displayed plan where licensing/source terms permit
- store the original source URL separately
- preserve the original aspect ratio
- define clickable attraction points using event-scoped ride IDs
- clicking a marker opens the normal NÄHEN ride detail
- the map is an additional navigation layer, never the only way to reach rides
- mobile zoom/scroll/tap behavior must remain usable
- include source attribution

Example:

```js
specialMap: {
  title: "Lageplan",
  sourceUrl: "https://...",
  imageUrl: "./assets/event-map.png",
  aspectRatio: "1310 / 1841",
  points: [
    { rideId: "event26-example-ride", x: 53.7, y: 70.4 }
  ]
}
```

Coordinates are percentages of the image, not fixed pixels, so the plan remains responsive.

If the plan comes from a PDF, extract/render the relevant page to a stable image asset rather than depending on an embedded PDF viewer.

Verify every marker manually against the plan. Never guess a ride position.

## 16.2 Without Map

If the input is **OHNE KARTE / LAGEPLAN**:

- omit `specialMap`
- do not render an empty map section
- do not invent attraction coordinates
- do not delay the rest of the onboarding
- keep all rides accessible through the normal event overview/search/list
- the event card, detail pages, Kirmestag tracking, manual prices and receipt work identically

A no-map Kirmes is a fully supported first-class configuration.

---

# 17. Event Background and Local Assets

Every fair should have an event-level visual identity in the picker/overview.

Preferred background source order:

1. official event/city image
2. user-provided image
3. reputable fairground/event photo source

For important assets that must render reliably, prefer stable local files in `naehen/assets/` over fragile hotlinks when usage rights/source terms allow it.

Use descriptive event-scoped names, e.g.:

```text
assets/soest-background.webp
assets/soest-big-bamboo.webp
assets/soest-number-1.webp
assets/soest-allerheiligenkirmes-2026-lageplan.png
```

The event config should reference those assets directly.

Always keep image credit/source metadata where available.

---

# 18. Soest-Style Implementation Workflow

Use this sequence for future Kirmes onboardings.

## Phase A — Intake

1. get event identity
2. get supplied lineup
3. resolve **MIT KARTE** vs **OHNE KARTE**
4. record any explicit user constraints, preferred images or rides that need special treatment

## Phase B — Research and Normalize

1. verify event dates from official organizer/city source when possible
2. preserve the user's lineup as source of truth
3. verify operators
4. enrich technical metadata from Ride-Index / operator / manufacturer sources
5. mark new-for-year rides only when confirmed
6. find the correct image for each ride
7. choose an event background
8. do **not** research Fahrpreise

## Phase C — Config

Create a year-scoped event config containing:

- fair identity
- configured ordering
- namespaced ride IDs
- operators
- technical data
- image URL/local asset + credit/source
- `priceEuro: null`
- ride-specific visual/font config
- fair aliases where useful
- no fake live wait configuration

## Phase D — Optional Map

Only when map mode is **MIT KARTE**:

1. acquire the supplied/official plan
2. create a stable local image if appropriate
3. add `specialMap`
4. map every known ride to a percentage coordinate
5. test every map point opens the correct attraction

When map mode is **OHNE KARTE**, skip this entire phase.

## Phase E — Kirmestag Price Capture

For every fair queue start:

1. open the queue sheet
2. show `FAHRPREIS (€) · MANUELL`
3. leave it blank every time
4. require a valid number >= 0
5. store it on that exact session as `priceEuro`
6. persist it locally
7. if Supabase sync exists, write it to `queue_sessions.price_euro`
8. restore it when loading active/archive sessions

Never prefill the previous ride price.

## Phase F — Kirmestag Receipt

When the user ends a Kirmestag, render a receipt-style recap for all `status === "ridden"` sessions.

The receipt should contain:

- NÄHEN branding
- event name/city/year
- Kirmestag date
- chronological list of ridden attractions
- ride time
- manually entered price for each ride
- total number of rides
- total spend
- average spend per priced ride
- clear warning for legacy/missing prices
- a short NÄHEN closing line

Example structure:

```text
             NÄHEN.
   ALLERHEILIGENKIRMES · SOEST
--------------------------------
01  Punk Flasher          8,00 €
02  Avenger               7,00 €
03  Tiki Taki XXL         8,00 €
--------------------------------
GESAMT                   23,00 €

3 Fahrten · Ø 7,67 € / Fahrt
Danke fürs Nähen.
```

The same receipt must also render from the Kirmestag archive after a reload or on another synced device.

## Phase G — Persistence

If the project uses Supabase:

- schema must contain `queue_sessions.price_euro numeric(8,2)`
- queue-start insert includes `price_euro`
- queue-end update keeps `price_euro`
- DB-to-client mapping restores `priceEuro`
- archived sessions therefore retain receipt data

Whenever schema changes are made:

1. apply a migration
2. verify the column/schema with a query
3. run Supabase security/performance advisors
4. distinguish unrelated pre-existing warnings from regressions caused by the change
5. keep the repository schema file in sync with the live database

## Phase H — QA

Test at minimum:

- fair opens from picker
- all lineup rides appear exactly once
- local ride images load
- event background loads
- manual price field is blank on every queue start
- invalid/empty price is rejected
- `0,00 €` is accepted
- completed ride keeps its exact price
- second ride does not inherit first ride's price
- ending Kirmestag opens recap/receipt
- total and average are mathematically correct
- archive receipt survives reload
- synced receipt survives account reload/device change
- if map mode is on: all markers point to correct rides
- if map mode is off: no empty/broken map UI exists
- mobile layout remains usable
- PWA cache/version is bumped when cached assets/config changed

---

# 19. Definition of Done

A Kirmes onboarding is complete only when:

- [ ] event slug is year-safe
- [ ] official dates are verified
- [ ] full supplied/verified lineup is represented
- [ ] all known operators are stored and visually prominent
- [ ] Ride-Index / official technical data is linked where available
- [ ] every ride config keeps `priceEuro: null`
- [ ] map mode was explicitly resolved as WITH MAP or WITHOUT MAP
- [ ] if WITH MAP: plan source, responsive map and ride markers are verified
- [ ] if WITHOUT MAP: no empty/broken map UI is rendered
- [ ] Fahrpreis is entered manually for every individual ride session
- [ ] price input never inherits/prefills a previous price
- [ ] manual price persists locally and, when enabled, through Supabase
- [ ] Kirmestag receipt shows rides, individual prices, total and average
- [ ] archived/synced receipts retain the exact entered prices
- [ ] current-event prices are never copied/researched automatically
- [ ] correct ride images are included with source/credit where available
- [ ] attraction fonts were reviewed for lineup-wide variety
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
