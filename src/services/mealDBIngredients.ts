import { Ingredient } from '../types';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const IMG_BASE_URL = 'https://www.themealdb.com/images/ingredients';

interface MealDBIngredient {
  idIngredient: string;
  strIngredient: string;
  strDescription: string | null;
  strType: string | null;
}

export async function fetchAllIngredients(): Promise<Ingredient[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/list.php?i=list`);
    const data = await response.json();
    return data.meals.map(transformIngredient);
  } catch (error) {
    console.error('Erreur lors de la récupération des ingrédients:', error);
    return [];
  }
}

export async function searchIngredientsByName(name: string): Promise<Ingredient[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/filter.php?i=${encodeURIComponent(name)}`);
    const data = await response.json();
    return data.meals ? data.meals.map(transformIngredient) : [];
  } catch (error) {
    console.error('Erreur lors de la recherche des ingrédients:', error);
    return [];
  }
}

function transformIngredient(ingredient: MealDBIngredient): Ingredient {
  const name = ingredient.strIngredient;
  const category = determineCategory(ingredient.strType || '', name);
  
  return {
    id: `mealdb-${ingredient.idIngredient}`,
    name,
    category,
    quantity: 0,
    unit: determineDefaultUnit(name),
    price: 0, // Le prix devra être ajouté manuellement
    imageUrl: `${IMG_BASE_URL}/${encodeURIComponent(name)}.png`,
    description: ingredient.strDescription || undefined,
    nutritionalScore: 'N/A',
    ecoScore: 'N/A',
    novaScore: 0
  };
}

function determineCategory(type: string, name: string): string {
  // Catégorisation basée sur le type fourni par l'API
  const typeMap: { [key: string]: string } = {
    'Meat': 'proteins',
    'Fish': 'proteins',
    'Vegetable': 'vegetables',
    'Fruit': 'fruits',
    'Spice': 'spices',
    'Oil': 'oils',
    'Grain': 'cereals',
    'Dairy': 'dairy',
    'Nut': 'nuts',
    'Legume': 'legumes'
  };

  if (type && typeMap[type]) {
    return typeMap[type];
  }

  // Catégorisation basée sur le nom si le type n'est pas disponible
  const namePatterns = [
    { pattern: /(rice|flour|pasta|bread|couscous)/i, category: 'cereals' },
    { pattern: /(chicken|beef|pork|fish|meat)/i, category: 'proteins' },
    { pattern: /(carrot|onion|garlic|tomato|potato)/i, category: 'vegetables' },
    { pattern: /(apple|banana|orange|lemon|mango)/i, category: 'fruits' },
    { pattern: /(pepper|salt|cumin|spice|herb)/i, category: 'spices' },
    { pattern: /(milk|cheese|cream|yogurt)/i, category: 'dairy' },
    { pattern: /(oil|butter|ghee)/i, category: 'oils' },
    { pattern: /(almond|cashew|peanut|walnut)/i, category: 'nuts' },
    { pattern: /(bean|lentil|pea)/i, category: 'legumes' }
  ];

  for (const { pattern, category } of namePatterns) {
    if (pattern.test(name)) {
      return category;
    }
  }

  return 'other';
}

function determineDefaultUnit(name: string): string {
  const unitPatterns = [
    { pattern: /(flour|sugar|rice|grain|spice)/i, unit: 'g' },
    { pattern: /(oil|milk|juice|water)/i, unit: 'ml' },
    { pattern: /(onion|apple|lemon|egg)/i, unit: 'pièce' },
    { pattern: /(meat|fish)/i, unit: 'kg' },
    { pattern: /(herb|leaf)/i, unit: 'botte' }
  ];

  for (const { pattern, unit } of unitPatterns) {
    if (pattern.test(name)) {
      return unit;
    }
  }

  return 'g';
}