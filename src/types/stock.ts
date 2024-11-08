export interface StockLevel {
  id: string;
  ingredientId: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  maxThreshold: number;
  reserved: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  lastUpdated: string;
}

export interface StockReservation {
  id: string;
  ingredientId: string;
  quantity: number;
  orderId?: string;
  recipeId: string;
  expiresAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

export interface RecipeAvailability {
  recipeId: string;
  isAvailable: boolean;
  missingIngredients: Array<{
    ingredientId: string;
    name: string;
    required: number;
    available: number;
    unit: string;
  }>;
  nextAvailableDate?: string;
}