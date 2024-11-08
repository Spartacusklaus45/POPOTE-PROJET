import { Review } from '../models/Review.js';
import { Order } from '../models/Order.js';
import { createNotification } from '../services/notificationService.js';

export const createReview = async (req, res) => {
  try {
    // Vérifier si l'utilisateur a acheté le produit
    const hasOrdered = await Order.exists({
      user: req.user.id,
      'products.product': req.body.product,
      status: 'DELIVERED'
    });

    const review = new Review({
      ...req.body,
      user: req.user.id,
      isVerifiedPurchase: !!hasOrdered
    });

    await review.save();

    // Notification au vendeur
    await createNotification({
      type: 'NEW_REVIEW',
      title: 'Nouvel avis client',
      message: `Un nouvel avis ${review.rating} étoiles a été publié`,
      data: { reviewId: review._id }
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'avis' });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { product, sort = '-createdAt', rating, verified } = req.query;
    const query = { status: 'APPROVED' };

    if (product) query.product = product;
    if (rating) query.rating = rating;
    if (verified === 'true') query.isVerifiedPurchase = true;

    const reviews = await Review.find(query)
      .populate('user', 'name avatar')
      .sort(sort);

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des avis' });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'name avatar');

    if (!review) {
      return res.status(404).json({ message: 'Avis non trouvé' });
    }

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'avis' });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Avis non trouvé' });
    }

    if (!review.canBeEditedBy(req.user.id)) {
      return res.status(403).json({ message: 'Vous ne pouvez plus modifier cet avis' });
    }

    Object.assign(review, req.body);
    review.edited = {
      isEdited: true,
      lastEditDate: new Date()
    };

    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'avis' });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Avis non trouvé' });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await review.remove();
    res.json({ message: 'Avis supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'avis' });
  }
};

export const voteHelpful = async (req, res) => {
  try {
    const { isHelpful } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Avis non trouvé' });
    }

    await review.addHelpfulVote(req.user.id, isHelpful);
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du vote' });
  }
};

export const moderateReview = async (req, res) => {
  try {
    const { status, moderationNotes } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Avis non trouvé' });
    }

    review.status = status;
    review.moderationNotes = moderationNotes;
    await review.save();

    // Notification à l'utilisateur
    await createNotification({
      user: review.user,
      type: 'REVIEW_MODERATED',
      title: 'Statut de votre avis',
      message: `Votre avis a été ${status === 'APPROVED' ? 'approuvé' : 'rejeté'}`,
      data: { reviewId: review._id }
    });

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la modération de l\'avis' });
  }
};