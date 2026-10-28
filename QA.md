# Verification — 28 October 2026

## Automated checks

- `npm run build`: TypeScript validation and Vite production bundling.
- `npm test`: 11 passing tests. Covers physical panel/compartment bounds at supported dimensional extremes; shelf/drawer/rail clearance across layouts; independent presets; narrow-cabinet section limits; immutable undo/redo; versioned save validation; component/material pricing; advertised and cart wardrobe price consistency; 12 distinct products and valid local JPEG/PNG assets; multilingual accent-insensitive search; and FR/NL/EN translation parity.
- Dependency installation audit reports zero vulnerabilities.
- All 12 catalogue image elements were inspected in the browser: complete, with nonzero natural width. Wardrobe PNGs were exported from the live WebGL canvas through the application's export preview; the obsolete screenshot assets were removed.

## Browser checks for this revision

Inspected in the in-app desktop browser at its default 1280 × 720 viewport and a temporary 390 × 844 mobile viewport.

- Catalogue product photography, readable names/prices and image loading.
- Wardrobe product gallery: perspective/front/detail controls, live material change and matching price; walnut item addition and matching cart total.
- Dimensions: numeric editing to the 80 cm minimum automatically reduces three sections to two and disables further section additions.
- Independent section selection and drawer count changes.
- Layout presets, undo/redo, save/restore and reset.
- Independent cabinet/door colours, hinged-door enablement and animated opening/closing.
- Clean PNG export preview and saved image content.
- Quote form configuration summary and simulated success using dummy example.com contact data; no email is sent.
- French, Dutch and English translated studio controls.
- Mobile sticky stage and section tabs, readable controls, absence of horizontal overflow.
- Fresh production build inspection and published-site handoff complete the release checks.

This is viewport testing in a desktop browser, not physical-device or cross-browser certification. Payments, orders and quote delivery remain simulated. The 3D preview requires WebGL.

Screenshots are saved in `artifacts/`.
