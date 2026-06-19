# Deploying VANTA

VANTA is a **static** Astro build — `npm run build` emits `./dist`, which deploys to
any static host. The only two things to mind are the **base path** and the
**form endpoint** env var.

```bash
npm install
npm run build      # → ./dist
npm run preview    # verify the production build locally first
```

> **Always verify the production build (`npm run preview`), not just the dev server.**
> The dev server's Vite pipeline can mask `client:only` hydration and base-path issues
> that only appear in the built output.

---

## The base path

`astro.config.mjs` ships with:

```js
site: 'https://fpsjago.github.io',
base: '/vanta',
```

This means the site is served from **`/vanta/`** (GitHub Pages project-site default).

- **Deploying to a subpath** (GitHub Pages project site): leave `base: '/vanta'` and set `site` to your Pages origin.
- **Deploying to a root domain** (Netlify, Vercel, a custom domain, or a GitHub *user/org* Pages site): set **`base: '/'`** (or remove it) and set `site` to your real URL. All internal links use the `BASE` helper (`src/lib/utils.ts`) and `import.meta.env.BASE_URL`, so they follow `base` automatically — no manual link edits.

Also update `site` so the **sitemap**, **canonical** tags, and **JSON-LD URL** are correct, and update the `Sitemap:` line in `public/robots.txt`.

---

## The form endpoint (`PUBLIC_FORM_ENDPOINT`)

The **Reserve** and **Contact** forms submit to a real endpoint read from
`import.meta.env.PUBLIC_FORM_ENDPOINT`:

- **Unset / empty string** → forms show an **in-page success state** without a network call (perfect for the demo).
- **Set to a Formspree-style URL** → forms POST there and surface success/error states.

Set it as a build-time environment variable (the `PUBLIC_` prefix exposes it to the
client at build time). Locally:

```bash
# .env  (do not commit secrets; this endpoint URL is public by design)
PUBLIC_FORM_ENDPOINT=https://formspree.io/f/your-id
```

Set the same variable in your host's dashboard (see each host below). Any endpoint
that accepts a JSON/form POST and returns 2xx works — Formspree, Basin, Web3Forms, a
serverless function, etc.

---

## GitHub Pages

GitHub Pages serves the `gh-pages` branch (or a Pages-from-Actions artifact). The
cleanest path is a build-and-deploy GitHub Action.

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Add `.github/workflows/deploy.yml`:

```yaml
name: Deploy VANTA to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          PUBLIC_FORM_ENDPOINT: ${{ secrets.PUBLIC_FORM_ENDPOINT }}
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

3. Add `PUBLIC_FORM_ENDPOINT` under **Settings → Secrets and variables → Actions** (or hardcode it as a non-secret build var — it's public anyway).
4. Keep `base: '/vanta'` if the repo is named `vanta` (project site → `https://<user>.github.io/vanta/`).

> Prefer the **gh-pages branch** workflow instead? Build locally or in CI, then push
> `./dist` to a `gh-pages` branch and set **Pages → Source: Deploy from a branch →
> `gh-pages` / `(root)`**. The Actions artifact method above is recommended — no
> committed build output.

---

## Netlify

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Environment:** add `PUBLIC_FORM_ENDPOINT` under Site settings → Environment variables.
- If deploying to the site root, set **`base: '/'`** in `astro.config.mjs`.

`netlify.toml` (optional):

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

---

## Vercel

- **Framework preset:** Astro (auto-detected).
- **Build command:** `npm run build` · **Output directory:** `dist`.
- **Environment:** add `PUBLIC_FORM_ENDPOINT` in Project → Settings → Environment Variables.
- If deploying to the site root, set **`base: '/'`** in `astro.config.mjs`.

---

## Bring your own car — replacing the GT renders & ambient video

The shipped GT renders are **AI-generated** and the video loops are **stock**
(see [IMAGE-CREDITS.md](./IMAGE-CREDITS.md)). For a real product launch, drop in your
own imagery — the template is built to make this a file swap, not a code rewrite.

### 1. Renders (the GT photos)

The 9 PNGs live in **`src/assets/images/`**. The build pipeline (`src/lib/images.ts`)
re-encodes them to AVIF + WebP with mobile variants — so just supply good source PNGs/JPEGs.

- Keep the **same filenames** to swap in place (`gt-hero-3q.png`, `gt-color-obsidian.png`, `gt-color-carbon.png`, `gt-color-plasma.png`, `gt-color-bone.png`, `gt-side.png`, `gt-detail-wheel.png`, `gt-detail-front.png`, `gt-detail-interior.png`), **or** use new names and update the references in `src/data/gt.ts` (`TRIMS[].image`) and the content collections (`image` / `cover`).
- The **hero LCP poster** is `gt-hero-3q.png`. Keep a similar aspect ratio (~1600×1000) so the hero layout holds. Supply ≥1600px wide so AVIF/WebP stay crisp.
- For a **pixel-identical configurator swap**, render all four paints from the *same* base shot (recolor in your editor) — the shipped AI set diverges slightly between paints.

### 2. The ambient MP4

The loops in **`public/video/`** play **autoplay, muted, looped, behind the poster** —
ambient motion, **not** scrubbed. Replace `energy-01.mp4` (the hero loop) and the
others with your own footage, keeping the filenames (or update the `video` path passed
to `Hero.tsx`).

**Encode for the web** — strip audio, fast-start, keep it small:

```bash
ffmpeg -i source.mov \
  -an \
  -vf "scale=1280:-2" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -crf 24 -preset slow \
  -movflags +faststart \
  energy-01.mp4
```

- **`-movflags +faststart`** moves the moov atom to the front so the video starts streaming before it fully downloads. Always include it.
- Keep the **desktop hero asset ≤ 8–10 MB**. Drop resolution (`scale=960:-2`) or raise `-crf` (26–28) if it's over.
- For mobile, ship a smaller variant if you wire one in.

#### If you ever scrub a video by `currentTime` (optional, advanced)

VANTA's hero deliberately does **not** scrub the video — the Ignition choreography is
driven by `ScrollTrigger.progress`, so it's frame-accurate and cross-browser safe.
**But** if you adapt the template to a true scroll-scrubbed video, the source **must**
be re-encoded so every frame is a keyframe, or seeking will stutter:

```bash
ffmpeg -i source.mp4 \
  -an -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -x264-params keyint=1:min-keyint=1:scenecut=0 -g 1 \
  -crf 22 -preset slow -movflags +faststart \
  scrub.mp4
```

`-g 1` / `keyint=1` makes every frame seekable (each is an I-frame); without it,
`video.currentTime` snaps to the nearest keyframe and looks janky. This bloats the
file — only do it for a short, intentional scrub window, and respect the ≤8–10 MB
desktop ceiling.

### 3. The poster-over-video LCP pattern (why the hero is fast)

The hero paints a **static GT render as the LCP element** (preloaded as AVIF with
`fetchpriority="high"` in `BaseLayout.astro`), with the **video layered behind it** for
motion. The poster is what the browser measures for Largest Contentful Paint, so LCP
doesn't wait on the heavier MP4. When you swap media:

- Keep the **poster (render) as the visible LCP**; let the video sit behind/under it.
- Preserve the `<link rel="preload" as="image" … fetchpriority="high">` poster preload in `BaseLayout.astro` (`preloadHero` prop) — update the path if you rename the poster.
- Under `prefers-reduced-motion`, the video doesn't autoplay and the choreography is frozen on the poster — keep that behavior.

---

## Lighthouse / performance checklist

Before shipping, run Lighthouse against the **production build** (`npm run preview` or
the deployed URL):

- [ ] **LCP** — hero poster preloaded as AVIF, `fetchpriority="high"`; video is *behind* the poster, not the LCP element.
- [ ] **Hero video ≤ 8–10 MB**, `+faststart`, muted + `playsinline` autoplay loop.
- [ ] **Images** all serving AVIF/WebP via the pipeline; correct mobile variants on small screens.
- [ ] **Fonts** preloaded (Unbounded / Manrope / Martian Mono) — no FOIT; subsetted to latin.
- [ ] **CLS ≈ 0** — renders keep their aspect ratio; reserve space for media.
- [ ] **`prefers-reduced-motion`** — no autoplay/scrub, reveals shown statically.
- [ ] **Accessibility** — AA contrast on the active skin, focus-visible rings, skip link reachable, alt text on every render.
- [ ] **SEO** — `site`/`base` correct so canonical, sitemap, and JSON-LD URLs resolve; `robots.txt` sitemap line points at the right origin.
- [ ] **No console errors** in the built output across Chrome / Firefox / iOS Safari (check GSAP overlay sync).
