/**
 * Google OAuth Configuration Module
 * 
 * Handles Google OAuth configuration
 */

import { ENV, DERIVED_ENV } from './env';

/**
 * Get Google Client ID
 */
export function getGoogleClientId(): string {
  return ENV.GOOGLE_CLIENT_ID || '';
}

/**
 * Check if Google OAuth is configured
 */
export function isGoogleOAuthEnabled(): boolean {
  return DERIVED_ENV.isGoogleOAuthConfigured();
}

/**
 * Google OAuth configuration object
 */
export const GOOGLE_OAUTH_CONFIG = {
  clientId: getGoogleClientId(),
  enabled: isGoogleOAuthEnabled(),
  redirectUri: `${ENV.API_URL}/auth/google/callback`,
} as const;

/**
 * Validate Google OAuth configuration
 * @throws Error if configuration is invalid
 */
export function validateGoogleOAuth(): void {
  if (!isGoogleOAuthEnabled()) {
    console.warn('⚠️  Google OAuth is not configured. Social login will be unavailable.');
    return;
  }

  if (!ENV.GOOGLE_CLIENT_ID) {
    throw new Error('Google Client ID is missing. Please configure VITE_GOOGLE_CLIENT_ID');
  }

  // Validate Client ID format (basic check)
  if (ENV.GOOGLE_CLIENT_ID.length < 20) {
    throw new Error('Invalid Google Client ID format');
  }
}

export default GOOGLE_OAUTH_CONFIG;
