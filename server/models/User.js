import mongoose from 'mongoose';
import Joi from 'joi';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },
  phone: {
    type: String,
    required: true,
  },
  avatar: String,
  city: String,
  district: String,
  preferences: {
    dietaryRestrictions: [{
      type: String,
      enum: ['vegetarian', 'vegan', 'halal', 'kosher', 'gluten-free', 'lactose-free']
    }],
    allergies: [String],
    cuisinePreferences: [String],
    spicyLevel: {
      type: String,
      enum: ['none', 'mild', 'medium', 'hot', 'extra-hot']
    },
    cookingTime: {
      type: String,
      enum: ['quick', 'medium', 'long']
    },
    budget: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    servingSize: {
      type: Number,
      default: 2
    }
  },
  kitchenEquipment: [{
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'KitchenEquipment'
    },
    purchaseDate: Date,
    condition: {
      type: String,
      enum: ['new', 'good', 'fair', 'poor']
    }
  }],
  nutritionGoals: {
    dailyCalories: Number,
    proteins: Number,
    carbs: Number,
    fats: Number,
    startDate: Date,
    endDate: Date,
    currentWeight: Number,
    targetWeight: Number
  },
  subscriptions: [{
    plan: {
      type: String,
      enum: ['FREE', 'BASIC', 'PREMIUM']
    },
    startDate: Date,
    endDate: Date,
    price: Number,
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled']
    },
    features: [String]
  }],
  loyaltyCard: {
    number: String,
    points: {
      type: Number,
      default: 0
    },
    tier: {
      type: String,
      enum: ['BRONZE', 'SILVER', 'GOLD']
    },
    validUntil: Date,
    benefits: [String]
  },
  referrals: [{
    referredUser: {
      type: String,
      ref: 'User'
    },
    date: Date,
    status: {
      type: String,
      enum: ['pending', 'completed', 'expired']
    },
    pointsEarned: Number
  }],
  expenses: [{
    type: {
      type: String,
      enum: ['subscription', 'order', 'equipment']
    },
    amount: Number,
    date: Date,
    description: String
  }],
  orderHistory: [{
    orderId: String,
    date: Date,
    total: Number,
    status: String,
    items: [{
      recipeId: String,
      quantity: Number,
      price: Number
    }]
  }]
}, {
  timestamps: true
});

export const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
    phone: Joi.string().required(),
    city: Joi.string(),
    district: Joi.string(),
    preferences: Joi.object({
      dietaryRestrictions: Joi.array().items(Joi.string()),
      allergies: Joi.array().items(Joi.string()),
      cuisinePreferences: Joi.array().items(Joi.string()),
      spicyLevel: Joi.string(),
      cookingTime: Joi.string(),
      budget: Joi.string(),
      servingSize: Joi.number()
    })
  });

  return schema.validate(user);
};

export const User = mongoose.model('User', userSchema);