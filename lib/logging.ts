/**
 * Secure Logging Utility
 *
 * SECURITY: Sanitizes sensitive data before logging to prevent PII exposure
 * Complies with GDPR and data protection regulations
 */

/**
 * List of sensitive fields that should be redacted in logs
 */
const SENSITIVE_FIELDS = [
  // Personal Information
  'phone',
  'email',
  'password',
  'passwordConfirm',
  'currentPassword',
  'newPassword',

  // Address Information
  'street',
  'postalCode',
  'city',
  'address',
  'deliveryAddress',

  // Payment Information
  'cardNumber',
  'cvv',
  'creditCard',

  // Authentication
  'token',
  'refreshToken',
  'accessToken',
  'apiKey',
  'secret',
  'csrf',
  '_csrf',

  // User Identifiers (partial redaction)
  'customerName', // Will be partially redacted
];

/**
 * Redaction strategies
 */
const REDACTION_STRATEGIES: Record<string, (value: any) => string> = {
  // Full redaction
  default: () => '[REDACTED]',

  // Partial redaction for names (show first letter + length)
  customerName: (value: string) => {
    if (typeof value !== 'string' || value.length === 0) return '[REDACTED]';
    return `${value[0]}${'*'.repeat(Math.min(value.length - 1, 8))}`;
  },

  // Partial redaction for emails (show domain)
  email: (value: string) => {
    if (typeof value !== 'string' || !value.includes('@')) return '[REDACTED]';
    const [, domain] = value.split('@');
    return `***@${domain}`;
  },

  // Partial redaction for phone numbers (show last 4 digits)
  phone: (value: string) => {
    if (typeof value !== 'string' || value.length < 4) return '[REDACTED]';
    return `***${value.slice(-4)}`;
  },
};

/**
 * Recursively sanitize an object by redacting sensitive fields
 */
function sanitizeObject(obj: any, depth: number = 0): any {
  // Prevent infinite recursion
  if (depth > 10) return '[MAX_DEPTH]';

  // Handle null/undefined
  if (obj === null || obj === undefined) return obj;

  // Handle primitives
  if (typeof obj !== 'object') return obj;

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, depth + 1));
  }

  // Handle objects
  const sanitized: any = {};

  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();

    // Check if field is sensitive
    const isSensitive = SENSITIVE_FIELDS.some(field =>
      lowerKey.includes(field.toLowerCase())
    );

    if (isSensitive) {
      // Apply redaction strategy
      const strategy = REDACTION_STRATEGIES[key] || REDACTION_STRATEGIES.default;
      sanitized[key] = strategy(value);
    } else if (typeof value === 'object' && value !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeObject(value, depth + 1);
    } else {
      // Keep non-sensitive values
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Sanitize data for logging
 * @param data - Data to sanitize (can be any type)
 * @returns Sanitized data safe for logging
 */
export function sanitizeForLogging(data: any): any {
  return sanitizeObject(data);
}

/**
 * Secure console.log wrapper
 */
export function secureLog(message: string, data?: any): void {
  if (data) {
    console.log(message, sanitizeForLogging(data));
  } else {
    console.log(message);
  }
}

/**
 * Secure console.error wrapper
 */
export function secureError(message: string, data?: any): void {
  if (data) {
    console.error(message, sanitizeForLogging(data));
  } else {
    console.error(message);
  }
}

/**
 * Secure console.warn wrapper
 */
export function secureWarn(message: string, data?: any): void {
  if (data) {
    console.warn(message, sanitizeForLogging(data));
  } else {
    console.warn(message);
  }
}

/**
 * Format object for secure logging
 * Useful when you need the formatted string
 */
export function formatSecureLog(data: any): string {
  return JSON.stringify(sanitizeForLogging(data), null, 2);
}

/**
 * Check if environment allows detailed logging
 */
export function shouldLogDetails(): boolean {
  return process.env.NODE_ENV === 'development' || process.env.ENABLE_DETAILED_LOGS === 'true';
}

/**
 * Conditional detailed logging (only in development)
 */
export function devLog(message: string, data?: any): void {
  if (shouldLogDetails()) {
    secureLog(`[DEV] ${message}`, data);
  }
}
