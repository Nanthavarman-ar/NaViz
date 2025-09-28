import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export const OfflineFallback = ({ message = "You're currently offline. Please check your internet connection.", onRetry, showRefreshButton = true, customActions }) => {
    const [retryCount, setRetryCount] = useState(0);
    const [isRetrying, setIsRetrying] = useState(false);
    const handleRetry = async () => {
        setIsRetrying(true);
        setRetryCount(prev => prev + 1);
        // Wait a bit before checking connection
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (navigator.onLine) {
            onRetry?.();
        }
        else {
            setIsRetrying(false);
        }
    };
    const handleRefresh = () => {
        window.location.reload();
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-900 text-white flex items-center justify-center p-4", children: _jsxs("div", { className: "max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center", children: [_jsxs("div", { className: "mb-6", children: [_jsx("div", { className: "w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx("svg", { className: "w-8 h-8 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 2.83L3 21m9-13.5a9.963 9.963 0 00-4.255 1.725M12 3v6m0 0l3-3m-3 3l-3-3" }) }) }), _jsx("h1", { className: "text-2xl font-bold text-red-400 mb-2", children: "Offline" }), _jsx("p", { className: "text-gray-300", children: message })] }), _jsxs("div", { className: "mb-6 p-4 bg-gray-700 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { children: "Connection Status:" }), _jsx("span", { className: "text-red-400 font-medium", children: "Disconnected" })] }), _jsxs("div", { className: "flex items-center justify-between text-sm mt-2", children: [_jsx("span", { children: "Retry Attempts:" }), _jsx("span", { className: "text-yellow-400 font-medium", children: retryCount })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("button", { onClick: handleRetry, disabled: isRetrying, className: "w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: isRetrying ? (_jsxs("div", { className: "flex items-center justify-center", children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Checking Connection..."] })) : ('Try Again') }), showRefreshButton && (_jsx("button", { onClick: handleRefresh, className: "w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors", children: "Refresh Page" })), customActions && (_jsx("div", { className: "pt-2", children: customActions }))] }), _jsxs("div", { className: "mt-6 p-4 bg-blue-900/30 rounded-lg", children: [_jsx("h3", { className: "text-sm font-medium text-blue-300 mb-2", children: "Troubleshooting Tips:" }), _jsxs("ul", { className: "text-xs text-blue-200 space-y-1 text-left", children: [_jsx("li", { children: "\u2022 Check your internet connection" }), _jsx("li", { children: "\u2022 Try refreshing the page" }), _jsx("li", { children: "\u2022 Disable VPN if you're using one" }), _jsx("li", { children: "\u2022 Check if other websites are loading" })] })] }), retryCount > 0 && (_jsxs("div", { className: "mt-4 text-xs text-gray-400", children: ["Auto-retrying in 5 seconds... (Attempt ", retryCount + 1, ")"] }))] }) }));
};
