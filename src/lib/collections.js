const COLLATOR = new Intl.Collator('fr', { sensitivity: 'base' });
export const toggleItem = (arr, val) => (arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
export const uniqueSorted = list => [...new Set(list)].sort(COLLATOR.compare);
/** Minuscules sans accents, pour la recherche libre. */
export const normalize = s => String(s ?? '').toLocaleLowerCase('fr').normalize('NFD').replace(/[̀-ͯ]/g, '');
