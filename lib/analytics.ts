/**
 * Analytics Utility
 * Tracks user interactions and events for monitoring user behavior
 * Can be integrated with Google Analytics, Plausible, or other analytics services
 */

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Track a custom event
 */
export function trackEvent({
  category,
  action,
  label,
  value,
  metadata,
}: AnalyticsEvent): void {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', {
      category,
      action,
      label,
      value,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }

  // Send to analytics service in production
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        ...metadata,
      });
    }

    // Plausible Analytics
    if (window.plausible) {
      window.plausible(action, {
        props: {
          category,
          label,
          value,
          ...metadata,
        },
      });
    }

    // Custom analytics endpoint
    // Uncomment and configure if using a custom analytics service
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ category, action, label, value, metadata }),
    // }).catch(console.error);
  }
}

/**
 * Track page view
 */
export function trackPageView(path: string, title?: string): void {
  trackEvent({
    category: 'Navigation',
    action: 'page_view',
    label: path,
    metadata: { title },
  });
}

/**
 * Track product interactions
 */
export const productAnalytics = {
  viewProduct: (productId: string, productName: string, category: string) => {
    trackEvent({
      category: 'Product',
      action: 'view_product',
      label: productName,
      metadata: { productId, category },
    });
  },

  addToCart: (
    productId: string,
    productName: string,
    price: number,
    quantity: number
  ) => {
    trackEvent({
      category: 'E-commerce',
      action: 'add_to_cart',
      label: productName,
      value: price * quantity,
      metadata: { productId, quantity, price },
    });
  },

  removeFromCart: (productId: string, productName: string) => {
    trackEvent({
      category: 'E-commerce',
      action: 'remove_from_cart',
      label: productName,
      metadata: { productId },
    });
  },
};

/**
 * Track checkout interactions
 */
export const checkoutAnalytics = {
  beginCheckout: (cartTotal: number, itemCount: number) => {
    trackEvent({
      category: 'E-commerce',
      action: 'begin_checkout',
      value: cartTotal,
      metadata: { itemCount },
    });
  },

  addPaymentInfo: (paymentMethod: string) => {
    trackEvent({
      category: 'E-commerce',
      action: 'add_payment_info',
      label: paymentMethod,
    });
  },

  purchase: (orderId: string, total: number, itemCount: number) => {
    trackEvent({
      category: 'E-commerce',
      action: 'purchase',
      label: orderId,
      value: total,
      metadata: { itemCount },
    });
  },
};

/**
 * Track search interactions
 */
export const searchAnalytics = {
  search: (searchTerm: string, resultsCount: number) => {
    trackEvent({
      category: 'Search',
      action: 'search',
      label: searchTerm,
      value: resultsCount,
    });
  },

  filterApplied: (filterType: string, filterValue: string) => {
    trackEvent({
      category: 'Search',
      action: 'filter_applied',
      label: `${filterType}:${filterValue}`,
    });
  },
};

/**
 * Track user interactions
 */
export const interactionAnalytics = {
  clickButton: (buttonLabel: string, location: string) => {
    trackEvent({
      category: 'Interaction',
      action: 'button_click',
      label: buttonLabel,
      metadata: { location },
    });
  },

  clickLink: (linkLabel: string, destination: string) => {
    trackEvent({
      category: 'Interaction',
      action: 'link_click',
      label: linkLabel,
      metadata: { destination },
    });
  },

  openModal: (modalName: string) => {
    trackEvent({
      category: 'Interaction',
      action: 'open_modal',
      label: modalName,
    });
  },

  closeModal: (modalName: string, timeSpent?: number) => {
    trackEvent({
      category: 'Interaction',
      action: 'close_modal',
      label: modalName,
      value: timeSpent,
    });
  },

  phoneCall: (location: string, phoneNumber: string) => {
    trackEvent({
      category: 'Contact',
      action: 'phone_call',
      label: location,
      metadata: { phoneNumber },
    });
  },
};

/**
 * Track errors
 */
export const errorAnalytics = {
  jsError: (errorMessage: string, errorStack?: string) => {
    trackEvent({
      category: 'Error',
      action: 'javascript_error',
      label: errorMessage,
      metadata: { stack: errorStack },
    });
  },

  apiError: (endpoint: string, statusCode: number, errorMessage: string) => {
    trackEvent({
      category: 'Error',
      action: 'api_error',
      label: endpoint,
      value: statusCode,
      metadata: { message: errorMessage },
    });
  },
};

// Type declarations for analytics libraries
declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, unknown> }
    ) => void;
  }
}
