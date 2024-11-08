import api from './api';

interface NotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
}

type NotificationType = 
  | 'RECIPE_VALIDATED'
  | 'RECIPE_REJECTED'
  | 'RECIPE_LIKED'
  | 'RECIPE_COMMENTED'
  | 'RECIPE_SHARED';

export async function createNotification(notification: NotificationData) {
  try {
    const response = await api.post('/notifications', notification);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    throw error;
  }
}

export async function getNotifications(userId: string) {
  try {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    throw error;
  }
}

export async function markAsRead(notificationId: string) {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du marquage de la notification comme lue:', error);
    throw error;
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    await api.delete(`/notifications/${notificationId}`);
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    throw error;
  }
}