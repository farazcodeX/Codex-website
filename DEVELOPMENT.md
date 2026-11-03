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

## NeonBook physical shelf and page rhythm

`neonbook.css` and `neonbook.js` implement the owner's supplied shelf-hero brief with the five original book covers in `images/books/`. Generated spine faces use title typography and colors from each cover; the uploaded artwork is retained unchanged. The page keeps NeonBook's existing content and navigation rather than adopting the fictional film data, remote image sheets, global scrolling restrictions or multilingual branding in the reference prompt.

One visibility-aware animation loop handles the repeating shelf, 3D opening/closing covers, hover lift and pointer tilt. Spines can be selected directly; previous/next, subject shortcuts, arrow keys, dragging and horizontal wheel gestures also navigate. Vertical wheel input continues to scroll the page. The active book has a live caption and a keyboard-accessible Explore control. A native dialog expands from the cover, reveals its artwork with an SVG ink mask, and shrinks back on close. Escape, route cleanup, focus restoration and reduced motion are supported. Decorative copies stay out of the accessibility tree; the named controls provide the equivalent keyboard path.

The supplied reference prompt was available locally for this revision. No reference image sheets or film assets were imported. The six product-flow cards retain IntersectionObserver reveals.

`spacing.css` applies a shared, responsive spacing pass only to Work, About, Contact and NeonBook: longer section breaks, wider component gaps, additional copy padding and quieter shadows/ambient decoration. Home and main navigation retain their original layout.

Validation: five-book wraparound, subject selection, real pointer drag, instant reduced-motion detail opening/closing, animated sheet expansion/retraction and ink reveal, responsive overflow checks at 1440/768/390/320px, repeated SPA navigation, six visible product cards and no JavaScript exceptions. Book metadata uses the supplied titles, verified author names where known and short subject descriptions without claims about unverified live catalog availability.

Additional spacing/shelf validation: Work and About at 1440/768/390/320px with five visible projects each and all project images decoded; existing project lightbox, Escape, focus restoration and route cleanup; Contact tear, keyboard and reduced-motion controls at all four widths; actual touch-event dragging of the book shelf and focus restoration after its dialog closes. Browser test selectors distinguish the two native dialogs. No previews or new screenshot files were added to the repository in this pass.
