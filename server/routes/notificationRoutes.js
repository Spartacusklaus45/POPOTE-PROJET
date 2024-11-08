import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  archiveNotification,
  deleteNotification,
  updateNotificationPreferences
} from '../controllers/notificationController.js';

const router = express.Router();

router.post('/', authMiddleware, createNotification);
router.get('/', authMiddleware, getUserNotifications);
router.get('/unread-count', authMiddleware, getUnreadCount);
router.put('/:id/read', authMiddleware, markAsRead);
router.put('/mark-all-read', authMiddleware, markAllAsRead);
router.put('/:id/archive', authMiddleware, archiveNotification);
router.delete('/:id', authMiddleware, deleteNotification);
router.put('/preferences', authMiddleware, updateNotificationPreferences);

export default router;