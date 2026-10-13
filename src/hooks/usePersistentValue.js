import { useEffect, useState } from 'react';

/** Valeur simple mémorisée localement (thème, affichage) ; repli silencieux si le stockage est indisponible. */
export function usePersistentValue(key, fallback, allowed) {
  const [value, setValue] = useState(() => {
    try {
      const v = globalThis.localStorage?.getItem(key);
      return v !== null && v !== undefined && (!allowed || allowed.includes(v)) ? v : fallback;
    } catch { return fallback; }
  });
  useEffect(() => { try { globalThis.localStorage?.setItem(key, value); } catch { /* stockage indisponible */ } }, [key, value]);
  return [value, setValue];
}
