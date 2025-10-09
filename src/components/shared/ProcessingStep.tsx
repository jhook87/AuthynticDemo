import React from 'react';

type ProcessingStatus = 'pending' | 'active' | 'complete';

interface ProcessingStepProps {
  title: string;
  description?: string;
  status: ProcessingStatus;
  progress: number;
}

const statusLabel: Record<ProcessingStatus, string> = {
  pending: 'Queued',
  active: 'In Progress',
  complete: 'Complete',
};

export const ProcessingStep: React.FC<ProcessingStepProps> = ({ title, description, status, progress }) => (
  <div className={`processing-step processing-step--${status}`}>
    <div className="processing-step-title">{title}</div>
    {description ? <p className="processing-step-status">{description}</p> : null}
    <div className="processing-step-status">
      {statusLabel[status]} · {Math.round(progress)}%
    </div>
    <div className="progress-bar" aria-hidden="true">
      <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
    </div>
  </div>
);
