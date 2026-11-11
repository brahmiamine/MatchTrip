/** Les confirmations du snapshot doivent avoir une source datée, sans fenêtre provisoire. */
export function markFixtureVerification(row) {
  const dateConfirmed = row.date_confirmed === true && !row.date_window_start && Boolean(row.verified_source_url && row.verified_at);
  return {
    ...row,
    date_confirmed: dateConfirmed,
    time_confirmed: dateConfirmed && row.time_confirmed === true && Boolean(row.time),
  };
}
