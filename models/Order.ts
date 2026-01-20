import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  customizations: {
    size: String,
    toppings: [String],
    notes: String
  },
  total: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String, required: true },
  email: { type: String },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'online'],
    default: 'cash'
  },
  deliveryType: {
    type: String,
    enum: ['delivery', 'pickup'],
    required: true,
    default: 'pickup'
  },
  deliveryAddress: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  phone: { type: String, required: true },
  notes: String,
  estimatedDelivery: Date,
  notificationSent: { type: Boolean, default: false },
  notificationSentAt: { type: Date },

  // Webhook & Notification Tracking
  webhookEvents: [{
    eventType: { type: String, required: true },
    timestamp: { type: Date, required: true },
    webhookUrl: String,
    success: { type: Boolean, required: true },
    retries: { type: Number, default: 0 },
    error: String
  }],
  notificationChannels: {
    whatsapp: { type: Boolean, default: false },
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false }
  },
  lastNotificationTime: Date,

  // Delivery Tracking
  deliveryStatus: {
    type: String,
    enum: ['not_started', 'assigned', 'driver_en_route', 'at_restaurant', 'picked_up', 'in_transit', 'arrived', 'delivered'],
    default: 'not_started'
  },
  deliveryDriver: {
    id: String,
    name: String,
    phone: String,
    vehicle: String,
    licensePlate: String,
    assignedAt: Date
  },
  estimatedArrivalTime: Date,
  actualDeliveryTime: Date,
  currentLocation: {
    latitude: Number,
    longitude: Number,
    updatedAt: Date
  },

  // Kitchen Display System (KDS)
  kdsStatus: {
    type: String,
    enum: ['pending', 'acknowledged', 'in_progress', 'completed'],
    default: 'pending'
  },
  kdsAcknowledgedAt: Date,
  preparationStartedAt: Date,
  preparationCompletedAt: Date,
  estimatedReadyTime: Date,
  actualPreparationTime: Number, // in minutes

  // Cancellation & Refund
  cancellationReason: String,
  cancelledAt: Date,
  cancelledBy: String,
  refundAmount: Number,
  refundStatus: {
    type: String,
    enum: ['pending', 'processed', 'failed'],
    default: 'pending'
  },
  refundProcessedAt: Date,

  // Time Slot Management
  timeSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'TimeSlot' },
  scheduledTime: { type: Date },
  pickupTimeRange: { type: String },
  assignedBy: {
    type: String,
    enum: ['customer', 'cashier', 'system'],
    default: 'customer'
  },
  isManualAssignment: { type: Boolean, default: false },
}, { timestamps: true });

// Add indexes for frequently queried fields
// PERFORMANCE FIX: Optimized indexes for common query patterns
OrderSchema.index({ status: 1, createdAt: -1 }); // For filtering orders by status and sorting by date
OrderSchema.index({ phone: 1 }); // For customer lookup by phone
OrderSchema.index({ customer: 1, createdAt: -1 }); // For customer order history
// Note: orderId index is automatically created by unique: true constraint on the field
OrderSchema.index({ createdAt: -1 }); // For recent orders (already have timestamps, but explicit)
OrderSchema.index({ timeSlot: 1 }); // For time slot management queries
OrderSchema.index({ timeSlot: 1, status: 1 }); // ADDED: For slot history filtering by status
OrderSchema.index({ scheduledTime: 1 }); // For querying orders by scheduled time
OrderSchema.index({ deliveryStatus: 1 }); // For delivery tracking queries
OrderSchema.index({ kdsStatus: 1 }); // For kitchen display system queries
OrderSchema.index({ 'deliveryDriver.id': 1 }); // For driver assignment queries
OrderSchema.index({ 'webhookEvents.eventType': 1 }); // For webhook event queries

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);