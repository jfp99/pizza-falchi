/**
 * Application-wide constants
 *
 * Centralized location for all magic numbers and configuration values
 * used throughout the application. Improves maintainability and makes
 * it easy to update values in one place.
 */

// ============================================================================
// Order & Payment Constants
// ============================================================================

/**
 * Standard delivery fee in euros
 * Applied to all delivery orders (pickup orders have no fee)
 */
export const DELIVERY_FEE = 3.0;

// ============================================================================
// Time & Refresh Intervals (in milliseconds)
// ============================================================================

/**
 * Auto-refresh interval for time slot dashboard
 * Dashboard refreshes every 30 seconds to show latest slot availability
 */
export const AUTO_REFRESH_INTERVAL_MS = 30 * 1000; // 30 seconds

/**
 * CSRF token expiration time
 * Tokens are valid for 15 minutes from creation
 */
export const CSRF_TOKEN_EXPIRATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * CSRF token cleanup interval
 * Expired tokens are cleaned up every 5 minutes to prevent memory leaks
 */
export const CSRF_CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// ============================================================================
// Validation Constants
// ============================================================================

/**
 * Minimum customer name length
 */
export const MIN_CUSTOMER_NAME_LENGTH = 2;

/**
 * Maximum customer name length
 */
export const MAX_CUSTOMER_NAME_LENGTH = 100;

/**
 * French phone number regex pattern
 * Matches formats like: 06 12 34 56 78, +33 6 12 34 56 78, 0033612345678
 */
export const FRENCH_PHONE_REGEX = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

/**
 * French postal code regex pattern
 * Matches 5-digit postal codes
 */
export const FRENCH_POSTAL_CODE_REGEX = /^\d{5}$/;

// ============================================================================
// Default Values
// ============================================================================

/**
 * Default city for delivery addresses
 */
export const DEFAULT_CITY = 'Puyricard';

/**
 * Default postal code for delivery addresses
 */
export const DEFAULT_POSTAL_CODE = '13540';

/**
 * Default country for all orders
 */
export const DEFAULT_COUNTRY = 'France';
