/**
 * Logging and Debug Configuration Module
 * 
 * Centralized logging utilities respecting environment configuration
 */

import { ENV, isDevelopment, isProduction } from './env';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Log levels with numeric values for comparison
 */
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Get current log level threshold
 */
export function getLogLevelThreshold(): number {
  return LOG_LEVELS[ENV.LOG_LEVEL];
}

/**
 * Check if a log level should be displayed
 */
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= getLogLevelThreshold();
}

/**
 * Debug logger
 */
export function logDebug(...args: any[]): void {
  if (isDevelopment && shouldLog('debug')) {
    console.log('🔍 [DEBUG]', ...args);
  }
}

/**
 * Info logger
 */
export function logInfo(...args: any[]): void {
  if (shouldLog('info')) {
    console.log('ℹ️  [INFO]', ...args);
  }
}

/**
 * Warning logger
 */
export function logWarn(...args: any[]): void {
  if (shouldLog('warn')) {
    console.warn('⚠️  [WARN]', ...args);
  }
}

/**
 * Error logger
 */
export function logError(...args: any[]): void {
  if (shouldLog('error')) {
    console.error('❌ [ERROR]', ...args);
  }
}

/**
 * API request logger
 */
export function logApiRequest(method: string, url: string, data?: any): void {
  if (isDevelopment && ENV.DEBUG) {
    console.log(`📡 [API ${method}] ${url}`, data || '');
  }
}

/**
 * API response logger
 */
export function logApiResponse(method: string, url: string, status: number, data?: any): void {
  if (isDevelopment && ENV.DEBUG) {
    const icon = status >= 400 ? '❌' : '✅';
    console.log(`${icon} [API ${method} ${status}] ${url}`, data || '');
  }
}

/**
 * API error logger
 */
export function logApiError(method: string, url: string, error: any): void {
  if (shouldLog('error')) {
    console.error(`❌ [API ${method} ERROR] ${url}`, error);
  }
}

/**
 * Performance measurement
 */
export function measurePerformance(label: string, fn: () => void): void {
  if (!isDevelopment || !ENV.DEBUG) {
    fn();
    return;
  }

  const start = performance.now();
  try {
    fn();
  } finally {
    const end = performance.now();
    console.log(`⏱️  [PERF] ${label}: ${(end - start).toFixed(2)}ms`);
  }
}

/**
 * Async performance measurement
 */
export async function measurePerformanceAsync<T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> {
  if (!isDevelopment || !ENV.DEBUG) {
    return fn();
  }

  const start = performance.now();
  try {
    return await fn();
  } finally {
    const end = performance.now();
    console.log(`⏱️  [PERF] ${label}: ${(end - start).toFixed(2)}ms`);
  }
}

/**
 * Export configured logger object for convenience
 */
export const logger = {
  debug: logDebug,
  info: logInfo,
  warn: logWarn,
  error: logError,
  apiRequest: logApiRequest,
  apiResponse: logApiResponse,
  apiError: logApiError,
  perf: measurePerformance,
  perfAsync: measurePerformanceAsync,
} as const;

export default logger;
