import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronRight, Heart, Search, X } from "lucide-react";
import type { TranslationKey } from "../i18n";
import { categories, matchesProduct, products } from "../data";
import { useStore } from "../store";
import ProductCard from "../components/ProductCard";
import Select from "../components/Select";

type MaterialFilter = "all" | "wood" | "upholstery" | "metal";

const filterCopy = {
  fr: {
    refine: "Affiner la sélection",
    material: "Matière",
    allMaterials: "Toutes les matières",
    wood: "Bois & placage",
    upholstery: "Tissu & textile",
    metal: "Métal & laque",
    finish: "Finition",
    allFinishes: "Toutes les finitions",
    price: "Fourchette de prix",
    min: "Min. €",
    max: "Max. €",
    custom: "Sur mesure uniquement",
    clear: "Effacer les filtres",
  },
  nl: {
    refine: "Verfijn je selectie",
    material: "Materiaal",
    allMaterials: "Alle materialen",
    wood: "Hout & fineer",
    upholstery: "Stof & textiel",
    metal: "Metaal & lak",
    finish: "Afwerking",
    allFinishes: "Alle afwerkingen",
    price: "Prijsbereik",
    min: "Min. €",
    max: "Max. €",
    custom: "Alleen maatwerk",
    clear: "Filters wissen",
  },
  en: {
    refine: "Refine your selection",
    material: "Material",
    allMaterials: "All materials",
    wood: "Wood & veneer",
    upholstery: "Fabric & upholstery",
    metal: "Metal & lacquer",
    finish: "Finish",
    allFinishes: "All finishes",
    price: "Price range",
    min: "Min. €",
    max: "Max. €",
    custom: "Made to measure only",
    clear: "Clear filters",
  },
} as const;

function materialGroup(value: string): Exclude<MaterialFilter, "all"> {
  const normalised = value.toLocaleLowerCase();
  if (
    ["tissu", "stof", "fabric", "upholstery", "boucle", "textile"].some(
      (part) => normalised.includes(part),
    )
  ) {
    return "upholstery";
  }
  if (["métal", "metal", "metaal"].some((part) => normalised.includes(part))) {
    return "metal";
  }
  return "wood";
}

export default function Catalog({
  favouritesOnly = false,
}: {
  favouritesOnly?: boolean;
}) {
  const { t, lang, favourites } = useStore();
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "all";
  const query = params.get("q") || "";
  const [sort, setSort] = useState("recommended");
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialFilter>("all");
  const [selectedFinish, setSelectedFinish] = useState<TranslationKey | "all">(
    "all",
  );
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [customOnly, setCustomOnly] = useState(false);
  const labels = filterCopy[lang];
  const finishOptions = Array.from(
    new Set(products.flatMap((product) => product.finishNames)),
  );
  const activeFilterCount = [
    selectedMaterial !== "all",
    selectedFinish !== "all",
    minPrice !== "",
    maxPrice !== "",
    customOnly,
  ].filter(Boolean).length;

  let list = products.filter(
    (product) =>
      (!favouritesOnly || favourites.includes(product.id)) &&
      (category === "all" || product.category === category) &&
      matchesProduct(product, query) &&
      (selectedMaterial === "all" ||
        materialGroup(product.material[lang]) === selectedMaterial) &&
      (selectedFinish === "all" ||
        product.finishNames.includes(selectedFinish)) &&
      (minPrice === "" || product.price >= Number(minPrice)) &&
      (maxPrice === "" || product.price <= Number(maxPrice)) &&
      (!customOnly || Boolean(product.custom)),
  );

  if (sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "nameSort") {
    list = [...list].sort((a, b) =>
      a.name[lang].localeCompare(b.name[lang], lang),
    );
  }

  const clearFilters = () => {
    setSelectedMaterial("all");
    setSelectedFinish("all");
    setMinPrice("");
    setMaxPrice("");
    setCustomOnly(false);
    setParams({});
    setSort("recommended");
  };

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
              setParams((current) => {
                current.delete("q");
                return current;
              })
            }
          >
            <X size={15} />
          </button>
        </div>
      )}

      <div className="catalog-toolbar">
        <div className="filter-tabs" aria-label={t("collection")}>
          {[{ id: "all" }, ...categories].map((item) => (
            <button
              key={item.id}
              onClick={() =>
                setParams((current) => {
                  item.id === "all"
                    ? current.delete("category")
                    : current.set("category", item.id);
                  return current;
                })
              }
              className={category === item.id ? "active" : ""}
              aria-pressed={category === item.id}
            >
              {t(item.id as TranslationKey)}
            </button>
          ))}
        </div>
        <Select
          className="sort-control"
          label={t("sort")}
          value={sort}
          onChange={setSort}
          options={["recommended", "priceAsc", "priceDesc", "nameSort"].map(
            (key) => ({ value: key, label: t(key as TranslationKey) }),
          )}
        />
      </div>

      <section className="catalog-filter-panel" aria-label={labels.refine}>
        <div className="catalog-filter-heading">
          <span>{labels.refine}</span>
          {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
        </div>
        <div className="catalog-filter-bar">
          <div className="catalog-filter-field">
            <span>{labels.material}</span>
            <Select
              label={labels.material}
              value={selectedMaterial}
              onChange={setSelectedMaterial}
              options={(["all", "wood", "upholstery", "metal"] as const).map(
                (value) => ({
                  value,
                  label: value === "all" ? labels.allMaterials : labels[value],
                }),
              )}
            />
          </div>
          <div className="catalog-filter-field">
            <span>{labels.finish}</span>
            <Select
              label={labels.finish}
              value={selectedFinish}
              onChange={setSelectedFinish}
              options={[
                { value: "all", label: labels.allFinishes },
                ...finishOptions.map((finish) => ({
                  value: finish,
                  label: t(finish),
                })),
              ]}
            />
          </div>
          <div className="catalog-price-range">
            <span>{labels.price}</span>
            <div>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                placeholder={labels.min}
                aria-label={labels.min}
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
              />
              <input
                type="number"
                min="0"
                inputMode="numeric"
                placeholder={labels.max}
                aria-label={labels.max}
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
              />
            </div>
          </div>
          <label className="catalog-custom-filter">
            <input
              type="checkbox"
              checked={customOnly}
              onChange={(event) => setCustomOnly(event.target.checked)}
            />
            <span>{labels.custom}</span>
          </label>
          {activeFilterCount > 0 && (
            <button
              className="catalog-filter-reset"
              type="button"
              onClick={clearFilters}
            >
              {labels.clear}
              <X size={14} />
            </button>
          )}
        </div>
      </section>

      <p className="catalog-count">
        <strong>{list.length}</strong> {t("products")}
      </p>
      {list.length ? (
        <div className="product-grid catalog-grid">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
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
          <button className="button outline" onClick={clearFilters}>
            {t("resetFilters")}
          </button>
        </div>
      )}
    </main>
  );
}
