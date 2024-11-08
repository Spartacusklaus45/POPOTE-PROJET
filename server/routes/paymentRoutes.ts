import { Router } from 'express';
import {
  processPaymentController,
  getPaymentById,
  getMyPayments,
  refundPaymentController
} from '../controllers/paymentController';
import { protect, admin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { processPaymentSchema } from '../validations/paymentValidation';

const router = Router();

router.post('/process', protect, validate(processPaymentSchema), processPaymentController);
router.get('/mypayments', protect, getMyPayments);
router.get('/:id', protect, getPaymentById);
router.post('/:id/refund', protect, admin, refundPaymentController);

export default router;