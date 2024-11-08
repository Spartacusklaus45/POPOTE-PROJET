import create from 'zustand';
import { persist } from 'zustand/middleware';
import type { Recipe } from '../types';

export interface NutritionDay {
  date: string;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  recipes: {
    recipeId: string;
    name: string;
    servings: number;
    nutrients: {
      calories: number;
      proteins: number;
      carbohydrates: number;
      fat: number;
      fiber: number;
    };
  }[];
}

interface NutritionState {
  history: NutritionDay[];
  goals: {
    calories: number;
    proteins: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
  };
  
  // Actions
  addRecipeNutrition: (date: string, recipe: Recipe, servings: number) => void;
  updateGoals: (newGoals: Partial<NutritionState['goals']>) => void;
  getDayNutrition: (date: string) => NutritionDay | undefined;
  getWeekNutrition: (startDate: string) => NutritionDay[];
  getMonthNutrition: (month: number, year: number) => NutritionDay[];
}

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      history: [],
      goals: {
        calories: 2000,
        proteins: 75,
        carbohydrates: 250,
        fat: 70,
        fiber: 25
      },

      addRecipeNutrition: (date, recipe, servings) => {
        const servingRatio = servings / recipe.servings;
        const nutrients = {
          calories: recipe.nutrients?.calories * servingRatio || 0,
          proteins: recipe.nutrients?.proteins * servingRatio || 0,
          carbohydrates: recipe.nutrients?.carbohydrates * servingRatio || 0,
          fat: recipe.nutrients?.fat * servingRatio || 0,
          fiber: recipe.nutrients?.fiber * servingRatio || 0
        };

        set((state) => {
          const dayIndex = state.history.findIndex(day => day.date === date);
          
          if (dayIndex === -1) {
            // Nouveau jour
            return {
              history: [...state.history, {
                date,
                calories: nutrients.calories,
                proteins: nutrients.proteins,
                carbohydrates: nutrients.carbohydrates,
                fat: nutrients.fat,
                fiber: nutrients.fiber,
                recipes: [{
                  recipeId: recipe.id,
                  name: recipe.name,
                  servings,
                  nutrients
                }]
              }]
            };
          }

          // Mise à jour d'un jour existant
          const updatedHistory = [...state.history];
          const day = updatedHistory[dayIndex];
          
          updatedHistory[dayIndex] = {
            ...day,
            calories: day.calories + nutrients.calories,
            proteins: day.proteins + nutrients.proteins,
            carbohydrates: day.carbohydrates + nutrients.carbohydrates,
            fat: day.fat + nutrients.fat,
            fiber: day.fiber + nutrients.fiber,
            recipes: [...day.recipes, {
              recipeId: recipe.id,
              name: recipe.name,
              servings,
              nutrients
            }]
          };

          return { history: updatedHistory };
        });
      },

      updateGoals: (newGoals) =>
        set((state) => ({
          goals: { ...state.goals, ...newGoals }
        })),

      getDayNutrition: (date) => {
        return get().history.find(day => day.date === date);
      },

      getWeekNutrition: (startDate) => {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(end.getDate() + 7);

        return get().history.filter(day => {
          const date = new Date(day.date);
          return date >= start && date < end;
        });
      },

      getMonthNutrition: (month, year) => {
        return get().history.filter(day => {
          const date = new Date(day.date);
          return date.getMonth() === month && date.getFullYear() === year;
        });
      }
    }),
    {
      name: 'nutrition-storage'
    }
  )
);