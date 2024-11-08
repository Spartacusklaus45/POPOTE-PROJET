import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createGiftCard,
  getGiftCardByCode,
  getUserGiftCards,
  useGiftCard,
  refundGiftCard,
  cancelGiftCard
} from '../controllers/giftCardController.js';

const router = express.Router();

router.post('/', authMiddleware, createGiftCard);
router.get('/user', authMiddleware, getUserGiftCards);
router.get('/code/:code', getGiftCardByCode);
router.post('/use', authMiddleware, useGiftCard);
router.post('/:id/refund', authMiddleware, refundGiftCard);
router.put('/:id/cancel', authMiddleware, cancelGiftCard);

export default router;