import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
  searchRecipes
} from '../controllers/recipeController.js';

const router = express.Router();

router.get('/', getAllRecipes);
router.get('/search', searchRecipes);
router.get('/:id', getRecipeById);
router.post('/', authMiddleware, createRecipe);
router.put('/:id', authMiddleware, updateRecipe);
router.delete('/:id', authMiddleware, deleteRecipe);
router.post('/:id/rate', authMiddleware, rateRecipe);

export default router;