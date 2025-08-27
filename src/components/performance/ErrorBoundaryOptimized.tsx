import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
  retryCount: number;
}

export class ErrorBoundaryOptimized extends Component<Props, State> {
  private retryTimeout?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: Math.random().toString(36).substr(2, 9)
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Auto-retry for network errors
    if (this.isNetworkError(error) && this.state.retryCount < 3) {
      this.scheduleRetry();
    }
  }

  private isNetworkError(error: Error): boolean {
    return error.message.includes('fetch') || 
           error.message.includes('network') ||
           error.message.includes('connection');
  }

  private scheduleRetry = () => {
    this.retryTimeout = setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        retryCount: prevState.retryCount + 1
      }));
    }, 2000 * Math.pow(2, this.state.retryCount)); // Exponential backoff
  };

  private handleManualRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      retryCount: 0
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-6">
              <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Something went wrong
              </h2>
              <p className="text-muted-foreground mb-4">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              {this.state.retryCount > 0 && (
                <p className="text-sm text-muted-foreground mb-4">
                  Retry attempt {this.state.retryCount}/3
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Button 
                onClick={this.handleManualRetry}
                className="w-full"
                disabled={this.state.retryCount >= 3}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              {this.state.retryCount >= 3 && (
                <Button 
                  onClick={this.handleReload}
                  variant="outline"
                  className="w-full"
                >
                  Reload Page
                </Button>
              )}
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}