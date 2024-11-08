import { Inventory } from '../models/Inventory.js';
import { createNotification } from '../services/notificationService.js';

export const createInventory = async (req, res) => {
  try {
    const inventory = new Inventory(req.body);
    await inventory.save();

    // Notification si le stock est bas
    if (inventory.status === 'LOW_STOCK') {
      await createNotification({
        type: 'INVENTORY_ALERT',
        title: 'Stock bas',
        message: `Le stock de ${inventory.product.name} est bas`,
        data: { inventoryId: inventory._id }
      });
    }

    res.status(201).json(inventory);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'inventaire' });
  }
};

export const getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id)
      .populate('product')
      .populate('supplier');

    if (!inventory) {
      return res.status(404).json({ message: 'Inventaire non trouvé' });
    }

    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'inventaire' });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!inventory) {
      return res.status(404).json({ message: 'Inventaire non trouvé' });
    }

    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'inventaire' });
  }
};

export const deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    
    if (!inventory) {
      return res.status(404).json({ message: 'Inventaire non trouvé' });
    }

    // Marquer comme discontinué plutôt que supprimer
    inventory.status = 'DISCONTINUED';
    await inventory.save();

    res.json({ message: 'Inventaire marqué comme discontinué' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'inventaire' });
  }
};

export const adjustQuantity = async (req, res) => {
  try {
    const { adjustment, reason } = req.body;
    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({ message: 'Inventaire non trouvé' });
    }

    const newQuantity = inventory.quantity + adjustment;
    if (newQuantity < 0) {
      return res.status(400).json({ message: 'Quantité insuffisante' });
    }

    inventory.quantity = newQuantity;
    await inventory.save();

    // Notification si le stock devient bas
    if (inventory.status === 'LOW_STOCK') {
      await createNotification({
        type: 'INVENTORY_ALERT',
        title: 'Stock bas',
        message: `Le stock de ${inventory.product.name} est bas`,
        data: { inventoryId: inventory._id }
      });
    }

    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'ajustement de la quantité' });
  }
};

export const checkAvailability = async (req, res) => {
  try {
    const { productId, quantity } = req.query;
    const inventory = await Inventory.findOne({ product: productId });

    if (!inventory) {
      return res.status(404).json({ message: 'Produit non trouvé dans l\'inventaire' });
    }

    await inventory.cleanExpiredReservations();
    const availableQuantity = inventory.getAvailableQuantity();

    res.json({
      available: availableQuantity >= quantity,
      quantity: availableQuantity,
      status: inventory.status
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la vérification de la disponibilité' });
  }
};

export const reserveStock = async (req, res) => {
  try {
    const { quantity, orderId } = req.body;
    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({ message: 'Inventaire non trouvé' });
    }

    await inventory.cleanExpiredReservations();
    await inventory.reserve(quantity, orderId);

    res.json({ message: 'Stock réservé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la réservation du stock' });
  }
};