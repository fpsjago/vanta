# VANTA — Hero Asset Manifest

Premium automotive/EV product-launch template. Flagship: **VANTA GT** — an UNBRANDED concept electric performance coupe.
All assets are **brand-safe** (no real car badges/logos/trademarked designs) and cleared for sale + redistribution.

Generated: 2026-06-19

---

## PART A — VANTA GT renders (AI generated)

**Status: AI GENERATION SUCCEEDED.**
**Model:** `@cf/black-forest-labs/flux-1-schnell` via Cloudflare Workers AI (8 steps).
**License:** Outputs of the Flux model run on your own Cloudflare account — usable in the commercial template. No third-party stock license attached.
**Consistency:** All four configurator 3/4-front angles + the hero share **fixed seed 77**, so they read as the same car; only the paint prompt changes. Side/detail shots use their own seeds.
**Output:** PNG, upscaled (Lanczos) to 1600px wide.

| File | What it is | Seed | Notes |
|------|-----------|------|-------|
| `renders/gt-hero-3q.png` | Hero 3/4 front, obsidian black | 77 | 1600x1000. Primary hero. |
| `renders/gt-side.png` | Full side profile, black | 88 | 1600x900. Magenta backlight. |
| `renders/gt-color-obsidian.png` | Configurator: obsidian black | 77 | 1600x1000. Same car as hero. |
| `renders/gt-color-carbon.png` | Configurator: graphite grey | 77 | 1600x1000. Slight body variance vs obsidian (Flux limit). |
| `renders/gt-color-plasma.png` | Configurator: deep magenta candy | 77 | 1600x1000. Reads clearly as magenta paint. |
| `renders/gt-color-bone.png` | Configurator: pearl bone white | 77 | 1600x1000. |
| `renders/gt-detail-wheel.png` | Wheel / rim close-up | 201 | 1600x1600. Tyre sidewall text is illegible gibberish (NOT a real brand). |
| `renders/gt-detail-front.png` | Front nose + light bar + charge port | 261 | 1600x1000. Regenerated to a fully blank, emblem-free nose. |
| `renders/gt-detail-interior.png` | Minimal cockpit / interior | 252 | 1600x1000. Regenerated — blank steering-wheel hub, no logo. |

### Brand-safety notes (important)
- First-pass `gt-detail-interior` had a steering-wheel emblem resembling a Tesla "T" — **regenerated** with a blank hub. Current file is clean.
- First-pass `gt-detail-front` had a logo-like nose emblem — **regenerated** (seed 261) to a smooth, completely blank nose. Current file is clean.
- `gt-detail-wheel` tyre lettering was inspected at 2x crop: it is non-word gibberish embossing, not a trademark. Safe.
- All paint variants are plain bodywork with a generic slim LED light bar; no badges. Safe to redistribute.
- Note: Flux does not perfectly preserve geometry across paint prompts even at a fixed seed — obsidian/plasma match closely; carbon/bone diverge slightly in silhouette. All are premium-quality and same-family. If pixel-identical configurator swap is required, consider compositing recolors off `gt-color-obsidian`.

---

## PART B — Abstract automotive-energy video loops

All from **Coverr (coverr.co)**. **License: Coverr — royalty-free, NO attribution required**, usable in commercial/redistributed products (Coverr terms: may not resell the raw clip as a standalone stock file; using it inside a template is fine). All clips are dark/moody with light motion and contain **no identifiable cars or brands**.

| File | What it is | Source clip URL | Res / Dur / Size |
|------|-----------|-----------------|------------------|
| `video/energy-01.mp4` | Night-drive POV through windshield, dark moody road | https://coverr.co/videos/driving-at-night-vc6o7ninmp | 1280x720 / 27.2s / 8.1MB |
| `video/energy-02.mp4` | Aerial city-night, traffic light streaks/motion | https://coverr.co/videos/busy-intersection-at-night-qzurumrlhb | 1280x720 / 13.1s / 3.9MB |
| `video/energy-03.mp4` | Abstract blurred city-light bokeh (ambient/charge energy) | https://coverr.co/videos/blurred-lights-phkoquiujb | 1280x720 / 15.2s / 4.6MB |

Direct CDN files downloaded (720p): `https://cdn.coverr.co/videos/coverr-<slug>/720p.mp4`

### Color-grade note
Clips lean blue/warm rather than magenta. They are intentionally dark so a CSS `mix-blend-mode` / magenta overlay (`#FF0080`-ish) or `hue-rotate` filter will tint them to the VANTA palette without footage replacement.

---

## Verification
`file` confirms: 9x PNG (1600px wide, >900KB each) + 3x "ISO Media, MP4 Base Media v1". All within spec.
