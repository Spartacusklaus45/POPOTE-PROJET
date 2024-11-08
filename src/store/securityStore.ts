import create from 'zustand';
import { persist } from 'zustand/middleware';
import type { SecurityLog, LoginAttempt, BlockedAccount, SecuritySettings } from '../types/security';
import api from '../services/api';

interface SecurityState {
  logs: SecurityLog[];
  loginAttempts: LoginAttempt[];
  blockedAccounts: BlockedAccount[];
  settings: SecuritySettings;
  isLoading: boolean;
  error: string | null;

  // Actions
  addSecurityLog: (log: Omit<SecurityLog, 'id' | 'timestamp'>) => Promise<void>;
  recordLoginAttempt: (attempt: Omit<LoginAttempt, 'id' | 'timestamp'>) => Promise<void>;
  blockAccount: (userId: string, reason: string) => Promise<void>;
  unblockAccount: (userId: string) => Promise<void>;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => Promise<void>;
  getLoginAttempts: (userId: string) => Promise<LoginAttempt[]>;
  checkAccountStatus: (userId: string) => Promise<{ isBlocked: boolean; reason?: string }>;
}

export const useSecurityStore = create<SecurityState>()(
  persist(
    (set, get) => ({
      logs: [],
      loginAttempts: [],
      blockedAccounts: [],
      settings: {
        maxLoginAttempts: 5,
        loginLockoutDuration: 30,
        passwordMinLength: 8,
        requireSpecialChars: true,
        requireNumbers: true,
        requireUppercase: true,
        sessionTimeout: 60,
        twoFactorEnabled: false,
        allowedIPs: []
      },
      isLoading: false,
      error: null,

      addSecurityLog: async (logData) => {
        try {
          const response = await api.post('/security/logs', logData);
          set(state => ({
            logs: [response.data, ...state.logs]
          }));
        } catch (error) {
          console.error('Erreur lors de l\'ajout du log:', error);
          throw error;
        }
      },

      recordLoginAttempt: async (attemptData) => {
        try {
          const response = await api.post('/security/login-attempts', attemptData);
          
          set(state => ({
            loginAttempts: [response.data, ...state.loginAttempts]
          }));

          // Vérifier si le compte doit être bloqué
          const recentAttempts = get().loginAttempts.filter(
            attempt => 
              attempt.email === attemptData.email &&
              !attempt.success &&
              new Date(attempt.timestamp).getTime() > Date.now() - 30 * 60 * 1000
          );

          if (recentAttempts.length >= get().settings.maxLoginAttempts) {
            await get().blockAccount(
              attemptData.userId!,
              'Trop de tentatives de connexion échouées'
            );
          }
        } catch (error) {
          console.error('Erreur lors de l\'enregistrement de la tentative:', error);
          throw error;
        }
      },

      blockAccount: async (userId, reason) => {
        try {
          const response = await api.post('/security/blocked-accounts', {
            userId,
            reason
          });

          set(state => ({
            blockedAccounts: [...state.blockedAccounts, response.data]
          }));

          await get().addSecurityLog({
            event: 'ACCOUNT_BLOCKED',
            severity: 'high',
            userId,
            ip: '',
            details: { reason }
          });
        } catch (error) {
          console.error('Erreur lors du blocage du compte:', error);
          throw error;
        }
      },

      unblockAccount: async (userId) => {
        try {
          await api.delete(`/security/blocked-accounts/${userId}`);
          
          set(state => ({
            blockedAccounts: state.blockedAccounts.filter(
              account => account.userId !== userId
            )
          }));

          await get().addSecurityLog({
            event: 'ACCOUNT_UNBLOCKED',
            severity: 'medium',
            userId,
            ip: '',
          });
        } catch (error) {
          console.error('Erreur lors du déblocage du compte:', error);
          throw error;
        }
      },

      updateSecuritySettings: async (newSettings) => {
        try {
          const response = await api.put('/security/settings', newSettings);
          
          set(state => ({
            settings: {
              ...state.settings,
              ...response.data
            }
          }));

          await get().addSecurityLog({
            event: 'SECURITY_SETTINGS_UPDATED',
            severity: 'medium',
            ip: '',
            details: newSettings
          });
        } catch (error) {
          console.error('Erreur lors de la mise à jour des paramètres:', error);
          throw error;
        }
      },

      getLoginAttempts: async (userId) => {
        try {
          const response = await api.get(`/security/login-attempts/${userId}`);
          return response.data;
        } catch (error) {
          console.error('Erreur lors de la récupération des tentatives:', error);
          throw error;
        }
      },

      checkAccountStatus: async (userId) => {
        try {
          const response = await api.get(`/security/account-status/${userId}`);
          return response.data;
        } catch (error) {
          console.error('Erreur lors de la vérification du statut:', error);
          throw error;
        }
      }
    }),
    {
      name: 'security-storage'
    }
  )
);