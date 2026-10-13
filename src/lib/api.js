import { supabase } from './supabase.js';
export { configured } from './supabase.js';
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

async function readAll(table, ordering) {
  const all = [];
  for (let page = 0; page < 100; page++) {
    let query = supabase.from(table).select('*');
    for (const column of ordering) query = query.order(column, { ascending: true });
    const { data, error } = await query.range(page * 500, (page + 1) * 500 - 1);
    if (error) throw error;
    all.push(...(data ?? []));
    if ((data ?? []).length < 500) return all;
  }
  throw new Error('Catalogue trop volumineux : pagination incomplète');
}

export async function loadFixtures() {
  if (!supabase) { restoreOfflineCatalogue(); return { fixtures: embedded.map(enrichFixture), origin: 'catalogue intégré', error: null }; }
  try {
    // Pagination pour ne jamais dépendre de la limite par défaut du Data API.
    const all = await readAll('matchtrip_fixtures', ['date', 'time', 'fixture_key']);
    const media = await readAll('matchtrip_club_media', ['club']);
    const { data: settings, error: settingsError } = await supabase.from('matchtrip_catalog_config').select('value').eq('key', 'catalogue').single();
    if (settingsError) throw settingsError;
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
    return {fixtures:unique.map(row=>withMedia({...row,time:row.time?row.time.slice(0,5):null})),origin:'Supabase',error:null};
  } catch(err) {
    restoreOfflineCatalogue();
    return {fixtures:embedded.map(enrichFixture),origin:'catalogue intégré',error:'Supabase inaccessible : données intégrées affichées. '+(err?.message??'')};
  }
}
