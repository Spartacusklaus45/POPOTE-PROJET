import { Document } from 'mongoose';

export interface BaseDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDocument extends BaseDocument {
  name: string;
  email: string;
  password: string;
  phone: string;
  avatar?: string;
  isAdmin: boolean;
  isEmailVerified: boolean;
  preferences: {
    dietaryRestrictions: string[];
    allergies: string[];
    cuisinePreferences: string[];
    spicyLevel?: 'none' | 'mild' | 'medium' | 'hot' | 'extra-hot';
  };
  address?: {
    street: string;
    city: string;
    district: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export interface RecipeDocument extends BaseDocument {
  name: string;
  description: string;
  category: 'LOCAL' | 'INTERNATIONAL';
  preparationTime: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  servings: number;
  ingredients: Array<{
    item: string;
    quantity: number;
    unit: string;
  }>;
  instructions: string[];
  imageUrl: string;
  author: string;
  rating: number;
  reviews: Array<{
    user: string;
    rating: number;
    comment: string;
  }>;
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export interface OrderDocument extends BaseDocument {
  user: string;
  items: Array<{
    recipe: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  deliveryAddress: {
    street: string;
    city: string;
    district: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  deliverySlot: {
    date: Date;
    timeSlot: string;
  };
}

export interface NotificationDocument extends BaseDocument {
  user: string;
  type: string;
  title: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'ARCHIVED';
  data?: Record<string, any>;
  readAt?: Date;
  deliveryStatus: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
  channels: Array<'IN_APP' | 'PUSH' | 'EMAIL' | 'SMS'>;
}

export interface PaymentDocument extends BaseDocument {
  order: string;
  user: string;
  amount: number;
  currency: string;
  provider: 'STRIPE' | 'ORANGE_MONEY' | 'MTN_MONEY' | 'WAVE';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  transactionId?: string;
  paymentMethod: 'CARD' | 'MOBILE_MONEY';
  metadata?: Record<string, any>;
  errorDetails?: {
    code: string;
    message: string;
  };
}

export interface SubscriptionDocument extends BaseDocument {
  user: string;
  plan: 'BASIC' | 'PREMIUM' | 'PRO';
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED';
  startDate: Date;
  endDate?: Date;
  price: {
    amount: number;
    currency: string;
    interval: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  };
  features: Array<{
    name: string;
    isEnabled: boolean;
    quota?: number;
    usage?: number;
  }>;
  paymentMethod: {
    type: 'CARD' | 'MOBILE_MONEY';
    details: Record<string, string>;
    isDefault: boolean;
  };
}

export interface ReviewDocument extends BaseDocument {
  user: string;
  recipe: string;
  rating: number;
  title?: string;
  comment: string;
  images?: Array<{
    url: string;
    caption?: string;
  }>;
  likes: string[];
  isVerifiedPurchase: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  helpfulVotes: Array<{
    user: string;
    isHelpful: boolean;
    date: Date;
  }>;
}

export interface KitchenEquipmentDocument extends BaseDocument {
  name: string;
  category: string;
  description: string;
  price: number;
  brand?: string;
  imageUrl?: string;
  features: string[];
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: 'cm' | 'mm' | 'in';
  };
  weight?: {
    value: number;
    unit: 'kg' | 'g' | 'lb';
  };
  powerConsumption?: {
    value: number;
    unit: string;
  };
  warranty?: {
    duration: number;
    unit: 'months' | 'years';
  };
  maintenance: string[];
  compatibleRecipes: string[];
  stock: number;
  isAvailable: boolean;
}