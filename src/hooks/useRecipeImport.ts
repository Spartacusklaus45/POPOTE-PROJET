import { useState } from 'react';
import { fetchAllRecipes } from '../services/mealDBAPI';
import { useRecipeStore } from '../store/recipeStore';

export function useRecipeImport() {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { addRecipes } = useRecipeStore();

  const importRecipes = async () => {
    try {
      setImporting(true);
      setError(null);
      setProgress(0);

      const importedRecipes = await fetchAllRecipes();
      setProgress(50);

      addRecipes(importedRecipes);
      setProgress(100);

      return true;
    } catch (err) {
      setError('Erreur lors de l\'importation des recettes');
      console.error(err);
      return false;
    } finally {
      setImporting(false);
    }
  };

  return {
    importRecipes,
    importing,
    error,
    progress
  };
}