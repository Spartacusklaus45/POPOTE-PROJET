import { Request, Response } from 'express';
import { Subscription } from '../models/Subscription';
import { createPayment } from '../services/paymentService';
import { sendNotification } from '../services/notificationService';

// @desc    Create subscription
// @route   POST /api/subscriptions
// @access  Private
export const createSubscription = async (req: Request, res: Response) => {
  try {
    const existingSubscription = await Subscription.findOne({
      user: req.user._id,
      status: 'ACTIVE'
    });

    if (existingSubscription) {
      return res.status(400).json({
        message: 'You already have an active subscription'
      });
    }

    const subscription = new Subscription({
      ...req.body,
      user: req.user._id,
      startDate: new Date()
    });

    // Process payment
    const payment = await createPayment({
      amount: subscription.price.amount,
      paymentMethod: subscription.paymentMethod.type,
      paymentDetails: subscription.paymentMethod.details
    });

    if (payment.status === 'COMPLETED') {
      const createdSubscription = await subscription.save();

      await sendNotification({
        userId: req.user._id,
        type: 'SUBSCRIPTION_STATUS',
        title: 'Abonnement activé',
        message: `Votre abonnement ${subscription.plan} est maintenant actif`
      });

      res.status(201).json(createdSubscription);
    } else {
      res.status(400).json({ message: 'Payment failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating subscription' });
  }
};

// @desc    Get current subscription
// @route   GET /api/subscriptions/current
// @access  Private
export const getCurrentSubscription = async (req: Request, res: Response) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: { $in: ['ACTIVE', 'PAUSED'] }
    });

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscription' });
  }
};

// @desc    Cancel subscription
// @route   PUT /api/subscriptions/cancel
// @access  Private
export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: 'ACTIVE'
    });

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    subscription.status = 'CANCELLED';
    subscription.endDate = new Date();
    await subscription.save();

    await sendNotification({
      userId: req.user._id,
      type: 'SUBSCRIPTION_STATUS',
      title: 'Abonnement annulé',
      message: 'Votre abonnement a été annulé avec succès'
    });

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling subscription' });
  }
};

// @desc    Pause subscription
// @route   PUT /api/subscriptions/pause
// @access  Private
export const pauseSubscription = async (req: Request, res: Response) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: 'ACTIVE'
    });

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    subscription.status = 'PAUSED';
    await subscription.save();

    await sendNotification({
      userId: req.user._id,
      type: 'SUBSCRIPTION_STATUS',
      title: 'Abonnement en pause',
      message: 'Votre abonnement a été mis en pause'
    });

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Error pausing subscription' });
  }
};

// @desc    Resume subscription
// @route   PUT /api/subscriptions/resume
// @access  Private
export const resumeSubscription = async (req: Request, res: Response) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: 'PAUSED'
    });

    if (!subscription) {
      return res.status(404).json({ message: 'No paused subscription found' });
    }

    subscription.status = 'ACTIVE';
    await subscription.save();

    await sendNotification({
      userId: req.user._id,
      type: 'SUBSCRIPTION_STATUS',
      title: 'Abonnement réactivé',
      message: 'Votre abonnement a été réactivé avec succès'
    });

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Error resuming subscription' });
  }
};