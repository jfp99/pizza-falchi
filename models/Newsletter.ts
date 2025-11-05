import mongoose, { Document, Schema, Model } from 'mongoose';

export interface INewsletterSubscriber extends Document {
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed';
  source: string; // 'footer', 'checkout', 'popup', etc.
  subscribedAt: Date;
  unsubscribedAt?: Date;
  tags: string[]; // For segmentation (e.g., 'customer', 'prospect')
  preferences: {
    promotions: boolean;
    newProducts: boolean;
    events: boolean;
  };
}

const NewsletterSubscriberSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    name: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'unsubscribed'],
      default: 'active',
    },
    source: {
      type: String,
      required: true,
      default: 'footer',
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
    },
    tags: [
      {
        type: String,
      },
    ],
    preferences: {
      promotions: {
        type: Boolean,
        default: true,
      },
      newProducts: {
        type: Boolean,
        default: true,
      },
      events: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
NewsletterSubscriberSchema.index({ email: 1 });
NewsletterSubscriberSchema.index({ status: 1 });
NewsletterSubscriberSchema.index({ subscribedAt: -1 });

// Static method to subscribe or resubscribe
NewsletterSubscriberSchema.statics.subscribe = async function (
  email: string,
  name?: string,
  source: string = 'footer',
  tags: string[] = []
) {
  const existingSubscriber = await this.findOne({
    email: email.toLowerCase()
  });

  if (existingSubscriber) {
    // Reactivate if previously unsubscribed
    if (existingSubscriber.status === 'unsubscribed') {
      existingSubscriber.status = 'active';
      existingSubscriber.subscribedAt = new Date();
      existingSubscriber.unsubscribedAt = undefined;
      if (name) existingSubscriber.name = name;
      if (tags.length > 0) {
        existingSubscriber.tags = [
          ...new Set([...existingSubscriber.tags, ...tags]),
        ];
      }
      await existingSubscriber.save();
      return { subscriber: existingSubscriber, isNew: false };
    }
    // Already subscribed
    return { subscriber: existingSubscriber, isNew: false };
  }

  // Create new subscriber
  const subscriber = await this.create({
    email: email.toLowerCase(),
    name,
    source,
    tags,
    status: 'active',
  });

  return { subscriber, isNew: true };
};

// Static method to unsubscribe
NewsletterSubscriberSchema.statics.unsubscribe = async function (email: string) {
  const subscriber = await this.findOne({ email: email.toLowerCase() });
  if (!subscriber) {
    throw new Error('Subscriber not found');
  }

  subscriber.status = 'unsubscribed';
  subscriber.unsubscribedAt = new Date();
  await subscriber.save();

  return subscriber;
};

// Static method to get subscriber count by status
NewsletterSubscriberSchema.statics.getStats = async function () {
  const total = await this.countDocuments();
  const active = await this.countDocuments({ status: 'active' });
  const unsubscribed = await this.countDocuments({ status: 'unsubscribed' });

  const recentSubscribers = await this.countDocuments({
    subscribedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    status: 'active',
  });

  return {
    total,
    active,
    unsubscribed,
    recentSubscribers,
  };
};

interface INewsletterSubscriberModel extends Model<INewsletterSubscriber> {
  subscribe(
    email: string,
    name?: string,
    source?: string,
    tags?: string[]
  ): Promise<{ subscriber: INewsletterSubscriber; isNew: boolean }>;
  unsubscribe(email: string): Promise<INewsletterSubscriber>;
  getStats(): Promise<{
    total: number;
    active: number;
    unsubscribed: number;
    recentSubscribers: number;
  }>;
}

export default (mongoose.models.NewsletterSubscriber ||
  mongoose.model<INewsletterSubscriber, INewsletterSubscriberModel>(
    'NewsletterSubscriber',
    NewsletterSubscriberSchema
  )) as INewsletterSubscriberModel;
