export interface FlavorProfile {
  sweet: number;
  salty: number;
  sour: number;
  bitter: number;
  umami: number;
}

export interface TextureProfile {
  creamy: number;
  crunchy: number;
  chewy: number;
  liquid: number;
}

export interface CookingProperties {
  heatStability: number;
  moistureContent: number;
  bindingPower: number;
  leavening: boolean;
}

export interface IngredientSubstitution {
  id: string;
  originalIngredientId: string;
  substituteIngredientId: string;
  ratio: number;
  flavorProfile: FlavorProfile;
  textureProfile: TextureProfile;
  cookingProperties: CookingProperties;
  dietaryTags: string[];
  rating: number;
  reviewsCount: number;
  description: string;
  tips?: string;
  similarityScore?: number;
}

export interface SubstitutionReview {
  id: string;
  substitutionId: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface DietaryRestriction {
  id: string;
  name: string;
  description: string;
  ingredientsToAvoid: string[];
  commonSubstitutes: Array<{
    ingredientId: string;
    substitutes: string[];
  }>;
}