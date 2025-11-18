/**
 * n8n Integration Constants
 * Webhook URLs, endpoints, and configuration
 */

/**
 * n8n webhook paths
 */
export const N8N_WEBHOOK_PATHS = {
  // Order webhooks
  ORDER_CONFIRMATION: 'order-confirmation',
  ORDER_STATUS_UPDATE: 'order-status-update',
  ORDER_CANCELLATION: 'order-cancellation',

  // Delivery webhooks
  DELIVERY_ASSIGNMENT: 'delivery-assignment',
  DELIVERY_STATUS_UPDATE: 'delivery-status',
  DRIVER_LOCATION_UPDATE: 'driver-location',

  // Kitchen webhooks
  KITCHEN_DISPLAY_UPDATE: 'kitchen-display',
  KDS_ACKNOWLEDGEMENT: 'kds-acknowledge',
  PREPARATION_COMPLETE: 'preparation-complete',

  // Notification webhooks
  SEND_NOTIFICATION: 'send-notification',
  BULK_NOTIFICATION: 'bulk-notification',

  // Customer webhooks
  CUSTOMER_FEEDBACK: 'customer-feedback',
  REVIEW_REQUEST: 'review-request',

  // System webhooks
  DAILY_REPORT: 'daily-report',
  INVENTORY_ALERT: 'inventory-alert',
  ERROR_NOTIFICATION: 'error-notification',
} as const;

/**
 * n8n workflow IDs (if using API)
 */
export const N8N_WORKFLOW_IDS = {
  ORDER_PROCESSING: process.env.N8N_WORKFLOW_ORDER_PROCESSING || '',
  DELIVERY_COORDINATION: process.env.N8N_WORKFLOW_DELIVERY || '',
  KITCHEN_MANAGEMENT: process.env.N8N_WORKFLOW_KITCHEN || '',
  CUSTOMER_COMMUNICATION: process.env.N8N_WORKFLOW_CUSTOMER || '',
  REPORTING: process.env.N8N_WORKFLOW_REPORTING || '',
} as const;

/**
 * n8n event types
 */
export const N8N_EVENT_TYPES = {
  // Order events
  ORDER_CREATED: 'order.created',
  ORDER_CONFIRMED: 'order.confirmed',
  ORDER_PREPARING: 'order.preparing',
  ORDER_READY: 'order.ready',
  ORDER_COMPLETED: 'order.completed',
  ORDER_CANCELLED: 'order.cancelled',

  // Payment events
  PAYMENT_RECEIVED: 'payment.received',
  PAYMENT_FAILED: 'payment.failed',
  REFUND_ISSUED: 'refund.issued',

  // Delivery events
  DRIVER_ASSIGNED: 'delivery.driver_assigned',
  DRIVER_EN_ROUTE: 'delivery.driver_en_route',
  DRIVER_AT_RESTAURANT: 'delivery.at_restaurant',
  DRIVER_PICKED_UP: 'delivery.picked_up',
  DRIVER_DELIVERED: 'delivery.delivered',

  // Kitchen events
  KDS_RECEIVED: 'kds.received',
  KDS_ACKNOWLEDGED: 'kds.acknowledged',
  KDS_IN_PROGRESS: 'kds.in_progress',
  KDS_COMPLETED: 'kds.completed',

  // Customer events
  CUSTOMER_REGISTERED: 'customer.registered',
  FEEDBACK_RECEIVED: 'customer.feedback',
  REVIEW_SUBMITTED: 'customer.review',
} as const;

/**
 * Notification templates
 */
export const NOTIFICATION_TEMPLATES = {
  // Order confirmations
  ORDER_CONFIRMATION_FR: `🍕 Commande confirmée!
Votre commande #{orderNumber} a été reçue.
Montant: {total}€
Temps estimé: {estimatedTime}
Merci pour votre commande!`,

  ORDER_CONFIRMATION_EN: `🍕 Order confirmed!
Your order #{orderNumber} has been received.
Amount: €{total}
Estimated time: {estimatedTime}
Thank you for your order!`,

  // Order ready
  ORDER_READY_FR: `🎉 Votre commande est prête!
Commande #{orderNumber} est prête pour {deliveryType}.
{pickupInstructions}`,

  ORDER_READY_EN: `🎉 Your order is ready!
Order #{orderNumber} is ready for {deliveryType}.
{pickupInstructions}`,

  // Delivery updates
  DRIVER_ASSIGNED_FR: `🚗 Livreur assigné!
{driverName} est en route pour récupérer votre commande.
Temps estimé: {estimatedTime}`,

  DRIVER_ASSIGNED_EN: `🚗 Driver assigned!
{driverName} is on the way to pick up your order.
Estimated time: {estimatedTime}`,

  // Order delivered
  ORDER_DELIVERED_FR: `✅ Commande livrée!
Nous espérons que vous apprécierez votre repas.
Bon appétit! 🍕`,

  ORDER_DELIVERED_EN: `✅ Order delivered!
We hope you enjoy your meal.
Bon appétit! 🍕`,
} as const;

/**
 * WhatsApp message types for different scenarios
 */
export const WHATSAPP_MESSAGE_TYPES = {
  TEXT: 'text',
  TEMPLATE: 'template',
  INTERACTIVE: 'interactive',
  LOCATION: 'location',
  IMAGE: 'image',
} as const;

/**
 * Default configuration values
 */
export const N8N_DEFAULTS = {
  RETRY_ATTEMPTS: 5,
  RETRY_DELAY_MS: 1000,
  TIMEOUT_MS: 30000,
  MAX_PAYLOAD_SIZE: 1048576, // 1MB
  WEBHOOK_VERSION: '1.0',
  BATCH_SIZE: 100,
  RATE_LIMIT_PER_MINUTE: 100,
} as const;

/**
 * Error codes
 */
export const N8N_ERROR_CODES = {
  WEBHOOK_FAILED: 'N8N_WEBHOOK_FAILED',
  WORKFLOW_NOT_FOUND: 'N8N_WORKFLOW_NOT_FOUND',
  AUTHENTICATION_FAILED: 'N8N_AUTH_FAILED',
  RATE_LIMIT_EXCEEDED: 'N8N_RATE_LIMIT',
  INVALID_PAYLOAD: 'N8N_INVALID_PAYLOAD',
  TIMEOUT: 'N8N_TIMEOUT',
  CONNECTION_FAILED: 'N8N_CONNECTION_FAILED',
} as const;

/**
 * Status mappings between Pizza Falchi and n8n
 */
export const STATUS_MAPPING = {
  PIZZA_TO_N8N: {
    'pending': 'new',
    'confirmed': 'accepted',
    'preparing': 'in_preparation',
    'ready': 'ready_for_delivery',
    'in_delivery': 'out_for_delivery',
    'completed': 'delivered',
    'cancelled': 'cancelled',
  },
  N8N_TO_PIZZA: {
    'new': 'pending',
    'accepted': 'confirmed',
    'in_preparation': 'preparing',
    'ready_for_delivery': 'ready',
    'out_for_delivery': 'in_delivery',
    'delivered': 'completed',
    'cancelled': 'cancelled',
  },
} as const;

/**
 * Helper function to get n8n webhook URL
 */
export function getN8nWebhookUrl(path: string): string {
  const baseUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook';
  return `${baseUrl}/${path}`;
}

/**
 * Helper function to format notification message
 */
export function formatNotificationMessage(
  template: string,
  variables: Record<string, any>
): string {
  let message = template;

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{${key}}`, 'g');
    message = message.replace(regex, String(value));
  });

  return message;
}