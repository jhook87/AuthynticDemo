import { completeTutorialStep, useOperatorStore } from '../../store';

export const TutorialOverlay = () => {
  const tutorial = useOperatorStore((state) => state.tutorial);
  if (!tutorial.visible) return null;
  const step = tutorial.steps[tutorial.activeStep];
  return (
    <div className="tutorial-overlay" role="dialog" aria-live="polite">
      <h3>{step.title}</h3>
      <p>{step.description}</p>
      <button type="button" onClick={completeTutorialStep}>
        Continue
      </button>
    </div>
  );
};
