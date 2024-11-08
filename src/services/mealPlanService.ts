import api from './api';
import { MealPlan } from '../types';

export const mealPlanService = {
  createMealPlan: async (mealPlanData: Partial<MealPlan>) => {
    const response = await api.post('/meal-plans', mealPlanData);
    return response.data;
  },

  getMealPlans: async () => {
    const response = await api.get('/meal-plans');
    return response.data;
  },

  getMealPlanById: async (id: string) => {
    const response = await api.get(`/meal-plans/${id}`);
    return response.data;
  },

  updateMealPlan: async (id: string, mealPlanData: Partial<MealPlan>) => {
    const response = await api.put(`/meal-plans/${id}`, mealPlanData);
    return response.data;
  },

  deleteMealPlan: async (id: string) => {
    const response = await api.delete(`/meal-plans/${id}`);
    return response.data;
  },

  generateMealPlan: async (preferences: any) => {
    const response = await api.post('/meal-plans/generate', preferences);
    return response.data;
  }
};