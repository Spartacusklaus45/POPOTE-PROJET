import api from './api';
import { Recipe, Creator } from '../types';

interface CreatorStats {
  totalRecipes: number;
  publishedRecipes: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalEarnings: number;
  monthlyEarnings: number;
}

interface EarningsCalculation {
  recipeId: string;
  ordersCount: number;
  totalOrdersAmount: number;
  earnings: number;
}

export async function getCreatorStats(creatorId: string): Promise<CreatorStats> {
  try {
    const response = await api.get(`/creators/${creatorId}/stats`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw error;
  }
}

export async function calculateMonthlyEarnings(creatorId: string): Promise<EarningsCalculation[]> {
  try {
    const response = await api.get(`/creators/${creatorId}/earnings/monthly`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du calcul des gains:', error);
    throw error;
  }
}

export async function submitRecipeForReview(recipe: Recipe) {
  try {
    const response = await api.post('/recipes/submit', {
      ...recipe,
      status: 'PENDING'
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la soumission de la recette:', error);
    throw error;
  }
}

export async function updateRecipeVisibility(recipeId: string, isPublic: boolean) {
  try {
    const response = await api.put(`/recipes/${recipeId}/visibility`, {
      isPublic
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la visibilité:', error);
    throw error;
  }
}

export async function getCreatorAnalytics(creatorId: string, period: 'week' | 'month' | 'year') {
  try {
    const response = await api.get(`/creators/${creatorId}/analytics`, {
      params: { period }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des analyses:', error);
    throw error;
  }
}

export async function withdrawEarnings(creatorId: string, amount: number) {
  try {
    const response = await api.post(`/creators/${creatorId}/withdraw`, {
      amount
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors du retrait des gains:', error);
    throw error;
  }
}