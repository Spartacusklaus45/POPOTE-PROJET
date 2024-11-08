import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserDocument } from '../types/models';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Veuillez fournir un email valide']
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères']
  },
  phone: {
    type: String,
    required: true
  },
  avatar: String,
  isAdmin: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
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
    }
  },
  address: {
    street: String,
    city: String,
    district: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  notificationPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    }
  },
  pushTokens: [String]
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ 'address.city': 1, 'address.district': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Methods
userSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.addPushToken = async function(token: string): Promise<void> {
  if (!this.pushTokens.includes(token)) {
    this.pushTokens.push(token);
    await this.save();
  }
};

userSchema.methods.removePushToken = async function(token: string): Promise<void> {
  this.pushTokens = this.pushTokens.filter(t => t !== token);
  await this.save();
};

userSchema.methods.updateNotificationPreferences = async function(
  preferences: Partial<{
    email: boolean;
    push: boolean;
    sms: boolean;
  }>
): Promise<void> {
  Object.assign(this.notificationPreferences, preferences);
  await this.save();
};

export const User = mongoose.model<UserDocument>('User', userSchema);