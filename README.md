# MAISONNE

A complete furniture retail sales demo for Belgium, built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, React Three Fiber, Drei, Three.js and Lucide.

## Run locally

Requires Node.js 22.12+ and npm.

```sh
npm install
npm run dev
```

Open the Local URL printed by Vite (normally http://localhost:5173).

```sh
npm run build     # TypeScript validation and optimised production build
npm run preview   # Serve the production build, normally on port 4173
npm test          # Geometry, price, catalogue, search and translation checks
```

No environment variables, API keys or backend are required. Production hosting should serve `dist/` and rewrite application routes to `index.html`.

## Explore the demo

- `/` — editorial homepage, six furniture categories, bestsellers and 3D studio preview.
- `/collection` — twelve products, category filters, sorting and multilingual search. Supports `?category=sofas` and `?q=alba`.
- `/product/atelier` — customisable wardrobe with live 3D product preview. The selected wood finish carries into the configurator.
- `/atelier` — the parametric wardrobe studio. Try resizing the cabinet, changing individual sections between shelves, hanging rails, drawers and combined storage; choosing wood finishes, independent cabinet and door colours, handles and a back panel; and opening the hinged doors. Drag to rotate, scroll/pinch to zoom, or use the preview buttons. Use three layout presets, undo/redo, save and restore a versioned project in this browser, or export a clean PNG preview. Reset restores the standard model.
- `/favourites` — saved product selection.
- `/story` and `/inspiration` — supporting editorial pages.

Switch between Belgian French (default), Belgian Dutch and English in the header. All catalogue content, controls, forms, notifications and scripted assistant responses are translated. Search recognises all three languages and ignores accents.

Add products in different finishes and quantities; the cart supports updates, removal, an estimated total and a simulated order summary. The floating assistant provides scripted delivery, returns, materials, product dimensions and customisation guidance.

## Architecture

- `src/pages/` — homepage, catalogue, product details and editorial pages.
- `src/components/` — shared navigation, footer, product cards, modal, cart, assistant and configurator.
- `src/components/WardrobePreview.tsx` — actual procedural Three.js model, generated wood textures, lights, shadows, hinged doors and camera controls.
- `src/configuration.ts` — typed per-section wardrobe state, shared panel/shelf/drawer geometry, presets, save validation and mock pricing.
- `src/useConfiguration.ts` — bounded, immutable undo/redo history.
- `src/studio.css` and `src/studio-i18n.ts` — responsive studio layout and translated controls.
- `src/data.ts` — local catalogue, image mapping, multilingual search and variant pricing.
- `src/i18n.ts` — complete, type-checked FR / NL / EN dictionaries and Belgian EUR formatting.
- `src/store.tsx` — shared language, favourites, cart and overlay state.
- `src/styles.css` — responsive design system using the supplied cream, black, blue and green palette with light geometric Jost typography.

The wardrobe uses centimetres in the UI and metres internally. Panel thickness, base, dividers and shelf boundaries share a single geometry calculation. The camera reframes when dimensions or viewport size change. The 3D code and page components are loaded in separate chunks; compact 3D previews render on demand.

## Demo boundaries

MAISONNE and the catalogue are fictional. All prices, delivery estimates, return conditions and quotes are illustrative. Payments, orders, newsletter subscriptions and quote submissions are simulated. Form values and assistant messages are held only in memory and are not sent to a server. Language, favourites, cart and explicitly saved studio projects are saved in the browser’s local storage. There is no live AI connection.

The 3D view requires a browser with WebGL and hardware acceleration; an explanatory fallback is included. Photography is bundled locally; Jost is loaded from Google Fonts, with local font fallbacks.

## Image sources

Product photographs now use isolated IKEA catalogue photos and two existing isolated chair photos, documented in [IMAGE_SOURCES.md](IMAGE_SOURCES.md). The original editorial JPG assets are sourced from Unsplash. The photo IDs below identify their original sources at `https://images.unsplash.com/<photo-id>`. Product names and specifications are fictional demo content, rather than claims about the photographed manufacturers.

| Asset | Photo ID |
| --- | --- |
| Hero | photo-1600210492486-724fe5c67fb0 |
| Sofa | photo-1555041469-a586c61ea9bc |
| Chair | photo-1567538096630-e0c55bd6374c |
| Desk | photo-1449247709967-d4461a6a6103 |
| Bed | photo-1505693416388-ac5ce068fe85 |
| Wall cabinet | photo-1595428774223-ef52624120d2 |
| Dining | photo-1617806118233-18e1de247200 |
| Milo chair | photo-1598300042247-d088f8ab3a91 |
| Interior | photo-1616486338812-3dadae4b4ace |
| Bedroom | photo-1616594039964-ae9021a400a0 |
| Wall storage | photo-1594026112284-02bb6f3352fe |

`catalog/atelier.png` and `catalog/brume.png` were captured from this application's real parametric model so the wardrobe catalogue imagery matches the interactive model.

## Sites hosting

The project is linked to Sites through `.openai/hosting.json`. It deploys the Vite `dist/` output as a static application. `public/_redirects` preserves direct navigation to catalogue, product and studio routes. The Sites source repository stores the complete editable project.
