# Ilyass Azyaiz — portfolio

A local React + Vite portfolio with GSAP motion, built from the supplied portraits and CV. The visual and motion reference is landonorris.com; the implementation, content, monogram, diagrams, and background vectors are original to this portfolio.

## Run

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. `npm run build` creates a static production site in `dist/`; `npm run preview` serves that build. This project has not been published.

## Content

- `src/data.js`: internship projects and skills.
- `src/App.jsx`: introduction, education, certifications, contact, navigation, and animation choreography.
- `src/components.jsx`: shared visual components and project diagrams.
- `src/styles.css`: responsive styles and visual tokens.
- `Ilyass_AZYAIZ_CV.md`: original factual CV source.
- `main.png` and `hover.png`: original supplied images, preserved unchanged.
- `public/Ilyass-Azyaiz-CV.pdf`: downloadable one-page CV.

Project visuals are explanatory diagrams of work described in the CV. They are not screenshots of internal employer software. No social-profile URL was invented from the LinkedIn name in the CV.

## Motion and interaction

- Asset-aware lime splash, IA monogram, progress readout, curved exit, skip control, and timeout fallback.
- Casual/professional portrait reveal on mouse hover; tap or keyboard toggle keeps a selected mode.
- Pointer parallax and scroll drift with a separate mobile composition.
- Fullscreen curved menu, staggered links, Escape dismissal, focus trap and focus restoration.
- Staggered colored text wipes and a horizontal project sequence on desktop.
- Vertically stacked projects on mobile and for reduced motion.
- Expandable project details that receive focus and stay in view, with Escape dismissal.
- Keyboard focus synchronized with the desktop project sequence, copy-email control, and CV download.
- Explicit reduced-motion behavior and no mobile landscape blocker.

## Verify

Requires installed Google Chrome. The checks launch Chrome through Playwright; no separate browser download is needed.

```sh
npm run dev -- --port 5173
# In another terminal:
npm run verify
npm run verify:keyboard
```

Set `PREVIEW_URL` to test another local origin. Browser screenshots and the check report are written to `.impeccable/review/`. The probe covers desktop, two phone widths, landscape, reduced motion, menu controls, portrait toggle, project details, overflow, broken-image loading, browser errors, and CV download. The keyboard probe checks forward/reverse project navigation and landscape disclosure focus and dismissal. These are Chrome checks with emulated viewports, not physical-device or cross-browser validation.

Regenerate the PDF after editing the CV:

```sh
npm run cv
```

## Reference research

- `REFERENCE-ANALYSIS.md`: overview and scope.
- `research/motion-source.md`: source-backed animation timings, easing, loading gates, portrait rendering and mobile behavior.
- `research/mobile-reference.md`: full mobile traversal, touch interactions, splash, menu and landscape findings.
- `research/desktop-reference.md`: desktop scroll and reconstruction decisions.

REA exports, downloaded reference JavaScript, and research screenshots are local research artifacts, excluded from the build. The Vite production output contains only the portfolio and its own assets. See `ASSET-PROVENANCE.json` for asset origins.
