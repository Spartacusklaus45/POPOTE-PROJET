import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getAllAPIs,
  getAPIById,
  createAPI,
  updateAPI,
  deleteAPI,
  getAPIMetrics,
  getAPILogs,
  testAPIConnection,
  getAPIStatus,
  resetAPIKey
} from '../controllers/externalAPIController.js';

const router = express.Router();

router.get('/', authMiddleware, getAllAPIs);
router.get('/:id', authMiddleware, getAPIById);
router.get('/:id/metrics', authMiddleware, getAPIMetrics);
router.get('/:id/logs', authMiddleware, getAPILogs);
router.get('/:id/status', authMiddleware, getAPIStatus);
router.post('/', authMiddleware, createAPI);
router.post('/:id/test', authMiddleware, testAPIConnection);
router.put('/:id', authMiddleware, updateAPI);
router.put('/:id/reset-key', authMiddleware, resetAPIKey);
router.delete('/:id', authMiddleware, deleteAPI);

export default router;