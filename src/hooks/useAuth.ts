import { useState } from 'react';
import { useUserStore } from '../store/userStore';
import type { User } from '../store/userStore';
import { generateHash } from '../utils/crypto';

interface AuthCredentials {
  name?: string;
  email: string;
  password: string;
  phone?: string;
  district?: string;
  householdSize?: number;
  city?: string;
}

export function useAuth() {
  const [error, setError] = useState<string | null>(null);
  const { users, addUser, getUserByEmail, setCurrentUser } = useUserStore();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);

      if (!validateEmail(email)) {
        setError('Format d\'email invalide');
        return false;
      }

      const user = getUserByEmail(email);
      if (!user) {
        setError('Email ou mot de passe incorrect');
        return false;
      }

      const hashedPassword = await generateHash(password);
      if (user.password !== hashedPassword) {
        setError('Email ou mot de passe incorrect');
        return false;
      }

      setCurrentUser(user);
      return true;
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion');
      return false;
    }
  };

  const handleRegister = async (credentials: AuthCredentials): Promise<boolean> => {
    try {
      setError(null);

      if (!validateEmail(credentials.email)) {
        setError('Format d\'email invalide');
        return false;
      }

      const existingUser = getUserByEmail(credentials.email);
      if (existingUser) {
        setError('Un compte existe déjà avec cet email');
        return false;
      }

      const hashedPassword = await generateHash(credentials.password);
      const now = new Date().toISOString();

      const newUser: User = {
        id: crypto.randomUUID(),
        name: credentials.name || '',
        email: credentials.email,
        password: hashedPassword,
        phone: credentials.phone || '',
        city: credentials.city || 'Abidjan',
        district: credentials.district || '',
        householdSize: credentials.householdSize || 1,
        dietaryRestrictions: [],
        kitchenEquipment: [],
        culinaryPreferences: [],
        createdAt: now,
        updatedAt: now
      };

      addUser(newUser);
      return true;
    } catch (err) {
      setError('Une erreur est survenue lors de l\'inscription');
      return false;
    }
  };

  return {
    error,
    handleLogin,
    handleRegister
  };
}