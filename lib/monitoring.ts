/**
 * Error Monitoring and Logging Utilities
 *
 * Centralized error tracking with Sentry integration
 * Provides context-aware error reporting for better debugging
 */

import * as Sentry from '@sentry/nextjs';
import type { TimeSlot, Product } from '@/types';

/**
 * Capture phone order error with relevant context
 *
 * @param error - The error object
 * @param context - Additional context about the phone order
 *
 * @example
 * ```tsx
 * try {
 *   await submitOrder(orderData);
 * } catch (error) {
 *   capturePhoneOrderError(error, {
 *     step: 'submit',
 *     slot: selectedSlot,
 *     pizzaCount: 3,
 *     orderData: { customerName: 'Jean Dupont' }
 *   });
 * }
 * ```
 */
export function capturePhoneOrderError(
  error: unknown,
  context?: {
    step?: 'customer' | 'pizzas' | 'drinks' | 'confirm' | 'submit';
    slot?: TimeSlot;
    pizzaCount?: number;
    orderData?: Record<string, unknown>;
  }
) {
  Sentry.captureException(error, {
    tags: {
      feature: 'phone-orders',
      step: context?.step || 'unknown',
    },
    contexts: {
      phoneOrder: {
        step: context?.step,
        slotId: context?.slot?._id,
        slotDate: context?.slot?.date,
        slotTime: context?.slot ? `${context.slot.startTime}-${context.slot.endTime}` : undefined,
        slotCapacity: context?.slot?.capacity,
        slotPizzaCount: context?.slot?.pizzaCount,
        pizzaCount: context?.pizzaCount,
      },
      orderData: context?.orderData,
    },
  });
}

/**
 * Capture time slot operation error
 *
 * @param error - The error object
 * @param operation - The operation being performed
 * @param slot - The time slot involved
 *
 * @example
 * ```tsx
 * try {
 *   await updateSlot(slotId, { status: 'full' });
 * } catch (error) {
 *   captureTimeSlotError(error, 'update', slot);
 * }
 * ```
 */
export function captureTimeSlotError(
  error: unknown,
  operation: 'create' | 'update' | 'delete' | 'fetch',
  slot?: TimeSlot
) {
  Sentry.captureException(error, {
    tags: {
      feature: 'time-slots',
      operation,
    },
    contexts: {
      timeSlot: {
        id: slot?._id,
        date: slot?.date,
        startTime: slot?.startTime,
        endTime: slot?.endTime,
        capacity: slot?.capacity,
        currentOrders: slot?.currentOrders,
        pizzaCount: slot?.pizzaCount,
        status: slot?.status,
      },
    },
  });
}

/**
 * Capture product-related error
 *
 * @param error - The error object
 * @param operation - The operation being performed
 * @param product - The product involved
 *
 * @example
 * ```tsx
 * try {
 *   await addToCart(product);
 * } catch (error) {
 *   captureProductError(error, 'add-to-cart', product);
 * }
 * ```
 */
export function captureProductError(
  error: unknown,
  operation: 'add-to-cart' | 'remove-from-cart' | 'fetch' | 'update',
  product?: Product
) {
  Sentry.captureException(error, {
    tags: {
      feature: 'products',
      operation,
      productCategory: product?.category,
    },
    contexts: {
      product: {
        id: product?._id,
        name: product?.name,
        category: product?.category,
        price: product?.price,
        available: product?.available,
      },
    },
  });
}

/**
 * Add user context to Sentry for better error tracking
 *
 * Should be called after user authentication
 *
 * @param user - User information
 *
 * @example
 * ```tsx
 * useEffect(() => {
 *   if (session?.user) {
 *     setUserContext({
 *       id: session.user.id,
 *       email: session.user.email,
 *       role: session.user.role,
 *     });
 *   }
 * }, [session]);
 * ```
 */
export function setUserContext(user: {
  id?: string;
  email?: string;
  role?: string;
  name?: string;
}) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    role: user.role,
    username: user.name,
  });
}

/**
 * Clear user context (e.g., on logout)
 *
 * @example
 * ```tsx
 * function handleLogout() {
 *   // ... logout logic
 *   clearUserContext();
 * }
 * ```
 */
export function clearUserContext() {
  Sentry.setUser(null);
}

/**
 * Add breadcrumb for better error context tracking
 *
 * @param message - Breadcrumb message
 * @param category - Category for grouping
 * @param data - Additional data
 *
 * @example
 * ```tsx
 * addBreadcrumb('User selected time slot', 'navigation', {
 *   slotId: '123',
 *   slotTime: '12:00-12:30',
 * });
 * ```
 */
export function addBreadcrumb(
  message: string,
  category: string,
  data?: Record<string, unknown>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Capture API error with request details
 *
 * @param error - The error object
 * @param endpoint - API endpoint
 * @param method - HTTP method
 * @param statusCode - Response status code
 *
 * @example
 * ```tsx
 * try {
 *   const response = await fetch('/api/orders', { method: 'POST' });
 *   if (!response.ok) {
 *     captureAPIError(
 *       new Error('Order creation failed'),
 *       '/api/orders',
 *       'POST',
 *       response.status
 *     );
 *   }
 * } catch (error) {
 *   captureAPIError(error, '/api/orders', 'POST');
 * }
 * ```
 */
export function captureAPIError(
  error: unknown,
  endpoint: string,
  method: string,
  statusCode?: number
) {
  Sentry.captureException(error, {
    tags: {
      feature: 'api',
      endpoint,
      method,
      statusCode: statusCode?.toString(),
    },
    contexts: {
      api: {
        endpoint,
        method,
        statusCode,
      },
    },
  });
}

/**
 * Log performance measurement to Sentry
 *
 * @param name - Measurement name
 * @param duration - Duration in milliseconds
 * @param data - Additional data
 *
 * @example
 * ```tsx
 * const startTime = performance.now();
 * await fetchSlots();
 * logPerformance('fetchSlots', performance.now() - startTime, {
 *   slotCount: slots.length,
 * });
 * ```
 */
export function logPerformance(
  name: string,
  duration: number,
  data?: Record<string, unknown>
) {
  Sentry.addBreadcrumb({
    category: 'performance',
    message: `${name}: ${duration.toFixed(2)}ms`,
    data: {
      duration,
      ...data,
    },
    level: duration > 1000 ? 'warning' : 'info',
  });

  // Also send as custom event for performance monitoring
  if (duration > 2000) {
    Sentry.captureMessage(`Slow operation: ${name}`, {
      level: 'warning',
      tags: {
        feature: 'performance',
        operation: name,
      },
      contexts: {
        performance: {
          duration,
          ...data,
        },
      },
    });
  }
}
