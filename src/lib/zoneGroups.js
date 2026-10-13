/** 
 * Zones admises dans les suggestions de combinaisons de week-ends.
 * Les groupes étendus (Venise/Udine, villes italiennes dispersées) sont exclus,
 * sans retirer leurs rencontres du catalogue et de la vue « Tous les matchs ».
 *
 * EXCEPTION DEMANDÉE : Paris et « Autour de Paris » restent un SEUL groupe.
 * Aucun temps de trajet n'est garanti par cette classification.
 */
export const WEEKEND_ZONE_GROUPS = Object.freeze({
  France: Object.freeze({
    Paris: 'Paris & alentours',
    'Autour de Paris': 'Paris & alentours',
  }),
  Belgique: Object.freeze({
    Bruxelles: 'Bruxelles',
  }),
  Espagne: Object.freeze({
    Madrid: 'Madrid',
    Barcelone: 'Barcelone',
    'Valence / Villarreal': 'Valence & Villarreal',
  }),
  Italie: Object.freeze({
    'Milan / Lombardie': 'Milan / Lombardie',
    'Rome / Latium': 'Rome / Latium',
    'Bologne / Émilie-Romagne': 'Bologne / Émilie-Romagne',
    'Turin / Piémont': 'Turin',
  }),
});

/** Le nom du groupe provient de la liste blanche, jamais du cluster distant. */
export function getWeekendGroup(match) {
  if (!match.cluster) return null;
  return WEEKEND_ZONE_GROUPS[match.country]?.[match.zone] ?? null;
}
