import create from 'zustand';
import { persist } from 'zustand/middleware';
import type { StockLevel, StockReservation, RecipeAvailability } from '../types/stock';
import api from '../services/api';

interface StockState {
  stockLevels: Map<string, StockLevel>;
  reservations: StockReservation[];
  isLoading: boolean;
  error: string | null;

  // Actions
  checkRecipeAvailability: (recipeId: string) => Promise<RecipeAvailability>;
  reserveIngredients: (recipeId: string, orderId?: string) => Promise<boolean>;
  confirmReservation: (reservationId: string) => Promise<void>;
  cancelReservation: (reservationId: string) => Promise<void>;
  updateStockLevel: (ingredientId: string, quantity: number) => Promise<void>;
}

export const useStockStore = create<StockState>()(
  persist(
    (set, get) => ({
      stockLevels: new Map(),
      reservations: [],
      isLoading: false,
      error: null,

      checkRecipeAvailability: async (recipeId: string) => {
        try {
          const response = await api.get(`/stock/recipes/${recipeId}/availability`);
          return response.data;
        } catch (error) {
          console.error('Erreur lors de la vérification de disponibilité:', error);
          throw error;
        }
      },

      reserveIngredients: async (recipeId: string, orderId?: string) => {
        try {
          set({ isLoading: true });
          const response = await api.post('/stock/reservations', {
            recipeId,
            orderId
          });

          if (response.data.success) {
            set(state => ({
              reservations: [...state.reservations, response.data.reservation]
            }));
            return true;
          }
          return false;
        } catch (error) {
          console.error('Erreur lors de la réservation:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      confirmReservation: async (reservationId: string) => {
        try {
          set({ isLoading: true });
          await api.put(`/stock/reservations/${reservationId}/confirm`);
          
          set(state => ({
            reservations: state.reservations.map(res =>
              res.id === reservationId
                ? { ...res, status: 'CONFIRMED' }
                : res
            )
          }));
        } catch (error) {
          console.error('Erreur lors de la confirmation:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      cancelReservation: async (reservationId: string) => {
        try {
          set({ isLoading: true });
          await api.put(`/stock/reservations/${reservationId}/cancel`);
          
          set(state => ({
            reservations: state.reservations.map(res =>
              res.id === reservationId
                ? { ...res, status: 'CANCELLED' }
                : res
            )
          }));
        } catch (error) {
          console.error('Erreur lors de l\'annulation:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateStockLevel: async (ingredientId: string, quantity: number) => {
        try {
          set({ isLoading: true });
          const response = await api.put(`/stock/ingredients/${ingredientId}`, {
            quantity
          });

          set(state => {
            const newLevels = new Map(state.stockLevels);
            newLevels.set(ingredientId, response.data);
            return { stockLevels: newLevels };
          });
        } catch (error) {
          console.error('Erreur lors de la mise à jour du stock:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'stock-storage'
    }
  )
);