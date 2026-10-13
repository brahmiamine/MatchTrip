# MatchTrip ⚽

Application React + Vite sur GitHub Pages pour trouver un week-end de football depuis Paris.

**232 matchs de championnat** du 17 octobre au 31 décembre 2026, répartis dans **6 pays** : France (25), Belgique (8), Pays-Bas (55), Espagne (39), Italie (71) et Allemagne (34). Les matchs à domicile et leurs calendriers sont issus des recherches du 13 octobre 2026 ; dates susceptibles d'évoluer.

## Application
- Filtres combinables : pays, zones, clubs à domicile, adversaires, texte/stade, dates, compétitions, samedi/dimanche, horaire, grandes affiches, favoris, week-ends indisponibles.
- Deux vues : **Combinaisons** (plusieurs clubs géographiquement regroupés, selon horaires connus) et **Tous les matchs**.
- Logos, noms de stades, photos lorsqu'une photo a été trouvée, liens vers les calendriers officiels et Google Maps.
- 104 fiches de clubs avec logos, 74 stades renseignés et 45 photos de stades dans le catalogue. Les photos et logos sont externes, avec repli si indisponibles.

## Regroupements autorisés pour les week-ends
- **France : Paris + Autour de Paris** (exception conservée à la demande de l'utilisateur).
- **Belgique : Bruxelles**.
- **Pays-Bas :** Rotterdam / La Haye ; Amsterdam / Alkmaar (Ajax inclus) ; Nord des Pays-Bas ; Eindhoven / Tilburg ; Zwolle / Deventer.
- **Espagne :** Madrid ; Barcelone ; Valence / Villarreal.
- **Italie :** Milan / Lombardie ; Rome / Latium ; Bologne / Émilie-Romagne ; Turin / Piémont.
- **Allemagne :** Cologne / Leverkusen / Mönchengladbach ; Dortmund / Schalke ; Francfort / Mayence ; Munich / Augsbourg.
- Les zones italiennes trop dispersées (Venise / Udine ; Autres villes italiennes) ne sont pas combinées automatiquement, mais leurs matchs restent visibles.

**Important :** pour les 13 matchs allemands de décembre, la Bundesliga donne une **fenêtre vendredi–dimanche**, sans jour ni heure exacte à ce stade. Ils sont représentés par des plages explicites et exclus des suggestions automatiques tant que le calendrier définitif n'est pas publié ; pas de garantie d'un match le samedi ou le dimanche.

## Installer
```bash
npm install
npm test
npm run build
npm run dev
```

## Publication GitHub Pages
Le workflow `.github/workflows/deploy.yml` exécute les tests, compile Vite et déploie les changements de la branche `main`.

Site : https://brahmiamine.github.io/matches/

## Supabase (base utilisée en production)
Le projet Supabase connecté `arbitres` conserve ses tables d'arbitrage **sans modification**. MatchTrip utilise **uniquement** deux tables indépendantes de lecture publique, sécurisées par RLS :
- `public.matchtrip_fixtures` : 232 matchs, clé unique `fixture_key`, événements et fenêtres de dates provisoires ;
- `public.matchtrip_club_media` : 104 fiches club, logo, stade, photo et sources.

L'application utilise une clé publique **anon** (jamais une clé `service_role`) ; les écritures sont interdites aux visiteurs et réservées à l'administration de la base. Les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` permettent de basculer sur un projet dédié ultérieurement.

Scripts SQL rejouables dans un nouveau projet : `supabase/schema.sql`, `supabase/seed.sql`, `supabase/seed-expansion.sql`, `supabase/media-schema.sql`, `supabase/media-seed.sql`, `supabase/media-seed-expansion.sql`. Le catalogue `src/data/fixtures.js` + `src/data/newFixtures.js` sert de secours en cas d'indisponibilité de Supabase.

## Sources des calendriers et stades
- https://www.knvb.nl/competities/eredivisie/programma
- https://www.bundesliga.com/en/bundesliga/matchday
- https://www.bundesliga.com/en/bundesliga/clubs
- https://www.laliga.com/
- https://ligue1.com/
- https://www.legaseriea.it/serie-a/
- https://www.proleague.be/

Toujours vérifier les dates, les billets et les horaires sur les sites des clubs avant de réserver. Le site ne connaît pas la disponibilité des billets et ne calcule pas les prix de transport.

## Villes de séjour et distances aux matchs

Toutes les vues « Par destination » regroupent désormais **Paris** et **Autour de Paris** sous **France / Paris & alentours** (y compris les 28–29 novembre). Les filtres restent distincts pour permettre une sélection fine des rencontres.

Chaque zone dispose d'une **ville de séjour touristique** (`src/lib/destinations.js`), par exemple Madrid pour Espagne / Madrid, Paris pour Paris & alentours ou Valence pour Valence / Villarreal. Chaque match affiche la ville du club recevant et une distance en kilomètres par rapport à cette ville de référence. Les valeurs sont arrondies et calculées **à vol d'oiseau entre centres-villes**, pas à partir du stade et **jamais** en distance routière ou en temps de trajet. Une ville non reconnue donne « Distance indisponible » ; il n'y a pas de géocodage ou de requête payante. Pour « Autres villes italiennes », Naples est un repère touristique indicatif, et les matchs peuvent être très éloignés.

Le calcul est purement dans le frontend : aucune modification de la base Supabase n'est nécessaire. Ajout de tests de regroupement et couverture du catalogue dans `tests/destinations.test.js`.
