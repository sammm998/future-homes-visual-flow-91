import { useCallback, type SetStateAction } from 'react';
import { useSearchParams } from '@/lib/router-compat';
import { parseSearchPage } from '@/lib/searchPage';

/** Pagination lives with the filters in history, so back restores the same rows. */
export function useSearchPage() {
  const [params, setParams] = useSearchParams();
  const page = parseSearchPage(params.get('page'));
  const setPage = useCallback((update: SetStateAction<number>) => {
    setParams(current => {
      const next = typeof update === 'function' ? update(parseSearchPage(current.get('page'))) : update;
      if (next > 1) current.set('page', String(next));
      else current.delete('page');
      return current;
    }, { replace: true });
  }, [setParams]);
  return [page, setPage] as const;
}