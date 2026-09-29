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
- attraction names exactly as currently used by the park
- attraction type
- attraction theme / story
- themed area
- official attraction URL
- official image source
- live-data provider name / IDs
- seasonal or event-only status

Never assume the attraction inventory from memory when current research is possible.

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
