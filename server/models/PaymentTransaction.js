import mongoose from 'mongoose';

const paymentTransactionSchema = new mongoose.Schema({
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
  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentMethod',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  fees: {
    type: Number,
    required: true,
    default: 0
  },
  currency: {
    type: String,
    default: 'XOF'
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED'],
    default: 'PENDING'
  },
  externalReference: String,
  paymentDetails: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  errorDetails: {
    code: String,
    message: String,
    timestamp: Date
  },
  refundDetails: {
    amount: Number,
    reason: String,
    date: Date,
    reference: String
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index pour la recherche rapide
paymentTransactionSchema.index({ order: 1, status: 1 });
paymentTransactionSchema.index({ user: 1, createdAt: -1 });
paymentTransactionSchema.index({ externalReference: 1 });

// Méthode pour calculer le montant total
paymentTransactionSchema.methods.getTotalAmount = function() {
  return this.amount + this.fees;
};

// Méthode pour vérifier si un remboursement est possible
paymentTransactionSchema.methods.canBeRefunded = function() {
  return this.status === 'COMPLETED' && !this.refundDetails;
};

export const PaymentTransaction = mongoose.model('PaymentTransaction', paymentTransactionSchema);