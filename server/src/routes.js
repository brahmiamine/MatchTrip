import { HttpError, badRequest } from './http.js'
import { toIso } from './db.js'

const PREFERENCE_KEYS = new Set(['matchtrip-favorites', 'matchtrip-blocked', 'matchtrip-theme', 'matchtrip-display', 'matchtrip-filters'])
const MAX_PREFERENCE_CHARS = 65536

const FIXTURE_COLUMNS = `fixture_key, country, zone, cluster, city, league, home, away, date, time, provisional, highlight,
  source_url, date_window_start, date_window_end, created_at, updated_at, date_confirmed, time_confirmed,
  verified_source_url, verified_at, venue_override, venue_source_url, venue_confirmed`
const MEDIA_COLUMNS = `club, logo_url, club_source_url, stadium, stadium_image_url, stadium_source_url, stadium_official_url,
  verified_at, ticket_url, ticket_source_url, ticket_checked_at, stadium_image_page_url, stadium_image_license,
  stadium_image_author, media_checked_at, ticket_kind`

const flags = (row, names) => Object.fromEntries(names.map((name) => [name, Boolean(row[name])]))

const fromFixture = (row) => ({
  ...row,
  ...flags(row, ['provisional', 'highlight', 'date_confirmed', 'time_confirmed', 'venue_confirmed']),
  created_at: toIso(row.created_at),
  updated_at: toIso(row.updated_at),
  verified_at: toIso(row.verified_at),
})

const fromMedia = (row) => ({
  ...row,
  ticket_checked_at: toIso(row.ticket_checked_at),
  media_checked_at: toIso(row.media_checked_at),
})

// Le catalogue est public et change rarement : le navigateur et le CDN peuvent le garder 5 minutes.
const PUBLIC_CACHE = { 'Cache-Control': 'public, max-age=300' }

export function registerRoutes(router, { pool, auth }) {
  router.get('/fixtures', async () => {
    const [rows] = await pool.query(`SELECT ${FIXTURE_COLUMNS} FROM matchtrip_fixtures ORDER BY date, time, fixture_key`)
    return { status: 200, body: rows.map(fromFixture), headers: PUBLIC_CACHE }
  })

  router.get('/club-media', async () => {
    const [rows] = await pool.query(`SELECT ${MEDIA_COLUMNS} FROM matchtrip_club_media ORDER BY club`)
    return { status: 200, body: rows.map(fromMedia), headers: PUBLIC_CACHE }
  })

  router.get('/catalog-config/:key', async ({ params }) => {
    const [rows] = await pool.execute('SELECT value FROM matchtrip_catalog_config WHERE `key` = ?', [params.key])
    if (!rows[0]) throw new HttpError(404, 'Configuration introuvable.', 'not_found')
    return { status: 200, body: { value: JSON.parse(rows[0].value) }, headers: PUBLIC_CACHE }
  })

  const preferenceKey = (key) => {
    if (!PREFERENCE_KEYS.has(key)) throw badRequest('Préférence inconnue.', 'invalid_key')
    return key
  }

  router.get('/preferences/:key', async ({ req, params }) => {
    const user = await auth.requireUser(req)
    const [rows] = await pool.execute(
      'SELECT value FROM matchtrip_preferences WHERE user_id = ? AND `key` = ?',
      [user.id, preferenceKey(params.key)],
    )
    return { value: rows[0] ? JSON.parse(rows[0].value) : null }
  })

  router.put('/preferences/:key', async ({ req, params, body }) => {
    const user = await auth.requireUser(req)
    const key = preferenceKey(params.key)
    if (!body || typeof body !== 'object' || !('value' in body) || body.value === undefined) throw badRequest('Champ value manquant.')
    const value = JSON.stringify(body.value)
    if (value.length > MAX_PREFERENCE_CHARS) throw new HttpError(413, 'Préférence trop volumineuse.', 'payload_too_large')
    await pool.execute(
      `INSERT INTO matchtrip_preferences (user_id, \`key\`, value) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = UTC_TIMESTAMP(3)`,
      [user.id, key, value],
    )
    return null
  })

  /** Suppression du compte : sessions et préférences suivent en cascade. */
  router.delete('/auth/user', async ({ req, query }) => {
    const user = await auth.requireUser(req)
    if (query.get('confirmation') !== 'DELETE') throw badRequest('Confirmation requise.', 'confirmation_required')
    await pool.execute('DELETE FROM users WHERE id = ?', [user.id])
    return null
  })
}
