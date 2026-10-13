# MatchTrip ⚽

Une interface React + Vite pour trouver son prochain week-end football depuis Paris.

Le catalogue initial comprend **147 matchs** sur 5 pays (France, Espagne, Italie, Belgique, Pays-Bas), exclusivement à domicile le samedi ou dimanche, du 17 octobre au 31 décembre 2026.

## Interface
- Filtres combinables : pays, région, équipe à domicile, compétition, recherche libre (club/adversaire/ville), période (avec raccourcis par mois déduits des données), samedi/dimanche, horaire, grandes affiches, horaires et dates à confirmer, favoris, week-ends indisponibles.
- Deux vues : **Combinaisons** (week-ends avec plusieurs matchs compatibles sur le papier) et **Tous les matchs**.
- Tri chronologique / affiches, regroupement par date ou destination, liens vers les calendriers officiels, favoris enregistrés dans le navigateur.
- Responsive mobile / desktop. Les week-ends indisponibles sont ajoutés par l'utilisateur (autant que nécessaire), mémorisés dans le navigateur et dans l'URL.

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

## Zones autorisées pour la vue « Combinaisons »
- France : **Paris + Autour de Paris** regroupés dans « Paris & alentours », conservés volontairement même si les villes sont éloignées.
- Belgique : Bruxelles.
- Espagne : Madrid, Barcelone, Valence / Villarreal.
- Italie : Milan / Lombardie, Rome / Latium, Bologne / Émilie-Romagne, Turin / Piémont.
- **Non regroupés : Venise / Udine (~128 km) et Autres villes italiennes (villes dispersées)**. Amsterdam est accessible dans la liste mais ne forme pas de regroupement multi-clubs à lui seul.
- La logique est une **liste blanche** dans `src/lib/zoneGroups.js`, appliquée aussi aux données chargées depuis Supabase. Pour créer une suggestion, il faut des matchs de **deux clubs à domicile différents**. Les 147 rencontres restent disponibles dans **Tous les matchs**.
- La proximité régionale est indicative : pas de calcul de durée réelle ou de correspondances. Les déplacements à travers « Paris & alentours » peuvent être longs.

## Important : fiabilité
- Les données proviennent des matchs réunis lors de la conversation le **13 octobre 2026** : pas de scores live ni de mise à jour automatique des calendriers.
- Dates espagnoles fin novembre/décembre et françaises décembre marquées **provisoires** ; horaires inconnus non inventés.
- Un horaire renseigné ne garantit pas qu'il soit toujours valide. Vérifier la billetterie et la date officielle **avant de réserver**.
- L'algorithme de week-end exclut les chevauchements flagrants mais ne calcule **ni trajets, ni prix, ni disponibilité de billets**.

Sources sportives à consulter : https://ligue1.com/ · https://www.laliga.com/ · https://www.legaseriea.it/serie-a/ · https://www.proleague.be/ · https://eredivisie.nl/.

## Logos et stades
Le catalogue de médias contient **72 noms de clubs**, **39 stades habituels** et leurs photos. Logos visibles pour les deux équipes, photos dans la liste des matchs, noms dans les combinaisons ; la recherche inclut le stade. Les images sont chargées à la demande, avec repli en cas d’échec.

Sources : API MediaWiki / Wikipedia, relevées le 13 octobre 2026. Chaque entrée conserve les liens vers les pages du club et du stade. Ces pages donnent accès aux descriptions des fichiers, auteurs et conditions de réutilisation ; les logos restent la propriété de leurs titulaires. Les photos peuvent montrer une configuration antérieure du stade. Le stade habituel ne constitue pas une confirmation du lieu exact d’une rencontre. Paris FC : https://parisfc.fr/infos-pratiques/ ; FC Barcelone : https://www.fcbarcelona.com/en/football/first-team/schedule.

La table indépendante `matchtrip_club_media` a été créée et alimentée dans le projet Supabase connecté. `supabase/media-schema.sql` et `supabase/media-seed.sql` permettent de la recréer dans un futur projet dédié (exécuter le schéma une fois, puis le seed). L’application fusionne ces médias avec les matchs lorsqu’elle est connectée à Supabase, et utilise le catalogue intégré en secours. La table existante `matches` du projet « arbitres » possède un autre schéma : elle n’est pas la base du catalogue MatchTrip.
