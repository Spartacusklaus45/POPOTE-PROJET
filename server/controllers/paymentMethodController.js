import { PaymentMethod } from '../models/PaymentMethod.js';
import { ExternalAPI } from '../models/ExternalAPI.js';

export const getAllPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find({ isActive: true });
    res.json(paymentMethods);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des méthodes de paiement' });
  }
};

export const getPaymentMethodById = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findById(req.params.id);
    if (!paymentMethod) {
      return res.status(404).json({ message: 'Méthode de paiement non trouvée' });
    }
    res.json(paymentMethod);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la méthode de paiement' });
  }
};

export const createPaymentMethod = async (req, res) => {
  try {
    // Vérifier si l'API externe est configurée
    const api = await ExternalAPI.findOne({
      provider: req.body.provider,
      category: 'payment'
    });

    if (!api) {
      return res.status(400).json({
        message: 'Configuration de l\'API de paiement manquante'
      });
    }

    const paymentMethod = new PaymentMethod({
      ...req.body,
      settings: {
        apiKey: api.apiKey,
        ...req.body.settings
      }
    });

    await paymentMethod.save();
    res.status(201).json(paymentMethod);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de la méthode de paiement' });
  }
};

export const updatePaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!paymentMethod) {
      return res.status(404).json({ message: 'Méthode de paiement non trouvée' });
    }

    res.json(paymentMethod);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la méthode de paiement' });
  }
};

export const deletePaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findById(req.params.id);
    
    if (!paymentMethod) {
      return res.status(404).json({ message: 'Méthode de paiement non trouvée' });
    }

    // Désactiver plutôt que supprimer pour conserver l'historique
    paymentMethod.isActive = false;
    await paymentMethod.save();

    res.json({ message: 'Méthode de paiement désactivée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la méthode de paiement' });
  }
};

export const validatePaymentMethod = async (req, res) => {
  try {
    const { amount, currency = 'XOF' } = req.body;
    const paymentMethod = await PaymentMethod.findById(req.params.id);

    if (!paymentMethod) {
      return res.status(404).json({ message: 'Méthode de paiement non trouvée' });
    }

    const isAvailable = paymentMethod.isAvailable(amount, currency);
    const fees = isAvailable ? paymentMethod.calculateFees(amount) : 0;

    res.json({
      isAvailable,
      fees,
      total: amount + fees,
      currency
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la validation de la méthode de paiement' });
  }
};