import mongoose, { Schema, Document, Model } from 'mongoose';
// Import Order model to ensure it's registered before TimeSlot uses it in populate
import './Order';

/**
 * TimeSlot Interface
 * Represents a 10-minute time slot for order scheduling
 */
export interface ITimeSlot extends Document {
  date: Date;
  startTime: string; // Format: "HH:MM" (e.g., "18:00")
  endTime: string; // Format: "HH:MM" (e.g., "18:10")
  capacity: number; // Maximum pizzas per slot (default: 4 - oven capacity)
  currentOrders: number; // Number of currently assigned orders
  pizzaCount: number; // Total number of pizzas in this slot (CRITICAL for oven capacity)
  orders: mongoose.Types.ObjectId[]; // References to Order documents
  isAvailable: boolean; // Computed: pizzaCount < capacity
  status: 'active' | 'full' | 'closed';
  createdAt: Date;
  updatedAt: Date;

  // Virtual properties
  timeRange: string; // Full time range as string (e.g., "18:00 - 18:10")
  remainingCapacity: number; // Remaining pizza capacity
  remainingPizzas: number; // Remaining pizzas (capacity - pizzaCount)

  // Instance methods
  canAcceptOrder(pizzaCount: number): boolean;
  addOrder(orderId: mongoose.Types.ObjectId | string, pizzaCount: number): Promise<ITimeSlot>;
  removeOrder(orderId: mongoose.Types.ObjectId | string, pizzaCount: number): Promise<ITimeSlot>;
  calculatePizzaCount(): Promise<number>;
}

/**
 * TimeSlot Model Interface
 * Includes static methods
 */
export interface ITimeSlotModel extends Model<ITimeSlot> {
  findAvailableSlots(date: Date): Promise<ITimeSlot[]>;
  findNextAvailable(fromDate?: Date): Promise<ITimeSlot | null>;
  getSlotsByDateRange(startDate: Date, endDate: Date): Promise<ITimeSlot[]>;
}

/**
 * TimeSlot Schema
 */
const TimeSlotSchema = new Schema<ITimeSlot>(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true,
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (use HH:MM)'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (use HH:MM)'],
    },
    capacity: {
      type: Number,
      required: true,
      default: 4, // 4 pizzas max per 10-minute slot (oven capacity)
      min: [1, 'Capacity must be at least 1'],
      max: [10, 'Capacity cannot exceed 10'],
    },
    currentOrders: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Current orders cannot be negative'],
    },
    pizzaCount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Pizza count cannot be negative'],
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'full', 'closed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes for optimized queries
 */
// Compound index for finding slots by date and time
TimeSlotSchema.index({ date: 1, startTime: 1 });

// Index for finding available slots
TimeSlotSchema.index({ date: 1, isAvailable: 1, status: 1 });

// Index for status queries
TimeSlotSchema.index({ status: 1 });

/**
 * Pre-save middleware to compute isAvailable and update status
 */
TimeSlotSchema.pre('save', function (next) {
  // Compute isAvailable based on pizza count (not order count!)
  this.isAvailable = this.pizzaCount < this.capacity;

  // Auto-update status based on pizza availability
  if (this.status !== 'closed') {
    this.status = this.isAvailable ? 'active' : 'full';
  }

  // Ensure currentOrders matches orders array length
  if (this.orders && this.orders.length !== this.currentOrders) {
    this.currentOrders = this.orders.length;
  }

  next();
});

/**
 * Instance Methods
 */

/**
 * @deprecated PERFORMANCE: This method causes N+1 queries. Use the `pizzaCount` field instead.
 * This method is kept only for data reconciliation purposes.
 *
 * Calculate total pizza count from all orders in this slot by querying the database.
 * WARNING: This is expensive and should NEVER be used in regular code paths.
 */
TimeSlotSchema.methods.calculatePizzaCount = async function (): Promise<number> {
  console.warn(
    '⚠️  DEPRECATED: calculatePizzaCount() causes N+1 queries. ' +
    'Use the pizzaCount field instead. This method should only be used for data reconciliation.'
  );

  // Populate orders if not already populated
  if (!this.populated('orders')) {
    await this.populate('orders');
  }

  // Sum up all pizza quantities from all orders
  const total = this.orders.reduce((sum: number, order: any) => {
    if (!order.items) return sum;

    // Count only items where product category is 'pizza'
    const pizzasInOrder = order.items
      .filter((item: any) => item.product?.category === 'pizza')
      .reduce((orderSum: number, item: any) => orderSum + item.quantity, 0);

    return sum + pizzasInOrder;
  }, 0);

  return total;
};

// Check if slot can accept a new order with N pizzas
TimeSlotSchema.methods.canAcceptOrder = function (pizzaCount: number): boolean {
  const wouldExceedCapacity = this.pizzaCount + pizzaCount > this.capacity;
  return this.status === 'active' && !wouldExceedCapacity;
};

// Add an order to the slot
TimeSlotSchema.methods.addOrder = async function (
  orderId: mongoose.Types.ObjectId,
  pizzaCount: number
): Promise<ITimeSlot> {
  if (!this.canAcceptOrder(pizzaCount)) {
    throw new Error(`Time slot cannot accept ${pizzaCount} more pizza(s). Current: ${this.pizzaCount}/${this.capacity}`);
  }

  this.orders.push(orderId);
  this.currentOrders += 1;
  this.pizzaCount += pizzaCount;

  return await this.save();
};

// Remove an order from the slot
TimeSlotSchema.methods.removeOrder = async function (
  orderId: mongoose.Types.ObjectId,
  pizzaCount: number
): Promise<ITimeSlot> {
  const orderIndex = this.orders.findIndex((id: mongoose.Types.ObjectId) => id.equals(orderId));

  if (orderIndex === -1) {
    throw new Error('Order not found in this time slot');
  }

  this.orders.splice(orderIndex, 1);
  this.currentOrders -= 1;
  this.pizzaCount -= pizzaCount;

  return await this.save();
};

/**
 * Static Methods
 */

// Find available slots for a given date
TimeSlotSchema.statics.findAvailableSlots = async function (
  date: Date
): Promise<ITimeSlot[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await this.find({
    date: { $gte: startOfDay, $lte: endOfDay },
    isAvailable: true,
    status: 'active',
  }).sort({ startTime: 1 });
};

// Find next available slot from a given date/time
TimeSlotSchema.statics.findNextAvailable = async function (
  fromDate: Date = new Date()
): Promise<ITimeSlot | null> {
  return await this.findOne({
    date: { $gte: fromDate },
    isAvailable: true,
    status: 'active',
  })
    .sort({ date: 1, startTime: 1 })
    .exec();
};

// Get slots by date range
TimeSlotSchema.statics.getSlotsByDateRange = async function (
  startDate: Date,
  endDate: Date
): Promise<ITimeSlot[]> {
  return await this.find({
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: 1, startTime: 1 });
};

/**
 * Virtual Properties
 */

// Full time range as string (e.g., "18:00 - 18:10")
TimeSlotSchema.virtual('timeRange').get(function () {
  return `${this.startTime} - ${this.endTime}`;
});

// Remaining pizza capacity
TimeSlotSchema.virtual('remainingCapacity').get(function () {
  return this.capacity - this.pizzaCount;
});

// Remaining pizzas (same as remainingCapacity, for clarity)
TimeSlotSchema.virtual('remainingPizzas').get(function () {
  return this.capacity - this.pizzaCount;
});

/**
 * Export Model
 */
const TimeSlot: ITimeSlotModel =
  (mongoose.models.TimeSlot as ITimeSlotModel) ||
  mongoose.model<ITimeSlot, ITimeSlotModel>('TimeSlot', TimeSlotSchema);

export default TimeSlot;
