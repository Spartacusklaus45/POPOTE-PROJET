import create from 'zustand';
import { persist } from 'zustand/middleware';
import type { Recipe, CartItem, Ingredient } from '../types';

interface CartState {
  recipes: Recipe[];
  additionalItems: CartItem[];
  totalPrice: number;
  store: string | null;
  householdSize: number;
  substitutions: { [ingredientId: string]: string }; // Ingrédient original -> Substitut
  recommendations: Recipe[];
  
  // Actions
  addRecipe: (recipe: Recipe) => void;
  addRecipes: (recipes: Recipe[]) => void; // New action
  removeRecipe: (recipeId: string) => void;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  substituteIngredient: (originalId: string, substituteId: string) => void;
  removeSubstitution: (originalId: string) => void;
  setStore: (store: string) => void;
  setHouseholdSize: (size: number) => void;
  updateRecipeServings: (recipeId: string, servings: number) => void;
  clearCart: () => void;
  calculateTotalPrice: () => number;
  updateRecommendations: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      recipes: [],
      additionalItems: [],
      totalPrice: 0,
      store: null,
      householdSize: 1,
      substitutions: {},
      recommendations: [],

      addRecipe: (recipe) => {
        const currentRecipes = get().recipes;
        if (!currentRecipes.find(r => r.id === recipe.id)) {
          set(state => ({
            recipes: [...state.recipes, recipe],
            totalPrice: get().calculateTotalPrice()
          }));
          get().updateRecommendations();
        }
      },

      addRecipes: (newRecipes) => {
        const currentRecipes = get().recipes;
        const uniqueNewRecipes = newRecipes.filter(
          recipe => !currentRecipes.find(r => r.id === recipe.id)
        );
        
        if (uniqueNewRecipes.length > 0) {
          set(state => ({
            recipes: [...state.recipes, ...uniqueNewRecipes],
            totalPrice: get().calculateTotalPrice()
          }));
          get().updateRecommendations();
        }
      },

      // Rest of the store implementation remains the same
    }),
    {
      name: 'cart-storage'
    }
  )
);