export interface Creator {
  id: string;
  userId: string;
  name: string;
  bio?: string;
  avatar?: string;
  followers: string[];
  recipes: string[];
  stats: {
    totalRecipes: number;
    publishedRecipes: number;
    totalViews: number;
    totalLikes: number;
    averageRating: number;
  };
  earnings: {
    totalEarnings: number;
    monthlyEarnings: number;
    availableBalance: number;
    commissionRate: number;
  };
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED';
  createdAt: string;
  updatedAt: string;
}

export interface RecipeSubmission {
  id: string;
  recipeId: string;
  creatorId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewerId?: string;
  comments?: string;
  validationScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeValidationResult {
  isValid: boolean;
  errors: string[];
  score: number;
  details: {
    ingredients: number;
    instructions: number;
    images: number;
    nutrition: number;
    description: number;
  };
}