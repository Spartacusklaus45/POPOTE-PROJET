import { useState, useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { usePlatform } from './usePlatform';

export function useNotifications() {
  const [hasPermission, setHasPermission] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { isNative } = usePlatform();

  useEffect(() => {
    if (isNative) {
      const initializePushNotifications = async () => {
        try {
          // Request permission
          const { granted } = await PushNotifications.requestPermissions();
          setHasPermission(granted);

          if (granted) {
            // Register for push notifications
            await PushNotifications.register();

            // Get FCM token
            const { value } = await PushNotifications.getDeliveredNotifications();
            if (value.length > 0) {
              setToken(value[0].id);
            }
          }
        } catch (error) {
          console.error('Error initializing push notifications:', error);
        }
      };

      initializePushNotifications();
    } else {
      // Web Push Notifications
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          setHasPermission(permission === 'granted');
        });
      }
    }
  }, [isNative]);

  const showNotification = async (title: string, body: string, data?: any) => {
    if (isNative && hasPermission) {
      // Native push notification
      await PushNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Date.now(),
            schedule: { at: new Date(Date.now()) },
            extra: data
          }
        ]
      });
    } else if ('Notification' in window && hasPermission) {
      // Web notification
      new Notification(title, {
        body,
        data
      });
    }
  };

  return { hasPermission, token, showNotification };
}