export const recipes = [
  {
    id: 'attieke-poisson',
    name: 'Attiéké Poisson',
    category: 'LOCAL',
    description: 'Un plat traditionnel ivoirien à base d\'attiéké et de poisson grillé',
    preparationTime: 45,
    difficulty: 'MEDIUM',
    servings: 4,
    price: 5000,
    ingredients: [
      {
        id: 'attieke',
        quantity: 500,
        unit: 'g'
      },
      {
        id: 'fish-tilapia',
        quantity: 1,
        unit: 'kg'
      },
      {
        id: 'onion-red',
        quantity: 200,
        unit: 'g'
      },
      {
        id: 'tomato',
        quantity: 300,
        unit: 'g'
      }
    ],
    instructions: [
      'Nettoyer et écailler le poisson',
      'Préparer une marinade avec du sel, du poivre et du piment',
      'Faire mariner le poisson pendant 30 minutes',
      'Faire griller le poisson',
      'Servir avec l\'attiéké et la garniture'
    ],
    imageUrl: 'https://example.com/images/attieke-poisson.jpg',
    nutritionalScore: 'A',
    ecoScore: 'A',
    novaScore: 1,
    nutrients: {
      calories: 450,
      proteins: 28,
      carbohydrates: 65,
      fat: 12,
      fiber: 4
    }
  },
  {
    id: 'sauce-graine',
    name: 'Sauce Graine',
    category: 'LOCAL',
    description: 'Une sauce traditionnelle à base de graines de palme',
    preparationTime: 120,
    difficulty: 'HARD',
    servings: 6,
    price: 8000,
    ingredients: [
      {
        id: 'palm-nuts',
        quantity: 1,
        unit: 'kg'
      },
      {
        id: 'beef',
        quantity: 500,
        unit: 'g'
      },
      {
        id: 'onion-red',
        quantity: 200,
        unit: 'g'
      },
      {
        id: 'garlic',
        quantity: 50,
        unit: 'g'
      }
    ],
    instructions: [
      'Piler les graines de palme',
      'Extraire le jus des graines',
      'Faire revenir la viande',
      'Cuire la sauce à feu doux',
      'Servir avec du riz ou du foutou'
    ],
    imageUrl: 'https://example.com/images/sauce-graine.jpg',
    nutritionalScore: 'B',
    ecoScore: 'A',
    novaScore: 1,
    nutrients: {
      calories: 650,
      proteins: 35,
      carbohydrates: 45,
      fat: 38,
      fiber: 6
    }
  }
];