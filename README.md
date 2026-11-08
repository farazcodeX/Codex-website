# CODEX

**The personal portfolio of Faraz Nourinia — computer science, full-stack development, and games.**

CODEX presents selected projects, startup contributions, academic background, and contact information in a responsive, motion-led interface. It is built with plain HTML, CSS, and JavaScript, with self-hosted animation libraries and fonts.

[Visit the website](https://farazcodex.github.io/) · [Explore the work](https://farazcodex.github.io/#work) · [Contact](https://farazcodex.github.io/#contact)

## Overview

The site combines a chrome-inspired opening screen with quiet editorial layouts, consistent Geist typography, and restrained interactive surfaces. Its five pages share hash-based navigation, so direct links and browser history work without server-side routing.

| Page | Route | Content |
| --- | --- | --- |
| CODEX | `#home` | Introduction and selected NeonBook and Cinento Watch previews |
| Work | `#work` | NeonBook, Cinento Watch, Tetris, Fmail, and the CODEX website |
| NeonBook | `#neonbook` | Five-book interactive shelf, book details, learning flow, and full-resolution platform capture |
| About | `#about` | Background, technical interests, and an Amirkabir University academic folio |
| Contact | `#contact` | Pointer-responsive chrome reveal and contact channels |

Project descriptions distinguish personal work from contributions. NeonBook and Cinento Watch are presented as projects Faraz contributes to, without implying sole ownership or founding roles.

## Features

- **Space-to-light entrance:** a minimal CODEX title and two translucent actions sit beside the original Silver Surfer image; one reversible scroll timeline dissolves the scene into the light portfolio.
- **Smooth scrolling:** Lenis is synchronized with GSAP's ticker and ScrollTrigger. Wheel interpolation is tuned for responsiveness; touch scrolling remains native.
- **Coordinated motion:** masked heading reveals, scroll-linked image framing, subtle ambient lighting, and tactile button feedback.
- **Interactive project media:** native screenshot dialogs with keyboard dismissal and focus restoration.
- **Physical book presentation:** exactly five selectable books, pointer-responsive transforms, bounded keyboard navigation, and cover-specific detail backgrounds.
- **University identity:** the supplied Amirkabir logo is used unchanged as a watermark alongside a genuine entrance photograph.
- **Reusable notifications:** unavailable destinations display an accessible “Under Construction” notice instead of navigating to placeholder pages.
- **Responsive and preference-aware UI:** layouts adapt to narrow screens; motion and transparency preferences receive dedicated fallbacks.

## Technology

| Layer | Implementation |
| --- | --- |
| Structure and navigation | HTML5, native dialogs, hash routes, vanilla JavaScript |
| Styling | CSS Grid, Flexbox, custom properties, responsive stylesheets |
| Typography | Self-hosted Geist variable font |
| Animation | GSAP 3.15.1 and ScrollTrigger; SplitText for heading reveals |
| Smooth scrolling | Lenis 1.3.27 |
| Brand icons | Locally stored Simple Icons SVGs |
| Browser verification | Playwright with Chromium |
| Hosting | GitHub Pages |

There is **no application build step, frontend framework, backend, or runtime package installation**. The browser loads the site directly from the repository's static files. Node.js and Playwright are needed only for automated tests.

## Run locally

Clone the repository and serve its root over HTTP:

```sh
git clone https://github.com/farazcodeX/farazcodex.github.io.git
cd farazcodex.github.io
python3 -m http.server 8000
```

Open **http://localhost:8000/**. Test individual pages with hashes such as `http://localhost:8000/#about`.

Use an HTTP server rather than opening `index.html` through `file://`, so asset loading and browser behavior match the deployed site.

## Project structure

```text
farazcodex.github.io/
├── index.html                  # Page markup, route handling, and shared initialization
├── typography.css              # Current font hierarchy and text-color authority
├── design-system.css           # Shared interface tokens and controls
├── premium.css                 # Editorial presentation and visual treatments
├── projects.css / projects.js  # Work presentation and screenshot dialogs
├── neonbook*.css / neonbook.js # Five-book shelf and NeonBook components
├── contact.css / contact.js    # Contact chrome-reveal interaction
├── academic.css                # University folio
├── social-links.css            # Contact dock and notification presentation
├── notifications.js            # Reusable unavailable-feature notifications
├── smooth-scroll.js            # Lenis lifecycle and programmatic scrolling
├── atmosphere.css / .js        # Route-scoped ambient background
├── ui-motion.js                # Shared control hover, focus, and press feedback
├── premium-motion.js           # ScrollTrigger and heading-reveal lifecycle
├── hero-transition.css / .js   # Home-only cinematic space-to-light scene
├── action-refinements.css      # Project and capture action treatments
├── asset-loading.js            # Image-readiness placeholders and reveals
├── fonts/                      # Local font assets and licenses
├── images/                     # Project media, book covers, icons, and university assets
├── vendor/                     # Locally bundled animation libraries
└── tests/                      # Browser regression scripts
```

Additional scoped stylesheets retain the existing spacing and About/NeonBook refinements. Their order in `index.html` is intentional; inspect the final cascade before changing a component.

## Customization

### Content and contact details

Page content, project URLs, image descriptions, and email destinations are defined in `index.html`. The configured email is **Farazn8564@gmail.com**. Update both visible text and `mailto:` destinations when changing it.

Keep project attribution accurate, and use real screenshots or clearly illustrative artwork. Asset provenance and project-source details are documented in [PROJECT_SOURCES.md](PROJECT_SOURCES.md).

### Typography and visual consistency

Start with [typography.css](typography.css) for font families, type roles, weights, tracking, and text colors. Shared interface tokens live in [design-system.css](design-system.css). Component-specific styles belong in their scoped stylesheets.

[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) records design decisions and subsequent refinements. Its latest entries supersede older decisions; the loaded stylesheets remain the implementation reference.

### Unavailable destinations

Use the existing notification hook for an unfinished destination:

```html
<a role="button" tabindex="0" data-unavailable="LinkedIn">
  LinkedIn
</a>
```

Do not add an empty or placeholder `href`. The delegated handler supports mouse activation, Enter, and Space. A feature can also invoke the notice programmatically:

```js
CODEX.notifyUnavailable('Feature name', document.activeElement);
```

The notice supports manual dismissal and Escape, automatically dismisses after 4.5 seconds, and pauses its timeout during hover, focus, or a hidden tab. A persistent polite live region announces its message. Replace the unavailable hook with a real link when the destination is ready.

### Scroll and animation ownership

Use `window.codexScroll.to(target)`, `.reset()`, and `.resize()` for programmatic scrolling. Lenis already runs on GSAP's ticker; do not introduce a second smoothing controller or another Lenis animation loop.

Keep one transform owner per element. The book shelf, screenshot controls, shared buttons, and scroll reveals each have their own lifecycle. Changes to `window.__onRouteChange` must preserve the existing hook chain.

## Testing

Browser tests require **Node.js**, **Playwright**, and **Chromium**. To install test tooling locally without adding application dependencies:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
```

Tests default to `/usr/bin/chromium`. If using Playwright's downloaded browser, configure its executable path:

```sh
export CHROMIUM_PATH="$(node -p 'require("playwright").chromium.executablePath()')"
```

Run the relevant checks:

```sh
node tests/premium-ui.cjs
node tests/scroll-experience.cjs
node tests/academic-folio.cjs
node tests/contact-reveal.cjs
node tests/social-notifications.cjs
node tests/project-actions.cjs
node tests/neonbook-capture.cjs
node tests/hero-transition.cjs
```

Each script starts and closes its own local HTTP server. Coverage includes responsive routes, overflow, font consistency, keyboard actions, dialogs, scroll lifecycle, reduced motion, notification timing, image readiness, and email destinations. Some scripts write inspection screenshots to the system temporary directory.

These checks do not certify external-service availability or replace testing on physical devices. See [DEVELOPMENT.md](DEVELOPMENT.md) for additional implementation notes and validation context.

## Deployment

The site is published at **https://farazcodex.github.io/** through GitHub Pages.

To publish a compatible copy:

1. Push the complete static site to the repository.
2. In **Settings → Pages**, select **Deploy from a branch**.
3. Choose **main** and **/ (root)**, then save.
4. Wait for GitHub's Pages deployment to complete.

The repository name `farazcodex.github.io` publishes the site at the account’s root Pages address, without a repository-name suffix. Keep asset paths relative. Hash routes require no server rewrite rules. Branch deployment availability depends on repository visibility and the GitHub account plan.

## Credits and licensing

- [GSAP](https://gsap.com/) — animation and scroll-triggered effects; subject to its own distribution terms.
- [Lenis](https://github.com/darkroomengineering/lenis) — smooth scrolling; bundled license in `vendor/Lenis-LICENSE.txt`.
- [Geist](https://github.com/vercel/geist-font) — typography; bundled license in `fonts/Geist-LICENSE.txt`.
- [Simple Icons](https://simpleicons.org/) — LinkedIn and GitHub brand paths; bundled CC0 notice in `images/icons/Simple-Icons-LICENSE.md`.

Third-party marks, book covers, photographs, and project media retain their respective owners' rights. The Amirkabir mark identifies the university in the academic section; CODEX is a personal portfolio, not an official university website.

No repository-wide open-source license is currently declared. Third-party licenses do not grant blanket permission to reuse the portfolio's code, identity, or supplied media.
