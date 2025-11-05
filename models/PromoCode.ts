import mongoose, { Schema, Document } from 'mongoose';

export interface IPromoCode extends Document {
  code: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number; // Percentage (e.g., 20 for 20%) or fixed amount (e.g., 5 for 5€)
  minOrderAmount?: number; // Minimum order amount to apply promo
  maxDiscount?: number; // Maximum discount amount for percentage promos
  usageLimit?: number; // Total number of times this promo can be used
  usageCount: number; // Number of times this promo has been used
  usagePerCustomer?: number; // Max uses per customer (email-based)
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  applicableCategories?: string[]; // Empty = all categories
  excludedProducts?: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PromoCodeSchema: Schema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed', 'free_shipping'],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    minOrderAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
    maxDiscount: {
      type: Number,
      min: 0,
    },
    usageLimit: {
      type: Number,
      min: 1,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    usagePerCustomer: {
      type: Number,
      min: 1,
      default: 1,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    applicableCategories: [{
      type: String,
      enum: ['pizza', 'boisson', 'dessert', 'accompagnement'],
    }],
    excludedProducts: [{
      type: Schema.Types.ObjectId,
      ref: 'Product',
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast lookups
PromoCodeSchema.index({ code: 1, isActive: 1 });
PromoCodeSchema.index({ validFrom: 1, validUntil: 1 });

// Virtual to check if promo is currently valid
PromoCodeSchema.virtual('isCurrentlyValid').get(function(this: IPromoCode) {
  const now = new Date();
  return (
    this.isActive &&
    this.validFrom <= now &&
    this.validUntil >= now &&
    (this.usageLimit === undefined || this.usageCount < this.usageLimit)
  );
});

// Method to check if promo can be used by customer
PromoCodeSchema.methods.canBeUsedBy = async function(customerEmail: string) {
  if (!this.isCurrentlyValid) {
    return { valid: false, message: 'Code promo invalide ou expiré' };
  }

  // Check usage limit per customer
  if (this.usagePerCustomer && customerEmail) {
    const Order = mongoose.model('Order');
    const customerUsageCount = await Order.countDocuments({
      email: customerEmail,
      'promoCode.code': this.code,
    });

    if (customerUsageCount >= this.usagePerCustomer) {
      return {
        valid: false,
        message: `Ce code a déjà été utilisé le maximum de fois autorisé`,
      };
    }
  }

  return { valid: true };
};

// Method to calculate discount
PromoCodeSchema.methods.calculateDiscount = function(
  subtotal: number,
  items: any[]
) {
  // Check minimum order amount
  if (this.minOrderAmount && subtotal < this.minOrderAmount) {
    return {
      valid: false,
      discount: 0,
      message: `Montant minimum de commande: ${this.minOrderAmount}€`,
    };
  }

  // Filter items based on applicable categories and excluded products
  let applicableSubtotal = subtotal;

  if (this.applicableCategories && this.applicableCategories.length > 0) {
    applicableSubtotal = items
      .filter(item =>
        this.applicableCategories.includes(item.product.category) &&
        !this.excludedProducts?.some((id: any) => id.equals(item.product._id))
      )
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  } else if (this.excludedProducts && this.excludedProducts.length > 0) {
    applicableSubtotal = items
      .filter(item =>
        !this.excludedProducts.some((id: any) => id.equals(item.product._id))
      )
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  let discount = 0;

  switch (this.type) {
    case 'percentage':
      discount = (applicableSubtotal * this.value) / 100;
      // Apply max discount limit if specified
      if (this.maxDiscount && discount > this.maxDiscount) {
        discount = this.maxDiscount;
      }
      break;

    case 'fixed':
      discount = Math.min(this.value, applicableSubtotal);
      break;

    case 'free_shipping':
      // Free shipping discount would be calculated at checkout
      // based on actual shipping cost
      discount = 0; // Handled separately in checkout
      break;
  }

  return {
    valid: true,
    discount: Math.round(discount * 100) / 100, // Round to 2 decimals
    applicableSubtotal,
  };
};

// Method to increment usage count
PromoCodeSchema.methods.incrementUsage = async function() {
  this.usageCount += 1;
  await this.save();
};

export default mongoose.models.PromoCode || mongoose.model<IPromoCode>('PromoCode', PromoCodeSchema);
