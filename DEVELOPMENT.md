# Development

This is a static HTML/CSS/JavaScript site, with no build step or runtime package installation.

Run `python3 -m http.server 8000`, then open the local HTTP address. The five routes are #home, #work, #neonbook, #about and #contact. `app.js` handles routing, focus, native mobile menu and configured social links. `neonbook.js` preserves the finite five-book shelf and native detail dialog. `asset-loading.js` handles real image readiness.

Run `node tests/premium-ui.cjs` with Playwright and Chromium installed. Set CHROMIUM_PATH to select another Chromium binary. The test starts a temporary local server and verifies the five routes, responsive layouts, 12px minimum rendered text, mobile menu and book dialog. Screenshots are generated under /tmp at 360/768/1440px. External destinations are known owner-supplied links, not live-verified services.

GSAP and ScrollTrigger 3.15.1 are self-hosted under vendor/. Geist's license is under fonts/. No other font or animation plugin is loaded. See CHANGELOG.md for the audit implementation and verification limits.
