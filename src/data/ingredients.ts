import { Ingredient } from '../types';

export interface IngredientCategory {
  id: string;
  name: string;
  description: string;
}

export const categories: IngredientCategory[] = [
  { id: 'cereals', name: 'Céréales et Féculents', description: 'Base de l\'alimentation' },
  { id: 'proteins', name: 'Protéines', description: 'Viandes, poissons et légumineuses' },
  { id: 'vegetables', name: 'Légumes', description: 'Légumes frais et secs' },
  { id: 'fruits', name: 'Fruits', description: 'Fruits frais et secs' },
  { id: 'spices', name: 'Épices et Condiments', description: 'Assaisonnements et aromates' },
  { id: 'oils', name: 'Huiles et Matières grasses', description: 'Huiles et graisses de cuisson' },
  { id: 'dairy', name: 'Produits Laitiers', description: 'Lait et dérivés' },
  { id: 'nuts', name: 'Noix et Graines', description: 'Fruits secs et graines' },
  { id: 'legumes', name: 'Légumineuses', description: 'Haricots et légumineuses' }
];

export const ingredients: Ingredient[] = [
  // Céréales et Féculents
  {
    id: 'attieke',
    name: 'Attiéké',
    category: 'cereals',
    price: 500,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'rice-local',
    name: 'Riz local',
    category: 'cereals',
    price: 600,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'rice-imported',
    name: 'Riz importé',
    category: 'cereals',
    price: 800,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'rice-basmati',
    name: 'Riz Basmati',
    category: 'cereals',
    price: 1200,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'millet',
    name: 'Mil',
    category: 'cereals',
    price: 450,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'sorghum',
    name: 'Sorgho',
    category: 'cereals',
    price: 400,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'maize',
    name: 'Maïs',
    category: 'cereals',
    price: 400,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'maize-flour',
    name: 'Farine de maïs',
    category: 'cereals',
    price: 500,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'yam',
    name: 'Igname',
    category: 'cereals',
    price: 800,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'yam-flour',
    name: 'Farine d\'igname',
    category: 'cereals',
    price: 1000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'cassava',
    name: 'Manioc',
    category: 'cereals',
    price: 300,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'gari',
    name: 'Gari',
    category: 'cereals',
    price: 600,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'plantain',
    name: 'Banane plantain',
    category: 'cereals',
    price: 700,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'plantain-flour',
    name: 'Farine de plantain',
    category: 'cereals',
    price: 1200,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'fonio',
    name: 'Fonio',
    category: 'cereals',
    price: 1500,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'sweet-potato',
    name: 'Patate douce',
    category: 'cereals',
    price: 600,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'taro',
    name: 'Taro',
    category: 'cereals',
    price: 700,
    unit: 'kg',
    quantity: 1
  },

  // Protéines
  {
    id: 'beef',
    name: 'Viande de bœuf',
    category: 'proteins',
    price: 3500,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'beef-with-bones',
    name: 'Viande de bœuf avec os',
    category: 'proteins',
    price: 3000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'beef-liver',
    name: 'Foie de bœuf',
    category: 'proteins',
    price: 4000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'tripe',
    name: 'Tripes',
    category: 'proteins',
    price: 2500,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'chicken-local',
    name: 'Poulet local',
    category: 'proteins',
    price: 2500,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'chicken-imported',
    name: 'Poulet importé',
    category: 'proteins',
    price: 2000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'chicken-legs',
    name: 'Cuisses de poulet',
    category: 'proteins',
    price: 2200,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'chicken-wings',
    name: 'Ailes de poulet',
    category: 'proteins',
    price: 2300,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'guinea-fowl',
    name: 'Pintade',
    category: 'proteins',
    price: 3500,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'lamb',
    name: 'Mouton',
    category: 'proteins',
    price: 4000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'goat',
    name: 'Chèvre',
    category: 'proteins',
    price: 3800,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'rabbit',
    name: 'Lapin',
    category: 'proteins',
    price: 3500,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'fish-tilapia',
    name: 'Tilapia',
    category: 'proteins',
    price: 2000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'fish-mackerel',
    name: 'Maquereau',
    category: 'proteins',
    price: 1800,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'fish-capitaine',
    name: 'Capitaine',
    category: 'proteins',
    price: 3500,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'fish-carpe',
    name: 'Carpe',
    category: 'proteins',
    price: 2500,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'fish-sole',
    name: 'Sole',
    category: 'proteins',
    price: 4000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'fish-bar',
    name: 'Bar',
    category: 'proteins',
    price: 3500,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'dried-fish',
    name: 'Poisson séché',
    category: 'proteins',
    price: 5000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'smoked-fish',
    name: 'Poisson fumé',
    category: 'proteins',
    price: 4500,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'shrimp-fresh',
    name: 'Crevettes fraîches',
    category: 'proteins',
    price: 6000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'shrimp-dried',
    name: 'Crevettes séchées',
    category: 'proteins',
    price: 8000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'crab',
    name: 'Crabe',
    category: 'proteins',
    price: 4000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'snail',
    name: 'Escargot',
    category: 'proteins',
    price: 3500,
    unit: 'kg',
    quantity: 1
  },

  // Légumes
  {
    id: 'tomato',
    name: 'Tomate',
    category: 'vegetables',
    price: 800,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'tomato-cherry',
    name: 'Tomate cerise',
    category: 'vegetables',
    price: 1200,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'onion-red',
    name: 'Oignon rouge',
    category: 'vegetables',
    price: 600,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'onion-white',
    name: 'Oignon blanc',
    category: 'vegetables',
    price: 700,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'spring-onion',
    name: 'Oignon vert',
    category: 'vegetables',
    price: 500,
    unit: 'botte',
    quantity: 1
  },
  {
    id: 'garlic',
    name: 'Ail',
    category: 'vegetables',
    price: 2000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'ginger',
    name: 'Gingembre',
    category: 'vegetables',
    price: 1500,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'okra',
    name: 'Gombo',
    category: 'vegetables',
    price: 1000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'okra-dried',
    name: 'Gombo séché',
    category: 'vegetables',
    price: 2000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'eggplant-african',
    name: 'Aubergine africaine',
    category: 'vegetables',
    price: 900,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'eggplant-garden',
    name: 'Aubergine violette',
    category: 'vegetables',
    price: 1200,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'pepper-green',
    name: 'Piment vert',
    category: 'vegetables',
    price: 1200,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'pepper-red',
    name: 'Piment rouge',
    category: 'vegetables',
    price: 1200,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'pepper-habanero',
    name: 'Piment habanero',
    category: 'vegetables',
    price: 1500,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'pepper-bird',
    name: 'Piment oiseau',
    category: 'vegetables',
    price: 2000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'cassava-leaves',
    name: 'Feuilles de manioc',
    category: 'vegetables',
    price: 500,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'sweet-potato-leaves',
    name: 'Feuilles de patate douce',
    category: 'vegetables',
    price: 400,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'spinach-african',
    name: 'Épinard africain',
    category: 'vegetables',
    price: 500,
    unit: 'botte',
    quantity: 1
  },
  {
    id: 'amaranth-leaves',
    name: 'Feuilles d\'amarante',
    category: 'vegetables',
    price: 400,
    unit: 'botte',
    quantity: 1
  },
  {
    id: 'sorrel-leaves',
    name: 'Feuilles d\'oseille',
    category: 'vegetables',
    price: 400,
    unit: 'botte',
    quantity: 1
  },
  {
    id: 'moringa-leaves',
    name: 'Feuilles de moringa',
    category: 'vegetables',
    price: 600,
    unit: 'botte',
    quantity: 1
  },
  {
    id: 'bitter-leaf',
    name: 'Feuilles amères',
    category: 'vegetables',
    price: 500,
    unit: 'botte',
    quantity: 1
  },
  {
    id: 'carrot',
    name: 'Carotte',
    category: 'vegetables',
    price: 800,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'cabbage',
    name: 'Chou',
    category: 'vegetables',
    price: 700,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'lettuce',
    name: 'Laitue',
    category: 'vegetables',
    price: 600,
    unit: 'pièce',
    quantity: 1
  },
  {
    id: 'cucumber',
    name: 'Concombre',
    category: 'vegetables',
    price: 500,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'zucchini',
    name: 'Courgette',
    category: 'vegetables',
    price: 800,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'green-beans',
    name: 'Haricots verts',
    category: 'vegetables',
    price: 1000,
    unit: 'kg',
    quantity: 1
  },

  // Fruits
  {
    id: 'mango',
    name: 'Mangue',
    category: 'fruits',
    price: 800,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'papaya',
    name: 'Papaye',
    category: 'fruits',
    price: 600,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'pineapple',
    name: 'Ananas',
    category: 'fruits',
    price: 1000,
    unit: 'pièce',
    quantity: 1
  },
  {
    id: 'banana',
    name: 'Banane douce',
    category: 'fruits',
    price: 500,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'orange',
    name: 'Orange',
    category: 'fruits',
    price: 600,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'lime',
    name: 'Citron vert',
    category: 'fruits',
    price: 800,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'coconut',
    name: 'Noix de coco',
    category: 'fruits',
    price: 500,
    unit: 'pièce',
    quantity: 1
  },
  {
    id: 'avocado',
    name: 'Avocat',
    category: 'fruits',
    price: 1000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'soursop',
    name: 'Corossol',
    category: 'fruits',
    price: 1200,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'passion-fruit',
    name: 'Fruit de la passion',
    category: 'fruits',
    price: 1500,
    unit: 'kg',
    quantity: 1
  },

  // Épices et Condiments
  {
    id: 'pepper-dried',
    name: 'Piment séché',
    category: 'spices',
    price: 3000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'pepper-powder',
    name: 'Piment en poudre',
    category: 'spices',
    price: 4000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'african-nutmeg',
    name: 'Noix de muscade africaine',
    category: 'spices',
    price: 4000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'grains-of-paradise',
    name: 'Poivre de Guinée',
    category: 'spices',
    price: 5000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'african-black-pepper',
    name: 'Poivre noir',
    category: 'spices',
    price: 6000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'white-pepper',
    name: 'Poivre blanc',
    category: 'spices',
    price: 7000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'bay-leaves',
    name: 'Feuilles de laurier',
    category: 'spices',
    price: 2500,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'thyme',
    name: 'Thym',
    category: 'spices',
    price: 2000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'rosemary',
    name: 'Romarin',
    category: 'spices',
    price: 2000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'parsley',
    name: 'Persil',
    category: 'spices',
    price: 500,
    unit: 'botte',
    quantity: 1
  },
  {
    id: 'cilantro',
    name: 'Coriandre',
    category: 'spices',
    price: 500,
    unit: 'botte',
    quantity: 1
  },
  {
    id: 'mint',
    name: 'Menthe',
    category: 'spices',
    price: 500,
    unit: 'botte',
    quantity: 1
  },
  {
    id: 'basil',
    name: 'Basilic',
    category: 'spices',
    price: 500,
    unit: 'botte',
    quantity: 1
  },
  {
    id: 'bouillon-cube',
    name: 'Cube Maggi',
    category: 'spices',
    price: 50,
    unit: 'unité',
    quantity: 1
  },
  {
    id: 'stock-powder',
    name: 'Poudre d\'assaisonnement',
    category: 'spices',
    price: 100,
    unit: 'sachet',
    quantity: 1
  },
  {
    id: 'curry-powder',
    name: 'Poudre de curry',
    category: 'spices',
    price: 3000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'ginger-powder',
    name: 'Gingembre en poudre',
    category: 'spices',
    price: 4000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'garlic-powder',
    name: 'Ail en poudre',
    category: 'spices',
    price: 4000,
    unit: 'kg',
    quantity: 1
  },

  // Huiles et Matières grasses
  {
    id: 'palm-oil-red',
    name: 'Huile de palme rouge',
    category: 'oils',
    price: 1500,
    unit: 'litre',
    quantity: 1
  },
  {
    id: 'palm-oil-refined',
    name: 'Huile de palme raffinée',
    category: 'oils',
    price: 1200,
    unit: 'litre',
    quantity: 1
  },
  {
    id: 'peanut-oil',
    name: 'Huile d\'arachide',
    category: 'oils',
    price: 1200,
    unit: 'litre',
    quantity: 1
  },
  {
    id: 'shea-butter',
    name: 'Beurre de karité',
    category: 'oils',
    price: 2000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'coconut-oil',
    name: 'Huile de coco',
    category: 'oils',
    price: 2500,
    unit: 'litre',
    quantity: 1
  },
  {
    id: 'olive-oil',
    name: 'Huile d\'olive',
    category: 'oils',
    price: 3000,
    unit: 'litre',
    quantity: 1
  },

  // Légumineuses
  {
    id: 'black-eyed-peas',
    name: 'Haricots niébé',
    category: 'legumes',
    price: 1000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'red-beans',
    name: 'Haricots rouges',
    category: 'legumes',
    price: 1200,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'white-beans',
    name: 'Haricots blancs',
    category: 'legumes',
    price: 1200,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'bambara-groundnuts',
    name: 'Voandzou',
    category: 'legumes',
    price: 1500,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'peanuts',
    name: 'Arachides',
    category: 'legumes',
    price: 1000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'peanut-paste',
    name: 'Pâte d\'arachide',
    category: 'legumes',
    price: 2000,
    unit: 'kg',
    quantity: 1
  },

  // Noix et Graines
  {
    id: 'cashew',
    name: 'Noix de cajou',
    category: 'nuts',
    price: 5000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'palm-kernels',
    name: 'Noix de palme',
    category: 'nuts',
    price: 2000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'sesame-seeds',
    name: 'Graines de sésame',
    category: 'nuts',
    price: 3000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'egusi',
    name: 'Graines de courge (Egusi)',
    category: 'nuts',
    price: 4000,
    unit: 'kg',
    quantity: 1
  },
  {
    id: 'tiger-nuts',
    name: 'Noix tigrées',
    category: 'nuts',
    price: 3500,
    unit: 'kg',
    quantity: 1
  }
];

// Fonction utilitaire pour obtenir les ingrédients par catégorie
export const getIngredientsByCategory = (categoryId: string): Ingredient[] => {
  return ingredients.filter(ingredient => ingredient.category === categoryId);
};

// Fonction utilitaire pour obtenir un ingrédient par son ID
export const getIngredientById = (ingredientId: string): Ingredient | undefined => {
  return ingredients.find(ingredient => ingredient.id === ingredientId);
};

// Fonction utilitaire pour calculer le prix d'un ingrédient selon la quantité
export const calculateIngredientPrice = (ingredientId: string, quantity: number): number => {
  const ingredient = getIngredientById(ingredientId);
  if (!ingredient) return 0;
  return ingredient.price * quantity;
};