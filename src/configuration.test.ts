import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  bayDefaults,
  bayGeometry,
  configurationCounts,
  configurationPrice,
  initialConfiguration,
  maxSections,
  normaliseConfiguration,
  parseSavedConfiguration,
  presetConfiguration,
  wardrobeGeometry,
} from "./configuration";
import { configurationReducer } from "./useConfiguration";
import {
  categories,
  imageUrl,
  matchesProduct,
  products,
  unitPrice,
} from "./data";
import { translations } from "./i18n";
import type { BayMode } from "./configuration";
describe("wardrobe geometry", () => {
  it("preserves exact panel boundaries and usable compartments at every dimensional extreme", () => {
    for (const width of [80, 180, 300])
      for (const height of [140, 220, 280])
        for (const depth of [35, 60, 80])
          for (const sections of [1, 3, 5]) {
            const c = normaliseConfiguration({
              ...initialConfiguration,
              width,
              height,
              depth,
              sections,
            });
            const g = wardrobeGeometry(c);
            expect(g.sectionW).toBeGreaterThan(0.29);
            expect(c.sections).toBeLessThanOrEqual(maxSections(width));
            expect(
              g.sectionW * c.sections + (c.sections - 1) * g.t,
            ).toBeCloseTo(g.innerW, 8);
            expect(g.base + 2 * g.t + g.innerH).toBeCloseTo(g.h, 8);
          }
  });
  it("keeps shelves above drawer stacks and inside the cabinet for all interior modes", () => {
    for (const mode of Object.keys(bayDefaults) as BayMode[])
      for (const height of [140, 220, 280])
        for (const drawers of [0, 1, 3])
          for (const shelves of [0, 2, 6]) {
            const c = normaliseConfiguration({
              ...initialConfiguration,
              height,
              bays: [{ ...bayDefaults[mode], shelves, drawers }],
            });
            const b = bayGeometry(c, 0);
            expect(b.drawerTop).toBeLessThan(b.h - b.t);
            for (const y of b.shelves) {
              expect(y - b.t / 2).toBeGreaterThan(b.drawerTop);
              expect(y + b.t / 2).toBeLessThan(b.h - b.t);
            }
            if (mode === "hanging") {
              expect(b.railY).toBeGreaterThan(b.base + b.t + 0.2);
              expect(b.bay.drawers).toBe(0);
            }
          }
  });
  it("maintains independent layouts and distributes presets across the selected number of sections", () => {
    const c = normaliseConfiguration({ ...initialConfiguration, sections: 5 });
    expect(c.bays).toHaveLength(5);
    const library = presetConfiguration("library", c);
    expect(library.bays.every((b) => b.mode === "shelves")).toBe(true);
    expect(configurationCounts(initialConfiguration)).toEqual({
      shelves: 8,
      drawers: 2,
      rails: 1,
    });
    expect(initialConfiguration.bays[0].mode).toBe("hanging");
    expect(initialConfiguration.bays[1].mode).toBe("mixed");
  });
  it("normalises narrow cabinets and malformed numeric input without invalid geometry", () => {
    const c = normaliseConfiguration({
      ...initialConfiguration,
      width: 80,
      sections: 5,
      height: 999,
      depth: -1,
    });
    expect(c.sections).toBe(2);
    expect(c.height).toBe(280);
    expect(c.depth).toBe(35);
  });
});
describe("project history and persistence", () => {
  it("undoes and redoes interior edits without mutating earlier layouts", () => {
    const initial = { past: [], present: initialConfiguration, future: [] };
    const next = configurationReducer(initial, {
      type: "change",
      configuration: {
        ...initialConfiguration,
        bays: initialConfiguration.bays.map((b, i) =>
          i === 0 ? { ...bayDefaults.drawers } : b,
        ),
      },
    });
    expect(initial.present.bays[0].mode).toBe("hanging");
    expect(next.present.bays[0].drawers).toBe(3);
    const undo = configurationReducer(next, { type: "undo" });
    expect(undo.present).toEqual(initialConfiguration);
    expect(configurationReducer(undo, { type: "redo" }).present).toEqual(
      next.present,
    );
    expect(
      configurationReducer(undo, {
        type: "change",
        configuration: { ...initialConfiguration, width: 220 },
      }).future,
    ).toHaveLength(0);
  });
  it("restores valid versioned projects and rejects incomplete files", () => {
    const raw = JSON.stringify({
      version: 2,
      configuration: initialConfiguration,
    });
    expect(parseSavedConfiguration(raw)).toEqual(initialConfiguration);
    expect(parseSavedConfiguration("{}")).toBeNull();
    expect(parseSavedConfiguration("broken")).toBeNull();
    expect(
      parseSavedConfiguration(
        JSON.stringify({ version: 1, configuration: initialConfiguration }),
      ),
    ).toBeNull();
  });
});
describe("pricing and catalogue integrity", () => {
  it("prices additional physical components and materials while camera state remains free", () => {
    const base = configurationPrice(initialConfiguration);
    for (const changes of [
      { width: 240 },
      { height: 260 },
      { depth: 80 },
      { doors: true },
      { wood: "walnut" as const },
      { cabinetColor: "sage" as const },
    ])
      expect(
        configurationPrice({ ...initialConfiguration, ...changes }),
      ).toBeGreaterThan(base);
    const drawers = {
      ...initialConfiguration,
      bays: initialConfiguration.bays.map((b, i) =>
        i === 0 ? { ...bayDefaults.drawers } : b,
      ),
    };
    expect(configurationPrice(drawers)).toBeGreaterThan(base);
    expect(configurationPrice({ ...initialConfiguration, open: true })).toBe(
      base,
    );
    expect(
      configurationPrice({ ...initialConfiguration, backPanel: false }),
    ).toBeLessThan(base);
  });
  it("uses the configured wardrobe price consistently in the catalogue and cart", () => {
    const p = products.find((p) => p.id === "atelier")!;
    expect(p.price).toBe(configurationPrice(initialConfiguration));
    expect(unitPrice(p, 1)).toBe(
      configurationPrice({ ...initialConfiguration, wood: "walnut" }),
    );
    expect(unitPrice(p, 2)).toBe(
      configurationPrice({ ...initialConfiguration, wood: "ash" }),
    );
  });
  it("keeps twelve distinct products with explicit product-only image paths", () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(12);
    expect(new Set(products.map((p) => p.image)).size).toBe(12);
    for (const c of categories)
      expect(products.filter((p) => p.category === c.id)).toHaveLength(2);
    for (const p of products) {
      expect(p.colors.length).toBe(p.finishNames.length);
      expect(imageUrl(p.image)).toMatch(
        new RegExp(`/images/catalog/${p.id}\\.(jpg|png)$`),
      );
      expect(p.image).not.toContain("hero");
      const bytes = readFileSync(`public${imageUrl(p.image)}`);
      expect(bytes.length).toBeGreaterThan(1000);
      expect(
        bytes.subarray(0, p.image.endsWith("png") ? 8 : 3).toString("hex"),
      ).toBe(p.image.endsWith("png") ? "89504e470d0a1a0a" : "ffd8ff");
      for (const locale of ["fr", "nl", "en"] as const) {
        expect(p.name[locale].length).toBeGreaterThan(3);
        expect(p.description[locale].length).toBeGreaterThan(10);
      }
    }
  });
  it("supports accent-insensitive search across every language", () => {
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
  it("provides all new configurator and storefront copy in all three languages", () => {
    for (const locale of ["nl", "en"] as const) {
      expect(Object.keys(translations[locale]).sort()).toEqual(
        Object.keys(translations.fr).sort(),
      );
      expect(
        Object.values(translations[locale]).every((v) => v.trim().length > 0),
      ).toBe(true);
    }
  });
});
