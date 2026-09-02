# Global Media Policy

All content images must use the site media primitive (`MediaSlot.astro`).

Default: **LOCKED** — build output renders a near-black editorial surface,
never the real image.

Unlock: **5 clicks/taps on the `JZ.` brand link within 3 seconds**, while on
the current-language home (`/` or `/zh/`).

Persistence: **sessionStorage only** (`siteMediaUnlocked`) — survives
navigation, language switch and refresh within a session; a fresh browser
session starts locked again. No localStorage.

No direct content `<img>` / `<Image>` / `<Picture>` / content CSS
`background-image: url(...)` is allowed outside the media primitive. The
runtime controller in `BaseLayout.astro` is the only place that creates
media elements (`createElement`), and only when unlocked.

Exceptions (not content images): favicon, site icon, UI icons, SVG arrows,
brand glyph, purely decorative CSS shapes.

Markdown/MDX: content images must not use `![alt](src)`; render through the
media primitive (component mapping when the MDX pipeline lands in Phase 6).

Enforcement: `npm run test:media-policy` (also chained into `npm run build`,
so a bypass fails CI/deployment, not just local review).

This is an obscurity / preview mechanism for the owner's convenience —
not encryption or access control. Do not describe it as either.
