import { Subscription } from '../models/Subscription.js';
import { createNotification } from '../services/notificationService.js';
import { processPayment } from '../services/paymentService.js';

export const createSubscription = async (req, res) => {
  try {
    // Vérifier si l'utilisateur a déjà un abonnement actif
    const existingSubscription = await Subscription.findOne({
      user: req.user.id,
      status: 'ACTIVE'
    });

    if (existingSubscription) {
      return res.status(400).json({
        message: 'Vous avez déjà un abonnement actif'
      });
    }

    // Traiter le paiement
    const paymentResult = await processPayment({
      amount: req.body.price.amount,
      currency: req.body.price.currency,
      paymentMethod: req.body.paymentMethod,
      description: `Abonnement ${req.body.plan}`
    });

    const subscription = new Subscription({
      ...req.body,
      user: req.user.id,
      startDate: new Date(),
      currentPeriodStart: new Date(),
      currentPeriodEnd: calculatePeriodEnd(new Date(), req.body.price.interval),
      billingHistory: [{
        date: new Date(),
        amount: req.body.price.amount,
        status: 'PAID',
        transactionId: paymentResult.transactionId
      }]
    });

    await subscription.save();

    // Notification à l'utilisateur
    await createNotification({
      user: req.user.id,
      type: 'SUBSCRIPTION_CREATED',
      title: 'Abonnement activé',
      message: `Votre abonnement ${subscription.plan} est maintenant actif`,
      data: { subscriptionId: subscription._id }
    });

    res.status(201).json(subscription);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'abonnement' });
  }
};

export const getCurrentSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user.id,
      status: { $in: ['ACTIVE', 'PAUSED'] }
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Aucun abonnement actif trouvé' });
    }

    res.json(subscription);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'abonnement' });
  }
};

export const pauseSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Abonnement non trouvé' });
    }

    await subscription.pause(req.body.reason);

    // Notification à l'utilisateur
    await createNotification({
      user: req.user.id,
      type: 'SUBSCRIPTION_PAUSED',
      title: 'Abonnement mis en pause',
      message: 'Votre abonnement a été mis en pause avec succès',
      data: { subscriptionId: subscription._id }
    });

    res.json(subscription);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const resumeSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Abonnement non trouvé' });
    }

    await subscription.resume();

    // Notification à l'utilisateur
    await createNotification({
      user: req.user.id,
      type: 'SUBSCRIPTION_RESUMED',
      title: 'Abonnement repris',
      message: 'Votre abonnement a été réactivé avec succès',
      data: { subscriptionId: subscription._id }
    });

    res.json(subscription);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Abonnement non trouvé' });
    }

    const { immediate } = req.query;
    await subscription.cancel(immediate === 'true');

    // Notification à l'utilisateur
    await createNotification({
      user: req.user.id,
      type: 'SUBSCRIPTION_CANCELLED',
      title: 'Abonnement annulé',
      message: immediate === 'true' 
        ? 'Votre abonnement a été annulé immédiatement'
        : 'Votre abonnement sera annulé à la fin de la période en cours',
      data: { subscriptionId: subscription._id }
    });

    res.json(subscription);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updatePaymentMethod = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Abonnement non trouvé' });
    }

    subscription.paymentMethod = req.body.paymentMethod;
    await subscription.save();

    res.json(subscription);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du moyen de paiement' });
  }
};

export const getSubscriptionHistory = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({
      user: req.user.id
    }).sort('-createdAt');

    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique' });
  }
};

// Fonction utilitaire pour calculer la fin de période
function calculatePeriodEnd(startDate, interval) {
  const date = new Date(startDate);
  switch (interval) {
    case 'MONTHLY':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'QUARTERLY':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'YEARLY':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  return date;
}