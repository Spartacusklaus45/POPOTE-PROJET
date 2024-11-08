import { Request, Response } from 'express';
import { Payment } from '../models/Payment';
import { Order } from '../models/Order';
import { processPayment, refundPayment } from '../services/paymentService';
import { sendNotification } from '../services/notificationService';

// @desc    Process payment
// @route   POST /api/payments/process
// @access  Private
export const processPaymentController = async (req: Request, res: Response) => {
  try {
    const { orderId, paymentMethod, paymentDetails } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const payment = await processPayment({
      order,
      paymentMethod,
      paymentDetails
    });

    if (payment.status === 'COMPLETED') {
      order.paymentStatus = 'PAID';
      order.status = 'CONFIRMED';
      await order.save();

      await sendNotification({
        userId: order.user,
        type: 'PAYMENT_SUCCESSFUL',
        title: 'Paiement réussi',
        message: `Votre paiement pour la commande #${order._id} a été confirmé`
      });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment' });
  }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('order')
      .populate('user', 'name email');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment' });
  }
};

// @desc    Get user payments
// @route   GET /api/payments/mypayments
// @access  Private
export const getMyPayments = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('order')
      .sort('-createdAt');

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments' });
  }
};

// @desc    Refund payment
// @route   POST /api/payments/:id/refund
// @access  Private/Admin
export const refundPaymentController = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Payment cannot be refunded' });
    }

    const refund = await refundPayment(payment);

    if (refund.success) {
      payment.status = 'REFUNDED';
      await payment.save();

      const order = await Order.findById(payment.order);
      if (order) {
        order.paymentStatus = 'REFUNDED';
        await order.save();

        await sendNotification({
          userId: payment.user,
          type: 'PAYMENT_REFUNDED',
          title: 'Paiement remboursé',
          message: `Votre paiement pour la commande #${order._id} a été remboursé`
        });
      }
    }

    res.json(refund);
  } catch (error) {
    res.status(500).json({ message: 'Error refunding payment' });
  }
};