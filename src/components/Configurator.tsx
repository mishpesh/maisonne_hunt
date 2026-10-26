import { lazy, Suspense, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Maximize,
  Minus,
  Plus,
  RotateCcw,
  Ruler,
  X,
} from "lucide-react";
import { useStore } from "../store";
import { money } from "../i18n";
import {
  configurationPrice,
  initialConfiguration,
  woodFinishes,
  doorColors,
} from "../configuration";
import type { Configuration, Wood, DoorColor } from "../configuration";
import Modal from "./Modal";
const WardrobePreview = lazy(() => import("./WardrobePreview"));
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
    <div className="control-counter">
      <span>{label}</span>
      <div className="quantity">
        <button
          aria-label={`${label} −`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
        >
          <Minus size={14} />
        </button>
        <output aria-label={label}>{value}</output>
        <button
          aria-label={`${label} +`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
        >
          <Plus size={14} />
        </button>
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
  onChange: (color: DoorColor) => void;
}) {
  const { t } = useStore();
  return (
    <fieldset className="color-control">
      <legend className="sr-only">{t(label)}</legend>
      <div className="swatch-label">
        <span>{t(label)}</span>
        <small>{t(doorColors[value].key)}</small>
      </div>
      <div className="door-options">
        {(Object.keys(doorColors) as DoorColor[]).map((color) => (
          <button
            className={`finish-swatch ${value === color ? "active" : ""}`}
            key={color}
            aria-label={`${t(label)}: ${t(doorColors[color].key)}`}
            title={t(doorColors[color].key)}
            aria-pressed={value === color}
            onClick={() => onChange(color)}
            style={{
              background:
                color === "natural"
                  ? woodFinishes[wood].color
                  : doorColors[color].color,
            }}
          >
            {value === color && <Check size={14} />}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
export default function Configurator() {
  const { t, lang } = useStore();
  const [params] = useSearchParams();
  const [config, setConfig] = useState<Configuration>(() => {
    const wood = params.get("wood");
    return {
      ...initialConfiguration,
      wood: wood === "walnut" || wood === "ash" ? wood : "oak",
    };
  });
  const [resetKey, setResetKey] = useState(0),
    [zoom, setZoom] = useState(0),
    [quote, setQuote] = useState(false),
    [submitted, setSubmitted] = useState(false),
    [options, setOptions] = useState(true);
  const update = <K extends keyof Configuration>(
    key: K,
    value: Configuration[K],
  ) => setConfig((c) => ({ ...c, [key]: value }));
  const price = configurationPrice(config);
  return (
    <main className="config-page">
      <div className="config-top container">
        <Link className="text-link" to="/product/atelier">
          <ArrowLeft size={15} />
          {t("back")}
        </Link>
        <span className="eyebrow">{t("studio")}</span>
        <button
          className="text-link"
          onClick={() => {
            setConfig({ ...initialConfiguration });
            setResetKey((k) => k + 1);
          }}
        >
          <RotateCcw size={14} />
          {t("reset")}
        </button>
      </div>
      <div className="config-title">
        <span className="eyebrow">{t("configLabel")}</span>
        <h1>{t("configTitle")}</h1>
        <p>{t("configSubtitle")}</p>
      </div>
      <div className="config-workspace container">
        <div className="config-view">
          <div className="view-top">
            <span>
              <span className="status-dot" />
              ATELIER 01
            </span>
            <span>
              {config.width} × {config.height} × {config.depth} cm
            </span>
          </div>
          <Suspense
            fallback={
              <div className="render-loading">
                MAISONNE
                <span />
              </div>
            }
          >
            <WardrobePreview config={config} resetKey={resetKey} zoom={zoom} />
          </Suspense>
          <div className="view-bottom">
            <span>{t("controls")}</span>
            <div>
              <button
                className="icon-button"
                onClick={() => setZoom((z) => z - 1)}
                aria-label={t("zoomOut")}
              >
                <Minus size={17} />
              </button>
              <button
                className="icon-button"
                onClick={() => setZoom((z) => z + 1)}
                aria-label={t("zoomIn")}
              >
                <Plus size={17} />
              </button>
              <button
                className="icon-button"
                onClick={() => setResetKey((k) => k + 1)}
                aria-label={t("resetCamera")}
              >
                <Maximize size={16} />
              </button>
            </div>
          </div>
          <span className="view-watermark">MAISONNE</span>
        </div>
        <aside className="config-options">
          <button
            className="options-toggle"
            onClick={() => setOptions(!options)}
            aria-expanded={options}
          >
            {t("configMobile")}
            <ChevronDown size={18} />
          </button>
          <div className={`config-controls ${options ? "visible" : ""}`}>
            <section className="control-section">
              <h2>
                <Ruler size={17} />
                {t("size")}
              </h2>
              {(["width", "height", "depth"] as const).map((key) => (
                <label className="range-label" key={key}>
                  <span>
                    {t(key)}
                    <output>
                      {config[key]} <small>cm</small>
                    </output>
                  </span>
                  <input
                    type="range"
                    min={key === "width" ? 80 : key === "height" ? 140 : 35}
                    max={key === "width" ? 300 : key === "height" ? 280 : 80}
                    step={1}
                    aria-label={t(key)}
                    value={config[key]}
                    onChange={(e) => update(key, Number(e.target.value))}
                  />
                  <span className="range-bounds">
                    <small>
                      {key === "width" ? 80 : key === "height" ? 140 : 35} cm
                    </small>
                    <small>
                      {key === "width" ? 300 : key === "height" ? 280 : 80} cm
                    </small>
                  </span>
                </label>
              ))}
            </section>
            <section className="control-section">
              <h2>{t("layout")}</h2>
              <Counter
                label={t("sections")}
                value={config.sections}
                min={1}
                max={5}
                onChange={(v) => update("sections", v)}
              />
              <Counter
                label={t("shelves")}
                value={config.shelves}
                min={0}
                max={6}
                onChange={(v) => update("shelves", v)}
              />
              <label className="toggle-row">
                <span>{t("doors")}</span>
                <input
                  type="checkbox"
                  checked={config.doors}
                  onChange={(e) => update("doors", e.target.checked)}
                />
                <span className="switch" />
              </label>
              {config.doors && (
                <label className="toggle-row">
                  <span>{t("openDoors")}</span>
                  <input
                    type="checkbox"
                    checked={config.open}
                    onChange={(e) => update("open", e.target.checked)}
                  />
                  <span className="switch" />
                </label>
              )}
            </section>
            <section className="control-section">
              <h2>{t("materials")}</h2>
              <div className="swatch-label">
                <span>{t("cabinetFinish")}</span>
                <small>{t(woodFinishes[config.wood].key)}</small>
              </div>
              <div className="wood-options">
                {(Object.keys(woodFinishes) as Wood[]).map((wood) => (
                  <button
                    key={wood}
                    className={`wood-swatch ${config.wood === wood ? "active" : ""}`}
                    title={t(woodFinishes[wood].key)}
                    aria-label={t(woodFinishes[wood].key)}
                    aria-pressed={config.wood === wood}
                    onClick={() => update("wood", wood)}
                    style={{ backgroundColor: woodFinishes[wood].color }}
                  >
                    {config.wood === wood && <Check size={18} />}
                  </button>
                ))}
              </div>
              <ColorControl
                label="cabinetColor"
                value={config.cabinetColor}
                wood={config.wood}
                onChange={(color) => update("cabinetColor", color)}
              />
              {config.doors && (
                <ColorControl
                  label="doorColor"
                  value={config.doorColor}
                  wood={config.wood}
                  onChange={(color) => update("doorColor", color)}
                />
              )}
            </section>
          </div>
          <div className="estimate">
            <div>
              <span>{t("estimatedPrice")}</span>
              <strong className="price" data-testid="config-price">
                {money(price, lang)}
              </strong>
            </div>
            <p className="config-summary">
              {config.width} × {config.height} × {config.depth} cm ·{" "}
              {config.sections} {t("sections").toLowerCase()} ·{" "}
              {config.sections * config.shelves} {t("shelvesTotal")}
              <br />
              {t(woodFinishes[config.wood].key)} ·{" "}
              {t(doorColors[config.cabinetColor].key)} ·{" "}
              {config.doors
                ? `${config.sections} ${t("doorCount")} — ${t(doorColors[config.doorColor].key)}`
                : t("noDoors")}
            </p>
            <button
              className="button primary full"
              onClick={() => {
                setQuote(true);
                setSubmitted(false);
              }}
            >
              {t("requestQuote")}
              <ArrowRight size={17} />
            </button>
            <p className="demo-note">{t("estimateNote")}</p>
          </div>
        </aside>
      </div>
      {quote && (
        <Modal
          title={submitted ? t("quoteSuccess") : t("quoteTitle")}
          onClose={() => setQuote(false)}
        >
          {submitted ? (
            <div className="quote-success">
              <span className="success-icon">
                <Check size={26} />
              </span>
              <p>{t("quoteSuccessText")}</p>
              <button
                className="button primary"
                onClick={() => setQuote(false)}
              >
                {t("close")}
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <p className="muted">{t("quoteText")}</p>
              <div className="quote-configuration">
                <span className="eyebrow">{t("configuration")}</span>
                <p>
                  {config.width} × {config.height} × {config.depth} cm ·{" "}
                  {t(woodFinishes[config.wood].key)} ·{" "}
                  {t(doorColors[config.cabinetColor].key)}
                </p>
                <p>
                  {config.sections} {t("sections").toLowerCase()} ·{" "}
                  {config.sections * config.shelves} {t("shelvesTotal")} ·{" "}
                  {config.doors
                    ? t(doorColors[config.doorColor].key)
                    : t("noDoors")}
                </p>
                <span className="price">{money(price, lang)}</span>
              </div>
              <form
                className="quote-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <label>
                  {t("name")} *
                  <input
                    required
                    name="name"
                    autoComplete="name"
                    maxLength={100}
                  />
                </label>
                <label>
                  {t("email")} *
                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    maxLength={200}
                  />
                </label>
                <label>
                  {t("city")} *
                  <input
                    required
                    name="city"
                    autoComplete="address-level2"
                    maxLength={100}
                  />
                </label>
                <label>
                  {t("message")} <small>({t("optional")})</small>
                  <textarea rows={3} maxLength={1000} />
                </label>
                <button type="submit" className="button primary full">
                  {t("submitQuote")}
                  <ArrowRight size={17} />
                </button>
                <p className="demo-note">{t("newsletterDisclaimer")}</p>
              </form>
            </>
          )}
        </Modal>
      )}
    </main>
  );
}
