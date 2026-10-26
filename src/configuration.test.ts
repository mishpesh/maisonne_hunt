import { describe, expect, it } from "vitest";
import {
  configurationPrice,
  initialConfiguration,
  wardrobeGeometry,
} from "./configuration";
import { categories, products, matchesProduct, unitPrice } from "./data";
import { translations } from "./i18n";
describe("parametric wardrobe invariants", () => {
  it("keeps compartments positive and fits them exactly within the cabinet at all supported extremes", () => {
    for (const width of [80, 180, 300])
      for (const height of [140, 220, 280])
        for (const depth of [35, 60, 80])
          for (const sections of [1, 3, 5])
            for (const shelves of [0, 3, 6]) {
              const g = wardrobeGeometry({
                ...initialConfiguration,
                width,
                height,
                depth,
                sections,
                shelves,
              });
              expect(g.sectionW).toBeGreaterThan(0.1);
              expect(g.innerH).toBeGreaterThan(1);
              expect(g.d - 0.025).toBeGreaterThan(0);
              expect(g.sectionW * sections + (sections - 1) * g.t).toBeCloseTo(
                g.innerW,
                8,
              );
              // The shelf clearance must stay larger than panel thickness even at the tightest setting.
              expect(g.innerH / (shelves + 1) - g.t).toBeGreaterThan(0.15);
              expect(g.base + g.t + g.innerH + g.t).toBeCloseTo(g.h, 8);
            }
  });
  it("starts at the advertised product price", () =>
    expect(configurationPrice(initialConfiguration)).toBe(
      products.find((p) => p.id === "atelier")!.price,
    ));
  it("prices added materials and increased dimensions consistently", () => {
    const base = configurationPrice(initialConfiguration);
    for (const extra of [
      { width: 240 },
      { height: 260 },
      { depth: 80 },
      { shelves: 5 },
      { sections: 5 },
      { doors: true },
      { wood: "walnut" as const },
      { cabinetColor: "sage" as const },
    ])
      expect(
        configurationPrice({ ...initialConfiguration, ...extra }),
      ).toBeGreaterThan(base);
    expect(configurationPrice({ ...initialConfiguration, open: true })).toBe(
      base,
    );
  });
  it("never produces invalid prices for supported extreme configurations", () => {
    for (const wood of ["oak", "walnut", "ash"] as const)
      for (const doors of [true, false])
        for (const width of [80, 300]) {
          const price = configurationPrice({
            ...initialConfiguration,
            wood,
            doors,
            width,
          });
          expect(Number.isFinite(price)).toBe(true);
          expect(price).toBeGreaterThan(0);
          expect(price % 10).toBe(0);
        }
  });
});
describe("catalogue and locale integrity", () => {
  it("has twelve unique products and two per category, with complete options", () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(12);
    for (const c of categories)
      expect(products.filter((p) => p.category === c.id)).toHaveLength(2);
    for (const p of products) {
      expect(p.colors.length).toBe(p.finishNames.length);
      expect(p.dimensions.every((d) => d > 0)).toBe(true);
      for (const locale of ["fr", "nl", "en"] as const) {
        expect(p.name[locale].length).toBeGreaterThan(3);
        expect(p.description[locale].length).toBeGreaterThan(10);
      }
    }
  });
  it("provides all interface copy in French, Dutch and English", () => {
    for (const locale of ["nl", "en"] as const) {
      expect(Object.keys(translations[locale]).sort()).toEqual(
        Object.keys(translations.fr).sort(),
      );
      expect(
        Object.values(translations[locale]).every(
          (value) => value.trim().length > 0,
        ),
      ).toBe(true);
    }
  });
});

describe("shopping consistency", () => {
  it("finds products without accents and across all three languages", () => {
    expect(
      products.filter((p) => matchesProduct(p, "elo")).map((p) => p.id),
    ).toContain("elo");
    expect(
      products.filter((p) => matchesProduct(p, "wardrobe")).map((p) => p.id),
    ).toEqual(["atelier", "brume"]);
    expect(
      products.filter((p) => matchesProduct(p, "kleerkast")).map((p) => p.id),
    ).toEqual(["atelier", "brume"]);
    expect(products.some((p) => matchesProduct(p, "zzzz-unavailable"))).toBe(
      false,
    );
  });
  it("uses the same finish estimate for the wardrobe product and cart", () => {
    const p = products.find((p) => p.id === "atelier")!;
    expect(unitPrice(p, 1)).toBe(
      configurationPrice({ ...initialConfiguration, wood: "walnut" }),
    );
    expect(unitPrice(p, 2)).toBe(
      configurationPrice({ ...initialConfiguration, wood: "ash" }),
    );
  });
});
