// Tests d'intégration contre une vraie base MariaDB de test.
// TEST_DB_NAME, TEST_DB_USER, TEST_DB_PASSWORD (+ TEST_DB_SOCKET ou TEST_DB_HOST) ; ignorés sinon.
import { after, before, beforeEach, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createApp } from '../src/app.js'
import { createPool, migrate } from '../src/db.js'

const env = {
  DB_NAME: process.env.TEST_DB_NAME,
  DB_USER: process.env.TEST_DB_USER,
  DB_PASSWORD: process.env.TEST_DB_PASSWORD,
  DB_SOCKET: process.env.TEST_DB_SOCKET,
  DB_HOST: process.env.TEST_DB_HOST,
}
const skip = !env.DB_NAME && 'TEST_DB_NAME non défini'

describe('MatchTrip API', { skip }, () => {
  let pool
  let server
  let base

  const call = async (method, path, { token, body } = {}) => {
    const response = await fetch(`${base}${path}`, {
      method,
      headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    const text = await response.text()
    return { status: response.status, headers: response.headers, data: text ? JSON.parse(text) : null }
  }

  const signup = async (email = 'a@example.com') =>
    (await call('POST', '/auth/signup', { body: { email, password: 'motdepasse1' } })).data

  before(async () => {
    pool = createPool(env)
    await pool.query('SET FOREIGN_KEY_CHECKS = 0')
    const [tables] = await pool.query('SHOW TABLES')
    for (const row of tables) await pool.query(`DROP TABLE \`${Object.values(row)[0]}\``)
    await pool.query('SET FOREIGN_KEY_CHECKS = 1')
    await migrate(new URL('../schema.sql', import.meta.url), env)
    await migrate(new URL('../schema.sql', import.meta.url), env) // idempotent
    server = createApp({ pool, env, logger: { error() {} } })
    await new Promise((resolve) => server.listen(0, resolve))
    base = `http://127.0.0.1:${server.address().port}`
  })

  after(async () => {
    await new Promise((resolve) => server.close(resolve))
    await pool.end()
  })

  beforeEach(async () => {
    await pool.query('DELETE FROM users')
    await pool.query('DELETE FROM matchtrip_fixtures')
    await pool.query('DELETE FROM matchtrip_club_media')
    await pool.query('DELETE FROM matchtrip_catalog_config')
  })

  it('sert le catalogue publiquement, sans compte, avec les types attendus', async () => {
    await pool.query(`INSERT INTO matchtrip_fixtures (fixture_key, country, zone, league, home, away, date, time, date_confirmed, time_confirmed, verified_at)
      VALUES ('b', 'France', 'Paris', 'Ligue 1', 'PSG', 'Lyon', '2026-10-18', '17:00:00', 1, 0, '2026-10-13 15:44:22.079'),
             ('a', 'France', 'Paris', 'Ligue 1', 'Lens', 'Nice', '2026-10-17', NULL, 0, 0, NULL)`)
    await pool.query("INSERT INTO matchtrip_club_media (club, stadium, verified_at, ticket_kind, ticket_checked_at) VALUES ('PSG', 'Parc des Princes', '2026-10-13', 'information', '2026-10-13 10:00:00.000')")
    await pool.query('INSERT INTO matchtrip_catalog_config (`key`, value) VALUES (\'catalogue\', \'{"hubs":{"France":{"Paris":"Paris"}}}\')')

    const fixtures = await call('GET', '/fixtures')
    assert.equal(fixtures.status, 200)
    assert.deepEqual(fixtures.data.map((row) => row.fixture_key), ['a', 'b'])
    assert.equal(fixtures.data[0].time, null)
    assert.equal(fixtures.data[1].time, '17:00:00')
    assert.equal(fixtures.data[1].date, '2026-10-18')
    assert.equal(fixtures.data[1].date_confirmed, true)
    assert.equal(fixtures.data[1].time_confirmed, false)
    assert.equal(fixtures.data[1].verified_at, '2026-10-13T15:44:22.079Z')
    assert.equal(fixtures.headers.get('cache-control'), 'public, max-age=300')

    const media = (await call('GET', '/club-media')).data
    assert.equal(media[0].ticket_kind, 'information')
    assert.equal(media[0].ticket_checked_at, '2026-10-13T10:00:00.000Z')
    assert.equal(media[0].verified_at, '2026-10-13')

    assert.deepEqual((await call('GET', '/catalog-config/catalogue')).data, { value: { hubs: { France: { Paris: 'Paris' } } } })
    assert.equal((await call('GET', '/catalog-config/inconnue')).status, 404)
  })

  it('ne permet aucune écriture du catalogue via l’API', async () => {
    const { token } = await signup()
    assert.equal((await call('PUT', '/fixtures', { token, body: [] })).status, 405)
    assert.equal((await call('POST', '/club-media', { token, body: {} })).status, 405)
  })

  it('enregistre et relit les préférences de chaque compte séparément', async () => {
    const alice = await signup('alice@example.com')
    const bob = await signup('bob@example.com')
    assert.equal((await call('GET', '/preferences/matchtrip-theme')).status, 401)
    assert.deepEqual((await call('GET', '/preferences/matchtrip-theme', { token: alice.token })).data, { value: null })

    await call('PUT', '/preferences/matchtrip-theme', { token: alice.token, body: { value: 'light' } })
    await call('PUT', '/preferences/matchtrip-favorites', { token: alice.token, body: { value: ['a', 'b'] } })
    await call('PUT', '/preferences/matchtrip-theme', { token: alice.token, body: { value: 'dark' } })
    await call('PUT', '/preferences/matchtrip-theme', { token: bob.token, body: { value: 'light' } })

    assert.deepEqual((await call('GET', '/preferences/matchtrip-theme', { token: alice.token })).data, { value: 'dark' })
    assert.deepEqual((await call('GET', '/preferences/matchtrip-favorites', { token: alice.token })).data, { value: ['a', 'b'] })
    assert.deepEqual((await call('GET', '/preferences/matchtrip-theme', { token: bob.token })).data, { value: 'light' })
    assert.deepEqual((await call('GET', '/preferences/matchtrip-favorites', { token: bob.token })).data, { value: null })
  })

  it('refuse les clés inconnues et les valeurs trop grandes', async () => {
    const { token } = await signup()
    assert.equal((await call('PUT', '/preferences/autre', { token, body: { value: 1 } })).status, 400)
    assert.equal((await call('GET', '/preferences/autre', { token })).status, 400)
    assert.equal((await call('PUT', '/preferences/matchtrip-theme', { token, body: {} })).status, 400)
    assert.equal((await call('PUT', '/preferences/matchtrip-filters', { token, body: { value: 'x'.repeat(70000) } })).status, 413)
  })

  it('supprime le compte et ses préférences après confirmation', async () => {
    const { token, user } = await signup()
    await call('PUT', '/preferences/matchtrip-theme', { token, body: { value: 'light' } })
    assert.equal((await call('DELETE', '/auth/user', { token })).status, 400)
    assert.equal((await call('DELETE', '/auth/user?confirmation=DELETE', { token })).status, 204)
    assert.equal((await call('GET', '/auth/user', { token })).status, 401)
    const [[{ count }]] = await pool.query('SELECT COUNT(*) AS count FROM matchtrip_preferences WHERE user_id = ?', [user.id])
    assert.equal(count, 0)
  })
})
