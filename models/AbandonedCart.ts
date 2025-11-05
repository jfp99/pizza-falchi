import mongoose, { Document, Schema } from 'mongoose';

export interface IAbandonedCartItem {
  product: mongoose.Types.ObjectId;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
}

export interface IAbandonedCart extends Document {
  email: string;
  customerName?: string;
  items: IAbandonedCartItem[];
  totalValue: number;
  status: 'pending' | 'reminded' | 'converted' | 'expired';
  reminderSentAt?: Date;
  convertedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AbandonedCartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productImage: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const AbandonedCartSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    customerName: {
      type: String,
      trim: true,
    },
    items: [AbandonedCartItemSchema],
    totalValue: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'reminded', 'converted', 'expired'],
      default: 'pending',
    },
    reminderSentAt: Date,
    convertedAt: Date,
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
AbandonedCartSchema.index({ email: 1 });
AbandonedCartSchema.index({ status: 1, createdAt: -1 });
AbandonedCartSchema.index({ expiresAt: 1 });

// Static method to save or update abandoned cart
AbandonedCartSchema.statics.saveCart = async function (
  email: string,
  items: IAbandonedCartItem[],
  customerName?: string
) {
  // Calculate total value
  const totalValue = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Check if there's an existing pending cart for this email
  const existingCart = await this.findOne({
    email: email.toLowerCase(),
    status: 'pending',
  });

  if (existingCart) {
    // Update existing cart
    existingCart.items = items;
    existingCart.totalValue = totalValue;
    existingCart.customerName = customerName || existingCart.customerName;
    existingCart.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await existingCart.save();
    return existingCart;
  }

  // Create new abandoned cart
  const cart = await this.create({
    email: email.toLowerCase(),
    customerName,
    items,
    totalValue,
    status: 'pending',
  });

  return cart;
};

// Static method to get carts that need reminders
AbandonedCartSchema.statics.getCartsForReminder = async function (
  hoursAfterAbandonment: number = 24
) {
  const cutoffTime = new Date(Date.now() - hoursAfterAbandonment * 60 * 60 * 1000);

  return this.find({
    status: 'pending',
    createdAt: { $lte: cutoffTime },
    expiresAt: { $gt: new Date() },
  })
    .populate('items.product')
    .sort({ createdAt: 1 });
};

// Static method to mark cart as reminded
AbandonedCartSchema.statics.markAsReminded = async function (cartId: string) {
  return this.findByIdAndUpdate(
    cartId,
    {
      status: 'reminded',
      reminderSentAt: new Date(),
    },
    { new: true }
  );
};

// Static method to mark cart as converted
AbandonedCartSchema.statics.markAsConverted = async function (email: string) {
  return this.updateMany(
    {
      email: email.toLowerCase(),
      status: { $in: ['pending', 'reminded'] },
    },
    {
      status: 'converted',
      convertedAt: new Date(),
    }
  );
};

// Static method to expire old carts
AbandonedCartSchema.statics.expireOldCarts = async function () {
  return this.updateMany(
    {
      status: { $in: ['pending', 'reminded'] },
      expiresAt: { $lte: new Date() },
    },
    {
      status: 'expired',
    }
  );
};

// Static method to get stats
AbandonedCartSchema.statics.getStats = async function () {
  const total = await this.countDocuments();
  const pending = await this.countDocuments({ status: 'pending' });
  const reminded = await this.countDocuments({ status: 'reminded' });
  const converted = await this.countDocuments({ status: 'converted' });
  const expired = await this.countDocuments({ status: 'expired' });

  const conversionRate =
    converted + expired > 0 ? (converted / (converted + expired)) * 100 : 0;

  const totalValue = await this.aggregate([
    { $match: { status: { $in: ['pending', 'reminded'] } } },
    { $group: { _id: null, total: { $sum: '$totalValue' } } },
  ]);

  return {
    total,
    pending,
    reminded,
    converted,
    expired,
    conversionRate: Math.round(conversionRate * 10) / 10,
    totalValue: totalValue.length > 0 ? totalValue[0].total : 0,
  };
};

interface IAbandonedCartModel extends mongoose.Model<IAbandonedCart> {
  saveCart(
    email: string,
    items: IAbandonedCartItem[],
    customerName?: string
  ): Promise<IAbandonedCart>;
  getCartsForReminder(hoursAfterAbandonment?: number): Promise<IAbandonedCart[]>;
  markAsReminded(cartId: string): Promise<IAbandonedCart | null>;
  markAsConverted(email: string): Promise<any>;
  expireOldCarts(): Promise<any>;
  getStats(): Promise<{
    total: number;
    pending: number;
    reminded: number;
    converted: number;
    expired: number;
    conversionRate: number;
    totalValue: number;
  }>;
}

export default (mongoose.models.AbandonedCart ||
  mongoose.model<IAbandonedCart, IAbandonedCartModel>(
    'AbandonedCart',
    AbandonedCartSchema
  )) as IAbandonedCartModel;
