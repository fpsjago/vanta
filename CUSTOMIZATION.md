# Customizing VANTA

Everything you'll want to change to make VANTA yours — brand, color, fonts, the
car's specs and trims, content, and the hero/configurator media. No build step is
required to *understand* any of this; just edit and re-run `npm run dev`.

> **Stack rule the template keeps:** no `style={{}}` or `<style>` blocks in `.tsx`
> (font-variation and genuinely-dynamic values are the only exceptions). Layout is
> Tailwind classes; keyframes and custom rules live in `src/styles/global.css`.

---

## 1. Brand & logo

The brand name lives in two places:

- **The wordmark** — `src/components/Logo.tsx`. It renders a plasma "charge node" (a power-on LED) followed by the word `VANTA` in heavy Unbounded. To rename, change the text node `VANTA` and the `aria-label="VANTA"`. Props: `size` (rem), `live` (adds the pulsing ping — used in the nav), `className`.
- **Metadata & schema** — `src/layouts/BaseLayout.astro`: the `<title>` logic, the default `description`, the JSON-LD `Organization` (`name`, `slogan`, `brand`), and `og:site_name`. Update the slogan **"Engineered for the dark."** here and in the home/hero copy.

The **favicon** is `public/favicon.svg` (+ `.ico` fallback). Replace both. The browser `theme-color` is set in `BaseLayout.astro` (`#08080B`) — match your void color.

---

## 2. Recolor — the design tokens

All color lives as CSS custom properties in **`src/styles/global.css`**. The default
(Midnight) skin is defined on `:root`; the other two skins override a subset under
`[data-skin="…"]`. **Change a token once and it cascades everywhere** — buttons,
glows, charge-line, grain blend, focus rings.

### `:root` — Midnight (default) tokens

| Token | Value | Role |
|---|---|---|
| `--void` | `#08080B` | Page canvas (~60% of the surface) |
| `--surface` | `#101015` | Panels / cards |
| `--raise` | `#17171F` | Elevated surfaces |
| `--bone` | `#ECEAE3` | Primary text |
| `--muted` | `#92929B` | Secondary text (AA on void) |
| `--line` | `#24242C` | Hairlines |
| `--line-strong` | `#34343E` | Stronger borders |
| `--plasma` | `#F0257E` | **Signature charge** — glows / strokes / large display / CTA fills only |
| `--plasma-2` | `#FF5C9E` | Lighter plasma for **AA text-on-dark** (kickers, small accent text) |
| `--plasma-ink` | `#120208` | Text drawn **on** a plasma fill (e.g. CTA label) |
| `--plasma-rgb` | `240, 37, 126` | RGB triplet for `rgba()` glow math — keep in sync with `--plasma` |
| `--ok` | `#36D399` | Functional: success (forms) |
| `--err` | `#FF5466` | Functional: error (forms) |
| `--focus` | `#7FB2FF` | Functional: focus-visible outline |
| `--grain-blend` | `overlay` | Film-grain blend mode |
| `--grain-opacity` | `0.07` | Film-grain strength |

There are also non-color scales in `:root` you can tune: fluid type (`--text-2xs` → `--text-7xl`), spacing (`--space-*`), radii (`--radius-*`), containers (`--container-max`/`--container-wide`), easings (`--ease-*`), and z-index layers (`--z-*`). Color is what you'll usually touch.

### The magenta rule (keep it)

`--plasma` (`#F0257E`) **fails AA as small body/link text** on both the void and the
Studio light surface. The template uses it **only** for large display type, SVG
strokes, glows, and CTA *fills* (where the label is `--plasma-ink`, not plasma).
For any small accent text, use **`--plasma-2`** instead — it's the AA-safe lighter
(on dark) / darker (on light) variant. If you swap the accent hue, keep this split:
a "loud" version for fills/strokes and an AA-passing version for text.

### Skin overrides

```css
[data-skin="carbon"] {            /* graphite — same plasma */
  --void:#15151A; --surface:#1D1D24; --raise:#25252E;
  --line:#2E2E38; --line-strong:#3C3C48; --muted:#9C9CA6; --grain-opacity:0.06;
}

[data-skin="studio"] {            /* GENUINE light act */
  --void:#EDEBE4; --surface:#F6F4EE; --raise:#FCFAF4;
  --bone:#14141A; --muted:#5C5C64; --line:#DAD7CE; --line-strong:#C6C3B8;
  --plasma:#D11468; --plasma-2:#B30E57; --plasma-ink:#FFFFFF; /* darker plasma for AA on light */
  --plasma-rgb:209, 20, 104; --grain-blend:multiply; --grain-opacity:0.05;
  color-scheme:light;
}
```

To **change the accent**, edit `--plasma`, `--plasma-2`, `--plasma-ink`, and
`--plasma-rgb` in `:root` *and* in each skin block (Studio needs a darker variant
to stay AA). To **add a fourth skin**, add a `[data-skin="yourname"]` block, then add
it to the `SKINS` array in `src/components/Nav.tsx` and the allow-list in the inline
skin-restore script in `BaseLayout.astro`.

---

## 3. Fonts

Fonts are loaded with the **Astro Fonts API** in `astro.config.mjs` (`fonts: [...]`,
provider `fontProviders.fontsource()`) and exposed to CSS via the `@theme` block at
the top of `global.css`.

| Role | Family | Config `cssVariable` | `@theme` token |
|---|---|---|---|
| Display / headings | **Unbounded** | `--ff-display` | `--font-display` |
| Body | **Manrope** | `--ff-body` | `--font-body` |
| Mono / HUD / kickers | **Martian Mono** | `--ff-mono` | `--font-mono` |

To swap a font:

1. In `astro.config.mjs`, change the `name` (must be a valid Fontsource family), and adjust `weights` to what that family ships.
2. The `cssVariable` stays the same (`--ff-display` etc.), so nothing else changes.
3. In `BaseLayout.astro`, the three `<Font cssVariable="--ff-…" preload />` tags pick the new family up automatically.

The `@theme` mapping in `global.css` (`--font-display: var(--ff-display), …`) wires the family into Tailwind's `font-display` / `font-body` / `font-mono` utilities and the base typography rules. Leave it as-is.

---

## 4. The car — specs & trims

All of the GT's real (non-lorem) data is typed in **`src/data/gt.ts`**:

- **`SPECS: SpecGroup[]`** — the full spec sheet, grouped (Powertrain / Performance / Battery & charging / Chassis & body). Each row is `{ label, value }`. Add/remove groups or rows freely; the spec table on **The GT** renders whatever's here.
- **`KEY_STATS: HeroStat[]`** — the four headline numbers (`value`, `suffix`, `label`), e.g. `1,020 HP`. Used in the hero/stat blocks.
- **`TRIMS: Trim[]`** — the configurator options:

  ```ts
  { id: 'obsidian', name: 'Obsidian', paint: '#0B0B0E',
    image: 'gt-color-obsidian.png', price: '$189,000',
    sub: 'The signature finish — deep, light-drinking black.' }
  ```

  - `id` — stable key (also flows into the URL → Reserve).
  - `paint` — the swatch hex shown in the configurator UI.
  - `image` — filename in `src/assets/images/` (no leading slash).
  - `price` / `sub` — shown per trim; `price` carries into the reservation summary.

  To add a trim: add a new render to `src/assets/images/`, then add an object to `TRIMS`. To remove one, delete its object (and optionally its image).

---

## 5. Content collections

Schemas are defined in **`src/content.config.ts`** (Zod, Astro 6 glob loader). Add a
Markdown file to the relevant folder and it appears automatically.

| Collection | Folder | Frontmatter |
|---|---|---|
| `gallery` | `src/content/gallery/` | `title`, `image`, `category`, `span` (`wide`/`tall`/`default`), `order` |
| `story` | `src/content/story/` | `title`, `kicker?`, `excerpt`, `cover`, `order` + Markdown body |
| `legal` | `src/content/legal/` | `title`, `updated` (date) + Markdown body → route `/legal/<filename>/` |

`image` / `cover` reference filenames in `src/assets/images/` (no leading slash).
`order` controls display sequence (lower first; default `99`).

---

## 6. Swapping the renders, configurator images & ambient video

> Full step-by-step with `ffmpeg` encode commands is in **[DEPLOYMENT.md](./DEPLOYMENT.md) → "Bring your own car."** Short version below.

### GT renders & configurator paints

The 9 PNGs live in **`src/assets/images/`** and are optimized at build time by
`src/lib/images.ts` (→ AVIF + WebP, with mobile variants). To replace:

1. Drop your image into `src/assets/images/` using the **same filename** (e.g. `gt-hero-3q.png`, `gt-color-obsidian.png`) — or a new filename and update the reference.
2. The hero LCP poster is `gt-hero-3q.png` (referenced by the home page → `Hero.tsx` as the poster). Keep the aspect ratio close (renders are ~1600×1000) so the layout holds.
3. Configurator paints are referenced by `image` in `TRIMS` (`src/data/gt.ts`). Match filenames there.

Source PNGs are fine — the pipeline downscales and re-encodes. Aim for ≥1600px wide so AVIF/WebP stay crisp.

### Ambient video loops

The three loops are in **`public/video/`** (`energy-01.mp4` … `energy-03.mp4`).
`energy-01.mp4` is the hero ambient. To replace, keep the same filenames (or update
the `video` path passed into `Hero.tsx` from the home page). These play as **autoplay
loops, muted, behind the poster** — they are **not** scrubbed, so encode for smooth
looping, not frame-seeking. Re-encode with `+faststart` and keep the desktop hero
asset **≤ 8–10 MB**. See DEPLOYMENT.md for the exact `ffmpeg` line and the
poster-over-video LCP pattern.
