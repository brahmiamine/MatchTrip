import { api, configured } from './client.js';
export { configured } from './client.js';
import { configureMedia, enrichFixture } from './media.js';
import { configureTicketing } from './ticketing.js';
import { configureDestinations, DESTINATION_HUBS, CITY_COORDINATES, HOME_CITIES } from './destinations.js';
import { configureZoneGroups, WEEKEND_ZONE_GROUPS } from './zoneGroups.js';
import { configureConstants } from '../constants.js';
import * as originalConstants from '../constants.js';
import offlineMedia from '../data/clubMedia.json';
import { seedFixtures } from '../data/fixtures.js';
import { newFixtures } from '../data/newFixtures.js';
import { VERIFIED_FRIDAY_FIXTURES, markFixtureVerification } from '../data/verifiedSchedule.js';
const embedded = [...seedFixtures, ...newFixtures, ...VERIFIED_FRIDAY_FIXTURES].map(markFixtureVerification);
const offlineConfig = { hubs: DESTINATION_HUBS, coordinates: CITY_COORDINATES, homeCities: HOME_CITIES, zoneGroups: WEEKEND_ZONE_GROUPS, constants: { ...originalConstants } };
function restoreOfflineCatalogue() {
  configureMedia(Object.entries(offlineMedia).map(([club, row]) => ({ club, ...row })));
  configureTicketing(Object.entries(offlineMedia).map(([club, row]) => ({ club, ...row })));
  configureDestinations(offlineConfig);
  configureZoneGroups(offlineConfig.zoneGroups);
  configureConstants(offlineConfig.constants);
}

export async function loadFixtures() {
  if (!configured) { restoreOfflineCatalogue(); return { fixtures: embedded.map(enrichFixture), origin: 'catalogue intégré', error: null }; }
  try {
    const [all, media, settings] = await Promise.all([api('GET', '/fixtures'), api('GET', '/club-media'), api('GET', '/catalog-config/catalogue')]);
    const config = settings.value;
    if (!config.hubs || !config.coordinates || !config.homeCities || !config.zoneGroups) throw new Error('Configuration du catalogue incomplète');
    configureDestinations(config);
    configureZoneGroups(config.zoneGroups);
    if (config.constants) configureConstants(config.constants);
    configureTicketing(media);
    configureMedia(media);
    const clubs = new Map((media ?? []).map(row => [row.club, row]));
    const withMedia = row => {
      const home = clubs.get(row.home) ?? {}, away = clubs.get(row.away) ?? {};
      return enrichFixture({ ...row, home_logo_url: row.home_logo_url || home.logo_url, away_logo_url: row.away_logo_url || away.logo_url,
        stadium: row.venue_override || row.stadium || home.stadium, stadium_image_url: row.stadium_image_url || home.stadium_image_url, stadium_source_url: row.venue_source_url || row.stadium_source_url || home.stadium_source_url });
    };
    const unique = [...new Map(all.filter(row => row.zone !== 'Autres villes italiennes').map(row => [row.fixture_key, row])).values()];
    // Confirmation comes exclusively from the database. Embedded confirmations are offline fallback only.
    return {fixtures:unique.map(row=>withMedia({...row,time:row.time?row.time.slice(0,5):null})),origin:'Serveur',error:null};
  } catch(err) {
    restoreOfflineCatalogue();
    return {fixtures:embedded.map(enrichFixture),origin:'catalogue intégré',error:'Serveur inaccessible : données intégrées affichées. '+(err?.message??'')};
  }
}
