# Hero blob and scroll-to-signature adaptation

Updated 2026-10-12. The user's final direction replaces segmented slices with an organic reveal and animated contour lines, plus a reversible hero-to-signature scroll transition.

## Reference evidence

- The supplied [Ripplix recording](https://www.ripplix.com/library/hero-hover-loop-lando-norris-portfolio-websitemp4) was inspected through its public video element. Recording: 18.3 seconds, 1440 × 1080, public `play_1080p.mp4` on the page's Bunny CDN. `scripts/inspect-hover-reference.mjs` captures timestamped frames. The first visible band crosses the head approximately from 0.6 to 2.8 seconds; broad angled reveals follow. These are sampled visual observations, not exact easing measurements. The later user instruction supersedes the slice treatment.
- Existing REA desktop evidence `ev_d5de6d88fd4916d6ad2cdfad5ee290519fd89dbdfb38ccc8cccdbd7dee7922f5`, especially `research/desktop/settled-1.png`, shows a dark olive scene with a centered, tinted rectangular portrait, opposing large text rows, and an oversized lime signature.
- `research/motion-source.md` identifies the reference's `O9.transition()` around source offset 887849: over roughly one viewport of scroll the WebGL portrait bounds shrink from the viewport toward `.marquee-gl-target`, with a camera/filter transition and `power1.inOut` scrub. This is static source evidence. The portfolio uses SVG/CSS/GSAP rather than the original WebGL scene.

## Implemented behavior

- Aligned source images remain unchanged. Complementary SVG masks reveal the work portrait through a smooth 12-point closed spline. A small antialias overlap prevents pale seams at the boundary.
- Hover expands the organic reveal in 1.2 seconds with `expo.inOut`; its center follows the pointer with damping while its outline slowly morphs. Leaving contracts it over 0.8 seconds. The button expands the blob to reveal the whole work portrait; it also supports touch and keyboard.
- The opening blob is preserved. After a 1.8-second idle pause, the blob sweeps from beyond the left viewport edge to beyond the right in 4.8 seconds, then returns; a full cycle takes 10.8 seconds. A stationary hover yields to this sequence after 2.5 seconds without pointer movement. Moving the pointer takes control again, while locking work mode keeps the full alternate portrait visible.
- Background lines are smooth isolines of an evolving, warped scalar field, producing irregular islands and open curves rather than concentric rings. Geometry updates at up to 30Hz with stronger visible drift and pointer response. Both effects suspend while the menu is open, the page is hidden, or their visual is offscreen. Idle portrait sweeps also pause during the signature scroll transition.
- The hero remains sticky through a 220svh section. Scroll progress directly controls the paper-to-olive background, outgoing hero lettering, shrinking portrait frame, desaturation, horizontal text travel, and drawn signature strokes. Reversing scroll restores the starting composition. The signature is an authored decorative mark, not a supplied handwriting asset.
- Mobile uses the same scroll relationship with a smaller target frame. Short landscape fits the viewport. Reduced motion keeps the main portrait controls and presents a static signature section without the pinned transition or ambient movement.

## Verification

`npm run verify:portrait` covers mask state, contour changes, menu suspension, intro completion, touch toggles, scroll progress at four points, signature stroke completion, stationary scroll state, reversal, offscreen suspension, overflow, reduced motion, and page errors. It saves rendered desktop, mobile, and landscape captures under `.impeccable/review/blob-hero/`. These are local Chrome checks, not a physical-device or cross-browser claim.
