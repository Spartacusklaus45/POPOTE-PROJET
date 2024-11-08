import mongoose from 'mongoose';

const dietaryPreferenceSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'VEGETARIAN',
      'VEGAN',
      'PESCATARIAN',
      'HALAL',
      'KOSHER',
      'GLUTEN_FREE',
      'LACTOSE_FREE',
      'DIABETIC',
      'LOW_CARB',
      'LOW_FAT',
      'LOW_SODIUM',
      'HIGH_PROTEIN',
      'KETO',
      'PALEO'
    ]
  },
  description: {
    type: String,
    required: true
  },
  restrictions: [{
    ingredient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient'
    },
    reason: String
  }],
  allowedIngredients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient'
  }],
  substitutions: [{
    original: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true
    },
    substitute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true
    },
    ratio: {
      type: Number,
      default: 1
    },
    notes: String
  }],
  guidelines: {
    maxCalories: Number,
    maxCarbs: Number,
    maxProtein: Number,
    maxFat: Number,
    maxSugar: Number,
    maxSodium: Number
  },
  recommendations: [{
    type: String
  }],
  warnings: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index pour la recherche rapide
dietaryPreferenceSchema.index({ type: 1, isActive: 1 });

// Méthode pour vérifier si un ingrédient est autorisé
dietaryPreferenceSchema.methods.isIngredientAllowed = function(ingredientId) {
  return !this.restrictions.some(r => r.ingredient.equals(ingredientId)) ||
         this.allowedIngredients.some(i => i.equals(ingredientId));
};

// Méthode pour obtenir les substituts d'un ingrédient
dietaryPreferenceSchema.methods.getSubstitutes = function(ingredientId) {
  return this.substitutions
    .filter(s => s.original.equals(ingredientId))
    .map(s => ({
      ingredient: s.substitute,
      ratio: s.ratio,
      notes: s.notes
    }));
};

export const DietaryPreference = mongoose.model('DietaryPreference', dietaryPreferenceSchema);