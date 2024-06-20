import React, { Component, ReactNode } from 'react';
import ErrorPage from './ErrorPage';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update the state with the caught error
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log the error or send it to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  resetErrorBoundary = () => {
    // Reset the state to try rendering the app again
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Render the ErrorPage component with the caught error
      return (
        <ErrorPage
        />
      );
    }

    // Render the children components if there's no error
    return this.props.children;
  }
}

export default ErrorBoundary;