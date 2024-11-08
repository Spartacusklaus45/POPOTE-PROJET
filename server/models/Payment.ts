import mongoose from 'mongoose';

export interface PaymentDocument extends mongoose.Document {
  order: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  provider: string;
  status: string;
  transactionId: string;
  paymentMethod: string;
  metadata?: Record<string, any>;
  errorDetails?: {
    code: string;
    message: string;
  };
}

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'XOF'
  },
  provider: {
    type: String,
    required: true,
    enum: ['STRIPE', 'ORANGE_MONEY', 'MTN_MONEY', 'WAVE']
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  transactionId: {
    type: String,
    unique: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['CARD', 'MOBILE_MONEY']
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  errorDetails: {
    code: String,
    message: String
  }
}, {
  timestamps: true
});

export const Payment = mongoose.model<PaymentDocument>('Payment', paymentSchema);