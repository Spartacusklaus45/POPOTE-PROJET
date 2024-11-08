import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createFAQ,
  getAllFAQs,
  getFAQById,
  updateFAQ,
  deleteFAQ,
  voteFAQ,
  getFAQsByCategory,
  searchFAQs
} from '../controllers/faqController.js';

const router = express.Router();

router.post('/', authMiddleware, createFAQ);
router.get('/', getAllFAQs);
router.get('/search', searchFAQs);
router.get('/category/:category', getFAQsByCategory);
router.get('/:id', getFAQById);
router.put('/:id', authMiddleware, updateFAQ);
router.delete('/:id', authMiddleware, deleteFAQ);
router.post('/:id/vote', voteFAQ);

export default router;