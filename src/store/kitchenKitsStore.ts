import create from 'zustand';
import { persist } from 'zustand/middleware';
import type { Recipe } from '../types';

export interface KitchenKit {
  id: string;
  name: string;
  description: string;
  price: number;
  servings: number;
  prepTime: number;
  image: string;
  isEco: boolean;
  recipes: Recipe[];
  category: 'DÉCOUVERTE' | 'HEALTHY' | 'LOCAL' | 'INTERNATIONAL';
  tags: string[];
}

export interface KitSubscription {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  duration: 'weekly' | 'biweekly' | 'monthly';
  mealsPerWeek: number;
  servingsPerMeal: number;
  discount: number;
}

interface KitchenKitsState {
  kits: KitchenKit[];
  subscriptions: KitSubscription[];
  userSubscription: KitSubscription | null;
  selectedKit: KitchenKit | null;
  
  // Actions
  addKit: (kit: KitchenKit) => void;
  removeKit: (kitId: string) => void;
  updateKit: (kitId: string, updates: Partial<KitchenKit>) => void;
  setSelectedKit: (kit: KitchenKit | null) => void;
  subscribeToKit: (subscription: KitSubscription) => void;
  cancelSubscription: () => void;
}

export const useKitchenKitsStore = create<KitchenKitsState>()(
  persist(
    (set) => ({
      kits: [
        {
          id: 'kit-decouverte',
          name: 'Kit Découverte Africaine',
          description: 'Un voyage culinaire à travers l\'Afrique avec des recettes authentiques',
          price: 12000,
          servings: 4,
          prepTime: 45,
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
          isEco: true,
          category: 'DÉCOUVERTE',
          tags: ['traditionnel', 'varié', 'découverte'],
          recipes: []
        },
        {
          id: 'kit-healthy',
          name: 'Kit Healthy & Local',
          description: 'Des recettes équilibrées préparées avec des produits locaux',
          price: 15000,
          servings: 2,
          prepTime: 30,
          image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061',
          isEco: true,
          category: 'HEALTHY',
          tags: ['healthy', 'local', 'équilibré'],
          recipes: []
        },
        {
          id: 'kit-gourmet',
          name: 'Kit Gourmet',
          description: 'Une sélection de recettes gastronomiques pour les fins gourmets',
          price: 18000,
          servings: 2,
          prepTime: 60,
          image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
          isEco: false,
          category: 'INTERNATIONAL',
          tags: ['gourmet', 'gastronomique', 'premium'],
          recipes: []
        }
      ],
      subscriptions: [
        {
          id: 'weekly',
          name: 'Hebdomadaire',
          price: 15000,
          description: '3 repas par semaine pour 2 personnes',
          features: [
            'Livraison gratuite',
            'Annulation flexible',
            'Recettes exclusives',
            'Ingrédients premium'
          ],
          duration: 'weekly',
          mealsPerWeek: 3,
          servingsPerMeal: 2,
          discount: 0
        },
        {
          id: 'biweekly',
          name: 'Bi-mensuel',
          price: 25000,
          description: '6 repas par quinzaine pour 2 personnes',
          features: [
            'Livraison gratuite',
            'Annulation flexible',
            'Recettes exclusives',
            'Ingrédients premium',
            'Réduction de 10%'
          ],
          duration: 'biweekly',
          mealsPerWeek: 3,
          servingsPerMeal: 2,
          discount: 10
        },
        {
          id: 'monthly',
          name: 'Mensuel',
          price: 45000,
          description: '12 repas par mois pour 2 personnes',
          features: [
            'Livraison gratuite',
            'Annulation flexible',
            'Recettes exclusives',
            'Ingrédients premium',
            'Réduction de 20%',
            'Accès aux ateliers cuisine'
          ],
          duration: 'monthly',
          mealsPerWeek: 3,
          servingsPerMeal: 2,
          discount: 20
        }
      ],
      userSubscription: null,
      selectedKit: null,

      addKit: (kit) =>
        set((state) => ({
          kits: [...state.kits, kit]
        })),

      removeKit: (kitId) =>
        set((state) => ({
          kits: state.kits.filter((kit) => kit.id !== kitId)
        })),

      updateKit: (kitId, updates) =>
        set((state) => ({
          kits: state.kits.map((kit) =>
            kit.id === kitId ? { ...kit, ...updates } : kit
          )
        })),

      setSelectedKit: (kit) =>
        set({
          selectedKit: kit
        }),

      subscribeToKit: (subscription) =>
        set({
          userSubscription: subscription
        }),

      cancelSubscription: () =>
        set({
          userSubscription: null
        })
    }),
    {
      name: 'kitchen-kits-storage'
    }
  )
);