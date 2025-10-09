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
  const isFirstRunPopover =
    isVisible && progress.activeStep === 0 && progress.completedStepIds.length === 0 && !progress.wasDismissed;

  const containerClassName = [
    'tutorial-overlay-container',
    position ? 'tutorial-overlay-container--anchored' : 'tutorial-overlay-container--floating',
    isFirstRunPopover ? 'tutorial-overlay-container--intro' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const cardClassName = ['tutorial-overlay-card', 'demo-transition', isFirstRunPopover ? 'tutorial-overlay-card--intro' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {isVisible && step && (
        <div
          className={containerClassName}
          style={overlayStyle}
          role="dialog"
          aria-live="polite"
          aria-label={`Tutorial step ${currentStepNumber} of ${totalSteps}`}
        >
          <div className={cardClassName} data-intro={isFirstRunPopover || undefined}>
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
