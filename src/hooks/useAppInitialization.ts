import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useRecipeStore } from '../store/recipeStore';

export function useAppInitialization() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { initializeAuth } = useAuthStore();
  const { initializeRecipes } = useRecipeStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        await Promise.all([
          initializeAuth(),
          initializeRecipes()
        ]);
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initialize();
  }, []);

  return { isInitialized };
}