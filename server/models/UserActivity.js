import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'VIEW_PRODUCT',
      'ADD_TO_CART',
      'REMOVE_FROM_CART',
      'PLACE_ORDER',
      'CANCEL_ORDER',
      'WRITE_REVIEW',
      'LIKE_PRODUCT',
      'SAVE_PRODUCT',
      'SEARCH',
      'FILTER',
      'LOGIN',
      'LOGOUT',
      'UPDATE_PROFILE',
      'VIEW_CATEGORY'
    ],
    required: true
  },
  data: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  metadata: {
    userAgent: String,
    platform: String,
    device: String,
    ipAddress: String,
    location: {
      country: String,
      city: String
    }
  },
  sessionId: String
}, {
  timestamps: true
});

// Index pour la recherche rapide
userActivitySchema.index({ user: 1, type: 1 });
userActivitySchema.index({ createdAt: -1 });
userActivitySchema.index({ sessionId: 1 });

// Méthode pour obtenir les activités récentes
userActivitySchema.statics.getRecentActivities = async function(userId, limit = 10) {
  return this.find({ user: userId })
    .sort('-createdAt')
    .limit(limit);
};

// Méthode pour obtenir les statistiques d'activité
userActivitySchema.statics.getActivityStats = async function(userId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    }
  ]);
};

export const UserActivity = mongoose.model('UserActivity', userActivitySchema);