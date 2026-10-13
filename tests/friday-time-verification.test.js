import { describe, expect, it } from 'vitest';
import { getWeekend, formatWeekendRange, weekendFriday, weekendSunday, isWeekendDay } from '../src/lib/dates.js';
import { applyFilters, buildOptions, defaultFilters, addExcludedWeekend } from '../src/lib/filters.js';
import { groupMatches } from '../src/lib/sorting.js';
import { buildWeekends, compatible } from '../src/lib/weekends.js';
import { fixtureVerification } from '../src/lib/fixtureVerification.js';
import { VERIFIED_FRIDAY_FIXTURES, VERIFIED_SCHEDULE, markFixtureVerification } from '../src/data/verifiedSchedule.js';
import { seedFixtures } from '../src/data/fixtures.js';
import { newFixtures } from '../src/data/newFixtures.js';
import { encodeState, decodeState, defaultView } from '../src/lib/urlState.js';
import { mk } from './helpers.js';

const friday = mk({ home: 'Le Mans', away: 'Toulouse', date: '2026-10-16', time: '20:45', zone: 'Autour de Paris' });
const saturday = mk({ home: 'Troyes', away: 'Lens', date: '2026-10-17', time: '20:45', zone: 'Autour de Paris' });
const sunday = mk({ home: 'Paris FC', away: 'Rennes', date: '2026-10-18', time: '17:15' });

describe('week-end de trois jours', () => {
  it('vendredi, samedi et dimanche partagent la même clé de samedi', () => {
    expect(getWeekend('2026-10-16')).toBe('2026-10-17');
    expect(getWeekend('2026-10-17')).toBe('2026-10-17');
    expect(getWeekend('2026-10-18')).toBe('2026-10-17');
    expect(weekendFriday('2026-10-17')).toBe('2026-10-16');
    expect(weekendSunday('2026-10-17')).toBe('2026-10-18');
    expect(formatWeekendRange('2026-10-17')).toBe('ven 16 oct – dim 18 oct');
  });
  it('ne groupe pas le jeudi ou lundi', () => {
    expect(isWeekendDay('2026-10-15')).toBe(false);
    expect(isWeekendDay('2026-10-16')).toBe(true);
    expect(isWeekendDay('2026-10-19')).toBe(false);
    expect(buildWeekends([mk({ home: 'JEU',date:'2026-10-15' }), saturday])).toEqual([]);
  });
  it('zones Paris et alentours, vendredi + samedi + dimanche regroupés ensemble', () => {
    const w = buildWeekends([friday, saturday, sunday]);
    expect(w).toHaveLength(1);
    expect(w[0].items.map(x => x.home)).toEqual(['Le Mans','Troyes','Paris FC']);
    expect(w[0].pairs).toHaveLength(3);
    const groups = groupMatches([friday,saturday,sunday], 'zone-weekend');
    expect(groups).toHaveLength(1);
    expect(groups[0][1]).toHaveLength(3);
  });
  it('vendredi présent dans la sélection, l’exclusion et les filtres de jour', () => {
    const matches = [friday,saturday,sunday];
    expect(buildOptions(matches,defaultFilters()).weekends).toEqual(['2026-10-17']);
    expect(applyFilters(matches,{...defaultFilters(),weekends:['2026-10-17']},[])).toHaveLength(3);
    expect(applyFilters(matches,{...defaultFilters(),day:'vendredi'},[]).map(m=>m.home)).toEqual(['Le Mans']);
    expect(addExcludedWeekend([], '2026-10-16')).toEqual(['2026-10-17']);
    expect(applyFilters(matches,{...defaultFilters(),excluded:['2026-10-17']},[])).toHaveLength(0);
  });
});

describe('filtre horaire exclusif', () => {
  const ms = ['09:59','10:00','18:59','19:00','20:00',null].map((time, i) =>
    mk({ fixture_key:String(i),home:String(i),time,date:'2026-10-16' }));
  it('10:00 inclus, 19:00 exclu, 19:00:00 exclu, heure inconnue exclue', () => {
    expect(applyFilters(ms,{...defaultFilters(),timeFrom:'10:00',timeTo:'19:00'},[]).map(m=>m.time)).toEqual(['10:00','18:59']);
    expect(applyFilters([mk({time:'19:00:00'})],{...defaultFilters(),timeTo:'19:00'},[])).toHaveLength(0);
  });
  it('intervalle inversé ou vide donne aucun match, un seul côté reste possible', () => {
    expect(applyFilters(ms,{...defaultFilters(),timeFrom:'19:00',timeTo:'10:00'},[])).toHaveLength(0);
    expect(applyFilters(ms,{...defaultFilters(),timeFrom:'10:00',timeTo:'10:00'},[])).toHaveLength(0);
    expect(applyFilters(ms,{...defaultFilters(),timeTo:'10:00'},[]).map(m=>m.time)).toEqual(['09:59']);
  });
  it('les filtres pays + zone + club + jour + week-end + heure fonctionnent ensemble', () => {
    const f={...defaultFilters(),countries:['France'],zones:['Autour de Paris'],clubs:['Le Mans'],
      day:'vendredi',weekends:['2026-10-17'],timeFrom:'20:00',timeTo:'21:00'};
    expect(applyFilters([friday,saturday,sunday],f,[]).map(m=>m.home)).toEqual(['Le Mans']);
    const q=encodeState(f,defaultView());
    const restored=decodeState('?'+q).filters;
    expect(restored.timeFrom).toBe('20:00');
    expect(restored.timeTo).toBe('21:00');
    expect(restored.day).toBe('vendredi');
    expect(decodeState('?tf=25:99&tt=abc').filters.timeFrom).toBe('');
  });
});

describe('audit de fiabilité des matchs', () => {
  it('ne marque jamais comme confirmé un horaire simplement renseigné', () => {
    const m=markFixtureVerification(mk({fixture_key:'introuvable',date_confirmed:false,time_confirmed:false}));
    expect(fixtureVerification(m).label).toBe('Date et heure à confirmer');
  });
  it('sépare date confirmée et heure inconnue', () => {
    expect(fixtureVerification({ date_confirmed:true,time_confirmed:false,time:'20:45' }).label).toBe('Heure à confirmer');
    expect(fixtureVerification({date_confirmed:true,time_confirmed:true,time:'20:45'}).kind).toBe('verified');
  });
  it('55 anciennes rencontres auditables et 8 nouveaux vendredis sourcés', () => {
    expect(Object.keys(VERIFIED_SCHEDULE)).toHaveLength(55);
    expect(VERIFIED_FRIDAY_FIXTURES).toHaveLength(8);
    expect(VERIFIED_FRIDAY_FIXTURES.every(m => getWeekend(m.date) && isWeekendDay(m.date) && m.date_confirmed && m.verified_source_url.startsWith('https://'))).toBe(true);
    const keys = new Set([...seedFixtures,...newFixtures,...VERIFIED_FRIDAY_FIXTURES].map(m=>m.fixture_key));
    expect(keys.size).toBe(222);
    expect([...seedFixtures,...newFixtures].filter(m=>VERIFIED_SCHEDULE[m.fixture_key]).length).toBe(55);
  });
  it('un horaire non vérifié ne rend pas combinables 2 matchs du même jour', () => {
    expect(compatible(mk({time_confirmed:false,time:'13:00'}), mk({time_confirmed:true,time:'19:00'}))).toBe(false);
  });
});
