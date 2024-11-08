import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController';
import { protect, admin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createOrderSchema, updateOrderStatusSchema } from '../validations/orderValidation';

const router = Router();

router.post('/', protect, validate(createOrderSchema), createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, validate(updateOrderStatusSchema), updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

export default router;