import { useState, useEffect } from 'react';
import { getFruitsAndVegetables } from '../services/productsAPI';
import type { Ingredient } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await getFruitsAndVegetables();
        setProducts(data);
      } catch (err) {
        setError('Erreur lors du chargement des produits');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const fruits = products.filter(p => p.category === 'fruits');
  const vegetables = products.filter(p => p.category === 'vegetables');

  return {
    products,
    fruits,
    vegetables,
    loading,
    error
  };
}