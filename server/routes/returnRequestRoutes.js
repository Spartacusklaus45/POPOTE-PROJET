import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createReturnRequest,
  getReturnRequestById,
  getUserReturnRequests,
  approveReturnRequest,
  rejectReturnRequest,
  processReturnRefund
} from '../controllers/returnRequestController.js';

const router = express.Router();

router.post('/', authMiddleware, createReturnRequest);
router.get('/user', authMiddleware, getUserReturnRequests);
router.get('/:id', authMiddleware, getReturnRequestById);
router.put('/:id/approve', authMiddleware, approveReturnRequest);
router.put('/:id/reject', authMiddleware, rejectReturnRequest);
router.post('/:id/refund', authMiddleware, processReturnRefund);

export default router;