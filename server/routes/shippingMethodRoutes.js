import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getAllShippingMethods,
  getShippingMethodById,
  createShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
  calculateShippingCost,
  getAvailableMethodsByZone
} from '../controllers/shippingMethodController.js';

const router = express.Router();

router.get('/', getAllShippingMethods);
router.get('/available', getAvailableMethodsByZone);
router.get('/:id', getShippingMethodById);
router.post('/', authMiddleware, createShippingMethod);
router.put('/:id', authMiddleware, updateShippingMethod);
router.delete('/:id', authMiddleware, deleteShippingMethod);
router.post('/:id/calculate', calculateShippingCost);

export default router;