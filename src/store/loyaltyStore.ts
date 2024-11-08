import create from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/services/api';

interface Transaction {
  id: string;
  type: 'EARNING' | 'REDEMPTION';
  source: 'REFERRAL' | 'RECIPE' | 'ORDER' | 'REWARD';
  amount: number;
  description: string;
  date: string;
}

interface LoyaltyState {
  balance: number;
  points: number;
  transactions: Transaction[];
  
  // Actions
  addEarnings: (amount: number, source: Transaction['source'], description: string) => Promise<void>;
  useBalance: (amount: number, description: string) => Promise<boolean>;
  getTransactionHistory: () => Promise<void>;
}

export const useLoyaltyStore = create<LoyaltyState>()(
  persist(
    (set, get) => ({
      balance: 0,
      points: 0,
      transactions: [],

      addEarnings: async (amount, source, description) => {
        try {
          const response = await api.post('/loyalty/earnings', {
            amount,
            source,
            description
          });

          set(state => ({
            balance: state.balance + amount,
            transactions: [
              {
                id: response.data.transactionId,
                type: 'EARNING',
                source,
                amount,
                description,
                date: new Date().toISOString()
              },
              ...state.transactions
            ]
          }));
        } catch (error) {
          console.error('Error adding earnings:', error);
          throw error;
        }
      },

      useBalance: async (amount, description) => {
        try {
          if (get().balance < amount) {
            return false;
          }

          await api.post('/loyalty/redeem', {
            amount,
            description
          });

          set(state => ({
            balance: state.balance - amount,
            transactions: [
              {
                id: crypto.randomUUID(),
                type: 'REDEMPTION',
                source: 'ORDER',
                amount,
                description,
                date: new Date().toISOString()
              },
              ...state.transactions
            ]
          }));

          return true;
        } catch (error) {
          console.error('Error using balance:', error);
          return false;
        }
      },

      getTransactionHistory: async () => {
        try {
          const response = await api.get('/loyalty/transactions');
          set({ transactions: response.data });
        } catch (error) {
          console.error('Error fetching transactions:', error);
          throw error;
        }
      }
    }),
    {
      name: 'loyalty-storage'
    }
  )
);