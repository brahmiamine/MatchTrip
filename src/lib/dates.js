const NOON = 'T12:00:00Z';
const fmtDay = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
const fmtFull = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', timeZone: 'UTC' });

export const toDate = iso => new Date(iso + NOON);
export const toIso = d => d.toISOString().slice(0, 10);
export const timestamp = iso => Date.parse(iso + NOON);
/** 0 = dimanche … 6 = samedi (UTC, donc indépendant du fuseau du navigateur). */
export const weekdayOf = iso => toDate(iso).getUTCDay();

export const addDays = (iso, n) => { const d = toDate(iso); d.setUTCDate(d.getUTCDate() + n); return toIso(d); };
export const nextDate = iso => addDays(iso, 1);

/** Samedi du week-end contenant la date (le dimanche renvoie la veille, les jours de semaine le samedi précédent). */
export function getWeekend(iso) {
  const wd = weekdayOf(iso);
  return addDays(iso, -(wd === 6 ? 0 : (wd + 1) % 7));
}

/** « sam. 18 oct. » → « sam 18 oct » */
export const formatDay = iso => fmtDay.format(toDate(iso)).replace(/\./g, '');
export const formatFull = iso => fmtFull.format(toDate(iso));
export const formatTime = time => (time ? time.slice(0, 5).replace(':', 'h') : 'À confirmer');
export const dayLabel = iso => (weekdayOf(iso) === 6 ? 'SAM' : weekdayOf(iso) === 0 ? 'DIM' : formatDay(iso).slice(0, 3).toUpperCase());

/** Minutes depuis minuit pour « HH:MM » (ou « HH:MM:SS »), null si inconnu. */
export function minutesOf(time) {
  if (!time) return null;
  const [h, m] = time.split(':').map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null;
}

/** Date + heure toujours lisibles : « sam 18 oct · 17h15 » ou « … · Heure à confirmer ». */
export const formatWhen = (date, time) => `${formatDay(date)} · ${time ? formatTime(time) : 'Heure à confirmer'}`;
