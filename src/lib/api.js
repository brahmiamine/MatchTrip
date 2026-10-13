import { createClient } from '@supabase/supabase-js';
import { enrichFixture } from './media.js';
import { seedFixtures } from '../data/fixtures.js';
import { newFixtures } from '../data/newFixtures.js';
const embedded = [...seedFixtures, ...newFixtures];

// Public anon key: read-only tables protected by Row-Level Security.
const url = import.meta.env.VITE_SUPABASE_URL || 'https://ewswqwmaejddwqiwaspq.supabase.co';
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3c3dxd21hZWpkZHdxaXdhc3BxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1OTIwMDMsImV4cCI6MjA3ODE2ODAwM30.7KGg8oQSD70Wvoi6h82xGY6VEpnyDw91VDj_xknN0bU';
export const configured = Boolean(url && key);
const supabase = configured ? createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}}) : null;

export async function loadFixtures() {
  if (!supabase) return { fixtures: embedded.map(enrichFixture), origin: 'catalogue intégré', error: null };
  try {
    // Pagination pour ne jamais dépendre de la limite par défaut du Data API.
    const all=[];
    for(let page=0;page<100;page++){
      const {data,error}=await supabase.from('matchtrip_fixtures').select('*').order('date',{ascending:true}).order('time',{ascending:true}).order('fixture_key',{ascending:true}).range(page*500,(page+1)*500-1);
      if(error)throw error;
      all.push(...(data??[]));
      if((data??[]).length<500)break;
    }
    const { data: media } = await supabase.from('matchtrip_club_media').select('*');
    const clubs = new Map((media ?? []).map(row => [row.club, row]));
    const withMedia = row => {
      const home = clubs.get(row.home) ?? {}, away = clubs.get(row.away) ?? {};
      return enrichFixture({ ...row, home_logo_url: row.home_logo_url || home.logo_url, away_logo_url: row.away_logo_url || away.logo_url,
        stadium: row.stadium || home.stadium, stadium_image_url: row.stadium_image_url || home.stadium_image_url, stadium_source_url: row.stadium_source_url || home.stadium_source_url });
    };
    const unique = [...new Map(all.map(row => [row.fixture_key, row])).values()];
    return {fixtures:unique.map(row=>withMedia({...row,time:row.time?row.time.slice(0,5):null})),origin:'Supabase',error:null};
  } catch(err) {
    return {fixtures:embedded.map(enrichFixture),origin:'catalogue intégré',error:'Supabase inaccessible : données intégrées affichées. '+(err?.message??'')};
  }
}
