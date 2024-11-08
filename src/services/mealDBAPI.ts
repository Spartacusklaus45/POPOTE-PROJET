import { Recipe, Ingredient } from '../types';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

interface MealDBRecipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  [key: string]: string | undefined;
}

export async function fetchAllRecipes(): Promise<Recipe[]> {
  try {
    const categories = await fetchCategories();
    const recipes: Recipe[] = [];

    for (const category of categories) {
      const categoryRecipes = await fetchRecipesByCategory(category);
      recipes.push(...categoryRecipes);
    }

    return recipes;
  } catch (error) {
    console.error('Erreur lors de la récupération des recettes:', error);
    return [];
  }
}

async function fetchCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/list.php?c=list`);
  const data = await response.json();
  return data.meals.map((meal: { strCategory: string }) => meal.strCategory);
}

async function fetchRecipesByCategory(category: string): Promise<Recipe[]> {
  const response = await fetch(`${API_BASE_URL}/filter.php?c=${category}`);
  const data = await response.json();
  const recipes: Recipe[] = [];

  for (const meal of data.meals) {
    const fullRecipe = await fetchRecipeById(meal.idMeal);
    if (fullRecipe) {
      recipes.push(fullRecipe);
    }
  }

  return recipes;
}

async function fetchRecipeById(id: string): Promise<Recipe | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();
    const mealData: MealDBRecipe = data.meals[0];

    const ingredients: Ingredient[] = [];
    
    for (let i = 1; i <= 20; i++) {
      const ingredientName = mealData[`strIngredient${i}`];
      const measure = mealData[`strMeasure${i}`];
      
      if (ingredientName && measure && ingredientName.trim() !== '') {
        ingredients.push({
          id: `${mealData.idMeal}-ing-${i}`,
          name: ingredientName,
          quantity: parseQuantity(measure),
          unit: parseUnit(measure),
          category: determineCategory(ingredientName),
          price: 0
        });
      }
    }

    const recipe: Recipe = {
      id: mealData.idMeal,
      name: mealData.strMeal,
      category: mealData.strArea === 'African' ? 'LOCAL' : 'INTERNATIONAL',
      preparationTime: estimatePrepTime(mealData.strInstructions),
      difficulty: determineDifficulty(mealData.strInstructions, ingredients.length),
      servings: 4,
      ingredients,
      instructions: mealData.strInstructions.split('\r\n').filter(step => step.trim() !== ''),
      nutritionalScore: 'B',
      ecoScore: 'B',
      novaScore: 1,
      imageUrl: mealData.strMealThumb,
      videoUrl: mealData.strYoutube
    };

    return recipe;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la recette ${id}:`, error);
    return null;
  }
}

function parseQuantity(measure: string): number {
  const numericPart = measure.match(/\d+(\.\d+)?/);
  return numericPart ? parseFloat(numericPart[0]) : 1;
}

function parseUnit(measure: string): string {
  const units = ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'oz', 'lb'];
  for (const unit of units) {
    if (measure.toLowerCase().includes(unit)) {
      return unit;
    }
  }
  return 'pièce';
}

function determineCategory(ingredient: string): string {
  const categories = {
    cereals: ['rice', 'flour', 'pasta', 'bread'],
    proteins: ['meat', 'fish', 'chicken', 'beef', 'pork', 'egg'],
    vegetables: ['onion', 'tomato', 'carrot', 'potato', 'garlic'],
    fruits: ['apple', 'banana', 'orange', 'lemon'],
    spices: ['pepper', 'salt', 'cumin', 'coriander'],
    dairy: ['milk', 'cheese', 'cream', 'butter'],
    oils: ['oil', 'olive']
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => ingredient.toLowerCase().includes(keyword))) {
      return category;
    }
  }

  return 'other';
}

function estimatePrepTime(instructions: string): number {
  const steps = instructions.split('\r\n').filter(step => step.trim() !== '');
  return Math.max(30, steps.length * 15);
}

function determineDifficulty(instructions: string, ingredientCount: number): 'EASY' | 'MEDIUM' | 'HARD' {
  const complexity = instructions.split('\r\n').filter(step => step.trim() !== '').length + ingredientCount;
  if (complexity < 8) return 'EASY';
  if (complexity < 15) return 'MEDIUM';
  return 'HARD';
}