import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
class AIErrorHandler extends Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "maxRetries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 3
        });
        Object.defineProperty(this, "retryTimeouts", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [1000, 2000, 4000]
        }); // Exponential backoff
        Object.defineProperty(this, "handleOnline", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.setState({ isOnline: true });
                if (this.state.hasError && this.state.errorType === 'network') {
                    this.attemptRecovery();
                }
            }
        });
        Object.defineProperty(this, "handleOffline", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.setState({ isOnline: false });
            }
        });
        Object.defineProperty(this, "attemptRecovery", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                const { retryCount, errorType } = this.state;
                if (retryCount < this.maxRetries) {
                    const delay = this.retryTimeouts[retryCount] || 4000;
                    setTimeout(() => {
                        this.setState(prevState => ({
                            hasError: false,
                            error: null,
                            retryCount: prevState.retryCount + 1
                        }));
                    }, delay);
                }
            }
        });
        Object.defineProperty(this, "handleManualRetry", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.attemptRecovery();
            }
        });
        Object.defineProperty(this, "getErrorMessage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                const { errorType, isOnline } = this.state;
                if (!isOnline) {
                    return {
                        title: 'Connection Lost',
                        message: 'AI features require an internet connection. Please check your network and try again.',
                        icon: _jsx(WifiOff, { className: "w-5 h-5 text-red-500" })
                    };
                }
                switch (errorType) {
                    case 'network':
                        return {
                            title: 'Network Error',
                            message: 'Unable to connect to AI services. This might be a temporary issue.',
                            icon: _jsx(Wifi, { className: "w-5 h-5 text-orange-500" })
                        };
                    case 'analysis':
                        return {
                            title: 'Analysis Engine Error',
                            message: 'The structural analysis encountered an issue. The AI will attempt to recover automatically.',
                            icon: _jsx(AlertTriangle, { className: "w-5 h-5 text-yellow-500" })
                        };
                    case 'speech':
                        return {
                            title: 'Voice Recognition Error',
                            message: 'Speech recognition is not available or encountered an error. Please check your microphone permissions.',
                            icon: _jsx(AlertTriangle, { className: "w-5 h-5 text-purple-500" })
                        };
                    default:
                        return {
                            title: 'AI Feature Error',
                            message: 'An unexpected error occurred in the AI feature. Please try again.',
                            icon: _jsx(AlertTriangle, { className: "w-5 h-5 text-red-500" })
                        };
                }
            }
        });
        this.state = {
            hasError: false,
            error: null,
            errorType: 'general',
            retryCount: 0,
            isOnline: navigator.onLine
        };
    }
    static getDerivedStateFromError(error) {
        // Determine error type based on error message
        let errorType = 'general';
        if (error.message.includes('network') || error.message.includes('fetch')) {
            errorType = 'network';
        }
        else if (error.message.includes('analysis') || error.message.includes('structural')) {
            errorType = 'analysis';
        }
        else if (error.message.includes('speech') || error.message.includes('recognition')) {
            errorType = 'speech';
        }
        return {
            hasError: true,
            error,
            errorType,
            retryCount: 0
        };
    }
    componentDidCatch(error, errorInfo) {
        console.error('AI Error Handler caught an error:', error, errorInfo);
        // Log to external service in production
        if (process.env.NODE_ENV === 'production') {
            // Could integrate with error reporting service like Sentry
            console.error('AI Feature Error:', {
                error: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                errorType: this.state.errorType,
                timestamp: new Date().toISOString()
            });
        }
    }
    componentDidMount() {
        window.addEventListener('online', this.handleOnline);
        window.addEventListener('offline', this.handleOffline);
    }
    componentWillUnmount() {
        window.removeEventListener('online', this.handleOnline);
        window.removeEventListener('offline', this.handleOffline);
    }
    render() {
        if (this.state.hasError) {
            const { title, message, icon } = this.getErrorMessage();
            const { retryCount, isOnline } = this.state;
            if (this.props.fallbackComponent) {
                return this.props.fallbackComponent;
            }
            return (_jsx("div", { className: "flex items-center justify-center h-full bg-slate-900 p-6", children: _jsx("div", { className: "max-w-md w-full", children: _jsx(Alert, { className: "border-orange-200 bg-orange-50", children: _jsxs("div", { className: "flex items-start gap-3", children: [icon, _jsx("div", { className: "flex-1", children: _jsxs(AlertDescription, { className: "text-slate-700", children: [_jsx("div", { className: "font-semibold mb-2", children: title }), _jsx("div", { className: "mb-4", children: message }), retryCount < this.maxRetries && isOnline && (_jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "text-sm text-slate-600 mb-2", children: ["Automatic recovery attempt ", retryCount + 1, " of ", this.maxRetries, "..."] }), _jsx("div", { className: "w-full bg-slate-200 rounded-full h-2", children: _jsx("div", { className: "bg-orange-500 h-2 rounded-full transition-all duration-1000", style: {
                                                                width: `${((this.maxRetries - retryCount) / this.maxRetries) * 100}%`
                                                            } }) })] })), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { onClick: this.handleManualRetry, disabled: retryCount >= this.maxRetries || !isOnline, size: "sm", variant: "outline", children: [_jsx(RefreshCw, { className: "w-4 h-4 mr-2" }), "Retry Now"] }), _jsx(Button, { onClick: () => window.location.reload(), size: "sm", variant: "outline", children: "Restart" })] }), !isOnline && (_jsxs("div", { className: "mt-3 p-3 bg-slate-100 rounded text-sm", children: [_jsx(WifiOff, { className: "w-4 h-4 inline mr-2" }), "You're currently offline. Some AI features require an internet connection."] }))] }) })] }) }) }) }));
        }
        return this.props.children;
    }
}
export default AIErrorHandler;
