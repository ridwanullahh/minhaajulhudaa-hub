import React, { Component, ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global error boundary.
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Catches uncaught render errors anywhere in the tree and shows a
 * recoverable fallback UI instead of a white screen. In development the
 * full error message + stack is shown; in production only a generic
 * message with a retry button.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    const isDev = import.meta.env.DEV;
    const error = this.state.error;

    return (
      <div
        role="alert"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: '#fafafa',
          color: '#1a1a1a',
        }}
      >
        <div
          style={{
            maxWidth: '640px',
            width: '100%',
            padding: '2.5rem',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e5e5',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              margin: '0 0 0.75rem 0',
              color: '#b91c1c',
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              margin: '0 0 1.5rem 0',
              color: '#525252',
              lineHeight: 1.6,
            }}
          >
            An unexpected error occurred while rendering this page. You can
            try again - if the problem persists, please contact support.
          </p>

          {isDev && error && (
            <details
              style={{
                margin: '0 0 1.5rem 0',
                padding: '1rem',
                backgroundColor: '#fafafa',
                borderRadius: '8px',
                border: '1px solid #e5e5e5',
              }}
            >
              <summary
                style={{ cursor: 'pointer', fontWeight: 500, color: '#525252' }}
              >
                Error details (development only)
              </summary>
              <pre
                style={{
                  margin: '0.75rem 0 0 0',
                  fontSize: '0.8125rem',
                  lineHeight: 1.5,
                  overflow: 'auto',
                  color: '#7f1d1d',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {error.name}: {error.message}
                {error.stack ? `\n\n${error.stack}` : ''}
              </pre>
            </details>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={this.handleReset}
              style={{
                padding: '0.625rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#ffffff',
                backgroundColor: '#0f766e',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => (window.location.href = '/')}
              style={{
                padding: '0.625rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#525252',
                backgroundColor: '#ffffff',
                border: '1px solid #d4d4d4',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Go home
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
