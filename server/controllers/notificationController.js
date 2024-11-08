import { Notification } from '../models/Notification.js';
import { sendPushNotification } from '../services/pushNotificationService.js';
import { sendEmail } from '../services/emailService.js';

export const createNotification = async (req, res) => {
  try {
    const notification = new Notification({
      ...req.body,
      user: req.body.userId || req.user.id
    });

    await notification.save();

    // Envoyer la notification sur les canaux configurés
    await sendNotificationToChannels(notification);

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de la notification' });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const query = { user: req.user.id };

    if (status) query.status = status;
    if (type) query.type = type;

    const total = await Notification.countDocuments(query);
    const notifications = await Notification.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      notifications,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des notifications' });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      status: 'UNREAD'
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du comptage des notifications' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    await notification.markAsRead();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du marquage de la notification' });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, status: 'UNREAD' },
      { 
        $set: { 
          status: 'READ',
          readAt: new Date()
        }
      }
    );
    res.json({ message: 'Toutes les notifications ont été marquées comme lues' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du marquage des notifications' });
  }
};

export const archiveNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    await notification.archive();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'archivage de la notification' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    res.json({ message: 'Notification supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la notification' });
  }
};

export const updateNotificationPreferences = async (req, res) => {
  try {
    const { preferences } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    user.notificationPreferences = {
      ...user.notificationPreferences,
      ...preferences
    };
    await user.save();

    res.json(user.notificationPreferences);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour des préférences' });
  }
};

// Fonctions utilitaires

async function sendNotificationToChannels(notification) {
  const promises = notification.channels.map(channel => {
    switch (channel) {
      case 'PUSH':
        return sendPushNotification({
          userId: notification.user,
          title: notification.title,
          body: notification.message,
          data: notification.data
        });
      case 'EMAIL':
        return sendEmail({
          to: notification.user.email,
          subject: notification.title,
          html: buildEmailTemplate(notification)
        });
      // Ajouter d'autres canaux ici
      default:
        return Promise.resolve();
    }
  });

  try {
    await Promise.all(promises);
    await notification.updateDeliveryStatus('DELIVERED');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
    await notification.updateDeliveryStatus('FAILED');
  }
}

function buildEmailTemplate(notification) {
  // Template simple pour l'exemple
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>${notification.title}</h2>
      <p>${notification.message}</p>
      ${notification.action ? `
        <p style="margin-top: 20px;">
          <a href="${notification.action.url}" 
             style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            ${notification.action.text}
          </a>
        </p>
      ` : ''}
    </div>
  `;
}