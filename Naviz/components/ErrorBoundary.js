import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Component } from 'react';
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "handleRetry", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.setState({
                    hasError: false,
                    error: null,
                    errorInfo: null
                });
            }
        });
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }
    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo
        });
        // Log error to console
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        // Call onError callback if provided
        this.props.onError?.(error, errorInfo);
        // Report to error tracking service (if configured)
        if (typeof window !== 'undefined' && window.errorReporting) {
            window.errorReporting.captureException(error, {
                contexts: {
                    react: {
                        componentStack: errorInfo.componentStack
                    }
                }
            });
        }
    }
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (_jsx("div", { className: "min-h-screen bg-gray-900 text-white flex items-center justify-center p-4", children: _jsxs("div", { className: "max-w-lg w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center", children: [_jsxs("div", { className: "mb-6", children: [_jsx("div", { className: "w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx("svg", { className: "w-8 h-8 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" }) }) }), _jsx("h1", { className: "text-2xl font-bold text-red-400 mb-2", children: "Something went wrong" }), _jsx("p", { className: "text-gray-300 mb-4", children: "An unexpected error occurred. Please try refreshing the page or contact support if the problem persists." })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("button", { onClick: this.handleRetry, className: "w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Try Again" }), _jsx("button", { onClick: () => window.location.reload(), className: "w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors", children: "Refresh Page" })] }), process.env.NODE_ENV === 'development' && this.state.error && (_jsxs("details", { className: "mt-6 text-left", children: [_jsx("summary", { className: "cursor-pointer text-sm text-gray-400 hover:text-gray-300", children: "Error Details (Development)" }), _jsxs("div", { className: "mt-2 p-4 bg-gray-700 rounded text-xs font-mono text-red-300 overflow-auto max-h-40", children: [_jsx("div", { className: "mb-2 font-bold", children: "Error:" }), _jsx("div", { className: "mb-4", children: this.state.error.toString() }), this.state.errorInfo && (_jsxs(_Fragment, { children: [_jsx("div", { className: "mb-2 font-bold", children: "Component Stack:" }), _jsx("pre", { className: "whitespace-pre-wrap", children: this.state.errorInfo.componentStack })] }))] })] }))] }) }));
        }
        return this.props.children;
    }
}
