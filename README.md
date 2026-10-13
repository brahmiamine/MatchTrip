# MatchTrip ⚽

Une interface React + Vite pour trouver son prochain week-end football depuis Paris.

Le catalogue initial comprend **147 matchs** sur 5 pays (France, Espagne, Italie, Belgique, Pays-Bas), exclusivement à domicile le samedi ou dimanche, du 17 octobre au 31 décembre 2026.

## Interface
- Filtres combinables : pays, région, équipe à domicile, compétition, recherche libre (club/adversaire/ville), dates, mois, samedi/dimanche, horaire, grandes affiches, horaires et dates à confirmer, favoris, week-ends indisponibles.
- Deux vues : **Combinaisons** (week-ends avec plusieurs matchs compatibles sur le papier) et **Tous les matchs**.
- Tri chronologique / affiches, regroupement par date ou destination, liens vers les calendriers officiels, favoris enregistrés dans le navigateur.
- Responsive mobile / desktop. Les 31 octobre–1er novembre et 7–8 novembre sont exclus par défaut, mais réactivables.

## Installation locale
```bash
npm install
npm run dev
npm run build
```

## GitHub Pages
Dans le dépôt GitHub, sélectionner **Settings → Pages → Build and deployment → Source: GitHub Actions**.
Le workflow `.github/workflows/deploy.yml` déploie sur `main`.
Adresse une fois activée : https://brahmiamine.github.io/matches/

## Utiliser Supabase avec un projet dédié
Un seul projet Supabase existant était connecté (« arbitres »). Il n'a pas été modifié, car la nouvelle application mérite une base dédiée.

1. Créer un projet Supabase distinct.
2. Exécuter `supabase/schema.sql`, puis `supabase/seed.sql` dans son SQL Editor : la seconde commande insère/actualise les **147 matchs**.
3. Dans GitHub → **Settings → Secrets and variables → Actions → Variables**, ajouter `VITE_SUPABASE_URL` (Project URL) et `VITE_SUPABASE_PUBLISHABLE_KEY` (clé publishable publique, pas de clé secrète).
4. Relancer la publication Pages. Une fois connecté, le navigateur lit les matchs de Supabase. Sans variables, il lit le catalogue intégré.

Le schéma applique RLS et autorise **SELECT uniquement** aux rôles `anon` et `authenticated` ; les écritures depuis un navigateur sont interdites. Les scripts SQL servent au provisioning côté propriétaire de la base.

## Important : fiabilité
- Les données proviennent des matchs réunis lors de la conversation le **13 octobre 2026** : pas de scores live ni de mise à jour automatique des calendriers.
- Dates espagnoles fin novembre/décembre et françaises décembre marquées **provisoires** ; horaires inconnus non inventés.
- Un horaire renseigné ne garantit pas qu'il soit toujours valide. Vérifier la billetterie et la date officielle **avant de réserver**.
- L'algorithme de week-end exclut les chevauchements flagrants mais ne calcule **ni trajets, ni prix, ni disponibilité de billets**.

Sources sportives à consulter : https://ligue1.com/ · https://www.laliga.com/ · https://www.legaseriea.it/serie-a/ · https://www.proleague.be/ · https://eredivisie.nl/.
