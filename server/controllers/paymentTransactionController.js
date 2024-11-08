import { PaymentTransaction } from '../models/PaymentTransaction.js';
import { PaymentMethod } from '../models/PaymentMethod.js';
import { Order } from '../models/Order.js';
import { createNotification } from '../services/notificationService.js';

export const createTransaction = async (req, res) => {
  try {
    const { orderId, paymentMethodId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    const paymentMethod = await PaymentMethod.findById(paymentMethodId);
    if (!paymentMethod || !paymentMethod.isActive) {
      return res.status(400).json({ message: 'Méthode de paiement non disponible' });
    }

    // Vérifier si la méthode de paiement est disponible pour le montant
    if (!paymentMethod.isAvailable(order.totalPrice)) {
      return res.status(400).json({ message: 'Montant hors limites pour cette méthode de paiement' });
    }

    const fees = paymentMethod.calculateFees(order.totalPrice);

    const transaction = new PaymentTransaction({
      order: orderId,
      user: req.user.id,
      paymentMethod: paymentMethodId,
      amount: order.totalPrice,
      fees,
      currency: 'XOF'
    });

    await transaction.save();

    // Notification à l'utilisateur
    await createNotification({
      user: req.user.id,
      type: 'PAYMENT_INITIATED',
      title: 'Paiement initié',
      message: `Votre paiement de ${transaction.getTotalAmount()} XOF est en cours de traitement`,
      data: { transactionId: transaction._id }
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de la transaction' });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await PaymentTransaction.findById(req.params.id)
      .populate('paymentMethod')
      .populate('order');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction non trouvée' });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la transaction' });
  }
};

export const getUserTransactions = async (req, res) => {
  try {
    const transactions = await PaymentTransaction.find({ user: req.user.id })
      .populate('paymentMethod')
      .populate('order')
      .sort('-createdAt');

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des transactions' });
  }
};

export const updateTransactionStatus = async (req, res) => {
  try {
    const { status, externalReference } = req.body;
    const transaction = await PaymentTransaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction non trouvée' });
    }

    transaction.status = status;
    if (externalReference) {
      transaction.externalReference = externalReference;
    }

    if (status === 'COMPLETED') {
      // Mettre à jour le statut de la commande
      await Order.findByIdAndUpdate(transaction.order, {
        paymentStatus: 'PAID',
        status: 'CONFIRMED'
      });

      // Notification à l'utilisateur
      await createNotification({
        user: transaction.user,
        type: 'PAYMENT_COMPLETED',
        title: 'Paiement confirmé',
        message: `Votre paiement de ${transaction.getTotalAmount()} XOF a été confirmé`,
        data: { transactionId: transaction._id }
      });
    }

    await transaction.save();
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la transaction' });
  }
};

export const refundTransaction = async (req, res) => {
  try {
    const { reason, amount } = req.body;
    const transaction = await PaymentTransaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction non trouvée' });
    }

    if (!transaction.canBeRefunded()) {
      return res.status(400).json({ message: 'Cette transaction ne peut pas être remboursée' });
    }

    const refundAmount = amount || transaction.amount;
    if (refundAmount > transaction.amount) {
      return res.status(400).json({ message: 'Le montant du remboursement ne peut pas dépasser le montant initial' });
    }

    transaction.status = 'REFUNDED';
    transaction.refundDetails = {
      amount: refundAmount,
      reason,
      date: new Date(),
      reference: `REF-${Date.now()}`
    };

    await transaction.save();

    // Notification à l'utilisateur
    await createNotification({
      user: transaction.user,
      type: 'PAYMENT_REFUNDED',
      title: 'Remboursement effectué',
      message: `Votre paiement de ${refundAmount} XOF a été remboursé`,
      data: { transactionId: transaction._id }
    });

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du remboursement de la transaction' });
  }
};