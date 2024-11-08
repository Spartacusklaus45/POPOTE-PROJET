import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createTransaction,
  getTransactionById,
  getUserTransactions,
  updateTransactionStatus,
  refundTransaction
} from '../controllers/paymentTransactionController.js';

const router = express.Router();

router.post('/', authMiddleware, createTransaction);
router.get('/user', authMiddleware, getUserTransactions);
router.get('/:id', authMiddleware, getTransactionById);
router.put('/:id/status', authMiddleware, updateTransactionStatus);
router.post('/:id/refund', authMiddleware, refundTransaction);

export default router;