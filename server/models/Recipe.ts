import mongoose from 'mongoose';
import { RecipeDocument } from '../types/models';

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
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
recipeSchema.index({ name: 'text', description: 'text' });
recipeSchema.index({ category: 1, status: 1 });
recipeSchema.index({ author: 1, createdAt: -1 });

// Méthodes
recipeSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) return 0;
  
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / this.reviews.length) * 10) / 10;
};

recipeSchema.methods.addReview = async function(userId: string, rating: number, comment?: string) {
  this.reviews.push({
    user: userId,
    rating,
    comment,
    createdAt: new Date()
  });

  this.rating = this.calculateAverageRating();
  return this.save();
};

export const Recipe = mongoose.model<RecipeDocument>('Recipe', recipeSchema);