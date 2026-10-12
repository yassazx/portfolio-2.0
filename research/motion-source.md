# Lando Norris motion: static runtime findings

Inspected 2026-10-12. Scope: read-only inspection of `reference-runtime.js` and `desktop/final.html`; the downloaded JavaScript was not executed. These are **static findings**, not measurements of a played animation. Compare with the REA desktop/mobile captures before treating appearance or total elapsed time as observed.

Runtime SHA-256: `6ad2c0d7ab90feeebfc79568a85614242ce8d481cd563efbcd7259fec2a3fa17`.

Locations below are **zero-based character offsets after Python universal-newline decoding**, with searchable function/class names. This avoids ambiguous references to the bundle's very long minified lines. The captured HTML loads this custom runtime from `https://lando.itsoffbrand.io/dev-js/lando-by-OFF+BRAND.05.js`, alongside Webflow scripts.

## Splash and initial entry

The splash is a Rive canvas, sharing its implementation with route transitions. `BL()` at **1200986** loads `page-transition.riv`, artboard/state-machine `page-transition`, with cover/center fitting. It requires boolean inputs `initial`, `transition-out`, `transition-in`. Initially those are true/false/false; the solid wrapper background becomes transparent after Rive initializes.

Exact startup sequence:

1. `c_()` at **1322157** waits for transition Rive initialization.
2. It then waits concurrently for WebGL DOM/assets and the other Rive files.
3. Taxi and Lenis initialize; the initial renderer calls `mL()` at **1301120**, which also waits for `document.readyState === complete`.
4. Initial page setup schedules navigation/theme setup after **500 ms**, hero text/Rive playback after **750 ms**, and `H$()` after **1000 ms**.
5. `H$()` at **1202217** flips to the `transition-in` Rive state. It starts fading the optional “Load Norris” button after **100 ms** (CSS opacity duration **300 ms**); it hides the transition wrapper and disables its pointer events after **500 ms**.

Therefore **1500 ms after initial setup** is the source-scheduled overlay removal, conditional on setup being reached. It is **not** a measured or guaranteed 1.5-second total page load. Network, decoder, Rive and WebGL initialization happen first. The actual shape and easing of the Rive wipe live inside the `.riv` file and cannot be derived from this wrapper JavaScript.

The HTML at approximately **79578** confirms the settled wrapper is hidden with pointer events disabled, and its canvas is 1440 × 900 in the captured desktop DOM. The optional button label is “Load Norris”; no click handler for `.transition-btn` was found in this runtime. Do not assume the user must click it to enter.

Important precision: `headScene.REVEAL_DURATION: 1.1` exists in settings, but appears **only once** in this bundle. `window.landoGL.reveal` initializes to **1**. Neither establishes an executed 1.1-second portrait reveal.

## Loading failure behavior

**Source-confirmed risk, runtime outcome still requires correlation:** WebGL texture/model/HDR/font loaders at **1188253** create promises with only a resolve callback. Their error callbacks log errors without resolving or rejecting. A failed asset can therefore leave the awaited asset batch pending. The final call to `c_()` has no visible catch or watchdog; transition-Rive loading failures reject without an application-level recovery path here. Either mechanism can plausibly strand the loading overlay.

The general Rive preload behaves differently: `kI()` / `mR()` around **246495** decrement the remaining count on both success and failure and dispatch completion once the count reaches zero. Hero playback retries the global ready flag every 500 ms for up to 10 seconds, but a per-canvas instance retry has no visible terminal timeout.

WebGL2 absence has an explicit `gl-fallback` class path and skips WebGL setup. The visual quality of that fallback was not established by these reads.

**Adaptation:** preload the supplied hero image and fonts with settled/error handling, guarantee release of the overlay, and keep the portfolio readable if an optional effect fails. A percentage indicator should represent real progress if used; this source does not establish one.

## Portrait and background mechanics

`W9` at **841848** creates a **1 × 1 plane subdivided 128 × 128**, displaced by the portrait depth texture with displacement scale **0.25**. It combines diffuse, alpha, normal, roughness and alternate shadow textures. This is a depth-displaced portrait plane, not evidence of a full scanned head model.

Pointer rotation uses normalized coordinates with movement intensity **0.075** and damp factor **0.025**. Y-axis rotation follows horizontal pointer position. X-axis rotation follows vertical pointer position only above **768 px**, and fades with hero scroll progress. The camera also moves horizontally by normalized X × **0.02**; its vertical movement has the same >768 px gate. See the end of `W9.update()` around **845530**, and `O9.update()` around **891200**.

The hero combines this portrait with an actual helmet model, a fluid cursor texture, noise-generated contour layers, and texture/shadow switching. Background settings around **1197488** include cream `#F8F8F3`, contour `#CBCBB9`, lime `#D2FF00`, time speed **0.1**, noise detail **3**, cursor scale **3**, intensity **0.15**. Those are exact settings; their final visual appearance depends on shaders and compositing.

Hovering the helmet target animates its reveal uniform for **1.5 s**, `expo.inOut`; leave uses **1 s**, `expo.inOut`. Color-target hover uses **0.5 s**, `power4.inOut`. These concern reference-specific helmet effects; recreating the feel with Ilyass's portrait can use a cutout plus restrained layered movement without requiring its helmet assets.

## Main scroll choreography

| Region | Static source behavior | Source location |
|---|---|---|
| First viewport into introduction | Over one viewport of scroll, camera Z moves 0 → −1, image filter 0 → 1, rendered bounds shrink from viewport dimensions to the DOM `.marquee-gl-target` dimensions. Uses scrub and `power1.inOut`. | `O9.transition()`, **887849** |
| Hero interaction cutoff | At roughly viewport-height / 2.25 of scroll, cursor intensity and helmet wireframe opacity fade to zero over 0.25 s; reverse on scrolling back. | same function |
| Hero eyebrow/text | Scrubbed character rise from 100%, 0.02 stagger, and images from opacity 0 / Y 1rem. Companion mobile text moves upward and its ellipse closes. | `Z_()`, **1264236** |
| Horizontal gallery | Desktop only. Track moves left by track-width minus viewport-width, from section top meeting viewport bottom through section bottom meeting viewport bottom; `scrub: 1`. Images add up to 4rem horizontal drift using container animation. | `I_()`, **1234724**; gate `Z8()` |
| Two-column On/Off Track | Images approach from −20rem/+20rem; text from −5rem/+5rem as section enters. Images use `power2.out`; text linear scrub. | `H_()`, approximately **1265200** |
| Lower image | Moves −20vh and scales to 1.1 over entry-to-exit scroll. | `k$()`, after `H_()` |
| Helmet grid | Desktop-only four-column pattern starts columns at 0, 5, 10, 15rem and scrubs them to aligned Y. | `ZZ()`, **1239394** |
| Visor graphic | Ellipse mask grows from 70% × 0% to 70% × 100%, anchored top center, driven by scroll. | `q_()`, before **1266725** |
| Store images | Each image drifts upward by 4rem throughout section traversal. | `Y_()`, before **1266725** |
| Background | Per-section foreground/background color interpolation is scrubbed; captured DOM specifies dark-green → white at the horizontal section, then white/gray-green → white/white for partnerships. | `PL()`, before **1264236**, plus HTML attributes |
| Social/photo fan | Cards rise from Y 10rem in 0.8 s with 0.5 s total stagger, then spread/rotate over 1.2 s using `elastic.out(1, 0.75)` and center-out 0.2 s stagger; second phase overlaps by 0.4 s. | `q8()`, **1240001** |

Photo fan angles range −21° to +21°, sizes approximately 0.7756 to 1. Hover lifts the chosen card 2.5rem and scales it by 1.08; neighboring cards spread, with 0.5 s elastic transitions. At <=991 px the horizontal fan is compressed (outer positions ±15rem rather than ±30rem). These are the literal supplied layouts, not measurements from images.

## Text and decorative reveals

- **Oval text reveal:** `e0()` at **1220921** wraps lines in ellipse clips. Initial ellipse is 20% × 0%, final 100% × 120%, anchored at top or bottom. Duration **1.5 s**, `power2.inOut`, line stagger **0.15 s**; characters move from ±40%, stagger from center. Non-hero triggers fire once at **top 95%**.
- **Colored wipe:** `AE()` at **1222682** reveals each line through an inset clip over **0.6 s**, `power2.out`, then scales away a colored covering strip over **0.6 s**, `power2.inOut`, starting at +0.3 s. Lines stagger **0.15 s**; trigger once at **top 90%**. The parsed delay field is not visibly applied in this function.
- **Hover text:** `QE()` moves characters up one text height over **0.6 s**, `power3.out`, with **0.02 s** character stagger; menu text uses rem offsets rather than −100%.
- **Rive scroll:** `oR()` around **248250** maps normalized trigger progress to the Rive numeric input 0…1000, default trigger top-bottom through bottom-top, `scrub: 0.5`. It plays while active and pauses after leaving. This explains why some ornament changes are scroll-driven, while other Rive elements play once on entry.
- Screen-reader copies are explicitly created when splitting text; the animated duplicate is aria-hidden. A React adaptation should retain this readable text strategy.

## Navigation and route transitions

`kL()` at **1249009**:

- Menu panel opens from `ellipse(120% 0% at 50% 0%)` to `ellipse(120% 100% at 50% 20%)` over **0.8 s**, `power3.out`.
- Menu imagery starts at +0.15 s: 0.8 s duration, 0.06 s stagger, Y 25 → 0.
- Links start at +0.35 s: 0.6 s duration, 0.08 s stagger, `back.out(1.2)`, Y 20 → 0.
- Decorative Rive progress moves 0 → 1000 over **1.7 s**, starting +0.2 s; background reaches opacity **0.12** over 0.6 s, starting +0.6 s.
- Highlight strips and drawn SVG strokes have overlapping reveal tweens. The bundle also includes additional `.to()` calls with four arguments; those should not be assumed to define a separate valid closing timeline.
- Opening stops Lenis; reverse completion restarts it. Closing reverses at **1.5×** timeline speed. The hamburger updates `aria-expanded` and labels and supports Enter/Space. Escape handling and focus trapping were **not established** in this function.
- Pointer vertical position moves the two image columns in opposite directions up to approximately ±6rem, eased over **2 s** (`power2.out`).

Taxi's outgoing transition lasts **1000 ms** (`v$` near **1303917**). It closes navigation, starts the Rive `transition-out` state, then removes/cleans up old scenes. Incoming setup scrolls to the top, schedules Rive reveal after **500 ms**, and hides its wrapper another **500 ms** later. `allowInterruption` is false; old content is removed, with cache bypass false. This source timing does not identify the Rive-internal curve.

## Mobile-specific decisions and limits

- Main desktop gate is **992 px**. Horizontal gallery choreography, main oval/highlight/hover initialization, and grid offsets are skipped by homepage setup below it. Captured CSS additionally has **991 / 767 / 479 px** breakpoints. These are not a single universal breakpoint.
- At <=991 px WebGL chooses **KTX2** textures instead of WebP. Camera changes at **768 px**: portrait camera Z is **3** on larger widths and **3.75** on smaller widths; portrait Y changes 0 → −0.05.
- Mobile has a “swipe lock” switch (`$_()`, **1266725**) which stops Lenis and scrolls to top; it swaps its icon/text and exposes switch semantics. This deliberately makes the hero interactive while scroll is locked. It is a reference-specific interaction, not required for a portfolio.
- Mobile user agents in landscape receive a Rive landscape overlay (`aR`, **261873**); tablets/iPads are excluded from that UA branch. This was not exercised in the supplied static reads.
- `KD()` at **1813** reloads the page on crossing the 992 px boundary after **150 ms** resize debounce. Do not confuse that with responsive, state-preserving rearrangement.
- Lenis **1.1.20**, class `QV` at **1320374**, uses `lerp: 0.1`, smooth wheel, `touchMultiplier: 1.25`, `syncTouch: true`, document wrapper/body content on both desktop and mobile. It updates ScrollTrigger and runs through GSAP's ticker with lag smoothing disabled.
- GSAP core, ScrollTrigger, SplitText and MotionPathPlugin identify **3.13.0** in this shipped bundle. Three.js, Rive, Taxi, Lenis, and Webflow are present. This establishes deployed dependencies, not recommendations for today's versions.
- A bounded search found **no `prefers-reduced-motion` literal in this runtime**. That does not prove it is absent from every other script/stylesheet. The portfolio should explicitly honor reduced motion.

## Reconstruction guidance

The strongest recognizable motion language is: brief identity-led splash → curved reveal → portrait with restrained depth → scroll-driven scale change → oversized clipped typography → overlapping text/strip reveals → controlled image drift → expressive photo fan → curved fullscreen navigation. Exact Rive artwork is a separate asset; a custom SVG/GSAP monogram and curved clip reveal can reproduce the sequence with Ilyass's identity.

For two supplied photos, prioritize a clean hero composition and secondary portrait, original graphic project covers, and meaningful project/skill content from the CV. Keep desktop pinning and horizontal travel deliberate; make mobile sections vertical, preserve modest reveals and touch-friendly controls, and let all content appear immediately under reduced motion. These are **design choices for the portfolio**, not claims about the reference.
