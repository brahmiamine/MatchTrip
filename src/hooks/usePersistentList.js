import { useStoredPreference } from './useStoredPreference.js';

export function usePersistentList(key, fallback, override = null) {
  return useStoredPreference(key, fallback, { valid: value => Array.isArray(value) && value.every(x => typeof x === 'string'), override });
}
