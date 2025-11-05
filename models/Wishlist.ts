import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlistItem {
  product: mongoose.Types.ObjectId;
  addedAt: Date;
}

export interface IWishlist extends Document {
  user?: mongoose.Types.ObjectId;
  email: string;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
  addProduct(productId: string): Promise<IWishlist>;
  removeProduct(productId: string): Promise<IWishlist>;
  clear(): Promise<IWishlist>;
}

const WishlistItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const WishlistSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    items: [WishlistItemSchema],
  },
  {
    timestamps: true,
  }
);

// Ensure one wishlist per email
WishlistSchema.index({ email: 1 }, { unique: true });

// Method to add product to wishlist
WishlistSchema.methods.addProduct = function(productId: string) {
  const exists = this.items.some(
    (item: IWishlistItem) => item.product.toString() === productId
  );

  if (!exists) {
    this.items.push({
      product: productId,
      addedAt: new Date(),
    });
  }

  return this.save();
};

// Method to remove product from wishlist
WishlistSchema.methods.removeProduct = function(productId: string) {
  this.items = this.items.filter(
    (item: IWishlistItem) => item.product.toString() !== productId
  );

  return this.save();
};

// Method to check if product is in wishlist
WishlistSchema.methods.hasProduct = function(productId: string): boolean {
  return this.items.some(
    (item: IWishlistItem) => item.product.toString() === productId
  );
};

// Method to clear wishlist
WishlistSchema.methods.clear = function() {
  this.items = [];
  return this.save();
};

// Static method to get or create wishlist for email
WishlistSchema.statics.getOrCreate = async function(
  email: string,
  userId?: string
) {
  let wishlist = await this.findOne({ email: email.toLowerCase() });

  if (!wishlist) {
    wishlist = await this.create({
      email: email.toLowerCase(),
      user: userId,
      items: [],
    });
  } else if (userId && !wishlist.user) {
    // Associate user if logging in
    wishlist.user = userId;
    await wishlist.save();
  }

  return wishlist;
};

interface IWishlistModel extends mongoose.Model<IWishlist> {
  getOrCreate(email: string, userId?: string): Promise<IWishlist>;
}

export default (mongoose.models.Wishlist ||
  mongoose.model<IWishlist, IWishlistModel>(
    'Wishlist',
    WishlistSchema
  )) as IWishlistModel;
