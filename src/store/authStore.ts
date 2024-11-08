import create from 'zustand';
import { persist } from 'zustand/middleware';
import { generateHash } from '../utils/crypto';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  householdSize: number;
  createdAt: string;
  updatedAt: string;
  isEmailVerified: boolean;
  dietaryRestrictions: string[];
  kitchenEquipment: string[];
  culinaryPreferences: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  register: (credentials: {
    name: string;
    email: string;
    password: string;
    phone: string;
    district: string;
    householdSize: number;
  }) => Promise<boolean>;
  
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      register: async (credentials) => {
        try {
          set({ isLoading: true, error: null });

          // Vérifier si l'email existe déjà
          const hashedPassword = await generateHash(credentials.password);
          
          const newUser: User = {
            id: crypto.randomUUID(),
            name: credentials.name,
            email: credentials.email,
            phone: credentials.phone,
            district: credentials.district,
            householdSize: credentials.householdSize,
            isEmailVerified: false,
            dietaryRestrictions: [],
            kitchenEquipment: [],
            culinaryPreferences: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          // Simuler un délai d'API
          await new Promise(resolve => setTimeout(resolve, 1000));

          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false
          });

          return true;
        } catch (error) {
          set({
            error: 'Une erreur est survenue lors de l\'inscription',
            isLoading: false
          });
          return false;
        }
      },

      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });

          // Simuler un délai d'API
          await new Promise(resolve => setTimeout(resolve, 1000));

          const hashedPassword = await generateHash(password);
          
          // Simulation d'une vérification d'utilisateur
          if (email === 'test@example.com' && hashedPassword) {
            const user: User = {
              id: '1',
              name: 'Utilisateur Test',
              email: email,
              phone: '+225 0707070707',
              district: 'Cocody',
              householdSize: 2,
              isEmailVerified: true,
              dietaryRestrictions: [],
              kitchenEquipment: [],
              culinaryPreferences: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };

            set({
              user,
              isAuthenticated: true,
              isLoading: false
            });

            return true;
          }

          set({
            error: 'Email ou mot de passe incorrect',
            isLoading: false
          });
          return false;
        } catch (error) {
          set({
            error: 'Une erreur est survenue lors de la connexion',
            isLoading: false
          });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null
        });
      },

      updateProfile: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const currentUser = get().user;

          if (!currentUser) {
            throw new Error('Utilisateur non connecté');
          }

          const updatedUser = {
            ...currentUser,
            ...data,
            updatedAt: new Date().toISOString()
          };

          // Simuler un délai d'API
          await new Promise(resolve => setTimeout(resolve, 1000));

          set({
            user: updatedUser,
            isLoading: false
          });

          return true;
        } catch (error) {
          set({
            error: 'Une erreur est survenue lors de la mise à jour du profil',
            isLoading: false
          });
          return false;
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);