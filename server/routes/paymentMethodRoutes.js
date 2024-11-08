import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getAllPaymentMethods,
  getPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  validatePaymentMethod
} from '../controllers/paymentMethodController.js';

const router = express.Router();

router.get('/', getAllPaymentMethods);
router.get('/:id', getPaymentMethodById);
router.post('/', authMiddleware, createPaymentMethod);
router.put('/:id', authMiddleware, updatePaymentMethod);
router.delete('/:id', authMiddleware, deletePaymentMethod);
router.post('/:id/validate', validatePaymentMethod);

export default router;