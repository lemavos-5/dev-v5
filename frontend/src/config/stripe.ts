/**
 * Stripe Configuration Module
 * 
 * Handles Stripe-specific configuration and initialization
 */

import { ENV, DERIVED_ENV } from './env';

/**
 * Get Stripe public key
 */
export function getStripePublicKey(): string {
  return DERIVED_ENV.stripePublicKey();
}

/**
 * Check if Stripe is configured
 */
export function isStripeEnabled(): boolean {
  return DERIVED_ENV.isStripeConfigured();
}

/**
 * Get Stripe URLs for redirect after checkout
 */
export const STRIPE_URLS = {
  SUCCESS: '/subscription/success',
  CANCEL: '/subscription/cancel',
} as const;

/**
 * Stripe configuration object
 */
export const STRIPE_CONFIG = {
  publicKey: getStripePublicKey(),
  enabled: isStripeEnabled(),
  successUrl: STRIPE_URLS.SUCCESS,
  cancelUrl: STRIPE_URLS.CANCEL,
} as const;

/**
 * Load Stripe asynchronously (if needed)
 * This can be extended to lazy-load Stripe library
 */
export async function initializeStripe(): Promise<void> {
  if (!isStripeEnabled()) {
    console.warn('⚠️  Stripe is not configured. Billing features will be unavailable.');
    return;
  }

  // In a real implementation, you would load the Stripe library here
  // For now, we just validate the configuration
  if (!ENV.STRIPE_PUBLIC_KEY) {
    throw new Error('Stripe public key is missing. Please configure VITE_STRIPE_PUBLIC_KEY');
  }

  if (!ENV.STRIPE_PUBLIC_KEY.startsWith('pk_')) {
    throw new Error('Invalid Stripe public key format. Must start with "pk_"');
  }
}

export default STRIPE_CONFIG;
