import coords from '../data/stadiumCoords.json';
import { compareChrono } from './sorting.js';

const R = 6371;
const rad = d => (d * Math.PI) / 180;

/** Distance à vol d'oiseau (haversine) en km entre deux points [lat, lon]. */
export function haversineKm([lat1, lon1], [lat2, lon2]) {
  const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lon2 - lon1) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export const coordsOf = stadium => coords[stadium] ?? null;
/** « 105 km » ; moins de 1 km → « < 1 km ». */
export const formatKm = km => (km < 1 ? '< 1 km' : `${Math.round(km)} km`);

/** Stades distincts (avec coordonnées connues) dans l'ordre chronologique des matchs. */
function venuesInOrder(matches) {
  const venues = [];
  [...matches].sort(compareChrono).forEach(m => {
    if (!m.stadium || !coordsOf(m.stadium)) return;
    if (venues[venues.length - 1] !== m.stadium) venues.push(m.stadium);
  });
  return venues;
}

/** Trajets entre stades successifs : [{ from, to, km }]. Vide s'il y a moins de deux stades différents. */
export function legsBetweenMatches(matches) {
  const v = venuesInOrder(matches);
  return v.slice(1).map((to, i) => ({ from: v[i], to, km: haversineKm(coordsOf(v[i]), coordsOf(to)) })).filter(l => l.from !== l.to);
}

/** Plus grande distance entre deux stades du groupe, ou null s'il y en a moins de deux. */
export function maxSpreadKm(matches) {
  const v = [...new Set(venuesInOrder(matches))];
  let max = null;
  for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) {
    const km = haversineKm(coordsOf(v[i]), coordsOf(v[j]));
    if (max === null || km > max) max = km;
  }
  return max;
}
