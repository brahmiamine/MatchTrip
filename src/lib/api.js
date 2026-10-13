import { createClient } from '@supabase/supabase-js';
import { seedFixtures } from '../data/fixtures.js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const configured = Boolean(url && key);
const supabase = configured ? createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}}) : null;

export async function loadFixtures() {
  if (!supabase) return { fixtures: seedFixtures, origin: 'catalogue intégré', error: null };
  try {
    // Pagination pour ne jamais dépendre de la limite par défaut du Data API.
    const all=[];
    for(let page=0;page<100;page++){
      const {data,error}=await supabase.from('matches').select('*').order('date',{ascending:true}).order('time',{ascending:true}).range(page*500,(page+1)*500-1);
      if(error)throw error;
      all.push(...(data??[]));
      if((data??[]).length<500)break;
    }
    return {fixtures:all.map(row=>({...row,time:row.time?row.time.slice(0,5):null})),origin:'Supabase',error:null};
  } catch(err) {
    return {fixtures:seedFixtures,origin:'catalogue intégré',error:'Supabase inaccessible : données intégrées affichées. '+(err?.message??'')};
  }
}
