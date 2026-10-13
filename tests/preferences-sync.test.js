import { act, create } from 'react-test-renderer';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
const { auth, records, writes, from, listeners } = vi.hoisted(() => ({ auth: { session: null }, records: new Map(), writes: [], from: vi.fn(), listeners: new Set() }));
vi.mock('../src/lib/supabase.js', () => ({ supabase: {
  auth: {
    getSession: async () => ({ data: { session: auth.session } }),
    onAuthStateChange: callback => { listeners.add(callback); return { data: { subscription: { unsubscribe: () => listeners.delete(callback) } } }; }
  }, from
} }));
import { useStoredPreference } from '../src/hooks/useStoredPreference.js';

let renderer, state, deferred;
const session = id => id ? { user: { id } } : null;
async function switchUser(id) {
  await act(async () => {
    auth.session = session(id);
    for (const callback of listeners) callback('SIGNED_IN', auth.session);
    await vi.advanceTimersByTimeAsync(1);
  });
}
function Harness({ override = null }) {
  state = useStoredPreference('matchtrip-theme', 'dark', { valid: v => ['dark','light'].includes(v), override });
  return React.createElement('span', null, state[0]);
}
beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  vi.useFakeTimers();
  const cache = new Map();
  vi.stubGlobal('localStorage', { getItem: k => cache.has(k) ? cache.get(k) : null, setItem: (k, v) => cache.set(k, v) });
  vi.stubGlobal('window', new EventTarget());
  records.clear(); writes.length = 0; listeners.clear(); auth.session = null; deferred = null;
  from.mockImplementation(() => {
    const filters = {};
    const query = {
      select: () => query,
      eq: (key, value) => { filters[key] = value; return query; },
      maybeSingle: () => deferred ?? Promise.resolve({ data: records.get(filters.user_id + ':' + filters.key) ? { value: records.get(filters.user_id + ':' + filters.key) } : null, error: null }),
      upsert: async row => { writes.push(row); records.set(row.user_id + ':' + row.key, row.value); return { error: null }; }
    };
    return query;
  });
});
afterEach(async () => {
  if (renderer) await act(async () => renderer.unmount());
  renderer = null; vi.useRealTimers(); vi.unstubAllGlobals();
});
describe('private cloud preference synchronization', () => {
  it('loads the account value before writing and never overwrites it with guest defaults', async () => {
    auth.session = session('a'); records.set('a:matchtrip-theme', 'light');
    await act(async () => { renderer = create(React.createElement(Harness)); });
    expect(state[0]).toBe('light');
    await act(async () => vi.advanceTimersByTimeAsync(500));
    expect(writes).toHaveLength(1);
    expect(writes[0]).toMatchObject({ user_id: 'a', value: 'light' });
  });
  it('imports guest choices into a new account and persists subsequent edits', async () => {
    localStorage.setItem('matchtrip-theme', 'light');
    await act(async () => { renderer = create(React.createElement(Harness)); });
    await act(async () => vi.advanceTimersByTimeAsync(500));
    expect(writes).toHaveLength(0);
    await switchUser('a');
    await act(async () => vi.advanceTimersByTimeAsync(500));
    expect(records.get('a:matchtrip-theme')).toBe('light');
    await act(async () => state[1]('dark'));
    await act(async () => vi.advanceTimersByTimeAsync(500));
    expect(records.get('a:matchtrip-theme')).toBe('dark');
  });
  it('isolates caches and writes when switching accounts', async () => {
    auth.session = session('a'); records.set('a:matchtrip-theme', 'light'); records.set('b:matchtrip-theme', 'dark');
    await act(async () => { renderer = create(React.createElement(Harness)); });
    await switchUser('b');
    await act(async () => vi.advanceTimersByTimeAsync(500));
    expect(state[0]).toBe('dark');
    expect(records.get('a:matchtrip-theme')).toBe('light');
    expect(writes.every(x => x.user_id === 'b')).toBe(true);
    expect(JSON.parse(localStorage.getItem('matchtrip-theme:b'))).toBe('dark');
  });
  it('keeps edits made during a slow account read', async () => {
    let resolve; deferred = new Promise(r => { resolve = r; }); auth.session = session('a');
    await act(async () => { renderer = create(React.createElement(Harness)); });
    await act(async () => state[1]('light'));
    await act(async () => resolve({ data: { value: 'dark' }, error: null }));
    await act(async () => vi.advanceTimersByTimeAsync(500));
    expect(state[0]).toBe('light');
    expect(records.get('a:matchtrip-theme')).toBe('light');
  });
  it('does not write when cloud hydration fails', async () => {
    auth.session = session('a'); deferred = Promise.resolve({ data: null, error: { message: 'offline' } });
    const errors = []; window.addEventListener('matchtrip-sync-error', event => errors.push(event.detail));
    await act(async () => { renderer = create(React.createElement(Harness)); });
    await act(async () => state[1]('light'));
    await act(async () => vi.advanceTimersByTimeAsync(500));
    expect(writes).toHaveLength(0);
    expect(errors[0]).toContain('offline');
  });
  it('respects an explicit shared URL override', async () => {
    auth.session = session('a'); records.set('a:matchtrip-theme', 'dark');
    await act(async () => { renderer = create(React.createElement(Harness, { override: 'light' })); });
    await act(async () => vi.advanceTimersByTimeAsync(500));
    expect(records.get('a:matchtrip-theme')).toBe('light');
  });
});
