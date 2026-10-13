/** Lien Google Maps de recherche pour un stade (le pays lève les ambiguïtés de nom). */
export function mapsUrl(stadium, country = '') {
  const query = [stadium, country].filter(Boolean).join(', ');
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
}

/** Itinéraire Google Maps entre la ville touristique de référence et la ville du club recevant. */
import { getMatchDistance } from './destinations.js';
export function getMatchDirectionsUrl(match) {
  const distance = getMatchDistance(match);
  if (!distance) return null;
  const params = new URLSearchParams({
    api: '1', origin: `${distance.hub}, ${match.country}`,
    destination: `${distance.city}, ${match.country}`,
    travelmode: 'driving'
  });
  return `https://www.google.com/maps/dir/?${params}`;
}
