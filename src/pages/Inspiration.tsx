import ActionArrow from "../components/ActionArrow";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowDown, ArrowLeft, ChevronRight } from "lucide-react";
import { products } from "../data";
import { roomCopy, rooms } from "../rooms";
import type { RoomStory } from "../rooms";
import { useStore } from "../store";
import ProductCard from "../components/ProductCard";
import "../rooms.css";

function RoomCard({ room, index }: { room: RoomStory; index: number }) {
  const { lang, t } = useStore();
  const copy = roomCopy[lang];
  return (
    <Link className="room-card" to={`/inspiration/${room.id}`}>
      <div className="room-card-photo">
        <img src={room.image} alt={room.category[lang]} loading="lazy" />
      </div>
      <div className="room-card-meta">
        <span>
          0{index + 1} / {room.category[lang]}
        </span>
        <span>
          {room.productIds.length} {t("products")}
        </span>
      </div>
      <h2>{room.title[lang]}</h2>
      <p>{room.intro[lang]}</p>
      <span className="room-card-link">
        {copy.explore}
        <ActionArrow size={18} />
      </span>
    </Link>
  );
}

export default function InspirationPage() {
  const { roomId } = useParams();
  const { t, lang } = useStore();
  const copy = roomCopy[lang];
  const room = rooms.find((room) => room.id === roomId);
  if (roomId && !room) return <Navigate to="/inspiration" replace />;
  if (!room)
    return (
      <main className="room-index container">
        <div className="breadcrumb">
          <Link to="/">{t("home")}</Link>
          <ChevronRight size={12} />
          <span>{t("inspiration")}</span>
        </div>
        <header className="room-index-heading">
          <span className="eyebrow">{copy.edit}</span>
          <h1>{t("inspirationTitle")}</h1>
          <p>{t("inspirationText")}</p>
        </header>
        <div className="room-index-grid">
          {rooms.map((item, index) => (
            <RoomCard key={item.id} room={item} index={index} />
          ))}
        </div>
      </main>
    );
  const selection = room.productIds.flatMap((id) => {
    const product = products.find((p) => p.id === id);
    return product ? [product] : [];
  });
  const number = rooms.indexOf(room) + 1;
  return (
    <main className="room-page container">
      <div className="breadcrumb">
        <Link to="/">{t("home")}</Link>
        <ChevronRight size={12} />
        <Link to="/inspiration">{t("inspiration")}</Link>
        <ChevronRight size={12} />
        <span>{room.category[lang].split(" · ")[0]}</span>
      </div>
      <header className="room-heading">
        <div>
          <span className="eyebrow">
            0{number} / {room.category[lang]}
          </span>
          <h1>{room.title[lang]}</h1>
        </div>
        <div className="room-heading-copy">
          <p>{room.intro[lang]}</p>
          <a className="room-inline-link" href="#room-pieces">
            {copy.browse}
            <ArrowDown size={18} />
          </a>
        </div>
      </header>
      <figure className="room-hero">
        <img src={room.image} alt={room.intro[lang]} fetchPriority="high" />
        <figcaption>
          <span>MAISONNE / {copy.photo}</span>
          <a href={room.credits[0].url} target="_blank" rel="noreferrer">
            {room.credits[0].name}
            <ActionArrow size={12} />
          </a>
        </figcaption>
      </figure>
      <section className="room-palette" aria-label={copy.palette}>
        <span className="eyebrow">{copy.palette}</span>
        <div>
          {room.palette.map((tone) => (
            <span className="room-palette-tone" key={tone.color}>
              <i style={{ background: tone.color }} />
              <span>{tone.label[lang]}</span>
            </span>
          ))}
        </div>
      </section>
      <section className="room-study">
        <div className="room-study-copy">
          <span className="eyebrow">{copy.ideas}</span>
          <h2>{room.lead[lang]}</h2>
          <p>{room.body[lang]}</p>
          <div className="room-ideas">
            {room.ideas.map((idea, index) => (
              <div key={index}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{idea.title[lang]}</h3>
                  <p>{idea.body[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <figure className="room-secondary">
          <img
            src={room.secondaryImage}
            alt={room.secondaryCaption[lang]}
            loading="lazy"
          />
          <figcaption>{room.secondaryCaption[lang]}</figcaption>
        </figure>
      </section>
      <section
        className="room-selection"
        id="room-pieces"
        aria-labelledby="room-pieces-title"
      >
        <div className="room-section-heading">
          <div>
            <span className="eyebrow">MAISONNE / {t("collection")}</span>
            <h2 id="room-pieces-title">{copy.selection}</h2>
          </div>
          <p>{copy.selectionText}</p>
        </div>
        <div className="product-grid room-product-grid">
          {selection.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <section className="room-more">
        <div className="room-section-heading">
          <h2>{copy.next}</h2>
          <Link className="room-inline-link" to="/inspiration">
            <ArrowLeft size={17} />
            {copy.back}
          </Link>
        </div>
        <div className="room-more-grid">
          {rooms
            .filter((item) => item.id !== room.id)
            .map((item) => (
              <RoomCard key={item.id} room={item} index={rooms.indexOf(item)} />
            ))}
        </div>
      </section>
      <div className="room-photo-credits">
        <span>{copy.source}</span>
        {room.credits.map((credit) => (
          <a
            href={credit.url}
            key={credit.url}
            target="_blank"
            rel="noreferrer"
          >
            {credit.name}
            <ActionArrow size={12} />
          </a>
        ))}
      </div>
    </main>
  );
}
