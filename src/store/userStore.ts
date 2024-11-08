import create from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  district: string;
  avatar?: string;
  isEmailVerified: boolean;
  verificationCode?: string;
  householdSize: number;
  dietaryRestrictions: string[];
  kitchenEquipment: string[];
  culinaryPreferences: string[];
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Actions
  addUser: (user: User) => void;
  updateUser: (userId: string, data: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  setCurrentUser: (user: User | null) => void;
  getUserByEmail: (email: string) => User | undefined;
  logout: () => void;
  verifyEmail: (email: string, code: string) => Promise<boolean>;
  resendVerificationCode: (email: string) => Promise<void>;
}

// Fonction pour générer un code de vérification à 6 chiffres
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,
      isAuthenticated: false,

      addUser: (user) => {
        const verificationCode = generateVerificationCode();
        const newUser = {
          ...user,
          isEmailVerified: false,
          verificationCode
        };
        
        set((state) => ({
          users: [...state.users, newUser],
          currentUser: newUser,
          isAuthenticated: true
        }));

        // Simuler l'envoi d'email (à remplacer par un vrai service d'email)
        console.log(`Code de vérification envoyé à ${user.email}: ${verificationCode}`);
      },

      updateUser: (userId, data) => set((state) => ({
        users: state.users.map((user) =>
          user.id === userId
            ? { ...user, ...data, updatedAt: new Date().toISOString() }
            : user
        ),
        currentUser: state.currentUser?.id === userId
          ? { ...state.currentUser, ...data, updatedAt: new Date().toISOString() }
          : state.currentUser
      })),

      deleteUser: (userId) => set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
        currentUser: state.currentUser?.id === userId ? null : state.currentUser,
        isAuthenticated: state.currentUser?.id !== userId
      })),

      setCurrentUser: (user) => set({
        currentUser: user,
        isAuthenticated: !!user
      }),

      getUserByEmail: (email) => {
        const { users } = get();
        return users.find((user) => user.email === email);
      },

      logout: () => set({
        currentUser: null,
        isAuthenticated: false
      }),

      verifyEmail: async (email, code) => {
        const user = get().getUserByEmail(email);
        if (!user || user.verificationCode !== code) {
          return false;
        }

        set((state) => ({
          users: state.users.map((u) =>
            u.id === user.id ? { ...u, isEmailVerified: true, verificationCode: undefined } : u
          ),
          currentUser: state.currentUser?.id === user.id
            ? { ...state.currentUser, isEmailVerified: true, verificationCode: undefined }
            : state.currentUser
        }));

        return true;
      },

      resendVerificationCode: async (email) => {
        const newCode = generateVerificationCode();
        set((state) => ({
          users: state.users.map((user) =>
            user.email === email ? { ...user, verificationCode: newCode } : user
          ),
          currentUser: state.currentUser?.email === email
            ? { ...state.currentUser, verificationCode: newCode }
            : state.currentUser
        }));

        // Simuler l'envoi d'email (à remplacer par un vrai service d'email)
        console.log(`Nouveau code de vérification envoyé à ${email}: ${newCode}`);
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        users: state.users,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);