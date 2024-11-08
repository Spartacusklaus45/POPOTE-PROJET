import mongoose from 'mongoose';

const loyaltyCardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  points: {
    type: Number,
    default: 0
  },
  linkedCards: [{
    store: {
      type: String,
      required: true
    },
    cardNumber: {
      type: String,
      required: true
    },
    expiryDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }]
}, {
  timestamps: true
});

export const LoyaltyCard = mongoose.model('LoyaltyCard', loyaltyCardSchema);