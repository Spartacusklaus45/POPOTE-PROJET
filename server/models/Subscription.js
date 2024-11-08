import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['BASIC', 'PREMIUM', 'PRO'],
    required: true
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
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false
  },
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
    },
    quota: Number,
    usage: Number
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
    },
    isDefault: {
      type: Boolean,
      default: true
    }
  },
  billingHistory: [{
    date: Date,
    amount: Number,
    status: {
      type: String,
      enum: ['PAID', 'FAILED', 'PENDING', 'REFUNDED']
    },
    transactionId: String
  }],
  pauseHistory: [{
    startDate: Date,
    endDate: Date,
    reason: String
  }],
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index pour la recherche rapide
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ plan: 1, status: 1 });
subscriptionSchema.index({ endDate: 1 });

// Méthode pour vérifier si l'abonnement est actif
subscriptionSchema.methods.isActive = function() {
  return this.status === 'ACTIVE' && 
         (!this.endDate || new Date() < this.endDate);
};

// Méthode pour vérifier l'utilisation d'une fonctionnalité
subscriptionSchema.methods.checkFeatureUsage = function(featureName) {
  const feature = this.features.find(f => f.name === featureName);
  if (!feature) return false;
  
  return feature.isEnabled && 
         (!feature.quota || feature.usage < feature.quota);
};

// Méthode pour mettre à jour l'utilisation d'une fonctionnalité
subscriptionSchema.methods.incrementFeatureUsage = async function(featureName) {
  const feature = this.features.find(f => f.name === featureName);
  if (!feature) return false;

  if (feature.quota && feature.usage >= feature.quota) {
    throw new Error('Quota dépassé pour cette fonctionnalité');
  }

  feature.usage = (feature.usage || 0) + 1;
  return this.save();
};

// Méthode pour mettre en pause
subscriptionSchema.methods.pause = async function(reason) {
  if (this.status !== 'ACTIVE') {
    throw new Error('Seul un abonnement actif peut être mis en pause');
  }

  this.status = 'PAUSED';
  this.pauseHistory.push({
    startDate: new Date(),
    reason
  });

  return this.save();
};

// Méthode pour reprendre
subscriptionSchema.methods.resume = async function() {
  if (this.status !== 'PAUSED') {
    throw new Error('Seul un abonnement en pause peut être repris');
  }

  this.status = 'ACTIVE';
  const lastPause = this.pauseHistory[this.pauseHistory.length - 1];
  if (lastPause) {
    lastPause.endDate = new Date();
  }

  return this.save();
};

// Méthode pour annuler
subscriptionSchema.methods.cancel = async function(immediate = false) {
  if (immediate) {
    this.status = 'CANCELLED';
    this.endDate = new Date();
  } else {
    this.cancelAtPeriodEnd = true;
  }

  return this.save();
};

export const Subscription = mongoose.model('Subscription', subscriptionSchema);