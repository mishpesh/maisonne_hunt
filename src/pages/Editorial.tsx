import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import type { TranslationKey } from "../i18n";
import { useStore } from "../store";
export default function EditorialPage({
  type,
}: {
  type: "story" | "inspiration";
}) {
  const { t } = useStore();
  return (
    <main className="editorial-page container">
      <div className="breadcrumb">
        <Link to="/">{t("home")}</Link>
        <ChevronRight size={12} />
        <span>{t(type)}</span>
      </div>
      <div className="editorial-heading">
        <span className="eyebrow">MAISONNE / {t(type)}</span>
        <h1>{t(type === "story" ? "storyTitle" : "inspirationTitle")}</h1>
        <p>{t(type === "story" ? "storyBody" : "inspirationText")}</p>
      </div>
      {type === "story" ? (
        <>
          <img
            className="story-image"
            src="/images/hero.jpg"
            alt={t("storyTitle")}
          />
          <div className="story-bottom">
            <h2>{t("promiseTitle")}</h2>
            <div>
              <p>{t("storyBody2")}</p>
              <Link className="button primary" to="/collection">
                {t("explore")}
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="inspiration-grid">
          {[
            { image: "interior", title: "inspirationOne", category: "sofas" },
            { image: "bedroom", title: "inspirationTwo", category: "beds" },
            {
              image: "shelves",
              title: "inspirationThree",
              category: "storage",
            },
          ].map((x, i) => (
            <Link key={x.image} to={`/collection?category=${x.category}`}>
              <img
                src={`/images/${x.image}.jpg`}
                alt={t(x.title as TranslationKey)}
              />
              <span className="eyebrow">0{i + 1} / MAISONNE</span>
              <h2>
                {t(x.title as TranslationKey)}
                <ArrowUpRight size={21} />
              </h2>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
