import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  order?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  verified: boolean; // True if linked to a real order
  status: 'pending' | 'approved' | 'rejected';
  helpfulCount: number;
  images?: string[]; // Optional review images
  adminResponse?: {
    message: string;
    respondedBy: mongoose.Types.ObjectId;
    respondedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    helpfulCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    images: [{
      type: String,
    }],
    adminResponse: {
      message: String,
      respondedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      respondedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
ReviewSchema.index({ product: 1, status: 1 });
ReviewSchema.index({ product: 1, rating: -1 });
ReviewSchema.index({ customerEmail: 1, product: 1 });
ReviewSchema.index({ status: 1, createdAt: -1 });

// Virtual to check if review is from verified purchase
ReviewSchema.virtual('isVerifiedPurchase').get(function() {
  return this.verified && this.order != null;
});

// Method to calculate average rating for a product
ReviewSchema.statics.getProductRating = async function(productId: string) {
  const result = await this.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        status: 'approved',
      },
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratings: {
          $push: '$rating',
        },
      },
    },
    {
      $project: {
        averageRating: { $round: ['$averageRating', 1] },
        totalReviews: 1,
        distribution: {
          5: {
            $size: {
              $filter: {
                input: '$ratings',
                cond: { $eq: ['$$this', 5] },
              },
            },
          },
          4: {
            $size: {
              $filter: {
                input: '$ratings',
                cond: { $eq: ['$$this', 4] },
              },
            },
          },
          3: {
            $size: {
              $filter: {
                input: '$ratings',
                cond: { $eq: ['$$this', 3] },
              },
            },
          },
          2: {
            $size: {
              $filter: {
                input: '$ratings',
                cond: { $eq: ['$$this', 2] },
              },
            },
          },
          1: {
            $size: {
              $filter: {
                input: '$ratings',
                cond: { $eq: ['$$this', 1] },
              },
            },
          },
        },
      },
    },
  ]);

  return result.length > 0
    ? result[0]
    : {
        averageRating: 0,
        totalReviews: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
};

// Method to check if user can review product
ReviewSchema.statics.canUserReview = async function(
  productId: string,
  customerEmail: string
) {
  // Check if user already reviewed this product
  const existingReview = await this.findOne({
    product: productId,
    customerEmail: customerEmail.toLowerCase(),
  });

  if (existingReview) {
    return {
      canReview: false,
      reason: 'Vous avez déjà laissé un avis pour ce produit',
    };
  }

  // Check if user has ordered this product
  const Order = mongoose.model('Order');
  const order = await Order.findOne({
    email: customerEmail.toLowerCase(),
    'items.product': productId,
    status: { $in: ['completed', 'ready'] },
  });

  return {
    canReview: true,
    verified: !!order,
    orderId: order?._id,
  };
};

// Ensure user can only review once per product
ReviewSchema.index({ product: 1, customerEmail: 1 }, { unique: true });

interface IReviewModel extends mongoose.Model<IReview> {
  getProductReviews(
    productId: string,
    options?: { status?: string; limit?: number; skip?: number; sort?: any }
  ): Promise<IReview[]>;
  getProductRating(productId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    distribution: { 5: number; 4: number; 3: number; 2: number; 1: number };
  }>;
  canUserReview(
    productId: string,
    customerEmail: string
  ): Promise<{
    canReview: boolean;
    reason?: string;
    verified?: boolean;
    orderId?: mongoose.Types.ObjectId;
  }>;
}

export default (mongoose.models.Review ||
  mongoose.model<IReview, IReviewModel>(
    'Review',
    ReviewSchema
  )) as IReviewModel;
