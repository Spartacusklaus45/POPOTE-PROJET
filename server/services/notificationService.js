import Notification from '../models/Notification.js';

export const createNotification = async ({
  user,
  type,
  title,
  message,
  data = {}
}) => {
  try {
    const notification = new Notification({
      user,
      type,
      title,
      message,
      data
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const sendOrderStatusNotification = async (order) => {
  try {
    await createNotification({
      user: order.user,
      type: 'ORDER_STATUS',
      title: 'Mise à jour de votre commande',
      message: `Votre commande #${order._id} est maintenant ${order.status}`,
      data: { orderId: order._id }
    });
  } catch (error) {
    console.error('Error sending order status notification:', error);
  }
};

export const sendPriceDropNotification = async (user, recipe) => {
  try {
    await createNotification({
      user,
      type: 'PRICE_DROP',
      title: 'Baisse de prix !',
      message: `Le prix de la recette "${recipe.name}" a baissé`,
      data: { recipeId: recipe._id }
    });
  } catch (error) {
    console.error('Error sending price drop notification:', error);
  }
};

export const sendStockAlertNotification = async (user, ingredient) => {
  try {
    await createNotification({
      user,
      type: 'STOCK_ALERT',
      title: 'Alerte stock',
      message: `${ingredient.name} est de nouveau disponible`,
      data: { ingredientId: ingredient._id }
    });
  } catch (error) {
    console.error('Error sending stock alert notification:', error);
  }
};