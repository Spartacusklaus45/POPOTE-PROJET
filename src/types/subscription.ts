export type SubscriptionPeriod = 'weekly' | 'biweekly' | 'monthly';

export interface NutritionalGoals {
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  fiber: number;
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  excludedIngredients: string[];
  cuisinePreferences: string[];
  nutritionalGoals: NutritionalGoals;
  cookingTime: 'short' | 'medium' | 'long';
  budget: 'low' | 'medium' | 'high';
  seasonalPreference: boolean;
}

export interface DeliverySlot {
  day: string;
  timeSlot: string;
  available: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  period: SubscriptionPeriod;
  price: number;
  mealsPerWeek: number;
  servingsPerMeal: number;
  description: string;
  features: string[];
  discount: number;
  preferences: UserPreferences;
  seasonalAdjustment: boolean;
}

export interface CustomPack {
  id: string;
  name: string;
  description: string;
  recipes: string[];
  ingredients: Array<{
    id: string;
    quantity: number;
    unit: string;
  }>;
  nutritionalInfo: NutritionalGoals;
  price: number;
  season: string;
  createdAt: string;
  validUntil: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  currentPack: CustomPack | null;
  previousPacks: CustomPack[];
  status: 'active' | 'paused' | 'cancelled';
  startDate: string;
  nextDeliveryDate: string;
  deliverySlot: DeliverySlot;
  preferences: UserPreferences;
  paymentMethod: {
    type: 'card';
    last4: string;
    expiryMonth: string;
    expiryYear: string;
    brand: string;
  };
}