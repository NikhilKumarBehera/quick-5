/**
 * Enterprise-Grade Error Handling & Logging System
 * Market-standard production error management
 */

// ============================================================================
// ERROR TYPES & INTERFACES
// ============================================================================

export enum ErrorCode {
  // Network errors
  NETWORK_ERROR = 'E001',
  TIMEOUT_ERROR = 'E002',
  INVALID_RESPONSE = 'E003',
  
  // Authentication errors
  UNAUTHORIZED = 'E401',
  FORBIDDEN = 'E403',
  TOKEN_EXPIRED = 'E404',
  
  // Validation errors
  INVALID_INPUT = 'E422',
  MISSING_REQUIRED_FIELD = 'E423',
  
  // Business logic errors
  INVALID_GAME_STATE = 'E501',
  CHALLENGE_NOT_FOUND = 'E502',
  INSUFFICIENT_DATA = 'E503',
  
  // System errors
  STORAGE_ERROR = 'E601',
  INITIALIZATION_ERROR = 'E602',
  UNKNOWN_ERROR = 'E999',
}

export interface AppError {
  code: ErrorCode;
  message: string;
  userMessage: string; // User-friendly message
  originalError?: Error;
  context?: Record<string, any>;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
  retryable: boolean;
}

export interface ErrorReport {
  error: AppError;
  userId?: string;
  sessionId: string;
  userAgent: string;
  appVersion: string;
  stackTrace?: string;
}

// ============================================================================
// ERROR FACTORY (Builder Pattern)
// ============================================================================

export class ErrorFactory {
  static createNetworkError(originalError: Error, context?: any): AppError {
    return {
      code: ErrorCode.NETWORK_ERROR,
      message: `Network error: ${originalError.message}`,
      userMessage: 'Connection failed. Please check your internet connection.',
      originalError,
      context,
      timestamp: Date.now(),
      severity: 'high',
      recoverable: true,
      retryable: true,
    };
  }

  static createTimeoutError(): AppError {
    return {
      code: ErrorCode.TIMEOUT_ERROR,
      message: 'Request timeout',
      userMessage: 'Request took too long. Please try again.',
      timestamp: Date.now(),
      severity: 'high',
      recoverable: true,
      retryable: true,
    };
  }

  static createUnauthorizedError(): AppError {
    return {
      code: ErrorCode.UNAUTHORIZED,
      message: 'Authentication required',
      userMessage: 'Please log in to continue.',
      timestamp: Date.now(),
      severity: 'critical',
      recoverable: true,
      retryable: false,
    };
  }

  static createValidationError(field: string, message: string): AppError {
    return {
      code: ErrorCode.INVALID_INPUT,
      message: `Validation error on ${field}: ${message}`,
      userMessage: `Invalid ${field}: ${message}`,
      timestamp: Date.now(),
      severity: 'low',
      recoverable: true,
      retryable: false,
    };
  }

  static createGameStateError(message: string, context?: any): AppError {
    return {
      code: ErrorCode.INVALID_GAME_STATE,
      message: `Game state error: ${message}`,
      userMessage: 'An error occurred during gameplay. Please try again.',
      context,
      timestamp: Date.now(),
      severity: 'high',
      recoverable: true,
      retryable: true,
    };
  }

  static createUnknownError(error: any): AppError {
    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: error?.message || 'Unknown error occurred',
      userMessage: 'Something went wrong. Please try again later.',
      originalError: error instanceof Error ? error : new Error(String(error)),
      timestamp: Date.now(),
      severity: 'critical',
      recoverable: true,
      retryable: true,
    };
  }
}

// ============================================================================
// LOGGING LEVELS & INTERFACES
// ============================================================================

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  timestamp: number;
  duration?: number; // For performance tracking
  userId?: string;
  sessionId: string;
}

// ============================================================================
// ERROR & LOGGING SERVICE (Singleton)
// ============================================================================

export class ErrorAndLoggingService {
  private static instance: ErrorAndLoggingService;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private readonly environment: 'development' | 'production' | 'staging';

  private constructor(environment: 'development' | 'production' | 'staging') {
    this.environment = environment;
  }

  static getInstance(
    environment: 'development' | 'production' | 'staging' = 'production'
  ): ErrorAndLoggingService {
    if (!ErrorAndLoggingService.instance) {
      ErrorAndLoggingService.instance = new ErrorAndLoggingService(environment);
    }
    return ErrorAndLoggingService.instance;
  }

  // ========================================================================
  // LOGGING METHODS
  // ========================================================================

  log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    duration?: number
  ): void {
    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: Date.now(),
      duration,
      sessionId: this.getSessionId(),
    };

    this.logs.push(entry);
    this.enforceMaxLogs();

    // Console output in development
    if (this.environment === 'development') {
      this.logToConsole(entry);
    }

    // Send to backend in production
    if (this.environment === 'production' && level !== LogLevel.DEBUG) {
      this.sendToBackend(entry);
    }
  }

  debug(message: string, context?: any): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: any): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: any): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: any): void {
    this.log(LogLevel.ERROR, message, {
      ...context,
      errorMessage: error?.message,
      stack: error?.stack,
    });
  }

  critical(message: string, error?: Error, context?: any): void {
    this.log(LogLevel.CRITICAL, message, {
      ...context,
      errorMessage: error?.message,
      stack: error?.stack,
    });

    // Immediately report critical errors
    this.sendToBackend({
      level: LogLevel.CRITICAL,
      message,
      context: {
        ...context,
        errorMessage: error?.message,
        stack: error?.stack,
      },
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
    });
  }

  // ========================================================================
  // ERROR HANDLING METHODS
  // ========================================================================

  handleError(error: AppError, context?: any): void {
    const errorLog = {
      level: LogLevel.ERROR,
      message: `${error.code}: ${error.message}`,
      context: {
        code: error.code,
        severity: error.severity,
        recoverable: error.recoverable,
        retryable: error.retryable,
        ...error.context,
        ...context,
      },
      timestamp: error.timestamp,
      sessionId: this.getSessionId(),
    };

    this.logs.push(errorLog);

    // Report to backend based on severity
    if (error.severity === 'critical') {
      this.sendToBackend(errorLog);
    }
  }

  trackPerformance(operation: string, duration: number, success: boolean): void {
    this.log(
      success ? LogLevel.DEBUG : LogLevel.WARN,
      `Performance: ${operation}`,
      { success, duration },
      duration
    );
  }

  trackEvent(eventName: string, properties?: Record<string, any>): void {
    this.log(LogLevel.INFO, `Event: ${eventName}`, properties);
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  private logToConsole(entry: LogEntry): void {
    const prefix = `[${entry.level}] ${new Date(entry.timestamp).toISOString()}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, entry.message, entry.context);
        break;
      case LogLevel.INFO:
        console.info(prefix, entry.message, entry.context);
        break;
      case LogLevel.WARN:
        console.warn(prefix, entry.message, entry.context);
        break;
      case LogLevel.ERROR:
        console.error(prefix, entry.message, entry.context);
        break;
      case LogLevel.CRITICAL:
        console.error('🔴 CRITICAL:', prefix, entry.message, entry.context);
        break;
    }
  }

  private sendToBackend(entry: LogEntry): void {
    // Implementation would send to backend logging service (Sentry, LogRocket, etc.)
    // This is a placeholder for actual implementation
    if (this.environment !== 'development') {
      // fetch('/api/logs', { method: 'POST', body: JSON.stringify(entry) })
    }
  }

  private enforceMaxLogs(): void {
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  private getSessionId(): string {
    // Get or create session ID
    return sessionStorage.getItem('sessionId') || this.generateSessionId();
  }

  private generateSessionId(): string {
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', id);
    return id;
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (!level) return this.logs;
    return this.logs.filter((log) => log.level === level);
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}
