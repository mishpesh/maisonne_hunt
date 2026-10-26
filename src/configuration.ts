export type Wood = "oak" | "walnut" | "ash";
export type DoorColor = "natural" | "cream" | "sage" | "charcoal";
export type Configuration = {
  width: number;
  height: number;
  depth: number;
  sections: number;
  shelves: number;
  wood: Wood;
  cabinetColor: DoorColor;
  doorColor: DoorColor;
  doors: boolean;
  open: boolean;
};
export const initialConfiguration: Configuration = {
  width: 180,
  height: 220,
  depth: 60,
  sections: 3,
  shelves: 3,
  wood: "oak",
  cabinetColor: "natural",
  doorColor: "natural",
  doors: false,
  open: false,
};
export const woodFinishes = {
  oak: { color: "#b49264", key: "woodOak" },
  walnut: { color: "#70513b", key: "woodWalnut" },
  ash: { color: "#ddd0b4", key: "woodAsh" },
} as const;
export const doorColors = {
  natural: { color: "#b49264", key: "natural" },
  cream: { color: "#e8e1d1", key: "cream" },
  sage: { color: "#9aa18c", key: "sage" },
  charcoal: { color: "#414443", key: "charcoal" },
} as const;
export function configurationPrice(c: Configuration) {
  const area =
    (c.width * c.height + 2 * c.depth * c.height + 2 * c.width * c.depth) /
    10000;
  const woodMultiplier = { oak: 1, walnut: 1.28, ash: 1.08 }[c.wood];
  return (
    Math.round(
      ((area * 88 +
        (c.cabinetColor !== "natural" ? area * 10 : 0) +
        c.sections * 85 +
        c.shelves * c.sections * 18 +
        (c.doors ? ((c.width * c.height) / 10000) * 95 : 0)) *
        woodMultiplier) /
        10,
    ) * 10
  );
}
/** Centimetres become metres; all panels share an exact interior boundary. */
export function wardrobeGeometry(c: Configuration) {
  const w = c.width / 100,
    h = c.height / 100,
    d = c.depth / 100,
    t = 0.022,
    base = 0.09;
  const innerW = w - 2 * t;
  const sectionW = (innerW - (c.sections - 1) * t) / c.sections;
  const innerH = h - base - 2 * t;
  return { w, h, d, t, base, innerW, sectionW, innerH };
}
