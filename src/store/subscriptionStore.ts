import create from 'zustand';
import { persist } from 'zustand/middleware';
import type { SubscriptionPlan, Subscription, DeliverySlot, CustomPack, UserPreferences } from '../types/subscription';
import { generateCustomPack } from '../services/packGenerationService';
import api from '../services/api';

interface SubscriptionState {
  plans: SubscriptionPlan[];
  currentSubscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  subscribe: (data: { 
    planId: string; 
    deliverySlot: DeliverySlot;
    preferences: UserPreferences;
  }) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  pauseSubscription: () => Promise<void>;
  resumeSubscription: () => Promise<void>;
  updateDeliverySlot: (slot: DeliverySlot) => Promise<void>;
  skipNextDelivery: () => Promise<void>;
  regeneratePack: () => Promise<void>;
  reorderPreviousPack: (packId: string) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      // ... Reste du code inchangé ...

      regeneratePack: async () => {
        try {
          set({ isLoading: true, error: null });
          const subscription = get().currentSubscription;
          
          if (!subscription) {
            throw new Error('Aucun abonnement actif');
          }

          const newPack = await generateCustomPack({
            preferences: subscription.preferences,
            season: getCurrentSeason(),
            previousPacks: subscription.previousPacks
          });

          const response = await api.post('/subscriptions/regenerate-pack', {
            subscriptionId: subscription.id,
            pack: newPack
          });

          set({
            currentSubscription: {
              ...subscription,
              currentPack: newPack,
              previousPacks: subscription.currentPack 
                ? [...subscription.previousPacks, subscription.currentPack]
                : subscription.previousPacks
            },
            isLoading: false
          });
        } catch (error) {
          set({
            error: 'Erreur lors de la régénération du pack',
            isLoading: false
          });
          throw error;
        }
      },

      reorderPreviousPack: async (packId: string) => {
        try {
          set({ isLoading: true, error: null });
          const subscription = get().currentSubscription;
          
          if (!subscription) {
            throw new Error('Aucun abonnement actif');
          }

          const previousPack = subscription.previousPacks.find(pack => pack.id === packId);
          if (!previousPack) {
            throw new Error('Pack non trouvé');
          }

          const response = await api.post('/subscriptions/reorder-pack', {
            subscriptionId: subscription.id,
            packId
          });

          set({
            currentSubscription: {
              ...subscription,
              currentPack: previousPack
            },
            isLoading: false
          });
        } catch (error) {
          set({
            error: 'Erreur lors de la commande du pack précédent',
            isLoading: false
          });
          throw error;
        }
      },

      updatePreferences: async (preferences: Partial<UserPreferences>) => {
        try {
          set({ isLoading: true, error: null });
          const subscription = get().currentSubscription;
          
          if (!subscription) {
            throw new Error('Aucun abonnement actif');
          }

          const response = await api.put('/subscriptions/preferences', {
            subscriptionId: subscription.id,
            preferences: {
              ...subscription.preferences,
              ...preferences
            }
          });

          set({
            currentSubscription: {
              ...subscription,
              preferences: {
                ...subscription.preferences,
                ...preferences
              }
            },
            isLoading: false
          });
        } catch (error) {
          set({
            error: 'Erreur lors de la mise à jour des préférences',
            isLoading: false
          });
          throw error;
        }
      }
    }),
    {
      name: 'subscription-storage'
    }
  )
);