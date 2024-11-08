import { Discount } from '../models/Discount.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';

export const createDiscount = async (req, res) => {
  try {
    const discount = new Discount(req.body);
    await discount.save();
    res.status(201).json(discount);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de la réduction' });
  }
};

export const getDiscountById = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) {
      return res.status(404).json({ message: 'Réduction non trouvée' });
    }
    res.json(discount);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la réduction' });
  }
};

export const validateDiscount = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const discount = await Discount.findOne({ code: code.toUpperCase() });

    if (!discount) {
      return res.status(404).json({ message: 'Code de réduction invalide' });
    }

    // Vérifier si l'utilisateur a déjà utilisé ce code
    const userOrders = await Order.find({
      user: req.user.id,
      'discount.code': code
    });

    if (userOrders.length >= discount.usageLimit.perUser) {
      return res.status(400).json({ message: 'Vous avez déjà utilisé ce code' });
    }

    // Vérifier si le code est valide
    if (!discount.isValid(req.user, orderAmount)) {
      return res.status(400).json({ message: 'Code de réduction non valide pour cette commande' });
    }

    // Calculer la réduction
    const discountAmount = discount.calculateDiscount(orderAmount);

    res.json({
      discount,
      discountAmount,
      finalAmount: orderAmount - discountAmount
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la validation du code' });
  }
};

export const updateDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!discount) {
      return res.status(404).json({ message: 'Réduction non trouvée' });
    }

    res.json(discount);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la réduction' });
  }
};

export const deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    
    if (!discount) {
      return res.status(404).json({ message: 'Réduction non trouvée' });
    }

    // Désactiver plutôt que supprimer
    discount.isActive = false;
    await discount.save();

    res.json({ message: 'Réduction désactivée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la réduction' });
  }
};

export const getActiveDiscounts = async (req, res) => {
  try {
    const now = new Date();
    const discounts = await Discount.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    res.json(discounts);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des réductions actives' });
  }
};

export const getUserDiscounts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const now = new Date();

    // Trouver les réductions applicables à l'utilisateur
    const discounts = await Discount.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
      $or: [
        { 'applicableTo.users': user._id },
        { 'conditions.newUsers': user.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        { 'applicableTo.users': { $exists: false } }
      ]
    });

    res.json(discounts);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des réductions' });
  }
};