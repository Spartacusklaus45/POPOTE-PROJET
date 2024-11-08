import { DietaryPreference } from '../models/DietaryPreference.js';
import { Recipe } from '../models/Recipe.js';

export const getAllPreferences = async (req, res) => {
  try {
    const preferences = await DietaryPreference.find()
      .populate('restrictions.ingredient')
      .populate('allowedIngredients')
      .populate('substitutions.original')
      .populate('substitutions.substitute');
    res.json(preferences);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching preferences' });
  }
};

export const getPreferenceById = async (req, res) => {
  try {
    const preference = await DietaryPreference.findById(req.params.id)
      .populate('restrictions.ingredient')
      .populate('allowedIngredients')
      .populate('substitutions.original')
      .populate('substitutions.substitute');
    
    if (!preference) {
      return res.status(404).json({ message: 'Preference not found' });
    }
    res.json(preference);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching preference' });
  }
};

export const getPreferencesByType = async (req, res) => {
  try {
    const preferences = await DietaryPreference.find({ type: req.params.type })
      .populate('restrictions.ingredient')
      .populate('allowedIngredients');
    res.json(preferences);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching preferences by type' });
  }
};

export const createPreference = async (req, res) => {
  try {
    const preference = new DietaryPreference(req.body);
    await preference.save();
    res.status(201).json(preference);
  } catch (err) {
    res.status(500).json({ message: 'Error creating preference' });
  }
};

export const updatePreference = async (req, res) => {
  try {
    const preference = await DietaryPreference.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!preference) {
      return res.status(404).json({ message: 'Preference not found' });
    }
    res.json(preference);
  } catch (err) {
    res.status(500).json({ message: 'Error updating preference' });
  }
};

export const deletePreference = async (req, res) => {
  try {
    const preference = await DietaryPreference.findByIdAndDelete(req.params.id);
    if (!preference) {
      return res.status(404).json({ message: 'Preference not found' });
    }
    res.json({ message: 'Preference deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting preference' });
  }
};

export const getSubstitutes = async (req, res) => {
  try {
    const preference = await DietaryPreference.findById(req.params.id)
      .populate('substitutions.original')
      .populate('substitutions.substitute');
    
    if (!preference) {
      return res.status(404).json({ message: 'Preference not found' });
    }
    
    res.json(preference.substitutions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching substitutes' });
  }
};

export const getCompatibleRecipes = async (req, res) => {
  try {
    const preference = await DietaryPreference.findById(req.params.id);
    if (!preference) {
      return res.status(404).json({ message: 'Preference not found' });
    }

    const recipes = await Recipe.find().populate('ingredients.item');
    const compatibleRecipes = recipes.filter(recipe => {
      return recipe.ingredients.every(ingredient => 
        preference.isIngredientAllowed(ingredient.item._id)
      );
    });

    res.json(compatibleRecipes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching compatible recipes' });
  }
};