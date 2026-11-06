# CODEX design system

One stylesheet, `styles.css`, uses the ordered layers tokens, base, layout, components, pages, motion and a11y. Geist is the sole self-hosted font. Headings use weight 650, body 450 and controls/labels 550. The minimum rendered type size is 12px; body copy is 16px, with a 20px lead.

The nine color tokens are defined in the tokens layer. Light pages use white content surfaces, warm paper backgrounds and dark text; black is reserved for the compact footer and the supplied chrome artwork. Book cover colors remain properties of the artwork/physical book representation.

Containers are 1200px with responsive 20–48px gutters. Main sections use 72–140px vertical spacing. Controls have a minimum 44px target. Social SVGs are 20px within 44px targets. Mobile navigation uses a native modal dialog, providing Escape and focus containment.

The mobile menu, book detail and hash routes use native semantics. Only small card entrances use GSAP/ScrollTrigger. Reduced motion disables entrances and image shimmer. Book motion remains suspended off route and when hidden. The earlier carousel, custom cursor, contact tear, typography splitting and pointer button effects have been removed.

`SITE_LINKS` in app.js is the only configuration for social/contact destinations. Empty destinations stay visible as disabled link roles with a visible coming-soon message; they do not fabricate URLs. The 50% disabled appearance follows the audit's explicit instruction; disabled controls are exempt from WCAG text-contrast requirements.
