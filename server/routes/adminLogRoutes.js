import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import {
  getAllLogs,
  getLogById,
  getResourceLogs,
  getAdminLogs,
  exportLogs
} from '../controllers/adminLogController.js';

const router = express.Router();

// Toutes les routes nécessitent les droits d'administrateur
router.use(authMiddleware, adminMiddleware);

router.get('/', getAllLogs);
router.get('/export', exportLogs);
router.get('/:id', getLogById);
router.get('/resource/:resourceType/:resourceId', getResourceLogs);
router.get('/admin/:adminId', getAdminLogs);

export default router;