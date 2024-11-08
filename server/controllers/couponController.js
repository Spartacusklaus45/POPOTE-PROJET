import { Coupon } from '../models/Coupon.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';

export const createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du coupon' });
  }
};

export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon non trouvé' });
    }
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du coupon' });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: 'Code de réduction invalide' });
    }

    // Vérifier si l'utilisateur a déjà utilisé ce coupon
    const userOrders = await Order.find({
      user: req.user.id,
      'coupon.code': code
    });

    if (userOrders.length >= coupon.usageLimit.perUser) {
      return res.status(400).json({ message: 'Vous avez déjà utilisé ce code' });
    }

    // Vérifier si le coupon est valide
    if (!coupon.isValid(req.user, orderAmount)) {
      return res.status(400).json({ message: 'Code de réduction non valide pour cette commande' });
    }

    // Calculer la réduction
    const discountAmount = coupon.calculateDiscount(orderAmount);

    res.json({
      coupon,
      discountAmount,
      finalAmount: orderAmount - discountAmount
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la validation du code' });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon non trouvé' });
    }

    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du coupon' });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon non trouvé' });
    }

    // Désactiver plutôt que supprimer
    coupon.isActive = false;
    await coupon.save();

    res.json({ message: 'Coupon désactivé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression du coupon' });
  }
};

export const getActiveCoupons = async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des coupons actifs' });
  }
};

export const getUserCoupons = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const now = new Date();

    // Trouver les coupons applicables à l'utilisateur
    const coupons = await Coupon.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
      $or: [
        { 'applicableTo.users': user._id },
        { 'conditions.newUsers': user.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        { 'applicableTo.users': { $exists: false } }
      ]
    });

    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des coupons' });
  }
};