import { SecuritySettings } from '../types/security';
import api from './api';

export async function validatePassword(password: string, settings: SecuritySettings): Promise<{
  isValid: boolean;
  errors: string[];
}> {
  const errors: string[] = [];

  if (password.length < settings.passwordMinLength) {
    errors.push(`Le mot de passe doit contenir au moins ${settings.passwordMinLength} caractères`);
  }

  if (settings.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  }

  if (settings.requireNumbers && !/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }

  if (settings.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export async function validateLoginAttempt(email: string, ip: string): Promise<{
  allowed: boolean;
  reason?: string;
}> {
  try {
    const response = await api.post('/security/validate-login', { email, ip });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la validation de la tentative:', error);
    throw error;
  }
}

export async function generateSecurityReport(): Promise<{
  vulnerabilities: Array<{
    severity: 'low' | 'medium' | 'high';
    description: string;
    recommendation: string;
  }>;
  recommendations: string[];
  score: number;
}> {
  try {
    const response = await api.get('/security/report');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    throw error;
  }
}

export async function checkIpReputation(ip: string): Promise<{
  score: number;
  isSuspicious: boolean;
  isBlocked: boolean;
  lastIncident?: string;
}> {
  try {
    const response = await api.get(`/security/ip-reputation/${ip}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'IP:', error);
    throw error;
  }
}

export async function validateSession(sessionId: string): Promise<{
  isValid: boolean;
  expiresIn?: number;
}> {
  try {
    const response = await api.post('/security/validate-session', { sessionId });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la validation de la session:', error);
    throw error;
  }
}

export async function rotateSecurityKeys(): Promise<{
  success: boolean;
  nextRotation: string;
}> {
  try {
    const response = await api.post('/security/rotate-keys');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la rotation des clés:', error);
    throw error;
  }
}