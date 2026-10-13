import { useEffect, useState } from 'react';
import { restoreList, saveList } from '../lib/storage.js';

export function usePersistentList(key, fallback, override = null) {
  const [value, setValue] = useState(() => override ?? restoreList(key, fallback));
  useEffect(() => { saveList(key, value); }, [key, value]);
  return [value, setValue];
}
