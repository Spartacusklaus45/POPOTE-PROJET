import { Wishlist } from '../models/Wishlist.js';
import { createNotification } from '../services/notificationService.js';

export const createWishlist = async (req, res) => {
  try {
    const wishlist = new Wishlist({
      ...req.body,
      user: req.user.id
    });

    if (req.body.isPublic) {
      wishlist.generateShareableLink();
    }

    await wishlist.save();
    res.status(201).json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de la liste de souhaits' });
  }
};

export const getUserWishlists = async (req, res) => {
  try {
    const wishlists = await Wishlist.find({ user: req.user.id })
      .populate('items.product')
      .sort('-updatedAt');
    res.json(wishlists);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des listes de souhaits' });
  }
};

export const getWishlistById = async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id)
      .populate('items.product');

    if (!wishlist) {
      return res.status(404).json({ message: 'Liste de souhaits non trouvée' });
    }

    if (!wishlist.isPublic && wishlist.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la liste de souhaits' });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId, notes, priority, priceAlert } = req.body;
    const wishlist = await Wishlist.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!wishlist) {
      return res.status(404).json({ message: 'Liste de souhaits non trouvée' });
    }

    await wishlist.addProduct(productId, { notes, priority, priceAlert });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du produit' });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!wishlist) {
      return res.status(404).json({ message: 'Liste de souhaits non trouvée' });
    }

    await wishlist.removeProduct(req.params.productId);
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
  }
};

export const updateWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!wishlist) {
      return res.status(404).json({ message: 'Liste de souhaits non trouvée' });
    }

    // Mettre à jour le lien partageable si nécessaire
    if (req.body.isPublic && !wishlist.shareableLink) {
      wishlist.generateShareableLink();
    }

    Object.assign(wishlist, req.body);
    await wishlist.save();

    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la liste de souhaits' });
  }
};

export const deleteWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!wishlist) {
      return res.status(404).json({ message: 'Liste de souhaits non trouvée' });
    }

    res.json({ message: 'Liste de souhaits supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la liste de souhaits' });
  }
};

export const shareWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!wishlist) {
      return res.status(404).json({ message: 'Liste de souhaits non trouvée' });
    }

    wishlist.isPublic = true;
    if (!wishlist.shareableLink) {
      wishlist.generateShareableLink();
    }

    await wishlist.save();

    res.json({
      shareableLink: `${process.env.FRONTEND_URL}/wishlist/${wishlist.shareableLink}`
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du partage de la liste de souhaits' });
  }
};

export const getWishlistByShareableLink = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      shareableLink: req.params.shareableLink,
      isPublic: true
    }).populate('items.product');

    if (!wishlist) {
      return res.status(404).json({ message: 'Liste de souhaits non trouvée' });
    }

    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la liste de souhaits' });
  }
};