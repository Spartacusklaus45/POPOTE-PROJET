import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createDelivery,
  getDeliveryById,
  updateDeliveryStatus,
  assignDriver,
  reportDeliveryIssue,
  getDeliveryTracking
} from '../controllers/deliveryController.js';

const router = express.Router();

router.post('/', authMiddleware, createDelivery);
router.get('/:id', authMiddleware, getDeliveryById);
router.put('/:id/status', authMiddleware, updateDeliveryStatus);
router.put('/:id/driver', authMiddleware, assignDriver);
router.post('/:id/issues', authMiddleware, reportDeliveryIssue);
router.get('/:id/tracking', getDeliveryTracking);

export default router;