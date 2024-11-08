import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['CARD', 'MOBILE_MONEY', 'CASH_ON_DELIVERY'],
    required: true
  },
  provider: {
    type: String,
    enum: ['STRIPE', 'CINETPAY', 'ORANGE_MONEY', 'MTN_MONEY', 'WAVE', 'CASH'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  fees: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  minAmount: {
    type: Number,
    default: 0
  },
  maxAmount: {
    type: Number,
    default: 1000000
  },
  supportedCurrencies: [{
    type: String,
    default: ['XOF']
  }],
  processingTime: {
    type: String,
    enum: ['INSTANT', 'SAME_DAY', 'NEXT_DAY'],
    default: 'INSTANT'
  },
  settings: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  icon: String,
  description: String,
  instructions: String
}, {
  timestamps: true
});

// Index pour la recherche rapide
paymentMethodSchema.index({ type: 1, provider: 1, isActive: 1 });

// Méthode pour vérifier si une méthode de paiement est disponible
paymentMethodSchema.methods.isAvailable = function(amount, currency = 'XOF') {
  return this.isActive &&
         amount >= this.minAmount &&
         amount <= this.maxAmount &&
         this.supportedCurrencies.includes(currency);
};

// Méthode pour calculer les frais
paymentMethodSchema.methods.calculateFees = function(amount) {
  return (amount * this.fees) / 100;
};

export const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);