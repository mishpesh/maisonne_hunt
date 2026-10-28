import { lazy, Suspense, useCallback, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  DoorOpen,
  Download,
  FolderOpen,
  Maximize,
  Minus,
  Palette,
  PanelsTopLeft,
  Plus,
  Redo2,
  RotateCcw,
  Rows3,
  Ruler,
  Save,
  Shirt,
  SlidersHorizontal,
  Undo2,
} from "lucide-react";
import { useStore } from "../store";
import { money } from "../i18n";
import type { TranslationKey } from "../i18n";
import {
  bayAt,
  bayDefaults,
  clamp,
  configurationCounts,
  configurationPrice,
  doorColors,
  initialConfiguration,
  maxSections,
  parseSavedConfiguration,
  presetConfiguration,
  woodFinishes,
} from "../configuration";
import type {
  BayConfiguration,
  BayMode,
  Configuration,
  DoorColor,
  HandleStyle,
  Wood,
} from "../configuration";
import { useConfiguration } from "../useConfiguration";
import type { WardrobeView } from "./WardrobePreview";
import QuoteRequest from "./QuoteRequest";
import Modal from "./Modal";
import "../studio.css";
const WardrobePreview = lazy(() => import("./WardrobePreview"));
const savedKey = "maisonne-studio-v2";
function savedConfiguration() {
  try {
    const raw = localStorage.getItem(savedKey);
    return raw ? parseSavedConfiguration(raw) : null;
  } catch {
    return null;
  }
}
function Counter({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="studio-counter">
      <span>{label}</span>
      <div className="quantity">
        <button
          aria-label={`${label} −`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
        >
          <Minus size={16} />
        </button>
        <output aria-label={label}>{value}</output>
        <button
          aria-label={`${label} +`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
function DimensionField({
  name,
  value,
  min,
  max,
  onChange,
}: {
  name: "width" | "height" | "depth";
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  const { t } = useStore();
  const [draft, setDraft] = useState<string | null>(null);
  const commit = () => {
    if (draft !== null)
      onChange(clamp(Math.round(Number(draft) || value), min, max));
    setDraft(null);
  };
  return (
    <div className="studio-dimension">
      <label htmlFor={`studio-${name}`}>{t(name)}</label>
      <div className="dimension-number">
        <input
          id={`studio-${name}`}
          type="number"
          aria-label={`${t(name)} (cm)`}
          min={min}
          max={max}
          value={draft ?? value}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
        />
        <span>cm</span>
      </div>
      <input
        type="range"
        aria-label={`${t(name)} — ${t("studioDimensions")}`}
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => {
          setDraft(null);
          onChange(Number(e.target.value));
        }}
      />
      <div className="dimension-limits">
        <span>{min} cm</span>
        <span>{max} cm</span>
      </div>
    </div>
  );
}
function ColorControl({
  label,
  value,
  wood,
  onChange,
}: {
  label: "cabinetColor" | "doorColor";
  value: DoorColor;
  wood: Wood;
  onChange: (c: DoorColor) => void;
}) {
  const { t } = useStore();
  return (
    <fieldset className="studio-color-control">
      <legend>
        {t(label)}
        <span>{t(doorColors[value].key)}</span>
      </legend>
      <div className="studio-colors">
        {(Object.keys(doorColors) as DoorColor[]).map((color) => (
          <button
            key={color}
            className={`studio-color ${value === color ? "active" : ""}`}
            style={{
              background:
                color === "natural"
                  ? woodFinishes[wood].color
                  : doorColors[color].color,
            }}
            onClick={() => onChange(color)}
            aria-label={`${t(label)}: ${t(doorColors[color].key)}`}
            aria-pressed={value === color}
            title={t(doorColors[color].key)}
          >
            {value === color && <Check size={18} />}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
export default function Configurator() {
  const { t, lang, notify } = useStore(),
    [params] = useSearchParams();
  const [initial] = useState<Configuration>(() => ({
    ...initialConfiguration,
    wood:
      params.get("wood") === "walnut"
        ? "walnut"
        : params.get("wood") === "ash"
          ? "ash"
          : "oak",
  }));
  const history = useConfiguration(initial),
    config = history.present;
  const [activeTab, setActiveTab] = useState("dimensions"),
    [selected, setSelected] = useState(0),
    [view, setView] = useState<WardrobeView>("perspective"),
    [dimensions, setDimensions] = useState(true),
    [resetKey, setResetKey] = useState(0),
    [zoom, setZoom] = useState(0),
    [quote, setQuote] = useState(false),
    [exportedView, setExportedView] = useState<string | null>(null),
    [hasSaved, setHasSaved] = useState(() => !!savedConfiguration());
  const capture = useRef<(() => string) | null>(null);
  const captureReady = useCallback((fn: (() => string) | null) => {
    capture.current = fn;
  }, []);
  const selectedIndex = Math.min(selected, config.sections - 1),
    bay = bayAt(config, selectedIndex),
    counts = configurationCounts(config);
  const update = <K extends keyof Configuration>(
    key: K,
    value: Configuration[K],
  ) => history.setConfig({ ...config, [key]: value });
  const updateBay = (changes: Partial<BayConfiguration>) =>
    history.setConfig({
      ...config,
      bays: config.bays.map((b, i) =>
        i === selectedIndex ? { ...b, ...changes } : b,
      ),
    });
  function save() {
    try {
      localStorage.setItem(
        savedKey,
        JSON.stringify({ version: 2, configuration: config }),
      );
      setHasSaved(true);
      notify("studioSaved");
    } catch {
      const file = new Blob(
        [JSON.stringify({ version: 2, configuration: config }, null, 2)],
        { type: "application/json" },
      );
      const url = URL.createObjectURL(file),
        a = document.createElement("a");
      a.href = url;
      a.download = "maisonne-project.json";
      a.click();
      URL.revokeObjectURL(url);
    }
  }
  function restore() {
    const saved = savedConfiguration();
    if (saved) {
      history.setConfig(saved);
      setSelected(0);
      notify("studioRestored");
    } else notify("studioRestoreEmpty");
  }
  function exportView() {
    if (!capture.current) return;
    setExportedView(capture.current());
  }
  const tabs = [
    { id: "dimensions", label: "studioDimensions", Icon: Ruler },
    { id: "interior", label: "studioInterior", Icon: SlidersHorizontal },
    { id: "finishes", label: "studioFinishes", Icon: Palette },
    { id: "doors", label: "studioDoors", Icon: DoorOpen },
  ] as const;
  const modes = [
    { mode: "shelves", label: "studioShelfLayout", Icon: Rows3 },
    { mode: "hanging", label: "studioHangingLayout", Icon: Shirt },
    { mode: "drawers", label: "studioDrawerLayout", Icon: Archive },
    { mode: "mixed", label: "studioMixedLayout", Icon: PanelsTopLeft },
  ] as const;
  return (
    <main className="studio-page">
      <div className="studio-heading">
        <div className="studio-heading-title">
          <Link
            className="studio-back"
            to="/product/atelier"
            aria-label={t("back")}
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <span className="eyebrow">{t("studio")}</span>
            <h1>{t("studioTitle")}</h1>
          </div>
        </div>
        <div className="studio-project-actions">
          <div className="history-buttons">
            <button
              className="icon-button"
              onClick={history.undo}
              disabled={!history.past.length}
              aria-label={t("studioUndo")}
              title={t("studioUndo")}
            >
              <Undo2 size={20} />
            </button>
            <button
              className="icon-button"
              onClick={history.redo}
              disabled={!history.future.length}
              aria-label={t("studioRedo")}
              title={t("studioRedo")}
            >
              <Redo2 size={20} />
            </button>
          </div>
          {hasSaved && (
            <button
              className="restore-project"
              onClick={restore}
              aria-label={t("studioRestore")}
            >
              <FolderOpen size={17} />
              <span>{t("studioRestore")}</span>
            </button>
          )}
          <button
            className="studio-save"
            onClick={save}
            aria-label={t("studioSave")}
          >
            <Save size={17} />
            <span>{t("studioSave")}</span>
          </button>
        </div>
      </div>
      <div className="studio-workbench">
        <aside className="studio-sidebar">
          <div
            className="studio-steps"
            role="tablist"
            aria-label={t("studioProject")}
          >
            {tabs.map(({ id, label, Icon }, i) => (
              <button
                key={id}
                role="tab"
                id={`tab-${id}`}
                aria-controls={`panel-${id}`}
                aria-selected={activeTab === id}
                onClick={() => setActiveTab(id)}
                className={activeTab === id ? "active" : ""}
              >
                <span className="step-index">0{i + 1}</span>
                <Icon size={18} />
                <span>{t(label)}</span>
                <ChevronDown size={15} />
              </button>
            ))}
          </div>
          <div
            className="studio-panel"
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
          >
            {activeTab === "dimensions" && (
              <>
                <div className="studio-panel-intro">
                  <h2>{t("size").replace("01 / ", "")}</h2>
                  <p>{t("studioHint")}</p>
                </div>
                {(["width", "height", "depth"] as const).map((key) => (
                  <DimensionField
                    key={key}
                    name={key}
                    value={config[key]}
                    min={key === "width" ? 80 : key === "height" ? 140 : 35}
                    max={key === "width" ? 300 : key === "height" ? 280 : 80}
                    onChange={(n) => update(key, n)}
                  />
                ))}
                <Counter
                  label={t("sections")}
                  value={config.sections}
                  min={1}
                  max={maxSections(config.width)}
                  onChange={(n) => update("sections", n)}
                />
                <p className="studio-help">{t("studioDimensionHint")}</p>
              </>
            )}
            {activeTab === "interior" && (
              <>
                <div className="studio-panel-intro">
                  <h2>{t("studioSelectBay")}</h2>
                  <p>{t("studioSelectHint")}</p>
                </div>
                <div className="bay-tabs">
                  {Array.from({ length: config.sections }, (_, i) => (
                    <button
                      key={i}
                      className={selectedIndex === i ? "active" : ""}
                      aria-label={`${t("studioBay")} ${i + 1}`}
                      aria-pressed={selectedIndex === i}
                      onClick={() => setSelected(i)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <h3 className="interior-caption">
                  {t("studioBay")} {selectedIndex + 1}{" "}
                  <span>
                    {Math.round(
                      (config.width - (config.sections + 1) * 2.2) /
                        config.sections,
                    )}{" "}
                    cm
                  </span>
                </h3>
                <div className="layout-modes">
                  {modes.map(({ mode, label, Icon }) => (
                    <button
                      key={mode}
                      className={bay.mode === mode ? "active" : ""}
                      aria-pressed={bay.mode === mode}
                      onClick={() =>
                        updateBay({ ...bayDefaults[mode as BayMode] })
                      }
                    >
                      <Icon size={29} strokeWidth={1.25} />
                      <span>{t(label)}</span>
                      {bay.mode === mode && (
                        <Check className="layout-check" size={14} />
                      )}
                    </button>
                  ))}
                </div>
                <Counter
                  label={t("studioShelfCount")}
                  value={bay.shelves}
                  min={0}
                  max={bay.mode === "hanging" ? 2 : 6}
                  onChange={(n) => updateBay({ shelves: n })}
                />
                {(bay.mode === "mixed" || bay.mode === "drawers") && (
                  <Counter
                    label={t("studioDrawerCount")}
                    value={bay.drawers}
                    min={0}
                    max={3}
                    onChange={(n) => updateBay({ drawers: n })}
                  />
                )}
                <button
                  className="apply-sections"
                  onClick={() =>
                    history.setConfig({
                      ...config,
                      bays: Array.from({ length: config.sections }, () => ({
                        ...bay,
                      })),
                    })
                  }
                >
                  {t("studioApplyAll")}
                  <ArrowRight size={16} />
                </button>
              </>
            )}
            {activeTab === "finishes" && (
              <>
                <div className="studio-panel-intro">
                  <h2>{t("studioFinishes")}</h2>
                  <p>{t("customFeature2")}</p>
                </div>
                <span className="control-title">{t("cabinetFinish")}</span>
                <div className="studio-wood-grid">
                  {(Object.keys(woodFinishes) as Wood[]).map((wood) => (
                    <button
                      key={wood}
                      className={config.wood === wood ? "active" : ""}
                      onClick={() => update("wood", wood)}
                      aria-label={t(woodFinishes[wood].key)}
                      aria-pressed={config.wood === wood}
                    >
                      <span
                        className="wood-sample"
                        style={{ backgroundColor: woodFinishes[wood].color }}
                      >
                        {config.wood === wood && <Check size={19} />}
                      </span>
                      <span>{t(woodFinishes[wood].key)}</span>
                    </button>
                  ))}
                </div>
                <ColorControl
                  label="cabinetColor"
                  value={config.cabinetColor}
                  wood={config.wood}
                  onChange={(v) => update("cabinetColor", v)}
                />
                {config.doors && (
                  <ColorControl
                    label="doorColor"
                    value={config.doorColor}
                    wood={config.wood}
                    onChange={(v) => update("doorColor", v)}
                  />
                )}
              </>
            )}
            {activeTab === "doors" && (
              <>
                <div className="studio-panel-intro">
                  <h2>{t("studioDoors")}</h2>
                  <p>{t("studioHint")}</p>
                </div>
                <div className="door-mode-options">
                  <button
                    className={!config.doors ? "active" : ""}
                    aria-pressed={!config.doors}
                    onClick={() => update("doors", false)}
                  >
                    <PanelsTopLeft size={28} strokeWidth={1.25} />
                    {t("studioNoDoors")}
                  </button>
                  <button
                    className={config.doors ? "active" : ""}
                    aria-pressed={config.doors}
                    onClick={() => update("doors", true)}
                  >
                    <DoorOpen size={28} strokeWidth={1.25} />
                    {t("studioWithDoors")}
                  </button>
                </div>
                {config.doors && (
                  <label className="studio-toggle">
                    <span>{t("openDoors")}</span>
                    <input
                      type="checkbox"
                      checked={config.open}
                      onChange={(e) => update("open", e.target.checked)}
                    />
                  </label>
                )}
                <label className="studio-toggle">
                  <span>{t("studioBackPanel")}</span>
                  <input
                    type="checkbox"
                    checked={config.backPanel}
                    onChange={(e) => update("backPanel", e.target.checked)}
                  />
                </label>
                <span className="control-title handles-title">
                  {t("studioHandles")}
                </span>
                <div className="handle-options">
                  {(
                    [
                      { id: "bar", key: "studioHandleBar" },
                      { id: "knob", key: "studioHandleKnob" },
                      { id: "none", key: "studioHandleNone" },
                    ] as { id: HandleStyle; key: TranslationKey }[]
                  ).map((item) => (
                    <button
                      className={config.handles === item.id ? "active" : ""}
                      key={item.id}
                      onClick={() => update("handles", item.id)}
                      aria-pressed={config.handles === item.id}
                    >
                      {t(item.key)}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="studio-estimate">
            <div>
              <span>
                {t("estimatedPrice")}
                <small>{t("tax")}</small>
              </span>
              <strong className="price" data-testid="config-price">
                {money(configurationPrice(config), lang)}
              </strong>
            </div>
            <button
              className="button primary full"
              onClick={() => setQuote(true)}
            >
              {t("requestQuote")}
              <ArrowRight size={19} />
            </button>
            <p>{t("estimateNote")}</p>
          </div>
        </aside>
        <section className="studio-stage" aria-label={t("configTitle")}>
          <div className="studio-stage-top">
            <div>
              <span className="status-dot" />
              ATELIER 01 <span className="stage-separator">/</span>
              <span>
                {config.width} × {config.height} × {config.depth} cm
              </span>
            </div>
            <button
              className={`measurement-toggle ${dimensions ? "active" : ""}`}
              onClick={() => setDimensions(!dimensions)}
              aria-pressed={dimensions}
              aria-label={t("studioMeasurements")}
            >
              <Ruler size={17} />
              <span>{t("studioMeasurements")}</span>
            </button>
          </div>
          <div className="studio-canvas">
            <Suspense
              fallback={
                <div className="render-loading">
                  MAISONNE
                  <span />
                </div>
              }
            >
              <WardrobePreview
                config={config}
                view={view}
                resetKey={resetKey}
                zoom={zoom}
                showDimensions={dimensions}
                selectedSection={
                  activeTab === "interior" ? selectedIndex : null
                }
                onSelectSection={(i) => {
                  setSelected(i);
                  setActiveTab("interior");
                }}
                onCaptureReady={captureReady}
              />
            </Suspense>
          </div>
          <div className="studio-preset-strip">
            <span>{t("studioPresets")}</span>
            <div>
              {(
                [
                  { id: "dressing", key: "studioDressing" },
                  { id: "library", key: "studioLibrary" },
                  { id: "mixed", key: "studioMixed" },
                ] as const
              ).map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    history.setConfig(presetConfiguration(p.id, config));
                    setResetKey((k) => k + 1);
                  }}
                >
                  {t(p.key)}
                </button>
              ))}
            </div>
          </div>
          <div className="studio-stage-footer">
            <div className="view-selector">
              <select
                aria-label={t("studioPerspective")}
                value={view}
                onChange={(e) => setView(e.target.value as WardrobeView)}
              >
                <option value="perspective">{t("studioPerspective")}</option>
                <option value="front">{t("studioFront")}</option>
                <option value="side">{t("studioSide")}</option>
              </select>
              <ChevronDown size={14} />
            </div>
            <div className="studio-tools">
              <button
                className="icon-button"
                aria-label={t("zoomOut")}
                title={t("zoomOut")}
                onClick={() => setZoom((z) => z - 1)}
              >
                <Minus size={19} />
              </button>
              <button
                className="icon-button"
                aria-label={t("zoomIn")}
                title={t("zoomIn")}
                onClick={() => setZoom((z) => z + 1)}
              >
                <Plus size={19} />
              </button>
              <span />
              <button
                className="icon-button"
                aria-label={t("resetCamera")}
                title={t("resetCamera")}
                onClick={() => setResetKey((k) => k + 1)}
              >
                <Maximize size={18} />
              </button>
              <button
                className="icon-button"
                disabled={!config.doors}
                aria-label={t("studioOpenPreview")}
                title={t("studioOpenPreview")}
                onClick={() => update("open", !config.open)}
              >
                <DoorOpen size={19} />
              </button>
              <button
                className="icon-button"
                aria-label={t("studioExport")}
                title={t("studioExport")}
                onClick={exportView}
              >
                <Download size={18} />
              </button>
              <button
                className="icon-button"
                aria-label={t("reset")}
                title={t("reset")}
                onClick={() => {
                  history.setConfig(initialConfiguration);
                  setSelected(0);
                  setResetKey((k) => k + 1);
                }}
              >
                <RotateCcw size={18} />
              </button>
            </div>
            <span className="studio-inventory">
              {counts.shelves} {t("shelvesTotal")} · {counts.drawers}{" "}
              {t("studioDrawerUnit")}
            </span>
          </div>
        </section>
      </div>
      {exportedView && (
        <Modal title={t("studioExport")} onClose={() => setExportedView(null)}>
          <img
            className="export-preview"
            src={exportedView}
            alt={t("studioFullProduct")}
          />
          <a
            className="button primary"
            href={exportedView}
            download="maisonne-atelier.png"
          >
            <Download size={18} /> {t("studioDownload")}
          </a>
        </Modal>
      )}
      {quote && (
        <QuoteRequest config={config} onClose={() => setQuote(false)} />
      )}
    </main>
  );
}
