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
