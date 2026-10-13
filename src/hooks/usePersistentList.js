import { useEffect, useState } from 'react';
import { restoreList, saveList } from '../lib/storage.js';

export function usePersistentList(key, fallback) {
  const [value, setValue] = useState(() => restoreList(key, fallback));
  useEffect(() => { saveList(key, value); }, [key, value]);
  return [value, setValue];
}
