import clubMedia from '../data/clubMedia.json';
export const mediaForClub = name => clubMedia[name] ?? {};
export function enrichFixture(match) {
  const home = mediaForClub(match.home), away = mediaForClub(match.away);
  return { ...match, home_logo_url: match.home_logo_url || home.logo_url, away_logo_url: match.away_logo_url || away.logo_url,
    stadium: match.stadium || home.stadium, stadium_image_url: match.stadium_image_url || home.stadium_image_url,
    stadium_source_url: match.stadium_source_url || home.stadium_source_url };
}
