export function restoreList(key, fallback, storage = globalThis.localStorage) {
  try {
    const v = JSON.parse(storage.getItem(key));
    return Array.isArray(v) ? v : fallback;
  } catch { return fallback; }
}
export function saveList(key, value, storage = globalThis.localStorage) {
  try { storage.setItem(key, JSON.stringify(value)); } catch { /* stockage indisponible */ }
}
