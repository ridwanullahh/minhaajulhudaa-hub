/**
 * Structured Logger
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Production-grade structured logger that replaces scattered
 * console.log/error calls. Supports log levels, structured metadata,
 * and can be extended to send logs to an external service (Datadog,
 * CloudWatch, etc.) by adding a transport.
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.info('User logged in', { userId: '123', platform: 'school' });
 *   logger.error('Payment failed', { reference: 'PAY-001', amount: 50000 });
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  [key: string]: any;
}

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const MIN_LEVEL: LogLevel = (import.meta.env?.VITE_DEBUG === 'true' ? 'debug' : 'info') as LogLevel;

class Logger {
  private minLevel: number;

  constructor(minLevel: LogLevel = MIN_LEVEL) {
    this.minLevel = LEVEL_PRIORITY[minLevel];
  }

  private log(level: LogLevel, message: string, meta?: Record<string, any>): void {
    if (LEVEL_PRIORITY[level] < this.minLevel) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    };

    // In production, you would send this to a log aggregation service.
    // For now, use console with structured output.
    const consoleMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : level === 'debug' ? console.debug : console.log;
    consoleMethod(JSON.stringify(entry));
  }

  debug(message: string, meta?: Record<string, any>): void {
    this.log('debug', message, meta);
  }

  info(message: string, meta?: Record<string, any>): void {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: Record<string, any>): void {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: Record<string, any>): void {
    this.log('error', message, meta);
  }

  // Create a child logger with persistent context (e.g. requestId)
  child(context: Record<string, any>): Logger {
    const childLogger = new Logger();
    const originalLog = childLogger.log.bind(childLogger);
    childLogger.log = (level: LogLevel, message: string, meta?: Record<string, any>) => {
      originalLog(level, message, { ...context, ...meta });
    };
    return childLogger;
  }
}

export const logger = new Logger();
export default logger;
