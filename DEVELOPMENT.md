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
