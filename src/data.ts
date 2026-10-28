import { configurationPrice, initialConfiguration } from "./configuration";
import { translations } from "./i18n";
import type { Language, TranslationKey } from "./i18n";
export type Category =
  "sofas" | "tables" | "chairs" | "beds" | "wardrobes" | "storage";
export const categories: { id: Category; image: string; count: number }[] = [
  { id: "sofas", image: "catalog/alba.jpg", count: 2 },
  { id: "tables", image: "catalog/oslo.jpg", count: 2 },
  { id: "chairs", image: "catalog/milo.jpg", count: 2 },
  { id: "beds", image: "catalog/lune.jpg", count: 2 },
  { id: "wardrobes", image: "catalog/atelier.png", count: 2 },
  { id: "storage", image: "catalog/forma.jpg", count: 2 },
];
export type Product = {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  category: Category;
  image: string;
  gallery?: string[];
  price: number;
  colors: string[];
  finishNames: TranslationKey[];
  dimensions: [number, number, number];
  material: Record<Language, string>;
  badge?: TranslationKey;
  custom?: boolean;
  position?: string;
};
const names = (fr: string, nl: string, en: string) => ({ fr, nl, en });
export const products: Product[] = [
  {
    id: "alba",
    name: names("Canapé Alba", "Alba zitbank", "Alba sofa"),
    description: names(
      "Un canapé 3 places aux lignes accueillantes.",
      "Een uitnodigende driezitsbank.",
      "An inviting three-seater with easy lines.",
    ),
    category: "sofas",
    image: "catalog/alba.jpg",
    price: 1290,
    colors: ["#536f54", "#c9bdab", "#555253"],
    finishNames: ["sage", "cream", "charcoal"],
    dimensions: [216, 82, 90],
    material: names(
      "Tissu tissé, structure en bois",
      "Geweven stof, houten frame",
      "Woven fabric, timber frame",
    ),
    badge: "bestSeller",
  },
  {
    id: "milo",
    name: names("Chaise Milo", "Milo stoel", "Milo chair"),
    description: names(
      "Une chaise tout en courbes, pour se retrouver.",
      "Een ronde stoel om samen te komen.",
      "A softly curved seat for everyday gatherings.",
    ),
    category: "chairs",
    image: "catalog/milo.jpg",
    price: 395,
    colors: ["#c7b897", "#ded8cb", "#555253"],
    finishNames: ["natural", "cream", "charcoal"],
    dimensions: [54, 84, 60],
    material: names(
      "Tissu texturé, piètement en bois",
      "Structuurstof, houten poten",
      "Textured fabric, timber legs",
    ),
    badge: "new",
  },
  {
    id: "oslo",
    name: names("Table Oslo", "Oslo tafel", "Oslo table"),
    description: names(
      "Le point de rencontre de vos journées.",
      "De ontmoetingsplek voor elke dag.",
      "The meeting point for your everyday.",
    ),
    category: "tables",
    image: "catalog/oslo.jpg",
    price: 690,
    colors: ["#e8e1d1", "#414443", "#b49264"],
    finishNames: ["woodAsh", "charcoal", "woodOak"],
    dimensions: [105, 75, 105],
    material: names(
      "Placage de frêne, pieds en bois massif",
      "Essenfineer, massief houten poten",
      "Ash veneer, solid timber legs",
    ),
  },
  {
    id: "atelier",
    name: names("Armoire Atelier", "Atelier kleerkast", "Atelier wardrobe"),
    description: names(
      "Votre armoire, dessinée à votre mesure.",
      "Jouw kast, helemaal op maat ontworpen.",
      "A wardrobe designed around your space.",
    ),
    category: "wardrobes",
    image: "catalog/atelier.png",
    price: configurationPrice(initialConfiguration),
    colors: ["#b49264", "#70513b", "#ded2b8"],
    finishNames: ["woodOak", "woodWalnut", "woodAsh"],
    dimensions: [180, 220, 60],
    material: names(
      "Panneaux plaqués bois, 22 mm",
      "Houtfineer panelen, 22 mm",
      "Wood-veneered panels, 22 mm",
    ),
    badge: "configurable",
    custom: true,
  },
  {
    id: "noa",
    name: names("Lit Noa", "Noa bed", "Noa bed"),
    description: names(
      "Un cocon doux pour les nuits qui comptent.",
      "Een zachte plek voor heerlijke nachten.",
      "A soft retreat for your best nights.",
    ),
    category: "beds",
    image: "catalog/noa.jpg",
    price: 890,
    colors: ["#d5c9b9", "#99998c", "#555253"],
    finishNames: ["cream", "sage", "charcoal"],
    dimensions: [168, 110, 212],
    material: names(
      "Bois et panneaux laqués, rangements intégrés",
      "Hout en gelakte panelen, ingebouwde opbergruimte",
      "Timber and lacquered panels, built-in storage",
    ),
    badge: "bestSeller",
  },
  {
    id: "noma",
    name: names("Commode Noma", "Noma ladekast", "Noma chest of drawers"),
    description: names(
      "Une place pour chaque petite chose.",
      "Een plek voor alle kleine dingen.",
      "A place for all your little things.",
    ),
    category: "storage",
    image: "catalog/noma.jpg",
    price: 490,
    colors: ["#b49264", "#70513b"],
    finishNames: ["cream", "woodWalnut"],
    dimensions: [108, 96, 50],
    material: names(
      "Bois peint, trois tiroirs",
      "Gelakt hout, drie laden",
      "Painted timber, three drawers",
    ),
  },
  {
    id: "soren",
    name: names("Canapé Soren", "Soren zitbank", "Soren sofa"),
    description: names(
      "Une assise généreuse, un esprit serein.",
      "Royaal zitten, heerlijk ontspannen.",
      "Generous seating with a quiet spirit.",
    ),
    category: "sofas",
    image: "catalog/soren.jpg",
    price: 1590,
    colors: ["#d9d1c6", "#8d947d"],
    finishNames: ["cream", "sage"],
    dimensions: [240, 78, 98],
    material: names(
      "Tissu bouclé, structure en bois",
      "Boucléstof, houten frame",
      "Bouclé fabric, timber frame",
    ),
  },
  {
    id: "line",
    name: names("Bureau Line", "Line bureau", "Line desk"),
    description: names(
      "L’essentiel pour faire place aux idées.",
      "Alle ruimte voor nieuwe ideeën.",
      "A little space for your best ideas.",
    ),
    category: "tables",
    image: "catalog/line.jpg",
    price: 320,
    colors: ["#ddd8ca", "#b49264"],
    finishNames: ["cream", "woodOak"],
    dimensions: [120, 75, 60],
    material: names(
      "Plateau laqué, piètement métal",
      "Gelakt blad, metalen frame",
      "Lacquered top, metal frame",
    ),
  },
  {
    id: "elo",
    name: names("Fauteuil Élo", "Élo fauteuil", "Élo armchair"),
    description: names(
      "Un classique délicat, tout en douceur.",
      "Een zacht en verfijnd klassiek ontwerp.",
      "A delicate classic with a softer side.",
    ),
    category: "chairs",
    image: "catalog/elo.jpg",
    price: 245,
    colors: ["#e7e3d7", "#b6a28b"],
    finishNames: ["cream", "natural"],
    dimensions: [66, 84, 62],
    material: names(
      "Tissu capitonné, pieds en bois",
      "Gecapitonneerde stof, houten poten",
      "Buttoned upholstery, timber legs",
    ),
  },
  {
    id: "lune",
    name: names("Lit Lune", "Lune bed", "Lune bed"),
    description: names(
      "Des nuits paisibles, des matins lumineux.",
      "Rustige nachten, lichte ochtenden.",
      "Quiet nights and brighter mornings.",
    ),
    category: "beds",
    image: "catalog/lune.jpg",
    price: 1090,
    colors: ["#ddd3c5", "#b49264"],
    finishNames: ["woodWalnut", "woodOak"],
    dimensions: [188, 105, 215],
    material: names(
      "Bois teinté, tête de lit en bois",
      "Gebeitst hout, houten hoofdbord",
      "Stained timber, wooden headboard",
    ),
    badge: "new",
  },
  {
    id: "forma",
    name: names("Bibliothèque Forma", "Forma boekenkast", "Forma bookcase"),
    description: names(
      "Vos objets préférés, à la bonne place.",
      "Je favoriete voorwerpen op hun plek.",
      "Your favourite objects, beautifully at home.",
    ),
    category: "storage",
    image: "catalog/forma.jpg",
    price: 425,
    colors: ["#ae855b", "#e6dfd1", "#454542"],
    finishNames: ["cream", "woodOak", "charcoal"],
    dimensions: [90, 197, 37],
    material: names(
      "Bois plaqué et panneaux laqués",
      "Houtfineer en gelakte panelen",
      "Veneered timber and lacquered panels",
    ),
  },
  {
    id: "brume",
    name: names("Armoire Brume", "Brume kleerkast", "Brume wardrobe"),
    description: names(
      "Des rangements simples et bien pensés.",
      "Eenvoudig en slim opbergen.",
      "Simple, thoughtful storage.",
    ),
    category: "wardrobes",
    image: "catalog/brume.png",
    price: 990,
    colors: ["#9aa18c", "#e8e1d1"],
    finishNames: ["sage", "cream"],
    dimensions: [180, 220, 60],
    material: names(
      "Panneaux plaqués bois",
      "Houtfineer panelen",
      "Wood-veneered panels",
    ),
  },
];
export const featured = products.slice(0, 4);

export const imageUrl = (image: string) =>
  `/images/${/\.(png|jpg|jpeg|webp)$/i.test(image) ? image : image + ".jpg"}`;
export const unitPrice = (product: Product, finish = 0) =>
  product.custom
    ? configurationPrice({
        ...initialConfiguration,
        wood: finish === 1 ? "walnut" : finish === 2 ? "ash" : "oak",
      })
    : product.price;

const normalise = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
export function matchesProduct(product: Product, query: string) {
  return normalise(
    [
      ...Object.values(product.name),
      ...Object.values(product.description),
      ...Object.values(product.material),
      ...Object.values(translations).map((locale) => locale[product.category]),
    ].join(" "),
  ).includes(normalise(query));
}
