```typescript
import create from 'zustand';
import { persist } from 'zustand/middleware';
import type { Ingredient } from '@/types';
import api from '@/services/api';

interface IngredientState {
  ingredients: Ingredient[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchIngredients: () => Promise<void>;
  searchIngredients: (query: string) => Promise<Ingredient[]>;
  addIngredient: (ingredient: Ingredient) => Promise<void>;
  updateIngredient: (id: string, data: Partial<Ingredient>) => Promise<void>;
}

export const useIngredientStore = create<IngredientState>()(
  persist(
    (set, get) => ({
      ingredients: [],
      isLoading: false,
      error: null,

      fetchIngredients: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.get('/ingredients');
          set({ ingredients: response.data, isLoading: false });
        } catch (error) {
          set({ error: 'Erreur lors du chargement des ingrédients', isLoading: false });
          throw error;
        }
      },

      searchIngredients: async (query) => {
        try {
          const response = await api.get(`/ingredients/search?q=${encodeURIComponent(query)}`);
          return response.data;
        } catch (error) {
          console.error('Erreur lors de la recherche:', error);
          return [];
        }
      },

      addIngredient: async (ingredient) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post('/ingredients', ingredient);
          set(state => ({
            ingredients: [...state.ingredients, response.data],
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Erreur lors de l\'ajout de l\'ingrédient', isLoading: false });
          throw error;
        }
      },

      updateIngredient: async (id, data) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.put(`/ingredients/${id}`, data);
          set(state => ({
            ingredients: state.ingredients.map(ing =>
              ing.id === id ? { ...ing, ...response.data } : ing
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Erreur lors de la mise à jour de l\'ingrédient', isLoading: false });
          throw error;
        }
      }
    }),
    {
      name: 'ingredient-storage'
    }
  )
);
```