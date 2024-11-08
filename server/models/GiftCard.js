import mongoose from 'mongoose';
import crypto from 'crypto';

const giftCardSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  balance: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'XOF'
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'USED', 'EXPIRED', 'CANCELLED'],
    default: 'ACTIVE'
  },
  expiryDate: {
    type: Date,
    required: true
  },
  purchaser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    name: String,
    email: String,
    message: String
  },
  redeemedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  transactions: [{
    type: {
      type: String,
      enum: ['PURCHASE', 'REDEMPTION', 'REFUND'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  }],
  design: {
    template: String,
    color: String,
    message: String
  }
}, {
  timestamps: true
});

// Index pour la recherche rapide
giftCardSchema.index({ code: 1 });
giftCardSchema.index({ status: 1, expiryDate: 1 });
giftCardSchema.index({ purchaser: 1 });
giftCardSchema.index({ redeemedBy: 1 });

// Méthode pour générer un code unique
giftCardSchema.statics.generateUniqueCode = async function() {
  let code;
  let isUnique = false;

  while (!isUnique) {
    code = crypto.randomBytes(6).toString('hex').toUpperCase();
    const existingCard = await this.findOne({ code });
    if (!existingCard) {
      isUnique = true;
    }
  }

  return code;
};

// Méthode pour vérifier la validité
giftCardSchema.methods.isValid = function() {
  return this.status === 'ACTIVE' && 
         this.balance > 0 && 
         new Date() < this.expiryDate;
};

// Méthode pour utiliser la carte
giftCardSchema.methods.use = async function(amount, orderId, userId) {
  if (!this.isValid()) {
    throw new Error('Carte cadeau non valide');
  }

  if (amount > this.balance) {
    throw new Error('Solde insuffisant');
  }

  this.balance -= amount;
  this.transactions.push({
    type: 'REDEMPTION',
    amount,
    orderId
  });

  if (this.balance === 0) {
    this.status = 'USED';
  }

  if (!this.redeemedBy) {
    this.redeemedBy = userId;
  }

  return this.save();
};

// Méthode pour rembourser
giftCardSchema.methods.refund = async function(amount, orderId) {
  this.balance += amount;
  this.status = 'ACTIVE';
  
  this.transactions.push({
    type: 'REFUND',
    amount,
    orderId
  });

  return this.save();
};

export const GiftCard = mongoose.model('GiftCard', giftCardSchema);