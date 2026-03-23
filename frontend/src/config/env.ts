/**
 * Environment Configuration Module
 * 
 * Centralized configuration using Vite environment variables.
 * All VITE_ prefixed variables are exposed at build time.
 * 
 * Usage:
 * import { ENV, validateEnv } from '@/config/env';
 * 
 * // Validate on app startup
 * validateEnv();
 * 
 * // Use configuration
 * const apiUrl = ENV.API_URL;
 */

// Environment detection
export const APP_ENV = (import.meta.env.VITE_APP_ENV || 'development') as 'development' | 'production' | 'staging';
export const isDevelopment = APP_ENV === 'development';
export const isProduction = APP_ENV === 'production';
export const isStaging = APP_ENV === 'staging';

/**
 * Main environment configuration object
 * All values are read from environment variables with sensible defaults
 */
export const ENV = {
  // Application
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Continuum Research',
  APP_ENV,
  PORT: parseInt(import.meta.env.VITE_PORT || '5173', 10),

  // API
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  API_BASE: import.meta.env.VITE_API_BASE || '/api',
  AUTH_BASE: import.meta.env.VITE_AUTH_BASE || '/auth',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),

  // Stripe
  STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',

  // Google OAuth
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',

  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_SENTRY: import.meta.env.VITE_ENABLE_SENTRY === 'true',

  // Performance
  AUTO_SAVE_DELAY: parseInt(import.meta.env.VITE_AUTO_SAVE_DELAY || '2000', 10),

  // Debug
  DEBUG: import.meta.env.VITE_DEBUG === 'true',
  LOG_LEVEL: (import.meta.env.VITE_LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',
} as const;

/**
 * Derived configuration values
 */
export const DERIVED_ENV = {
  // Compute full API URLs
  getFullApiUrl: (endpoint: string = ''): string => {
    const baseUrl = `${ENV.API_URL}${ENV.API_BASE}`;
    return endpoint ? `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}` : baseUrl;
  },

  getFullAuthUrl: (endpoint: string = ''): string => {
    const baseUrl = `${ENV.API_URL}${ENV.AUTH_BASE}`;
    return endpoint ? `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}` : baseUrl;
  },

  // Stripe URLs
  stripePublicKey: (): string => {
    if (!ENV.STRIPE_PUBLIC_KEY) {
      console.warn('Stripe public key not configured');
      return '';
    }
    return ENV.STRIPE_PUBLIC_KEY;
  },

  // Feature checks
  isStripeConfigured: (): boolean => !!ENV.STRIPE_PUBLIC_KEY,
  isGoogleOAuthConfigured: (): boolean => !!ENV.GOOGLE_CLIENT_ID,
  isAnalyticsEnabled: (): boolean => ENV.ENABLE_ANALYTICS,
  isSentryEnabled: (): boolean => ENV.ENABLE_SENTRY,
} as const;

/**
 * Required environment variables validation
 */
const REQUIRED_VARS: (keyof typeof ENV)[] = [
  'API_URL',
  'APP_NAME',
  'APP_ENV',
];

/**
 * Conditionally required variables
 */
const CONDITIONAL_REQUIRED: { key: keyof typeof ENV; condition: () => boolean }[] = [
  { key: 'STRIPE_PUBLIC_KEY', condition: () => isProduction },
];

/**
 * Validate environment configuration
 * Should be called during app initialization
 * 
 * @throws Error if required environment variables are missing
 */
export function validateEnv(): void {
  const missingVars: string[] = [];

  // Check required variables
  for (const varName of REQUIRED_VARS) {
    const value = ENV[varName];
    if (!value || value === '') {
      missingVars.push(`VITE_${String(varName).toUpperCase()}`);
    }
  }

  // Check conditionally required variables
  for (const { key, condition } of CONDITIONAL_REQUIRED) {
    if (condition()) {
      const value = ENV[key];
      if (!value || value === '') {
        missingVars.push(`VITE_${String(key).toUpperCase()}`);
      }
    }
  }

  // Throw error if any required variables are missing
  if (missingVars.length > 0) {
    const message = `Missing required environment variables: ${missingVars.join(', ')}`;
    if (isProduction) {
      throw new Error(message);
    } else {
      console.warn(`⚠️  ${message}`);
    }
  }

  // Log configuration in development
  if (isDevelopment && ENV.DEBUG) {
    console.log('🔧 Environment Configuration:', {
      NODE_ENV: import.meta.env.MODE,
      APP_ENV: ENV.APP_ENV,
      API_URL: ENV.API_URL,
      STRIPE_CONFIGURED: DERIVED_ENV.isStripeConfigured(),
      GOOGLE_OAUTH_CONFIGURED: DERIVED_ENV.isGoogleOAuthConfigured(),
      ANALYTICS_ENABLED: ENV.ENABLE_ANALYTICS,
      SENTRY_ENABLED: ENV.ENABLE_SENTRY,
    });
  }
}

/**
 * Get environment variable with type safety
 * Returns undefined if variable doesn't exist
 */
export function getEnv<K extends keyof typeof ENV>(key: K): typeof ENV[K] {
  return ENV[key];
}

/**
 * Log available endpoints (for debugging)
 */
export function logEndpoints(): void {
  if (!isDevelopment) return;

  console.log('📍 Available Endpoints:', {
    API: DERIVED_ENV.getFullApiUrl(),
    AUTH: DERIVED_ENV.getFullAuthUrl(),
    NOTES: DERIVED_ENV.getFullApiUrl('/notes'),
    ENTITIES: DERIVED_ENV.getFullApiUrl('/entities'),
    METRICS: DERIVED_ENV.getFullApiUrl('/metrics/dashboard'),
    SUBSCRIPTIONS: DERIVED_ENV.getFullApiUrl('/subscriptions'),
  });
}

export default ENV;
