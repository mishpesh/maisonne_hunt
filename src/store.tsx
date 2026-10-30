import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { translations } from "./i18n";
import type { Language, TranslationKey } from "./i18n";
import { products } from "./data";
import type { Product } from "./data";
export type CartItem = { id: string; finish: number; quantity: number };
function stored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Browser storage can be disabled. */
  }
}
const StoreContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  cart: CartItem[];
  addCart: (p: Product, finish: number, quantity?: number) => void;
  updateCart: (id: string, finish: number, quantity: number) => void;
  favourites: string[];
  toggleFavourite: (id: string) => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
  toast: string;
  notify: (key: TranslationKey) => void;
}>(null!);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const x = stored<Language>("maisonne-language", "fr");
    return ["fr", "nl", "en"].includes(x) ? x : "fr";
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const x = stored<CartItem[]>("maisonne-cart", []);
    return Array.isArray(x)
      ? x.filter(
          (i) =>
            typeof i.id === "string" &&
            products.some((p) => p.id === i.id) &&
            Number.isInteger(i.quantity) &&
            i.quantity > 0 &&
            Number.isInteger(i.finish),
        )
      : [];
  });
  const [favourites, setFavourites] = useState<string[]>(() => {
    const x = stored<string[]>("maisonne-favourites", []);
    return Array.isArray(x)
      ? x.filter(
          (i) => typeof i === "string" && products.some((p) => p.id === i),
        )
      : [];
  });
  const [cartOpen, setCartOpen] = useState(false),
    [chatOpen, setChatOpen] = useState(false),
    [toast, setToast] = useState<TranslationKey | null>(null);
  const t = (key: TranslationKey) => translations[lang][key];
  useEffect(() => {
    write("maisonne-language", lang);
    document.documentElement.lang = lang === "en" ? "en" : `${lang}-BE`;
  }, [lang]);
  useEffect(() => write("maisonne-cart", cart), [cart]);
  useEffect(() => write("maisonne-favourites", favourites), [favourites]);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  function addCart(p: Product, finish: number, quantity = 1) {
    setCart((items) => {
      const match = items.find((i) => i.id === p.id && i.finish === finish);
      return match
        ? items.map((i) =>
            i === match ? { ...i, quantity: i.quantity + quantity } : i,
          )
        : [...items, { id: p.id, finish, quantity }];
    });
    setToast("added");
    setCartOpen(true);
  }
  function updateCart(id: string, finish: number, quantity: number) {
    setCart((items) =>
      quantity <= 0
        ? items.filter((i) => !(i.id === id && i.finish === finish))
        : items.map((i) =>
            i.id === id && i.finish === finish ? { ...i, quantity } : i,
          ),
    );
  }
  function toggleFavourite(id: string) {
    setFavourites((items) =>
      items.includes(id) ? items.filter((x) => x !== id) : [...items, id],
    );
    setToast(favourites.includes(id) ? "unsaved" : "saved");
  }
  return (
    <StoreContext.Provider
      value={{
        lang,
        setLang,
        t,
        cart,
        addCart,
        updateCart,
        favourites,
        toggleFavourite,
        cartOpen,
        setCartOpen,
        chatOpen,
        setChatOpen,
        toast: toast ? t(toast) : "",
        notify: setToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
export const useStore = () => useContext(StoreContext);
