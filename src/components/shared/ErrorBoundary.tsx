import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error captured by boundary', error, info);
  }

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;
    if (hasError) {
      return (
        fallback ?? (
          <div className="error-boundary">
            <h2>Something went wrong.</h2>
            <pre>{error?.message}</pre>
          </div>
        )
      );
    }
    return children;
  }
}
