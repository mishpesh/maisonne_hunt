import { Heart, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { imageUrl } from "../data";
import type { Product } from "../data";
import { money } from "../i18n";
import { useStore } from "../store";

export default function ProductCard({ product: p }: { product: Product }) {
  const { lang, t, favourites, toggleFavourite } = useStore();
  const fav = favourites.includes(p.id);

  return (
    <article className="product-card">
      <div className="product-image" data-product={p.id}>
        <Link to={`/product/${p.id}`} aria-label={p.name[lang]}>
          <img
            src={imageUrl(p.image)}
            alt={p.name[lang]}
            loading="lazy"
            style={{ objectPosition: p.position }}
          />
        </Link>
        {p.badge && (
          <span className={`product-badge ${p.custom ? "custom" : ""}`}>
            {t(p.badge)}
          </span>
        )}
        <button
          className={`favourite icon-button ${fav ? "selected" : ""}`}
          aria-label={`${t("favourites")} · ${p.name[lang]}`}
          aria-pressed={fav}
          onClick={() => toggleFavourite(p.id)}
        >
          <Heart size={18} fill={fav ? "currentColor" : "none"} />
        </button>
        <Link to={`/product/${p.id}`} className="product-reveal">
          {t("viewProduct")}
          <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="product-info">
        <div className="product-copy">
          <p className="product-category">{t(p.category)}</p>
          <Link to={`/product/${p.id}`}>
            <h3>{p.name[lang]}</h3>
          </Link>
          <p className="product-material">{p.material[lang]}</p>
          <p className="product-dimensions">
            {p.dimensions[0]} × {p.dimensions[1]} × {p.dimensions[2]} cm
          </p>
        </div>
        <span className="price">
          {p.custom && <small>{t("from")} </small>}
          {money(p.price, lang)}
        </span>
      </div>
      <div className="card-swatches">
        {p.colors.map((color, index) => (
          <span
            key={color}
            style={{ background: color }}
            title={t(p.finishNames[index])}
            aria-label={t(p.finishNames[index])}
          />
        ))}
        <small>
          {p.colors.length}{" "}
          {t(p.colors.length === 1 ? "finish" : "finishes").toLocaleLowerCase(
            lang,
          )}
        </small>
      </div>
    </article>
  );
}
