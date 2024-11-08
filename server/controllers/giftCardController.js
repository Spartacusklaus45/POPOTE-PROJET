import { GiftCard } from '../models/GiftCard.js';
import { createNotification } from '../services/notificationService.js';
import { sendEmail } from '../services/emailService.js';

export const createGiftCard = async (req, res) => {
  try {
    const code = await GiftCard.generateUniqueCode();
    const giftCard = new GiftCard({
      ...req.body,
      code,
      balance: req.body.amount,
      purchaser: req.user.id
    });

    await giftCard.save();

    // Envoyer un email au destinataire si spécifié
    if (giftCard.recipient.email) {
      await sendEmail({
        to: giftCard.recipient.email,
        subject: 'Vous avez reçu une carte cadeau !',
        html: `
          <h1>Carte cadeau Popote</h1>
          <p>Bonjour ${giftCard.recipient.name},</p>
          <p>Vous avez reçu une carte cadeau d'une valeur de ${giftCard.amount} XOF.</p>
          <p>Code : ${giftCard.code}</p>
          <p>Message : ${giftCard.recipient.message || ''}</p>
          <p>Valable jusqu'au : ${new Date(giftCard.expiryDate).toLocaleDateString()}</p>
        `
      });
    }

    res.status(201).json(giftCard);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de la carte cadeau' });
  }
};

export const getGiftCardByCode = async (req, res) => {
  try {
    const giftCard = await GiftCard.findOne({ code: req.params.code });
    
    if (!giftCard) {
      return res.status(404).json({ message: 'Carte cadeau non trouvée' });
    }

    res.json({
      isValid: giftCard.isValid(),
      balance: giftCard.balance,
      expiryDate: giftCard.expiryDate
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la carte cadeau' });
  }
};

export const getUserGiftCards = async (req, res) => {
  try {
    const giftCards = await GiftCard.find({
      $or: [
        { purchaser: req.user.id },
        { redeemedBy: req.user.id }
      ]
    }).sort('-createdAt');

    res.json(giftCards);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des cartes cadeaux' });
  }
};

export const useGiftCard = async (req, res) => {
  try {
    const { code, amount, orderId } = req.body;
    const giftCard = await GiftCard.findOne({ code });

    if (!giftCard) {
      return res.status(404).json({ message: 'Carte cadeau non trouvée' });
    }

    await giftCard.use(amount, orderId, req.user.id);

    // Notification au propriétaire
    if (giftCard.purchaser.toString() !== req.user.id) {
      await createNotification({
        user: giftCard.purchaser,
        type: 'GIFT_CARD_USED',
        title: 'Carte cadeau utilisée',
        message: `Votre carte cadeau a été utilisée pour un montant de ${amount} XOF`,
        data: { giftCardId: giftCard._id }
      });
    }

    res.json(giftCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const refundGiftCard = async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    const giftCard = await GiftCard.findById(req.params.id);

    if (!giftCard) {
      return res.status(404).json({ message: 'Carte cadeau non trouvée' });
    }

    await giftCard.refund(amount, orderId);

    // Notification à l'utilisateur
    await createNotification({
      user: giftCard.redeemedBy,
      type: 'GIFT_CARD_REFUNDED',
      title: 'Remboursement sur carte cadeau',
      message: `Un montant de ${amount} XOF a été remboursé sur votre carte cadeau`,
      data: { giftCardId: giftCard._id }
    });

    res.json(giftCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const cancelGiftCard = async (req, res) => {
  try {
    const giftCard = await GiftCard.findOne({
      _id: req.params.id,
      purchaser: req.user.id
    });

    if (!giftCard) {
      return res.status(404).json({ message: 'Carte cadeau non trouvée' });
    }

    if (giftCard.status !== 'ACTIVE' || giftCard.redeemedBy) {
      return res.status(400).json({ message: 'Cette carte ne peut pas être annulée' });
    }

    giftCard.status = 'CANCELLED';
    await giftCard.save();

    res.json({ message: 'Carte cadeau annulée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'annulation de la carte cadeau' });
  }
};