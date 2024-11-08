import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createCoupon,
  getCouponById,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
  getActiveCoupons,
  getUserCoupons
} from '../controllers/couponController.js';

const router = express.Router();

router.post('/', authMiddleware, createCoupon);
router.get('/active', getActiveCoupons);
router.get('/user', authMiddleware, getUserCoupons);
router.get('/:id', getCouponById);
router.post('/validate', authMiddleware, validateCoupon);
router.put('/:id', authMiddleware, updateCoupon);
router.delete('/:id', authMiddleware, deleteCoupon);

export default router;