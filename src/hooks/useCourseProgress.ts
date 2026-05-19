import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'fh_course_progress_v1';

export type CountryProgress = {
  completedModules: string[]; // module slugs
  quizScores: Record<string, number>; // moduleSlug -> percent
  finalExamScore?: number; // best score on final exam (percent)
  finalExamPassed?: boolean;
};

type ProgressMap = Record<string, CountryProgress>;

function load(): ProgressMap {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function save(map: ProgressMap) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* noop */
  }
}

export function useCourseProgress(countryCode: string | undefined) {
  const [progress, setProgress] = useState<CountryProgress>({
    completedModules: [],
    quizScores: {},
  });

  useEffect(() => {
    if (!countryCode) return;
    const map = load();
    setProgress(map[countryCode] || { completedModules: [], quizScores: {} });
  }, [countryCode]);

  const completeModule = useCallback(
    (moduleSlug: string, score: number) => {
      if (!countryCode) return;
      const map = load();
      const current = map[countryCode] || { completedModules: [], quizScores: {} };
      const completedModules = current.completedModules.includes(moduleSlug)
        ? current.completedModules
        : [...current.completedModules, moduleSlug];
      const next: CountryProgress = {
        completedModules,
        quizScores: { ...current.quizScores, [moduleSlug]: score },
      };
      map[countryCode] = next;
      save(map);
      setProgress(next);
    },
    [countryCode]
  );

  const recordFinalExam = useCallback(
    (score: number, passed: boolean) => {
      if (!countryCode) return;
      const map = load();
      const current = map[countryCode] || { completedModules: [], quizScores: {} };
      const bestScore = Math.max(current.finalExamScore ?? 0, score);
      const next: CountryProgress = {
        ...current,
        finalExamScore: bestScore,
        finalExamPassed: (current.finalExamPassed ?? false) || passed,
      };
      map[countryCode] = next;
      save(map);
      setProgress(next);
    },
    [countryCode]
  );

  const resetCountry = useCallback(() => {
    if (!countryCode) return;
    const map = load();
    delete map[countryCode];
    save(map);
    setProgress({ completedModules: [], quizScores: {} });
  }, [countryCode]);

  const isModuleUnlocked = useCallback(
    (orderIndex: number, allModuleSlugsInOrder: string[]) => {
      if (orderIndex === 0) return true;
      const previousSlug = allModuleSlugsInOrder[orderIndex - 1];
      return progress.completedModules.includes(previousSlug);
    },
    [progress]
  );

  return { progress, completeModule, recordFinalExam, resetCountry, isModuleUnlocked };
}

export function useAllCourseProgress() {
  const [map, setMap] = useState<ProgressMap>({});
  useEffect(() => {
    setMap(load());
    const onStorage = () => setMap(load());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return map;
}
