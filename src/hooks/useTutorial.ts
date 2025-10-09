import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  completeTutorialStep,
  dismissTutorial,
  goToTutorialStep,
  openTutorial,
  resetTutorial,
  useOperatorStore,
} from '../store';
import type { TutorialStep } from '../types';
import { demoStateService } from '../services/storage/demoStateService';

interface TutorialOverlayPosition {
  top: number;
  left: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const calculateOverlayPosition = (element: HTMLElement): TutorialOverlayPosition => {
  const rect = element.getBoundingClientRect();
  const width = 360;
  const top = clamp(rect.bottom + 16, 16, Math.max(16, window.innerHeight - 220));
  const left = clamp(rect.left, 16, Math.max(16, window.innerWidth - width - 16));
  return { top, left };
};

export const useTutorial = () => {
  const tutorial = useOperatorStore((state) => state.tutorial);
  const { steps, progress } = tutorial;
  const [position, setPosition] = useState<TutorialOverlayPosition | null>(null);
  const highlightedElementRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!progress.visible) {
      if (highlightedElementRef.current) {
        highlightedElementRef.current.classList.remove('tutorial-highlight');
        highlightedElementRef.current = null;
      }
      setPosition(null);
      return;
    }

    const step = steps[progress.activeStep];
    if (!step?.target) {
      if (highlightedElementRef.current) {
        highlightedElementRef.current.classList.remove('tutorial-highlight');
        highlightedElementRef.current = null;
      }
      setPosition(null);
      return;
    }

    const element = document.querySelector(step.target) as HTMLElement | null;
    if (highlightedElementRef.current && highlightedElementRef.current !== element) {
      highlightedElementRef.current.classList.remove('tutorial-highlight');
    }

    if (element) {
      highlightedElementRef.current = element;
      element.classList.add('tutorial-highlight');
      setPosition(calculateOverlayPosition(element));
    } else {
      highlightedElementRef.current = null;
      setPosition(null);
    }
  }, [progress.activeStep, progress.visible, steps]);

  useEffect(() => {
    const handleRealign = () => {
      if (!progress.visible) return;
      const element = highlightedElementRef.current;
      if (!element) return;
      setPosition(calculateOverlayPosition(element));
    };

    window.addEventListener('resize', handleRealign);
    window.addEventListener('scroll', handleRealign, true);
    return () => {
      window.removeEventListener('resize', handleRealign);
      window.removeEventListener('scroll', handleRealign, true);
    };
  }, [progress.visible, progress.activeStep]);

  useEffect(() => () => {
    if (highlightedElementRef.current) {
      highlightedElementRef.current.classList.remove('tutorial-highlight');
      highlightedElementRef.current = null;
    }
  }, []);

  useEffect(() => {
    demoStateService.saveDemoProgress(progress);
  }, [progress.activeStep, progress.completedStepIds, progress.visible, progress.wasDismissed]);

  const step = steps[progress.activeStep] as TutorialStep | undefined;
  const completion = useMemo(() => {
    if (!steps.length) return 0;
    const completedUnique = new Set(progress.completedStepIds);
    if (progress.visible && step) {
      completedUnique.add(step.id);
    }
    return Math.min(100, Math.round((completedUnique.size / steps.length) * 100));
  }, [progress.completedStepIds, progress.visible, step, steps.length]);

  const activeStepId = step?.id;
  const stepDemoAction = step?.demoAction;

  useEffect(() => {
    if (!progress.visible || !stepDemoAction) {
      return undefined;
    }
    const timer = window.setTimeout(() => {
      stepDemoAction();
    }, 600);
    return () => window.clearTimeout(timer);
  }, [progress.visible, activeStepId, stepDemoAction]);

  return {
    step,
    steps,
    progress,
    position,
    completion,
    isVisible: progress.visible,
    showLauncher: !progress.visible && progress.wasDismissed,
    next: completeTutorialStep,
    skip: dismissTutorial,
    restart: resetTutorial,
    open: openTutorial,
    goTo: goToTutorialStep,
  } as const;
};
