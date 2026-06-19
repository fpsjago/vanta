# VANTA — Image & Media Credits

VANTA ships with placeholder product media so the template is complete and demo-ready
out of the box. **All of it is brand-safe** — no real car badges, logos, or
trademarked designs — and cleared for resale and redistribution as part of the
template.

> **For a real product launch, replace this media with your own.** The shipped car
> imagery is an *unbranded AI-generated concept* — fine to demo and redistribute, but
> you should supply your own product photography/renders for actual commercial use.
> See [DEPLOYMENT.md → "Bring your own car."](./DEPLOYMENT.md)

---

## GT renders — AI-generated (`src/assets/images/`)

The nine VANTA GT renders are **AI-generated**, not photographs of any real vehicle.

- **Model:** `@cf/black-forest-labs/flux-1-schnell` (FLUX.1 [schnell]) via **Cloudflare Workers AI**.
- **License:** outputs of the FLUX model run on your own Cloudflare account — usable in this commercial template. **No third-party stock license is attached** to these files.
- **Brand safety:** every render is unbranded — generic bodywork, a plain slim LED light bar, blank nose, blank steering-wheel hub. No emblems, no trademarks. Safe to redistribute inside the template.
- **Caveat for commercial use:** an AI-generated concept is brand-safe for a *template demo*, but it is **not your product**. For a live launch, swap in your own renders/photography.

| File | What it is |
|---|---|
| `gt-hero-3q.png` | Hero 3/4-front, obsidian black — the primary hero / LCP poster |
| `gt-side.png` | Full side profile, black, magenta backlight |
| `gt-color-obsidian.png` | Configurator paint: obsidian black |
| `gt-color-carbon.png` | Configurator paint: graphite grey |
| `gt-color-plasma.png` | Configurator paint: deep magenta candy |
| `gt-color-bone.png` | Configurator paint: pearl bone white |
| `gt-detail-wheel.png` | Wheel / rim close-up (tyre lettering is non-word gibberish, not a brand) |
| `gt-detail-front.png` | Front nose + light bar + charge port (blank, emblem-free) |
| `gt-detail-interior.png` | Minimal cockpit (blank steering-wheel hub, no logo) |

> Note: FLUX does not perfectly preserve geometry across paint prompts, so the four
> configurator paints diverge slightly in silhouette. For a pixel-identical
> color-swap, recolor all four from a single base render.

---

## Ambient video loops — Coverr (`public/video/`)

The three ambient energy loops are stock footage from **Coverr** (coverr.co).

- **License:** **Coverr — royalty-free, no attribution required.** Usable in commercial and redistributed products. (Per Coverr's terms you may **not** resell the raw clip as a standalone stock file; using it *inside* a template is permitted.)
- All clips are dark/moody with light motion and contain **no identifiable cars or brands**.
- They play as **autoplay, muted, looped ambient motion** behind the hero poster — they are not scrubbed.

| File | What it is | Source |
|---|---|---|
| `energy-01.mp4` | Night-drive POV through a windshield, dark moody road (hero ambient) | <https://coverr.co/videos/driving-at-night-vc6o7ninmp> |
| `energy-02.mp4` | Aerial city-night, traffic light streaks | <https://coverr.co/videos/busy-intersection-at-night-qzurumrlhb> |
| `energy-03.mp4` | Abstract blurred city-light bokeh (ambient charge energy) | <https://coverr.co/videos/blurred-lights-phkoquiujb> |

> The clips lean cool/neutral rather than magenta. They are intentionally dark so a
> CSS overlay / `mix-blend-mode` / `hue-rotate` tints them to the VANTA plasma palette
> without replacing the footage.

---

## Fonts

Self-hosted via the Astro Fonts API (**Fontsource**), all under the **SIL Open Font License (OFL)**:

- **Unbounded** — display / headings
- **Manrope** — body
- **Martian Mono** — HUD / spec readouts / kickers

---

## Summary for redistribution

| Asset class | Source | License | Safe to redistribute in template? | Use as-is for a live product? |
|---|---|---|---|---|
| GT renders | Cloudflare Workers AI (FLUX.1-schnell) | Model output, your account; no stock license | ✅ Yes (unbranded concept) | ⚠️ Replace with your own product imagery |
| Ambient video | Coverr | Royalty-free, no attribution | ✅ Yes (no standalone resale) | ✅ Yes |
| Fonts | Fontsource | SIL OFL | ✅ Yes | ✅ Yes |

When in doubt, swap in your own assets — the template makes it a file swap. See
[DEPLOYMENT.md](./DEPLOYMENT.md).
