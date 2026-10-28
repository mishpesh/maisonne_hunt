import { useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import { useStore } from "../store";
import {
  configurationCounts,
  configurationPrice,
  doorColors,
  woodFinishes,
} from "../configuration";
import type { Configuration } from "../configuration";
import { money } from "../i18n";
import Modal from "./Modal";
export default function QuoteRequest({
  config,
  onClose,
}: {
  config: Configuration;
  onClose: () => void;
}) {
  const { t, lang } = useStore(),
    counts = configurationCounts(config);
  const [submitted, setSubmitted] = useState(false);
  return (
    <Modal
      title={submitted ? t("quoteSuccess") : t("quoteTitle")}
      onClose={onClose}
    >
      {submitted ? (
        <div className="quote-success">
          <span className="success-icon">
            <Check size={26} />
          </span>
          <p>{t("quoteSuccessText")}</p>
          <button className="button primary" onClick={onClose}>
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
              {t(woodFinishes[config.wood].key)}
            </p>
            <p>
              {config.sections} {t("sections").toLowerCase()} · {counts.shelves}{" "}
              {t("shelvesTotal")} · {counts.drawers} {t("studioDrawerUnit")} ·{" "}
              {counts.rails} {t("studioRail")}
            </p>
            <p>
              {t("cabinetColor")}: {t(doorColors[config.cabinetColor].key)} ·{" "}
              {config.doors
                ? `${t("doorColor")}: ${t(doorColors[config.doorColor].key)}`
                : t("noDoors")}
            </p>
            <span className="price">
              {money(configurationPrice(config), lang)}
            </span>
          </div>
          <form
            className="quote-form"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            {(
              [
                {
                  name: "name",
                  label: "name",
                  type: "text",
                  autoComplete: "name",
                },
                {
                  name: "email",
                  label: "email",
                  type: "email",
                  autoComplete: "email",
                },
                {
                  name: "city",
                  label: "city",
                  type: "text",
                  autoComplete: "address-level2",
                },
              ] as const
            ).map((field) => (
              <label key={field.name}>
                {t(field.label)} *
                <input
                  required
                  name={field.name}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  maxLength={200}
                />
              </label>
            ))}
            <label>
              {t("message")} <small>({t("optional")})</small>
              <textarea rows={3} maxLength={1000} />
            </label>
            <button className="button primary full" type="submit">
              {t("submitQuote")}
              <ArrowRight size={18} />
            </button>
            <p className="demo-note">{t("newsletterDisclaimer")}</p>
          </form>
        </>
      )}
    </Modal>
  );
}
