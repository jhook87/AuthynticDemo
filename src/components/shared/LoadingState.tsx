import type { ReactNode } from 'react';

interface LoadingStateProps {
  message?: string;
  children?: ReactNode;
}

export const LoadingState = ({ message = 'Preparing operator console…', children }: LoadingStateProps) => (
  <div className="loading-state">
    <div className="spinner" aria-hidden="true" />
    <p>{message}</p>
    {children && <div className="loading-extra">{children}</div>}
  </div>
);
