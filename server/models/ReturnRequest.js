import mongoose from 'mongoose';

const returnRequestSchema = new mongoose.Schema({
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
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    reason: {
      type: String,
      enum: [
        'DAMAGED',
        'WRONG_ITEM',
        'NOT_AS_DESCRIBED',
        'NO_LONGER_NEEDED',
        'OTHER'
      ],
      required: true
    },
    condition: {
      type: String,
      enum: ['UNOPENED', 'OPENED', 'DAMAGED'],
      required: true
    },
    details: String,
    images: [{
      url: String,
      description: String
    }]
  }],
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  returnMethod: {
    type: String,
    enum: ['PICKUP', 'DROP_OFF'],
    required: true
  },
  pickupAddress: {
    street: String,
    district: String,
    city: String,
    instructions: String
  },
  scheduledDate: Date,
  refundAmount: {
    type: Number,
    min: 0
  },
  refundMethod: {
    type: String,
    enum: ['ORIGINAL_PAYMENT', 'STORE_CREDIT', 'BANK_TRANSFER'],
    required: true
  },
  refundStatus: {
    type: String,
    enum: ['PENDING', 'PROCESSED', 'FAILED'],
    default: 'PENDING'
  },
  inspectionNotes: String,
  resolution: {
    decision: String,
    notes: String,
    decidedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    decidedAt: Date
  }
}, {
  timestamps: true
});

// Index pour la recherche rapide
returnRequestSchema.index({ order: 1, status: 1 });
returnRequestSchema.index({ user: 1, createdAt: -1 });

// Méthode pour calculer le montant du remboursement
returnRequestSchema.methods.calculateRefundAmount = function() {
  return this.items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
};

// Méthode pour approuver la demande
returnRequestSchema.methods.approve = async function(userId, notes) {
  this.status = 'APPROVED';
  this.resolution = {
    decision: 'APPROVED',
    notes,
    decidedBy: userId,
    decidedAt: new Date()
  };
  return this.save();
};

// Méthode pour rejeter la demande
returnRequestSchema.methods.reject = async function(userId, notes) {
  this.status = 'REJECTED';
  this.resolution = {
    decision: 'REJECTED',
    notes,
    decidedBy: userId,
    decidedAt: new Date()
  };
  return this.save();
};

// Méthode pour compléter le retour
returnRequestSchema.methods.complete = async function() {
  this.status = 'COMPLETED';
  return this.save();
};

export const ReturnRequest = mongoose.model('ReturnRequest', returnRequestSchema);