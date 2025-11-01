"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-slate-800 border-2 border-red-500/50 rounded-lg shadow-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Oops! Something went wrong
                </h1>
                <p className="text-gray-400 text-sm">
                  An unexpected error occurred in the application
                </p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 mb-6">
              <h2 className="text-sm font-semibold text-red-400 mb-2">
                Error Details:
              </h2>
              <p className="text-gray-300 text-sm font-mono break-all">
                {this.state.error?.message || "Unknown error"}
              </p>
            </div>

            {this.state.errorInfo && (
              <details className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 mb-6">
                <summary className="text-sm font-semibold text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                  Stack Trace (for developers)
                </summary>
                <pre className="mt-3 text-xs text-gray-500 overflow-auto max-h-60 font-mono">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-gray-300 font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg"
              >
                Reload Page
              </button>
            </div>

            <p className="text-gray-500 text-xs text-center mt-6">
              If this problem persists, please contact support or try clearing
              your browser cache.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
