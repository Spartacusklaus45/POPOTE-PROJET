import { Recipe } from '../types';
import api from './api';
import { createNotification } from './notificationService';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  score: number;
  qualityScore: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export async function validateAndSaveRecipe(recipe: Recipe): Promise<ValidationResult> {
  try {
    // Validation de base
    const validation = validateRecipe(recipe);
    if (!validation.isValid) {
      return validation;
    }

    // Validation avancée
    const score = await calculateRecipeScore(recipe);
    const qualityScore = await calculateQualityScore(recipe);
    
    if (score >= 70) { // Score minimum pour validation
      // Sauvegarder la recette
      const savedRecipe = await api.post('/recipes', {
        ...recipe,
        validationScore: score,
        qualityScore,
        status: 'VALIDATED',
        isPublic: recipe.isPublic || false
      });

      // Envoyer une notification à l'utilisateur
      await createNotification({
        userId: recipe.author.id,
        type: 'RECIPE_VALIDATED',
        title: 'Recette validée !',
        message: `Votre recette "${recipe.name}" a été validée avec un score de ${score}/100.`,
        data: {
          recipeId: savedRecipe.id,
          score,
          qualityScore
        }
      });

      return {
        isValid: true,
        errors: [],
        score,
        qualityScore
      };
    }

    return {
      isValid: false,
      errors: [{
        field: 'general',
        message: 'La recette ne répond pas aux critères de qualité minimum'
      }],
      score,
      qualityScore: 0
    };
  } catch (error) {
    console.error('Erreur lors de la validation de la recette:', error);
    throw error;
  }
}

// Calcul du score de qualité basé sur les avis et interactions
async function calculateQualityScore(recipe: Recipe): Promise<number> {
  let qualityScore = 0;

  // Score basé sur la moyenne des notes (50 points max)
  if (recipe.ratings && recipe.ratings.length > 0) {
    const averageRating = recipe.ratings.reduce((acc, r) => acc + r.rating, 0) / recipe.ratings.length;
    qualityScore += (averageRating / 5) * 50;
  }

  // Bonus pour le nombre d'avis (20 points max)
  if (recipe.ratings) {
    const reviewsScore = Math.min(recipe.ratings.length * 2, 20);
    qualityScore += reviewsScore;
  }

  // Bonus pour les commentaires détaillés (20 points max)
  if (recipe.ratings) {
    const detailedReviews = recipe.ratings.filter(r => r.comment && r.comment.length > 50);
    const commentScore = Math.min(detailedReviews.length * 4, 20);
    qualityScore += commentScore;
  }

  // Bonus pour les likes/partages (10 points max)
  if (recipe.likes) {
    const socialScore = Math.min(recipe.likes.length, 10);
    qualityScore += socialScore;
  }

  return Math.round(qualityScore);
}

// Le reste du fichier reste inchangé...
[Previous validation and score calculation code remains the same]