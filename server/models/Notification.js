import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'ORDER_STATUS',
      'DELIVERY_STATUS',
      'PAYMENT_STATUS',
      'STOCK_ALERT',
      'PRICE_DROP',
      'NEW_FEATURE',
      'SECURITY_ALERT',
      'ACCOUNT_UPDATE',
      'PROMOTION',
      'REVIEW_REMINDER',
      'SUBSCRIPTION_STATUS'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM'
  },
  status: {
    type: String,
    enum: ['UNREAD', 'READ', 'ARCHIVED'],
    default: 'UNREAD'
  },
  data: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  action: {
    type: {
      type: String,
      enum: ['LINK', 'BUTTON', 'DEEP_LINK']
    },
    text: String,
    url: String
  },
  expiresAt: Date,
  readAt: Date,
  deliveryStatus: {
    type: String,
    enum: ['PENDING', 'SENT', 'DELIVERED', 'FAILED'],
    default: 'PENDING'
  },
  channels: [{
    type: String,
    enum: ['IN_APP', 'PUSH', 'EMAIL', 'SMS'],
    default: ['IN_APP']
  }],
  metadata: {
    deviceInfo: {
      type: String,
      platform: String,
      version: String
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MarketingCampaign'
    }
  }
}, {
  timestamps: true
});

// Index pour la recherche rapide
notificationSchema.index({ user: 1, status: 1 });
notificationSchema.index({ user: 1, type: 1 });
notificationSchema.index({ createdAt: -1 });

// Méthode pour marquer comme lu
notificationSchema.methods.markAsRead = async function() {
  this.status = 'READ';
  this.readAt = new Date();
  return this.save();
};

// Méthode pour archiver
notificationSchema.methods.archive = async function() {
  this.status = 'ARCHIVED';
  return this.save();
};

// Méthode pour vérifier si la notification est expirée
notificationSchema.methods.isExpired = function() {
  return this.expiresAt && new Date() > this.expiresAt;
};

// Méthode pour mettre à jour le statut de livraison
notificationSchema.methods.updateDeliveryStatus = async function(status) {
  this.deliveryStatus = status;
  return this.save();
};

export const Notification = mongoose.model('Notification', notificationSchema);