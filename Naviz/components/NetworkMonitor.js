import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
const NetworkContext = createContext(undefined);
export const NetworkMonitor = ({ children, onNetworkChange }) => {
    const [networkState, setNetworkState] = useState({
        isOnline: navigator.onLine,
        connectionType: 'unknown',
        effectiveType: 'unknown',
        downlink: 0,
        rtt: 0
    });
    useEffect(() => {
        const updateNetworkState = () => {
            const connection = navigator.connection ||
                navigator.mozConnection ||
                navigator.webkitConnection;
            const newState = {
                isOnline: navigator.onLine,
                connectionType: connection?.type || 'unknown',
                effectiveType: connection?.effectiveType || 'unknown',
                downlink: connection?.downlink || 0,
                rtt: connection?.rtt || 0
            };
            setNetworkState(newState);
            onNetworkChange?.(navigator.onLine);
        };
        // Initial state
        updateNetworkState();
        // Event listeners
        window.addEventListener('online', updateNetworkState);
        window.addEventListener('offline', updateNetworkState);
        // Connection change listener (if supported)
        const connection = navigator.connection ||
            navigator.mozConnection ||
            navigator.webkitConnection;
        if (connection) {
            connection.addEventListener('change', updateNetworkState);
        }
        return () => {
            window.removeEventListener('online', updateNetworkState);
            window.removeEventListener('offline', updateNetworkState);
            if (connection) {
                connection.removeEventListener('change', updateNetworkState);
            }
        };
    }, [onNetworkChange]);
    return (_jsx(NetworkContext.Provider, { value: networkState, children: children }));
};
export const useNetwork = () => {
    const context = useContext(NetworkContext);
    if (context === undefined) {
        throw new Error('useNetwork must be used within a NetworkMonitor');
    }
    return context;
};
