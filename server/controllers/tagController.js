import { Tag } from '../models/Tag.js';

export const createTag = async (req, res) => {
  try {
    const tag = new Tag(req.body);
    await tag.save();
    res.status(201).json(tag);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du tag' });
  }
};

export const getAllTags = async (req, res) => {
  try {
    const { type, parent } = req.query;
    const query = { isActive: true };

    if (type) query.type = type;
    if (parent) query.parent = parent;

    const tags = await Tag.find(query)
      .populate('parent')
      .sort('order');

    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des tags' });
  }
};

export const getTagById = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id)
      .populate('parent');

    if (!tag) {
      return res.status(404).json({ message: 'Tag non trouvé' });
    }

    res.json(tag);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du tag' });
  }
};

export const getTagBySlug = async (req, res) => {
  try {
    const tag = await Tag.findOne({ slug: req.params.slug })
      .populate('parent');

    if (!tag) {
      return res.status(404).json({ message: 'Tag non trouvé' });
    }

    res.json(tag);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du tag' });
  }
};

export const updateTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('parent');

    if (!tag) {
      return res.status(404).json({ message: 'Tag non trouvé' });
    }

    res.json(tag);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du tag' });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    
    if (!tag) {
      return res.status(404).json({ message: 'Tag non trouvé' });
    }

    // Vérifier s'il y a des tags enfants
    const children = await tag.getChildren();
    if (children.length > 0) {
      return res.status(400).json({
        message: 'Impossible de supprimer ce tag car il contient des tags enfants'
      });
    }

    // Désactiver plutôt que supprimer
    tag.isActive = false;
    await tag.save();

    res.json({ message: 'Tag désactivé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression du tag' });
  }
};

export const getTagHierarchy = async (req, res) => {
  try {
    const tags = await Tag.find({ parent: null, isActive: true })
      .sort('order');

    const hierarchy = await Promise.all(
      tags.map(async (tag) => ({
        ...tag.toObject(),
        children: await buildTagHierarchy(tag._id)
      }))
    );

    res.json(hierarchy);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la hiérarchie des tags' });
  }
};

// Fonction récursive pour construire la hiérarchie des tags
async function buildTagHierarchy(parentId) {
  const children = await Tag.find({ parent: parentId, isActive: true })
    .sort('order');

  return Promise.all(
    children.map(async (child) => ({
      ...child.toObject(),
      children: await buildTagHierarchy(child._id)
    }))
  );
}