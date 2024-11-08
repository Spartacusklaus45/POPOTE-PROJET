import api from './api';
import { Recipe } from '../types';

export const recipeService = {
  getAllRecipes: async () => {
    const response = await api.get('/recipes');
    return response.data;
  },

  getRecipeById: async (id: string) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  createRecipe: async (recipeData: Partial<Recipe>) => {
    const response = await api.post('/recipes', recipeData);
    return response.data;
  },

  updateRecipe: async (id: string, recipeData: Partial<Recipe>) => {
    const response = await api.put(`/recipes/${id}`, recipeData);
    return response.data;
  },

  deleteRecipe: async (id: string) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },

  searchRecipes: async (query: string) => {
    const response = await api.get(`/recipes/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getRecipesByCategory: async (category: string) => {
    const response = await api.get(`/recipes/category/${category}`);
    return response.data;
  }
};