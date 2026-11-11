# Audit des rencontres du 11 novembre 2026

Catalogue contrôlé du 11 novembre 2026 au 31 janvier 2027, pour les **56 clubs receveurs déjà sélectionnés**. Les pays, zones, destinations, billetteries et règles de combinaisons vendredi–dimanche restent ceux de l’application. Les rencontres en semaine sont visibles dans la liste et exclues des combinaisons de week-end.

Résultat : **106 anciennes rencontres retirées**, **125 rencontres à venir conservées et contrôlées**, **146 ajouts dont 134 de janvier**, soit **271 rencontres**. **205 dates et heures sont confirmées** ; **66 restent provisoires**. Toutes les heures sont converties depuis UTC vers `Europe/Paris` (CET en hiver).

## Méthode et sources

Les 18 flux mensuels ESPN (6 championnats, novembre, décembre et janvier) ont été consultés et rapprochés par pays, club recevant et adversaire. Les données de 198 rencontres concordent également avec une publication officielle exploitable. Pour ces rencontres, le lien officiel est prioritaire. Pour les autres, la fiche ESPN individuelle et le flux consulté sont conservés dans [le relevé structuré](data/fixtures-audit-2026-11-11.json). Une donnée ESPN seule n’est pas présentée comme une publication officielle.

- France : [J11](https://ligue1.com/fr/articles/l1_article_5839-), [J12](https://ligue1.com/fr/articles/l1_article_5843-), [J13 à J18](https://ligue1.com/en/articles/l1_article_5979-programmation-tv-de-la-j13-a-la-j18).
- Pays-Bas : [programme KNVB](https://www.knvb.nl/competities/eredivisie/programma). Deux rencontres absentes du rendu consulté sont documentées par ESPN.
- Allemagne : journées 10 à 19 sur Bundesliga.com, liens individuels ci-dessous ; la J19 reste dans sa fenêtre officielle du 29 au 31 janvier.
- Italie : PDF officiel [J12 rectifiée](https://images.legaseriea.it/image/private/fl_attachment/prd/w2zepi8iww3zamzewn8y.pdf) et [J13 à J19](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf), ce dernier contrôlé visuellement car les pages sont des images. Après le 11 janvier, ESPN conserve des dates de journée sans heure définitive.
- Espagne : [J13](https://www.laliga.com/laliga-easports/resultados/2026-27/jornada-13), [J14](https://www.laliga.com/laliga-easports/resultados/2026-27/jornada-14), [calendrier de saison](https://www.laliga.com/calendar-2026-2027/laliga-easports) et ESPN. Les journées ultérieures non programmées gardent une fenêtre vendredi–lundi.
- Belgique : [calendrier de saison Pro League](https://www.proleague.be/nieuws/kalender-2026-2027-club-brugge-opent-tegen-kv-kortrijk-eerste-super-sunday-al-op-speeldag-4) puis fiches ESPN pour les dates et heures disponibles ; les deux dernières journées de janvier restent provisoires.

Un champ `timeValid=false` du fournisseur ne constitue jamais une heure confirmée : l’heure est effacée et la fenêtre de journée conservée. Les fenêtres italiennes et espagnoles de fin janvier peuvent se terminer le lundi 1er février. Une fenêtre est un repère à revalider, pas la confirmation de la présence d’un match le samedi ou le dimanche. Les statuts et liens restent datés : cette opération ne crée pas de synchronisation automatique.

La reprise Rayo–Athletic du 9 décembre est exclue des nouveaux déplacements car elle se joue à huis clos ([annonce rapportée par AS](https://as.com/futbol/primera/el-rayo-athletic-se-jugara-el-9-de-diciembre-f202610-n/)).

## Corrections des rencontres existantes

| Rencontre | Ancien repère | Date et heure contrôlées |
|---|---|---|
| Espanyol – Getafe | 29 novembre, sans heure | 30 novembre 2026 à 21:00 |
| Levante – Racing Santander | 29 novembre, sans heure | 27 novembre 2026 à 21:00 |
| Real Madrid – Alavés | 29 novembre, sans heure | 28 novembre 2026 à 21:00 |
| Valencia CF – Osasuna | 29 novembre, sans heure | 29 novembre 2026 à 14:00 |

Les clés techniques des rencontres existantes sont conservées même si leur date change, pour préserver les favoris. Les marques « grandes affiches » déjà présentes sont conservées ; les ajouts reprennent les principaux clubs et derbies déjà mis en avant dans le catalogue.

## Répartition

| Pays | Total | Janvier | Dates/heures confirmées | Provisoires |
|---|---:|---:|---:|---:|
| Allemagne | 45 | 22 | 40 | 5 |
| Belgique | 8 | 3 | 6 | 2 |
| Espagne | 48 | 24 | 10 | 38 |
| France | 26 | 13 | 26 | 0 |
| Italie | 82 | 44 | 61 | 21 |
| Pays-Bas | 62 | 28 | 62 | 0 |

## Détail de chaque rencontre

| Pays | Rencontre | Date ou fenêtre | Heure de Paris | Source contrôlée |
|---|---|---|---|---|
| Allemagne | Bayern Munich – 1. FC Cologne | 2026-11-20 | 20:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/10) |
| France | Troyes – Le Havre | 2026-11-20 | 20:45 | [Source](https://ligue1.com/fr/articles/l1_article_5839-) |
| Italie | Como – Cagliari | 2026-11-21 | 15:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/w2zepi8iww3zamzewn8y.pdf) |
| Italie | Lazio – Lecce | 2026-11-21 | 15:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/w2zepi8iww3zamzewn8y.pdf) |
| Allemagne | Bayer Leverkusen – SC Paderborn 07 | 2026-11-21 | 15:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/10) |
| Allemagne | Borussia Mönchengladbach – Borussia Dortmund | 2026-11-21 | 15:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/10) |
| Allemagne | Eintracht Frankfurt – TSG Hoffenheim | 2026-11-21 | 15:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/10) |
| Espagne | Rayo Vallecano – Valencia CF | 2026-11-21 | 16:15 | [Source](https://www.laliga.com/laliga-easports/resultados/2026-27/jornada-13) |
| Italie | Parma – AS Roma | 2026-11-21 | 18:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/w2zepi8iww3zamzewn8y.pdf) |
| Allemagne | Schalke 04 – VfB Stuttgart | 2026-11-21 | 18:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/10) |
| Pays-Bas | Feyenoord – Excelsior Rotterdam | 2026-11-21 | 18:45 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| France | Lens – Toulouse | 2026-11-21 | 20:45 | [Source](https://ligue1.com/fr/articles/l1_article_5839-) |
| Pays-Bas | FC Groningen – sc Heerenveen | 2026-11-21 | 21:00 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Pays-Bas | Telstar – PEC Zwolle | 2026-11-21 | 21:00 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Espagne | Real Madrid – Celta Vigo | 2026-11-21 | 21:00 | [Source](https://www.laliga.com/laliga-easports/resultados/2026-27/jornada-13) |
| Italie | Juventus – Venezia | 2026-11-22 | 12:30 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/w2zepi8iww3zamzewn8y.pdf) |
| Espagne | FC Barcelone – Villarreal | 2026-11-22 | 14:00 | [Source](https://www.laliga.com/laliga-easports/resultados/2026-27/jornada-13) |
| Pays-Bas | Ajax – ADO Den Haag | 2026-11-22 | 14:30 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Pays-Bas | Sparta Rotterdam – AZ Alkmaar | 2026-11-22 | 14:30 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | Bologna – Udinese | 2026-11-22 | 15:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/w2zepi8iww3zamzewn8y.pdf) |
| France | Paris FC – Angers | 2026-11-22 | 15:00 | [Source](https://ligue1.com/fr/articles/l1_article_5839-) |
| Italie | Sassuolo – Genoa | 2026-11-22 | 15:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/w2zepi8iww3zamzewn8y.pdf) |
| Allemagne | FC Augsburg – FSV Mainz 05 | 2026-11-22 | 15:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/10) |
| Pays-Bas | Go Ahead Eagles – Fortuna Sittard | 2026-11-22 | 16:45 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | AC Milan – Frosinone | 2026-11-22 | 18:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/w2zepi8iww3zamzewn8y.pdf) |
| Belgique | Anderlecht – OH Louvain | 2026-11-22 | 18:30 | [Source](https://www.espn.com/soccer/match/_/gameId/401878941/oud-heverlee-leuven-anderlecht) |
| Italie | Atalanta – Inter Milan | 2026-11-22 | 20:45 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/w2zepi8iww3zamzewn8y.pdf) |
| Espagne | Getafe – Atlético Madrid | 2026-11-22 | 21:00 | [Source](https://www.laliga.com/laliga-easports/resultados/2026-27/jornada-13) |
| Italie | Monza – Fiorentina | 2026-11-23 | 20:45 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/w2zepi8iww3zamzewn8y.pdf) |
| Espagne | Levante – Elche | 2026-11-23 | 21:00 | [Source](https://www.laliga.com/laliga-easports/resultados/2026-27/jornada-13) |
| Pays-Bas | FC Groningen – Willem II | 2026-11-27 | 20:00 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | Venezia – Bologna | 2026-11-27 | 20:45 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Espagne | Levante – Racing Santander | 2026-11-27 | 21:00 | [Source](https://www.laliga.com/laliga-easports/resultados/2026-27/jornada-14) |
| Italie | Frosinone – Parma | 2026-11-28 | 15:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Allemagne | 1. FC Cologne – SV Elversberg | 2026-11-28 | 15:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/11) |
| Allemagne | FSV Mainz 05 – Union Berlin | 2026-11-28 | 15:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/11) |
| Pays-Bas | Excelsior Rotterdam – Telstar | 2026-11-28 | 16:30 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | Torino – Lazio | 2026-11-28 | 18:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Pays-Bas | PSV – Go Ahead Eagles | 2026-11-28 | 18:45 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | Inter Milan – Genoa | 2026-11-28 | 20:45 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| France | Le Havre – Strasbourg | 2026-11-28 | 20:45 | [Source](https://ligue1.com/fr/articles/l1_article_5843-) |
| France | Le Mans – Lille | 2026-11-28 | 20:45 | [Source](https://ligue1.com/fr/articles/l1_article_5843-) |
| France | PSG – Lorient | 2026-11-28 | 20:45 | [Source](https://ligue1.com/fr/articles/l1_article_5843-) |
| Pays-Bas | SC Cambuur – Sparta Rotterdam | 2026-11-28 | 21:00 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Espagne | Real Madrid – Alavés | 2026-11-28 | 21:00 | [Source](https://www.laliga.com/laliga-easports/resultados/2026-27/jornada-14) |
| Pays-Bas | ADO Den Haag – FC Utrecht | 2026-11-29 | 12:15 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | Udinese – Fiorentina | 2026-11-29 | 12:30 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Espagne | Valencia CF – Osasuna | 2026-11-29 | 14:00 | [Source](https://www.laliga.com/laliga-easports/resultados/2026-27/jornada-14) |
| Pays-Bas | Feyenoord – Ajax | 2026-11-29 | 14:30 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| France | Auxerre – Marseille | 2026-11-29 | 15:00 | [Source](https://ligue1.com/fr/articles/l1_article_5843-) |
| Italie | Sassuolo – Napoli | 2026-11-29 | 15:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Pays-Bas | PEC Zwolle – AZ Alkmaar | 2026-11-29 | 16:45 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | AS Roma – Monza | 2026-11-29 | 18:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Belgique | Union SG – La Gantoise | 2026-11-29 | 19:15 | [Source](https://www.espn.com/soccer/match/_/gameId/401878925/kaa-gent-union-st-gilloise) |
| Allemagne | Borussia Dortmund – Bayer Leverkusen | 2026-11-29 | 19:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/11) |
| Italie | Como – Juventus | 2026-11-29 | 20:45 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Espagne | Espanyol – Getafe | 2026-11-30 | 21:00 | [Source](https://www.laliga.com/laliga-easports/resultados/2026-27/jornada-14) |
| Espagne | FC Barcelone – Atlético Madrid | 2026-12-02 | 21:30 | [Source](https://www.espn.com/soccer/match/_/gameId/401882700/atletico-madrid-barcelona) |
| Pays-Bas | Telstar – FC Groningen | 2026-12-04 | 20:00 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Allemagne | Bayern Munich – SC Paderborn 07 | 2026-12-04 | 20:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/12) |
| Italie | Bologna – AS Roma | 2026-12-04 | 20:45 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Italie | Monza – Como | 2026-12-05 | 15:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Allemagne | Bayer Leverkusen – Borussia Mönchengladbach | 2026-12-05 | 15:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/12) |
| Allemagne | FC Augsburg – 1. FC Cologne | 2026-12-05 | 15:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/12) |
| Pays-Bas | Willem II – Feyenoord | 2026-12-05 | 16:30 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | Frosinone – Inter Milan | 2026-12-05 | 18:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Allemagne | Eintracht Frankfurt – Werder Bremen | 2026-12-05 | 18:30 | [Source](https://www.espn.com/soccer/match/_/gameId/401884714/werder-bremen-eintracht-frankfurt) |
| Pays-Bas | Sparta Rotterdam – NEC | 2026-12-05 | 18:45 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Pays-Bas | AZ Alkmaar – PSV | 2026-12-05 | 20:00 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| France | Lens – Le Havre | 2026-12-05 | 20:45 | [Source](https://ligue1.com/en/articles/l1_article_5979-programmation-tv-de-la-j13-a-la-j18) |
| France | Paris FC – Le Mans | 2026-12-05 | 20:45 | [Source](https://ligue1.com/en/articles/l1_article_5979-programmation-tv-de-la-j13-a-la-j18) |
| Espagne | Atlético Madrid – Betis Séville | 2026-12-04 → 2026-12-07 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882784/real-betis-atletico-madrid) |
| Espagne | FC Barcelone – Celta Vigo | 2026-12-04 → 2026-12-07 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882783/celta-vigo-barcelona) |
| Espagne | Getafe – Valencia CF | 2026-12-04 → 2026-12-07 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882782/valencia-getafe) |
| Espagne | Rayo Vallecano – Levante | 2026-12-04 → 2026-12-07 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882779/levante-rayo-vallecano) |
| Espagne | Villarreal – Real Sociedad | 2026-12-04 → 2026-12-07 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882777/real-sociedad-villarreal) |
| Pays-Bas | sc Heerenveen – SC Cambuur | 2026-12-06 | 12:15 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Pays-Bas | Ajax – FC Utrecht | 2026-12-06 | 14:30 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Pays-Bas | Go Ahead Eagles – FC Twente | 2026-12-06 | 14:30 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| France | Troyes – Lyon | 2026-12-06 | 15:00 | [Source](https://ligue1.com/en/articles/l1_article_5979-programmation-tv-de-la-j13-a-la-j18) |
| Italie | Lazio – Atalanta | 2026-12-06 | 15:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Allemagne | Schalke 04 – Borussia Dortmund | 2026-12-06 | 15:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/12) |
| Pays-Bas | ADO Den Haag – Excelsior Rotterdam | 2026-12-06 | 16:45 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | Juventus – Udinese | 2026-12-06 | 18:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Italie | AC Milan – Parma | 2026-12-06 | 20:45 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Italie | Venezia – Sassuolo | 2026-12-07 | 18:30 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Italie | Udinese – Frosinone | 2026-12-11 | 20:45 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| France | Auxerre – Toulouse | 2026-12-11 | 20:45 | [Source](https://ligue1.com/en/articles/l1_article_5979-programmation-tv-de-la-j13-a-la-j18) |
| Allemagne | 1. FC Cologne – RB Leipzig | 2026-12-12 | 15:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/13) |
| Allemagne | Borussia Dortmund – FC Augsburg | 2026-12-12 | 15:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/13) |
| France | PSG – Paris FC | 2026-12-12 | 17:15 | [Source](https://ligue1.com/en/articles/l1_article_5979-programmation-tv-de-la-j13-a-la-j18) |
| Allemagne | Borussia Mönchengladbach – Eintracht Frankfurt | 2026-12-12 | 18:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/13) |
| Pays-Bas | sc Heerenveen – Go Ahead Eagles | 2026-12-12 | 18:45 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | Como – Bologna | 2026-12-12 | 20:45 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| France | Le Havre – Le Mans | 2026-12-12 | 20:45 | [Source](https://ligue1.com/en/articles/l1_article_5979-programmation-tv-de-la-j13-a-la-j18) |
| Pays-Bas | PEC Zwolle – Excelsior Rotterdam | 2026-12-12 | 21:00 | [Source](https://www.espn.com/soccer/match/_/gameId/401875515/excelsior-pec-zwolle) |
| Espagne | Atlético Madrid – Valencia CF | 2026-12-11 → 2026-12-14 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882776/valencia-atletico-madrid) |
| Espagne | Espanyol – Celta Vigo | 2026-12-11 → 2026-12-14 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882772/celta-vigo-espanyol) |
| Espagne | Levante – Alavés | 2026-12-11 → 2026-12-14 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882771/alaves-levante) |
| Espagne | Real Madrid – Osasuna | 2026-12-11 → 2026-12-14 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882769/osasuna-real-madrid) |
| Espagne | Villarreal – Rayo Vallecano | 2026-12-11 → 2026-12-14 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882767/rayo-vallecano-villarreal) |
| Pays-Bas | PSV – Telstar | 2026-12-13 | 12:15 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | Lazio – AS Roma | 2026-12-13 | 12:30 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Belgique | Anderlecht – Charleroi | 2026-12-13 | 13:30 | [Source](https://www.espn.com/soccer/match/_/gameId/401878919/royal-charleroi-sc-anderlecht) |
| Pays-Bas | FC Groningen – Feyenoord | 2026-12-13 | 14:30 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Pays-Bas | Willem II – ADO Den Haag | 2026-12-13 | 14:30 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | Inter Milan – Torino | 2026-12-13 | 15:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Allemagne | FSV Mainz 05 – SC Freiburg | 2026-12-13 | 15:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/13) |
| Pays-Bas | AZ Alkmaar – NEC | 2026-12-13 | 16:45 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | Parma – Fiorentina | 2026-12-13 | 18:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Pays-Bas | Ajax – SC Cambuur | 2026-12-13 | 20:00 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | Atalanta – Genoa | 2026-12-14 | 18:30 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Italie | Juventus – Monza | 2026-12-14 | 20:45 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Italie | Frosinone – Lazio | 2026-12-18 | 18:30 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Pays-Bas | Telstar – Willem II | 2026-12-18 | 20:00 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Allemagne | Bayern Munich – Werder Bremen | 2026-12-18 | 20:30 | [Source](https://www.espn.com/soccer/match/_/gameId/401884700/werder-bremen-bayern-munich) |
| Italie | Sassuolo – Parma | 2026-12-19 | 15:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Allemagne | Bayer Leverkusen – Eintracht Frankfurt | 2026-12-19 | 15:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/14) |
| Allemagne | FC Augsburg – SC Paderborn 07 | 2026-12-19 | 15:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/14) |
| Allemagne | FSV Mainz 05 – 1. FC Cologne | 2026-12-19 | 15:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/14) |
| Pays-Bas | Excelsior Rotterdam – AZ Alkmaar | 2026-12-19 | 16:30 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | AC Milan – Como | 2026-12-19 | 18:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Italie | AS Roma – Juventus | 2026-12-19 | 20:45 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Espagne | FC Barcelone – Real Sociedad | 2026-12-18 → 2026-12-21 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882762/real-sociedad-barcelona) |
| Espagne | Getafe – Levante | 2026-12-18 → 2026-12-21 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882761/levante-getafe) |
| Espagne | Rayo Vallecano – Málaga | 2026-12-18 → 2026-12-21 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882759/malaga-rayo-vallecano) |
| Espagne | Valencia CF – Espanyol | 2026-12-18 → 2026-12-21 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882757/espanyol-valencia) |
| Pays-Bas | Feyenoord – FC Twente | 2026-12-20 | 14:30 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Pays-Bas | SC Cambuur – FC Groningen | 2026-12-20 | 14:30 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | Torino – Cagliari | 2026-12-20 | 15:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Italie | Venezia – Monza | 2026-12-20 | 15:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Pays-Bas | Go Ahead Eagles – Ajax | 2026-12-20 | 16:45 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Belgique | Union SG – Club Bruges | 2026-12-20 | 18:30 | [Source](https://www.espn.com/soccer/match/_/gameId/401878908/club-brugge-union-st-gilloise) |
| Allemagne | Schalke 04 – Borussia Mönchengladbach | 2026-12-20 | 19:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/14) |
| Pays-Bas | PSV – PEC Zwolle | 2026-12-20 | 20:00 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | Atalanta – Napoli | 2026-12-20 | 20:45 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Belgique | Anderlecht – Saint-Trond | 2026-12-27 | 13:30 | [Source](https://www.espn.com/soccer/match/_/gameId/401878901/sint-truidense-anderlecht) |
| Italie | Torino – Venezia | 2027-01-02 | 15:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Italie | AS Roma – Frosinone | 2027-01-02 | 18:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Italie | Monza – AC Milan | 2027-01-02 | 20:45 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| France | Paris FC – Le Havre | 2027-01-02 | 21:00 | [Source](https://ligue1.com/en/articles/l1_article_5979-programmation-tv-de-la-j13-a-la-j18) |
| France | Troyes – Rennes | 2027-01-02 | 21:00 | [Source](https://ligue1.com/en/articles/l1_article_5979-programmation-tv-de-la-j13-a-la-j18) |
| Espagne | Espanyol – FC Barcelone | 2027-01-01 → 2027-01-04 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882754/barcelona-espanyol) |
| Espagne | Levante – Valencia CF | 2027-01-01 → 2027-01-04 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882753/valencia-levante) |
| Espagne | Rayo Vallecano – Atlético Madrid | 2027-01-01 → 2027-01-04 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882750/atletico-madrid-rayo-vallecano) |
| Espagne | Real Madrid – Getafe | 2027-01-01 → 2027-01-04 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882749/getafe-real-madrid) |
| Espagne | Villarreal – Séville | 2027-01-01 → 2027-01-04 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882747/sevilla-villarreal) |
| Italie | Inter Milan – Sassuolo | 2027-01-03 | 12:30 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Italie | Como – Lecce | 2027-01-03 | 15:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| France | Le Mans – Lyon | 2027-01-03 | 15:00 | [Source](https://ligue1.com/en/articles/l1_article_5979-programmation-tv-de-la-j13-a-la-j18) |
| Italie | Udinese – Atalanta | 2027-01-03 | 15:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Italie | Parma – Napoli | 2027-01-03 | 18:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Italie | Bologna – Juventus | 2027-01-03 | 20:45 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| France | Lens – PSG | 2027-01-03 | 20:45 | [Source](https://ligue1.com/en/articles/l1_article_5979-programmation-tv-de-la-j13-a-la-j18) |
| Italie | Venezia – AS Roma | 2027-01-05 | 18:30 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Italie | AC Milan – Fiorentina | 2027-01-05 | 20:45 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Italie | Juventus – Torino | 2027-01-06 | 12:30 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Italie | Frosinone – Bologna | 2027-01-06 | 15:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Italie | Atalanta – Como | 2027-01-06 | 18:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Italie | Lazio – Inter Milan | 2027-01-06 | 20:45 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Italie | Sassuolo – Udinese | 2027-01-07 | 18:30 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Allemagne | Borussia Dortmund – FSV Mainz 05 | 2027-01-08 | 20:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/15) |
| Italie | Monza – Frosinone | 2027-01-09 | 15:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Allemagne | 1. FC Cologne – SC Freiburg | 2027-01-09 | 15:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/15) |
| Allemagne | Eintracht Frankfurt – Schalke 04 | 2027-01-09 | 15:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/15) |
| Pays-Bas | Sparta Rotterdam – Excelsior Rotterdam | 2027-01-09 | 16:30 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | AS Roma – AC Milan | 2027-01-09 | 18:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Allemagne | Borussia Mönchengladbach – Bayern Munich | 2027-01-09 | 18:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/15) |
| Pays-Bas | PEC Zwolle – FC Utrecht | 2027-01-09 | 18:45 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Pays-Bas | Willem II – Ajax | 2027-01-09 | 20:00 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | Bologna – Genoa | 2027-01-09 | 20:45 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Pays-Bas | AZ Alkmaar – sc Heerenveen | 2027-01-09 | 21:00 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Espagne | Atlético Madrid – Racing Santander | 2027-01-08 → 2027-01-11 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882744/racing-santander-atletico-madrid) |
| Espagne | Espanyol – Betis Séville | 2027-01-08 → 2027-01-11 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882741/real-betis-espanyol) |
| Espagne | Real Madrid – Levante | 2027-01-08 → 2027-01-11 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882739/levante-real-madrid) |
| Espagne | Valencia CF – Málaga | 2027-01-08 → 2027-01-11 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882737/malaga-valencia) |
| Italie | Como – Lazio | 2027-01-10 | 12:30 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Pays-Bas | ADO Den Haag – Telstar | 2027-01-10 | 14:30 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Pays-Bas | Feyenoord – PSV | 2027-01-10 | 14:30 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | Parma – Venezia | 2027-01-10 | 15:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Pays-Bas | FC Groningen – Go Ahead Eagles | 2027-01-10 | 16:45 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | Torino – Atalanta | 2027-01-10 | 18:00 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Italie | Inter Milan – Juventus | 2027-01-10 | 20:45 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Italie | Udinese – Napoli | 2027-01-11 | 20:45 | [Source](https://images.legaseriea.it/image/private/fl_attachment/prd/uregsxswxv7ddacwghha.pdf) |
| Allemagne | 1. FC Cologne – Borussia Dortmund | 2027-01-12 | 20:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/16) |
| Allemagne | FC Augsburg – Borussia Mönchengladbach | 2027-01-12 | 20:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/16) |
| Allemagne | FSV Mainz 05 – TSG Hoffenheim | 2027-01-12 | 20:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/16) |
| Allemagne | Bayern Munich – Bayer Leverkusen | 2027-01-13 | 20:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/16) |
| Allemagne | Schalke 04 – Werder Bremen | 2027-01-14 | 20:30 | [Source](https://www.espn.com/soccer/match/_/gameId/401884675/werder-bremen-schalke-04) |
| Pays-Bas | sc Heerenveen – Sparta Rotterdam | 2027-01-15 | 20:00 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Allemagne | Borussia Dortmund – SC Freiburg | 2027-01-16 | 15:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/17) |
| Allemagne | Borussia Mönchengladbach – Union Berlin | 2027-01-16 | 15:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/17) |
| Pays-Bas | Telstar – NEC | 2027-01-16 | 16:30 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Belgique | Union SG – RAAL La Louvière | 2027-01-16 | 18:15 | [Source](https://www.espn.com/soccer/match/_/gameId/401878894/raal-la-louviere-union-st-gilloise) |
| Allemagne | Eintracht Frankfurt – Bayern Munich | 2027-01-16 | 18:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/17) |
| Pays-Bas | Excelsior Rotterdam – Feyenoord | 2027-01-16 | 18:45 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Pays-Bas | ADO Den Haag – PEC Zwolle | 2027-01-16 | 20:00 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| France | Auxerre – Troyes | 2027-01-16 | 20:45 | [Source](https://ligue1.com/en/articles/l1_article_5979-programmation-tv-de-la-j13-a-la-j18) |
| Italie | AC Milan – Torino | 2027-01-15 → 2027-01-18 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401875010/torino-ac-milan) |
| Italie | Atalanta – AS Roma | 2027-01-15 → 2027-01-18 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401875030/as-roma-atalanta) |
| Espagne | Atlético Madrid – Real Sociedad | 2027-01-15 → 2027-01-18 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882736/real-sociedad-atletico-madrid) |
| Espagne | FC Barcelone – Elche | 2027-01-15 → 2027-01-18 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882733/elche-barcelona) |
| Espagne | Getafe – Athletic Bilbao | 2027-01-15 → 2027-01-18 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882732/athletic-club-getafe) |
| Italie | Juventus – Genoa | 2027-01-15 → 2027-01-18 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401875059/genoa-juventus) |
| Italie | Lazio – Bologna | 2027-01-15 → 2027-01-18 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401874796/bologna-lazio) |
| Espagne | Levante – Espanyol | 2027-01-15 → 2027-01-18 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882731/espanyol-levante) |
| Italie | Parma – Inter Milan | 2027-01-15 → 2027-01-18 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401875129/internazionale-parma) |
| Espagne | Rayo Vallecano – Séville | 2027-01-15 → 2027-01-18 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882728/sevilla-rayo-vallecano) |
| Italie | Sassuolo – Monza | 2027-01-15 → 2027-01-18 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401874818/monza-sassuolo) |
| Italie | Venezia – Frosinone | 2027-01-15 → 2027-01-18 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401875132/frosinone-venezia) |
| Espagne | Villarreal – Alavés | 2027-01-15 → 2027-01-18 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882727/alaves-villarreal) |
| Pays-Bas | Ajax – FC Groningen | 2027-01-17 | 14:30 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Pays-Bas | Go Ahead Eagles – AZ Alkmaar | 2027-01-17 | 14:30 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| France | Paris FC – Toulouse | 2027-01-17 | 15:00 | [Source](https://ligue1.com/en/articles/l1_article_5979-programmation-tv-de-la-j13-a-la-j18) |
| Pays-Bas | SC Cambuur – Willem II | 2027-01-17 | 16:45 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Allemagne | Bayer Leverkusen – Schalke 04 | 2027-01-17 | 17:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/17) |
| Pays-Bas | Excelsior Rotterdam – Fortuna Sittard | 2027-01-22 | 20:00 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| France | Troyes – Monaco | 2027-01-22 | 20:45 | [Source](https://ligue1.com/en/articles/l1_article_5979-programmation-tv-de-la-j13-a-la-j18) |
| Belgique | Union SG – Beveren | 2027-01-22 → 2027-01-24 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401878884/waasland-beveren-union-st-gilloise) |
| Allemagne | Borussia Mönchengladbach – RB Leipzig | 2027-01-23 | 15:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/18) |
| Allemagne | Schalke 04 – FC Augsburg | 2027-01-23 | 15:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/18) |
| Pays-Bas | Ajax – Telstar | 2027-01-23 | 16:30 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Pays-Bas | Feyenoord – PEC Zwolle | 2027-01-23 | 18:45 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| France | Le Mans – Angers | 2027-01-23 | 20:45 | [Source](https://ligue1.com/en/articles/l1_article_5979-programmation-tv-de-la-j13-a-la-j18) |
| France | Lens – Brest | 2027-01-23 | 20:45 | [Source](https://ligue1.com/en/articles/l1_article_5979-programmation-tv-de-la-j13-a-la-j18) |
| France | PSG – Auxerre | 2027-01-23 | 20:45 | [Source](https://ligue1.com/en/articles/l1_article_5979-programmation-tv-de-la-j13-a-la-j18) |
| Pays-Bas | PSV – ADO Den Haag | 2027-01-23 | 21:00 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | AS Roma – Udinese | 2027-01-22 → 2027-01-25 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401874824/udinese-as-roma) |
| Italie | Bologna – Atalanta | 2027-01-22 → 2027-01-25 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401875024/atalanta-bologna) |
| Italie | Como – Napoli | 2027-01-22 → 2027-01-25 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401874804/napoli-como) |
| Espagne | Espanyol – Villarreal | 2027-01-22 → 2027-01-25 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882722/villarreal-espanyol) |
| Italie | Frosinone – AC Milan | 2027-01-22 → 2027-01-25 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401875061/ac-milan-frosinone) |
| Espagne | Getafe – Osasuna | 2027-01-22 → 2027-01-25 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882721/osasuna-getafe) |
| Italie | Inter Milan – Venezia | 2027-01-22 → 2027-01-25 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401874856/venezia-internazionale) |
| Italie | Juventus – Cagliari | 2027-01-22 → 2027-01-25 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401875012/cagliari-juventus) |
| Italie | Monza – Lazio | 2027-01-22 → 2027-01-25 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401874863/lazio-monza) |
| Espagne | Real Madrid – Betis Séville | 2027-01-22 → 2027-01-25 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882719/real-betis-real-madrid) |
| Espagne | Valencia CF – Séville | 2027-01-22 → 2027-01-25 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882717/sevilla-valencia) |
| Pays-Bas | Go Ahead Eagles – SC Cambuur | 2027-01-24 | 12:15 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Pays-Bas | Sparta Rotterdam – FC Groningen | 2027-01-24 | 14:30 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| France | Le Havre – Rennes | 2027-01-24 | 15:00 | [Source](https://ligue1.com/en/articles/l1_article_5979-programmation-tv-de-la-j13-a-la-j18) |
| Allemagne | Eintracht Frankfurt – Union Berlin | 2027-01-24 | 15:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/18) |
| Pays-Bas | AZ Alkmaar – FC Utrecht | 2027-01-24 | 16:45 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Allemagne | Bayer Leverkusen – SV Elversberg | 2027-01-24 | 17:30 | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/18) |
| Allemagne | 1. FC Cologne – VfB Stuttgart | 2027-01-29 → 2027-01-31 (provisoire) | À confirmer | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/19) |
| Belgique | Anderlecht – La Gantoise | 2027-01-29 → 2027-01-31 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401878874/kaa-gent-anderlecht) |
| Allemagne | Bayern Munich – Schalke 04 | 2027-01-29 → 2027-01-31 (provisoire) | À confirmer | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/19) |
| Allemagne | Borussia Dortmund – TSG Hoffenheim | 2027-01-29 → 2027-01-31 (provisoire) | À confirmer | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/19) |
| Allemagne | FC Augsburg – Eintracht Frankfurt | 2027-01-29 → 2027-01-31 (provisoire) | À confirmer | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/19) |
| Allemagne | FSV Mainz 05 – Hamburger SV | 2027-01-29 → 2027-01-31 (provisoire) | À confirmer | [Source](https://www.bundesliga.com/en/bundesliga/matchday/2026-2027/19) |
| Pays-Bas | Sparta Rotterdam – Telstar | 2027-01-30 | 16:30 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Pays-Bas | ADO Den Haag – Go Ahead Eagles | 2027-01-30 | 18:45 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Pays-Bas | Willem II – PSV | 2027-01-30 | 20:00 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| France | Le Mans – Nice | 2027-01-30 | 20:45 | [Source](https://ligue1.com/en/articles/l1_article_5979-programmation-tv-de-la-j13-a-la-j18) |
| France | Paris FC – Auxerre | 2027-01-30 | 20:45 | [Source](https://ligue1.com/en/articles/l1_article_5979-programmation-tv-de-la-j13-a-la-j18) |
| Pays-Bas | PEC Zwolle – Fortuna Sittard | 2027-01-30 | 21:00 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Italie | AC Milan – Juventus | 2027-01-29 → 2027-02-01 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401875078/juventus-ac-milan) |
| Italie | Atalanta – Fiorentina | 2027-01-29 → 2027-02-01 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401875109/fiorentina-atalanta) |
| Espagne | Atlético Madrid – Espanyol | 2027-01-29 → 2027-02-01 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882716/espanyol-atletico-madrid) |
| Espagne | FC Barcelone – Valencia CF | 2027-01-29 → 2027-02-01 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882713/valencia-barcelona) |
| Italie | Lazio – Venezia | 2027-01-29 → 2027-02-01 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401874809/venezia-lazio) |
| Espagne | Levante – Real Sociedad | 2027-01-29 → 2027-02-01 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882712/real-sociedad-levante) |
| Italie | Monza – AS Roma | 2027-01-29 → 2027-02-01 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401875043/as-roma-monza) |
| Espagne | Rayo Vallecano – Real Madrid | 2027-01-29 → 2027-02-01 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882709/real-madrid-rayo-vallecano) |
| Italie | Sassuolo – Como | 2027-01-29 → 2027-02-01 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401874806/como-sassuolo) |
| Italie | Torino – Frosinone | 2027-01-29 → 2027-02-01 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401874867/frosinone-torino) |
| Italie | Udinese – Bologna | 2027-01-29 → 2027-02-01 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401875102/bologna-udinese) |
| Espagne | Villarreal – Racing Santander | 2027-01-29 → 2027-02-01 (provisoire) | À confirmer | [Source](https://www.espn.com/soccer/match/_/gameId/401882707/racing-santander-villarreal) |
| Pays-Bas | sc Heerenveen – Ajax | 2027-01-31 | 12:15 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Pays-Bas | AZ Alkmaar – Feyenoord | 2027-01-31 | 14:30 | [Source](https://www.knvb.nl/competities/eredivisie/programma) |
| Pays-Bas | FC Groningen – NEC | 2027-01-31 | 16:45 | [Source](https://www.espn.com/soccer/match/_/gameId/401875664/nec-nijmegen-fc-groningen) |
