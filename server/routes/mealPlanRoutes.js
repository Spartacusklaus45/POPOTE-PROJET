import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createMealPlan,
  getMealPlans,
  getMealPlanById,
  updateMealPlan,
  deleteMealPlan
} from '../controllers/mealPlanController.js';

const router = express.Router();

router.post('/', authMiddleware, createMealPlan);
router.get('/', authMiddleware, getMealPlans);
router.get('/:id', authMiddleware, getMealPlanById);
router.put('/:id', authMiddleware, updateMealPlan);
router.delete('/:id', authMiddleware, deleteMealPlan);

export default router;