import type { IngredientSubstitution, DietaryRestriction } from '../types/substitutions';

export const dietaryRestrictions: DietaryRestriction[] = [
  {
    id: 'gluten-free',
    name: 'Sans gluten',
    description: 'Exclut tous les aliments contenant du gluten',
    ingredientsToAvoid: ['wheat-flour', 'barley', 'rye'],
    commonSubstitutes: [
      {
        ingredientId: 'wheat-flour',
        substitutes: ['rice-flour', 'almond-flour', 'cassava-flour']
      }
    ]
  },
  {
    id: 'dairy-free',
    name: 'Sans lactose',
    description: 'Exclut tous les produits laitiers',
    ingredientsToAvoid: ['milk', 'cream', 'cheese', 'butter'],
    commonSubstitutes: [
      {
        ingredientId: 'milk',
        substitutes: ['almond-milk', 'soy-milk', 'oat-milk']
      },
      {
        ingredientId: 'butter',
        substitutes: ['coconut-oil', 'olive-oil']
      }
    ]
  },
  {
    id: 'vegan',
    name: 'Végétalien',
    description: 'Exclut tous les produits d\'origine animale',
    ingredientsToAvoid: ['meat', 'fish', 'eggs', 'dairy'],
    commonSubstitutes: [
      {
        ingredientId: 'eggs',
        substitutes: ['flax-eggs', 'chia-eggs', 'banana']
      },
      {
        ingredientId: 'honey',
        substitutes: ['maple-syrup', 'agave-nectar']
      }
    ]
  }
];

export const substitutions: IngredientSubstitution[] = [
  {
    id: 'sub-1',
    originalIngredientId: 'eggs',
    substituteIngredientId: 'flax-eggs',
    ratio: 1, // 1 œuf = 1 œuf de lin
    dietaryTags: ['vegan', 'egg-free'],
    rating: 4.5,
    reviewsCount: 128,
    description: 'Œuf de lin (1 c. à soupe de graines de lin moulues + 3 c. à soupe d\'eau)',
    tips: 'Laisser reposer 5 minutes avant utilisation pour obtenir une consistance gélatineuse'
  },
  {
    id: 'sub-2',
    originalIngredientId: 'wheat-flour',
    substituteIngredientId: 'almond-flour',
    ratio: 1, // 1:1 remplacement
    dietaryTags: ['gluten-free', 'grain-free', 'keto'],
    rating: 4.2,
    reviewsCount: 95,
    description: 'Farine d\'amande',
    tips: 'Peut rendre la texture plus dense et humide. Idéal pour les gâteaux et biscuits'
  },
  {
    id: 'sub-3',
    originalIngredientId: 'milk',
    substituteIngredientId: 'coconut-milk',
    ratio: 1, // 1:1 remplacement
    dietaryTags: ['dairy-free', 'vegan'],
    rating: 4.7,
    reviewsCount: 156,
    description: 'Lait de coco',
    tips: 'Apporte une saveur légèrement sucrée et une texture crémeuse'
  }
];