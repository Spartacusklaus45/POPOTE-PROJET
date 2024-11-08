import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  type: {
    type: String,
    enum: ['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  description: String,
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  maxDiscount: Number,
  usageLimit: {
    perUser: {
      type: Number,
      default: 1
    },
    total: Number
  },
  currentUsage: {
    type: Number,
    default: 0
  },
  applicableTo: {
    categories: [{
      type: String
    }],
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  conditions: {
    firstOrder: {
      type: Boolean,
      default: false
    },
    newUsers: {
      type: Boolean,
      default: false
    },
    specificPaymentMethods: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PaymentMethod'
    }]
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index pour la recherche rapide
couponSchema.index({ code: 1 });
couponSchema.index({ startDate: 1, endDate: 1, isActive: 1 });

// Méthode pour vérifier si le coupon est valide
couponSchema.methods.isValid = function(user, orderAmount) {
  const now = new Date();

  // Vérifier la période de validité
  if (now < this.startDate || now > this.endDate) return false;

  // Vérifier si le coupon est actif
  if (!this.isActive) return false;

  // Vérifier la limite d'utilisation totale
  if (this.usageLimit.total && this.currentUsage >= this.usageLimit.total) return false;

  // Vérifier le montant minimum de commande
  if (orderAmount < this.minOrderAmount) return false;

  return true;
};

// Méthode pour calculer le montant de la réduction
couponSchema.methods.calculateDiscount = function(orderAmount) {
  let discount = 0;

  switch (this.type) {
    case 'PERCENTAGE':
      discount = (orderAmount * this.value) / 100;
      break;
    case 'FIXED_AMOUNT':
      discount = this.value;
      break;
    case 'FREE_SHIPPING':
      // La valeur représente le montant maximum des frais de livraison
      discount = Math.min(this.value, orderAmount);
      break;
  }

  // Appliquer le montant maximum de réduction si défini
  if (this.maxDiscount) {
    discount = Math.min(discount, this.maxDiscount);
  }

  return Math.round(discount);
};

export const Coupon = mongoose.model('Coupon', couponSchema);