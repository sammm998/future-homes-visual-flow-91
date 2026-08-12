import { useEffect, useState } from 'react';

/**
 * False during SSR and the first client render, true afterwards.
 * Use it to gate time/locale-dependent output that would otherwise cause a
 * React hydration mismatch (e.g. `toLocaleTimeString()`).
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
