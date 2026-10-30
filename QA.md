# Verification — 30 October 2026

## Automated checks

- `npm test`: 11 passing checks covering cabinet geometry and clearance, history, persistence, price consistency, image signatures, translation parity and multilingual search. Catalogue integrity now verifies 11 products, one configurable wardrobe and no Brume entry.
- `npm run build`: TypeScript and Vite production build.

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
