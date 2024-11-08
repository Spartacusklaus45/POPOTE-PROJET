import { Document } from 'mongoose';

export interface UserDocument extends Document {
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
    spicyLevel?: string;
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

export interface RecipeDocument extends Document {
  name: string;
  description: string;
  category: string;
  preparationTime: number;
  difficulty: string;
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
}

export interface OrderDocument extends Document {
  user: string;
  items: Array<{
    recipe: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  status: string;
  paymentStatus: string;
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