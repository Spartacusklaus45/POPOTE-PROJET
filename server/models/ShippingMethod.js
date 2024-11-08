import mongoose from 'mongoose';

const shippingMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['STANDARD', 'EXPRESS', 'SAME_DAY', 'PICKUP'],
    required: true
  },
  description: String,
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  pricePerKm: {
    type: Number,
    default: 0,
    min: 0
  },
  minDeliveryTime: {
    type: Number,
    required: true,
    min: 0
  },
  maxDeliveryTime: {
    type: Number,
    required: true,
    min: 0
  },
  timeUnit: {
    type: String,
    enum: ['MINUTES', 'HOURS', 'DAYS'],
    default: 'HOURS'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  availableZones: [{
    district: String,
    city: String,
    extraFee: {
      type: Number,
      default: 0
    },
    minOrderAmount: {
      type: Number,
      default: 0
    }
  }],
  restrictions: {
    maxWeight: Number,
    maxDistance: Number,
    excludedProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }]
  },
  provider: {
    name: String,
    apiKey: String,
    settings: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  }
}, {
  timestamps: true
});

// Index pour la recherche rapide
shippingMethodSchema.index({ type: 1, isActive: 1 });
shippingMethodSchema.index({ 'availableZones.district': 1, 'availableZones.city': 1 });

// Méthode pour calculer le prix de livraison
shippingMethodSchema.methods.calculateShippingCost = function(distance, zone) {
  let cost = this.basePrice;
  
  // Ajouter le coût par kilomètre
  if (distance && this.pricePerKm) {
    cost += distance * this.pricePerKm;
  }

  // Ajouter les frais supplémentaires de la zone
  if (zone) {
    const zoneInfo = this.availableZones.find(
      z => z.district === zone.district && z.city === zone.city
    );
    if (zoneInfo) {
      cost += zoneInfo.extraFee;
    }
  }

  return Math.round(cost);
};

// Méthode pour vérifier la disponibilité
shippingMethodSchema.methods.isAvailable = function(orderAmount, weight, distance, zone) {
  if (!this.isActive) return false;

  // Vérifier les restrictions de poids et distance
  if (this.restrictions.maxWeight && weight > this.restrictions.maxWeight) return false;
  if (this.restrictions.maxDistance && distance > this.restrictions.maxDistance) return false;

  // Vérifier la disponibilité dans la zone
  if (zone) {
    const zoneInfo = this.availableZones.find(
      z => z.district === zone.district && z.city === zone.city
    );
    if (!zoneInfo || orderAmount < zoneInfo.minOrderAmount) return false;
  }

  return true;
};

export const ShippingMethod = mongoose.model('ShippingMethod', shippingMethodSchema);