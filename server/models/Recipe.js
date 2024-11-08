import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
  },
  category: {
    type: String,
    required: true,
    enum: ['LOCAL', 'INTERNATIONAL'],
    default: 'LOCAL'
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PENDING', 'VALIDATED', 'REJECTED'],
    default: 'DRAFT'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ingredients: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
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
    }
  }],
  instructions: [{
    type: String,
    required: true
  }],
  preparationTime: {
    type: Number,
    required: true,
    min: 0
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['EASY', 'MEDIUM', 'HARD']
  },
  servings: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: {
    type: String,
    required: true
  },
  nutritionalScore: String,
  ecoScore: String,
  novaScore: Number,
  nutrients: {
    calories: Number,
    proteins: Number,
    carbohydrates: Number,
    fat: Number,
    fiber: Number
  }
}, {
  timestamps: true
});

export const Recipe = mongoose.model('Recipe', recipeSchema);