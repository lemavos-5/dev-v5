/**
 * Configuration Module Index
 * 
 * Centralized export point for all configuration modules
 * 
 * Usage:
 * import { ENV, logger, STRIPE_CONFIG } from '@/config';
 */

// Main environment
export { ENV, DERIVED_ENV, validateEnv, logEndpoints, getEnv, isDevelopment, isProduction, isStaging, APP_ENV } from './env';

// Stripe
export { STRIPE_CONFIG, getStripePublicKey, isStripeEnabled, initializeStripe, STRIPE_URLS } from './stripe';

// Google OAuth
export { GOOGLE_OAUTH_CONFIG, getGoogleClientId, isGoogleOAuthEnabled, validateGoogleOAuth } from './google';

// Logging
export { logger, logDebug, logInfo, logWarn, logError, logApiRequest, logApiResponse, logApiError, measurePerformance, measurePerformanceAsync, type LogLevel } from './logger';

// Export everything as default for convenience
import ENV, * as allEnv from './env';
import STRIPE_CONFIG from './stripe';
import GOOGLE_OAUTH_CONFIG from './google';
import logger from './logger';

export default {
  ENV,
  STRIPE_CONFIG,
  GOOGLE_OAUTH_CONFIG,
  logger,
  ...allEnv,
} as const;
