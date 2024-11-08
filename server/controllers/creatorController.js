import Creator from '../models/Creator.js';
import Recipe from '../models/Recipe.js';
import { createNotification } from '../services/notificationService.js';

export const registerCreator = async (req, res) => {
  try {
    const existingCreator = await Creator.findOne({ user: req.user.id });
    if (existingCreator) {
      return res.status(400).json({ message: 'Vous êtes déjà créateur' });
    }

    const creator = new Creator({
      user: req.user.id,
      ...req.body
    });

    await creator.save();
    res.status(201).json(creator);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'inscription en tant que créateur' });
  }
};

export const getCreatorStats = async (req, res) => {
  try {
    const creator = await Creator.findOne({ user: req.user.id });
    if (!creator) {
      return res.status(404).json({ message: 'Créateur non trouvé' });
    }

    const stats = await creator.calculateStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
};

export const submitRecipeForReview = async (req, res) => {
  try {
    const creator = await Creator.findOne({ user: req.user.id });
    if (!creator) {
      return res.status(404).json({ message: 'Créateur non trouvé' });
    }

    const recipe = new Recipe({
      ...req.body,
      author: req.user.id,
      status: 'PENDING'
    });

    await recipe.save();

    // Notification pour l'équipe de modération
    await createNotification({
      type: 'RECIPE_SUBMITTED',
      title: 'Nouvelle recette à valider',
      message: `${creator.user.name} a soumis une nouvelle recette pour validation`,
      data: { recipeId: recipe._id }
    });

    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la soumission de la recette' });
  }
};

export const withdrawEarnings = async (req, res) => {
  try {
    const { amount } = req.body;
    const creator = await Creator.findOne({ user: req.user.id });
    
    if (!creator) {
      return res.status(404).json({ message: 'Créateur non trouvé' });
    }

    if (creator.availableBalance < amount) {
      return res.status(400).json({ message: 'Solde insuffisant' });
    }

    creator.availableBalance -= amount;
    await creator.save();

    // Enregistrer la transaction
    // Implémenter la logique de paiement ici

    res.json({ message: 'Retrait effectué avec succès', newBalance: creator.availableBalance });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du retrait' });
  }
};

export const getMonthlyEarnings = async (req, res) => {
  try {
    const creator = await Creator.findOne({ user: req.user.id });
    if (!creator) {
      return res.status(404).json({ message: 'Créateur non trouvé' });
    }

    const earnings = await creator.calculateMonthlyEarnings();
    res.json(earnings);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du calcul des gains' });
  }
};

export const updateCreatorProfile = async (req, res) => {
  try {
    const creator = await Creator.findOneAndUpdate(
      { user: req.user.id },
      { $set: req.body },
      { new: true }
    );

    if (!creator) {
      return res.status(404).json({ message: 'Créateur non trouvé' });
    }

    res.json(creator);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
  }
};