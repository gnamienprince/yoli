# Déploiement sur Vercel — YoLi

Ce guide décrit la mise en ligne de YoLi sur **Vercel**.

## 1. Importer le dépôt

1. Rendez-vous sur **[vercel.com/new](https://vercel.com/new)**.
2. Importez le dépôt GitHub `gnamienprince/yoli`.
3. Framework détecté : **Next.js** (déjà configuré via `vercel.json`).

## 2. Commandes de build

Déjà définies dans `vercel.json`, mais à vérifier dans les réglages du projet :

| Réglage | Valeur |
| --- | --- |
| Install Command | `npm install --legacy-peer-deps` |
| Build Command | `npm run build` |
| Framework | `nextjs` |

> `--legacy-peer-deps` est **obligatoire** : certaines dépendances (NextAuth v5 beta,
> React 19) ont des peer-deps strictes qui échouent sinon.

## 3. Variables d'environnement

À renseigner dans **Settings → Environment Variables** :

| Variable | Valeur |
| --- | --- |
| `DATABASE_URL` | URL Postgres de production (voir §4) |
| `AUTH_SECRET` | `openssl rand -hex 32` |
| `NEXTAUTH_SECRET` | même valeur que `AUTH_SECRET` |
| `NEXTAUTH_URL` | l'URL de déploiement, ex. `https://yoli.vercel.app` |

```bash
# Générer un secret
openssl rand -hex 32
```

## 4. Base de données : SQLite → Postgres (⚠️ requis)

En développement, YoLi utilise **SQLite** (`file:./dev.db`). L'environnement
**serverless de Vercel a un système de fichiers en lecture seule / éphémère**,
donc SQLite ne peut pas y fonctionner. Il faut basculer sur **Postgres**
(Vercel Postgres ou [Neon](https://neon.tech)).

**Étapes :**

1. Créez une base Postgres (Vercel Postgres depuis l'onglet *Storage*, ou Neon).
2. Dans `prisma/schema.prisma`, changez le provider de la datasource :

   ```prisma
   datasource db {
     provider = "postgresql"   // était "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

3. Mettez `DATABASE_URL` (Vercel) à l'URL de connexion Postgres.
4. Appliquez le schéma et alimentez la base :

   ```bash
   npx prisma db push
   npm run db:seed
   ```

   > Vercel Postgres / Neon fournissent en général deux URLs (pooled + direct).
   > Utilisez la connexion **pooled** pour l'app et la **directe** pour les migrations.

## 5. Déployer

Un `git push` sur `main` déclenche automatiquement un déploiement.
Le premier déploiement peut aussi être lancé manuellement depuis le dashboard Vercel.

## 6. Après le premier déploiement

- Mettez `NEXTAUTH_URL` à l'URL finale (domaine custom si applicable) et redéployez.
- Changez le mot de passe du compte admin de démo (`admin@yoli.ci` / `yoli2026`).

## Phase 2 — Paiements

Les intégrations de paiement sont une tâche de **phase 2** et ne sont pas incluses
dans ce build :

- **Wave**
- **Orange Money / MTN Money / Moov Money**
- **Visa / carte bancaire**

Le tunnel de commande actuel enregistre la commande (statut `pending`) sans
encaissement en ligne.
