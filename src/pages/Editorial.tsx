import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { useStore } from "../store";
export default function EditorialPage() {
  const { t } = useStore();
  return (
    <main className="editorial-page container">
      <div className="breadcrumb">
        <Link to="/">{t("home")}</Link>
        <ChevronRight size={12} />
        <span>{t("story")}</span>
      </div>
      <div className="editorial-heading">
        <span className="eyebrow">MAISONNE / {t("story")}</span>
        <h1>{t("storyTitle")}</h1>
        <p>{t("storyBody")}</p>
      </div>

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
    </main>
  );
}
