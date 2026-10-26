# Verification — 26 October 2026

## Automated checks

- `npm run build`: passes TypeScript validation and Vite production bundling.
- `npm test`: 8 tests pass. Covers compartment geometry across 243 supported boundary combinations, panel clearances, advertised starting price, material/dimension pricing, catalogue integrity, translation parity, multilingual accent-insensitive search and wardrobe variant prices.
- `npm audit`: zero reported vulnerabilities after updating the test runner.
- All 13 bundled image assets were requested successfully through the local production server and checked for valid JPEG/PNG signatures.

## Browser checks

Tested the local application in the in-app browser at desktop and mobile viewport sizes (1280 × 720, 1280 × 900 and 390 × 844).

- Homepage, all category links, catalogue filters and ascending price sorting.
- Search suggestions, query navigation and no-result handling.
- Product navigation, finish selection, quantity controls and galleries.
- Favourites, cart addition, quantity changes, removal, reload persistence and simulated checkout.
- French, Dutch and English navigation, catalogue, controls, prices and assistant history.
- Scripted assistant delivery answers, product materials/dimensions and the studio link.
- Parametric wardrobe width, height, depth, sections and shelves, including extreme dimensions.
- Cabinet wood, independent cabinet and door colours, doors on/off, animated opening, rotation, zoom and reset.
- Selected product wood finish carries into the studio and produces the matching estimate.
- Quote form, required fields, configuration summary and demo confirmation.
- Mobile navigation, collapsible studio options, responsive form, and absence of horizontal overflow in the inspected views.
- Story and inspiration pages, their imagery and navigation.
- Simulated newsletter confirmation.
- Final production build refreshed and inspected after its last rebuild.

This is viewport testing in a desktop browser, not a physical-device or cross-browser certification.

Screenshots are saved in `artifacts/`.
