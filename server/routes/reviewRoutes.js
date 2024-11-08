import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  voteHelpful,
  moderateReview
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', authMiddleware, createReview);
router.get('/', getReviews);
router.get('/:id', getReviewById);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);
router.post('/:id/vote', authMiddleware, voteHelpful);
router.put('/:id/moderate', authMiddleware, moderateReview);

export default router;