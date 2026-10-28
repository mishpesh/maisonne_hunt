export type Wood = "oak" | "walnut" | "ash";
export type DoorColor = "natural" | "cream" | "sage" | "charcoal";
export type BayMode = "shelves" | "hanging" | "drawers" | "mixed";
export type BayConfiguration = {
  mode: BayMode;
  shelves: number;
  drawers: number;
};
export type HandleStyle = "bar" | "knob" | "none";
export type Configuration = {
  width: number;
  height: number;
  depth: number;
  sections: number;
  bays: BayConfiguration[];
  wood: Wood;
  cabinetColor: DoorColor;
  doorColor: DoorColor;
  doors: boolean;
  open: boolean;
  backPanel: boolean;
  handles: HandleStyle;
};
export const bayDefaults: Record<BayMode, BayConfiguration> = {
  shelves: { mode: "shelves", shelves: 4, drawers: 0 },
  hanging: { mode: "hanging", shelves: 1, drawers: 0 },
  drawers: { mode: "drawers", shelves: 1, drawers: 3 },
  mixed: { mode: "mixed", shelves: 3, drawers: 2 },
};
export const initialConfiguration: Configuration = {
  width: 180,
  height: 220,
  depth: 60,
  sections: 3,
  bays: [
    { ...bayDefaults.hanging },
    { ...bayDefaults.mixed },
    { ...bayDefaults.shelves },
  ],
  wood: "oak",
  cabinetColor: "natural",
  doorColor: "natural",
  doors: false,
  open: false,
  backPanel: true,
  handles: "bar",
};
export const woodFinishes = {
  oak: { color: "#cdb58e", key: "woodOak" },
  walnut: { color: "#76573f", key: "woodWalnut" },
  ash: { color: "#e5d8c1", key: "woodAsh" },
} as const;
export const doorColors = {
  natural: { color: "#cdb58e", key: "natural" },
  cream: { color: "#e9e5da", key: "cream" },
  sage: { color: "#9da58e", key: "sage" },
  charcoal: { color: "#343b3b", key: "charcoal" },
} as const;
export const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
export const maxSections = (width: number) =>
  Math.min(5, Math.max(1, Math.floor((width - 5) / 30)));
export function normaliseConfiguration(c: Configuration): Configuration {
  const width = clamp(Math.round(Number(c.width) || 180), 80, 300),
    height = clamp(Math.round(Number(c.height) || 220), 140, 280),
    depth = clamp(Math.round(Number(c.depth) || 60), 35, 80);
  const sections = clamp(
    Math.round(Number(c.sections) || 3),
    1,
    maxSections(width),
  );
  const bays = Array.from({ length: sections }, (_, i) => {
    const b = c.bays?.[i] || bayDefaults.shelves;
    const mode = b.mode in bayDefaults ? b.mode : "shelves";
    return {
      mode,
      shelves: clamp(
        Math.round(Number(b.shelves) || 0),
        0,
        mode === "hanging" ? 2 : 6,
      ),
      drawers:
        mode === "drawers" || mode === "mixed"
          ? clamp(Math.round(Number(b.drawers) || 0), 0, 3)
          : 0,
    };
  });
  return {
    ...c,
    width,
    height,
    depth,
    sections,
    bays,
    wood: c.wood in woodFinishes ? c.wood : "oak",
    cabinetColor: c.cabinetColor in doorColors ? c.cabinetColor : "natural",
    doorColor: c.doorColor in doorColors ? c.doorColor : "natural",
    handles: ["bar", "knob", "none"].includes(c.handles) ? c.handles : "bar",
    doors: !!c.doors,
    open: !!c.open,
    backPanel: c.backPanel !== false,
  };
}
export function bayAt(c: Configuration, index: number): BayConfiguration {
  return c.bays[index] || { ...bayDefaults.shelves };
}
export function configurationCounts(c: Configuration) {
  return Array.from({ length: c.sections }, (_, i) => bayAt(c, i)).reduce(
    (a, b) => ({
      shelves: a.shelves + b.shelves,
      drawers: a.drawers + b.drawers,
      rails: a.rails + (b.mode === "hanging" ? 1 : 0),
    }),
    { shelves: 0, drawers: 0, rails: 0 },
  );
}
export function configurationPrice(c: Configuration) {
  const area =
    (c.width * c.height + 2 * c.depth * c.height + 2 * c.width * c.depth) /
    10000;
  const counts = configurationCounts(c),
    woodMultiplier = { oak: 1, walnut: 1.28, ash: 1.08 }[c.wood];
  return (
    Math.round(
      ((area * 88 +
        c.sections * 85 +
        counts.shelves * 18 +
        counts.drawers * 64 +
        counts.rails * 24 +
        (c.cabinetColor !== "natural" ? area * 10 : 0) +
        (c.doors ? ((c.width * c.height) / 10000) * 95 : 0) -
        (c.backPanel ? 0 : ((c.width * c.height) / 10000) * 20)) *
        woodMultiplier) /
        10,
    ) * 10
  );
}
/** Shared metre-based boundaries keep all panels, drawer stacks and shelves inside their compartment. */
export function wardrobeGeometry(c: Configuration) {
  const w = c.width / 100,
    h = c.height / 100,
    d = c.depth / 100,
    t = 0.022,
    base = 0.085,
    innerW = w - 2 * t,
    sectionW = (innerW - (c.sections - 1) * t) / c.sections,
    innerH = h - base - 2 * t;
  return { w, h, d, t, base, innerW, sectionW, innerH };
}
export function bayGeometry(c: Configuration, index: number) {
  const g = wardrobeGeometry(c),
    b = bayAt(c, index);
  const drawerHeight = Math.min(0.19, g.innerH / (b.drawers + 4)),
    drawerTop = g.base + g.t + b.drawers * drawerHeight;
  const available = g.h - g.t - drawerTop;
  const shelves =
    b.mode === "hanging"
      ? Array.from(
          { length: Math.min(2, b.shelves) },
          (_, i) => g.h - g.t - 0.27 * (i + 1),
        )
      : Array.from(
          { length: b.shelves },
          (_, i) => drawerTop + ((i + 1) * available) / (b.shelves + 1),
        );
  const railY = (shelves.length ? Math.min(...shelves) : g.h - g.t) - 0.13;
  return {
    ...g,
    bay: b,
    centerX: -g.w / 2 + g.t + g.sectionW / 2 + index * (g.sectionW + g.t),
    drawerHeight,
    drawerTop,
    shelves,
    railY,
  };
}
export function presetConfiguration(
  preset: "dressing" | "library" | "mixed",
  current: Configuration = initialConfiguration,
): Configuration {
  const bays = Array.from({ length: current.sections }, (_, i) => ({
    ...bayDefaults[
      preset === "library"
        ? "shelves"
        : preset === "dressing"
          ? i % 2 === 0
            ? "hanging"
            : "drawers"
          : i % 3 === 0
            ? "hanging"
            : i % 3 === 1
              ? "mixed"
              : "shelves"
    ],
  }));
  return { ...current, bays };
}
export function parseSavedConfiguration(raw: string): Configuration | null {
  try {
    const parsed = JSON.parse(raw);
    if (
      parsed.version !== 2 ||
      !parsed.configuration ||
      !Array.isArray(parsed.configuration.bays)
    )
      return null;
    return normaliseConfiguration({
      ...initialConfiguration,
      ...parsed.configuration,
    });
  } catch {
    return null;
  }
}
