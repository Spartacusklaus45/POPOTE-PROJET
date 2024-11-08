import Recipe from '../models/Recipe.js';

export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ isPublished: true })
      .populate('author', 'name')
      .sort('-createdAt');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recipes' });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'name')
      .populate('ingredients.item');
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recipe' });
  }
};

export const createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      author: req.user.id
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Error creating recipe' });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedRecipe);
  } catch (err) {
    res.status(500).json({ message: 'Error updating recipe' });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await recipe.remove();
    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting recipe' });
  }
};

export const rateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const { rating, comment } = req.body;

    const ratingIndex = recipe.ratings.findIndex(
      r => r.user.toString() === req.user.id
    );

    if (ratingIndex > -1) {
      recipe.ratings[ratingIndex] = { user: req.user.id, rating, comment };
    } else {
      recipe.ratings.push({ user: req.user.id, rating, comment });
    }

    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Error rating recipe' });
  }
};

export const searchRecipes = async (req, res) => {
  try {
    const query = { isPublished: true };
    const { q, category, cuisine, difficulty } = req.query;

    if (q) {
      query.$text = { $search: q };
    }

    if (category) {
      query.category = category;
    }

    if (cuisine) {
      query.cuisine = cuisine;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    const recipes = await Recipe.find(query)
      .populate('author', 'name')
      .sort('-createdAt');

    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Error searching recipes' });
  }
};