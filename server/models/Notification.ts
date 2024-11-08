import mongoose from 'mongoose';
import { NotificationDocument } from '../types/models';

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
  }]
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ user: 1, status: 1 });
notificationSchema.index({ user: 1, type: 1 });
notificationSchema.index({ createdAt: -1 });

// Methods
notificationSchema.methods.markAsRead = async function(): Promise<void> {
  this.status = 'READ';
  this.readAt = new Date();
  await this.save();
};

notificationSchema.methods.archive = async function(): Promise<void> {
  this.status = 'ARCHIVED';
  await this.save();
};

notificationSchema.methods.isExpired = function(): boolean {
  return this.expiresAt ? new Date() > this.expiresAt : false;
};

notificationSchema.methods.updateDeliveryStatus = async function(status: string): Promise<void> {
  this.deliveryStatus = status;
  await this.save();
};

export const Notification = mongoose.model<NotificationDocument>('Notification', notificationSchema);