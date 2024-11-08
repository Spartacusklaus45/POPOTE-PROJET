import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import {
  createSetting,
  getAllSettings,
  getPublicSettings,
  getSettingByKey,
  updateSetting,
  deleteSetting,
  getSettingHistory,
  bulkUpdateSettings
} from '../controllers/websiteSettingController.js';

const router = express.Router();

// Routes publiques
router.get('/public', getPublicSettings);

// Routes protégées (admin uniquement)
router.use(authMiddleware, adminMiddleware);

router.post('/', createSetting);
router.get('/', getAllSettings);
router.get('/:key', getSettingByKey);
router.put('/:key', updateSetting);
router.delete('/:key', deleteSetting);
router.get('/:key/history', getSettingHistory);
router.post('/bulk-update', bulkUpdateSettings);

export default router;