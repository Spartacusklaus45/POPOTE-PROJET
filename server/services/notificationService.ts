import { Notification } from '../models/Notification';
import { sendPushNotification } from './pushNotificationService';
import { sendEmail } from './emailService';

interface NotificationOptions {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
}

export const sendNotification = async (options: NotificationOptions) => {
  try {
    // Create notification in database
    const notification = await Notification.create({
      user: options.userId,
      type: options.type,
      title: options.title,
      message: options.message,
      data: options.data
    });

    // Send push notification if user has push enabled
    try {
      await sendPushNotification({
        userId: options.userId,
        title: options.title,
        body: options.message,
        data: options.data
      });
    } catch (error) {
      console.error('Error sending push notification:', error);
    }

    // Send email notification if user has email notifications enabled
    try {
      await sendEmail({
        email: options.userId,
        subject: options.title,
        html: `
          <h1>${options.title}</h1>
          <p>${options.message}</p>
        `
      });
    } catch (error) {
      console.error('Error sending email notification:', error);
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};