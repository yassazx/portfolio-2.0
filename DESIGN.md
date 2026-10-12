---
name: Ilyass Azyaiz Portfolio
description: Expressive portrait-led engineering portfolio in chalk, olive, and electric lime.
colors:
  lime: "#d2ff00"
  paper: "#f5f5ed"
  ink: "#292f22"
  muted: "#626954"
  line: "#d5d8c9"
typography:
  display:
    fontFamily: "Mona Sans Variable, sans-serif"
    fontSize: "clamp(85px,11.8vw,205px)"
    fontWeight: 850
    lineHeight: 1.05
    letterSpacing: "-.04em"
  display-serif:
    fontFamily: "Bodoni Moda Variable, Georgia, serif"
    fontSize: "1.08em"
    fontWeight: 600
  headline:
    fontFamily: "Mona Sans Variable, sans-serif"
    fontSize: "clamp(40px,5.4vw,84px)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-.035em"
  title:
    fontFamily: "Mona Sans Variable, sans-serif"
    fontSize: "clamp(34px,4.3vw,68px)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-.035em"
  body:
    fontFamily: "Mona Sans Variable, sans-serif"
    fontSize: "15px"
    lineHeight: 1.65
  label:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "13px"
    fontWeight: 600
  button:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    lineHeight: 1.1
rounded:
  control: "7px"
  button: "8px"
  menu-toggle: "9px"
  contact: "26px"
spacing:
  compact: "8px"
  control: "12px"
  inset: "16px"
  gap: "20px"
  group: "40px"
components:
  button-primary:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "12px 21px"
  button-portrait:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 15px"
  button-menu:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.menu-toggle}"
    width: "52px"
    height: "51px"
  navigation:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
  project-details:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "30px 40px"
  contact-surface:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.contact}"
    padding: "45px 4vw 24px"
---

# Design System: Ilyass Azyaiz Portfolio

## Overview

**Creative North Star: "The Engineer in Motion"**

An expressive, portrait-led identity translates the user's landonorris.com reference into an engineering portfolio. Oversized mixed sans and serif typography, quiet contour lines, and electric lime accents give the work a confident editorial presence. This descriptive name records the implemented direction; it is not an additional user-selected concept.

The surfaces are flat, spacious, and graphic. Aligned casual and professional portraits create the signature interaction, while clipped reveals and scroll choreography connect sections. Native touch scrolling and a complete reduced-motion presentation are part of the system.

**Key Characteristics:**

- Chalk and olive surfaces with electric lime emphasis.
- Oversized sans and serif headlines paired with condensed utility labels.
- Aligned portrait transformation, contour lines, and the IA monogram.
- Flat tonal depth, curved transitions, and restrained control rounding.
- Responsive choreography with a stacked reduced-motion alternative.

Evidence: `src/styles.css` and `src/App.jsx`; durable context: `PRODUCT.md`. This document records source evidence, not a fresh browser audit. The token frontmatter is normative; `.impeccable/design.json` holds extensions and preview snippets. Screen composition belongs to `.impeccable/surface-brief.md`.

## Colors

Electric lime punctuates a warm chalk and olive palette. The frontmatter records the five root color properties using their source names.

### Primary

- **Electric Lime — lime:** primary actions, splash and menu surfaces, dark-section emphasis, diagram accents, and the footer surround. Large lime surfaces are an established part of this identity.

### Neutral

- **Chalk Paper — paper:** light page surfaces, control backgrounds, and text on dark sections.
- **Deep Olive — ink:** primary text, dark sections, project diagrams, and contact panel.
- **Olive Gray — muted:** supporting credential dates and text on paper.
- **Pale Olive Rule — line:** credential and language dividers.

Project chapter backgrounds use the observed pale olive sequence (`#e9eddf`, `#dde5d5`, `#d6dfcb`). The software diagram uses warm stone (`#efece2`). Supporting diagram strokes and subdued dark-surface text are local treatments, not additional global color roles.

**The Surface Pairing Rule.** Use ink text on paper or lime, and paper text on ink; lime carries emphasis on dark sections.

## Typography

**Display Font:** Mona Sans Variable, sans-serif, mixed with Bodoni Moda Variable, Georgia, serif.

**Body Font:** Mona Sans Variable, sans-serif.

**Label/Mono Font:** Barlow Condensed, sans-serif; system monospace appears only in architecture diagram code fragments.

**Character:** Heavy, tightly tracked sans lettering carries structure. High-contrast serif words supply expression, with condensed labels keeping navigation and metadata compact. Serif emphasis is upright by default; the small about-section flourish is italic.

### Hierarchy

- **Display:** frontmatter display roles define the desktop name; the serif first name scales relative to the sans surname.
- **Headline:** section headings use the headline role; the manifesto grows to `clamp(40px,6.8vw,110px)` with a tighter overall composition.
- **Title:** project titles use the title role; credential titles use a smaller sans treatment (23px, weight 600).
- **Body:** project descriptions use the body role, generally constrained to 450px. Mobile descriptions reduce to 14px. About copy uses 15–19px; mobile about text is limited to 38ch.
- **Label:** condensed utility text appears at 11–17px depending on context; most action and metadata copy is uppercase. Diagram labels use `.04em` tracking.

**The Mixed Headline Rule.** Pair sans structure with selected serif words; preserve ordinary sans body text for sustained reading.

## Layout

The page uses full-width sections with viewport-relative gutters, usually 5–6vw. Desktop section starts have roughly 90–130px of vertical space. Project descriptions and credentials use two columns; skills use three. The about body uses three tracks with a decorative flourish in the first, then two tracks below 1000px.

The hero uses the small viewport height unit, with explicit minimum and maximum heights. On desktop its name overlaps the portrait at a higher stacking level with white `mix-blend-mode: difference` lettering. This is the actual implementation, superseding the earlier brief's description of the name sitting behind the image. At 600px and below the name moves above the face (top 103px), uses normal blending and ink, and the introduction sits below it. The mobile portrait anchors the lower 75% of the hero.

At 1000px and above, with no reduced-motion preference, the three project chapters form a pinned horizontal rail. Each chapter occupies one viewport width, and scroll progress moves the rail over its measured overflow distance. Below 1000px, projects stack vertically. At 600px and below, project copy, education, skills, contact actions, and about text reflow into a single column. The mobile menu omits its portrait and uses the full available width for links. Header controls remain at least 44px tall.

Additional observed adaptations: portrait width changes at 1600px; desktop windows at most 700px tall use shorter project visuals; landscape touch-size viewports at most 500px tall use a 650px hero and a wrapped menu. Reduced-motion mode stacks work at every width and disables smooth scrolling.

## Elevation & Depth

There are no box shadows. Depth comes from adjacent tonal planes, overlapping portrait and typography, thin strokes, and clipped surface reveals. Contour lines remain low-contrast decoration. The footer's paper-to-lime transition is a local gradient; most surfaces remain solid.

**The Flat Surface Rule.** Preserve tonal separation and clear typography instead of adding shadow-based card elevation.

## Shapes

Compact controls use modest rounded corners, while project diagrams and skill rows remain square and structural. A full-width shallow curve finishes the dark about section. The contact panel has larger rounded corners and a raised central tab carrying the monogram; its mobile radius is 20px. Elliptical masks expand downward for menu, alternate portrait, and project-detail reveals. Fine one-pixel rules divide metadata and credentials. The menu control alone uses a 1.5px outline.

## Components

### Buttons

Compact, confident condensed labels with clear contrast. Primary lime actions have a minimum height of 51px, reduced to 44px on mobile. Their arrows rotate on hover over .3s; duplicated labels roll vertically over .35s with `cubic-bezier(.16,1,.3,1)`. Paper controls support scrolling and the portrait switch. The global focus treatment is a 3px olive outline with 6px offset; dark sections use a lime outline. Disabled buttons use half opacity and a default cursor.

### Navigation

A fixed wordmark, centered monogram, contact action, and outlined menu toggle float over the sections. Text changes to paper when a dark section crosses the header. The full-screen lime menu reveals through an elliptical mask (.8s, `power4.inOut`); staggered links enter over .7s with `expo.out`. Link hover changes the typeface to serif and reveals its arrow. Escape closes the menu, focus stays within the open controls, and closing restores focus to the toggle. Background content becomes inert during the menu or splash.

### Portrait Switch

Aligned transparent portraits preserve position when changing from casual to professional. A morphing organic spline reveals the alternate on hover, expands in 1.2s with `expo.inOut`, and contracts over .8s on leave. The visible pressed-state button expands the reveal across the complete photo for keyboard and touch. After the opening reveal and a short rest, an idle blob sweeps across the viewport in alternating directions (4.8s per pass, `sine.inOut`). A stationary cursor yields to idle motion; pointer movement takes over again.

Background contours are smooth isolines of a slowly evolving, warped scalar field. Separate islands and open meanders move more visibly than the original nested rings, with geometry updates capped at 30Hz. Ambient motion suspends behind the menu, offscreen, and in a hidden tab; the portrait sweep also pauses during the signature transition.

The hero occupies a 220svh scroll section with a sticky viewport. Scroll directly darkens the scene, shrinks the same portrait into a muted rectangular frame, moves two oversized text rows behind it, and draws a lime decorative signature across the portrait. The whole composition reverses with scroll; entrance transforms live on a separate element. Reduced motion presents the signature as a static following section and disables ambient morphing.

The large hero name is visually hidden at desktop widths of 1000px and above, and remains part of the accessible heading. It stays visible on mobile. The footer places the user-supplied LinkedIn link below the email.

### Project Chapters and Detail Panels

Full-width pale olive chapters contain bespoke pipeline, data, or application diagrams. These are explanatory illustrations, not product screenshots. Two-column titles and descriptions follow each visual on desktop. A thin-rule detail button changes plus to minus and reveals an ink panel over the illustration through an elliptical mask (.55s). Supporting technologies wrap as plain condensed text, without pill containers. The work rail uses linear motion with `.65` scrub smoothing; its progress indicator is a 3px rule.

Opening details focuses the labeled, scrollable region and brings it below the fixed header. Its height is capped at the viewport minus 120px; Escape closes it and restores the toggle. Desktop keyboard focus synchronizes the page scroll with the corresponding project and clears native horizontal container scrolling.

### Skill Rows and Credentials

Skills use lime symbols, large sans titles, subdued supporting text, and a top rule. The three desktop columns become individual icon-and-text rows on mobile. Education and certification entries use clear typographic hierarchy and restrained separators rather than raised cards.

### Splash and Section Reveals

The lime splash combines the IA monogram, condensed metadata, tabular progress, and a skip control. Image decode failures resolve, font readiness is awaited, and a 4.5s timeout starts completion if resources stall. Standard motion includes a 1.3s minimum display, followed by a curved upward exit. Reduced-motion mode shortens the sequence. Replay returns to the top and restarts it.

Headings enter once at the scroll threshold through paired line wipes (.4s) and reveals (.7s), staggered by .08s. Hero entrance uses 1.25–1.45s `expo.out` motion. Skills and contact surfaces enter over 1s. Reduced-motion mode skips these animations, collapses CSS transitions to .01ms, and retains all content and controls.

### Contact Surface

The large olive panel sits in a lime surround, with centered mixed-font invitation, direct email, copy action, CV download, large name, replay, and back-to-top links. Copy feedback is announced politely and clears after 2.5s. Email hover adds an underline. There are no form fields in the implemented interface.

## Do's and Don'ts

### Do:

- **Do** preserve the aligned portrait pair and provide its explicit keyboard and touch control.
- **Do** pair ink with paper or lime and use the condensed family for compact utility text.
- **Do** retain the mobile name above the face and stack projects below the desktop breakpoint.
- **Do** retain visible focus, native touch scrolling, and the complete reduced-motion layout.
- **Do** identify project diagrams as illustrations and keep claims grounded in the supplied CV.

### Don't:

- **Don't** add shadow-based elevation to the flat project and skill surfaces.
- **Don't** make portrait switching or navigation depend exclusively on hover.
- **Don't** apply desktop difference blending to the mobile hero name.
- **Don't** require pinned horizontal scrolling in reduced-motion mode.
