# Lando Norris mobile reference inspection

Observed 2026-10-12 at https://landonorris.com/. This report distinguishes observed browser behavior from implementation recommendations. No UI implementation was changed during this investigation.

## Evidence and coverage

| Record | Coverage |
| --- | --- |
| `ev_9370586384f60f48adbc095ac743be865909d48da69102fcd38a540230f5bb23` | REA 390 × 844 desktop Chrome viewport; initial splash, settled hero, fourteen PageDown / 1.5-second settle pairs; complete traversal to the footer; 32 screenshot/DOM snapshots; no recorded page errors. |
| `ev_e6e3e8e93d11cd60112e5b56f057338a4b66b28a3b356875a16b03b47492f2f1` | REA 390 × 844 viewport; hero lock/unlock button, menu open/close; nine complete screenshot/DOM snapshots; no recorded page errors. |
| `ev_726a5dd60b7ceab02d1dc14157565f741c46ca18984546316c2877a1fcb4605e` | REA 844 × 390 viewport; splash, settled landscape hero, first scroll; five complete screenshot/DOM snapshots; no recorded page errors. |
| Supplemental touch probe | Real Chromium touch emulation: `isMobile: true`, `hasTouch: true`, iPhone UA, 390 × 844. Twelve CDP touch swipes reached the bottom of the 10,077-pixel document: final scrollY 9,233 + viewport 844 = 10,077. Menu taps, lock toggle, and rotation to 844 × 390 were captured. No page errors. |
| Supplemental tap probe | Touch swipe while locked held scrollY at 0; after unlocking an equivalent swipe reached y=788. Helmet card taps captured visual reveal behavior. |

All three REA records are retained in [mobile-complete-evidence.json](mobile-complete-evidence.json). Early exports `mobile-evidence-bundle.json` and `mobile-interactions-evidence.json` are subsets of that final bundle. The MCP response size limit required exporting retained evidence; the actual analysis was complete, not truncated.

Screenshots and DOM: [mobile-captures](mobile-captures/), [mobile-interactions](mobile-interactions/), [mobile-landscape](mobile-landscape/). Supplemental browser evidence: [mobile-touch/observations.json](mobile-touch/observations.json), [mobile-taps/observations.json](mobile-taps/observations.json). Reproducible probes: [mobile-touch-probe.mjs](mobile-touch-probe.mjs), [mobile-tap-probe.mjs](mobile-tap-probe.mjs).

## Mobile page and full scroll — observed

1. **Hero:** One viewport high. Main portrait is extremely large and cropped at both side edges; its chest reaches the bottom. Small centered monogram, mixed serif/sans name and tiny profession/tagline sit above the face. Store and menu buttons stay fixed in the upper corners, about 14px from the edges at 390px width; menu is approximately 49px square. The desktop side race widget is absent at this portrait width. A lime touch-mode toggle sits lower right. Contour lines move behind the portrait; the 3D helmet/wireframe changes over the face while idle.
2. **Message:** Dark olive background. Centered small mark/label, tinted portrait, giant lime signature over the portrait. Two large lines of marquee text are deliberately clipped at the viewport sides. At some scroll positions the heading travels across the portrait; it is not a static stacked card.
3. **Manifesto:** Large centered tightly spaced uppercase sans with selected words in lime serif. Mobile uses approximately eight wrapped lines and generous blank space before the photo story.
4. **Photo story:** `.s.is-horizontal-track` becomes a long vertical, asymmetrical composition on mobile. Photos remain different sizes and staggered left, middle and right rather than becoming a regular grid. Captions sit above photographs. Two serif quotation blocks are integrated into the collage. A dark olive background transitions to pale cream partway through this section; contour lines continue across both color states. Touch probe section height was about 1,892px.
5. **On Track / Off Track:** The two options remain side by side on narrow mobile, with mixed serif/sans titles, short descriptions, square lime arrow buttons and enormous cropped portraits underneath. A large lime handwritten annotation appears over one heading during progression. The section is about a viewport high and has a pinned/staged feel; subsequent scroll reveals a wide portrait/helmet photo, not a standard card stack.
6. **Helmet gallery:** Black background. Intro title and description remain in two columns. Sixteen helmet entries remain in a two-column grid, approximately 173px wide each with a 14px gap. Thin muted borders have a shaped/notched lower edge. Small titles and lime years sit at the bottom. There is no horizontal gallery swiping needed to see every entry; normal vertical scrolling covers eight rows. After the gallery is a centered serif CTA and lime button. The section ends in a broad curved black edge.
7. **Champion merch:** Cream background; asymmetric text and photos arranged in columns. A large headline sits left, portrait right; supporting images appear beneath. This remains an intentionally dense composition on mobile.
8. **Partners:** Title left and paragraph right, large lime handwritten decoration crossing the title, then a horizontally clipped partner logo marquee. The marquee moves without new scroll input.
9. **Socials:** Centered mixed-type heading, followed by a fan of overlapping tall photographs with rounded corners and slight opposing rotations. The fan extends beyond both viewport edges. Below it are a serif invitation and four small social links in one row.
10. **Footer:** Lime gradient/glow surrounds an inset dark olive panel with contours. Rounded corners and a raised central tab shape at its upper edge. Continuous horizontal sponsor logos; two centered navigation columns; oversized mixed serif/sans statement, lime signature, and cropped helmeted portrait. A centered lime business-contact button overlays the portrait near the bottom. Legal links sit outside on lime. At the last two captures the scroll position is unchanged while marquee logos differ, corroborating time-driven movement.

## Splash and entry — observed, sampled timings

All fresh contexts initially show a full lime screen with `LOAD NORRIS` centered close to the bottom edge. The center can be empty while the animation loads. In the touch probe, a dark monogram is visible at approximately 4.7 seconds after starting navigation, and the hero is visible at approximately 6.8 seconds. These are sparse samples in one network run, not exact designed animation durations. The early REA samples at 0.4 and 1.9 seconds after navigation only captured the lime field and bottom prompt.

- [Initial lime screen](mobile-touch/portrait_initial.png)
- [Centered monogram sample](mobile-touch/portrait_load_2s.png)
- [Hero revealed](mobile-touch/portrait_load_4s.png)

The overlay is `.transition-w` and its primary animation canvas is `[data-rive-primary]`. The visible prompt is inside `.transition-btn`. Captured DOM after completion retains the overlay but sets `visibility: hidden`, `pointer-events: none`, and hides the prompt. In these runs entry finished automatically; we did not need to press `Load Norris`.

The exact intermediate splash morph and its authored timing require the animation/source investigation. This mobile pass proves the visual endpoints and timing range, not each frame between them.

## Menu and touch interactions — observed

- `[data-nav-ham]` is a real button, with `aria-expanded` and `aria-label="Open navigation menu"`. Opening starts with an olive surface descending from the top with a broad convex/elliptical lower edge. It then fills the viewport. The contour pattern continues in the menu.
- The mobile menu hides the desktop image collage and centers four large links vertically. Active Home has a lime strike through. A crest/tagline sits beneath. Business contact and a single row of social links sit near the bottom.
- `.nav-menu-w` starts with `display: none; clip-path: ellipse(120% 0% at 50% 0%)`. The button icon visibly morphs during entry before arriving at the close X. Links reveal after the background begins moving. The captured immediate-opening frame and settled frame demonstrate sequencing, not simply an opacity fade.
- `[data-home-swipe-toggle]` displays `TAP TO LOCK` before activation. After a tap it displays `BACK TO SCROLL` and the lime button contains an X. `aria-pressed` and `data-scroll-disabled` both become `true`. A physical CDP touch swipe leaves scrollY at zero while locked; the same gesture after unlocking scrolls. This affords interacting with the face/helmet scene without inadvertently scrolling away. That last purpose is an inference from the control and scene; scroll locking itself was observed.
- The lock control becomes hidden after leaving the hero. Store and menu remain fixed through the entire document.
- Helmet grid `[data-helmet-item]` taps apply a bright lime border, scale the base helmet to 1.1, and reveal the alternate image using an ellipse clip expanding from `ellipse(100% 0% at 50% 0px)` to `ellipse(100% 120% at 50% 0%)`. The reveal image scales from 1.05 to 1.0. Tapping the second card transfers the highlight/reveal; its alternate image is a photograph of Lando wearing that helmet. No navigation or modal was observed for these card taps.

Useful interaction screenshots: [menu opening](mobile-interactions/menu_open.png), [menu settled](mobile-interactions/menu_settled.png), [locked hero](mobile-touch/portrait_locked.png), [helmet before tap](mobile-taps/helmet_before_tap.png), [helmet first tap](mobile-taps/helmet_after_tap.png), [second helmet active](mobile-taps/helmet_after_outside_tap.png). The last filename describes the original probe action; visually that tap activated the second card.

## Landscape — critical emulation distinction

**On a touch mobile device emulation, rotating to 844 × 390 activates a full-screen lime orientation blocker.** It shows a steering wheel held by two illustrated hands and the text: “Please rotate your device, This is a vertical drive.” It covers the underlying page. `[data-mob-landscape]` changes from `display: none` in portrait to `display: flex` in landscape.

[Observed orientation screen](mobile-touch/landscape_after_rotation.png).

Changing only the viewport dimensions in REA does not emulate a touch device. At the same 844 × 390 dimensions, REA's ordinary desktop Chrome context shows a desktop-like hero with a side race widget and permits scrolling. Do not interpret that as the site's phone landscape behavior.

## Portfolio implications — design recommendations, not observed reference behavior

- Build the opening animation around Ilyass's own monogram and typography. Keep an explicit loading/ready fallback; the reference's empty central lime screen during resource loading should not be copied deliberately.
- Adapt the portrait, contour lines, typography, staged entry, menu curve, gallery reveals and transition shapes. Those are the strongest visual cues that can be reconstructed with the two provided portraits and ordinary SVG/GSAP/CSS.
- The mobile portfolio should keep projects, CV and contact usable in landscape; recreating the reference's orientation blocker is an optional artistic choice with a usability cost.
- Use the helmet two-image reveal idea for project screenshots/details, but make project actions explicit and keyboard-accessible. The two portraits alone do not replace the reference's many gallery/merch/social photographs. Selected work can use screenshot or diagram assets derived from the user's actual projects.
- Only add a hero lock button if there is a meaningful touch-drag scene. Simple portrait parallax does not require a separate mode that stops scrolling.

## Limits

This covers the complete homepage in portrait, mobile menu/touch behavior, and landscape rotation. It does not inspect every linked On Track, Off Track, Calendar or store page. Chrome touch emulation with an iPhone UA is not physical Safari, Android GPU performance, device motion sensor support, or a test of browser address-bar viewport resizing. Reduced-motion behavior was not established in this mobile pass. REA's `complete` status refers to the requested capture artifacts; it is not a claim that every possible interaction has been tested.
