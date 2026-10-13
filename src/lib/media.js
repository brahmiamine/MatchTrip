import clubMedia from '../data/clubMedia.json';
let catalogue = clubMedia;
export const mediaForClub = name => catalogue[name] ?? {};
export function configureMedia(clubs) { catalogue = Object.fromEntries(clubs.map(c => [c.club, c])); }
export function enrichFixture(match) {
  const home = mediaForClub(match.home), away = mediaForClub(match.away);
  return { ...match, home_logo_url: match.home_logo_url || home.logo_url, away_logo_url: match.away_logo_url || away.logo_url,
    stadium: match.stadium || home.stadium, stadium_image_url: match.stadium_image_url || home.stadium_image_url,
    stadium_source_url: match.stadium_source_url || home.stadium_source_url };
}

export function stadiumCredits(match) {
  const home = mediaForClub(match.home);
  return { source: home.stadium_image_page_url || match.stadium_source_url, license: home.stadium_image_license, author: home.stadium_image_author };
}
