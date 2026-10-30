# Verification — 30 October 2026

## Automated checks

- `npm test`: 13 passing checks covering cabinet geometry and clearance, history, persistence, price consistency, image signatures, translation parity and multilingual search. Catalogue integrity now verifies 12 products, one configurable wardrobe and no Brume entry.
- `npm run build`: TypeScript and Vite production build.

## Latest changes

- Four product columns on desktop, three on intermediate widths and two on mobile. Square product photographs fill the entire tile; portrait chair framing keeps the furniture visible.
- Price inputs use an internal keyboard-focus underline instead of an external outline; filtering with €500–€1,300 yields the expected five items.
- New Aube upholstered bed uses a verified isolated IKEA product photo; its room photo shows the same bed design.
- Inspiration index links to three real room routes. Each room has two bundled ready-made interior photos, translated styling text, a palette and four valid product links.
- Two additional automated tests check room photograph signatures, product references and language-key parity.

## Browser checks for this revision

Tested in the in-app browser at its default 1280 × 720 viewport and a temporary 390 × 844 mobile viewport.

- Light-grey page, photograph and 3D backgrounds; locally hosted Poppins type; enlarged product materials, dimensions and prices.
- One main image on ordinary product pages, no duplicated zoom image or redundant thumbnail strip. Atelier retains one live 3D view and access to its studio.
- Brume removed from catalogue, related products, search and persisted cart/favourites hydration.
- Custom material and finish menus: pointer selection, keyboard arrows, Home/End, Enter, Escape, outside dismissal and selection checkmark. Mouse focus has no external outline; keyboard focus keeps an internal underline.
- Material/finish/price filtering combined with ascending price sort; reset restores the full catalogue.
- Studio view selection through the same shared combobox.
- French and English mobile labels, mobile options wrapping and absence of horizontal overflow.
- Product photo count and thumbnail absence inspected directly in the rendered page.

This is viewport testing in a desktop browser, not physical-device or cross-browser certification. Commerce and quote submission remain simulated.

Screenshots are saved in `artifacts/`.

Latest browser checks cover the inspiration index, bedroom-to-product navigation, in-page product anchors, living room and workspace at 390 × 844, French/Dutch copy, image loading, and absence of horizontal overflow.
