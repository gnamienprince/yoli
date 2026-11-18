# YoLi — The Art of Being You

Luxury fashion & lifestyle **maison** from Côte d'Ivoire. A refined, mobile-first
e-commerce experience built around four product universes and a *Modern Quiet
Luxury* aesthetic inspired by Zara — warmer, more editorial, more discreet.

> **Slogan:** _The Art of Being You._

## Les 4 univers YoLi

| Univers | Description |
| --- | --- |
| **YoLi Femme** | Créations féminines originales — robes, ensembles, tailleurs, tenues corporate, pièces de créateur |
| **YoLi Parfums** | Créations olfactives — femme, homme, mixte, coffrets, formats découverte |
| **YoLi Bijoux & Accessoires** | Bijoux, sacs, montres, lunettes, ceintures, foulards |
| **YoLi Homme** | Sélection importée — costumes, vestes, chemises, chaussures, accessoires |

## Design

- **Direction artistique :** Modern Quiet Luxury — minimal, éditorial, beaucoup de blanc
- **Mobile-first** (~90 % du trafic est mobile)
- Imagerie campagne full-bleed, grande typographie serif, animations subtiles
- Pas de pop-ups intrusifs

**Palette**

| Rôle | Couleur |
| --- | --- |
| Rose Nude | `#E8C7C3` |
| Marron Clair | `#B99A83` |
| Ivoire (fond) | `#F7F1E8` |
| Noir (texte) | `#1A1A1A` |
| Or / Gold (accents) | `#C9A96E` |
| Blanc | `#FFFFFF` |

**Typographie** — _Cormorant Garamond_ (serif, titres & logo) · _Inter_ (sans-serif, corps & UI).

## Stack technique

- **Next.js 15** (App Router, TypeScript, Turbopack en dev)
- **Tailwind CSS 3**
- **next-intl** — internationalisation (`fr` par défaut, `en`)
- **Prisma + SQLite** (base de dev, `file:./dev.db`)
- **NextAuth.js v5** (beta) — provider Credentials
- **Zustand** — état du panier (middleware `persist`)
- **lucide-react** (icônes) · **framer-motion** (animations)
- **clsx** + **tailwind-merge** — utilitaire `cn()`

Devise : **FCFA (XOF)** — `formatPrice()` dans `lib/utils.ts` (ex. `25000` → `25 000 FCFA`).

## Installation locale

```bash
npm install --legacy-peer-deps
cp .env.local.example .env.local      # puis renseignez les secrets
npm run db:push                       # crée le schéma SQLite
npm run db:seed                       # catalogue + compte admin
npm run dev                           # http://localhost:3000
```

> Compte admin de démo (créé par le seed) : `admin@yoli.ci` / `yoli2026`.
> Changez ce mot de passe avant toute mise en production.

## Scripts

| Script | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement (Turbopack) |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | Lint ESLint |
| `npm run db:push` | Applique le schéma Prisma à la base |
| `npm run db:generate` | Génère le client Prisma |
| `npm run db:seed` | Alimente la base (produits + admin) |

## Structure du projet

```
app/
  [locale]/            Pages localisées (/, boutique, produit, panier, commande, maison, contact, auth, pages légales)
  api/                 Routes API (auth, commandes, contact, newsletter, produits)
components/            UI, layout, home, boutique, product, cart, pages, providers
i18n/                  Config next-intl (routing, request, navigation)
lib/                   utils (cn, formatPrice), db, auth, mock-data
messages/              Traductions fr.json / en.json
prisma/                schema.prisma + seed.ts
stores/                Store Zustand (panier)
types/                 Types TypeScript partagés
```

### Routes principales

`/` → `/fr` · `/[locale]` (accueil) · `/[locale]/boutique/{femme,parfums,bijoux,homme}` ·
`/[locale]/produit/[slug]` · `/[locale]/panier` · `/[locale]/commande` ·
`/[locale]/maison` · `/[locale]/contact` · `/[locale]/connexion` · `/[locale]/inscription`.

## Déploiement

Déploiement sur **Vercel**. Voir [`DEPLOY.md`](./DEPLOY.md) — notamment le passage
de SQLite à Postgres (Neon / Vercel Postgres) requis pour l'environnement serverless.

Les intégrations de paiement (Wave, Orange / MTN / Moov Money, Visa) sont prévues
en **phase 2**.

## Crédits

Conçu et développé pour la maison **YoLi** (Côte d'Ivoire).
Imagerie de placeholder : [Unsplash](https://unsplash.com).
