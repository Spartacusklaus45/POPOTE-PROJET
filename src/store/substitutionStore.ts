import create from 'zustand';
import { persist } from 'zustand/middleware';
import type { IngredientSubstitution, SubstitutionReview } from '../types/substitutions';

interface SubstitutionState {
  substitutions: IngredientSubstitution[];
  reviews: SubstitutionReview[];
  
  // Actions
  getSubstitutionsForIngredient: (ingredientId: string) => IngredientSubstitution[];
  addSubstitutionReview: (review: Omit<SubstitutionReview, 'id' | 'createdAt'>) => void;
  updateSubstitutionRating: (substitutionId: string) => void;
}

export const useSubstitutionStore = create<SubstitutionState>()(
  persist(
    (set, get) => ({
      substitutions: [],
      reviews: [],

      getSubstitutionsForIngredient: (ingredientId) => {
        return get().substitutions.filter(
          sub => sub.originalIngredientId === ingredientId
        );
      },

      addSubstitutionReview: (reviewData) => {
        const newReview: SubstitutionReview = {
          id: crypto.randomUUID(),
          ...reviewData,
          createdAt: new Date().toISOString()
        };

        set(state => ({
          reviews: [...state.reviews, newReview]
        }));

        get().updateSubstitutionRating(reviewData.substitutionId);
      },

      updateSubstitutionRating: (substitutionId) => {
        const reviews = get().reviews.filter(
          review => review.substitutionId === substitutionId
        );

        if (reviews.length === 0) return;

        const averageRating = reviews.reduce(
          (sum, review) => sum + review.rating, 0
        ) / reviews.length;

        set(state => ({
          substitutions: state.substitutions.map(sub =>
            sub.id === substitutionId
              ? {
                  ...sub,
                  rating: averageRating,
                  reviewsCount: reviews.length
                }
              : sub
          )
        }));
      }
    }),
    {
      name: 'substitutions-storage'
    }
  )
);