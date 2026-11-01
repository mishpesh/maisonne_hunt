import ActionArrow from "../components/ActionArrow";
import { lazy, Suspense, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { money } from "../i18n";
import { featured, imageUrl, products, unitPrice } from "../data";
import { initialConfiguration } from "../configuration";
import { useStore } from "../store";
import ProductCard from "../components/ProductCard";
const WardrobePreview = lazy(() => import("../components/WardrobePreview"));
export default function ProductPage() {
  const { id } = useParams();
  const p = products.find((p) => p.id === id);
  const { t, lang, addCart, favourites, toggleFavourite } = useStore();
  const [finish, setFinish] = useState(0),
    [quantity, setQuantity] = useState(1);
  useEffect(() => {
    setFinish(0);
    setQuantity(1);
  }, [id]);
  if (!p)
    return (
      <main className="empty-state">
        <h1>{t("noResults")}</h1>
        <Link className="button primary" to="/collection">
          {t("explore")}
        </Link>
      </main>
    );
  const related = products
    .filter((x) => x.category === p.category && x.id !== p.id)
    .concat(featured.filter((x) => x.id !== p.id))
    .filter((x, i, a) => a.findIndex((y) => y.id === x.id) === i)
    .slice(0, 4);
  return (
    <main className="product-page container">
      <div className="breadcrumb">
        <Link to="/">{t("home")}</Link>
        <ChevronRight size={12} />
        <Link to={`/collection?category=${p.category}`}>{t(p.category)}</Link>
        <ChevronRight size={12} />
        <span>{p.name[lang]}</span>
      </div>
      <div className="product-detail">
        <div className="product-gallery">
          <div className={`main-product-image ${p.custom ? "is-3d" : ""}`}>
            {p.custom ? (
              <Suspense
                fallback={
                  <div className="render-loading">
                    MAISONNE
                    <span />
                  </div>
                }
              >
                <WardrobePreview
                  config={{
                    ...initialConfiguration,
                    wood:
                      finish === 1 ? "walnut" : finish === 2 ? "ash" : "oak",
                  }}
                  compact
                />
              </Suspense>
            ) : (
              <img src={imageUrl(p.image)} alt={p.name[lang]} />
            )}
            {p.badge && <span className="product-badge">{t(p.badge)}</span>}
            {p.custom && (
              <span className="gallery-view-label">
                <Box size={16} />
                {t("studioFullProduct")} · 3D
              </span>
            )}
          </div>
        </div>
        <div className="product-purchase">
          <span className="eyebrow">MAISONNE / {t(p.category)}</span>
          <h1>{p.name[lang]}</h1>
          <p className="product-short">{p.description[lang]}</p>
          <div className="product-price-row">
            <span className="price">
              {p.custom && <small>{t("from")} </small>}
              {money(unitPrice(p, finish), lang)}
            </span>
            <small>{t("tax")}</small>
          </div>
          <div className="product-finish">
            <label>
              {t("finish")}
              <span>{t(p.finishNames[finish])}</span>
            </label>
            <div className="finish-options">
              {p.colors.map((color, i) => (
                <button
                  className={`finish-swatch ${finish === i ? "active" : ""}`}
                  key={color}
                  style={{ background: color }}
                  onClick={() => setFinish(i)}
                  aria-label={t(p.finishNames[i])}
                  title={t(p.finishNames[i])}
                  aria-pressed={finish === i}
                >
                  {finish === i && <Check size={15} />}
                </button>
              ))}
            </div>
          </div>
          <div className="dimension-summary">
            <Ruler size={18} />
            <span>{p.dimensions.join(" × ")} cm</span>
            <small>
              {t("width")} × {t("height")} × {t("depth")}
            </small>
          </div>
          {p.custom ? (
            <Link
              className="button primary full"
              to={`/atelier?wood=${finish === 1 ? "walnut" : finish === 2 ? "ash" : "oak"}`}
            >
              <Box size={18} />
              {t("customize3d")}
              <ActionArrow size={18} />
            </Link>
          ) : (
            <div className="add-cart-row">
              <div className="quantity">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity === 1}
                  aria-label={`${t("quantity")} −`}
                >
                  <Minus size={15} />
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label={`${t("quantity")} +`}
                >
                  <Plus size={15} />
                </button>
              </div>
              <button
                className="button primary"
                onClick={() => addCart(p, finish, quantity)}
              >
                {t("addCart")}
                <ShoppingBag size={17} />
              </button>
            </div>
          )}
          {p.custom && (
            <button
              className="button outline full standard-order"
              onClick={() => addCart(p, finish, quantity)}
            >
              {t("addCart")}
              <ShoppingBag size={17} />
            </button>
          )}
          <button
            className="save-product text-link"
            onClick={() => toggleFavourite(p.id)}
            aria-pressed={favourites.includes(p.id)}
          >
            <Heart
              size={16}
              fill={favourites.includes(p.id) ? "currentColor" : "none"}
            />
            {t("favourites")}
          </button>
          <div className="product-services">
            <span>
              <span className="status-dot" />
              {t("availability")}
            </span>
            <span>
              <Truck size={17} />
              {t("deliveryEstimate")}
            </span>
            <span>
              <ShieldCheck size={17} />
              {t("craftsmanship")}
            </span>
          </div>
          <details open>
            <summary>
              {t("specifications")}
              <Plus size={15} />
            </summary>
            <p>{t("productStory")}</p>
            <dl>
              <div>
                <dt>{t("material")}</dt>
                <dd>{p.material[lang]}</dd>
              </div>
              <div>
                <dt>{t("dimensions")}</dt>
                <dd>{p.dimensions.join(" × ")} cm</dd>
              </div>
              <div>
                <dt>{t("warranty")}</dt>
                <dd>{t("warrantyValue")}</dd>
              </div>
            </dl>
          </details>
        </div>
      </div>
      <section className="related-products">
        <div className="section-heading">
          <h2>{t("related")}</h2>
          <Link className="text-link" to="/collection">
            {t("seeAll")}
            <ActionArrow size={16} />
          </Link>
        </div>
        <div className="product-grid">
          {related.map((x) => (
            <ProductCard key={x.id} product={x} />
          ))}
        </div>
      </section>
    </main>
  );
}
