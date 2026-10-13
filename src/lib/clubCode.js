import { normalize } from './collections.js';

/** Sigle de repli pour un écusson sans logo : « Real Madrid » → « RM », « Lyon » → « LYO ». */
export function clubCode(name) {
  let words = String(name).split(/[\s-]+/).filter(Boolean);
  if (words.length > 1) {
    const long = words.filter(w => w.length > 2);
    if (long.length) words = words.filter(w => w.length > 2 || words.length > 2);
  }
  const code = words.length === 1 ? normalize(words[0]).slice(0, 3) : words.map(w => normalize(w)[0]).join('').slice(0, 3);
  return code.toUpperCase();
}

/** Teinte stable dérivée du nom, pour colorer l'écusson de repli. */
export function clubHue(name) {
  let h = 0;
  for (const c of String(name)) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}
