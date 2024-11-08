import create from 'zustand';
import { persist } from 'zustand/middleware';
import type { Creator, RecipeSubmission } from '@/types/creator';
import { useLoyaltyStore } from './loyaltyStore';
import api from '@/services/api';

interface CreatorState {
  creator: Creator | null;
  submissions: RecipeSubmission[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  registerCreator: (data: Partial<Creator>) => Promise<void>;
  submitRecipe: (recipeId: string) => Promise<void>;
  getMonthlyEarnings: () => Promise<void>;
  updateProfile: (data: Partial<Creator>) => Promise<void>;
}

export const useCreatorStore = create<CreatorState>()(
  persist(
    (set, get) => ({
      creator: null,
      submissions: [],
      isLoading: false,
      error: null,

      registerCreator: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post('/creators/register', data);
          set({ creator: response.data, isLoading: false });
        } catch (error) {
          set({ error: 'Erreur lors de l\'inscription', isLoading: false });
          throw error;
        }
      },

      submitRecipe: async (recipeId) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post('/creators/recipes/submit', { recipeId });
          set(state => ({
            submissions: [...state.submissions, response.data],
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Erreur lors de la soumission', isLoading: false });
          throw error;
        }
      },

      getMonthlyEarnings: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.get('/creators/earnings/monthly');
          const { earnings } = response.data;

          // Créditer directement les gains sur la carte Popote
          const { addEarnings } = useLoyaltyStore.getState();
          await addEarnings(
            earnings.amount,
            'RECIPE',
            'Gains mensuels des recettes'
          );

          set(state => ({
            creator: state.creator ? {
              ...state.creator,
              earnings: {
                ...state.creator.earnings,
                monthlyEarnings: earnings.amount,
                totalEarnings: state.creator.earnings.totalEarnings + earnings.amount
              }
            } : null,
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Erreur lors du calcul des gains', isLoading: false });
          throw error;
        }
      },

      updateProfile: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.put('/creators/profile', data);
          set({ creator: response.data, isLoading: false });
        } catch (error) {
          set({ error: 'Erreur lors de la mise à jour', isLoading: false });
          throw error;
        }
      }
    }),
    {
      name: 'creator-storage'
    }
  )
);