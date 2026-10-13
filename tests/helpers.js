export const mk = (over = {}) => ({
  fixture_key: `${over.date || '2026-10-17'}-${over.home || 'a'}-${over.away || 'b'}`,
  country: 'France', zone: 'Paris', cluster: 'Paris & alentours', city: 'Paris', league: 'Ligue 1',
  home: 'PSG', away: 'Lyon', date: '2026-10-17', time: '20:45', provisional: false, highlight: false, source_url: 'x',
  ...over,
});
