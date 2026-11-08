# CODEX shared UI

## Scope

The portfolio remains a vanilla HTML/CSS/JavaScript SPA. Education belongs on About, detailed projects belong on Work, and About provides one direct Work link instead of duplicating its gallery. The Silver Surfer opening keeps its existing markup, image, composition and identity cycle; the requested shared font also applies there.

## Typography and controls

`design-system.css` is the shared theme. Geist is self-hosted as a variable Latin WOFF2 font with a system fallback stack. The font comes from `@fontsource-variable/geist` 5.3.0; the downloaded npm archive was checked against its published integrity before extraction. Its SIL Open Font License is retained in `fonts/Geist-LICENSE.txt`.

Type roles, neutral colors, action height, radius, borders and shadows are CSS custom properties. Actions use the same 44px minimum height and label treatment across pages. Glass is limited to functional navigation/actions, with opaque and increased-contrast fallbacks. Book cover/screenshot lettering remains part of its original artwork.

`ui-motion.js` gives shared actions, navigation and contact links brief GSAP feedback: a small hover/focus lift, a subtle pointer response and press compression. It leaves book transforms, flip-card transforms and screenshot-plane tilt under their existing controllers. Listeners are installed once per media-query setup, removed on cleanup, and inactive controls reset on routing. Reduced motion removes these transform interactions.

## Reference adaptation

- LobeHub `lobe-design` skill: https://github.com/lobehub/lobehub/tree/HEAD/.agents/skills/lobe-design — version 5.8.0 when inspected. Applied its system-unification approach, typography/token discipline, spacing and transform-only feedback guidance.
- Apple Design Skill: https://github.com/dickwu/apple-design-skill — applied its distinction between content surfaces and functional glass, visible focus, hit targets and reduced-motion/transparency guidance.

These references are adapted to the established native-DOM architecture. LobeHub's React `ConfigProvider`/component-package/bootstrap requirements are not installed into this site. The shared CSS theme declares font/color tokens directly; the lint exceptions explain this at their definitions. LobeHub's design lint on the two new UI files reports 0 failures and 0 warnings with those documented adaptations.

## Validation

Verified education only in the dedicated About section, a single GPA there, no duplicate About project gallery, the About→Work pointer, and five retained Work projects. Chromium loaded the actual Geist font and checked all five routes at 1440, 900, 390 and 320px without horizontal overflow. The existing Home exhibition grid needed a one-column mobile correction because its twelve fixed gaps overflowed narrow screens.

Hover/focus GSAP response, keyboard navigation, preference-change cleanup/reinitialization, all six flip cards with contained copy at 320px, screenshot closing and Contact reveal controls passed. No JavaScript exceptions were observed. Syntax, whitespace and reference-lint checks passed. This does not claim native iOS Liquid Glass rendering or real-device testing.

## Editorial and optical refinement

The current layer is `premium.css`, with shared controls in `ui-motion.js` and route-scoped entrances in `premium-motion.js`. Manrope variable (Fontsource 5.3.0, SIL OFL; npm archive integrity verified before extraction) pairs with Geist: Manrope for display/editorial headings, Geist for body, controls, labels, and book spines. The license accompanies the self-hosted Latin font. Display sizes, tracking and line height are calibrated by role; book-cover lettering remains original artwork.

Four action roles: charcoal primary; translucent secondary over the opening image; tertiary underlined project links; circular icon controls. Functional surfaces use optical borders and reflections; content uses quieter opaque or standard translucent surfaces. A single GSAP controller owns magnetic movement, short press/focus feedback and arrow motion. Decorative SVGs and sheen layers are aria-hidden and cannot receive pointer events. Dynamic Contact button text stays the first text node; About's pause button keeps its native text replacement.

The Silver Surfer image, positioning and opening concept remain. Homepage actions link to Work and Contact. The formerly empty NeonBook preview uses the supplied dashboard capture, while CODATE has an original illustrative conversation graphic rather than a fabricated screenshot. Existing content, route destinations and project information remain.

Only `.motion-owned` elements use the new ScrollTrigger entrances. The legacy CSS reveal layer is explicitly disabled for those elements; orbit, book, capture tilt and flip-face transforms retain their existing owners. Route changes revert the prior matchMedia context. Scroll drives a subtle ambient light field beneath the homepage project section; there is no additional infinite loop or scroll hijacking. GSAP and ScrollTrigger were already self-hosted, so no extra animation dependencies were needed. Reduced motion removes this new motion and the opening background drift. Contrast/transparency preferences get opaque controls. Mobile navigation labels are now visible at every tested width.

References applied: the GSAP Core and ScrollTrigger skills, and the Apple design skill's Liquid Glass guide (functional material versus content material). Figma tools were unavailable in this session; no Figma artifact was created or claimed.

Validation: `node tests/premium-ui.cjs` with Playwright and Chromium. Checks five routes at 320/390/768/1024/1440px, font loading, visible navigation, overflow, scroll completion, repeated route cleanup, pointer press, keyboard navigation, dynamic Contact labels, reduced-motion cleanup and reinitialization, and missing assets/JavaScript errors. Existing book flip and screenshot dialog regressions also passed. Desktop and mobile screenshots were inspected locally. This is a vanilla static site with no production build, type checker or package lint pipeline; JavaScript syntax and `git diff --check` were checked. External destinations were preserved, not live-verified.

## Softer type and expressive GSAP interactions

The owner's GSAP homepage screenshot supersedes the Manrope/Geist pairing above. DM Sans variable (Fontsource 5.3.0, SIL OFL, archive integrity verified) is now the shared display/body/control font, with its license in `fonts/DM-Sans-LICENSE.txt`. More open tracking and moderate weights give headings a rounder, less compressed character. This is an interpretation of the supplied reference, not a claim to use GSAP's proprietary brand typeface.

GSAP and ScrollTrigger are upgraded together to 3.15.1 from the integrity-verified public npm package. Self-hosted SplitText, CustomEase, and ScrollToPlugin are the same version. SplitText owns masked word entrances and restores original heading markup/ARIA on route exit or reduced-motion changes. ScrollTrigger drives project framing and footer scale against real scroll distance, while project copy enters in a staggered sequence. The former NeonBook header reveal was removed so typography has one owner. Work's jump control uses interruptible ScrollToPlugin with a navigation offset; reduced motion uses an instant native jump.

Buttons now use a rising contrast fill, CustomEase, a two-stage arrow exit/return timeline, a small magnetic response, and press feedback. Decorative fill layers preserve dynamic Contact labels and are reset on route changes. The previous sheen animation is removed. Native button/link semantics, keyboard focus and actions remain intact. No physics, scroll hijacking, or redundant animation frameworks were added.

Validation: the committed browser suite passes all five routes at 320–1440px; visible fill completion; SplitText accessible-name restoration; real scroll mask changes; route cleanup; reduced-motion toggling; pointer and keyboard actions; no missing assets or page errors. Existing flip-card, screenshot-dialog, and Contact regressions passed after the GSAP upgrade. Desktop/mobile screenshots were reviewed locally. No production build is needed for this static site.

## Rounded type, footer restoration and real loading states

Nunito variable (Fontsource 5.3.0, SIL OFL, integrity verified) supersedes DM Sans. Its rounded terminals and 800/850 display weights implement the owner's request for visibly softer, bolder type. The footer returns to the original large 48–128px, three-line statement, now at weight 800 in Geist; its scroll-scale effect is removed. Footer social logos return to their original 20px unframed presentation. Trailing directional icons are removed from actions, contact links and project-preview controls; button fill and press feedback remain.

Entrances use shorter travel, lower stagger and longer easing. Project scroll masks use a smaller crop and smoother scrub. `asset-loading.js` adds placeholders only to images awaiting network readiness, waits for decode, then fades ready images in with a short stagger. Cached images display immediately. Failed downloads remove the placeholder and expose native alternative text; no arbitrary loading delay is imposed. Existing dimensions reserve image space. Reduced-motion users get static placeholders and instant readiness changes. Text and controls remain available while images load.

The browser suite additionally verifies removed arrows, original footer icon sizes, bold footer weight, delayed-image placeholders and readiness, and failed-download recovery. Five-route responsive, keyboard, motion cleanup and missing-asset checks passed. Desktop and mobile were visually inspected locally.

## Typography-only consistency pass

The current typography authority is `typography.css`, loaded after the existing visual styles. Geist is the sole active font for headings, body, navigation, controls, card copy and the footer. Superseded Manrope/DM Sans/Nunito font registrations and family overrides were removed from premium.css; only Geist is preloaded. Original licensed files remain in source history/workspace but are not requested by the page.

Roles: body 16px/400/1.65; lead 18px/400/1.65; bounded-card copy and controls 14px/400 or 500; labels 12px/500/1.55. Standard headings use 600, display titles/footer 650. Tight tracking is limited to headings; body and UI tracking is neutral. Heading size tokens preserve the existing display, section and card hierarchy. The existing compact mobile navigation and decorative book-object lettering retain their responsive sizing to preserve the layout.

Shared text tokens separate primary #25272d, secondary #535b67 and muted #626975 from inverse white and #d4d8df. Dark opening/footer and the Contact chrome reveal keep their intentional inverse treatment. Accent artwork and the book covers are not recolored. The final typography layer changes no backgrounds, dimensions, positioning, spacing, transforms, transitions or animation logic.

Verification: all five routes at 320/390/768/1024/1440px; heading and action font consistency; no horizontal overflow; six flip cards fit at 320px; pointer/keyboard actions; screenshot dialogs; Contact reveal; route/motion cleanup; slow-image states; no missing assets or JavaScript errors. Existing GSAP controllers and all page markup/content are unchanged apart from stylesheet loading and font preloading.

## Lenis smooth scrolling and living atmosphere

Lenis 1.3.27 is vendored with its CSS and license. Its public npm archive was checked against the registry integrity value. Implementation follows the official darkroomengineering/lenis README GSAP integration: `autoRaf:false`, `lenis.raf(time * 1000)` on the existing GSAP ticker, Lenis scroll events calling ScrollTrigger.update, and ticker lag smoothing disabled. There is no separate Lenis RAF loop or transform-based scroll wrapper.

Wheel interpolation was compared at .10/.14/.18 with identical 720px inputs. At roughly 260ms the browser reached about 589/644/680px respectively; all settled at 719–720px without overshoot. The chosen .14 gives a faster response than default without the more abrupt .18 response. Wheel multiplier stays 1; duration/easing are not mixed into wheel lerp. Programmatic section jumps use .85s cubic-out and a 95px navigation offset. Trackpad precision is preserved by leaving input deltas unscaled. Native touch remains native (`syncTouch:false`). These are local Chromium observations, not physical-device benchmarks.

`smooth-scroll.js` owns the sole scroll smoother and exposes reset/to/resize through codexScroll. Hash routes reset both native and Lenis positions immediately, preventing residual momentum from carrying between pages. The Work jump uses the same controller; ScrollToPlugin is no longer loaded. Dialogs are observed after DOM parsing, excluded from smoothing, and stop background scrolling while retaining their native internal scroll. Visibility changes stop scrolling; reduced-motion changes destroy/recreate the smoother with native fallback.

`atmosphere.js` adds two low-alpha lighting fields per route, only animating the active page with GSAP. One slow transform yoyo provides continuous life; a separate wrapper provides a small scroll-linked shift. Fields are decorative, noninteractive and behind content; Home's field begins below the 100svh Surfer opening. Inactive routes revert their animations, hidden tabs pause them, and reduced-motion/transparency preferences remove the fields. The older Home-only field and its controller were replaced, so there is one atmosphere owner. No typography, component geometry or Surfer asset was changed.

Verification: tests/scroll-experience.cjs compares wheel settings and checks route reset, section offset, native modal scrolling/background lock, live reduced-motion changes, touch configuration, atmosphere trigger cleanup, and no missing assets or JS exceptions. The existing responsive, book flip, Contact, keyboard, image-readiness and animation lifecycle suites also passed. Real Safari/iOS hardware was not available; touch handling is intentionally left to the browser.

## Academic folio

The About academic section is now a responsive two-panel university folio, scoped entirely by academic.css. A muted blue identity panel pairs an original SVG study of the supplied Amirkabir lotus/gear/open-book motif with the university wordmark and a quiet grid. This is an emblem-inspired illustration, not a retrieved official logo: the inline reference was not exposed as a local file and the public university reference lookup was unavailable. No founding date, campus location, award or academic claim was added.

The adjacent panel keeps the existing university, degree, undergraduate status, bio and 17.6/20 GPA. The scale is now explicitly labeled Iranian 20-point scale. Geist and the shared weight/text roles remain; the existing section reveal, Lenis scrolling and ambient lifecycle remain their owners. The card stacks under 650px and preserves the full text at 320px.

Figma tools were unavailable in this session, so implementation and local browser review were done directly. `tests/academic-folio.cjs` verifies 320/390/768/1440px, SVG decoding, typography, single GPA and no page errors/missing assets. Existing responsive and interaction tests passed. Test HTTP servers now serve SVG with image/svg+xml.

## Exact supplied logo and entrance composition

This supersedes the emblem study above. The user supplied a ZIP containing `20240311112001_file_TP.png` and a 1290×860 photograph of AUT's entrance. Both are copied without editing to images/academic/amirkabir-logo.png and amirkabir-entrance.jpg. Logo SHA-256: 69d7efe26e3e5c3a4539abed4a9c2bd3b0ae8ff881f719cceda45efcfbe49ead. The original SVG study is removed.

Architecture research used the supplied real entrance photograph: the outer sweeping segmented concrete arch, smaller inner arch, separate rectangular voussoirs, and visible joints are preserved in the actual image. No generic columns or generated architectural substitute is used. The photo spans the folio behind a more opaque reading surface. The logo is an uncropped proportional watermark within that reading surface (opacity .045 desktop/.035 mobile), without tint, filters, tracing or asset modification. Both background images are decorative, pointer-inert and excluded from the foreground loading veil so delayed background requests cannot cover text. The title, university, degree, biography and GPA remain foreground content.

Validation: byte identity is enforced in tests/academic-folio.cjs; four responsive widths check original image decoding, contain fitting, low opacity, pointer safety, typography and no overflow. Existing five-route responsive/interaction/image readiness checks passed. Visual desktop and mobile review confirmed the segmented arches and intact logo remain visible behind readable text. Only the Academic composition and decorative-image loading behavior changed.

## Contact reveal extent

The Contact reveal stage now extends upward by exactly the existing 145px top whitespace (115px on narrow screens), so its dark hover surface reaches beneath the fixed navigation. Matching padding and minimum-height compensation preserve both text layers and all following content positions. The old explicit reveal button and pointer hint are removed. Pointer hover and touch reveal remain decorative; reduced motion closes the mask, and the three contact destinations remain available.

`tests/contact-reveal.cjs` verifies the stage reaches page top, both text layers retain their measured desktop/mobile positions, no stage buttons remain, hover still draws the mask, contact links remain, and reduced motion clears the reveal. Existing five-route and interaction regression checks passed.

## Social dock and reusable construction notification

`social-links.css` refines the Contact dock with consistent icon wells, proportions, optical dividers and restrained hover depth. Shared Geist text roles remain. LinkedIn and GitHub use the unmodified brand paths from Simple Icons 16.36.0 (CC0), with local source SVGs and license under images/icons/. Brand SVGs use currentColor fills rather than the envelope's outline styling. The shared GSAP controller no longer treats the dock icon as a directional arrow; this avoids conflicting icon animations.

`notifications.js` delegates activation through `[data-unavailable="Feature name"]` and exposes `CODEX.notifyUnavailable(label, trigger)`. A single reusable toast displays Under Construction; repeated activation resets its 4.5s timer. Hover, focus and hidden-document states pause the timer. The close control and Escape dismiss, without initially stealing focus. Manual dismissal from inside restores focus to the activating control. Route changes clear the toast. A persistent, visually hidden polite live region announces updates independently of the animated shell. Reduced motion removes entrance/exit movement; reduced transparency and higher contrast have solid fallbacks.

All placeholder LinkedIn/Telegram/Instagram destinations use focusable button-role anchors without href; Enter and Space open the toast. Working mailto and individual GitHub/project links remain functional. Bare footer GitHub URLs now use the confirmed farazcodeX profile, and NeonBook's placeholder Website row uses its confirmed neonbook.ir address. No unverified social URL was invented.

Validation: tests/social-notifications.cjs checks keyboard activation, exact title, no navigation, working destinations, manual focus return, Escape, auto-dismiss, focus-paused timing, SVG rendering, 320–1440px and reduced motion. The existing five-route responsive and interaction suite also passed, with no missing requests or JavaScript errors. Source review confirms no placeholder # or bare social-domain destinations remain.

## Project previews, capture actions and responsive control motion

The Home exhibition's second entry now presents Cinento Watch as an original film-reel/wordmark composition with the verified application-contributor role. Its Work destination remains. All mailto destinations and the Contact dock's visible address now use the owner-supplied Farazn8564@gmail.com.

`action-refinements.css` gives Project story the shared outlined pill treatment, removes its trailing arrow and underline, and puts View capture in normal flow below each screenshot instead of overlaying the image. Existing capture dialogs and native button labels/focus behavior remain.

The shared GSAP action controller now animates only actual hover/focus/press state changes. Pointer-follow x/y sampling, moving-button geometry reads, repeated fill restarts and capture-plane tilt listeners are removed. Short 180ms lift/press and 240ms fill transitions provide immediate feedback. Controls retain reduced-motion cleanup and keyboard press feedback. CustomEase is no longer loaded because the revised controller uses built-in easing exclusively.

Tests: project-actions checks the Cinento preview, Project story styling/navigation, stable hover x position, capture placement and keyboard dialog flow, plus every email URL. Existing five-route 320–1440px responsive, interaction, notification and reduced-motion checks passed without missing assets or page errors.
