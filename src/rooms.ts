import type { Language } from "./i18n";
type LocalText = Record<Language, string>;
const text = (fr: string, nl: string, en: string): LocalText => ({
  fr,
  nl,
  en,
});
export type RoomStory = {
  id: string;
  title: LocalText;
  category: LocalText;
  intro: LocalText;
  lead: LocalText;
  body: LocalText;
  image: string;
  secondaryImage: string;
  secondaryCaption: LocalText;
  productIds: string[];
  palette: { color: string; label: LocalText }[];
  ideas: { title: LocalText; body: LocalText }[];
  credits: { name: string; url: string }[];
};
export const rooms: RoomStory[] = [
  {
    id: "soft-living",
    title: text(
      "La lumière comme invitée.",
      "Laat het licht binnen.",
      "A softer kind of living.",
    ),
    category: text(
      "Salon · Naturel & lumineux",
      "Woonkamer · Licht & natuurlijk",
      "Living room · Light & natural",
    ),
    intro: text(
      "Des tissus écrus, du bois chaleureux et de l’espace pour respirer.",
      "Ecru stoffen, warm hout en ruimte om te ademen.",
      "Cream textiles, warm timber and a little room to breathe.",
    ),
    lead: text(
      "Un salon qui ralentit le rythme.",
      "Een woonkamer om tot rust te komen.",
      "Make space for slower moments.",
    ),
    body: text(
      "La lumière donne le ton, les matières font le reste. Associez une assise généreuse à un fauteuil plus léger, puis laissez les objets et les plantes apporter leur personnalité.",
      "Het licht zet de toon, de materialen doen de rest. Combineer een royale bank met een luchtigere stoel en laat boeken, planten en persoonlijke vondsten het verhaal vertellen.",
      "Let daylight set the tone, then build around the textures. Pair generous seating with a lighter accent chair, and let books, plants and personal objects make the room your own.",
    ),
    image: "/images/rooms/living.jpg",
    secondaryImage: "/images/interior.jpg",
    secondaryCaption: text(
      "Une autre interprétation : des fibres naturelles et une touche de verdure.",
      "Een tweede interpretatie: natuurlijke vezels en een vleugje groen.",
      "Another interpretation: natural fibres and a touch of green.",
    ),
    productIds: ["soren", "elo", "milo", "noma"],
    palette: [
      {
        color: "#e8e2d4",
        label: text("Lin écru", "Ecru linnen", "Natural linen"),
      },
      {
        color: "#bda27e",
        label: text("Chêne clair", "Licht eiken", "Light oak"),
      },
      {
        color: "#89937a",
        label: text("Vert végétal", "Bladgroen", "Leaf green"),
      },
    ],
    ideas: [
      {
        title: text(
          "Laissez entrer le jour",
          "Laat het daglicht binnen",
          "Let the light in",
        ),
        body: text(
          "Choisissez des voilages légers et gardez les meubles bas près des fenêtres.",
          "Kies lichte gordijnen en zet lage meubels bij het raam.",
          "Choose sheer curtains and keep furniture low around the windows.",
        ),
      },
      {
        title: text(
          "Mélangez les textures",
          "Meng de texturen",
          "Layer the textures",
        ),
        body: text(
          "Le bois, le tissu tissé et un tapis doux apportent du relief sans multiplier les couleurs.",
          "Hout, geweven stof en een zacht tapijt geven diepte zonder veel verschillende kleuren.",
          "Timber, woven fabric and a soft rug create depth within a restrained palette.",
        ),
      },
    ],
    credits: [
      {
        name: "Spacejoy / Unsplash",
        url: "https://unsplash.com/photos/a-living-room-filled-with-furniture-and-a-large-window-ctyssSFmXmU",
      },
      {
        name: "Unsplash",
        url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace",
      },
    ],
  },
  {
    id: "quiet-bedroom",
    title: text(
      "Des matins plus doux.",
      "Zachtere ochtenden.",
      "Room for quiet mornings.",
    ),
    category: text(
      "Chambre · Calme & enveloppante",
      "Slaapkamer · Zacht & rustig",
      "Bedroom · Calm & cocooning",
    ),
    intro: text(
      "Une tête de lit douce, des nuances minérales et des rangements discrets.",
      "Een zacht hoofdbord, rustige steentinten en discrete opbergruimte.",
      "A soft headboard, quiet stone shades and storage that keeps life simple.",
    ),
    lead: text(
      "Le repos commence par l’espace.",
      "Rust begint met ruimte.",
      "A calmer room, a gentler routine.",
    ),
    body: text(
      "Un lit rembourré devient le point d’ancrage de la pièce. Autour, des meubles clairs et des textiles souples gardent une atmosphère légère. Pour une interprétation plus naturelle, remplacez le tissu par un cadre en bois.",
      "Een gestoffeerd bed wordt het rustige middelpunt. Lichte meubels en zachte stoffen houden de kamer luchtig. Wie het natuurlijker wil, kiest een houten bedframe als alternatief.",
      "An upholstered bed gives the room a quiet focal point. Light storage and soft textiles keep the rest of the space airy. Prefer a more natural expression? A timber bed is an easy alternative.",
    ),
    image: "/images/rooms/bedroom.jpg",
    secondaryImage: "/images/rooms/bedroom-window.jpg",
    secondaryCaption: text(
      "Le même lit, dans une ambiance lumineuse aux tons de pierre.",
      "Hetzelfde bed in een licht interieur met zachte steentinten.",
      "The same bed in a brighter setting with soft stone tones.",
    ),
    productIds: ["aube", "noa", "noma", "atelier"],
    palette: [
      {
        color: "#8c8b87",
        label: text("Gris pierre", "Steengrijs", "Stone grey"),
      },
      {
        color: "#ede9df",
        label: text("Blanc cassé", "Gebroken wit", "Warm white"),
      },
      {
        color: "#baa384",
        label: text("Bois naturel", "Natuurlijk hout", "Natural timber"),
      },
    ],
    ideas: [
      {
        title: text(
          "Gardez une palette douce",
          "Hou het kleurenpalet rustig",
          "Keep the palette quiet",
        ),
        body: text(
          "Deux ou trois nuances proches suffisent ; jouez plutôt avec le lin, le bois et le tissu.",
          "Twee of drie verwante tinten volstaan. Wissel af met linnen, hout en geweven stoffen.",
          "Two or three related shades are enough; bring variety through linen, timber and woven fabric.",
        ),
      },
      {
        title: text(
          "Rangez sans alourdir",
          "Berg op zonder drukte",
          "Give everything a place",
        ),
        body: text(
          "Une commode claire ou une armoire sur mesure libère les surfaces et simplifie le quotidien.",
          "Een lichte ladekast of kast op maat houdt oppervlakken vrij en maakt elke dag eenvoudiger.",
          "A light chest of drawers or a made-to-measure wardrobe keeps surfaces clear and daily routines simple.",
        ),
      },
    ],
    credits: [
      {
        name: "IKEA / IDANÄS",
        url: "https://www.ikea.com/us/en/p/idanaes-upholstered-bed-frame-gunnared-dark-gray-60458958/",
      },
    ],
  },
  {
    id: "creative-corner",
    title: text(
      "Une place pour les idées.",
      "Ruimte voor ideeën.",
      "A little space to think.",
    ),
    category: text(
      "Bureau · Clair & bien pensé",
      "Werkplek · Licht & doordacht",
      "Workspace · Bright & considered",
    ),
    intro: text(
      "Du rangement utile, une belle lumière et un coin à vous.",
      "Slim opbergen, mooi daglicht en een plek voor jezelf.",
      "Useful storage, natural light and a corner to call your own.",
    ),
    lead: text(
      "L’essentiel, à portée de main.",
      "Alles wat je nodig hebt, dichtbij.",
      "Keep the useful things close.",
    ),
    body: text(
      "Même un petit espace peut accueillir de grandes idées. Placez le bureau près de la lumière, réservez une étagère aux objets du quotidien et laissez quelques espaces vides entre les livres.",
      "Ook een kleine plek kan grote ideeën verwelkomen. Zet je bureau bij het daglicht, geef dagelijkse spullen een vaste plank en laat ruimte tussen de boeken.",
      "Even a small corner can make room for good ideas. Set your desk near daylight, give everyday objects a dedicated shelf and leave some breathing space between the books.",
    ),
    image: "/images/rooms/workspace.jpg",
    secondaryImage: "/images/rooms/workspace-library.jpg",
    secondaryCaption: text(
      "Une autre idée : intégrer le bureau à une bibliothèque murale.",
      "Nog een idee: laat het bureau opgaan in een wand met boeken.",
      "Another idea: let the desk become part of a wall of books.",
    ),
    productIds: ["line", "milo", "forma", "atelier"],
    palette: [
      {
        color: "#eceee7",
        label: text("Blanc doux", "Zacht wit", "Soft white"),
      },
      {
        color: "#c5b797",
        label: text("Chêne naturel", "Natuurlijk eiken", "Natural oak"),
      },
      {
        color: "#73826e",
        label: text("Vert sauge", "Saliegroen", "Sage green"),
      },
    ],
    ideas: [
      {
        title: text(
          "Misez sur la lumière",
          "Werk met daglicht",
          "Work with daylight",
        ),
        body: text(
          "Une lumière latérale et une lampe d’appoint gardent le coin bureau agréable au fil de la journée.",
          "Zijdelings daglicht en een extra lamp maken de werkplek de hele dag prettig.",
          "Side light and a task lamp keep a workspace comfortable throughout the day.",
        ),
      },
      {
        title: text(
          "Alternez ouvert et fermé",
          "Wissel open en dicht af",
          "Balance open and closed",
        ),
        body: text(
          "Exposez vos livres préférés et rangez les petits objets dans des tiroirs ou des boîtes.",
          "Laat je favoriete boeken zien en berg kleine spullen op in laden of dozen.",
          "Display the books you love and tuck smaller objects into drawers or boxes.",
        ),
      },
    ],
    credits: [
      {
        name: "Unsplash",
        url: "https://unsplash.com/photos/black-flat-screen-tv-on-white-wooden-table-7ohxaXHDHy8",
      },
      {
        name: "Kelina Cyril / Unsplash",
        url: "https://unsplash.com/photos/black-office-rolling-chair-near-white-wooden-shelf-2F6NnhKfLz8",
      },
    ],
  },
];
export const roomCopy = {
  fr: {
    explore: "Explorer cet intérieur",
    back: "Toutes les inspirations",
    palette: "La palette",
    ideas: "Les idées à retenir",
    selection: "Composez votre version.",
    selectionText:
      "Des pièces complémentaires et des alternatives choisies pour retrouver cette ambiance chez vous.",
    next: "D’autres façons d’habiter.",
    source: "Crédits photos",
    browse: "Voir les pièces",
    edit: "LES CARNETS MAISONNE",
    photo: "L’intérieur en images",
  },
  nl: {
    explore: "Ontdek dit interieur",
    back: "Alle inspiratie",
    palette: "Het kleurenpalet",
    ideas: "Ideeën om mee te nemen",
    selection: "Maak er jouw versie van.",
    selectionText:
      "Bijpassende meubels en alternatieven om deze sfeer thuis tot leven te brengen.",
    next: "Meer manieren om thuis te zijn.",
    source: "Fotocredits",
    browse: "Ontdek de meubels",
    edit: "HET MAISONNE WOONBOEK",
    photo: "Het interieur in beeld",
  },
  en: {
    explore: "Explore this interior",
    back: "All inspiration",
    palette: "The palette",
    ideas: "Ideas to take home",
    selection: "Make the mood your own.",
    selectionText:
      "Complementary pieces and alternatives chosen to bring this feeling into your own home.",
    next: "More ways to feel at home.",
    source: "Photography",
    browse: "Explore the pieces",
    edit: "THE MAISONNE ROOM EDITS",
    photo: "A closer look at the space",
  },
} as const;
