import { Ingredient } from '../types';

const API_BASE_URL = 'https://ci.openfoodfacts.org/api/v2';

interface ProductFilters {
  category?: string;
  origins?: string;
  brands?: string;
  labels?: string;
  page?: number;
  pageSize?: number;
}

export async function fetchProducts(filters: ProductFilters = {}) {
  try {
    const queryParams = new URLSearchParams({
      country_tags: 'ci',
      json: '1',
      page_size: String(filters.pageSize || 50),
      page: String(filters.page || 1)
    });

    if (filters.category) {
      queryParams.append('categories_tags', filters.category);
    }

    if (filters.origins) {
      queryParams.append('origins_tags', filters.origins);
    }

    if (filters.brands) {
      queryParams.append('brands_tags', filters.brands);
    }

    if (filters.labels) {
      queryParams.append('labels_tags', filters.labels);
    }

    const response = await fetch(`${API_BASE_URL}/search?${queryParams}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    throw error;
  }
}

export async function getFruitsAndVegetables(): Promise<Ingredient[]> {
  try {
    const [fruitsData, vegetablesData] = await Promise.all([
      fetchProducts({ category: 'fruits' }),
      fetchProducts({ category: 'vegetables' })
    ]);

    const fruits = fruitsData.products.map(transformToIngredient);
    const vegetables = vegetablesData.products.map(transformToIngredient);

    return [...fruits, ...vegetables];
  } catch (error) {
    console.error('Erreur lors de la récupération des fruits et légumes:', error);
    return [];
  }
}

function transformToIngredient(product: any): Ingredient {
  return {
    id: product.code,
    name: product.product_name_fr || product.product_name,
    category: product.categories_tags.includes('fruits') ? 'fruits' : 'vegetables',
    quantity: 1,
    unit: 'kg',
    price: 0, // Prix à définir localement
    nutritionalScore: product.nutriscore_grade?.toUpperCase() || 'N/A',
    ecoScore: product.ecoscore_grade?.toUpperCase() || 'N/A',
    novaScore: product.nova_group || 0,
    imageUrl: product.image_url,
    brand: product.brands,
    origin: product.origins,
    nutriments: {
      energy: product.nutriments?.energy_100g || 0,
      proteins: product.nutriments?.proteins_100g || 0,
      carbohydrates: product.nutriments?.carbohydrates_100g || 0,
      fat: product.nutriments?.fat_100g || 0,
      fiber: product.nutriments?.fiber_100g || 0
    }
  };
}