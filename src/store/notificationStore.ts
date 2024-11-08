import create from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: any;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  
  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      fetchNotifications: async () => {
        try {
          const response = await api.get('/notifications');
          const notifications = response.data;
          const unreadCount = notifications.filter(
            (n: Notification) => !n.read
          ).length;
          
          set({ notifications, unreadCount });
        } catch (error) {
          console.error('Erreur lors de la récupération des notifications:', error);
        }
      },

      markAsRead: async (notificationId) => {
        try {
          await api.put(`/notifications/${notificationId}/read`);
          
          set(state => {
            const notifications = state.notifications.map(n =>
              n.id === notificationId ? { ...n, read: true } : n
            );
            const unreadCount = notifications.filter(n => !n.read).length;
            
            return { notifications, unreadCount };
          });
        } catch (error) {
          console.error('Erreur lors du marquage de la notification:', error);
        }
      },

      markAllAsRead: async () => {
        try {
          await api.put('/notifications/read-all');
          
          set(state => ({
            notifications: state.notifications.map(n => ({ ...n, read: true })),
            unreadCount: 0
          }));
        } catch (error) {
          console.error('Erreur lors du marquage de toutes les notifications:', error);
        }
      },

      addNotification: (notification) => {
        set(state => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1
        }));
      },

      clearNotifications: () => {
        set({ notifications: [], unreadCount: 0 });
      }
    }),
    {
      name: 'notification-storage'
    }
  )
);