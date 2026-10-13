import { useEffect, useState } from 'react';
import { loadFixtures } from '../lib/api.js';

export function useFixtures() {
  const [state, setState] = useState({ fixtures: [], origin: 'chargement', error: '', loading: true });
  useEffect(() => {
    let active = true;
    loadFixtures().then(x => { if (active) setState({ fixtures: x.fixtures, origin: x.origin, error: x.error || '', loading: false }); });
    return () => { active = false; };
  }, []);
  return state;
}
