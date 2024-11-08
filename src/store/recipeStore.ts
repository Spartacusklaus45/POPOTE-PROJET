```typescript
import create from 'zustand';
import { persist } from 'zustand/middleware';
import type { Recipe } from '@/types';
import api from '@/services/api';

interface RecipeState {
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchRecipes: () => Promise<void>;
  findRecipesByIngredients: (ingredientIds: string[]) => {
    exact: Recipe[];
    partial: Recipe[];
  };
  getRecipeById: (id: string) => Recipe | undefined;
  createRecipe: (recipe: Partial<Recipe>) => Promise<void>;
  updateRecipe: (id: string, data: Partial<Recipe>) => Promise<void>;
}

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set, get) => ({
      recipes: [],
      selectedRecipe: null,
      isLoading: false,
      error: null,

      fetchRecipes: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.get('/recipes');
          set({ recipes: response.data, isLoading: false });
        } catch (error) {
          set({ error: 'Erreur lors du chargement des recettes', isLoading: false });
          throw error;
        }
      },

      findRecipesByIngredients: (ingredientIds) => {
        const recipes = get().recipes;
        const exact: Recipe[] = [];
        const partial: Recipe[] = [];

        recipes.forEach(recipe => {
          const recipeIngredientIds = recipe.ingredients.map(i => i.id);
          const hasAllIngredients = ingredientIds.every(id => 
            recipeIngredientIds.includes(id)
          );
          const hasSomeIngredients = ingredientIds.some(id => 
            recipeIngredientIds.includes(id)
          );

          if (hasAllIngredients) {
            exact.push(recipe);
          } else if (hasSomeIngredients) {
            // Calculer le pourcentage de correspondance
            const matchPercentage = ingredientIds.filter(id => 
              recipeIngredientIds.includes(id)
            ).length / recipeIngredientIds.length;

            // Ajouter seulement si au moins 50% des ingrédients correspondent
            if (matchPercentage >= 0.5) {
              partial.push(recipe);
            }
          }
        });

        return { exact, partial };
      },

      getRecipeById: (id) => {
        return get().recipes.find(recipe => recipe.id === id);
      },

      createRecipe: async (recipe) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post('/recipes', recipe);
          set(state => ({
            recipes: [...state.recipes, response.data],
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Erreur lors de la création de la recette', isLoading: false });
          throw error;
        }
      },

      updateRecipe: async (id, data) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.put(`/recipes/${id}`, data);
          set(state => ({
            recipes: state.recipes.map(recipe =>
              recipe.id === id ? { ...recipe, ...response.data } : recipe
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Erreur lors de la mise à jour de la recette', isLoading: false });
          throw error;
        }
      }
    }),
    {
      name: 'recipe-storage'
    }
  )
);
```