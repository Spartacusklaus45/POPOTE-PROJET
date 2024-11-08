import { Address } from '../models/Address.js';
import { createNotification } from '../services/notificationService.js';

export const createAddress = async (req, res) => {
  try {
    const address = new Address({
      ...req.body,
      user: req.user.id
    });

    // Si c'est la première adresse, la définir comme adresse par défaut
    const existingAddresses = await Address.countDocuments({
      user: req.user.id,
      type: address.type
    });
    if (existingAddresses === 0) {
      address.isDefault = true;
    }

    await address.save();

    // Vérifier si l'adresse est dans une zone de livraison
    const isInDeliveryZone = await address.isInDeliveryZone();
    if (!isInDeliveryZone && address.type === 'SHIPPING') {
      await createNotification({
        user: req.user.id,
        type: 'ADDRESS_WARNING',
        title: 'Zone de livraison non desservie',
        message: 'Cette adresse n\'est pas dans notre zone de livraison actuelle',
        data: { addressId: address._id }
      });
    }

    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'adresse' });
  }
};

export const getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id })
      .sort('-isDefault -createdAt');
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des adresses' });
  }
};

export const getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    
    if (!address) {
      return res.status(404).json({ message: 'Adresse non trouvée' });
    }

    if (address.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    res.json(address);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'adresse' });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!address) {
      return res.status(404).json({ message: 'Adresse non trouvée' });
    }

    Object.assign(address, req.body);
    await address.save();

    res.json(address);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'adresse' });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!address) {
      return res.status(404).json({ message: 'Adresse non trouvée' });
    }

    await address.remove();

    // Si c'était l'adresse par défaut, définir une nouvelle adresse par défaut
    if (address.isDefault) {
      const nextDefaultAddress = await Address.findOne({
        user: req.user.id,
        type: address.type
      });
      if (nextDefaultAddress) {
        nextDefaultAddress.isDefault = true;
        await nextDefaultAddress.save();
      }
    }

    res.json({ message: 'Adresse supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'adresse' });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!address) {
      return res.status(404).json({ message: 'Adresse non trouvée' });
    }

    address.isDefault = true;
    await address.save();

    res.json(address);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la définition de l\'adresse par défaut' });
  }
};

export const verifyAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!address) {
      return res.status(404).json({ message: 'Adresse non trouvée' });
    }

    address.isVerified = true;
    address.verificationDate = new Date();
    await address.save();

    res.json(address);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la vérification de l\'adresse' });
  }
};