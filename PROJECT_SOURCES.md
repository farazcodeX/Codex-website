# Project content and capture provenance

Updated 2026-11-03. The five selected projects are the ones supplied by the portfolio owner. Contributions are not presented as sole ownership or founding roles.

| Project | Source | Image used |
| --- | --- | --- |
| Tetris | `farazcodeX/tetris`, commit `e888d5f9990a591792d9135934164cb1dd4c1119`; source inspected and compiled | Actual Swing `GamePanel` rendered offscreen after 250 update calls, using repository images. Windows-only asset filenames were mapped to local aliases outside the checkout. No game source was changed. |
| Fmail | `farazcodeX/fmail`, commit `33f3f9408c8575b77a99e1e22b35a7f079fd7062`; entities, services and CLI inspected | Browser-rendered transcript of the actual Java CLI startup and exit. This is labeled recorded CLI output, not a graphical mail client screenshot. |
| CODEX Website | This repository, current Home page | Actual Chromium browser screenshot at 1440 × 900. |
| NeonBook | Owner's supplied project brief: technology books, 20-question tests, points and weekly competition | Work/About retain editorial artwork. The NeonBook page now uses the original 1919 × 885 dashboard screenshot supplied by the owner on 2026-11-04. |
| Cinento Watch | Owner: works on Cinento Watch; Cinento supports AI film/series workflows including script development and budgeting | Original editorial artwork, not an application screenshot. Link targets the supplied Cinento company page. |

## Runtime limits

Tetris was compiled with the available Java 21 compiler and its actual panel renderer was captured. The full audio/gameplay path was not validated. The README lists controls that differ from the source: the source uses arrow keys and Escape; no hard-drop claim was added.

Fmail's Maven configuration targets Java 23. Its source also compiled with the available Java 21 compiler and the declared Hibernate/Jakarta dependencies. The CLI startup and normal exit (application-defined exit code 69) were verified. No database credentials were supplied or needed for that capture. MySQL-backed account creation, delivery, and persistence were not exercised. Descriptions of those capabilities come from the inspected code, not a successful end-to-end database test.

The environment proxy denied `neonbook.ir`, `www.cinento.net/en`, and `motionsites.ai/?prompt=particle-self` with HTTP tunnel 403 responses. Consequently, no live-site screenshots or MotionSites code were retrieved. Required domains, including their www variants, were saved in the environment draft. Live captures and motion-reference inspection remain pending access through environment settings.

Motion uses the existing locally bundled GSAP 3.12.5 and a small original canvas particle study. It does not claim to implement or reproduce the inaccessible MotionSites example. Motion runs only while the Work hero is visible and respects reduced motion.

## Design references

Apple Design Skill: https://github.com/dickwu/apple-design-skill. Materials, motion, typography, accessibility and collections guidance informs the layout. Solid content surfaces carry the projects; translucency is limited to screenshot controls and dialog backdrop. No native Apple APIs or Apple-owned design assets are bundled.
