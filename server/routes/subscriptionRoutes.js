import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createSubscription,
  getCurrentSubscription,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  updatePaymentMethod,
  getSubscriptionHistory
} from '../controllers/subscriptionController.js';

const router = express.Router();

router.post('/', authMiddleware, createSubscription);
router.get('/current', authMiddleware, getCurrentSubscription);
router.get('/history', authMiddleware, getSubscriptionHistory);
router.put('/:id/pause', authMiddleware, pauseSubscription);
router.put('/:id/resume', authMiddleware, resumeSubscription);
router.put('/:id/cancel', authMiddleware, cancelSubscription);
router.put('/:id/payment-method', authMiddleware, updatePaymentMethod);

export default router;