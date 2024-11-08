import api from './api';
import { Recipe } from '../types';

interface RecommendationParams {
  userId?: string;
  category?: string;
  limit?: number;
}

export async function getRecommendedRecipes(params: RecommendationParams = {}): Promise<Recipe[]> {
  try {
    const { userId, category, limit = 10 } = params;
    const query = new URLSearchParams();
    
    if (userId) query.append('userId', userId);
    if (category) query.append('category', category);
    query.append('limit', limit.toString());

    const response = await api.get(`/recipes/recommended?${query.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des recommandations:', error);
    return [];
  }
}

export async function updateRecipeStats(recipeId: string, action: 'view' | 'like' | 'share') {
  try {
    await api.post(`/recipes/${recipeId}/stats`, { action });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des statistiques:', error);
  }
}

export async function rateRecipe(recipeId: string, rating: number, comment?: string) {
  try {
    const response = await api.post(`/recipes/${recipeId}/ratings`, {
      rating,
      comment
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la notation de la recette:', error);
    throw error;
  }
}

export async function likeReview(recipeId: string, reviewId: string) {
  try {
    const response = await api.post(`/recipes/${recipeId}/ratings/${reviewId}/like`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du like du commentaire:', error);
    throw error;
  }
}