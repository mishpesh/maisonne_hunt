import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Heart,
  MapPin,
  Menu,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import type { Language } from "../i18n";
import { money } from "../i18n";
import { imageUrl, matchesProduct, products } from "../data";
import { useStore } from "../store";
import Modal from "./Modal";
export default function Header() {
  const { t, lang, setLang, cart, setCartOpen, favourites } = useStore();
  const [mobile, setMobile] = useState(false),
    [search, setSearch] = useState(false),
    [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    setMobile(false);
    setSearch(false);
  }, [location.pathname, location.search]);
  const links = [
    ["/collection", "collection"],
    ["/atelier", "custom"],
    ["/story", "story"],
    ["/inspiration", "inspiration"],
  ] as const;
  return (
    <>
      <header>
        <div className="brand-bar">
          <div className="container brand-inner">
            <Link
              to="/"
              className="wordmark"
              aria-label={`MAISONNE — ${t("home")}`}
            >
              MAISONNE<span>®</span>
            </Link>
            <span className="brand-promise">{t("belgium")}</span>
            <div className="brand-utilities">
              <span className="location-label">
                <MapPin size={13} />
                Belgique / België
              </span>
              <div className="language-switch" aria-label="Language">
                {(["fr", "nl", "en"] as Language[]).map((l) => (
                  <button
                    key={l}
                    className={lang === l ? "active" : ""}
                    onClick={() => setLang(l)}
                    aria-pressed={lang === l}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="navigation-bar">
          <div className="container navigation-inner">
            <button
              className="icon-button mobile-menu-toggle"
              aria-label="Menu"
              aria-expanded={mobile}
              onClick={() => setMobile(!mobile)}
            >
              {mobile ? <X size={22} /> : <Menu size={22} />}
            </button>
            <nav aria-label={t("collection")}>
              {links.map(([path, key]) => (
                <NavLink key={path} to={path}>
                  {t(key)}
                  {key === "custom" && <span className="mini-tag">3D</span>}
                </NavLink>
              ))}
            </nav>
            <div className="nav-actions">
              <button
                className="search-trigger"
                onClick={() => setSearch(true)}
                aria-label={t("search")}
              >
                <Search size={18} />
                <span>{t("search")}</span>
              </button>
              <Link
                className="icon-button header-favourite"
                to="/favourites"
                aria-label={`${t("favourites")} (${favourites.length})`}
              >
                <Heart size={19} />
                {favourites.length > 0 && (
                  <span className="counter-dot">{favourites.length}</span>
                )}
              </Link>
              <button
                className="cart-trigger"
                onClick={() => setCartOpen(true)}
                aria-label={t("cart")}
              >
                <ShoppingBag size={19} />
                <span className="cart-count">
                  {cart.reduce((n, i) => n + i.quantity, 0)}
                </span>
              </button>
            </div>
          </div>
        </div>
        {mobile && (
          <nav className="mobile-nav">
            {links.map(([path, key]) => (
              <Link key={path} to={path}>
                {t(key)}
                <ArrowUpRight size={17} />
              </Link>
            ))}
          </nav>
        )}
      </header>
      <div className="announcement">
        <span>
          {t("announcement")}
          <span className="announcement-detail">
            {" "}
            {t("announcementDetail")}
          </span>
        </span>
        <Link to="/collection">
          {t("discover")}
          <ArrowRight size={13} />
        </Link>
      </div>
      {search && (
        <Modal
          title={t("search")}
          onClose={() => setSearch(false)}
          className="search-modal"
        >
          <form
            className="search-form"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/collection?q=${encodeURIComponent(query)}`);
              setSearch(false);
            }}
          >
            <Search size={20} />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search")}
              aria-label={t("search")}
            />
            <button
              type="submit"
              className="icon-button"
              aria-label={t("discover")}
            >
              <ArrowRight size={20} />
            </button>
          </form>
          <div className="search-results">
            {products
              .filter((p) => matchesProduct(p, query))
              .slice(0, 5)
              .map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  onClick={() => setSearch(false)}
                >
                  <img src={imageUrl(p.image)} alt={p.name[lang]} />
                  <div>
                    <span>{p.name[lang]}</span>
                    <small>{t(p.category)}</small>
                  </div>
                  <span className="price">{money(p.price, lang)}</span>
                  <ChevronRight size={16} />
                </Link>
              ))}
            {products.filter((p) => matchesProduct(p, query)).length === 0 && (
              <p className="empty-search">{t("noResults")}</p>
            )}
          </div>
          <button
            className="button outline full"
            onClick={() => {
              navigate(`/collection?q=${encodeURIComponent(query)}`);
              setSearch(false);
            }}
          >
            {t("seeAll")}
            <ArrowRight size={16} />
          </button>
        </Modal>
      )}
    </>
  );
}
