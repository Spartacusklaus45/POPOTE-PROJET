import { KitchenEquipment } from '../models/KitchenEquipment.js';
import { Recipe } from '../models/Recipe.js';

export const getAllEquipment = async (req, res) => {
  try {
    const equipment = await KitchenEquipment.find()
      .sort('category');
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching equipment' });
  }
};

export const getEquipmentById = async (req, res) => {
  try {
    const equipment = await KitchenEquipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching equipment' });
  }
};

export const getEquipmentByCategory = async (req, res) => {
  try {
    const equipment = await KitchenEquipment.find({ category: req.params.category });
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching equipment by category' });
  }
};

export const searchEquipment = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice } = req.query;
    const query = {};

    if (q) {
      query.$text = { $search: q };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const equipment = await KitchenEquipment.find(query);
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: 'Error searching equipment' });
  }
};

export const createEquipment = async (req, res) => {
  try {
    const equipment = new KitchenEquipment(req.body);
    await equipment.save();
    res.status(201).json(equipment);
  } catch (err) {
    res.status(500).json({ message: 'Error creating equipment' });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const equipment = await KitchenEquipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: 'Error updating equipment' });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    const equipment = await KitchenEquipment.findByIdAndDelete(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json({ message: 'Equipment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting equipment' });
  }
};

export const getCompatibleRecipes = async (req, res) => {
  try {
    const equipment = await KitchenEquipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    const recipes = await Recipe.find({
      _id: { $in: equipment.compatibleRecipes }
    });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching compatible recipes' });
  }
};