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
