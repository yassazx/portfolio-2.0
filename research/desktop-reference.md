# Desktop reference and adaptation

Inspected 2026-10-12. Target: https://landonorris.com/. REA controlled Chromium scenario at 1440 × 900, normal motion. Retained record `ev_d5de6d88fd4916d6ad2cdfad5ee290519fd89dbdfb38ccc8cccdbd7dee7922f5` in `rea-evidence.json`. The scenario sampled splash and hero, then eighteen PageDown actions with settled captures. All actions completed, the footer was reached, and no page-error events were captured. This is a complete homepage traversal, not an audit of every linked route.

## Observed scroll sequence

1. Lime identity loading screen, followed by a large central portrait, animated helmet geometry, pale contour background, fixed corner wordmark and controls.
2. Dark olive introduction with a small centered portrait target, oversized horizontal text, and a large lime signature.
3. Large mixed sans/serif manifesto with colored wipe reveals.
4. Horizontal photo story with varied image sizes, captions, quotations, and a dark-to-light surface change.
5. Split On Track / Off Track composition; portraits enter from opposite sides. A full-width photograph follows.
6. Black helmet gallery with staggered columns, contour-notched image frames and lime details, ending in a curved black edge.
7. Light merchandise and partnership sections, then a fan of social photos.
8. Inset olive footer on lime, raised center tab, large mixed typography, portrait and contact action.

Screenshots are in `desktop/`. Representative points: `hero.png`, `settled-1.png`, `settled-3.png`, `settled-6.png`, `settled-8.png`, `settled-10.png`, `settled-14.png`, and `settled-18.png`.

## Implementation choices for Ilyass

- Kept the pale/olive/lime palette, strong serif/sans contrast, fine contour vectors, centered portrait, large name, expressive menu and curved transitions.
- Replaced the racing helmet with the supplied aligned professional portrait. The final user-directed implementation uses a morphing blob mask, pointer motion, and touch toggle, plus a scroll-driven shrink into a signature scene. See `hero-blob-transition.md`. This is a two-dimensional layered effect, not the reference's depth-displaced WebGL portrait and 3D helmet.
- Rebuilt the splash using a custom IA SVG and GSAP. Image loading settles on errors, fonts are awaited, and an escape timeout and skip control prevent a stranded overlay. Reference loading duration was asset-dependent; we do not copy its network delay.
- Replaced the photographic horizontal story and collectible gallery with three CV-backed engineering projects, each with an explanatory diagram and details. Desktop uses pinned horizontal movement; mobile and reduced motion use normal vertical reading.
- Kept the shaped footer, contact action, background and education content. Added a PDF CV generated from the supplied Markdown.
- Added explicit reduced motion, keyboard focus management, semantic controls, and usable mobile landscape. The reference's touch landscape blocker is documented but intentionally not reproduced.

## Limits

The deployed reference's exact Rive artwork and shaders were not reconstructed. The static source report records timing literals, which differ from frame-by-frame observations. Mobile testing used Chromium device emulation and actual emulated touch gestures; physical iOS Safari/Android performance was not tested. No private source or backend was accessed.
