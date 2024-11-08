import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  generateReport,
  getReport,
  getReportsByPeriod,
  getTrends,
  exportReport
} from '../controllers/salesReportController.js';

const router = express.Router();

router.post('/', authMiddleware, generateReport);
router.get('/:id', authMiddleware, getReport);
router.get('/', authMiddleware, getReportsByPeriod);
router.get('/trends', authMiddleware, getTrends);
router.get('/:id/export', authMiddleware, exportReport);

export default router;