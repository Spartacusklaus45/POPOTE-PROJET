import { Ingredient } from '../types';

const API_BASE_URL = 'https://ci.openfoodfacts.org/api/v2';

interface OpenFoodFactsProduct {
  code: string;
  product_name: string;
  product_name_fr: string;
  categories_tags: string[];
  nutriments: {
    energy_100g: number;
    proteins_100g: number;
    carbohydrates_100g: number;
    fat_100g: number;
    fiber_100g: number;
  };
  nutriscore_grade?: string;
  ecoscore_grade?: string;
  nova_group?: number;
  image_url?: string;
  quantity?: string;
  brands?: string;
  origins?: string;
}

export async function searchProducts(query: string): Promise<Ingredient[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/search?country_tags=ci&search_terms=${encodeURIComponent(query)}&json=1`
    );
    const data = await response.json();
    
    return data.products.map((product: OpenFoodFactsProduct) => transformToIngredient(product));
  } catch (error) {
    console.error('Erreur lors de la recherche de produits:', error);
    return [];
  }
}

export async function getProductByBarcode(barcode: string): Promise<Ingredient | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/product/${barcode}.json`);
    const data = await response.json();
    
    if (data.status === 1) {
      return transformToIngredient(data.product);
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return null;
  }
}

function transformToIngredient(product: OpenFoodFactsProduct): Ingredient {
  // Déterminer la catégorie en fonction des tags
  let category = 'other';
  if (product.categories_tags) {
    if (product.categories_tags.some(tag => tag.includes('cereals'))) {
      category = 'cereals';
    } else if (product.categories_tags.some(tag => tag.includes('meat') || tag.includes('fish'))) {
      category = 'proteins';
    } else if (product.categories_tags.some(tag => tag.includes('vegetables'))) {
      category = 'vegetables';
    } else if (product.categories_tags.some(tag => tag.includes('fruits'))) {
      category = 'fruits';
    } else if (product.categories_tags.some(tag => tag.includes('spices'))) {
      category = 'spices';
    }
  }

  // Extraire la quantité et l'unité du champ quantity
  let quantity = 1;
  let unit = 'pièce';
  if (product.quantity) {
    const match = product.quantity.match(/(\d+)\s*([a-zA-Z]+)/);
    if (match) {
      quantity = parseInt(match[1]);
      unit = match[2].toLowerCase();
    }
  }

  return {
    id: product.code,
    name: product.product_name_fr || product.product_name,
    category,
    quantity,
    unit,
    price: 0, // Le prix devra être ajouté manuellement car non disponible dans l'API
    nutritionalScore: product.nutriscore_grade?.toUpperCase() || 'N/A',
    ecoScore: product.ecoscore_grade?.toUpperCase() || 'N/A',
    novaScore: product.nova_group || 0,
    imageUrl: product.image_url,
    brand: product.brands,
    origin: product.origins,
    nutriments: {
      energy: product.nutriments.energy_100g,
      proteins: product.nutriments.proteins_100g,
      carbohydrates: product.nutriments.carbohydrates_100g,
      fat: product.nutriments.fat_100g,
      fiber: product.nutriments.fiber_100g
    }
  };
}

export async function enrichIngredientData(ingredient: Ingredient): Promise<Ingredient> {
  try {
    const searchResults = await searchProducts(ingredient.name);
    if (searchResults.length > 0) {
      const enrichedData = searchResults[0];
      return {
        ...ingredient,
        nutritionalScore: enrichedData.nutritionalScore,
        ecoScore: enrichedData.ecoScore,
        novaScore: enrichedData.novaScore,
        imageUrl: enrichedData.imageUrl,
        nutriments: enrichedData.nutriments,
        brand: enrichedData.brand,
        origin: enrichedData.origin
      };
    }
    return ingredient;
  } catch (error) {
    console.error('Erreur lors de l\'enrichissement des données:', error);
    return ingredient;
  }
}