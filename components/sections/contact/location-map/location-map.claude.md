---
kind: 'component'
name: 'LocationMap'
file: 'components/sections/contact/location-map/location-map.tsx'
exports:
  - 'LocationMap'
imports_from:
  - 'lucide-react'
  - 'next-intl/server'
  - '@/constants/site'
---

# LocationMap

Purpose:
Google Maps embed of the corporate office shown below the enquiry form on the
contact page. Lets visitors see the pin location without leaving the site, and
links out to Google Maps "Directions" in a new tab.

Used In:

- Contact page (app/(site)/[locale]/contact/page.tsx)

Props:

- No props — server component (reads SITE.address directly)

Business Logic:

- Reads `SITE.address` (joined with ", ") as the map query. Single source of
  truth: the same address shown in the "Corporate Address" card on the contact
  page also drives the pin location. Updating `constants/site.ts` updates both.
- `embedSrc`: `https://maps.google.com/maps?q=<encoded>&hl=en&z=15&output=embed`
  — the public Maps iframe URL. No API key needed; works in dev and production
  with zero configuration. If the design later needs the Maps Embed API card
  view (with the place chip + reviews), swap `embedSrc` for
  `https://www.google.com/maps/embed/v1/place?key=…&q=…` and add the key.
- `directionsHref`: `https://www.google.com/maps/dir/?api=1&destination=<encoded>`
  — opens Google Maps with directions to the address from the visitor's current
  location (Google's "Directions" deep-link convention).
- iframe: `loading="lazy"` (defers off-screen load), `referrerPolicy="no-referrer-when-downgrade"`
  (matches the embed default; required by some Maps endpoints), `allowFullScreen`.
  Aspect ratio is `16/9` on mobile, `21/9` on `sm+` so it stays cinematic on wide screens without dominating the viewport.
- Header bar above the iframe: MapPin icon + uppercase mono "eyebrow" + the
  address line + a "Directions" outline pill button (the same hover treatment
  used by the channel rows above).

Dependencies:

- `lucide-react` — `MapPin`, `ArrowUpRight`
- `next-intl/server` — `getTranslations` for the eyebrow + button + iframe a11y label
- `@/constants/site` — `SITE.address`

i18n:
Namespace: `contactPage.map`. Keys: `eyebrow`, `directions`, `iframeTitle`.

Accessibility:

- The iframe carries a translated `title` for screen readers.
- The Directions link has visible text + new-tab semantics (target="\_blank" + rel="noopener noreferrer").
- `MapPin`/`ArrowUpRight` icons are `aria-hidden` because the surrounding text
  conveys meaning.

Notes:

- No-API-key approach is deliberate — keeps the contact page working without
  any Google Cloud project setup. The trade-off is the embed's UI is the basic
  Maps card, not the polished place card shown in the user's reference shot.
- If `SITE.address` ever moves to the DB (currently a constant), this component
  becomes a Client Component or accepts the address as a prop. For now, server-side
  read keeps the embed prerenderable.
