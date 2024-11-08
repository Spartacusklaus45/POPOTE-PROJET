import { Recipe } from '../types';
import { api } from '@/lib/api';

export async function getRecipes() {
  const { data } = await api.get<Recipe[]>('/recipes');
  return data;
}

export async function getRecipeById(id: string) {
  const { data } = await api.get<Recipe>(`/recipes/${id}`);
  return data;
}

export async function createRecipe(recipe: Partial<Recipe>) {
  const { data } = await api.post<Recipe>('/recipes', recipe);
  return data;
}

export async function updateRecipe(id: string, recipe: Partial<Recipe>) {
  const { data } = await api.put<Recipe>(`/recipes/${id}`, recipe);
  return data;
}