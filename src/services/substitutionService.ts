import { Ingredient } from '../types';
import { IngredientSubstitution, FlavorProfile, TextureProfile, CookingProperties } from '../types/substitutions';
import { ingredients } from '../data/ingredients';

// Calculer la similarité entre deux profils de saveur
function calculateFlavorSimilarity(profile1: FlavorProfile, profile2: FlavorProfile): number {
  const attributes = ['sweet', 'salty', 'sour', 'bitter', 'umami'] as const;
  let similarity = 0;

  attributes.forEach(attr => {
    const diff = Math.abs(profile1[attr] - profile2[attr]);
    similarity += 1 - (diff / 5); // Normaliser la différence
  });

  return similarity / attributes.length;
}

// Calculer la similarité entre deux profils de texture
function calculateTextureSimilarity(profile1: TextureProfile, profile2: TextureProfile): number {
  const attributes = ['creamy', 'crunchy', 'chewy', 'liquid'] as const;
  let similarity = 0;

  attributes.forEach(attr => {
    const diff = Math.abs(profile1[attr] - profile2[attr]);
    similarity += 1 - (diff / 5);
  });

  return similarity / attributes.length;
}

// Calculer la similarité des propriétés de cuisson
function calculateCookingPropertiesSimilarity(
  props1: CookingProperties,
  props2: CookingProperties
): number {
  let similarity = 0;

  // Comparer la stabilité à la chaleur
  similarity += 1 - (Math.abs(props1.heatStability - props2.heatStability) / 5);
  
  // Comparer le contenu en humidité
  similarity += 1 - (Math.abs(props1.moistureContent - props2.moistureContent) / 5);
  
  // Comparer le pouvoir liant
  similarity += 1 - (Math.abs(props1.bindingPower - props2.bindingPower) / 5);
  
  // Comparer la propriété levante
  similarity += props1.leavening === props2.leavening ? 1 : 0;

  return similarity / 4;
}

// Trouver les meilleurs substituts pour un ingrédient
export function findBestSubstitutes(
  ingredient: Ingredient,
  dietaryRestrictions: string[] = []
): IngredientSubstitution[] {
  const substitutes: IngredientSubstitution[] = [];

  // Filtrer les ingrédients potentiels selon les restrictions alimentaires
  const potentialSubstitutes = ingredients.filter(ing => 
    ing.id !== ingredient.id &&
    ing.category === ingredient.category &&
    !dietaryRestrictions.some(restriction => 
      ing.dietaryTags?.includes(restriction)
    )
  );

  potentialSubstitutes.forEach(substitute => {
    // Calculer les scores de similarité
    const flavorSimilarity = calculateFlavorSimilarity(
      ingredient.flavorProfile,
      substitute.flavorProfile
    );

    const textureSimilarity = calculateTextureSimilarity(
      ingredient.textureProfile,
      substitute.textureProfile
    );

    const cookingPropertiesSimilarity = calculateCookingPropertiesSimilarity(
      ingredient.cookingProperties,
      substitute.cookingProperties
    );

    // Calculer le score global de similarité
    const similarityScore = (
      flavorSimilarity * 0.4 + // Donner plus de poids à la saveur
      textureSimilarity * 0.3 +
      cookingPropertiesSimilarity * 0.3
    );

    // Ne garder que les substituts avec un score de similarité élevé
    if (similarityScore > 0.7) {
      substitutes.push({
        id: `sub-${ingredient.id}-${substitute.id}`,
        originalIngredientId: ingredient.id,
        substituteIngredientId: substitute.id,
        ratio: calculateSubstitutionRatio(ingredient, substitute),
        flavorProfile: substitute.flavorProfile,
        textureProfile: substitute.textureProfile,
        cookingProperties: substitute.cookingProperties,
        dietaryTags: substitute.dietaryTags || [],
        rating: 0,
        reviewsCount: 0,
        description: generateSubstitutionDescription(ingredient, substitute),
        tips: generateSubstitutionTips(ingredient, substitute),
        similarityScore
      });
    }
  });

  // Trier par score de similarité
  return substitutes.sort((a, b) => 
    (b.similarityScore || 0) - (a.similarityScore || 0)
  );
}

// Calculer le ratio de substitution basé sur les propriétés des ingrédients
function calculateSubstitutionRatio(original: Ingredient, substitute: Ingredient): number {
  // Tenir compte de la densité, de l'humidité et du pouvoir aromatique
  const moistureRatio = substitute.cookingProperties.moistureContent / 
    original.cookingProperties.moistureContent;
  
  const bindingRatio = substitute.cookingProperties.bindingPower /
    original.cookingProperties.bindingPower;

  // Ajuster le ratio en fonction des propriétés
  let ratio = (moistureRatio + bindingRatio) / 2;
  
  // Normaliser le ratio pour éviter les valeurs extrêmes
  ratio = Math.max(0.5, Math.min(2, ratio));
  
  return Math.round(ratio * 100) / 100; // Arrondir à 2 décimales
}

function generateSubstitutionDescription(
  original: Ingredient,
  substitute: Ingredient
): string {
  return `Remplacer ${original.name} par ${substitute.name} pour une alternative ` +
    `${substitute.dietaryTags?.join(', ')}. Saveur et texture similaires.`;
}

function generateSubstitutionTips(
  original: Ingredient,
  substitute: Ingredient
): string {
  const tips: string[] = [];

  // Conseils basés sur les différences de propriétés
  if (substitute.cookingProperties.moistureContent > original.cookingProperties.moistureContent) {
    tips.push('Réduire légèrement la quantité de liquide dans la recette');
  }

  if (substitute.cookingProperties.bindingPower < original.cookingProperties.bindingPower) {
    tips.push('Ajouter un agent liant si nécessaire');
  }

  if (substitute.cookingProperties.heatStability < original.cookingProperties.heatStability) {
    tips.push('Surveiller attentivement la cuisson car cet ingrédient est plus sensible à la chaleur');
  }

  return tips.join('. ');
}