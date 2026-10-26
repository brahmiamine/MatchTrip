import { useCallback, useEffect, useRef, useState } from 'react';
import { api, auth, configured } from '../lib/client.js';

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
    if (!configured) return undefined;
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
      let data = null;
      try {
        const stored = await api('GET', '/preferences/' + key);
        data = stored.value === null ? null : { value: stored.value };
      } catch (error) {
        if (!active || token !== generation) return;
        hydratedUser.current = undefined;
        window.dispatchEvent(new CustomEvent('matchtrip-sync-error', { detail: 'Synchronisation indisponible : ' + error.message }));
        return;
      }
      if (!active || token !== generation) return;
      if (edits.current === edited && (overrideRef.current === null || previousUser)) {
        const next = data && validRef.current(data.value) ? data.value : previousUser ? readLocal(userId) : valueRef.current;
        valueRef.current = next;
        setValue(next);
      }
      setReadyUser(userId);
    };
    hydrate(auth.getSession());
    const unsubscribe = auth.onChange(session => { setTimeout(() => { if (active) hydrate(session); }, 0); });
    return () => { active = false; generation++; hydratedUser.current = undefined; unsubscribe(); };
  }, [key, readLocal]);
  useEffect(() => {
    valueRef.current = value;
    try { localStorage.setItem(currentUser.current ? `${key}:${currentUser.current}` : key, JSON.stringify(value)); } catch { /* offline cache unavailable */ }
    if (!configured || !readyUser) return undefined;
    const timer = setTimeout(async () => {
      if (currentUser.current !== readyUser) return;
      try { await api('PUT', '/preferences/' + key, { value }); }
      catch (error) { window.dispatchEvent(new CustomEvent('matchtrip-sync-error', { detail: 'Sauvegarde indisponible : ' + error.message })); }
    }, 400);
    return () => clearTimeout(timer);
  }, [value, readyUser, key]);
  return [value, set];
}
