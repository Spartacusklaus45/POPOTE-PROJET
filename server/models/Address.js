import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['SHIPPING', 'BILLING'],
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  street: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  additionalInfo: String,
  contactName: String,
  contactPhone: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: Date,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index pour la recherche rapide
addressSchema.index({ user: 1, type: 1 });
addressSchema.index({ city: 1, district: 1 });

// Middleware pour gérer l'adresse par défaut
addressSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      {
        user: this.user,
        type: this.type,
        _id: { $ne: this._id }
      },
      { isDefault: false }
    );
  }
  next();
});

// Méthode pour formater l'adresse
addressSchema.methods.getFormattedAddress = function() {
  return `${this.street}, ${this.district}, ${this.city}`;
};

// Méthode pour vérifier si l'adresse est dans une zone de livraison
addressSchema.methods.isInDeliveryZone = async function() {
  const ShippingMethod = mongoose.model('ShippingMethod');
  const availableMethods = await ShippingMethod.find({
    'availableZones': {
      $elemMatch: {
        district: this.district,
        city: this.city
      }
    }
  });
  return availableMethods.length > 0;
};

export const Address = mongoose.model('Address', addressSchema);