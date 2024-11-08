import { Supplier } from '../models/Supplier.js';
import { createNotification } from '../services/notificationService.js';

export const createSupplier = async (req, res) => {
  try {
    const code = await Supplier.generateCode();
    const supplier = new Supplier({
      ...req.body,
      code
    });

    await supplier.save();

    // Notification aux administrateurs
    await createNotification({
      type: 'NEW_SUPPLIER',
      title: 'Nouveau fournisseur ajouté',
      message: `${supplier.name} a été ajouté comme fournisseur`,
      data: { supplierId: supplier._id }
    });

    res.status(201).json(supplier);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du fournisseur' });
  }
};

export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
      .populate('products.product');

    if (!supplier) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }

    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du fournisseur' });
  }
};

export const getAllSuppliers = async (req, res) => {
  try {
    const { status, type, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (search) {
      query.$text = { $search: search };
    }

    const suppliers = await Supplier.find(query)
      .populate('products.product')
      .sort('name');

    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des fournisseurs' });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('products.product');

    if (!supplier) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }

    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du fournisseur' });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }

    // Désactiver plutôt que supprimer
    supplier.status = 'INACTIVE';
    await supplier.save();

    res.json({ message: 'Fournisseur désactivé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression du fournisseur' });
  }
};

export const addProduct = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }

    supplier.products.push(req.body);
    await supplier.save();

    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du produit' });
  }
};

export const updatePerformance = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }

    supplier.performance = {
      ...supplier.performance,
      ...req.body,
      lastEvaluation: new Date()
    };

    await supplier.save();

    // Notification si le score est bas
    const overallScore = supplier.calculateOverallScore();
    if (overallScore < 70) {
      await createNotification({
        type: 'SUPPLIER_PERFORMANCE',
        title: 'Performance fournisseur faible',
        message: `${supplier.name} a un score de performance de ${overallScore}%`,
        data: { supplierId: supplier._id }
      });
    }

    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la performance' });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }

    supplier.documents.push(req.body);
    await supplier.save();

    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du document' });
  }
};

export const getExpiredDocuments = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }

    const expiredDocs = supplier.getExpiredDocuments();
    res.json(expiredDocs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des documents expirés' });
  }
};

export const getLowStockProducts = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }

    const lowStockProducts = await supplier.getLowStockProducts(
      req.query.threshold ? parseInt(req.query.threshold) : 10
    );
    res.json(lowStockProducts);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des produits en rupture' });
  }
};