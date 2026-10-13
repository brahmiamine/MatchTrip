/**
 * Villes de séjour (première étape touristique) et villes des clubs receveurs.
 * Coordonnées arrondies de centres-villes : distances indicatives à vol d'oiseau,
 * PAS des trajets routiers, distances de stade à stade ou durées de transport.
 * En cas de club inconnu, ne pas inventer de kilométrage.
 */
export let DESTINATION_HUBS = Object.freeze({
  France: { Paris: 'Paris', 'Autour de Paris': 'Paris' },
  Belgique: { Bruxelles: 'Bruxelles' },
  Espagne: { Madrid: 'Madrid', Barcelone: 'Barcelone', 'Valence / Villarreal': 'Valence' },
  'Pays-Bas': {
    Amsterdam: 'Amsterdam', 'Amsterdam / Alkmaar': 'Amsterdam',
    'Rotterdam / La Haye': 'Rotterdam', 'Nord des Pays-Bas': 'Groningen',
    'Eindhoven / Tilburg': 'Eindhoven', 'Zwolle / Deventer': 'Zwolle',
  },
  Allemagne: {
    'Cologne / Leverkusen / Mönchengladbach': 'Cologne',
    'Dortmund / Schalke': 'Dortmund', 'Francfort / Mayence': 'Francfort',
    'Munich / Augsbourg': 'Munich',
  },
  Italie: {
    'Milan / Lombardie': 'Milan', 'Rome / Latium': 'Rome',
    'Bologne / Émilie-Romagne': 'Bologne', 'Turin / Piémont': 'Turin',
    'Venise / Udine': 'Venise',
  },
});

/** Coordonnées approximatives en degrés décimaux des centres-villes. */
export let CITY_COORDINATES = Object.freeze({
  Paris: [48.8566, 2.3522], Troyes: [48.2973, 4.0744],
  'Le Havre': [49.4944, 0.1079], Lens: [50.4289, 2.8318],
  Auxerre: [47.7982, 3.567], 'Le Mans': [48.0061, 0.1996],
  Bruxelles: [50.8503, 4.3517],
  Madrid: [40.4168, -3.7038], Getafe: [40.3083, -3.7327],
  Barcelone: [41.3874, 2.1686], Valence: [39.4699, -0.3763],
  Villarreal: [39.9383, -0.1004],
  Amsterdam: [52.3676, 4.9041], Alkmaar: [52.6324, 4.7534],
  Rotterdam: [51.9244, 4.4777], 'La Haye': [52.0705, 4.3007],
  'Velsen-Zuid': [52.4603, 4.6494],
  Groningen: [53.2194, 6.5665], Leeuwarden: [53.2012, 5.7999],
  Heerenveen: [52.9593, 5.9198], Eindhoven: [51.4416, 5.4697],
  Tilburg: [51.5555, 5.0913], Zwolle: [52.5168, 6.083],
  Deventer: [52.255, 6.1639],
  Cologne: [50.9375, 6.9603], Leverkusen: [51.0459, 7.0192],
  Mönchengladbach: [51.1805, 6.4428], Dortmund: [51.5136, 7.4653],
  Gelsenkirchen: [51.5177, 7.0857],
  Francfort: [50.1109, 8.6821], Mayence: [50.0, 8.2711],
  Munich: [48.1351, 11.582], Augsbourg: [48.3705, 10.8978],
  Milan: [45.4642, 9.19], Côme: [45.8081, 9.0852],
  Bergame: [45.6983, 9.6773], Monza: [45.5845, 9.2744],
  Rome: [41.9028, 12.4964], Frosinone: [41.6398, 13.3417],
  Bologne: [44.4949, 11.3426], Parme: [44.8015, 10.3279],
  Sassuolo: [44.543, 10.7858], Turin: [45.0703, 7.6869],
  Venise: [45.4408, 12.3155], Udine: [46.0711, 13.2346],
  Florence: [43.7696, 11.2558], Cagliari: [39.2238, 9.1217],
  Naples: [40.8518, 14.2681], 'Gênes': [44.4056, 8.9463],
  Lecce: [40.3529, 18.1743],
});

/** Le champ « city » du catalogue désigne parfois la région, pas le stade. */
export let HOME_CITIES = Object.freeze({
  'Paris FC': 'Paris', PSG: 'Paris', Troyes: 'Troyes', 'Le Havre': 'Le Havre',
  Lens: 'Lens', Auxerre: 'Auxerre', 'Le Mans': 'Le Mans',
  'Union SG': 'Bruxelles', Anderlecht: 'Bruxelles',
  Ajax: 'Amsterdam', 'AZ Alkmaar': 'Alkmaar', 'ADO Den Haag': 'La Haye',
  Telstar: 'Velsen-Zuid', 'Sparta Rotterdam': 'Rotterdam',
  'PEC Zwolle': 'Zwolle', 'SC Cambuur': 'Leeuwarden',
  'FC Groningen': 'Groningen', 'Willem II': 'Tilburg', PSV: 'Eindhoven',
  Feyenoord: 'Rotterdam', 'sc Heerenveen': 'Heerenveen',
  'Excelsior Rotterdam': 'Rotterdam', 'Go Ahead Eagles': 'Deventer',
  'Real Madrid': 'Madrid', 'Rayo Vallecano': 'Madrid',
  'Atlético Madrid': 'Madrid', Getafe: 'Getafe',
  Espanyol: 'Barcelone', 'FC Barcelone': 'Barcelone',
  Villarreal: 'Villarreal', 'Valencia CF': 'Valence', Levante: 'Valence',
  'AC Milan': 'Milan', Como: 'Côme', 'Inter Milan': 'Milan',
  Atalanta: 'Bergame', Monza: 'Monza', 'AS Roma': 'Rome', Lazio: 'Rome',
  Frosinone: 'Frosinone', Bologna: 'Bologne', Parma: 'Parme',
  Sassuolo: 'Sassuolo', Juventus: 'Turin', Torino: 'Turin',
  Venezia: 'Venise', Udinese: 'Udine', Fiorentina: 'Florence',
  Cagliari: 'Cagliari', Napoli: 'Naples', Genoa: 'Gênes', Lecce: 'Lecce',
  'Schalke 04': 'Gelsenkirchen', 'Bayern Munich': 'Munich',
  'Bayer Leverkusen': 'Leverkusen',
  'Borussia Mönchengladbach': 'Mönchengladbach',
  '1. FC Cologne': 'Cologne', 'Borussia Dortmund': 'Dortmund',
  'Eintracht Frankfurt': 'Francfort', 'FSV Mainz 05': 'Mayence',
  'FC Augsburg': 'Augsbourg',
});

/** Paris et Autour de Paris : même destination pour TOUS les regroupements. */
export function getDestinationLabel(match) {
  const zone = match.country === 'France' && ['Paris', 'Autour de Paris'].includes(match.zone)
    ? 'Paris & alentours' : match.zone;
  return `${match.country} / ${zone}`;
}

/** Ville principale à visiter / ville de séjour proposée pour une destination. */
/** Nom lisible de la zone sans répéter le pays. */
export function getDestinationName(match) {
  return getDestinationLabel(match).slice(match.country.length + 3);
}

export function getDestinationHub(match) {
  const name = DESTINATION_HUBS[match.country]?.[match.zone];
  return name && CITY_COORDINATES[name] ? name : null;
}

export function haversineKm(a, b) {
  const rad = Math.PI / 180;
  const dLat = (b[0] - a[0]) * rad;
  const dLon = (b[1] - a[1]) * rad;
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
}

/** null si la ville de résidence du club ou le point d'arrivée est inconnue. */
export function getMatchDistance(match) {
  const hub = getDestinationHub(match);
  const city = HOME_CITIES[match.home] ?? match.city;
  if (!hub || !CITY_COORDINATES[city]) return null;
  return { hub, city, km: Math.round(haversineKm(CITY_COORDINATES[hub], CITY_COORDINATES[city])) };
}

export function configureDestinations({ hubs, coordinates, homeCities }) {
  DESTINATION_HUBS = hubs;
  CITY_COORDINATES = coordinates;
  HOME_CITIES = homeCities;
}
