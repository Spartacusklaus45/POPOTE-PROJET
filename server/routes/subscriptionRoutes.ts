import { Router } from 'express';
import {
  createSubscription,
  getCurrentSubscription,
  cancelSubscription,
  pauseSubscription,
  resumeSubscription
} from '../controllers/subscriptionController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createSubscriptionSchema } from '../validations/subscriptionValidation';

const router = Router();

router.post('/', protect, validate(createSubscriptionSchema), createSubscription);
router.get('/current', protect, getCurrentSubscription);
router.put('/cancel', protect, cancelSubscription);
router.put('/pause', protect, pauseSubscription);
router.put('/resume', protect, resumeSubscription);

export default router;