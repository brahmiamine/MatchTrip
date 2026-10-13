import { describe, expect, it } from 'vitest';
import { restoreList, saveList } from '../src/lib/storage.js';
import { toggleItem, uniqueSorted, normalize } from '../src/lib/collections.js';

const fake = (init = {}) => ({ data: { ...init }, getItem(k) { return this.data[k] ?? null; }, setItem(k, v) { this.data[k] = v; } });

describe('storage', () => {
  it('restaure une liste valide', () => expect(restoreList('k', [], fake({ k: '["a"]' }))).toEqual(['a']));
  it('valeur absente → défaut', () => expect(restoreList('k', ['d'], fake())).toEqual(['d']));
  it('JSON invalide → défaut', () => expect(restoreList('k', ['d'], fake({ k: '{' }))).toEqual(['d']));
  it('non-tableau → défaut', () => expect(restoreList('k', ['d'], fake({ k: '"x"' }))).toEqual(['d']));
  it('stockage indisponible → défaut, sans exception', () => expect(restoreList('k', ['d'], undefined)).toEqual(['d']));
  it('saveList écrit en JSON', () => { const s = fake(); saveList('k', ['a'], s); expect(s.data.k).toBe('["a"]'); });
  it('saveList ne lève pas si le stockage échoue', () => expect(() => saveList('k', [], { setItem() { throw new Error('quota'); } })).not.toThrow());
});

describe('collections', () => {
  it('toggleItem', () => { expect(toggleItem(['a'], 'b')).toEqual(['a', 'b']); expect(toggleItem(['a', 'b'], 'a')).toEqual(['b']); });
  it('uniqueSorted dédoublonne et trie à la française', () => expect(uniqueSorted(['é', 'b', 'a', 'b'])).toEqual(['a', 'b', 'é']));
  it('normalize', () => expect(normalize('Évian-Thonon')).toBe('evian-thonon'));
});
