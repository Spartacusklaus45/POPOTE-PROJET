import { CustomPack, UserPreferences, NutritionalGoals } from '../types/subscription';
import { Recipe, Ingredient } from '../types';
import { getSeasonalIngredients } from './ingredientService';
import { calculateNutritionalValue } from './nutritionService';

interface PackGenerationParams {
  preferences: UserPreferences;
  season: string;
  previousPacks?: CustomPack[];
}

export async function generateCustomPack({
  preferences,
  season,
  previousPacks = []
}: PackGenerationParams): Promise<CustomPack> {
  // Obtenir les ingrédients de saison
  const seasonalIngredients = await getSeasonalIngredients(season);

  // Filtrer les ingrédients selon les préférences
  const availableIngredients = seasonalIngredients.filter(ingredient => 
    !preferences.excludedIngredients.includes(ingredient.id)
  );

  // Sélectionner les recettes appropriées
  const selectedRecipes = await selectRecipes(preferences, availableIngredients);

  // Calculer les valeurs nutritionnelles
  const nutritionalInfo = calculatePackNutrition(selectedRecipes, preferences.nutritionalGoals);

  // Générer le pack personnalisé
  const customPack: CustomPack = {
    id: crypto.randomUUID(),
    name: `Pack ${season} personnalisé`,
    description: generatePackDescription(selectedRecipes, preferences),
    recipes: selectedRecipes.map(recipe => recipe.id),
    ingredients: aggregateIngredients(selectedRecipes),
    nutritionalInfo,
    price: calculatePackPrice(selectedRecipes),
    season,
    createdAt: new Date().toISOString(),
    validUntil: calculateValidityDate(season)
  };

  return customPack;
}

async function selectRecipes(
  preferences: UserPreferences,
  availableIngredients: Ingredient[]
): Promise<Recipe[]> {
  // Logique de sélection des recettes basée sur :
  // - Préférences alimentaires
  // - Objectifs nutritionnels
  // - Temps de préparation
  // - Budget
  // - Ingrédients disponibles
  // TODO: Implémenter la logique de sélection
  return [];
}

function calculatePackNutrition(
  recipes: Recipe[],
  goals: NutritionalGoals
): NutritionalGoals {
  // Calculer les valeurs nutritionnelles totales du pack
  const totalNutrition = recipes.reduce(
    (acc, recipe) => ({
      calories: acc.calories + (recipe.nutrients?.calories || 0),
      proteins: acc.proteins + (recipe.nutrients?.proteins || 0),
      carbs: acc.carbs + (recipe.nutrients?.carbohydrates || 0),
      fats: acc.fats + (recipe.nutrients?.fat || 0),
      fiber: acc.fiber + (recipe.nutrients?.fiber || 0)
    }),
    { calories: 0, proteins: 0, carbs: 0, fats: 0, fiber: 0 }
  );

  return totalNutrition;
}

function aggregateIngredients(recipes: Recipe[]): Array<{id: string; quantity: number; unit: string}> {
  const ingredientMap = new Map();

  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      const existing = ingredientMap.get(ingredient.id);
      if (existing) {
        existing.quantity += ingredient.quantity;
      } else {
        ingredientMap.set(ingredient.id, {
          id: ingredient.id,
          quantity: ingredient.quantity,
          unit: ingredient.unit
        });
      }
    });
  });

  return Array.from(ingredientMap.values());
}

function generatePackDescription(recipes: Recipe[], preferences: UserPreferences): string {
  const dietaryInfo = preferences.dietaryRestrictions.length > 0
    ? `Adapté aux régimes ${preferences.dietaryRestrictions.join(', ')}`
    : 'Pour tous les régimes';

  const nutritionalFocus = `Objectif : ${
    preferences.nutritionalGoals.calories
  } calories, ${
    preferences.nutritionalGoals.proteins
  }g de protéines par jour`;

  return `${dietaryInfo}. ${nutritionalFocus}. ${recipes.length} recettes équilibrées.`;
}

function calculatePackPrice(recipes: Recipe[]): number {
  return recipes.reduce((total, recipe) => total + recipe.price, 0);
}

function calculateValidityDate(season: string): string {
  const date = new Date();
  // Ajouter 3 mois à la date actuelle
  date.setMonth(date.getMonth() + 3);
  return date.toISOString();
}