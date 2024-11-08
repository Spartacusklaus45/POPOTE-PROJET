import { ShippingMethod } from '../models/ShippingMethod.js';
import { ExternalAPI } from '../models/ExternalAPI.js';

export const getAllShippingMethods = async (req, res) => {
  try {
    const shippingMethods = await ShippingMethod.find({ isActive: true });
    res.json(shippingMethods);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des méthodes de livraison' });
  }
};

export const getShippingMethodById = async (req, res) => {
  try {
    const shippingMethod = await ShippingMethod.findById(req.params.id);
    if (!shippingMethod) {
      return res.status(404).json({ message: 'Méthode de livraison non trouvée' });
    }
    res.json(shippingMethod);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la méthode de livraison' });
  }
};

export const createShippingMethod = async (req, res) => {
  try {
    // Vérifier si l'API externe est configurée
    if (req.body.provider) {
      const api = await ExternalAPI.findOne({
        provider: req.body.provider.name,
        category: 'delivery'
      });

      if (!api) {
        return res.status(400).json({
          message: 'Configuration de l\'API de livraison manquante'
        });
      }

      req.body.provider.apiKey = api.apiKey;
    }

    const shippingMethod = new ShippingMethod(req.body);
    await shippingMethod.save();
    res.status(201).json(shippingMethod);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de la méthode de livraison' });
  }
};

export const updateShippingMethod = async (req, res) => {
  try {
    const shippingMethod = await ShippingMethod.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!shippingMethod) {
      return res.status(404).json({ message: 'Méthode de livraison non trouvée' });
    }

    res.json(shippingMethod);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la méthode de livraison' });
  }
};

export const deleteShippingMethod = async (req, res) => {
  try {
    const shippingMethod = await ShippingMethod.findById(req.params.id);
    
    if (!shippingMethod) {
      return res.status(404).json({ message: 'Méthode de livraison non trouvée' });
    }

    // Désactiver plutôt que supprimer
    shippingMethod.isActive = false;
    await shippingMethod.save();

    res.json({ message: 'Méthode de livraison désactivée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la méthode de livraison' });
  }
};

export const calculateShippingCost = async (req, res) => {
  try {
    const { distance, zone, orderAmount, weight } = req.body;
    const shippingMethod = await ShippingMethod.findById(req.params.id);

    if (!shippingMethod) {
      return res.status(404).json({ message: 'Méthode de livraison non trouvée' });
    }

    const isAvailable = shippingMethod.isAvailable(orderAmount, weight, distance, zone);
    if (!isAvailable) {
      return res.status(400).json({ message: 'Méthode de livraison non disponible pour cette commande' });
    }

    const cost = shippingMethod.calculateShippingCost(distance, zone);
    const estimatedDeliveryTime = {
      min: shippingMethod.minDeliveryTime,
      max: shippingMethod.maxDeliveryTime,
      unit: shippingMethod.timeUnit
    };

    res.json({
      cost,
      estimatedDeliveryTime,
      isAvailable: true
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du calcul des frais de livraison' });
  }
};

export const getAvailableMethodsByZone = async (req, res) => {
  try {
    const { district, city, orderAmount } = req.query;
    
    const methods = await ShippingMethod.find({
      isActive: true,
      'availableZones': {
        $elemMatch: {
          district,
          city,
          minOrderAmount: { $lte: orderAmount }
        }
      }
    });

    res.json(methods);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la recherche des méthodes de livraison' });
  }
};