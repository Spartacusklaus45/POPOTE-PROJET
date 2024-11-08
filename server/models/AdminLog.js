import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: [
      'CREATE',
      'UPDATE',
      'DELETE',
      'LOGIN',
      'LOGOUT',
      'EXPORT',
      'IMPORT',
      'VALIDATE',
      'REJECT',
      'REFUND',
      'BLOCK_USER',
      'UNBLOCK_USER',
      'CHANGE_SETTINGS'
    ],
    required: true
  },
  resourceType: {
    type: String,
    enum: [
      'USER',
      'ORDER',
      'PRODUCT',
      'RECIPE',
      'PAYMENT',
      'DELIVERY',
      'REVIEW',
      'SETTINGS',
      'CAMPAIGN',
      'DISCOUNT',
      'SUBSCRIPTION'
    ],
    required: true
  },
  resourceId: mongoose.Schema.Types.ObjectId,
  details: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  changes: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILURE', 'WARNING'],
    default: 'SUCCESS'
  },
  ipAddress: String,
  userAgent: String,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index pour la recherche rapide
adminLogSchema.index({ admin: 1, createdAt: -1 });
adminLogSchema.index({ action: 1, resourceType: 1 });
adminLogSchema.index({ resourceType: 1, resourceId: 1 });

// Méthode pour créer un log avec les détails de l'admin
adminLogSchema.statics.logAction = async function(adminId, action, resourceType, data = {}) {
  const log = new this({
    admin: adminId,
    action,
    resourceType,
    ...data
  });
  return log.save();
};

// Méthode pour obtenir les logs d'une ressource
adminLogSchema.statics.getResourceLogs = async function(resourceType, resourceId) {
  return this.find({ resourceType, resourceId })
    .populate('admin', 'name email')
    .sort('-createdAt');
};

// Méthode pour obtenir les logs d'un admin
adminLogSchema.statics.getAdminLogs = async function(adminId) {
  return this.find({ admin: adminId })
    .sort('-createdAt');
};

export const AdminLog = mongoose.model('AdminLog', adminLogSchema);