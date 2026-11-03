# Local development

This is the supplied vanilla HTML/CSS/JavaScript website, refined in place. No build step is required.

From this directory:

```sh
python3 -m http.server 8000
```

`index.html` retains the existing SPA and page markup. `refinements.css` scopes visual changes to About and NeonBook. `refinements.js` owns the About orbit. The existing GSAP 3.12.5 and ScrollTrigger are retained in `vendor/` to avoid a runtime CDN dependency. Google Fonts still uses the original external stylesheet with the original font fallback.

## Verification

Chromium checked desktop (1440 × 1000) and mobile (390 × 844): repeated SPA navigation, all six flow-card reveals, panel/text separation, carousel pointer drag, exact eight-card wrapping, inactive-route suspension, reduced-motion stability, and horizontal overflow. JavaScript syntax checks passed. Home, Work and Contact page HTML was compared with the original upload and is unchanged. Screenshots are in `screenshots/`.

The product preview is illustrative, not a live product screenshot. No user scores or usage statistics are claimed.

## Assets and destinations

The supplied images are stored in `images/`. Home uses `images/wallpaperflare.com_wallpaper.jpg`; `bg-chrome.jpg` is also included as supplied. The existing NeonBook destinations are `https://t.me/`, `https://instagram.com/`, and `#`; they are preserved pending actual project URLs. No backend or live NeonBook integration is included in the original site.

## Experiments gallery

The About page's smaller experiments use `experiments.css`, with six decorative HTML/SVG compositions and native `details` disclosures. The artwork illustrates each project's subject; it does not show live data. Descriptions retain the original project claims. No new dependencies or animation listeners were added.

Design guidance: https://github.com/dickwu/apple-design-skill — particularly Materials (glass reserved for controls), Motion (brief, optional feedback), and Collections (readable, predictable selection). These principles are adapted for a browser rather than native Apple navigation conventions. The signature is the set of project-specific artifacts, with quiet typography around them. Main text uses #24262c, supporting text #626671, and the action accent #405bc3 on white; measured contrast ratios are 15.12:1, 5.74:1, and 6.00:1 respectively.

Chromium validation: 1440, 768, 390, and 320px widths; all six reveals and disclosures; Enter/Space keyboard activation; repeated route navigation; reduced motion; no horizontal overflow or JavaScript exceptions. Increased-contrast and reduced-transparency CSS fallbacks are included. No real-device or screen-reader test was performed.
