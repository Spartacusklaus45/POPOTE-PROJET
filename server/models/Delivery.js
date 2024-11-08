import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  shippingMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShippingMethod',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'CANCELLED'],
    default: 'PENDING'
  },
  deliveryAddress: {
    street: String,
    district: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    instructions: String
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  estimatedDeliveryTime: {
    min: Number,
    max: Number,
    unit: {
      type: String,
      enum: ['MINUTES', 'HOURS', 'DAYS']
    }
  },
  actualDeliveryTime: Date,
  deliveryCost: {
    type: Number,
    required: true
  },
  distance: Number,
  driver: {
    name: String,
    phone: String,
    vehicleType: String,
    vehicleNumber: String
  },
  tracking: {
    number: String,
    url: String,
    provider: String,
    updates: [{
      status: String,
      location: String,
      timestamp: Date,
      description: String
    }]
  },
  signature: {
    image: String,
    name: String,
    timestamp: Date
  },
  issues: [{
    type: String,
    description: String,
    reportedAt: Date,
    resolvedAt: Date,
    resolution: String
  }]
}, {
  timestamps: true
});

// Index pour la recherche rapide
deliverySchema.index({ order: 1, status: 1 });
deliverySchema.index({ 'tracking.number': 1 });
deliverySchema.index({ scheduledDate: 1, status: 1 });

// Méthode pour mettre à jour le statut
deliverySchema.methods.updateStatus = async function(newStatus, details = {}) {
  this.status = newStatus;
  
  if (newStatus === 'DELIVERED') {
    this.actualDeliveryTime = new Date();
  }

  if (details.location) {
    this.tracking.updates.push({
      status: newStatus,
      location: details.location,
      timestamp: new Date(),
      description: details.description
    });
  }

  return this.save();
};

// Méthode pour calculer le retard
deliverySchema.methods.calculateDelay = function() {
  if (!this.actualDeliveryTime || !this.scheduledDate) return 0;

  const delay = this.actualDeliveryTime - this.scheduledDate;
  return Math.max(0, delay);
};

export const Delivery = mongoose.model('Delivery', deliverySchema);