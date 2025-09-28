export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["NONE"] = 4] = "NONE";
})(LogLevel || (LogLevel = {}));
export class Logger {
    constructor() {
        Object.defineProperty(this, "logLevel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: LogLevel.INFO
        });
        Object.defineProperty(this, "logs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "maxLogs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1000
        });
        Object.defineProperty(this, "context", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'PresentationManager'
        });
    }
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    setLogLevel(level) {
        this.logLevel = level;
    }
    setContext(context) {
        this.context = context;
    }
    debug(message, data) {
        this.log(LogLevel.DEBUG, message, data);
    }
    info(message, data) {
        this.log(LogLevel.INFO, message, data);
    }
    warn(message, data) {
        this.log(LogLevel.WARN, message, data);
    }
    error(message, error) {
        this.log(LogLevel.ERROR, message, error);
    }
    log(level, message, data) {
        if (level < this.logLevel)
            return;
        const entry = {
            timestamp: new Date(),
            level,
            message,
            context: this.context,
            data
        };
        // Add to internal log storage
        this.logs.push(entry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift(); // Remove oldest log
        }
        // Output to console in simple format
        const levelStr = LogLevel[level];
        if (level === LogLevel.ERROR && data) {
            this.outputToConsole(level, `[${levelStr}] ${message}`, data);
        }
        else {
            this.outputToConsole(level, `[${levelStr}] ${message}`);
        }
    }
    formatLogEntry(entry) {
        const timestamp = entry.timestamp.toISOString();
        const levelStr = LogLevel[entry.level];
        const contextStr = entry.context ? `[${entry.context}]` : '';
        const dataStr = entry.data ? `\n${JSON.stringify(entry.data, null, 2)}` : '';
        return `${timestamp} ${levelStr} ${contextStr} ${entry.message}${dataStr}`;
    }
    outputToConsole(level, message, data) {
        switch (level) {
            case LogLevel.DEBUG:
                console.debug(message);
                break;
            case LogLevel.INFO:
                console.info(message);
                break;
            case LogLevel.WARN:
                console.warn(message);
                break;
            case LogLevel.ERROR:
                if (data !== undefined) {
                    console.error(message, data);
                }
                else {
                    console.error(message);
                }
                break;
        }
    }
    getLogs(level) {
        if (level !== undefined) {
            return this.logs.filter(log => log.level >= level);
        }
        return [...this.logs];
    }
    clearLogs() {
        this.logs = [];
    }
    exportLogs() {
        return this.logs.map(entry => this.formatLogEntry(entry)).join('\n');
    }
    // Convenience method for performance logging
    time(label) {
        const start = performance.now();
        this.debug(`Starting timer: ${label}`);
        return () => {
            const end = performance.now();
            const duration = end - start;
            this.info(`Timer ${label} completed in ${duration.toFixed(2)}ms`);
        };
    }
}
// Global logger instance
export const logger = Logger.getInstance();
