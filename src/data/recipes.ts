import { Recipe } from '../types';

export interface RecipeCategory {
  id: string;
  name: string;
  description: string;
}

export const recipeCategories: RecipeCategory[] = [
  { id: 'west-african', name: 'Afrique de l\'Ouest', description: 'Cuisine traditionnelle d\'Afrique de l\'Ouest' },
  { id: 'central-african', name: 'Afrique Centrale', description: 'Saveurs d\'Afrique Centrale' },
  { id: 'east-african', name: 'Afrique de l\'Est', description: 'Spécialités d\'Afrique de l\'Est' },
  { id: 'north-african', name: 'Afrique du Nord', description: 'Cuisine méditerranéenne et berbère' },
  { id: 'southern-african', name: 'Afrique Australe', description: 'Délices d\'Afrique Australe' }
];

export const recipes: Recipe[] = [
  // Côte d'Ivoire
  {
    id: 'attieke-poisson',
    name: 'Attiéké Poisson',
    category: 'LOCAL',
    country: 'Côte d\'Ivoire',
    region: 'west-african',
    preparationTime: 45,
    difficulty: 'MEDIUM',
    servings: 4,
    price: 5000,
    ingredients: [
      { id: 'attieke', name: 'Attiéké', quantity: 500, unit: 'g', category: 'cereals', price: 500 },
      { id: 'fish-tilapia', name: 'Tilapia', quantity: 4, unit: 'pièces', category: 'proteins', price: 2000 },
      { id: 'onion-red', name: 'Oignon rouge', quantity: 2, unit: 'pièces', category: 'vegetables', price: 200 },
      { id: 'tomato', name: 'Tomate', quantity: 4, unit: 'pièces', category: 'vegetables', price: 400 },
      { id: 'pepper-green', name: 'Piment vert', quantity: 2, unit: 'pièces', category: 'spices', price: 100 }
    ],
    instructions: [
      'Nettoyer et écailler le poisson',
      'Préparer une marinade avec du sel, du poivre et du piment',
      'Faire mariner le poisson pendant 30 minutes',
      'Faire griller le poisson sur un barbecue ou une poêle',
      'Pendant ce temps, préparer l\'attiéké à la vapeur',
      'Couper les oignons et les tomates en rondelles',
      'Servir le poisson grillé avec l\'attiéké et la garniture'
    ],
    kitchenEquipment: [
      'Gril ou poêle',
      'Couscoussier ou cuiseur vapeur',
      'Couteau de cuisine',
      'Planche à découper'
    ],
    nutrients: {
      calories: 450,
      proteins: 28,
      carbohydrates: 65,
      fat: 12,
      fiber: 4
    },
    nutritionalScore: 'A',
    ecoScore: 'A',
    novaScore: 1,
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288'
  },

  {
    id: 'sauce-graine',
    name: 'Sauce Graine',
    category: 'LOCAL',
    country: 'Côte d\'Ivoire',
    region: 'west-african',
    preparationTime: 120,
    difficulty: 'HARD',
    servings: 6,
    price: 8000,
    ingredients: [
      { id: 'palm-nuts', name: 'Noix de palme', quantity: 1, unit: 'kg', category: 'nuts', price: 2000 },
      { id: 'beef', name: 'Viande de bœuf', quantity: 500, unit: 'g', category: 'proteins', price: 3500 },
      { id: 'smoked-fish', name: 'Poisson fumé', quantity: 200, unit: 'g', category: 'proteins', price: 1500 },
      { id: 'onion-red', name: 'Oignon rouge', quantity: 2, unit: 'pièces', category: 'vegetables', price: 200 },
      { id: 'garlic', name: 'Ail', quantity: 4, unit: 'gousses', category: 'vegetables', price: 100 }
    ],
    instructions: [
      'Laver et piler les noix de palme',
      'Faire bouillir les noix pilées dans de l\'eau',
      'Extraire le jus des noix en filtrant',
      'Faire revenir la viande avec les oignons et l\'ail',
      'Ajouter le jus de noix de palme et laisser mijoter',
      'Ajouter le poisson fumé émietté',
      'Laisser cuire à feu doux pendant 1 heure',
      'Servir avec du riz blanc ou du foutou'
    ],
    kitchenEquipment: [
      'Mortier et pilon',
      'Grande marmite',
      'Passoire',
      'Spatule en bois'
    ],
    nutrients: {
      calories: 650,
      proteins: 35,
      carbohydrates: 45,
      fat: 38,
      fiber: 6
    },
    nutritionalScore: 'B',
    ecoScore: 'A',
    novaScore: 1,
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
  },

  // Sénégal
  {
    id: 'thieboudienne',
    name: 'Thiéboudienne',
    category: 'LOCAL',
    country: 'Sénégal',
    region: 'west-african',
    preparationTime: 120,
    difficulty: 'HARD',
    servings: 8,
    price: 12000,
    ingredients: [
      { id: 'rice-broken', name: 'Riz brisé', quantity: 1, unit: 'kg', category: 'cereals', price: 1000 },
      { id: 'fish-grouper', name: 'Mérou', quantity: 1, unit: 'kg', category: 'proteins', price: 4000 },
      { id: 'tomato-paste', name: 'Concentré de tomates', quantity: 200, unit: 'g', category: 'vegetables', price: 500 },
      { id: 'carrot', name: 'Carotte', quantity: 500, unit: 'g', category: 'vegetables', price: 500 },
      { id: 'cabbage', name: 'Chou', quantity: 1, unit: 'pièce', category: 'vegetables', price: 600 },
      { id: 'cassava', name: 'Manioc', quantity: 300, unit: 'g', category: 'vegetables', price: 400 }
    ],
    instructions: [
      'Préparer la farce du poisson avec les épices',
      'Faire frire le poisson farci',
      'Préparer la sauce tomate avec les légumes',
      'Cuire les légumes dans la sauce',
      'Cuire le riz dans le bouillon de cuisson',
      'Disposer le riz, le poisson et les légumes'
    ],
    kitchenEquipment: [
      'Grande marmite',
      'Poêle à frire',
      'Écumoire',
      'Couteau de cuisine'
    ],
    nutrients: {
      calories: 750,
      proteins: 42,
      carbohydrates: 85,
      fat: 28,
      fiber: 8
    },
    nutritionalScore: 'B',
    ecoScore: 'A',
    novaScore: 1,
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
  },

  // Mali
  {
    id: 'tiguadege-na',
    name: 'Tiguadègè Na',
    category: 'LOCAL',
    country: 'Mali',
    region: 'west-african',
    preparationTime: 90,
    difficulty: 'MEDIUM',
    servings: 6,
    price: 7500,
    ingredients: [
      { id: 'peanut-paste', name: 'Pâte d\'arachide', quantity: 500, unit: 'g', category: 'legumes', price: 1500 },
      { id: 'beef', name: 'Viande de bœuf', quantity: 750, unit: 'g', category: 'proteins', price: 4000 },
      { id: 'okra', name: 'Gombo', quantity: 300, unit: 'g', category: 'vegetables', price: 600 },
      { id: 'onion-red', name: 'Oignon rouge', quantity: 2, unit: 'pièces', category: 'vegetables', price: 200 }
    ],
    instructions: [
      'Couper la viande en morceaux',
      'Faire revenir la viande avec les oignons',
      'Diluer la pâte d\'arachide dans de l\'eau',
      'Ajouter la sauce d\'arachide à la viande',
      'Ajouter le gombo coupé',
      'Laisser mijoter pendant 1 heure',
      'Servir avec du riz blanc'
    ],
    kitchenEquipment: [
      'Marmite',
      'Spatule en bois',
      'Couteau de cuisine',
      'Bol mélangeur'
    ],
    nutrients: {
      calories: 580,
      proteins: 38,
      carbohydrates: 35,
      fat: 32,
      fiber: 7
    },
    nutritionalScore: 'B',
    ecoScore: 'A',
    novaScore: 1,
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
  },

  // Cameroun
  {
    id: 'ndole',
    name: 'Ndolé',
    category: 'LOCAL',
    country: 'Cameroun',
    region: 'central-african',
    preparationTime: 180,
    difficulty: 'HARD',
    servings: 8,
    price: 10000,
    ingredients: [
      { id: 'bitter-leaf', name: 'Feuilles de ndolé', quantity: 1, unit: 'kg', category: 'vegetables', price: 2000 },
      { id: 'peanut-paste', name: 'Pâte d\'arachide', quantity: 500, unit: 'g', category: 'legumes', price: 1500 },
      { id: 'shrimp-dried', name: 'Crevettes séchées', quantity: 200, unit: 'g', category: 'proteins', price: 2000 },
      { id: 'beef', name: 'Viande de bœuf', quantity: 750, unit: 'g', category: 'proteins', price: 4000 },
      { id: 'garlic', name: 'Ail', quantity: 5, unit: 'gousses', category: 'vegetables', price: 100 }
    ],
    instructions: [
      'Laver et faire bouillir les feuilles de ndolé plusieurs fois',
      'Préparer la sauce à base d\'arachide',
      'Faire revenir la viande avec l\'ail',
      'Ajouter les crevettes séchées',
      'Incorporer les feuilles de ndolé',
      'Mijoter pendant 2 heures',
      'Servir avec du plantain ou du riz'
    ],
    kitchenEquipment: [
      'Grande marmite',
      'Mixeur',
      'Passoire',
      'Spatule en bois'
    ],
    nutrients: {
      calories: 620,
      proteins: 45,
      carbohydrates: 38,
      fat: 35,
      fiber: 12
    },
    nutritionalScore: 'A',
    ecoScore: 'A',
    novaScore: 1,
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
  }
];

// Fonctions utilitaires pour obtenir les recettes
export const getRecipesByCountry = (country: string): Recipe[] => {
  return recipes.filter(recipe => recipe.country === country);
};

export const getRecipesByRegion = (region: string): Recipe[] => {
  return recipes.filter(recipe => recipe.region === region);
};

export const getRecipeById = (recipeId: string): Recipe | undefined => {
  return recipes.find(recipe => recipe.id === recipeId);
};

export const getRecipesByDifficulty = (difficulty: 'EASY' | 'MEDIUM' | 'HARD'): Recipe[] => {
  return recipes.filter(recipe => recipe.difficulty === difficulty);
};

export const getRecipesByPrepTime = (maxTime: number): Recipe[] => {
  return recipes.filter(recipe => recipe.preparationTime <= maxTime);
};

export const getRecipesByIngredients = (ingredientIds: string[]): Recipe[] => {
  return recipes.filter(recipe => 
    ingredientIds.every(id => 
      recipe.ingredients.some(ingredient => ingredient.id === id)
    )
  );
};

export const getRecipesByNutritionalScore = (score: string): Recipe[] => {
  return recipes.filter(recipe => recipe.nutritionalScore === score);
};

export const getRecipesByEcoScore = (score: string): Recipe[] => {
  return recipes.filter(recipe => recipe.ecoScore === score);
};