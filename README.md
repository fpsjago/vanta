# VANTA

### Engineered for the dark.

A premium, cinematic **EV-launch website template** built in Astro 6. VANTA is the
microsite for a fictional next-gen electric performance brand and its flagship —
the **VANTA GT**, an unbranded concept grand tourer. You don't browse it; you
scroll *through* a launch film: the car comes online, a plasma charge-line traces
its silhouette, the spec sheet counts up, and a real reservation flow closes the deal.

It is not a grid of cards with a hero on top. Every section is its own scene.

> Built and maintained by **Full Stack Evolved (FSEVO)**. A $199 commercial template, cleared for resale.

---

## What's inside

- **Scroll-driven "Ignition" hero** — a poster-over-video stage where the GT powers on. A static GT render is the LCP poster (paints instantly); an ambient energy loop plays behind it for motion. On scroll, GSAP runs the choreography — a plasma charge-line traces the body, the headline clip-path-masks in, and a HUD counter ticks `0 → 412 km/h` — **all driven by `ScrollTrigger.progress`, never off video seek** (no cross-browser desync).
- **8 distinct section archetypes** — Ignition hero · kinetic-type act · pinned spec-choreography · horizontal pinned design rail · sticky split-stat · cinematic plasma color-flood interstitial · editorial overlap collage (a genuine light act) · configurator CTA. No two repeat their scale, rhythm, or medium.
- **2D color/trim configurator** — swap paint render + palette tokens + price/spec, with a plasma charge-transition between trims and a **cursor-orbit** hover-rotate detail over a pre-rendered set. No WebGL, no live 3D.
- **Real reservation flow** — a multi-step Reserve form that carries the configurator selection and submits to a real endpoint (`PUBLIC_FORM_ENDPOINT`) with success/error states.
- **3 skins, including a genuine Studio light mode** — Midnight (default), Carbon, and Studio. Studio is a true light surface (ink-on-bone), not an inverted toggle — the template visibly escapes the void+neon EV cliché. Skin choice persists in `localStorage`.
- **Generative film grain** — an inline SVG `feTurbulence` overlay on every dark surface, so flat void never reads "AI-generated." No grids, dots, or blueprint backgrounds anywhere.
- **11 routes**, content-collection driven, with an in-character `404` ("SIGNAL LOST").
- **AVIF/WebP image pipeline**, build-time optimized with mobile `srcset` variants.
- **Accessible (WCAG AA)** — AA contrast across all three skins, focus-visible rings, skip link, `prefers-reduced-motion` fully honored (static poster, no autoplay/scrub), tabular HUD digits.
- **Astro Fonts API** — Unbounded / Manrope / Martian Mono, self-hosted via Fontsource, preloaded.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | **Astro 6.4** (`output: 'static'`) |
| UI islands | **React 19** (`@astrojs/react`) |
| Styling | **Tailwind v4** (`@tailwindcss/vite`) + CSS custom-property design tokens |
| Motion | **GSAP 3** (ScrollTrigger, pin/scrub) + **Lenis** smooth scroll |
| Fonts | Astro Fonts API + **Fontsource** — Unbounded, Manrope, Martian Mono |
| Images | Astro `sharp` service → **AVIF + WebP** |
| SEO | `@astrojs/sitemap`, JSON-LD Organization schema, canonical + OG/Twitter |
| Language | **TypeScript (strict)**, `noUncheckedIndexedAccess`, no `any` |
| Node | **>= 22.12.0** |

---

## Quick start

```bash
npm install      # install dependencies
npm run dev      # local dev server → http://localhost:4321/vanta
npm run build    # production build → ./dist
npm run preview  # preview the production build locally
```

> The site is served under the base path **`/vanta`** (see `astro.config.mjs`). Dev and preview URLs include it. If you deploy to a root domain, change `base` — see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## Project structure

```text
vanta/
├── astro.config.mjs          # site, base /vanta, fonts, image (AVIF/WebP), integrations
├── public/
│   ├── favicon.svg / .ico
│   ├── robots.txt · llms.txt
│   └── video/                # 3 ambient energy loops (Coverr — see IMAGE-CREDITS.md)
│       ├── energy-01.mp4     # hero ambient
│       ├── energy-02.mp4
│       └── energy-03.mp4
├── src/
│   ├── assets/images/        # 9 VANTA GT renders (AI-generated — see IMAGE-CREDITS.md)
│   ├── components/
│   │   ├── Hero.tsx           # Ignition stage (poster-over-video + GSAP)
│   │   ├── Configurator.tsx   # color/trim skin-swap + cursor-orbit
│   │   ├── Reserve.tsx        # multi-step reservation flow
│   │   ├── ContactForm.tsx
│   │   ├── Nav.tsx            # nav + skin switcher
│   │   ├── Logo.tsx           # VANTA wordmark (charge-node LED)
│   │   ├── GtStats.tsx · GalleryGrid.tsx · Footer.tsx
│   │   └── home/              # the 8 archetype sections
│   │       ├── KineticAct.tsx · SplitStat.tsx · DesignRail.tsx
│   │       ├── Interstitial.tsx · OverlapCollage.tsx · ConfigTease.tsx
│   ├── content/              # content collections (Markdown)
│   │   ├── gallery/  ├── story/  └── legal/
│   ├── content.config.ts     # gallery / story / legal schemas (Zod)
│   ├── data/gt.ts            # SPECS · KEY_STATS · TRIMS (the flagship's real data)
│   ├── hooks/useReveal.ts    # IntersectionObserver reveal hook
│   ├── layouts/BaseLayout.astro
│   ├── lib/images.ts         # build-time AVIF/WebP optimizer
│   ├── lib/utils.ts          # BASE helper
│   ├── pages/                # routes (see below)
│   ├── scripts/site.ts       # Lenis + global motion bootstrap
│   ├── styles/global.css     # design tokens + atmosphere + component classes
│   └── types/index.ts
└── scripts/                  # shot.mjs / shot-all.mjs — Playwright screenshots
```

### Routes (11)

| Route | Page |
|---|---|
| `/` | Home — the launch film (the 8 archetypes) |
| `/the-gt/` | The GT — full spec sheet, pinned reveal, light Design act |
| `/configure/` | 2D color/trim configurator → carries selection to Reserve |
| `/reserve/` | Multi-step reservation; real submit + success/error |
| `/gallery/` | Cinematic gallery + lightbox |
| `/story/` | Brand/innovation scrollytelling |
| `/contact/` | Contact + locations |
| `/legal/privacy/` · `/legal/terms/` · `/legal/warranty/` | Legal (from the `legal` collection) |
| `/404` | In-character "SIGNAL LOST" |

---

## The 3 skins

VANTA ships with three palettes, switched live from the nav and persisted in `localStorage` (`vanta-skin`):

| Skin | `data-skin` | Character |
|---|---|---|
| **Midnight** | `midnight` *(default)* | Void-black canvas, the signature look |
| **Carbon** | `carbon` | Graphite — same plasma accent, lifted blacks |
| **Studio** | `studio` | **Genuine light mode** — bone surfaces, ink text, darker plasma for AA |

**Default skin:** Midnight is the default — `BaseLayout.astro` sets `<html data-skin="midnight">`, and an inline script restores any saved choice before paint (no flash). To change the default, pass a different `skin` prop to `BaseLayout`. The Design act inside **The GT** sets `data-skin="studio"` locally so the light scene appears regardless of the active skin.

To **switch skins at runtime**, use the swatch control in the nav. To **remove the switcher**, drop the `SKINS` block from `Nav.tsx` — the tokens still work; pages just won't offer the toggle.

See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for recoloring.

---

## Editing content

Most copy and media are data-driven — you rarely touch component code.

- **Specs, key stats, and trims** → `src/data/gt.ts`
  - `SPECS` — the full spec sheet (Powertrain, Performance, Battery & charging, Chassis & body).
  - `KEY_STATS` — the four headline numbers.
  - `TRIMS` — configurator paint options (`id`, `name`, `paint` hex, `image` filename, `price`, `sub`).
- **Gallery** → `src/content/gallery/*.md` — `title`, `image`, `category`, `span` (`wide` / `tall` / `default`), `order`.
- **Story** → `src/content/story/*.md` — `title`, `kicker?`, `excerpt`, `cover`, `order` + Markdown body.
- **Legal** → `src/content/legal/*.md` — `title`, `updated` (date) + Markdown body. Each file becomes `/legal/<slug>/`.

Image filenames in content/data reference files in `src/assets/images/` (no leading slash).

See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for swapping renders, the ambient video, fonts, and brand.

---

## Deploy

Static output (`./dist`) deploys anywhere. Full guides for **GitHub Pages**, **Netlify**, and **Vercel**, the `base` path, the form-endpoint env var, a "bring your own car" media-swap workflow, and a Lighthouse checklist are in **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

---

## License & credits

- **Template** © Full Stack Evolved (FSEVO). Sold as a commercial template; redistribution of the template package follows your purchase license.
- **VANTA GT renders** are AI-generated (Cloudflare Workers AI, FLUX.1-schnell) — an unbranded, brand-safe concept. For real commercial use, **supply your own product imagery**.
- **Ambient video loops** are from **Coverr** (royalty-free, no attribution required).
- Full asset sourcing and licensing → **[IMAGE-CREDITS.md](./IMAGE-CREDITS.md)**.

Built by **Full Stack Evolved** — *Engineered for the dark.*
