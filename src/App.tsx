import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { products } from "./data";
import { StoreProvider, useStore } from "./store";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Assistant, Cart } from "./components/Overlays";
const Catalog = lazy(() => import("./pages/Catalog"));
const ProductPage = lazy(() => import("./pages/Product"));
const EditorialPage = lazy(() => import("./pages/Editorial"));
const Configurator = lazy(() => import("./components/Configurator"));
function Shell() {
  const { cartOpen, toast, t, lang } = useStore();
  const location = useLocation();
  const { pathname } = location;
  useEffect(() => {
    document.body.classList.toggle("studio-open", pathname === "/atelier");
    return () => document.body.classList.remove("studio-open");
  }, [pathname]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  useEffect(() => {
    document.title = `MAISONNE — ${pathname === "/atelier" ? t("studio") : pathname.startsWith("/product/") ? products.find((p) => p.id === pathname.split("/")[2])?.name[lang] || t("collection") : pathname === "/collection" ? t("collection") : pathname === "/favourites" ? t("favourites") : pathname === "/story" ? t("story") : pathname === "/inspiration" ? t("inspiration") : t("collection")}`;
  }, [pathname, lang, t]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        {t("discover")}
      </a>
      <Header />
      <div id="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Suspense
              fallback={
                <div className="page-loading">
                  MAISONNE
                  <span />
                </div>
              }
            >
              <Routes location={location}>
                <Route path="/" element={<Navigate to="/collection" replace />} />
                <Route path="/collection" element={<Catalog />} />
                <Route
                  path="/favourites"
                  element={<Catalog favouritesOnly />}
                />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/atelier" element={<Configurator />} />
                <Route path="/story" element={<EditorialPage type="story" />} />
                <Route
                  path="/inspiration"
                  element={<EditorialPage type="inspiration" />}
                />
                <Route path="*" element={<Navigate to="/collection" replace />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
      {pathname !== "/atelier" && <Footer />}
      <Assistant />
      {cartOpen && <Cart />}
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            className="toast"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
          >
            <Check size={17} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
