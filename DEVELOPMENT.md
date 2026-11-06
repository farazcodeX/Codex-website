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

## Main projects (Work & About)

`projects.css` and `projects.js` present the five owner-selected projects. Work includes native-dialog image enlargement, keyboard focus restoration, subtle GSAP image tilt, and an original canvas particle header. About uses the same project content with native details disclosures. No new runtime dependencies were introduced.

See `PROJECT_SOURCES.md` for repository revisions, image provenance, and outstanding external-access limitations. `images/projects/` contains the actual Tetris renderer capture, the recorded Fmail CLI output, and a portfolio homepage capture. NeonBook and Cinento Watch have editorial artwork until actual site access is available.

Validation for the main-project update: Chromium at 1440, 768, 390 and 320px; five projects on each route; all project images decoded; no horizontal overflow; screenshot enlargement, Escape, focus restoration and route-change dialog cleanup; repeated SPA navigation; reduced-motion particle stability; working project-scroll control; no JavaScript exceptions. Home, NeonBook and Contact markup was compared against the previous commit and remains unchanged. Live external destinations could not be verified because of the network restriction noted in `PROJECT_SOURCES.md`.

## Contact reveal

`contact.css` and `contact.js` scope the Contact redesign. A GSAP-interpolated polygon opens an irregular tear over a dark CSS chrome surface. Pointer exit closes the opening. A native button supports a persistent reveal for keyboard and touch users; Escape closes that state. Motion is disabled for reduced-motion preferences, and state/tweens reset when the route changes. The contact dock uses restrained translucent controls and CSS hover feedback with opaque and reduced-motion fallbacks.

The supplied MotionSites ink-reveal URL returned a proxy 403, so this is an original interpretation of the owner's description, not imported or verified MotionSites code. GitHub now targets the confirmed `farazcodeX` account. Existing email and generic LinkedIn destinations are retained; no LinkedIn profile URL was supplied.

Chromium validation: pointer reveal and exit, button and Escape at 1440/768/390/320px, no horizontal overflow, static reduced-motion reveal, route-reset behavior, three contact links, and no JavaScript exceptions. The other four page sections were compared with the preceding revision and remain unchanged.

## NeonBook finite book display and page rhythm

`neonbook.css` and `neonbook.js` now present exactly five unique, focusable book buttons using the owner's original artwork. There are no cloned books, modulo wrapping, category controls, caption/arrows strip or bottom hero CTA strip. The owner's latest feedback supersedes the endless-shelf behavior in the earlier reference prompt.

Pointer movement tilts and gently shifts the finite group, and hovering lifts a book. Selecting a spine turns that book outward; selecting its cover opens the retained expanding detail dialog with an ink reveal. Keyboard focus selects a book; Enter opens it, Escape closes, and Left/Right/Home/End stay within the five-book boundaries. Reduced motion uses instant, stable changes. Offscreen and inactive routes suspend the animation loop.

Spine text, detail titles, body copy and controls inherit the website's main Inter/system font stack. Each detail has a distinct light gradient drawn from its cover palette, maintaining dark readable copy. Original cover image lettering is part of the artwork and is not modified. Larger gaps separate the NeonBook title, tagline, book presentation and following content.

`spacing.css` retains the shared responsive spacing pass across Work, About, Contact and NeonBook. Home and the other page markup are unchanged by these NeonBook-specific fixes.

Validation: exactly five books and removed controls; five distinct detail gradients; computed font-family matches body for detail headings and descriptions; focus restoration; finite keyboard boundaries; pointer-driven transforms; animated open/close; no overflow at 1440/768/390/320px; repeated SPA navigation; six visible product cards; no JavaScript exceptions.

## Compact product flow and genuine screenshot showcase

The six NeonBook learning-flow cards now use native buttons with two CSS 3D faces. Front and back copy, titles and original icons are preserved; individual colors become restrained back-face tints. Fine-pointer hover flips the object; click/tap and native Enter/Space activation toggle it, and Escape resets it. Accessible labels and `aria-pressed` follow the visible state. Initialization remains guarded in the existing SPA hook. Reduced motion changes faces instantly.

`neonbook-refinement.css` keeps these sections compact: three card columns on desktop, two on tablet and one on narrow mobile, with controlled section padding. The fake product illustration is removed. The original owner-supplied screenshot at `images/projects/neonbook-platform.png` is presented without image edits or cropping in a simple frame. It uses the existing project lightbox for enlargement, Escape and focus restoration, making the dashboard inspectable on mobile. Figma tools were unavailable; Apple Design Skill materials and motion guidance informed the restrained surfaces and timing.

Validation for this refinement: all six keyboard flips and contained text at 1440/900/768/390/320px; mouse hover and return; touch tap toggle in both directions; reduced motion; repeated SPA activation without duplicate toggles; screenshot decoding at its original 1919 × 885 resolution, no simulated preview remaining, no overflow at 1440/768/390/320px; enlargement, Escape and focus restoration. Inline JavaScript syntax and Git whitespace checks passed. Other page-section markup was verified unchanged.

## Shared typography, controls and About organization

Academic content moved from the standalone CODEX section to About. The duplicate About project gallery was replaced with one Work call to action. `design-system.css`, the licensed self-hosted Geist font, and `ui-motion.js` establish consistent typography and GSAP action feedback across the site. See `DESIGN_SYSTEM.md` for the design references, architecture adaptations and validation. The Home exhibition grid now collapses to one real column below tablet width to avoid its pre-existing fixed-gap overflow.
