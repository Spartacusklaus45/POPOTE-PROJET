import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true
  },
  location: {
    warehouse: String,
    section: String,
    shelf: String
  },
  status: {
    type: String,
    enum: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED'],
    default: 'IN_STOCK'
  },
  threshold: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  reservations: [{
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    quantity: Number,
    expiresAt: Date
  }],
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  lastRestockDate: Date,
  nextRestockDate: Date,
  batchInfo: {
    number: String,
    productionDate: Date,
    expiryDate: Date
  },
  qualityChecks: [{
    date: Date,
    inspector: String,
    status: {
      type: String,
      enum: ['PASSED', 'FAILED', 'PENDING']
    },
    notes: String
  }]
}, {
  timestamps: true
});

// Index pour la recherche rapide
inventorySchema.index({ product: 1 });
inventorySchema.index({ status: 1 });
inventorySchema.index({ 'batchInfo.expiryDate': 1 });

// Middleware pour mettre à jour le statut
inventorySchema.pre('save', function(next) {
  if (this.quantity <= this.threshold.min) {
    this.status = this.quantity === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK';
  } else {
    this.status = 'IN_STOCK';
  }
  next();
});

// Méthode pour réserver du stock
inventorySchema.methods.reserve = async function(quantity, orderId) {
  if (this.getAvailableQuantity() < quantity) {
    throw new Error('Stock insuffisant');
  }

  this.reservations.push({
    orderId,
    quantity,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expire après 24h
  });

  await this.save();
  return true;
};

// Méthode pour obtenir la quantité disponible
inventorySchema.methods.getAvailableQuantity = function() {
  const reservedQuantity = this.reservations.reduce((total, reservation) => {
    if (reservation.expiresAt > new Date()) {
      return total + reservation.quantity;
    }
    return total;
  }, 0);

  return this.quantity - reservedQuantity;
};

// Méthode pour nettoyer les réservations expirées
inventorySchema.methods.cleanExpiredReservations = async function() {
  const now = new Date();
  this.reservations = this.reservations.filter(
    reservation => reservation.expiresAt > now
  );
  await this.save();
};

export const Inventory = mongoose.model('Inventory', inventorySchema);