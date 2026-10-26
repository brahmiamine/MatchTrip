# MatchTrip ⚽

Application React + Vite sur GitHub Pages pour trouver un week-end de football depuis Paris.

**226 matchs de championnat** du 17 octobre au 31 décembre 2026, répartis dans **6 pays** : France (28), Belgique (8), Pays-Bas (60), Espagne (39), Italie (55) et Allemagne (36). Les matchs à domicile et leurs calendriers sont issus des recherches du 13 octobre 2026 ; dates susceptibles d'évoluer.

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
- Venise / Udine reste visible dans la liste sans combinaison automatique. Les **18 rencontres non localisées** de « Autres villes italiennes » ont été retirées du catalogue et des données du projet Test.

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

## API et base MariaDB (base utilisée en production)
Le navigateur ne parle jamais à la base : il appelle l'API de `server/` (Node.js 24, sans framework), qui lit et écrit dans la base MariaDB `matches` du VPS. Les données sont dans quatre tables :
- `matchtrip_fixtures` : les matchs, clé unique `fixture_key`, événements et fenêtres de dates provisoires ;
- `matchtrip_club_media` : fiches club, logo, stade, photo, sources et billetterie ;
- `matchtrip_catalog_config` : configuration du catalogue (clé `catalogue`) ;
- `matchtrip_preferences` : préférences privées de chaque compte.

Le catalogue est public en lecture et **n'est modifiable que par l'administrateur de la base** (phpMyAdmin ou `server/seed.sql`) : l'API n'expose aucune écriture du catalogue. Les préférences, elles, sont toujours filtrées par le compte connecté.

- Schéma : `server/schema.sql`, appliqué automatiquement au démarrage de l'API (idempotent).
- Données : `server/seed.sql` (catalogue exporté de l'ancienne base), rejouable : `mariadb matches < server/seed.sql`.
- Configuration : copier `server/.env.example` vers `server/.env`.
- Déploiement sur le VPS : `cd server && docker compose up -d --build`, le conteneur sert le site compilé sur `https://match.clubika.com` et l'API sous `https://match.clubika.com/api` (derrière Caddy). Le build du site se fait dans l'image Docker avec `VITE_BASE=/`.
- Comptes : e-mail + mot de passe (bcrypt), sessions par jeton opaque stocké haché en base. Sans SMTP configuré, il n'y a pas de récupération de mot de passe par e-mail.

Le front cible `https://match.clubika.com/api` par défaut ; pour une autre API, copiez `.env.example` vers `.env.local` et renseignez `VITE_API_URL`. Le catalogue `src/data/fixtures.js` + `src/data/newFixtures.js` sert de secours en cas d'indisponibilité de l'API.

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

Chaque zone dispose d'une **ville de séjour touristique** (`src/lib/destinations.js`), par exemple Madrid pour Espagne / Madrid, Paris pour Paris & alentours ou Valence pour Valence / Villarreal. Chaque match affiche la ville du club recevant et une distance en kilomètres par rapport à cette ville de référence. Les valeurs sont arrondies et calculées **à vol d'oiseau entre centres-villes**, pas à partir du stade et **jamais** en distance routière ou en temps de trajet. Une ville non reconnue donne « Distance indisponible » ; il n'y a pas de géocodage ou de requête payante. La zone non regroupée « Autres villes italiennes » a été supprimée.

Le calcul est purement dans le frontend : aucune modification de la base n'est nécessaire. Ajout de tests de regroupement et couverture du catalogue dans `tests/destinations.test.js`.

## Billetteries et itinéraires

Chaque rencontre dispose d'un accès à la billetterie **officielle du club recevant** lorsque sa page a été identifiée (`src/lib/ticketing.js`). Aucun lien tiers ou URL inventée : si la billetterie officielle est inconnue, le bouton n'est pas affiché. La présence du lien ne signifie pas que les billets sont en vente.

Le texte de distance (ex. Lens · ≈ 178 km de Paris) est désormais cliquable : il ouvre Google Maps **Itinéraires** entre la ville de référence touristique et la ville du club, avec la conduite comme mode initial. Le kilométrage affiché sur la carte reste une approximation **à vol d'oiseau** ; Maps calcule son propre trajet. Les en-têtes affichent distinctement le pays, la destination et les dates.

## Week-end vendredi–dimanche et créneau horaire

Les groupes, options de filtre « Week-ends », week-ends exclus, URL partageable et navigation « Examiner ce week-end » couvrent maintenant le **vendredi, le samedi et le dimanche**. Par compatibilité avec les URL existantes, la clé technique d'un week-end reste le samedi ; le vendredi est rattaché au samedi suivant.

Les filtres proposent un jour « Vendredi » et une plage horaire indépendante **[heure de début incluse, heure de fin exclue)**. Par exemple 10:00–19:00 accepte 10:00 et 18:59, mais **pas 19:00**, ni les rencontres sans heure. Les anciens filtres (pays, destination, club, compétition, favoris, dates, horaires inconnus) restent cumulables.

## Contrôle documentaire des calendriers (13 octobre 2026)

Le catalogue initial de 214 rencontres n'était pas un export de calendrier officiel synchronisé. En conséquence, il serait incorrect de considérer toutes ses dates et heures comme vérifiées. **55 rencontres existantes** ont été rapprochées par clé de match des calendriers d'organisateurs (Ligue 1, LaLiga, KNVB, Bundesliga/DFB, Lega Serie A), et **12 rencontres du vendredi** ont été ajoutées après consultation de publications officielles. L'historique des sources et les dates/horaires rapprochés sont conservés dans `src/data/verifiedSchedule.js`. Les **159 rencontres non rapprochées** gardent un état `date_confirmed=false`, `time_confirmed=false`; l'interface affiche donc « Date et heure à confirmer » plutôt que d'inventer une confirmation. Une date/heure affichée sans preuve est un **repère à revalider**. Le badge « Date et heure vérifiées » n'apparaît que lorsqu'une source officielle correspond explicitement à la rencontre ; pour une date seule, le badge indique « Heure à confirmer ».

Les statuts de vérification sont stockés dans `matchtrip_fixtures` (colonnes `date_confirmed`, `time_confirmed`, `verified_source_url`, `verified_at`) et repris dans `server/seed.sql`. Ce contrôle est un **audit partiel et daté** : les organisateurs peuvent encore décaler les horaires. Le site ne prétend pas une vérification exhaustive ni une mise à jour en temps réel.

Sources primaires :
- Ligue 1 : https://ligue1.com/fr/articles/l1_article_5797- , https://ligue1.com/fr/articles/l1_article_5805- , https://ligue1.com/fr/articles/l1_article_5839- , https://ligue1.com/fr/articles/l1_article_5843-
- LaLiga : https://www.laliga.com/laliga-easports/resultados/2026-27/jornada-9 et https://www.laliga.com/laliga-easports/resultados/2026-27/jornada-10
- KNVB : https://www.knvb.nl/competities/eredivisie/programma
- DFB : https://datencenter.dfb.de/competitions/12/seasons/current
- Lega Serie A : https://www.legaseriea.it/serie-a/news/quando-si-gioca-anticipi-e-posticipi-fino-alla-12a-giornata

### Catalogue et préférences dans MariaDB

- `matchtrip_fixtures` : rencontres, dates, heures, fenêtres de dates et preuves de vérification ; `venue_override` permet de préciser le stade réel d'une rencontre avec `venue_confirmed` et `venue_source_url`.
- `matchtrip_club_media` : logos, stades habituels, photos, sources, crédits des images et liens de billetterie. `ticket_kind=information` identifie une page d'information officielle (Rayo Vallecano) plutôt qu'une boutique.
- `matchtrip_catalog_config`, clé `catalogue` : villes de séjour, coordonnées indicatives des centres-villes, correspondances clubs/villes, regroupements de zones et paramètres du catalogue.
- `matchtrip_preferences` : favoris, week-ends exclus, filtres, thème et affichage. Clé primaire `(user_id,key)` ; l'API ne lit et n'écrit que les lignes du compte connecté.

L'application lit ces tables (via l'API) au chargement. Les statuts de confirmation de la base sont prioritaires ; une ancienne confirmation intégrée au code ne remplace pas une incertitude enregistrée en base. Les données intégrées restent une copie de secours en cas d'indisponibilité de l'API, signalée dans l'interface.

Le bouton « Sauvegarder mes choix » permet de créer un compte ou de se connecter (sans confirmation par e-mail). À la première connexion sans préférences enregistrées, les choix de ce navigateur sont importés ; les sessions suivantes restaurent les données du compte. Le cache local reste disponible hors connexion. Les choix d'un visiteur non connecté restent locaux jusqu'à sa connexion. Aucun favori existant dans un navigateur ne peut être importé par une migration exécutée à distance.

Les ajouts du 13 octobre 2026 (30 noms de stades et 59 photos complétés, trois horaires italiens confirmés à 20:45 avec leurs sources officielles) figurent dans `server/seed.sql`. Les 42 heures restantes inconnues et les liens officiels de stade sans preuve restent vides. Les noms de stades usuels et les photographies ne certifient pas le lieu de chaque rencontre.

Validation : tests Vitest du catalogue distant, de la restauration hors connexion, de la synchronisation des préférences et de l'isolation entre comptes ; tests d'intégration de l'API contre une vraie base MariaDB de test (`cd server && npm test`, variables `TEST_DB_NAME`, `TEST_DB_USER`, `TEST_DB_PASSWORD`, `TEST_DB_HOST` ou `TEST_DB_SOCKET`).

## Déploiement automatique

Chaque commit poussé sur `main` met l'application à jour :

1. **GitHub Actions** exécute les tests (et publie la version GitHub Pages).
2. **Le serveur** (`match.clubika.com`) vérifie chaque minute si `main` a changé (`app-deploy.timer`, script `~/deploy/auto-deploy.sh`) : il récupère le commit, reconstruit l'image Docker (`docker compose up -d --build` dans `server/`), teste `/api/health`, et **revient automatiquement à la version précédente** si le nouveau build échoue ou ne répond pas.
3. Le journal est dans `~/deploy/deploy.log` sur le serveur ; un commit refusé n'est pas retenté tant qu'un nouveau commit n'arrive pas.

La mise en ligne prend en général 1 à 3 minutes après le push.
