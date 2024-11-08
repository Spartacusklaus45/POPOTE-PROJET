import mongoose from 'mongoose';

const mealPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  meals: [{
    date: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      enum: ['BREAKFAST', 'LUNCH', 'DINNER'],
      required: true
    },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true
    },
    servings: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  nutritionGoals: {
    calories: Number,
    proteins: Number,
    carbohydrates: Number,
    fat: Number,
    fiber: Number
  }
}, {
  timestamps: true
});

export const MealPlan = mongoose.model('MealPlan', mealPlanSchema);