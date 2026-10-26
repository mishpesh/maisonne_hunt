import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  Send,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "../store";
import { imageUrl, products, unitPrice } from "../data";
import { money } from "../i18n";
import type { TranslationKey } from "../i18n";
import Modal from "./Modal";
export function Cart() {
  const { cart, lang, t, updateCart, setCartOpen } = useStore();
  const [complete, setComplete] = useState(false);
  const validItems = cart.flatMap((i) => {
    const p = products.find((p) => p.id === i.id);
    return p ? [{ ...i, product: p }] : [];
  });
  const total = validItems.reduce(
    (sum, i) => sum + unitPrice(i.product, i.finish) * i.quantity,
    0,
  );
  return (
    <Modal
      title={t("cart")}
      onClose={() => setCartOpen(false)}
      className="drawer-backdrop"
    >
      <div className="cart-content">
        {complete ? (
          <div className="empty-state">
            <span className="success-icon">
              <Check size={28} />
            </span>
            <h3>{t("orderThanks")}</h3>
            <p>{t("orderText")}</p>
            <button
              className="button primary"
              onClick={() => setCartOpen(false)}
            >
              {t("continueShopping")}
              <ArrowRight size={16} />
            </button>
          </div>
        ) : validItems.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={40} strokeWidth={1} />
            <h3>{t("cartEmpty")}</h3>
            <p>{t("cartEmptyText")}</p>
            <Link
              className="button primary"
              to="/collection"
              onClick={() => setCartOpen(false)}
            >
              {t("explore")}
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {validItems.map((i) => (
                <div className="cart-item" key={`${i.id}-${i.finish}`}>
                  <Link
                    to={`/product/${i.id}`}
                    onClick={() => setCartOpen(false)}
                  >
                    <img
                      src={imageUrl(i.product.image)}
                      alt={i.product.name[lang]}
                    />
                  </Link>
                  <div className="cart-item-main">
                    <Link
                      to={`/product/${i.id}`}
                      onClick={() => setCartOpen(false)}
                    >
                      <h3>{i.product.name[lang]}</h3>
                    </Link>
                    <p>
                      {t(
                        i.product.finishNames[i.finish] ||
                          i.product.finishNames[0],
                      )}
                    </p>
                    <div className="quantity">
                      <button
                        onClick={() =>
                          updateCart(i.id, i.finish, i.quantity - 1)
                        }
                        aria-label={`${t("quantity")} −`}
                      >
                        <Minus size={13} />
                      </button>
                      <span>{i.quantity}</span>
                      <button
                        onClick={() =>
                          updateCart(i.id, i.finish, i.quantity + 1)
                        }
                        aria-label={`${t("quantity")} +`}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-end">
                    <span className="price">
                      {money(unitPrice(i.product, i.finish) * i.quantity, lang)}
                    </span>
                    <button
                      className="icon-button"
                      onClick={() => updateCart(i.id, i.finish, 0)}
                      aria-label={t("remove")}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <div>
                <span>{t("subtotal")}</span>
                <span>{money(total, lang)}</span>
              </div>
              <div>
                <span>
                  {total >= 750 ? t("freeShipping") : t("shippingCalc")}
                </span>
                <span>{total >= 750 ? "€ 0" : "—"}</span>
              </div>
              <div className="cart-total">
                <span>{t("total")}</span>
                <span>{money(total, lang)}</span>
              </div>
              <p className="small muted">{t("tax")}</p>
              <button
                className="button primary full"
                onClick={() => setComplete(true)}
              >
                {t("checkout")}
                <ArrowRight size={17} />
              </button>
              <p className="demo-note">{t("cartNote")}</p>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
type ChatMessage = {
  role: "user" | "assistant";
  key?: TranslationKey;
  text?: string;
  productId?: string;
};
export function Assistant() {
  const { t, lang, chatOpen, setChatOpen } = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing, chatOpen]);
  useEffect(() => {
    if (chatOpen) inputRef.current?.focus();
  }, [chatOpen]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setChatOpen(false);
    };
    if (chatOpen) window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [chatOpen, setChatOpen]);
  function ask(text: string, key?: TranslationKey) {
    if (!text.trim() || typing) return;
    setMessages((m) => [
      ...m,
      { role: "user", text: key ? undefined : text, key },
    ]);
    setInput("");
    setTyping(true);
    const normalized = text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    const product = products.find((p) =>
      new RegExp(`\\b${p.id}\\b`).test(normalized),
    );
    let response: TranslationKey = "replyDefault";
    if (
      key === "askDelivery" ||
      /livrai|deliver|belgi|lever|shipping/.test(normalized)
    )
      response = "replyDelivery";
    else if (
      key === "askCustom" ||
      /3d|custom|mesure|armoire|wardrobe|kast|maat/.test(normalized)
    )
      response = "replyCustom";
    else if (
      key === "askReturns" ||
      /retou|return|order|command|bestel|garanti/.test(normalized)
    )
      response = "replyReturns";
    else if (
      key === "askMaterials" ||
      /mater|wood|bois|hout|dimens|afmet|tissu|color|couleur/.test(normalized)
    )
      response = "replyMaterials";
    timer.current = setTimeout(() => {
      setMessages((m) => [
        ...m,
        { role: "assistant", key: response, productId: product?.id },
      ]);
      setTyping(false);
    }, 450);
  }
  const questions: TranslationKey[] = [
    "askDelivery",
    "askCustom",
    "askMaterials",
    "askReturns",
  ];
  return (
    <>
      <AnimatePresence>
        {chatOpen && (
          <motion.section
            className="assistant-panel"
            role="dialog"
            aria-label={t("assistant")}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            <div className="assistant-heading">
              <span className="assistant-symbol">
                <Sparkles size={21} />
              </span>
              <div>
                <h2>{t("assistant")}</h2>
                <small>{t("assistantDemo")}</small>
              </div>
              <button
                className="icon-button"
                onClick={() => setChatOpen(false)}
                aria-label={t("close")}
              >
                <X size={19} />
              </button>
            </div>
            <div className="chat-messages" ref={listRef} aria-live="polite">
              <span className="chat-date">
                MAISONNE /{" "}
                {new Date().toLocaleDateString(
                  lang === "en" ? "en-GB" : `${lang}-BE`,
                  { day: "numeric", month: "long" },
                )}
              </span>
              <div className="message assistant-message">{t("welcome")}</div>
              {messages.length === 0 && (
                <div className="suggestions">
                  {questions.map((key) => (
                    <button key={key} onClick={() => ask(t(key), key)}>
                      {t(key)}
                      <ArrowRight size={14} />
                    </button>
                  ))}
                </div>
              )}
              {messages.map((m, i) => {
                const p = products.find((p) => p.id === m.productId);
                return (
                  <div
                    key={i}
                    className={`message ${m.role === "assistant" ? "assistant-message" : "user-message"}`}
                  >
                    {p ? (
                      <>
                        {p.name[lang]} · {p.material[lang]}
                        <br />
                        {t("dimensions")} : {p.dimensions.join(" × ")} cm
                        <br />
                        <Link
                          to={`/product/${p.id}`}
                          onClick={() => setChatOpen(false)}
                        >
                          {t("viewProduct")} →
                        </Link>
                      </>
                    ) : m.key ? (
                      t(m.key)
                    ) : (
                      m.text
                    )}
                  </div>
                );
              })}
              {typing && (
                <div
                  className="message assistant-message typing"
                  aria-label={t("assistant")}
                >
                  •••
                </div>
              )}
            </div>
            <button
              className="studio-chat-link"
              onClick={() => {
                navigate("/atelier");
                setChatOpen(false);
              }}
            >
              {t("openStudio")}
              <ArrowRight size={15} />
            </button>
            <form
              className="chat-input"
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chatPlaceholder")}
                aria-label={t("chatPlaceholder")}
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label={t("send")}
              >
                <Send size={18} />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
      <button
        className={`assistant-launcher ${chatOpen ? "is-open" : ""}`}
        onClick={() => setChatOpen(!chatOpen)}
        aria-expanded={chatOpen}
        aria-label={t("assistant")}
      >
        {chatOpen ? (
          <X size={21} />
        ) : (
          <>
            <Sparkles size={20} />
            <span>{t("assistant")}</span>
            <span className="online-dot" />
          </>
        )}
      </button>
    </>
  );
}
