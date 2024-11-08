import { ReturnRequest } from '../models/ReturnRequest.js';
import { Order } from '../models/Order.js';
import { createNotification } from '../services/notificationService.js';
import { processRefund } from '../services/paymentService.js';

export const createReturnRequest = async (req, res) => {
  try {
    const order = await Order.findById(req.body.order);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier si la commande est éligible pour un retour
    const orderDate = new Date(order.deliveredAt);
    const returnWindow = new Date(orderDate.setDate(orderDate.getDate() + 14));
    if (new Date() > returnWindow) {
      return res.status(400).json({ message: 'La période de retour est expirée' });
    }

    const returnRequest = new ReturnRequest({
      ...req.body,
      user: req.user.id
    });

    // Calculer le montant du remboursement
    returnRequest.refundAmount = returnRequest.calculateRefundAmount();

    await returnRequest.save();

    // Notification à l'administrateur
    await createNotification({
      type: 'NEW_RETURN_REQUEST',
      title: 'Nouvelle demande de retour',
      message: `Nouvelle demande de retour pour la commande #${order._id}`,
      data: { returnRequestId: returnRequest._id }
    });

    res.status(201).json(returnRequest);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de la demande de retour' });
  }
};

export const getReturnRequestById = async (req, res) => {
  try {
    const returnRequest = await ReturnRequest.findById(req.params.id)
      .populate('order')
      .populate('items.product')
      .populate('resolution.decidedBy', 'name');

    if (!returnRequest) {
      return res.status(404).json({ message: 'Demande de retour non trouvée' });
    }

    if (returnRequest.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    res.json(returnRequest);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la demande de retour' });
  }
};

export const getUserReturnRequests = async (req, res) => {
  try {
    const returnRequests = await ReturnRequest.find({ user: req.user.id })
      .populate('order')
      .sort('-createdAt');

    res.json(returnRequests);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des demandes de retour' });
  }
};

export const approveReturnRequest = async (req, res) => {
  try {
    const returnRequest = await ReturnRequest.findById(req.params.id);
    if (!returnRequest) {
      return res.status(404).json({ message: 'Demande de retour non trouvée' });
    }

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await returnRequest.approve(req.user.id, req.body.notes);

    // Notification à l'utilisateur
    await createNotification({
      user: returnRequest.user,
      type: 'RETURN_REQUEST_APPROVED',
      title: 'Demande de retour approuvée',
      message: 'Votre demande de retour a été approuvée',
      data: { returnRequestId: returnRequest._id }
    });

    res.json(returnRequest);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'approbation de la demande de retour' });
  }
};

export const rejectReturnRequest = async (req, res) => {
  try {
    const returnRequest = await ReturnRequest.findById(req.params.id);
    if (!returnRequest) {
      return res.status(404).json({ message: 'Demande de retour non trouvée' });
    }

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await returnRequest.reject(req.user.id, req.body.notes);

    // Notification à l'utilisateur
    await createNotification({
      user: returnRequest.user,
      type: 'RETURN_REQUEST_REJECTED',
      title: 'Demande de retour rejetée',
      message: 'Votre demande de retour a été rejetée',
      data: { returnRequestId: returnRequest._id }
    });

    res.json(returnRequest);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du rejet de la demande de retour' });
  }
};

export const processReturnRefund = async (req, res) => {
  try {
    const returnRequest = await ReturnRequest.findById(req.params.id);
    if (!returnRequest) {
      return res.status(404).json({ message: 'Demande de retour non trouvée' });
    }

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    if (returnRequest.status !== 'APPROVED') {
      return res.status(400).json({ message: 'La demande doit être approuvée avant le remboursement' });
    }

    // Traiter le remboursement
    const refundResult = await processRefund({
      amount: returnRequest.refundAmount,
      returnRequest: returnRequest._id,
      method: returnRequest.refundMethod
    });

    returnRequest.refundStatus = 'PROCESSED';
    await returnRequest.complete();

    // Notification à l'utilisateur
    await createNotification({
      user: returnRequest.user,
      type: 'RETURN_REFUND_PROCESSED',
      title: 'Remboursement traité',
      message: `Votre remboursement de ${returnRequest.refundAmount} XOF a été traité`,
      data: { returnRequestId: returnRequest._id }
    });

    res.json(returnRequest);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du traitement du remboursement' });
  }
};