import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL || 'https://nkcvffmgosvipnxcttms.supabase.co';
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_mqqFN222VJ58VHFvdgYZRA_MvwrzLlB';
export const configured = Boolean(url && key);
export const supabase = configured ? createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: 'matchtrip-auth' }
}) : null;
