export interface Ingredient {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  imageUrl?: string;
  nutritionalScore?: string;
  ecoScore?: string;
  novaScore?: number;
  brand?: string;
  origin?: string;
  isSpice?: boolean;
  nutriments?: {
    energy: number;
    proteins: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
  };
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  category: 'LOCAL' | 'INTERNATIONAL';
  preparationTime: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  servings: number;
  ingredients: Ingredient[];
  spices: Ingredient[];
  instructions: string[];
  imageUrl: string;
  videoUrl?: string;
  rating?: number;
  price: number;
  pricePerServing: number;
  author?: {
    id: string;
    name: string;
    avatar?: string;
    recipesCount: number;
  };
  likes?: Array<{ userId: string }>;
  comments?: Array<{
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    createdAt: string;
    likes: number;
    isLiked: boolean;
  }>;
  shares?: Array<{ userId: string }>;
  ratings?: Array<{
    userId: string;
    rating: number;
    comment?: string;
    date: string;
  }>;
  isLiked?: boolean;
  isSaved?: boolean;
  nutritionalScore?: string;
  ecoScore?: string;
  novaScore?: number;
  nutrients?: {
    calories: number;
    proteins: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
  };
}