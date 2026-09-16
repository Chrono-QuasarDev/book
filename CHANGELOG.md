# Nikops Royal Hotel — Website

A premium, image-led booking site built on the architecture of the supplied
template. **Semantic HTML5, modular hand-written CSS, vanilla JS. No framework,
no jQuery, no animation library.**

---

## Rebrand: Aurelia Bay → Nikops Royal Hotel

The previous build was a fictional luxury resort used to develop the layout
system. Every page has now been repopulated with the **verified production data**
for Nikops Royal Hotel. The design system, components and JS modules are
unchanged — only content, imagery and the data layer were replaced.

### Verified data now live across the site

| Field | Value | Where it appears |
|---|---|---|
| Name | Nikops Royal Hotel | All pages, `<title>`, schema |
| Star rating | 2-star accommodation | About, schema |
| Guest rating | 4.6 / 5 | Hero strip, testimonials, stats, trust badges, schema |
| Phone | +233 59 833 8215 | Header CTA, footer, contact, booking, all `tel:` links |
| WhatsApp | wa.me/233598338215 | Floating button (all pages), footer |
| Email | nikopsroyalhotel@gmail.com | Footer, contact, booking confirmation |
| Address | Tuba-Kokrobite Road, near Tuba Junction, off Kasoa Road, Ngleshi Amanfro, Greater Accra | Footer, contact, schema |
| Ghana Post GPS | **GS-0356-3338** | Footer, contact, map card, booking sidebar |
| Check-in / out | 12:00 PM / 12:00 PM | Hero note, room detail, booking, policies, schema |
| Pets | Not allowed | Policies, booking form note, schema |
| Smoking | Non-smoking throughout | Trust strip, policies, booking note, schema |
| Breakfast | À la carte · Continental · Full English/Irish | Restaurant section, room detail, booking dropdown |
| Amenities | Private bathroom, shower, swimming pool, restaurant, bar | Amenity grids, carousel, trust strip, schema |
| Distances | 20 km Accra Central Mosque · 25 km Independence Arch / Nkrumah Memorial Park | Destination cards, stats, contact |
| Currency | GH₵ (GHS) | All room rates |

### New: a single source of truth

`js/hotel-data.js` holds the whole verified record as one `window.NIKOPS`
object — contact, address, policies, breakfast options, amenities, landmark
distances. Any element marked `data-hotel="policy.checkIn"` is filled from it
automatically. **Change the phone number once and it updates everywhere**, rather
than being hand-edited across six HTML files. This is also the object to hand to
your JS modules or seed a database from.

---

## Content decisions you should know about

Three things in the original brief described a property Nikops Royal is not, so
I adapted rather than fabricated. Publishing invented amenities on a real
business's site creates a genuine liability — guests arrive expecting a spa.

| Brief asked for | What shipped | Why |
|---|---|---|
| "Dining & Culinary" — a Michelin restaurant + beach club, two named chefs | **Restaurant & Bar** — the real on-site restaurant and bar, with the three verified breakfast formats as the hook | Only a restaurant and bar are verified. The two-venue alternating split layout is preserved exactly. |
| "The Spa & Wellness" — treatment rooms, dual-image reveal | **The Swimming Pool** — pool + poolside terrace, same dual-image component, "Book a Room" CTA | No spa is listed among the property's amenities. The pool *is*, and it is the strongest visual asset. |
| "$800/night" luxury positioning | Warm, confident, honest — "Rest well, just off the Kasoa Road" | A 2-star property rated 4.6/5 wins on value, cleanliness and the pool. Overclaiming would read as false and hurt conversion. |

**Placeholders you must replace before launch** — these are clearly flagged in
code comments:

1. **Room names, rates and occupancy** (GH₵ 300–750). Invented to populate the
   grid. Swap in the real rate card.
2. **Testimonial quotes and names.** Illustrative. Replace with real reviews,
   with permission. *The 4.6/5 aggregate is the only verified review figure and
   is presented as such.*
3. **All photography.** Stock images chosen to match the real amenity set — pool,
   en-suite bathrooms, restaurant, bar, cooked breakfast, Ghanaian coast and
   street scenes. Every URL was HTTP-verified. Replace with photographs of the
   actual property; the `srcset`/`sizes`/`loading` attributes can stay as-is.
4. **Map tile** on `contact.html` is a styled placeholder. The "Open in Maps"
   button is live and already searches the real address.

---

## Page-by-page

**`index.html`** — ten image sections in the required order: full-viewport hero
with Ken Burns + floating booking bar → verified trust strip → 7-slide carousel
(pool, rooms, restaurant, bar, breakfast, bathroom, terrace) → 6-card bento of
rooms → parallax break → Restaurant & Bar splits → 12-tile Instagram grid →
3 destination cards (Kokrobite Beach, Central Accra, Memorial Park — with real
distances) → pool dual-image → testimonials → verified facts band → cinematic
CTA with the phone number as the secondary action.

**`rooms.html`** — page hero, an "included in every room" amenity grid built
from the verified amenity list, and the full bento grid.

**`room-detail.html`** — 5-slide gallery (room, bed, en-suite, pool, breakfast),
8-tile amenity grid, the three breakfast options spelled out, and a sticky
booking rail priced in GH₵ showing breakfast and pool access as included.

**`booking.html`** — 4-step stepper ending in "Reserved" rather than a payment
step, since the property confirms directly. Adds a **breakfast preference**
dropdown, GH₵ totals, and trust badges rebuilt around verified facts
(4.6/5 · 12:00 check-in/out · breakfast included · no online payment).

**`about.html`** — the timeline now runs **Arrive → Settle → Swim → Eat → Wake**
(a guest's day) instead of invented company history, since no founding story is
on record. Adds a house-policies grid: check-in, check-out, smoking, pets,
breakfast, facilities.

**`contact.html`** — quick-contact strip with tappable phone and email, map card
captioned with the real road and junction, "Open in Maps" deep-linking the real
address, front-desk card, and a six-cell info grid carrying the full address,
GPS code, hours and landmark distances.

---

## Technical (carried over and extended)

- **Design system** — deep navy `#0d1b2a`, warm gold `#b08d4f`, champagne, crisp
  white, soft sand. Playfair Display + Inter. Fluid `clamp()` type scale. BEM
  naming, `is-*` state classes, tokenised motion/spacing/elevation.
- **Images** — `object-fit:cover` everywhere; `srcset`+`sizes` on all large
  imagery; `loading="lazy"`+`decoding="async"` below the fold; `preload` +
  `fetchpriority="high"` on the hero LCP only; intrinsic `width`/`height` on
  every image; WebP/AVIF `<picture>` fallback documented in a markup comment.
- **Accessibility** — one `<h1>` per page, descriptive alt text on all 70
  images, skip links, visible focus rings, `aria-live` carousel status,
  keyboard-navigable carousel/gallery/lightbox, `aria-modal` lightbox with focus
  trap and restore, `role="alert"` form errors, full `prefers-reduced-motion`
  support.
- **Responsive** — mobile-first throughout. Bento 1→2→6 columns, booking bar
  stacks→2-up→5-across, carousel peeks the next slide on mobile with pointer
  swipe, sticky rails only above 1000px, `100svh` so mobile chrome never clips
  the hero.
- **Performance** — `preconnect` to image/font origins, single deferred bundle,
  `rAF`-throttled passive scroll handlers, parallax skips offscreen layers,
  reveal observers self-unobserve. CDN, image pipeline and critical-CSS inlining
  documented in code where a real build would add them.
- **SEO** — `Hotel` JSON-LD with the verified address, phone, rating, check-in
  times and amenity list; `geo.region` / `geo.placename` meta for Greater Accra.

### Fixed this pass

- **Counter rounded decimals** — `data-count="4.6"` animated to **5**, misstating
  the guest rating. The counter now preserves the source precision.
- Stale "Aurelia Bay" strings in the `styles.css` and `main.js` file headers.
- Compact footers on inner pages carried no contact details; all six pages now
  show phone, email, address and GPS code.

*(Bugs found in your original Zenala template — the truncated `!important`, the
three dead `data-full` image paths, the duplicated hero image, missing lazy
loading and image dimensions, the non-modal lightbox, the unthrottled scroll
listener — were all fixed in the first pass and remain fixed.)*

---

## Files

```
nikops/
├── index.html          homepage — ten visual sections
├── rooms.html          all rooms + included-amenity grid
├── room-detail.html    gallery slider · amenities · sticky booking rail
├── booking.html        stepper · room image · trust badges · validated form
├── about.html          guest-day timeline · verified house policies
├── contact.html        map card · front desk · full contact grid
├── styles.css          @import manifest (documented)
├── css/
│   ├── tokens.css      palette, type scale, spacing, motion, z-index
│   ├── base.css        reset, typography, buttons, utils, scroll-reveal
│   ├── header.css      fixed nav + mobile panel
│   ├── hero.css        hero, Ken Burns, booking bar, page heroes
│   ├── sections.css    the ten homepage sections
│   ├── footer.css      footer, newsletter, WhatsApp button
│   └── pages.css       inner pages, forms, lightbox
└── js/
    ├── hotel-data.js   ← verified property data, single source of truth
    └── main.js         11 guard-claused vanilla modules
```
