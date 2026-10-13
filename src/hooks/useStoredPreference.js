import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase.js';

export function useStoredPreference(key, fallback, { valid = () => true, override = null } = {}) {
  const fallbackRef = useRef(fallback), validRef = useRef(valid), overrideRef = useRef(override);
  const readLocal = useCallback((scope = '') => {
    try {
      const raw = localStorage.getItem(scope ? `${key}:${scope}` : key);
      if (raw !== null) {
        let value;
        try { value = JSON.parse(raw); } catch { value = raw; }
        if (validRef.current(value)) return value;
      }
    } catch { /* private mode */ }
    return fallbackRef.current;
  }, [key]);
  const [value, setValue] = useState(() => override ?? readLocal());
  const valueRef = useRef(value), edits = useRef(0), currentUser = useRef(null), hydratedUser = useRef(undefined);
  const [readyUser, setReadyUser] = useState(null);
  const set = useCallback(update => {
    edits.current++;
    setValue(previous => {
      const next = typeof update === 'function' ? update(previous) : update;
      valueRef.current = next;
      return next;
    });
  }, []);
  useEffect(() => {
    if (!supabase) return undefined;
    let active = true, generation = 0;
    const hydrate = async session => {
      const userId = session?.user?.id ?? null;
      if (hydratedUser.current === userId) return;
      hydratedUser.current = userId;
      const token = ++generation, edited = edits.current;
      const previousUser = currentUser.current;
      currentUser.current = userId;
      setReadyUser(null);
      if (!userId) {
        if (previousUser) { const local = readLocal(); valueRef.current = local; setValue(local); }
        return;
      }
      if (previousUser && previousUser !== userId) {
        const local = readLocal(userId);
        valueRef.current = local;
        setValue(local);
      }
      const { data, error } = await supabase.from('matchtrip_preferences').select('value').eq('user_id', userId).eq('key', key).maybeSingle();
      if (!active || token !== generation) return;
      if (error) {
        hydratedUser.current = undefined;
        window.dispatchEvent(new CustomEvent('matchtrip-sync-error', { detail: 'Synchronisation indisponible : ' + error.message }));
        return;
      }
      if (edits.current === edited && (overrideRef.current === null || previousUser)) {
        const next = data && validRef.current(data.value) ? data.value : previousUser ? readLocal(userId) : valueRef.current;
        valueRef.current = next;
        setValue(next);
      }
      setReadyUser(userId);
    };
    supabase.auth.getSession().then(({ data }) => { if (active) hydrate(data.session); });
    // Never await a Supabase query inside the auth callback (auth lock).
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { setTimeout(() => { if (active) hydrate(session); }, 0); });
    return () => { active = false; generation++; hydratedUser.current = undefined; listener.subscription.unsubscribe(); };
  }, [key, readLocal]);
  useEffect(() => {
    valueRef.current = value;
    try { localStorage.setItem(currentUser.current ? `${key}:${currentUser.current}` : key, JSON.stringify(value)); } catch { /* offline cache unavailable */ }
    if (!supabase || !readyUser) return undefined;
    const timer = setTimeout(async () => {
      if (currentUser.current !== readyUser) return;
      const { error } = await supabase.from('matchtrip_preferences').upsert({ user_id: readyUser, key, value, updated_at: new Date().toISOString() }, { onConflict: 'user_id,key' });
      if (error) window.dispatchEvent(new CustomEvent('matchtrip-sync-error', { detail: 'Sauvegarde indisponible : ' + error.message }));
    }, 400);
    return () => clearTimeout(timer);
  }, [value, readyUser, key]);
  return [value, set];
}
