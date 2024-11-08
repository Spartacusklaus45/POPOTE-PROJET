import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createDiscount,
  getDiscountById,
  validateDiscount,
  updateDiscount,
  deleteDiscount,
  getActiveDiscounts,
  getUserDiscounts
} from '../controllers/discountController.js';

const router = express.Router();

router.post('/', authMiddleware, createDiscount);
router.get('/active', getActiveDiscounts);
router.get('/user', authMiddleware, getUserDiscounts);
router.get('/:id', getDiscountById);
router.post('/validate', authMiddleware, validateDiscount);
router.put('/:id', authMiddleware, updateDiscount);
router.delete('/:id', authMiddleware, deleteDiscount);

export default router;