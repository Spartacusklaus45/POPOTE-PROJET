import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Recipe } from '../types';
import { recipeService } from '../services/recipeService';
import { useToast } from './useToast';
import { useShare } from './useShare';

export function useRecipe() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { shareContent } = useShare();

  useEffect(() => {
    if (id) {
      loadRecipe(id);
    }
  }, [id]);

  const loadRecipe = async (recipeId: string) => {
    try {
      setLoading(true);
      const data = await recipeService.getRecipeById(recipeId);
      setRecipe(data);
    } catch (error) {
      console.error('Erreur lors du chargement de la recette:', error);
      toast.error('Erreur lors du chargement de la recette');
    } finally {
      setLoading(false);
    }
  };

  const addToMenu = async (recipeId: string) => {
    try {
      await recipeService.addToMenu(recipeId);
      toast.success('Recette ajoutée au menu');
    } catch (error) {
      console.error('Erreur lors de l\'ajout au menu:', error);
      toast.error('Erreur lors de l\'ajout au menu');
    }
  };

  const addToPlanner = async (recipeId: string) => {
    try {
      await recipeService.addToPlanner(recipeId);
      toast.success('Recette ajoutée au planificateur');
    } catch (error) {
      console.error('Erreur lors de l\'ajout au planificateur:', error);
      toast.error('Erreur lors de l\'ajout au planificateur');
    }
  };

  const shareRecipe = async (recipeId: string) => {
    if (!recipe) return;

    try {
      await shareContent({
        title: recipe.name,
        text: `Découvrez cette délicieuse recette de ${recipe.name} sur Popote !`,
        url: window.location.href
      });

      await recipeService.incrementShares(recipeId);
      setRecipe(prev => prev ? {
        ...prev,
        shares: [...(prev.shares || []), { userId: 'current-user' }]
      } : null);
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      toast.error('Erreur lors du partage de la recette');
    }
  };

  return {
    recipe,
    loading,
    addToMenu,
    addToPlanner,
    shareRecipe
  };
}