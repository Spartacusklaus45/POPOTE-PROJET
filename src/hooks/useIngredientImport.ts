import { useState } from 'react';
import { fetchAllIngredients } from '../services/mealDBIngredients';
import { ingredients as localIngredients } from '../data/ingredients';
import type { Ingredient } from '../types';

export function useIngredientImport() {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const importIngredients = async () => {
    try {
      setImporting(true);
      setError(null);
      setProgress(0);

      // Récupérer les ingrédients de TheMealDB
      const mealDBIngredients = await fetchAllIngredients();
      setProgress(50);

      // Fusionner avec les ingrédients locaux
      const existingIds = new Set(localIngredients.map(i => i.id));
      const newIngredients = mealDBIngredients.filter(i => !existingIds.has(i.id));

      // Mettre à jour les prix et autres informations manquantes
      const enrichedIngredients = newIngredients.map(ingredient => ({
        ...ingredient,
        price: estimatePrice(ingredient)
      }));

      setProgress(100);

      return enrichedIngredients;
    } catch (err) {
      setError('Erreur lors de l\'importation des ingrédients');
      console.error(err);
      return [];
    } finally {
      setImporting(false);
    }
  };

  return {
    importIngredients,
    importing,
    error,
    progress
  };
}

function estimatePrice(ingredient: Ingredient): number {
  // Estimation basée sur la catégorie
  const basePrices: { [key: string]: number } = {
    cereals: 800,
    proteins: 3000,
    vegetables: 1000,
    fruits: 1200,
    spices: 2000,
    dairy: 1500,
    oils: 2000,
    nuts: 4000,
    legumes: 1200,
    other: 1000
  };

  return basePrices[ingredient.category] || 1000;
}