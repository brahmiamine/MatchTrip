import { useStoredPreference } from './useStoredPreference.js';

/** Valeur simple mémorisée localement (thème, affichage) ; repli silencieux si le stockage est indisponible. */
export function usePersistentValue(key, fallback, allowed) {
  return useStoredPreference(key, fallback, { valid: value => typeof value === 'string' && (!allowed || allowed.includes(value)) });
}
