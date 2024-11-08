import { Request, Response } from 'express';
import { Recipe } from '../models/Recipe';

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
export const getRecipes = async (req: Request, res: Response) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } }
          ]
        }
      : {};

    const count = await Recipe.countDocuments({ ...keyword });
    const recipes = await Recipe.find({ ...keyword })
      .populate('author', 'name')
      .populate('ingredients.item')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort('-createdAt');

    res.json({
      recipes,
      page,
      pages: Math.ceil(count / pageSize)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
export const getRecipeById = async (req: Request, res: Response) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'name')
      .populate('ingredients.item')
      .populate('reviews.user', 'name avatar');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a recipe
// @route   POST /api/recipes
// @access  Private
export const createRecipe = async (req: Request, res: Response) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      author: req.user._id
    });

    const createdRecipe = await recipe.save();
    res.status(201).json(createdRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private
export const updateRecipe = async (req: Request, res: Response) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    )
      .populate('author', 'name')
      .populate('ingredients.item');

    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create recipe review
// @route   POST /api/recipes/:id/reviews
// @access  Private
export const createRecipeReview = async (req: Request, res: Response) => {
  try {
    const { rating, comment } = req.body;

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const alreadyReviewed = recipe.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Recipe already reviewed' });
    }

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment
    };

    recipe.reviews.push(review);

    recipe.rating =
      recipe.reviews.reduce((acc, item) => item.rating + acc, 0) /
      recipe.reviews.length;

    await recipe.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};