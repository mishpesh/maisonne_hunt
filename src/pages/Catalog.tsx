import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronDown, ChevronRight, Heart, Search, X } from "lucide-react";
import type { TranslationKey } from "../i18n";
import { categories, matchesProduct, products } from "../data";
import { useStore } from "../store";
import ProductCard from "../components/ProductCard";
export default function Catalog({
  favouritesOnly = false,
}: {
  favouritesOnly?: boolean;
}) {
  const { t, lang, favourites } = useStore();
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "all",
    query = params.get("q") || "";
  const [sort, setSort] = useState("recommended");
  let list = products.filter(
    (p) =>
      (!favouritesOnly || favourites.includes(p.id)) &&
      (category === "all" || p.category === category) &&
      matchesProduct(p, query),
  );
  if (sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "nameSort")
    list = [...list].sort((a, b) =>
      a.name[lang].localeCompare(b.name[lang], lang),
    );
  return (
    <main className="catalog-page container">
      <div className="breadcrumb">
        <Link to="/">{t("home")}</Link>
        <ChevronRight size={12} />
        <span>{t(favouritesOnly ? "favourites" : "collection")}</span>
      </div>
      <div className="catalog-heading">
        <p className="eyebrow">
          MAISONNE / {t(favouritesOnly ? "favourites" : "collection")}
        </p>
        <h1>{t(favouritesOnly ? "favouritesTitle" : "catalogTitle")}</h1>
        <p>{t(favouritesOnly ? "favouritesEmpty" : "catalogText")}</p>
      </div>
      {query && (
        <div className="query-chip">
          {t("resultsFor")} « {query} »
          <button
            className="icon-button"
            aria-label={t("close")}
            onClick={() =>
              setParams((p) => {
                p.delete("q");
                return p;
              })
            }
          >
            <X size={15} />
          </button>
        </div>
      )}
      <div className="catalog-toolbar">
        <div className="filter-tabs">
          {[{ id: "all" }, ...categories].map((c) => (
            <button
              key={c.id}
              onClick={() =>
                setParams((p) => {
                  c.id === "all"
                    ? p.delete("category")
                    : p.set("category", c.id);
                  return p;
                })
              }
              className={category === c.id ? "active" : ""}
              aria-pressed={category === c.id}
            >
              {t(c.id as TranslationKey)}
            </button>
          ))}
        </div>
        <label className="sort-select">
          <span className="sr-only">{t("sort")}</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {["recommended", "priceAsc", "priceDesc", "nameSort"].map((k) => (
              <option key={k} value={k}>
                {t(k as TranslationKey)}
              </option>
            ))}
          </select>
          <ChevronDown size={14} />
        </label>
      </div>
      <p className="catalog-count">
        {list.length} {t("products")}
      </p>
      {list.length ? (
        <div className="product-grid catalog-grid">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : favouritesOnly && favourites.length === 0 ? (
        <div className="empty-state">
          <Heart size={32} strokeWidth={1} />
          <h2>{t("favouritesEmpty")}</h2>
          <Link className="button primary" to="/collection">
            {t("explore")}
          </Link>
        </div>
      ) : (
        <div className="empty-state">
          <Search size={32} strokeWidth={1} />
          <h2>{t("noResults")}</h2>
          <button
            className="button outline"
            onClick={() => {
              setParams({});
              setSort("recommended");
            }}
          >
            {t("resetFilters")}
          </button>
        </div>
      )}
    </main>
  );
}
