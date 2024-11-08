import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  registerCreator,
  getCreatorStats,
  submitRecipeForReview,
  withdrawEarnings,
  getMonthlyEarnings,
  updateCreatorProfile
} from '../controllers/creatorController.js';

const router = express.Router();

router.post('/register', authMiddleware, registerCreator);
router.get('/stats', authMiddleware, getCreatorStats);
router.post('/recipes/submit', authMiddleware, submitRecipeForReview);
router.post('/withdraw', authMiddleware, withdrawEarnings);
router.get('/earnings/monthly', authMiddleware, getMonthlyEarnings);
router.put('/profile', authMiddleware, updateCreatorProfile);

export default router;