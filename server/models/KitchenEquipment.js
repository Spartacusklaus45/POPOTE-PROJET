import mongoose from 'mongoose';

const kitchenEquipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: [
      'ustensiles',
      'electromenager',
      'cuisson',
      'preparation',
      'conservation',
      'mesure'
    ],
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  brand: String,
  imageUrl: String,
  features: [String],
  dimensions: {
    width: Number,
    height: Number,
    depth: Number,
    unit: {
      type: String,
      enum: ['cm', 'mm', 'in'],
      default: 'cm'
    }
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['kg', 'g', 'lb'],
      default: 'kg'
    }
  },
  powerConsumption: {
    value: Number,
    unit: {
      type: String,
      default: 'W'
    }
  },
  warranty: {
    duration: Number,
    unit: {
      type: String,
      enum: ['months', 'years'],
      default: 'years'
    }
  },
  maintenance: [String],
  compatibleRecipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  stock: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const KitchenEquipment = mongoose.model('KitchenEquipment', kitchenEquipmentSchema);