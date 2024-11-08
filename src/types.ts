export interface Ingredient {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  nutritionalScore?: string;
  ecoScore?: string;
  novaScore?: number;
  imageUrl?: string;
  brand?: string;
  origin?: string;
  nutriments?: {
    energy: number;
    proteins: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
  };
}

// ... reste du fichier inchangé