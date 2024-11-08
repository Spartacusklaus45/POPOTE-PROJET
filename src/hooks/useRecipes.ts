import { useState, useEffect } from 'react';
import { recipes, getRecipesByCountry, getRecipesByRegion } from '../data/recipes';
import type { Recipe } from '../types';

interface UseRecipesOptions {
  country?: string;
  region?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  maxPrepTime?: number;
  ingredients?: string[];
  nutritionalScore?: string;
  ecoScore?: string;
}

export function useRecipes(options: UseRecipesOptions = {}) {
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipes);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      let result = [...recipes];

      if (options.country) {
        result = getRecipesByCountry(options.country);
      }

      if (options.region) {
        result = getRecipesByRegion(options.region);
      }

      if (options.difficulty) {
        result = result.filter(recipe => recipe.difficulty === options.difficulty);
      }

      if (options.maxPrepTime) {
        result = result.filter(recipe => recipe.preparationTime <= options.maxPrepTime);
      }

      if (options.ingredients) {
        result = result.filter(recipe =>
          options.ingredients!.every(id =>
            recipe.ingredients.some(ingredient => ingredient.id === id)
          )
        );
      }

      if (options.nutritionalScore) {
        result = result.filter(recipe => recipe.nutritionalScore === options.nutritionalScore);
      }

      if (options.ecoScore) {
        result = result.filter(recipe => recipe.ecoScore === options.ecoScore);
      }

      setFilteredRecipes(result);
    } catch (err) {
      setError('Erreur lors du filtrage des recettes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [options]);

  return {
    recipes: filteredRecipes,
    loading,
    error
  };
}