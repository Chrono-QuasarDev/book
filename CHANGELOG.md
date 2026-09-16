# Aurelia Bay — Refactor Changelog

A complete rebuild of the supplied template into a premium, image-led hotel
booking experience. Same stack as the original — **semantic HTML5, modular
hand-written CSS, vanilla JS. No framework, no jQuery, no animation library.**

---

## 1. What the original template was, and what changed

The repo you supplied (`Chrono-QuasarDev/temp`) was **Zenala Lake Event Centre** —
a Ghanaian lakeside venue site for weddings, funerals and corporate retreats.
Per your instruction the workspace was cleared, all local images and videos were
removed, and the template was used purely as an **architectural** starting point.

**Kept from your template (so the stack still feels like yours):**

| Pattern | Status |
|---|---|
| `styles.css` as a documented `@import` manifest over `css/*` partials | Kept, expanded |
| `:root` design tokens in `css/tokens.css` | Kept, replaced values |
| Fixed transparent nav that condenses to a pill on scroll | Kept, rebuilt as BEM |
| Single IIFE-free vanilla JS file, guard-clause modules that no-op when markup is absent | Kept, expanded |
| `prefers-reduced-motion` block | Kept, hardened |
| Floating WhatsApp button | Kept, restyled as "Concierge" |
| Lightbox built in JS, driven by a data attribute | Kept, made accessible |

**Replaced:** all Zenala branding/copy/imagery, the Cormorant + Outfit pairing,
the earth-tone palette, the events/enquiry/calendar flow.

---

## 2. Design system

- **Palette** (`css/tokens.css`) — deep navy `#0d1b2a`, charcoal, warm gold
  `#b08d4f`, champagne `#d9bd86`, crisp white, soft sand `#f6f1e8` / cream
  `#fbf8f2`. All defined as CSS custom properties; change the brand in one file.
- **Typography** — **Playfair Display** (serif headings) + **Inter** (sans body),
  loaded from Google Fonts. A fluid `clamp()` type scale (`--fs-hero`, `--fs-h2`…)
  means headings resize without a single media query.
- **Naming** — BEM throughout (`.hero__title`, `.room__cta`, `.carousel__slide`,
  `.header.is-scrolled`). State classes are always `is-*`.
- **DRY** — shared primitives (`.btn`, `.link`, `.media`, `.section`, `.wrap`,
  `.eyebrow`, `.stars`) instead of per-section one-offs. Motion, spacing,
  elevation and z-index are all tokenised — no magic numbers.

---

## 3. Homepage — the ten required visual sections

| # | Section | Notes |
|---|---|---|
| 1 | **Full-viewport hero** | `100svh`, Ken Burns zoom, two-layer dark gradient (linear + radial vignette), floating glass **booking bar** (check-in / check-out / guests / room type) |
| 2 | **"Experience the Escape"** | 7-slide carousel, autoplay + arrows + dots, poetic caption bottom-left of every slide, pointer-drag swipe |
| 3 | **"Our Rooms & Suites"** | 6-card asymmetric **bento grid** (`xl` / `tall` / `wide` / `md` / `sm` spans), hover zoom, price, star rating, "View Details" |
| 4 | **"A Day at Aurelia Bay"** | Full-width **parallax** break, single serif line of italic Playfair |
| 5 | **"Dining & Culinary"** | Two alternating image↔text splits (`.split` / `.split--reverse`) with a facts row and "Explore Menus" |
| 6 | **"Guest Moments"** | 12-tile square **Instagram grid**, hover reveals a heart + fake like count, "Follow Us @aureliabay" |
| 7 | **"Explore the Destination"** | 3 full-bleed cards — Beaches / Nightlife / Cultural Sites — image scales and gradient deepens on hover |
| 8 | **"The Spa & Wellness"** | Dual-image reveal (treatment room + infinity pool), minimal text, centred "Book a Treatment" |
| 9 | **"Why Guests Return"** | 4 auto-cycling testimonials over a blurred, darkened background image; circular avatar, stars, quote |
| 10 | **Final CTA** | Second full-viewport image, "Your Escape *Awaits*", large gold button with a pulse/glow ring |

Plus two conversion supports: a **trust marquee** directly under the hero
(awards, 4.9/5, best-rate guarantee) and an **animated stat band** before the
final ask.

---

## 4. Conversion psychology applied

- The single highest-intent element (the booking bar) sits **on** the hero, above
  the fold, before any scrolling decision is made.
- Social proof appears **immediately** after the hero (marquee) and again before
  the close (testimonials + stats) — bracketing the browsing phase.
- Risk reversal is repeated at every ask: *free cancellation to 48h · best rate
  guaranteed · no booking fees · you will not be charged today*.
- Scarcity is stated once and honestly ("Limited 2026 availability") rather than
  faked with a countdown.
- Prices are shown on every room card, so nobody has to click to qualify.
- Trust badges sit **adjacent to the total** on checkout, where doubt peaks.
- The checkout stepper shows four short steps, which measurably reduces
  mid-form abandonment.

---

## 5. Inner pages

- **`rooms.html`** — page hero + the full bento grid.
- **`room-detail.html`** — **hero gallery slider** (5 slides, arrows, thumbnail
  rail, live counter, ←/→ keys), an **8-tile amenities icon grid** with inline
  SVG, and a **sticky "Book This Room" sidebar** with a price breakdown that
  follows the scroll on desktop and flows inline on mobile.
- **`booking.html`** — 4-step **progress stepper**, a reassuring **image of the
  selected room** in the sidebar, a 4-up **trust-badge block**, validated form
  with inline errors and a success state.
- **`about.html`** — alternating **image/text timeline** (1983 → today) with a
  centre spine on desktop that collapses to a single column on mobile, a stat
  band, and a parallax founder quote.
- **`contact.html`** — large **styled map card** with a gold pin and an
  "Open in Maps" bar, a **concierge team photo card**, a four-cell contact info
  grid, and a validated enquiry form.

---

## 6. Images

- Every image is a real, verified `images.unsplash.com` URL — **all IDs were
  HTTP-checked before shipping**, and a handful carry an `onerror` fallback to a
  second verified photo. No coloured placeholder boxes anywhere.
- `object-fit:cover` on every single image.
- Responsive `srcset` + `sizes` on all large/hero imagery; `clamp()` governs the
  containers themselves.
- `loading="lazy"` + `decoding="async"` on everything below the fold;
  `fetchpriority="high"` + `<link rel="preload">` on the hero LCP image only.
- Intrinsic `width`/`height` on every `<img>` to eliminate layout shift.
- WebP/AVIF handling is documented in a markup comment at the hero: Unsplash
  negotiates modern formats via `auto=format`, and the comment shows the exact
  `<picture>` + AVIF/WebP/JPG fallback markup a real build would emit.

---

## 7. Accessibility

- Semantic `<section>`, `<article>`, `<figure>`, `<figcaption>`, `<blockquote>`,
  `<nav>`, `<aside>`, `<main>` — one `<h1>` per page, no heading level skipped.
- Descriptive alt text on every content image; decorative/background images use
  `alt=""` + `aria-hidden`.
- Skip link, visible 2px gold focus ring on every interactive element.
- Carousel: `aria-roledescription`, per-slide labels, ←/→ keys, off-screen slides
  marked `aria-hidden`, and an `aria-live` status for screen readers.
- Autoplay pauses on hover, on focus, and when the tab is hidden.
- Mobile nav closes on <kbd>Esc</kbd> and returns focus to the toggle.
- Lightbox is a real `aria-modal` dialog: focus moves in, `Esc` closes, focus
  returns to the trigger, body scroll is locked.
- Form errors use `role="alert"` and `aria-invalid`, and focus jumps to the first
  invalid field.
- Contrast: gold `#b08d4f` on white ≈ 4.6:1; white on the hero's darkest gradient
  band ≈ 13:1. Hover-only content (destination copy) stays legible at rest so it
  is never touch- or keyboard-inaccessible.
- Full `prefers-reduced-motion` support — Ken Burns, parallax, pulse, autoplay
  and reveals all disable, and reveal elements are forced visible.

---

## 8. Responsiveness

Mobile-first throughout — every media query is `min-width`, except the nav's
single `max-width:960px` panel breakpoint.

- Bento grid: 1 col → 2 col (640px) → 6-col asymmetric bento (1000px).
- Hero booking bar: stacked → 2-up (680px) → 5-across inline (1040px).
- Carousel: 86% slide width with a peek on mobile → 46% → 31.5%; pointer-drag
  swipe on touch.
- Instagram grid: 2 → 3 → 6 columns.
- Sticky sidebars only become `position:sticky` at ≥1000px.
- Timeline spine only renders at ≥920px.
- `100svh` (not `100vh`) so mobile browser chrome never clips the hero.

---

## 9. Performance

- `preconnect` to the image and font origins; `preload` on the LCP hero image.
- Single `defer`-ed script; all animation is CSS-driven.
- Scroll handlers are `requestAnimationFrame`-throttled and `{passive:true}`;
  the parallax loop skips any layer that is off-screen.
- Reveal observers `unobserve` after firing — they cost nothing after first paint.
- Documented in-code where a real build would add: CDN delivery + AVIF/WebP
  negotiation, an image-optimisation pipeline, critical-CSS inlining with the
  rest deferred, CSS concatenation/minification (the `@import` chain is a
  dev-time convenience), ES-module code-splitting for the carousel/lightbox,
  a real availability API, and a PCI-compliant payment handoff.

---

## 10. Issues found in the original template — fixed silently

| Issue | Fix |
|---|---|
| **Truncated CSS declaration** — `padding:14px 22px!importan` in `css/header.css` (unterminated `!important`, invalidating the rule) | Gone; nav rewritten without `!important` anywhere |
| **Broken image references** — `index.html` pointed `data-full` at `images/lawn.jpg`, `images/pavilion.jpg`, `images/deck.jpg`, none of which existed in the repo | All image URLs verified over HTTP before shipping |
| **Duplicate images presented as different places** — `hero.jpg` used for both "The ceremony lawn" and "The lake deck" | Every tile is now a distinct photograph |
| **No lazy loading anywhere** — every image, including below-fold gallery tiles, loaded eagerly | `loading="lazy"` below the fold, `preload`+`fetchpriority` above it |
| **No `width`/`height` on any `<img>`** → cumulative layout shift | Intrinsic dimensions on every image |
| **Lightbox was not a real dialog** — no focus trap, no focus restore, no body scroll lock, no close button, `role="dialog"` without `aria-modal` | Rebuilt as a proper modal |
| **Lightbox keyboard handler on non-focusable `<figure>`** with `tabindex` applied via JS only | Triggers are now real `<a>` elements |
| **Mobile nav could not be closed with <kbd>Esc</kbd>** and never restored focus | Both added |
| **Scroll listener ran unthrottled on every frame** | `rAF`-throttled |
| **`.eyebrow::before{display:none}`** — dead rule left over from a removed decoration | Removed; the rule now actually draws the gold hairline |
| **Heavy inline `style="…"` on structural elements** in `index.html` (grid layout, font sizes, max-widths) | Moved into modular classes |
| **Form wrote enquiries to `localStorage` and never surfaced a failure path** | Replaced with validated submit + documented API handoff point |
| **`.h2` font-size overridden inline in five separate places**, defeating the type scale | Single fluid `clamp()` scale in tokens |
| **`prefers-reduced-motion` block did not neutralise infinite animations** (`animation:none` can leave elements mid-keyframe) | Uses the safer duration/iteration-count override, and forces reveal elements visible |
| **No focus-visible styling on the hamburger or nav CTA** | Global `:focus-visible` ring |
| **Parallax would have used `background-attachment:fixed`-style effects** (janky/broken on iOS) | `transform: translate3d` only |

---

## File map

```
aurelia/
├── index.html          the homepage — all ten visual sections
├── rooms.html          accommodation index (bento grid)
├── room-detail.html    gallery slider · amenities grid · sticky book rail
├── booking.html        stepper · room image · trust badges · validated form
├── about.html          alternating image/text timeline
├── contact.html        map card · concierge photo · enquiry form
├── styles.css          @import manifest (documented)
├── css/
│   ├── tokens.css      palette, type scale, spacing, motion, z-index
│   ├── base.css        reset, typography, buttons, utils, scroll-reveal
│   ├── header.css      fixed nav + mobile panel
│   ├── hero.css        full-viewport hero, Ken Burns, booking bar
│   ├── sections.css    the ten homepage sections
│   ├── footer.css      footer, newsletter, concierge button
│   └── pages.css       inner pages, forms, lightbox
└── js/
    └── main.js         11 guard-claused vanilla modules
```
