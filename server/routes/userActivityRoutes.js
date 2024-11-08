import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  logActivity,
  getRecentActivities,
  getActivityStats,
  getSessionActivities,
  deleteActivities
} from '../controllers/userActivityController.js';

const router = express.Router();

router.post('/', authMiddleware, logActivity);
router.get('/recent', authMiddleware, getRecentActivities);
router.get('/stats', authMiddleware, getActivityStats);
router.get('/session/:sessionId', authMiddleware, getSessionActivities);
router.delete('/', authMiddleware, deleteActivities);

export default router;