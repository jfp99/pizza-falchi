/**
 * Input Sanitization Utilities
 *
 * Provides XSS prevention through input sanitization
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes all potentially dangerous HTML/JavaScript
 */
export function sanitizeHTML(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Strip all HTML tags by default
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true, // Keep text content
  });
}

/**
 * Sanitize user input for text fields (names, addresses, etc.)
 * Removes HTML but preserves special characters for international names
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove HTML tags and scripts
  const cleaned = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });

  // Trim whitespace
  return cleaned.trim();
}

/**
 * Sanitize email address
 * Basic validation and sanitization
 */
export function sanitizeEmail(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove HTML and trim
  const cleaned = sanitizeText(input).toLowerCase();

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleaned)) {
    return '';
  }

  return cleaned;
}

/**
 * Sanitize phone number
 * Removes non-digit characters except + and spaces
 */
export function sanitizePhone(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove HTML first
  const cleaned = sanitizeText(input);

  // Keep only digits, +, spaces, hyphens, and parentheses
  return cleaned.replace(/[^0-9+\s\-()]/g, '').trim();
}

/**
 * Sanitize notes/comments
 * Allows basic formatting but removes dangerous content
 */
export function sanitizeNotes(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  }).trim();
}

/**
 * Sanitize product name (for custom pizza names)
 * Strict sanitization - text only
 */
export function sanitizeProductName(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  const cleaned = sanitizeText(input);

  // Limit length to prevent abuse
  return cleaned.slice(0, 100);
}

/**
 * Sanitize address field
 * Removes HTML but preserves special characters for international addresses
 */
export function sanitizeAddress(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  const cleaned = sanitizeText(input);

  // Limit length
  return cleaned.slice(0, 200);
}

/**
 * Sanitize postal code
 * Alphanumeric + spaces and hyphens only
 */
export function sanitizePostalCode(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  const cleaned = sanitizeText(input);

  // Keep only alphanumeric, spaces, and hyphens
  return cleaned.replace(/[^a-zA-Z0-9\s\-]/g, '').trim().slice(0, 20);
}

/**
 * Sanitize city name
 */
export function sanitizeCity(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  const cleaned = sanitizeText(input);

  // Keep only letters, spaces, hyphens, and apostrophes (for names like "L'Aquila")
  return cleaned.replace(/[^a-zA-ZÀ-ÿ\s\-']/g, '').trim().slice(0, 100);
}

/**
 * Sanitize an object with multiple fields
 * Applies appropriate sanitization to each field
 */
export function sanitizeOrderData(data: any): any {
  if (!data || typeof data !== 'object') {
    return {};
  }

  return {
    customerName: data.customerName ? sanitizeText(data.customerName) : '',
    email: data.email ? sanitizeEmail(data.email) : '',
    phone: data.phone ? sanitizePhone(data.phone) : '',
    notes: data.notes ? sanitizeNotes(data.notes) : '',
    deliveryAddress: data.deliveryAddress
      ? {
          street: sanitizeAddress(data.deliveryAddress.street || ''),
          city: sanitizeCity(data.deliveryAddress.city || ''),
          postalCode: sanitizePostalCode(data.deliveryAddress.postalCode || ''),
          country: sanitizeText(data.deliveryAddress.country || ''),
        }
      : undefined,
    // Pass through validated fields without modification
    deliveryType: data.deliveryType,
    items: data.items,
    subtotal: data.subtotal,
    tax: data.tax,
    deliveryFee: data.deliveryFee,
    total: data.total,
    paymentMethod: data.paymentMethod,
    paymentIntentId: data.paymentIntentId,
    timeSlot: data.timeSlot,
    scheduledTime: data.scheduledTime,
    pickupTimeRange: data.pickupTimeRange,
    assignedBy: data.assignedBy,
    isManualAssignment: data.isManualAssignment,
  };
}

/**
 * Sanitize product data (for admin product creation)
 */
export function sanitizeProductData(data: any): any {
  if (!data || typeof data !== 'object') {
    return {};
  }

  return {
    name: sanitizeProductName(data.name || ''),
    description: sanitizeNotes(data.description || ''),
    category: sanitizeText(data.category || ''),
    price: data.price,
    image: sanitizeText(data.image || ''),
    available: data.available,
    vegetarian: data.vegetarian,
    vegan: data.vegan,
    glutenFree: data.glutenFree,
    spicy: data.spicy,
    popular: data.popular,
    ingredients: Array.isArray(data.ingredients)
      ? data.ingredients.map((i: string) => sanitizeText(i))
      : [],
    allergens: Array.isArray(data.allergens)
      ? data.allergens.map((a: string) => sanitizeText(a))
      : [],
  };
}

/**
 * Sanitize review data
 */
export function sanitizeReviewData(data: any): any {
  if (!data || typeof data !== 'object') {
    return {};
  }

  return {
    productId: data.productId, // Keep as-is for validation
    customerName: sanitizeText(data.customerName || ''),
    customerEmail: sanitizeEmail(data.customerEmail || ''),
    rating: data.rating, // Keep as number for validation
    title: sanitizeText(data.title || ''),
    comment: sanitizeNotes(data.comment || ''),
  };
}
