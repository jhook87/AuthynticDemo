import type { CSSProperties } from 'react';
import { useTutorial } from '../../hooks/useTutorial';

export const TutorialOverlay = () => {
  const { step, steps, progress, position, completion, isVisible, showLauncher, next, skip, restart } = useTutorial();

  const overlayStyle: CSSProperties = position
    ? { top: `${position.top}px`, left: `${position.left}px` }
    : { bottom: '2rem', right: '2rem' };

  const totalSteps = steps.length;
  const currentStepNumber = progress.activeStep + 1;
  const ctaLabel = step?.ctaLabel ?? (currentStepNumber >= totalSteps ? 'Finish tour' : 'Next step');

  return (
    <>
      {isVisible && step && (
        <div
          className="tutorial-overlay-container"
          style={overlayStyle}
          role="dialog"
          aria-live="polite"
          aria-label={`Tutorial step ${currentStepNumber} of ${totalSteps}`}
        >
          <div className="tutorial-overlay-card demo-transition">
            <header>
              <span className="tutorial-step-count">
                Step {currentStepNumber} / {totalSteps}
              </span>
              <h3>{step.title}</h3>
            </header>
            <p>{step.description}</p>
            {step.helperText && <p className="tutorial-helper">{step.helperText}</p>}
            <div className="tutorial-progress" aria-hidden="true">
              <div className="tutorial-progress-bar" style={{ width: `${completion}%` }} />
            </div>
            <footer>
              <button type="button" className="tutorial-secondary" onClick={skip}>
                Skip tour
              </button>
              <div className="tutorial-actions">
                <button type="button" className="tutorial-tertiary" onClick={restart}>
                  Restart
                </button>
                <button type="button" className="tutorial-primary" onClick={next}>
                  {ctaLabel}
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
      {showLauncher && (
        <button type="button" className="tutorial-launcher tutorial-restart demo-transition" onClick={restart}>
          Restart guided tour
        </button>
      )}
    </>
  );
};
