import { Component, type ErrorInfo, type ReactNode } from 'react';
import { appBackground, colors } from '../theme';

interface ErrorBoundaryProps {
  readonly children: ReactNode;
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Unhandled error in component tree:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ ...appBackground, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: colors.cream, marginBottom: 12 }}>
              Something went wrong
            </h1>
            <p style={{ color: colors.muted, fontSize: 14 }}>Please refresh the page and try again.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
