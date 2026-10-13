/** Ne jamais assimiler un horaire simplement renseigné à un horaire vérifié. */
export function fixtureVerification(match) {
  const dateConfirmed = match.date_confirmed === true && !match.date_window_start;
  const timeConfirmed = dateConfirmed && match.time_confirmed === true && Boolean(match.time);
  if (dateConfirmed && timeConfirmed) return { kind: 'verified', label: 'Date et heure vérifiées', source: match.verified_source_url };
  if (!dateConfirmed && !timeConfirmed) return { kind: 'unverified', label: 'Date et heure à confirmer', source: null };
  if (!dateConfirmed) return { kind: 'unverified', label: 'Date à confirmer', source: null };
  return { kind: 'unverified', label: 'Heure à confirmer', source: match.verified_source_url || null };
}
