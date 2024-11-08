import create from 'zustand';
import { persist } from 'zustand/middleware';
import type { Referral, ReferralStats } from '@/types/referral';
import { useLoyaltyStore } from './loyaltyStore';
import api from '@/services/api';

interface ReferralState {
  referrals: Referral[];
  stats: ReferralStats | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  getReferralStats: () => Promise<void>;
  getReferralCode: () => Promise<string>;
  claimReward: (referralId: string) => Promise<void>;
  shareReferralCode: (method: 'email' | 'sms' | 'whatsapp') => Promise<void>;
}

export const useReferralStore = create<ReferralState>()(
  persist(
    (set, get) => ({
      referrals: [],
      stats: null,
      isLoading: false,
      error: null,

      getReferralStats: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.get('/referrals/stats');
          set({ stats: response.data, isLoading: false });
        } catch (error) {
          set({ error: 'Erreur lors de la récupération des statistiques', isLoading: false });
          throw error;
        }
      },

      getReferralCode: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.get('/referrals/code');
          set(state => ({
            stats: state.stats ? {
              ...state.stats,
              referralCode: response.data.code
            } : null,
            isLoading: false
          }));
          return response.data.code;
        } catch (error) {
          set({ error: 'Erreur lors de la récupération du code', isLoading: false });
          throw error;
        }
      },

      claimReward: async (referralId) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post(`/referrals/${referralId}/claim`);
          
          // Créditer directement la récompense sur la carte Popote
          const { addEarnings } = useLoyaltyStore.getState();
          await addEarnings(
            1000,
            'REFERRAL',
            'Récompense de parrainage'
          );

          set(state => ({
            referrals: state.referrals.map(ref =>
              ref.id === referralId ? { ...ref, rewardClaimed: true } : ref
            ),
            stats: state.stats ? {
              ...state.stats,
              availableRewards: state.stats.availableRewards - 1000
            } : null,
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Erreur lors de la réclamation de la récompense', isLoading: false });
          throw error;
        }
      },

      shareReferralCode: async (method) => {
        try {
          const code = await get().getReferralCode();
          const message = `Découvrez Popote, votre assistant culinaire intelligent ! Utilisez mon code ${code} pour obtenir 1000 FCFA de réduction sur votre première commande. https://popote.ci/referral/${code}`;
          
          switch (method) {
            case 'email':
              window.location.href = `mailto:?subject=Découvrez Popote&body=${encodeURIComponent(message)}`;
              break;
            case 'sms':
              window.location.href = `sms:?body=${encodeURIComponent(message)}`;
              break;
            case 'whatsapp':
              window.location.href = `https://wa.me/?text=${encodeURIComponent(message)}`;
              break;
          }
        } catch (error) {
          console.error('Error sharing referral code:', error);
        }
      }
    }),
    {
      name: 'referral-storage'
    }
  )
);