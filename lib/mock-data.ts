import type { Category, Product } from '@/types';

/**
 * Shared mock catalogue for the YoLi boutique.
 *
 * In development this stands in for the Prisma/SQLite data layer so the
 * storefront can be built and demoed end-to-end. Imagery uses Unsplash
 * editorial photography with consistent crop/quality parameters.
 */

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1000&q=80`;

export const products: Product[] = [
  // ----------------------------------------------------------------------
  // YoLi Femme
  // ----------------------------------------------------------------------
  {
    id: 'f-01',
    slug: 'robe-longue-serenite',
    nameFr: 'Robe Longue Sérénité',
    nameEn: 'Sérénité Maxi Dress',
    descriptionFr:
      "Une robe longue fluide taillée dans un crêpe soyeux qui épouse le mouvement. Sa coupe épurée et son décolleté délicat incarnent une élégance sans effort. La pièce signature des soirées d'exception.",
    descriptionEn:
      'A fluid maxi dress cut from silky crêpe that follows every movement. Its clean silhouette and delicate neckline embody effortless elegance. The signature piece for exceptional evenings.',
    price: 98000,
    currency: 'XOF',
    category: 'femme',
    subcategory: 'robes',
    images: [img('1539008835657-9e8e9680c956'), img('1595777457583-95e059d581b8'), img('1566174053879-31528523f8ae')],
    stock: 12,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Ivoire', 'Noir', 'Rose Nude'],
    featured: true,
    active: true,
  },
  {
    id: 'f-02',
    slug: 'robe-midi-abidjan',
    nameFr: 'Robe Midi Abidjan',
    nameEn: 'Abidjan Midi Dress',
    descriptionFr:
      "Inspirée par la lumière de la lagune, cette robe midi joue sur une silhouette ceinturée et des drapés subtils. Un classique contemporain à porter du bureau au dîner.",
    descriptionEn:
      'Inspired by the light of the lagoon, this midi dress plays on a belted silhouette and subtle draping. A contemporary classic to wear from the office to dinner.',
    price: 72000,
    currency: 'XOF',
    category: 'femme',
    subcategory: 'robes',
    images: [img('1572804013309-59a88b7e92f1'), img('1596783074918-c84cb06531ca')],
    stock: 5,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Marron Clair', 'Noir'],
    featured: true,
    active: true,
  },
  {
    id: 'f-03',
    slug: 'ensemble-duo-lumiere',
    nameFr: 'Ensemble Duo Lumière',
    nameEn: 'Duo Lumière Set',
    descriptionFr:
      "Un ensemble deux pièces aux lignes nettes, pensé pour être porté assorti ou dépareillé. La modularité au service d'une allure moderne et affirmée.",
    descriptionEn:
      'A two-piece set with clean lines, designed to be worn matched or apart. Modularity in service of a modern, assertive look.',
    price: 85000,
    currency: 'XOF',
    category: 'femme',
    subcategory: 'ensembles',
    images: [img('1515372039744-b8f02a3ae446'), img('1485968579580-b6d095142e6e')],
    stock: 18,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Ivoire', 'Rose Nude'],
    featured: false,
    active: true,
  },
  {
    id: 'f-04',
    slug: 'tailleur-maison-noir',
    nameFr: 'Tailleur Maison Noir',
    nameEn: 'Maison Black Tailored Suit',
    descriptionFr:
      "Le tailleur signature de la Maison : veste structurée aux épaules sculptées et pantalon à pince tombant parfaitement. Une déclaration de pouvoir tout en sobriété.",
    descriptionEn:
      'The signature house suit: a structured jacket with sculpted shoulders and perfectly falling pleated trousers. A statement of power in utter restraint.',
    price: 135000,
    currency: 'XOF',
    category: 'femme',
    subcategory: 'tailleurs',
    images: [img('1549062572-544a64fb0c56'), img('1487222477894-8943e31ef7b2')],
    stock: 9,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Marron Clair'],
    featured: true,
    active: true,
  },
  {
    id: 'f-05',
    slug: 'combinaison-nocturne',
    nameFr: 'Combinaison Nocturne',
    nameEn: 'Nocturne Jumpsuit',
    descriptionFr:
      "Une combinaison fluide à la coupe ajustée, rehaussée d'une ceinture fine. L'alternative raffinée à la robe pour les occasions qui comptent.",
    descriptionEn:
      'A fluid jumpsuit with a fitted cut, enhanced by a slim belt. The refined alternative to a dress for the occasions that matter.',
    price: 79000,
    currency: 'XOF',
    category: 'femme',
    subcategory: 'combinaisons',
    images: [img('1483985988355-763728e1935b'), img('1434389677669-e08b4cac3105')],
    stock: 0,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Ivoire'],
    featured: false,
    active: true,
  },
  {
    id: 'f-06',
    slug: 'tenue-corporate-executive',
    nameFr: 'Tenue Corporate Executive',
    nameEn: 'Executive Corporate Look',
    descriptionFr:
      "Blazer cintré et jupe crayon dans une laine légère : la tenue corporate pensée pour la femme de décision. Une coupe impeccable qui traverse les saisons.",
    descriptionEn:
      'A fitted blazer and pencil skirt in a lightweight wool: the corporate look designed for the woman of decision. An impeccable cut that transcends seasons.',
    price: 110000,
    currency: 'XOF',
    category: 'femme',
    subcategory: 'corporate',
    images: [img('1529139574466-a303027c1d8b'), img('1539109136881-3be0616acf4b')],
    stock: 14,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Marron Clair', 'Ivoire'],
    featured: false,
    active: true,
  },
  {
    id: 'f-07',
    slug: 'robe-couture-etoile',
    nameFr: "Robe Couture Étoile",
    nameEn: 'Étoile Couture Gown',
    descriptionFr:
      "Pièce de créateur façonnée à la main, la robe Étoile sublime la silhouette d'un drapé savant et d'une traîne discrète. L'exception, pour les instants inoubliables.",
    descriptionEn:
      'A hand-crafted designer piece, the Étoile gown elevates the silhouette with masterful draping and a discreet train. The exceptional, for unforgettable moments.',
    price: 25000,
    currency: 'XOF',
    category: 'femme',
    subcategory: 'createur',
    images: [img('1490481651871-ab68de25d43d'), img('1515886657613-9f3515b0c78f')],
    stock: 3,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Rose Nude', 'Ivoire'],
    featured: true,
    active: true,
  },

  // ----------------------------------------------------------------------
  // YoLi Parfums
  // ----------------------------------------------------------------------
  {
    id: 'p-01',
    slug: 'parfum-femme-rose-nude',
    nameFr: 'Rose Nude — Eau de Parfum',
    nameEn: 'Rose Nude — Eau de Parfum',
    descriptionFr:
      "Un sillage floral et poudré où la rose de mai rencontre le musc blanc. Une fragrance féminine, enveloppante, qui signe une présence sans jamais s'imposer.",
    descriptionEn:
      'A floral, powdery trail where May rose meets white musk. A feminine, enveloping fragrance that leaves a presence without ever imposing.',
    price: 65000,
    currency: 'XOF',
    category: 'parfums',
    subcategory: 'femme',
    images: [img('1541643600914-78b084683601'), img('1588405748880-12d1d2a59f75')],
    stock: 24,
    colors: ['50 ml', '100 ml'],
    featured: true,
    active: true,
  },
  {
    id: 'p-02',
    slug: 'parfum-homme-noir-absolu',
    nameFr: 'Noir Absolu — Eau de Parfum',
    nameEn: 'Noir Absolu — Eau de Parfum',
    descriptionFr:
      "Un boisé ambré intense, structuré par le vétiver et le cuir. Une fragrance masculine affirmée, taillée pour les hommes de caractère.",
    descriptionEn:
      'An intense amber woody scent, structured by vetiver and leather. An assertive masculine fragrance, cut for men of character.',
    price: 68000,
    currency: 'XOF',
    category: 'parfums',
    subcategory: 'homme',
    images: [img('1594035910387-fea47794261f'), img('1587017539504-67cfbddac569')],
    stock: 16,
    colors: ['50 ml', '100 ml'],
    featured: false,
    active: true,
  },
  {
    id: 'p-03',
    slug: 'parfum-mixte-oud-ivoire',
    nameFr: "Oud Ivoire — Eau de Parfum",
    nameEn: 'Oud Ivoire — Eau de Parfum',
    descriptionFr:
      "Une création mixte audacieuse mariant l'oud précieux à la fleur d'oranger. Un parfum sans genre, pour celles et ceux qui écrivent leurs propres règles.",
    descriptionEn:
      'A bold unisex creation marrying precious oud with orange blossom. A scent without gender, for those who write their own rules.',
    price: 90000,
    currency: 'XOF',
    category: 'parfums',
    subcategory: 'mixte',
    images: [img('1592945403244-b3fbafd7f539'), img('1615634260167-c8cdede054de')],
    stock: 11,
    colors: ['75 ml'],
    featured: true,
    active: true,
  },
  {
    id: 'p-04',
    slug: 'coffret-decouverte-parfums',
    nameFr: 'Coffret Découverte',
    nameEn: 'Discovery Set',
    descriptionFr:
      "Trois formats de voyage pour explorer l'univers olfactif YoLi. Le coffret idéal pour trouver — ou offrir — sa signature parfumée.",
    descriptionEn:
      'Three travel formats to explore the YoLi olfactory universe. The ideal set to find — or gift — your signature scent.',
    price: 30000,
    currency: 'XOF',
    category: 'parfums',
    subcategory: 'coffrets',
    images: [img('1523293182086-7651a899d37f'), img('1512496015851-a90fb38ba796')],
    stock: 30,
    colors: ['3 x 10 ml'],
    featured: false,
    active: true,
  },

  // ----------------------------------------------------------------------
  // YoLi Bijoux & Accessoires
  // ----------------------------------------------------------------------
  {
    id: 'b-01',
    slug: 'collier-lagune-dore',
    nameFr: 'Collier Lagune Doré',
    nameEn: 'Lagune Gold Necklace',
    descriptionFr:
      "Un collier plastron aux maillons dorés, inspiré des reflets de la lagune Ébrié. Une pièce statement qui illumine les décolletés les plus simples.",
    descriptionEn:
      'A statement necklace with golden links, inspired by the reflections of the Ébrié lagoon. A piece that lights up the simplest neckline.',
    price: 45000,
    currency: 'XOF',
    category: 'bijoux',
    subcategory: 'bijoux',
    images: [img('1599643478518-a784e5dc4c8f'), img('1611591437281-460bfbe1220a')],
    stock: 20,
    colors: ['Or'],
    featured: true,
    active: true,
  },
  {
    id: 'b-02',
    slug: 'sac-main-structure-ivoire',
    nameFr: 'Sac Structuré Ivoire',
    nameEn: 'Ivoire Structured Bag',
    descriptionFr:
      "Un sac à main au cuir grainé et à la structure architecturale. Format du jour au soir, il allie fonctionnalité et raffinement dans chaque détail.",
    descriptionEn:
      'A handbag in grained leather with an architectural structure. A day-to-night format pairing function and refinement in every detail.',
    price: 80000,
    currency: 'XOF',
    category: 'bijoux',
    subcategory: 'sacs',
    images: [img('1584917865442-de89df76afd3'), img('1548036328-c9fa89d128fa')],
    stock: 7,
    colors: ['Ivoire', 'Noir', 'Marron Clair'],
    featured: false,
    active: true,
  },
  {
    id: 'b-03',
    slug: 'foulard-soie-savane',
    nameFr: 'Foulard de Soie Savane',
    nameEn: 'Savane Silk Scarf',
    descriptionFr:
      "Un carré de soie imprimé d'un motif exclusif aux teintes chaudes. Porté au cou, au poignet ou sur un sac, il parfait chaque silhouette.",
    descriptionEn:
      'A silk square printed with an exclusive motif in warm tones. Worn at the neck, wrist or on a bag, it perfects any silhouette.',
    price: 15000,
    currency: 'XOF',
    category: 'bijoux',
    subcategory: 'foulards',
    images: [img('1601924994987-69e26d50dc26'), img('1609709295948-17d77cb2a69b')],
    stock: 4,
    colors: ['Rose Nude', 'Or', 'Marron Clair'],
    featured: true,
    active: true,
  },

  // ----------------------------------------------------------------------
  // YoLi Homme
  // ----------------------------------------------------------------------
  {
    id: 'h-01',
    slug: 'costume-importe-milano',
    nameFr: 'Costume Importé Milano',
    nameEn: 'Milano Imported Suit',
    descriptionFr:
      "Un costume deux pièces en laine italienne, à la coupe slim et aux finitions soignées. L'élégance masculine dans sa plus belle expression, sélectionnée pour la Maison.",
    descriptionEn:
      'A two-piece suit in Italian wool, with a slim cut and careful finishings. Masculine elegance at its finest, selected for the House.',
    price: 150000,
    currency: 'XOF',
    category: 'homme',
    subcategory: 'costumes',
    images: [img('1593030761757-71fae45fa0e7'), img('1507003211169-0a1dd7228f2d')],
    stock: 8,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Marron Clair'],
    featured: false,
    active: true,
  },
  {
    id: 'h-02',
    slug: 'chemise-lin-harmattan',
    nameFr: 'Chemise en Lin Harmattan',
    nameEn: 'Harmattan Linen Shirt',
    descriptionFr:
      "Une chemise en lin pur, respirante et intemporelle, pensée pour le climat et le style. La pièce essentielle d'un vestiaire masculin maîtrisé.",
    descriptionEn:
      'A pure linen shirt, breathable and timeless, designed for climate and style. The essential piece of a well-mastered masculine wardrobe.',
    price: 45000,
    currency: 'XOF',
    category: 'homme',
    subcategory: 'chemises',
    images: [img('1521572163474-6864f9cf17ab'), img('1602810318383-e386cc2a3ccf')],
    stock: 15,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Ivoire', 'Rose Nude'],
    featured: false,
    active: true,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns the products flagged as featured (for homepage showcases). */
export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured && p.active);
}

/** Returns all active products in a given category. */
export function getProductsByCategory(cat: Category): Product[] {
  return products.filter((p) => p.category === cat && p.active);
}

/** Finds a single active product by its slug. */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug && p.active);
}

/**
 * Returns up to `n` products related to the given one — same category first,
 * backfilled with other active products if needed. Excludes the product itself.
 */
export function getRelatedProducts(product: Product, n = 4): Product[] {
  const sameCategory = products.filter(
    (p) => p.active && p.id !== product.id && p.category === product.category
  );
  if (sameCategory.length >= n) return sameCategory.slice(0, n);

  const others = products.filter(
    (p) => p.active && p.id !== product.id && p.category !== product.category
  );
  return [...sameCategory, ...others].slice(0, n);
}
