import { Router } from 'express';
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  createRecipeReview
} from '../controllers/recipeController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createRecipeSchema, updateRecipeSchema, reviewSchema } from '../validations/recipeValidation';

const router = Router();

router.get('/', getRecipes);
router.get('/:id', getRecipeById);
router.post('/', protect, validate(createRecipeSchema), createRecipe);
router.put('/:id', protect, validate(updateRecipeSchema), updateRecipe);
router.post('/:id/reviews', protect, validate(reviewSchema), createRecipeReview);

export default router;