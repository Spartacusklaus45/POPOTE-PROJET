import mongoose from 'mongoose';
import { OrderDocument } from '../types/models';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING'
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  paymentMethod: {
    type: String,
    enum: ['CARD', 'MOBILE_MONEY', 'CASH'],
    required: true
  },
  deliveryAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  deliverySlot: {
    date: {
      type: Date,
      required: true
    },
    timeSlot: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, paymentStatus: 1 });

// Middleware pour calculer le prix total
orderSchema.pre('save', function(next) {
  if (this.isModified('items')) {
    this.totalPrice = this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
  next();
});

// Méthodes
orderSchema.methods.canBeCancelled = function(): boolean {
  return ['PENDING', 'CONFIRMED'].includes(this.status);
};

orderSchema.methods.cancel = async function(): Promise<void> {
  if (!this.canBeCancelled()) {
    throw new Error('Cette commande ne peut pas être annulée');
  }
  
  this.status = 'CANCELLED';
  await this.save();
};

orderSchema.methods.updateStatus = async function(newStatus: string): Promise<void> {
  const validTransitions: Record<string, string[]> = {
    'PENDING': ['CONFIRMED', 'CANCELLED'],
    'CONFIRMED': ['PREPARING', 'CANCELLED'],
    'PREPARING': ['DELIVERING'],
    'DELIVERING': ['DELIVERED'],
    'DELIVERED': [],
    'CANCELLED': []
  };

  if (!validTransitions[this.status].includes(newStatus)) {
    throw new Error('Transition de statut invalide');
  }

  this.status = newStatus;
  await this.save();
};

export const Order = mongoose.model<OrderDocument>('Order', orderSchema);