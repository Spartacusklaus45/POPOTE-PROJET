import { useState, useEffect } from 'react';
import { ingredients as localIngredients } from '../data/ingredients';
import { enrichIngredientData } from '../services/openFoodFacts';
import type { Ingredient } from '../types';

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>(localIngredients);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function enrichIngredients() {
      try {
        setLoading(true);
        const enrichedIngredients = await Promise.all(
          localIngredients.map(async (ingredient) => {
            try {
              return await enrichIngredientData(ingredient);
            } catch {
              return ingredient;
            }
          })
        );
        setIngredients(enrichedIngredients);
      } catch (err) {
        setError('Erreur lors de l\'enrichissement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    enrichIngredients();
  }, []);

  return { ingredients, loading, error };
}