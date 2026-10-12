# Portfolio reference: landonorris.com

Inspected on 2026-10-12 using REA controlled browser scenarios and a web text read.

## Observed

- Desktop viewport: 1280 x 720. Lime loading screen with a centered monogram, followed by a large centered portrait, helmet geometry, pale contour background, corner wordmark, and top-right controls.
- DOM identifies Webflow. Network responses include Brier Bold and Mona Sans fonts, custom OFF+BRAND JavaScript, Rive WASM and animation files, GLB helmet/track models, portrait alpha/diffuse/normal/depth/shadow textures, and HDR lighting resources.
- Homepage text includes a personal introduction, photo gallery, On Track / Off Track links, helmet showcase, store, partnerships, social links, and contact details.

## Evidence

- DOM, screenshot, and network capture: `ev_e7699364e8f154e49471be1c608fb4280e41ad3dd599ef637fcd640060ee9f76`.
- Loaded desktop viewport screenshot and DOM: `ev_d8e8095faff3f0a48a755d675efca6bf5c97bf50e41fe8ac5a26c63970a1beac`.
- Public page: https://landonorris.com/

## Suggested adaptation (design choices, not observations)

1. Hero: own name, role, main portrait, custom contour graphics, and contact action.
2. About: secondary image and short biography.
3. Selected work: project screenshots, short outcomes, role, and links.
4. Experiments or interests: optional replacement for the helmet showcase.
5. Contact: email and relevant social profiles.

Two photos support an initial hero and About section. A cutout portrait supports layered movement; a depth map can support a depth-based approximation. Actual 3D rotation requires suitable geometry and textures. Additional project screenshots supply meaningful portfolio content.

## Limits

The initial viewport inspection was extended to full desktop and mobile homepage traversals, mobile menu and lock controls, touch swipes, helmet reveals, and true mobile landscape emulation. See [desktop findings](research/desktop-reference.md), [mobile findings](research/mobile-reference.md), and [static animation analysis](research/motion-source.md). Linked routes and physical-device performance remain outside this pass. This is not a complete source reconstruction. REA's supported browser scenario provider launched and cleaned up its own browser successfully.
