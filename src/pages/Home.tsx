import ActionArrow from "../components/ActionArrow";
import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  Box,
  Check,
  Leaf,
  MapPin,
  MoveUpRight,
  Plus,
  Ruler,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import type { TranslationKey } from "../i18n";
import { categories, featured, imageUrl } from "../data";
import { initialConfiguration } from "../configuration";
import { useStore } from "../store";
import ProductCard from "../components/ProductCard";
const WardrobePreview = lazy(() => import("../components/WardrobePreview"));
export default function Home() {
  const { t } = useStore();
  return (
    <main>
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="tiny-square" />
            {t("season")}
          </p>
          <h1>
            {t("heroTitle")
              .split("\n")
              .map((line, i) => (
                <span key={i}>{line}</span>
              ))}
          </h1>
          <p className="hero-description">{t("heroText")}</p>
          <Link className="button primary" to="/collection">
            {t("explore")}
            <ActionArrow size={19} />
          </Link>
          <Link className="hero-secondary" to="/atelier">
            <Box size={18} />
            {t("create")}
            <ArrowRight size={16} />
          </Link>
          <div className="hero-signature">
            <span className="signature-line" />
            <Leaf size={15} />
            <span>{t("curated")}</span>
          </div>
        </div>
        <div className="hero-visual">
          <img
            src="/images/hero.jpg"
            alt={t("heroCaption")}
            fetchPriority="high"
          />
          <Link
            className="hero-hotspot"
            to="/inspiration"
            aria-label={t("inspiration")}
          >
            <Plus size={19} />
          </Link>
          <div className="hero-image-caption">
            <div>
              <span className="eyebrow">MAISONNE / 01</span>
              <p>{t("heroCaption")}</p>
            </div>
            <Link
              className="round-link"
              to="/inspiration"
              aria-label={t("inspiration")}
            >
              <ActionArrow size={23} />
            </Link>
          </div>
          <div className="hero-pagination">
            <span className="active" />
            <span />
            <span />
          </div>
        </div>
      </section>
      <div className="trust-line container">
        <span>
          <Leaf size={16} />
          {t("materialsNote")}
        </span>
        <span>
          <MapPin size={16} />
          {t("belgianNote")}
        </span>
        <span>
          <Truck size={17} />
          {t("deliveryNote")}
        </span>
        <a href="#categories" aria-label={t("categoryTitle")}>
          <ArrowDown size={17} />
        </a>
      </div>
      <section className="categories-section container" id="categories">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t("categoryEyebrow")}</p>
            <h2>{t("categoryTitle")}</h2>
          </div>
          <Link className="text-link underlined" to="/collection">
            {t("allFurniture")}
            <ActionArrow size={16} />
          </Link>
        </div>
        <div className="category-grid">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/collection?category=${c.id}`}
              className="category-card"
            >
              <div>
                <img src={imageUrl(c.image)} alt={t(c.id)} loading="lazy" />
              </div>
              <h3>
                {t(c.id)}
                <ActionArrow size={16} />
              </h3>
              <small>
                0{c.count} {t("products")}
              </small>
            </Link>
          ))}
        </div>
      </section>
      <section className="bestsellers-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t("bestEyebrow")}</p>
              <h2>{t("bestTitle")}</h2>
              <p className="section-description">{t("bestText")}</p>
            </div>
            <Link className="text-link underlined" to="/collection">
              {t("seeAll")}
              <ActionArrow size={16} />
            </Link>
          </div>
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
      <section className="custom-promo container">
        <div className="custom-promo-copy">
          <span className="eyebrow">{t("customEyebrow")}</span>
          <h2>{t("customTitle")}</h2>
          <p>{t("customText")}</p>
          <ul>
            {(
              [
                "customFeature1",
                "customFeature2",
                "customFeature3",
              ] as TranslationKey[]
            ).map((k) => (
              <li key={k}>
                <Check size={15} />
                {t(k)}
              </li>
            ))}
          </ul>
          <Link className="button primary" to="/atelier">
            {t("customCta")}
            <ActionArrow size={19} />
          </Link>
        </div>
        <div className="custom-promo-image">
          <div className="studio-image-label">
            <Box size={17} />
            <span>{t("studio")}</span>
            <span className="live-tag">3D</span>
          </div>
          <Suspense
            fallback={
              <div className="render-loading">
                MAISONNE
                <span />
              </div>
            }
          >
            <WardrobePreview config={initialConfiguration} compact />
          </Suspense>
          <div className="promo-dimension">
            <span>180 cm</span>
            <span>↔</span>
          </div>
          <div className="studio-image-footer">
            <span>{t("realTime")}</span>
            <Link to="/atelier" aria-label={t("customCta")}>
              <MoveUpRight size={19} />
            </Link>
          </div>
        </div>
      </section>
      <Benefits />
    </main>
  );
}
function Benefits() {
  const { t } = useStore();
  const items = [
    { Icon: ShieldCheck, title: "quality", text: "qualityText" },
    { Icon: Ruler, title: "personal", text: "personalText" },
    { Icon: Truck, title: "shipping", text: "shippingText" },
    { Icon: Sparkles, title: "help", text: "helpText" },
  ] as const;
  return (
    <section className="benefits">
      <div className="container">
        <h2>{t("promiseTitle")}</h2>
        <div className="benefit-grid">
          {items.map(({ Icon, title, text }) => (
            <div key={title}>
              <Icon size={29} strokeWidth={1.2} />
              <h3>{t(title)}</h3>
              <p>{t(text)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
