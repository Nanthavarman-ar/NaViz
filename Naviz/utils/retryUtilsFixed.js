/**
 * Enhanced retry utility with exponential backoff for network operations
 */
/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff(fn, options = {}) {
    const { maxAttempts = 3, baseDelay = 1000, maxDelay = 10000, backoffMultiplier = 2, retryCondition = () => true, onRetry } = options;
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const result = await fn();
            return {
                success: true,
                data: result,
                attempts: attempt
            };
        }
        catch (error) {
            lastError = error;
            // Don't retry if we've exhausted attempts or condition fails
            if (attempt === maxAttempts || !retryCondition(lastError)) {
                break;
            }
            // Calculate delay with exponential backoff
            const delay = Math.min(baseDelay * Math.pow(backoffMultiplier, attempt - 1), maxDelay);
            // Call retry callback if provided
            if (onRetry) {
                onRetry(attempt, lastError);
            }
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    return {
        success: false,
        error: lastError,
        attempts: maxAttempts
    };
}
/**
 * Retry function specifically for network operations
 */
export async function retryNetworkOperation(fn, options = {}) {
    return retryWithBackoff(fn, {
        ...options,
        retryCondition: (error) => {
            // Retry on network-related errors
            const networkErrors = [
                'network',
                'fetch',
                'timeout',
                'connection',
                'offline',
                'unreachable'
            ];
            const shouldRetry = networkErrors.some(keyword => error.message.toLowerCase().includes(keyword));
            return shouldRetry;
        }
    });
}
/**
 * Enhanced API call with retry logic
 */
export async function apiCallWithRetry(url, options = {}, retryOptions = {}) {
    return retryNetworkOperation(async () => {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response;
    }, retryOptions);
}
/**
 * Check if the user is online
 */
export function isOnline() {
    return navigator.onLine;
}
/**
 * Wait for online status
 */
export function waitForOnline(timeout = 30000) {
    return new Promise((resolve) => {
        if (navigator.onLine) {
            resolve(true);
            return;
        }
        const handleOnline = () => {
            clearTimeout(timeoutId);
            window.removeEventListener('online', handleOnline);
            resolve(true);
        };
        const timeoutId = setTimeout(() => {
            window.removeEventListener('online', handleOnline);
            resolve(false);
        }, timeout);
        window.addEventListener('online', handleOnline);
    });
}
/**
 * Network status monitor
 */
export class NetworkMonitor {
    constructor() {
        Object.defineProperty(this, "listeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "currentStatus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: navigator.onLine
        });
        Object.defineProperty(this, "handleOnline", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.currentStatus = true;
                this.notifyListeners(true);
            }
        });
        Object.defineProperty(this, "handleOffline", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.currentStatus = false;
                this.notifyListeners(false);
            }
        });
        window.addEventListener('online', this.handleOnline);
        window.addEventListener('offline', this.handleOffline);
    }
    notifyListeners(online) {
        this.listeners.forEach(listener => {
            try {
                listener(online);
            }
            catch (error) {
                console.error('Network monitor listener error:', error);
            }
        });
    }
    addListener(listener) {
        this.listeners.add(listener);
        // Immediately notify current status
        listener(this.currentStatus);
        // Return unsubscribe function
        return () => {
            this.listeners.delete(listener);
        };
    }
    isOnline() {
        return this.currentStatus;
    }
    destroy() {
        window.removeEventListener('online', this.handleOnline);
        window.removeEventListener('offline', this.handleOffline);
        this.listeners.clear();
    }
}
// Export singleton instance
export const networkMonitor = new NetworkMonitor();
