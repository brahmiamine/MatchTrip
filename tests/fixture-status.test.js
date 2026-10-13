import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import FixtureStatus from '../src/components/FixtureStatus.jsx';

const match = {
  date: '2026-10-17',
  time: '17:00',
  date_confirmed: true,
  time_confirmed: true,
  verified_source_url: 'https://example.com/official-calendar'
};
const render = (overrides = {}, compact = false) =>
  renderToStaticMarkup(React.createElement(FixtureStatus, { match: { ...match, ...overrides }, compact }));

describe('étiquette de fiabilité sur les cartes de matchs', () => {
  it('ne rend aucun badge ni emplacement quand date ET heure sont confirmées', () => {
    expect(render()).toBe('');
    expect(render({}, true)).toBe('');
  });

  it('montre le badge si seule la date est confirmée', () => {
    const html = render({ time_confirmed: false });
    expect(html).toContain('Heure à confirmer');
    expect(html).toContain('fixture-status unverified');
    expect(html).not.toContain('Date et heure vérifiées');
  });

  it('montre le badge si date ET heure sont non confirmées', () => {
    const html = render({ date_confirmed: false, time_confirmed: false });
    expect(html).toContain('Date et heure à confirmer');
  });

  it('montre un badge si l’heure est inconnue malgré un ancien drapeau', () => {
    expect(render({ time: null })).toContain('Heure à confirmer');
  });

  it('montre un badge si le jour est encore provisoire', () => {
    expect(render({ date_window_start: '2026-10-16' }, true)).toContain('Date et heure à confirmer');
  });
});
