import ActionArrow from "./ActionArrow";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Leaf, Sparkles } from "lucide-react";
import type { TranslationKey } from "../i18n";
import { useStore } from "../store";
import Modal from "./Modal";
export default function Footer() {
  const { t, setChatOpen } = useStore();
  const [subscribed, setSubscribed] = useState(false),
    [info, setInfo] = useState<TranslationKey | null>(null);
  return (
    <>
      <section className="newsletter">
        <div className="container newsletter-inner">
          <div>
            <span className="eyebrow">{t("journal")}</span>
            <h2>{t("newsletterTitle")}</h2>
            <p>{t("newsletterText")}</p>
          </div>
          <div className="newsletter-form-wrap">
            {subscribed ? (
              <div className="newsletter-success">
                <Check size={20} />
                {t("subscribed")}
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubscribed(true);
                }}
              >
                <input
                  type="email"
                  required
                  placeholder={t("email")}
                  aria-label={t("email")}
                />
                <button type="submit">
                  {t("subscribe")}
                  <ActionArrow size={19} />
                </button>
              </form>
            )}
            <small>{t("newsletterDisclaimer")}</small>
          </div>
        </div>
      </section>
      <footer>
        <div className="container">
          <div className="footer-main">
            <div className="footer-brand">
              <Link className="wordmark" to="/">
                MAISONNE<span>®</span>
              </Link>
              <p>{t("footerLine")}</p>
              <span className="footer-belgium">
                <span className="flag-be" />
                Belgique · België · Belgium
              </span>
            </div>
            <div>
              <h3>{t("shop")}</h3>
              <Link to="/collection">{t("collection")}</Link>
              <Link to="/atelier">{t("custom")}</Link>
              <Link to="/story">{t("story")}</Link>
              <Link to="/inspiration">{t("inspiration")}</Link>
            </div>
            <div>
              <h3>{t("support")}</h3>
              <button
                onClick={() => {
                  setChatOpen(true);
                }}
              >
                {t("delivery")}
              </button>
              <button onClick={() => setChatOpen(true)}>{t("faq")}</button>
              <button onClick={() => setInfo("contact")}>{t("contact")}</button>
              <button onClick={() => setInfo("privacy")}>{t("privacy")}</button>
            </div>
            <div className="footer-note">
              <h3>{t("belgianNote")}</h3>
              <p>{t("curated")}</p>
              <Leaf size={24} strokeWidth={1} />
            </div>
          </div>
          <div className="footer-bottom">
            <span>{t("copyright")}</span>
            <span>{t("demo")}</span>
            <span>FR / NL / EN</span>
          </div>
        </div>
      </footer>
      {info && (
        <Modal title={t(info)} onClose={() => setInfo(null)}>
          <p className="info-body">
            {t(info === "privacy" ? "privacyText" : "contactText")}
          </p>
          {info === "contact" && (
            <button
              className="button primary"
              onClick={() => {
                setInfo(null);
                setChatOpen(true);
              }}
            >
              {t("assistant")}
              <Sparkles size={16} />
            </button>
          )}
        </Modal>
      )}
    </>
  );
}
