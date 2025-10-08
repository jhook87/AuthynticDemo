import type { DemoStateSnapshot, TutorialProgressState } from '../../types';

const STORAGE_KEY = 'authyntic-demo-state';

const isBrowser = typeof window !== 'undefined';

const serialize = (state: DemoStateSnapshot) => JSON.stringify(state);

const parseState = (value: string | null): DemoStateSnapshot | null => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as DemoStateSnapshot;
    if (!parsed || typeof parsed !== 'object' || !parsed.tutorial) {
      return null;
    }
    return parsed;
  } catch (error) {
    console.warn('Unable to parse stored demo progress', error);
    return null;
  }
};

const sanitizeTutorialProgress = (progress: TutorialProgressState): TutorialProgressState => ({
  activeStep: typeof progress.activeStep === 'number' ? progress.activeStep : 0,
  completedStepIds: Array.isArray(progress.completedStepIds) ? progress.completedStepIds : [],
  visible: typeof progress.visible === 'boolean' ? progress.visible : true,
  wasDismissed: typeof progress.wasDismissed === 'boolean' ? progress.wasDismissed : false,
});

export const demoStateService = {
  saveDemoProgress: (progress: TutorialProgressState) => {
    if (!isBrowser) return;
    const payload: DemoStateSnapshot = {
      tutorial: sanitizeTutorialProgress(progress),
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, serialize(payload));
    } catch (error) {
      console.warn('Unable to persist demo progress', error);
    }
  },

  loadDemoProgress: (): TutorialProgressState | null => {
    if (!isBrowser) return null;
    const stored = parseState(window.localStorage.getItem(STORAGE_KEY));
    return stored ? sanitizeTutorialProgress(stored.tutorial) : null;
  },

  resetDemo: () => {
    if (!isBrowser) return;
    window.localStorage.removeItem(STORAGE_KEY);
  },
};
