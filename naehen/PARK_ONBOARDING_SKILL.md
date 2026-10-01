# NÄHEN — Park Onboarding Skill

## Purpose

This skill defines the repeatable workflow for adding a complete theme park to NÄHEN.

The desired end state is that a future request such as:

> "Implementiere bitte den Movie Park."

is enough to trigger the full workflow without the user having to repeat all design, research, image, typography, live-data, and QA requirements.

This skill is about **park onboarding and attraction research**.  
The existing `ASTRA_UI_SKILL.md` remains responsible for the deeper visual design language of NÄHEN.

---

# 1. Core Principle

A newly added park must feel researched and deliberately integrated.

Do not:
- invent attractions
- use random Google Images
- use generic attraction cards with only a color swap
- assign fonts without understanding the attraction
- treat seasonal event-only attractions as permanent park inventory
- create separate typography logic for Home and Detail
- make park-specific hacks that cannot scale to another park

The workflow must be reproducible for every park.

---

# 2. Trigger

Use this workflow whenever the user asks to add, implement, integrate, onboard, or support a new theme park in NÄHEN.

Examples:

- "Implementiere bitte den Movie Park."
- "Füge den Europa-Park hinzu."
- "Mach jetzt Walibi Holland."
- "Nimm Toverland mit rein."

Unless the user explicitly asks for only one small part, treat this as a **full park onboarding task**.

---

# 3. Phase A — Research the Park First

Before coding, research the park from current web sources.

Prefer sources in this order:

1. official park website
2. official attraction pages
3. official themed-area pages
4. official park app / official park media where accessible
5. Queue-Times or another live-data provider for operational names and waits
6. secondary sources only when official information is unavailable

Collect:

- official park name
- stable internal park slug
- country / region
- themed areas
- permanent attractions
- official/source attraction names exactly as currently used by the park
- the German user-facing attraction name used by NÄHEN
- attraction type
- attraction theme / story
- themed area
- official attraction URL
- official image source
- live-data provider name / IDs
- seasonal or event-only status

Never assume the attraction inventory from memory when current research is possible.

---

# 3.1 German Attraction Names — Hard Rule

**All user-facing attraction names in NÄHEN must be German wherever a German name or sensible German localization exists.**

This applies everywhere the attraction name can appear:

- Home attraction cards
- Detail views
- queue / timer sheets
- active queue bar
- park-day protocol and recap
- profile / achievement unlock details
- favorites and push settings
- push notifications
- search results and labels

Live-data providers such as Queue-Times are **data sources, not display-name sources**.

A provider may return an English, Dutch, French or otherwise translated name. That provider name may be retained internally as an alias for matching, but it must never overwrite the German NÄHEN display name once the attraction is configured.

Implementation rule:

```js
providerName -> alias / stable ride ID -> German NÄHEN display name
```

Do **not** render:

```js
ride.name = rawLiveProviderName;
```

when a configured German display name exists.

For parks outside Germany:

1. use an official German attraction name if the park provides one
2. otherwise use an established German name when one exists
3. otherwise translate descriptive/generic attraction names into natural German
4. keep genuine brand names, character names and proper attraction trademarks unchanged when translating them would destroy the attraction identity

Examples:

- `The Oath of Kärnan` from a live provider -> **Der Schwur des KÄRNAN**
- `Wild Water Ride - The Great Pike` -> **Wildwasserfahrt – Der Wasserwolf am Ilmensee**
- `4D-bioscoop` -> **4D-Kino**
- a genuine branded name such as **Taron**, **Kondaa**, **Silver Star** or **Star Trek™: Operation Enterprise** stays unchanged

Aliases must preserve provider/original spellings so live mapping continues to work.

Stored queue sessions and history must also resolve their ride ID back to the current German configured display name. Old provider-language strings must not leak back into the UI.

---

# 4. Permanent vs Seasonal Attractions

Normal NÄHEN park inventory should contain permanent or normally operating attractions.

Do not include as permanent attractions:

- Wintertraum-only experiences
- Halloween-only mazes
- Christmas-only walkthroughs
- temporary event installations
- one-off shows
- seasonal overlays that appear as separate live-feed entries

If a live-data provider exposes these anyway, maintain a park-specific exclusion list.

A seasonal attraction may only be added to the normal inventory if the user explicitly wants seasonal content supported.

---

# 5. Official Attraction Images

## Hard rule

For every attraction, first open the **official attraction page for that exact attraction**.

Choose a suitable image that actually appears on that attraction page.

Preferred image priority:

1. official attraction-page hero image
2. strong official attraction-page landscape image
3. official attraction-page gallery image
4. official themed-area image only when the attraction page itself has no useful image

Do not use:

- random search-engine images
- fan photos
- TripAdvisor images
- Reddit images
- social-media reposts
- unrelated themed-area images when an attraction-specific official image exists
- screenshots with UI or watermarks

The image should visually represent the attraction itself.

Store the source URL and official attraction page in the attraction metadata when practical.

When using remotely hosted art, prefer the park's own official CDN/domain. Do not re-upload third-party copyrighted files into the repository unless the user has supplied them or use is otherwise clearly permitted.

---

# 6. One Central Attraction Art Source

Home cards and Detail views must use the **same central art configuration**.

Never hardcode a Home image in one place and a Detail image somewhere else.

Conceptually:

```js
attraction.art = {
  source: "official",
  pageUrl: "...",
  imageUrl: "..."
}
```

or the equivalent structure already used by the app.

The UI may crop the same image differently on Home vs Detail, but it must originate from the same attraction configuration.

---

# 7. Theme Research per Attraction

For each attraction, inspect the official attraction page and, when useful, its themed-area page.

Extract visual direction from:

- story / setting
- architecture
- signage
- color palette
- materials
- textures
- ride vehicle
- logo treatment
- queue environment
- props
- cultural / historical inspiration
- lighting
- mood
- motion

Summarize the attraction internally as a compact theme tag, for example:

- `rookburgh-steampunk`
- `western-goldrush`
- `mesoamerican-temple`
- `gothic-castle`
- `african-expedition`
- `comic-water-battle`

This tag informs typography and Detail-view styling.

---

# 8. Typography Workflow

Typography must be attraction-specific where appropriate.

## Font selection order

1. Google Fonts
2. existing approved special fonts already used by NÄHEN
3. another webfont only when licensing and reliability are acceptable
4. sensible serif / sans-serif fallback

Prefer Google Fonts whenever a suitable font exists.

Do not remove existing approved special fonts such as:
- African
- Gang of Three
- Old London
- Steampunk Machinery

unless the user explicitly asks to replace them.

## Central mapping rule

There must be exactly one central attraction-font mapping.

Example:

```js
const ATTRACTION_FONTS = {
  "ride-slug": {
    fontFamily: "'Some Font', serif",
    theme: "theme-tag"
  }
};
```

Home attraction name and Detail attraction title must consume the same variable/configuration.

Do not maintain separate Home and Detail font lists.

Decorative fonts are for:
- attraction names
- card titles
- Detail/Hero titles

Do not use them for:
- body text
- queue information
- status messages
- controls
- Single Rider explanations
- timestamps

Operational text stays in the normal NÄHEN UI typeface.

---

# 9. Home Overview Rules

The Home overview must remain consistent as one park dashboard.

Per-attraction theming on Home should normally be limited to:

- official attraction image
- attraction display font
- restrained title styling

Do not give one Home card a radically different overlay, box, or structure unless there is a genuine readability problem.

Fix contrast **locally and minimally**.

Do not apply broad global dark overlays merely because one attraction is hard to read.

Favorite button:
- top-right corner of the complete card
- never tied to title width
- must remain clearly tappable

Operational information must stay readable and visually consistent across all attractions.

---

# 10. Detail View Rules

Each attraction Detail view should feel like a small themed portal.

Use the attraction research to influence:

- hero crop
- background treatment
- material language
- title presentation
- borders
- panel shapes
- accents
- shadows
- atmosphere

Do not merely swap image + accent color.

At the same time, usability remains consistent:

- close button stays obvious
- Android/browser Back closes the Detail view before leaving the app
- wait time remains readable
- Single Rider/community data remains readable
- body text uses UI typography
- ANSTELLEN button never overlays another content block
- CTA remains in normal content flow unless a sticky layout has been proven collision-free
- long titles must remain inside any decorative title plaque
- if a decorative plaque is visually awkward, remove the plaque instead of forcing the title into it

---

# 11. Contrast and Accessibility

Do not solve contrast globally when the issue is local.

For each attraction inspect:

- title vs image
- body text vs themed surface
- labels vs themed surface
- wait time vs background
- status box vs text
- Single Rider box vs text
- CTA vs background

When colors are too similar:

1. adjust text color first
2. strengthen a local shadow / text stroke
3. adjust the local surface
4. add a subtle attraction-colored veil
5. only use stronger overlays when necessary

Preserve theme identity.

Avoid:
- beige on beige
- muted gray on cream
- purple on similarly dark purple
- gold on similarly bright tan
- translucent UI text directly over busy photography

Test around 360–430 px phone widths.

---

# 12. Live Data Integration

Research whether the park exists in the current live-data provider.

For Queue-Times or equivalent:

- determine the correct park ID
- inspect exact live attraction names
- map live names to stable NÄHEN slugs
- preserve aliases for punctuation, umlauts, apostrophes, accents, or renamed rides
- exclude seasonal/event-only entries
- do not invent Single Rider information when the feed does not provide it
- retain required provider attribution

Unknown live-feed attractions should not silently break theming.

The system should gracefully render a readable generic attraction until its configuration is researched.

---

# 13. Slug and Alias Rules

Stable attraction IDs must not depend blindly on current display spelling.

Handle:

- umlauts
- apostrophes
- curly apostrophes
- punctuation
- branded capitalization
- alternative official spellings
- live-provider naming differences

Example:

```js
"wözl's example" -> "woezls-example"
```

Maintain aliases centrally.

Do not duplicate attraction records because two sources spell a name differently.

---

# 14. Multi-Park Architecture

Before adding the second park, do not continue growing a Phantasialand-only global object forever.

Introduce or extend a park registry so each park can own its data.

Conceptually:

```js
const PARKS = {
  phantasialand: {
    name: "Phantasialand",
    liveProvider: {...},
    attractions: {...}
  },
  moviePark: {
    name: "Movie Park Germany",
    liveProvider: {...},
    attractions: {...}
  }
};
```

Exact file structure may differ, but the architecture must support:

- park selector
- active park
- park-specific attractions
- park-specific live provider ID
- park-specific exclusions
- park-specific aliases
- park-specific images
- park-specific themed areas
- attraction font/theme configuration

Do not break existing Phantasialand behavior while introducing this abstraction.

---

# 15. Suggested Park Data Shape

When a multi-park refactor is appropriate, prefer a structure similar to:

```js
{
  slug: "example-ride",
  name: "Example Ride",
  area: "Example Area",
  permanent: true,
  officialUrl: "https://...",
  art: {
    imageUrl: "https://official-park-cdn/...",
    source: "official-attraction-page"
  },
  typography: {
    fontFamily: "'Example Font', serif",
    theme: "example-theme"
  },
  live: {
    aliases: ["Example Ride"]
  }
}
```

Avoid scattering this information across unrelated CSS and JavaScript files when it can live centrally.

---

# 16. Research Checklist for Every Attraction

Before calling an attraction finished, confirm:

- [ ] attraction exists on current official park site
- [ ] German user-facing attraction name verified/localized
- [ ] provider/original non-German names retained only as aliases
- [ ] permanent vs seasonal status understood
- [ ] themed area identified
- [ ] official attraction page opened
- [ ] image chosen from that attraction page
- [ ] image source recorded
- [ ] theme/story understood
- [ ] font deliberately selected
- [ ] font available and loadable
- [ ] font mapped centrally
- [ ] Home title uses central font
- [ ] Detail title uses the same central font
- [ ] body text remains UI font
- [ ] Home card contrast checked
- [ ] Detail contrast checked
- [ ] long title checked on mobile
- [ ] CTA cannot collide with SR/community content
- [ ] live-data name mapped
- [ ] seasonal aliases/exclusions handled

---

# 17. Park-Level QA Checklist

Before completing a new park:

- [ ] all permanent attractions from the official site are represented or intentionally excluded
- [ ] every user-facing attraction name is German or an intentional unchanged brand/proper name
- [ ] live-provider names cannot overwrite configured German display names
- [ ] no event-only attractions slipped into permanent inventory
- [ ] every configured attraction has an official image when available
- [ ] no random web images were used
- [ ] all fonts load
- [ ] Home and Detail font mappings match
- [ ] Home card layout remains visually consistent
- [ ] Detail views feel attraction-specific
- [ ] text remains readable
- [ ] favorite buttons stay top-right
- [ ] Detail Back behavior works on mobile
- [ ] CTA does not cover SR/community information
- [ ] provider attribution remains visible
- [ ] live-data fallback still works
- [ ] PWA cache/version is bumped
- [ ] final deployment succeeds

Test at minimum:
- 360 px
- 390 px
- 412/430 px
- installed PWA behavior where practical

---

# 18. Execution Order

For a full new-park request, work in this order:

1. research official park attraction inventory
2. classify permanent vs seasonal
3. research live-data provider / park ID
4. establish park data structure
5. add aliases and exclusions
6. visit every official attraction page
7. select official attraction-page images
8. research theme/story/area for each attraction
9. assign typography centrally
10. integrate Home cards
11. integrate Detail views
12. verify waits and provider attribution
13. check contrast attraction-by-attraction
14. check mobile layout and Back behavior
15. bump PWA cache/version
16. verify final deployment

Do not jump directly into CSS before the attraction inventory and sources are understood.

---

# 19. Definition of Done

A park is not "implemented" merely because its rides appear in a list.

A park is complete when a user can open NÄHEN and feel that:

- the park inventory is accurate
- the imagery is authentic
- each attraction looks recognizably like itself
- typography matches its world
- waits and controls remain operational
- Home feels consistent
- Detail views feel immersive
- seasonal noise is excluded
- the experience works on a phone

The target is the same standard established by the Phantasialand implementation, reproduced through a documented workflow rather than one-off manual memory.


---

# 20. Park Selector Is a First-Class App Layer

NÄHEN has a park-selection level **above** every individual park.

This is part of the core architecture, not a temporary Phantasialand screen.

The normal app flow is:

1. PWA / installation handling
2. account / local-mode handling
3. **park selection**
4. selected park dashboard
5. attraction detail

On a fresh entry into the authenticated/local app, show the park selector first.

Do not automatically drop the user directly into the previously used park unless the user explicitly asks for that behavior later.

Each new park added to NÄHEN must automatically become another selectable park on this screen.

---

# 21. Central Park Registry

Every supported park must have one central park-level configuration.

The current pattern should remain conceptually similar to:

```js
const PARKS = {
  phantasialand: {
    slug: "phantasialand",
    name: "Phantasialand",
    location: "Brühl · Nordrhein-Westfalen",
    liveDataUrl: "./live.json",
    cardImage: "./assets/park.webp",
    cardCopy: "Live-Wartezeiten, Nähprotokoll und deine Attraktionen.",
    disclaimer: "Kein offizielles Angebot des Parks."
  }
};
```

When adding another park, extend this registry rather than creating unrelated global constants.

The registry should own or point to:

- stable park slug
- display name
- location
- live-data source
- park-selection card image
- short park-selection description
- legal/unofficial disclaimer
- park-specific attraction data
- park-specific aliases
- park-specific exclusions
- park-specific fallback rides
- any park-level visual metadata needed later

The selected park is represented by a single active park slug/config.

---

# 22. One Park = One NÄHEN World

The park selector leads into a dedicated park dashboard.

A park should feel like its own page/world while still using the shared NÄHEN product shell.

When a park is opened:

- set the active park
- hide the park selector
- show the main app/navigation
- set the park name in the Parktag header
- set the park-specific disclaimer
- reset temporary search/filter UI
- load park-specific account state
- load park-specific live data
- render that park's attractions
- start that park's live refresh cycle

Do not mix attractions from different parks into one dashboard.

Switching parks must not leave behind another park's live data, search state, temporary filters, or UI labels.

---

# 23. Park-Scoped User State

Anything that logically belongs to a park should be scoped by the active park.

At minimum, park-day lookup must use the park slug.

For account-backed park days, query by:

- user ID
- active park slug
- active / not ended

Starting a new park day must store the current park slug instead of a hardcoded park name.

As multi-park support grows, review whether the following also need explicit park namespacing:

- favorites
- favorite notification settings
- local park days
- local sessions
- cached waits
- park-specific history/recaps

Avoid future ID collisions between rides in different parks.

If attraction IDs are not globally unique, namespace them by park or store the park slug alongside them.

---

# 24. Park-Scoped Live Data

The live-data loader must use the active park configuration.

Do not keep one global hardcoded live-data URL.

Conceptually:

```js
const park = activeParkConfig();
fetch(park.liveDataUrl);
```

Cached wait snapshots should also be park-specific.

Example:

```js
naehen:lastWaits:phantasialand
naehen:lastWaits:movie-park
```

When leaving a park:

- stop its refresh interval
- do not continue background refreshes for a park that is no longer active

When entering a park:

- load immediately
- then start the recurring refresh loop

Bind visibility-refresh logic only once and make it respect the currently active park.

---

# 25. Park Selector Visual Workflow

The park-selection page has its own visual identity.

It is **not** an attraction detail page and should not inherit attraction-specific styling.

The selector should contain:

- NÄHEN branding
- clear "Park auswählen" context
- a strong introductory headline
- one card/tile per park
- park name
- location
- short description
- explicit "Park öffnen" affordance

It must be mobile-first and usable around 360–430 px.

The selector should still look good with one park only, but the layout must naturally scale to several parks later.

---

# 26. Park Selector Background Image

The park-selector background is separate from every park card image.

When the user supplies a background photo specifically for the selector:

1. use that exact supplied photo
2. optimize it for web/PWA delivery
3. prefer WebP or another efficient web format
4. preserve the visual character of the image
5. crop it for mobile so the important subjects remain visible
6. add only the minimum gradient/veil required for readable UI
7. do not reuse that background as the individual park-card image unless explicitly requested
8. add it to the service-worker cache if it is a core selector asset

The selector background should communicate a general **theme-park-day feeling**, not necessarily one attraction.

Avoid crushing the photo under an overly dark overlay.

Use graduated contrast:
- lighter over visually important subjects
- stronger behind text/cards where required

The user may later replace this background without requiring a redesign of the park architecture.

---

# 27. Park Card Artwork

Each park card should have its own park-specific artwork.

This is separate from the selector's page-wide background.

For a park card:

- prefer a representative park image
- keep the park name and location readable
- use a local gradient for the card if needed
- do not let one park card introduce a completely different structural UI from the others

As more parks are added, all park cards should share the same interaction/layout language even though their imagery differs.

---

# 28. Navigation and Hardware Back Behavior

The park selector must participate in browser/PWA history.

Desired Back behavior:

1. attraction Detail → closes Detail
2. park dashboard → returns to Park Selection
3. Park Selection → browser/PWA may leave the app normally

Opening a park should create an appropriate history entry.

Returning to the selector must stop park live refreshes.

The park dashboard should also expose a visible **PARKS / back-to-parks** control.

Do not implement navigation only as show/hide state without browser-history support, because Android hardware Back must behave naturally.

---

# 29. Park Selector and Authentication

The selector belongs **after** account/install setup, not before it.

Do not duplicate authentication separately per park.

One NÄHEN account can select among supported parks.

The selector therefore appears after:

- install/preview decision
- backend readiness
- login/signup or local mode

The selected park then determines which park-specific state/data is loaded.

---

# 30. PWA Asset and Cache Rules for New Parks

Every park onboarding can introduce new core assets.

When adding or changing:

- park selector background
- park card artwork stored locally
- new JS/CSS architecture
- critical local park assets

always verify the PWA update path.

Required steps:

1. bump asset query versions when used
2. bump the service-worker cache version
3. register the matching new service-worker version
4. include new core local selector assets in the service-worker core cache when appropriate
5. ensure old caches are deleted on activation
6. verify the final GitHub Pages deployment, not merely an intermediate commit

Do not assume a user will automatically receive changed CSS/images in an already installed PWA.

---

# 31. Multi-Park Onboarding Sequence

For every future park, the complete workflow now includes both **park-level onboarding** and **attraction-level onboarding**.

Use this order:

1. research the park itself
2. define park slug, display name, location and disclaimer
3. add the park to the central PARKS registry
4. choose/add the park-selection card artwork
5. confirm the park appears correctly on the selector
6. research official attraction inventory
7. classify permanent vs seasonal/event-only
8. research live-data provider and exact park ID/source
9. configure park-specific live-data URL/source
10. add park-specific exclusions and aliases
11. establish park-specific attraction/fallback data
12. visit every official attraction page
13. choose the official image from each exact attraction page
14. research theme/story/themed area
15. choose attraction typography
16. map typography centrally
17. integrate consistent Home cards
18. build immersive Detail views
19. verify account park-day state uses the park slug
20. verify live wait cache/refresh is park-scoped
21. test selector → park → Detail navigation
22. test hardware Back: Detail → park → selector
23. test return-to-Parks control
24. test contrast and mobile layout
25. bump PWA/cache versions
26. cache new critical local assets
27. verify the final deployment

---

# 32. Updated Multi-Park Definition of Done

A newly added park is not finished until all of the following are true:

- [ ] park exists in the central PARKS registry
- [ ] park appears on the Park Selection page
- [ ] park card has appropriate artwork
- [ ] park name/location/copy are correct
- [ ] opening the park shows only that park's dashboard
- [ ] park-specific disclaimer is correct
- [ ] active park controls the live-data source
- [ ] wait cache is park-scoped
- [ ] active Parktag lookup is park-scoped
- [ ] new Parktag records store the park slug
- [ ] leaving the park stops its refresh loop
- [ ] visible PARKS control returns to selector
- [ ] hardware Back returns park → selector
- [ ] attraction Detail Back still works first
- [ ] all attraction-level onboarding checks are complete
- [ ] new core local assets are included in PWA update/cache handling
- [ ] installed PWA receives the new version
- [ ] final GitHub Pages deployment succeeds

The Park Selection page is now part of the permanent NÄHEN architecture. Do not bypass or remove it when onboarding future parks unless the user explicitly changes the product direction.


---

# 33. Cross-Park Originality — No Theme Cloning

Every attraction must feel like **its own designed world**, even when another park contains an attraction with a similar genre.

Existing NÄHEN attractions are quality references, not templates to copy.

Do not automatically reuse:

- the same Detail layout
- the same title plaque shape
- the same hero treatment
- the same border language
- the same panel geometry
- the same material treatment
- the same color composition
- the same font
- the same text-shadow recipe
- the same decorative motif

simply because two attractions share a broad theme such as:

- Western
- space / sci-fi
- pirates
- medieval
- jungle
- water
- horror
- racing
- cartoon
- steampunk
- fairground

A new park must not look like a reskinned collection of Phantasialand, Movie Park, Walibi Holland, or any other previously implemented park.

---

# 34. Font Diversity Across Parks

Before assigning a display font to a new attraction, inspect the fonts already used by **all existing parks**.

The preferred workflow is:

1. understand the attraction's actual visual identity
2. inspect its official logo, signage, architecture and marketing
3. shortlist suitable fonts
4. check whether those fonts are already heavily used elsewhere in NÄHEN
5. prefer a different suitable font when this improves individuality
6. only reuse an existing font when it is genuinely the strongest thematic match

Do not create repetitive rules such as:

- every Western attraction = Rye
- every futuristic attraction = Orbitron
- every pirate attraction = Trade Winds
- every kids attraction = Luckiest Guy
- every medieval attraction = Almendra
- every vintage attraction = Limelight

Those fonts may still be used, but **never as an automatic category default**.

When a font is reused, compensate with clearly different:

- weight
- spacing
- casing
- scale
- composition
- title placement
- material treatment
- surrounding graphic language

The goal is not artificial uniqueness at any cost.  
The goal is to prevent NÄHEN from becoming visually repetitive.

---

# 35. Layout Diversity Across Parks

Do not solve every Detail view with the same structure plus different colors.

The underlying functional order may remain consistent for usability, but the visual composition should respond to the attraction itself.

Possible differences include:

- full-bleed vs framed hero
- asymmetrical vs centered title
- title integrated into the image vs below it
- signage-like title treatment
- industrial label treatment
- engraved / painted / illuminated / stamped title treatment
- clipped geometry
- organic edges
- architectural framing
- layered scenery
- map / dossier / ticket / control-panel / poster / newspaper / laboratory / expedition-log presentation
- vertical vs horizontal visual rhythm
- restrained vs highly theatrical atmosphere

Do not mechanically rotate through a small set of predefined templates.

The official attraction imagery and theme research should determine the composition.

---

# 36. Attraction Identity Must Beat Park-Level Consistency

Park-level branding provides the outer shell.

Attraction-level identity controls the immersive Detail experience.

For example:

- two coasters in the same park may need completely different typography and composition
- two pirate rides in different parks should not automatically share the same pirate styling
- two sci-fi attractions should reflect their specific fiction, era, technology and visual language
- two Western attractions should distinguish saloon, mining, railway, outlaw, desert, industrial or cinematic interpretations

Do not reduce an attraction to a generic category.

Ask internally:

> "What makes this exact attraction visually different from every attraction already in NÄHEN?"

If the answer is only a different image and accent color, the design is not finished.

---

# 37. Cross-Park Similarity Check

Before completing the styling of a new attraction, compare it against existing attractions in NÄHEN.

Check whether it unintentionally duplicates:

- font family
- title composition
- hero crop
- plaque shape
- panel design
- dominant palette
- border style
- decorative geometry
- atmospheric treatment

If several of these are substantially identical to another attraction without a strong thematic reason, redesign the new one.

A reused font alone is acceptable when justified.

A reused font + same title layout + same materials + same panel treatment is generally not acceptable.

---

# 38. Immersion Standard

The target is not merely "themed."

The target is:

> Opening the Detail view should feel like stepping into the attraction's queue, station, story world or visual universe.

Use official references to infer:

- what the surfaces would feel like
- what signage would look like
- how information would be presented inside that world
- whether the environment feels polished, ruined, futuristic, handmade, luxurious, playful, dangerous, industrial, mystical or cinematic
- whether typography feels printed, painted, engraved, illuminated, projected, stamped or hand-drawn

Every Detail page should have at least one recognizable visual idea that belongs specifically to that attraction.

---

# 39. Updated Design Definition of Done

An attraction is not visually complete until:

- [ ] its font was chosen deliberately rather than by category habit
- [ ] cross-park font repetition was checked
- [ ] its Detail composition differs meaningfully from similar attractions where appropriate
- [ ] its styling reflects the exact attraction, not only the broad themed area
- [ ] its official imagery drives the visual direction
- [ ] its title treatment feels native to its world
- [ ] its operational information remains readable
- [ ] its layout does not look like a recolored copy of another NÄHEN attraction
- [ ] there is at least one attraction-specific visual idea beyond image + accent color
- [ ] the final result feels immersive and individually authored

When in doubt, prefer more attraction-specific research over reusing an existing NÄHEN pattern.


---

# 33. Global Visual Uniqueness Across Parks

NÄHEN must not slowly turn into a library of repeated attraction templates.

Every attraction should be treated as its own researched visual world, even when another attraction in another park has a similar genre.

## Hard rule

Do not automatically reuse the same:

- display font
- title composition
- title plaque
- hero crop
- panel geometry
- border language
- texture treatment
- background material
- color hierarchy
- shadow treatment
- decorative motif
- information-panel arrangement

just because two rides are both, for example:

- Western
- space themed
- pirate themed
- medieval
- haunted
- steampunk
- children's rides
- racing
- water rides

A shared genre is only a starting point for research, never a finished design decision.

---

## 33.1 Cross-Park Font Audit

Before assigning a font to a newly onboarded attraction:

1. inspect the fonts already used by attractions in every existing park
2. check whether the proposed font is already strongly associated with another attraction
3. research whether a different font would fit the new attraction more specifically
4. prefer a distinct font when it improves authenticity
5. only reuse a font when the two attractions genuinely share a very similar real-world graphic language

Do not let convenient Google Fonts become repetitive defaults.

Examples of what to avoid:

- every Western ride using Rye
- every sci-fi ride using Orbitron
- every pirate ride using Trade Winds
- every haunted ride using Creepster
- every fairground ride using Limelight
- every children's attraction using Luckiest Guy

Repeated fonts are allowed only when the visual evidence actually supports them.

The goal is not "every ride must mathematically have a unique font", but rather:

> no attraction should look like another attraction merely because the easiest existing font was reused.

---

## 33.2 Cross-Park Layout Audit

Before styling a new Detail view, compare it against existing attraction Detail views across all parks.

Ask:

- Does this title treatment already exist somewhere else?
- Does this hero shape already look familiar?
- Am I repeating the same border + panel + gradient recipe?
- Would a user recognize the actual attraction if the hero image disappeared?
- Is the visual language driven by the attraction, or by an existing NÄHEN template?

If the result feels like a recolored version of another attraction, redesign it.

Attraction-specific layouts may differ through:

- asymmetric composition
- centered vs offset titles
- full-bleed vs framed hero artwork
- cut metal / ticket / poster / map / machinery / signage / stone / wood / neon / glass / fabric metaphors
- differently shaped wait-time areas
- themed separators
- restrained background patterns
- decorative typography treatment
- image crops inspired by the attraction's official page
- local atmospheric lighting

Do not change the core usability structure so radically that controls become inconsistent, but the **visual shell around the shared controls should feel bespoke**.

---

## 33.3 Immersion Standard

The design target is:

> Opening an attraction Detail view should feel like entering that attraction's world, not opening another generic card in the same app.

Use official source material to drive that result.

For every attraction, deliberately inspect:

- attraction logo/signage
- official marketing key visual
- physical façade
- queue signage
- vehicles
- dominant materials
- architectural era
- story setting
- color relationships
- lettering style
- iconography
- lighting mood
- scenic props

Translate those details into UI rather than relying on a generic category label.

For example, two sci-fi rides should not both become "dark navy + cyan + Orbitron".

One may instead be:
- sterile research interface
- retro-futurist control panel
- industrial reactor
- spacecraft navigation console
- cinematic poster
- analog mission equipment

depending on the attraction itself.

---

## 33.4 Park-Level Variety

A whole park must not feel as if every attraction uses the same visual recipe either.

Within one newly onboarded park:

- alternate composition where the source material supports it
- avoid assigning the same font to many unrelated attractions
- avoid repeating identical title plaques
- avoid repeating identical hero masks
- vary material language by themed area and attraction
- keep operational UI consistent while attraction shells remain individual

When attractions deliberately share a single branded universe or themed area, visual relationships are welcome, but they should still retain attraction-level identity.

---

## 33.5 Reuse What Should Be Reused

Do reuse shared product behavior:

- close button behavior
- Back navigation
- wait-time logic
- Single Rider/community logic
- CTA behavior
- accessibility structure
- responsive breakpoints
- data-loading behavior
- font mapping architecture
- image mapping architecture

Do not confuse code reuse with visual repetition.

The implementation should reuse the underlying system while producing distinct attraction experiences.

---

## 33.6 Mandatory Design Review Before Completion

Before declaring a park complete, perform a cross-park uniqueness review.

For every newly added attraction, check:

- [ ] font was compared against fonts already used in other parks
- [ ] font is not a lazy genre default
- [ ] Detail layout was compared against existing Detail layouts
- [ ] title treatment does not look copied from another attraction without justification
- [ ] hero treatment is attraction-specific
- [ ] material/background language is attraction-specific
- [ ] visual design is based on official attraction references
- [ ] another existing attraction could not simply swap into this layout unnoticed
- [ ] operational controls remain familiar despite the custom visual shell
- [ ] the page feels immersive enough that the attraction identity is clear before reading all supporting text

If several new attractions look obviously related only because the same CSS pattern was copied and recolored, the onboarding is not finished.

---

# 34. Updated Visual Definition of Done

A park is visually complete only when:

- every major attraction has a recognizable visual identity
- fonts do not repeatedly default to the same handful of choices across parks
- layouts are not duplicated merely for implementation speed
- similar genres still feel like different attractions
- Detail views remain immersive on mobile
- official reference material is visibly reflected in the UI
- shared NÄHEN functionality remains consistent underneath the custom presentation

The quality target is **bespoke attraction portals on top of a reusable technical platform**.
