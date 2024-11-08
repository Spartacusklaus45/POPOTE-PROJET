import { Recipe } from '../types';

interface ValidationScore {
  score: number;
  details: {
    ingredients: number;
    instructions: number;
    images: number;
    nutrition: number;
    description: number;
    metadata: number;
  };
  feedback: string[];
}

export async function validateRecipe(recipe: Recipe): Promise<ValidationScore> {
  const details = {
    ingredients: calculateIngredientsScore(recipe),
    instructions: calculateInstructionsScore(recipe),
    images: calculateImagesScore(recipe),
    nutrition: calculateNutritionScore(recipe),
    description: calculateDescriptionScore(recipe),
    metadata: calculateMetadataScore(recipe)
  };

  const score = Object.values(details).reduce((sum, score) => sum + score, 0);
  const feedback = generateFeedback(details);

  return {
    score,
    details,
    feedback
  };
}

function calculateIngredientsScore(recipe: Recipe): number {
  let score = 0;
  const { ingredients } = recipe;

  // Nombre minimum d'ingrédients (max 5 points)
  score += Math.min(ingredients.length / 2, 5);

  // Qualité des informations des ingrédients (max 10 points)
  score += ingredients.reduce((sum, ingredient) => {
    let points = 0;
    if (ingredient.name) points += 1;
    if (ingredient.quantity > 0) points += 1;
    if (ingredient.unit) points += 1;
    return sum + (points / 3) * (10 / ingredients.length);
  }, 0);

  return Math.min(score, 15);
}

function calculateInstructionsScore(recipe: Recipe): number {
  let score = 0;
  const { instructions } = recipe;

  // Nombre d'étapes (max 10 points)
  score += Math.min(instructions.length / 3, 10);

  // Qualité des instructions (max 15 points)
  score += instructions.reduce((sum, instruction) => {
    const words = instruction.trim().split(/\s+/).length;
    return sum + Math.min(words / 10, 15 / instructions.length);
  }, 0);

  return Math.min(score, 25);
}

function calculateImagesScore(recipe: Recipe): number {
  let score = 0;

  // Image principale (max 15 points)
  if (recipe.imageUrl) {
    score += 15;
  }

  // Images d'étapes (max 5 points)
  if (recipe.stepImages?.length) {
    score += Math.min(recipe.stepImages.length * 2, 5);
  }

  return score;
}

function calculateNutritionScore(recipe: Recipe): number {
  let score = 0;

  // Informations nutritionnelles de base (max 15 points)
  if (recipe.nutrients) {
    if (recipe.nutrients.calories) score += 3;
    if (recipe.nutrients.proteins) score += 3;
    if (recipe.nutrients.carbohydrates) score += 3;
    if (recipe.nutrients.fat) score += 3;
    if (recipe.nutrients.fiber) score += 3;
  }

  return score;
}

function calculateDescriptionScore(recipe: Recipe): number {
  let score = 0;

  // Longueur de la description (max 10 points)
  const words = recipe.description.trim().split(/\s+/).length;
  score += Math.min(words / 10, 10);

  // Présence d'informations clés (max 10 points)
  if (recipe.preparationTime) score += 2;
  if (recipe.difficulty) score += 2;
  if (recipe.servings) score += 2;
  if (recipe.category) score += 2;
  if (recipe.cuisine) score += 2;

  return score;
}

function calculateMetadataScore(recipe: Recipe): number {
  let score = 0;

  // Tags et catégorisation (max 5 points)
  if (recipe.tags?.length) {
    score += Math.min(recipe.tags.length, 5);
  }

  // Temps et portions (max 5 points)
  if (recipe.preparationTime > 0) score += 2.5;
  if (recipe.servings > 0) score += 2.5;

  return score;
}

function generateFeedback(details: ValidationScore['details']): string[] {
  const feedback: string[] = [];

  if (details.ingredients < 10) {
    feedback.push('Ajoutez plus de détails sur les ingrédients');
  }
  if (details.instructions < 15) {
    feedback.push('Les instructions pourraient être plus détaillées');
  }
  if (details.images < 10) {
    feedback.push('Ajoutez des photos pour illustrer la recette');
  }
  if (details.nutrition < 10) {
    feedback.push('Complétez les informations nutritionnelles');
  }
  if (details.description < 15) {
    feedback.push('La description pourrait être plus détaillée');
  }

  return feedback;
}

export function calculateQualityScore(recipe: Recipe): number {
  let score = 0;

  // Moyenne des notes (50 points)
  if (recipe.ratings?.length > 0) {
    const averageRating = recipe.ratings.reduce((sum, r) => sum + r.rating, 0) / recipe.ratings.length;
    score += (averageRating / 5) * 50;
  }

  // Nombre d'avis (20 points)
  const reviewsScore = Math.min(recipe.ratings?.length * 2 || 0, 20);
  score += reviewsScore;

  // Qualité des commentaires (20 points)
  const detailedReviews = recipe.ratings?.filter(r => r.comment?.length > 50) || [];
  const commentScore = Math.min(detailedReviews.length * 4, 20);
  score += commentScore;

  // Likes et partages (10 points)
  const socialScore = Math.min(
    ((recipe.likes?.length || 0) + (recipe.shares?.length || 0)) * 0.5,
    10
  );
  score += socialScore;

  return Math.round(score);
}

export function calculateRecommendationScore(recipe: Recipe): number {
  const weights = {
    views: 0.2,
    ratings: 0.3,
    likes: 0.2,
    shares: 0.3
  };

  const viewsScore = Math.min((recipe.views || 0) / 100, 1) * 100;
  const ratingsScore = recipe.ratings?.length > 0 ? 
    (recipe.ratings.reduce((sum, r) => sum + r.rating, 0) / recipe.ratings.length) * 20 : 0;
  const likesScore = Math.min((recipe.likes?.length || 0) * 2, 100);
  const sharesScore = Math.min((recipe.shares?.length || 0) * 5, 100);

  return Math.round(
    viewsScore * weights.views +
    ratingsScore * weights.ratings +
    likesScore * weights.likes +
    sharesScore * weights.shares
  );
}