import { describe, expect, it } from 'vitest';
import { addDays, dayLabel, formatDay, formatFull, formatMonth, formatTime, formatWeekendRange, formatWhen, getWeekend, minutesOf, monthRange, nextDate, weekdayOf } from '../src/lib/dates.js';

describe('dates', () => {
  it('weekdayOf est indépendant du fuseau', () => {
    expect(weekdayOf('2026-10-17')).toBe(6);
    expect(weekdayOf('2026-10-18')).toBe(0);
    expect(weekdayOf('2026-10-19')).toBe(1);
  });
  it('addDays / nextDate traversent les mois et années', () => {
    expect(nextDate('2026-10-31')).toBe('2026-11-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-11-01', -1)).toBe('2026-10-31');
  });
  it.each([
    ['2026-10-17', '2026-10-17'], ['2026-10-18', '2026-10-17'], ['2026-10-19', '2026-10-17'],
    ['2026-10-23', '2026-10-24'], ['2026-10-24', '2026-10-24'], ['2026-11-01', '2026-10-31'],
  ])('getWeekend(%s) = %s', (d, w) => expect(getWeekend(d)).toBe(w));
  it('formatTime', () => {
    expect(formatTime('17:15')).toBe('17h15');
    expect(formatTime('17:15:00')).toBe('17h15');
    expect(formatTime(null)).toBe('À confirmer');
  });
  it('formatDay et formatFull', () => {
    expect(formatDay('2026-10-18')).toBe('dim 18 oct');
    expect(formatFull('2026-10-18')).toBe('18 octobre');
  });
  it('formatWhen affiche toujours date + heure', () => {
    expect(formatWhen('2026-10-18', '17:15')).toBe('dim 18 oct · 17h15');
    expect(formatWhen('2026-10-18', null)).toBe('dim 18 oct · Heure à confirmer');
  });
  it('dayLabel', () => {
    expect(dayLabel('2026-10-17')).toBe('SAM');
    expect(dayLabel('2026-10-18')).toBe('DIM');
    expect(dayLabel('2026-10-19')).toBe('LUN');
  });
  it('minutesOf', () => {
    expect(minutesOf('00:00')).toBe(0);
    expect(minutesOf('20:45')).toBe(1245);
    expect(minutesOf('20:45:00')).toBe(1245);
    expect(minutesOf(null)).toBeNull();
    expect(minutesOf('abc')).toBeNull();
  });
  it('monthRange gère fin d’année et février', () => {
    expect(monthRange('2026-10')).toEqual(['2026-10-01', '2026-10-31']);
    expect(monthRange('2026-12')).toEqual(['2026-12-01', '2026-12-31']);
    expect(monthRange('2028-02')).toEqual(['2028-02-01', '2028-02-29']);
  });
  it('formatMonth / formatWeekendRange', () => {
    expect(formatMonth('2026-10')).toBe('oct. 2026');
    expect(formatWeekendRange('2026-10-31')).toBe('ven 30 oct – dim 1 nov');
  });
});
