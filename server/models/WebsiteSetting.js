import mongoose from 'mongoose';

const websiteSettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  category: {
    type: String,
    enum: [
      'GENERAL',
      'APPEARANCE',
      'PAYMENT',
      'DELIVERY',
      'EMAIL',
      'SECURITY',
      'SOCIAL',
      'SEO',
      'FEATURES'
    ],
    required: true
  },
  description: String,
  isPublic: {
    type: Boolean,
    default: false
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  history: [{
    value: mongoose.Schema.Types.Mixed,
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    modifiedAt: {
      type: Date,
      default: Date.now
    },
    reason: String
  }]
}, {
  timestamps: true
});

// Index pour la recherche rapide
websiteSettingSchema.index({ key: 1 });
websiteSettingSchema.index({ category: 1 });
websiteSettingSchema.index({ isPublic: 1 });

// Méthode pour mettre à jour une valeur
websiteSettingSchema.methods.updateValue = async function(value, userId, reason) {
  this.history.push({
    value: this.value,
    modifiedBy: userId,
    reason
  });
  
  this.value = value;
  this.lastModifiedBy = userId;
  
  return this.save();
};

// Méthode pour obtenir l'historique des modifications
websiteSettingSchema.methods.getHistory = function() {
  return this.history.sort((a, b) => b.modifiedAt - a.modifiedAt);
};

// Méthode statique pour obtenir les paramètres publics
websiteSettingSchema.statics.getPublicSettings = function() {
  return this.find({ isPublic: true })
    .select('-history -lastModifiedBy');
};

export const WebsiteSetting = mongoose.model('WebsiteSetting', websiteSettingSchema);