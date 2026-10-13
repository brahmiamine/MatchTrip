/** Lien Google Maps de recherche pour un stade (le pays lève les ambiguïtés de nom). */
export function mapsUrl(stadium, country = '') {
  const query = [stadium, country].filter(Boolean).join(', ');
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
}
