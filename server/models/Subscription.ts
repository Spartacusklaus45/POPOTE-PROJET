import mongoose from 'mongoose';

export interface SubscriptionDocument extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  plan: string;
  status: string;
  startDate: Date;
  endDate: Date;
  price: {
    amount: number;
    currency: string;
    interval: string;
  };
  features: Array<{
    name: string;
    isEnabled: boolean;
  }>;
  paymentMethod: {
    type: string;
    details: Record<string, any>;
  };
}

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    required: true,
    enum: ['BASIC', 'PREMIUM', 'PRO']
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED'],
    default: 'ACTIVE'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'XOF'
    },
    interval: {
      type: String,
      enum: ['MONTHLY', 'QUARTERLY', 'YEARLY'],
      required: true
    }
  },
  features: [{
    name: String,
    isEnabled: {
      type: Boolean,
      default: true
    }
  }],
  paymentMethod: {
    type: {
      type: String,
      enum: ['CARD', 'MOBILE_MONEY'],
      required: true
    },
    details: {
      type: Map,
      of: String
    }
  }
}, {
  timestamps: true
});

export const Subscription = mongoose.model<SubscriptionDocument>('Subscription', subscriptionSchema);