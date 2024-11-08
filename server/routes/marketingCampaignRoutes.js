import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createCampaign,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  startCampaign,
  pauseCampaign,
  getCampaignMetrics,
  trackCampaignEvent
} from '../controllers/marketingCampaignController.js';

const router = express.Router();

router.post('/', authMiddleware, createCampaign);
router.get('/:id', authMiddleware, getCampaignById);
router.put('/:id', authMiddleware, updateCampaign);
router.delete('/:id', authMiddleware, deleteCampaign);
router.post('/:id/start', authMiddleware, startCampaign);
router.post('/:id/pause', authMiddleware, pauseCampaign);
router.get('/:id/metrics', authMiddleware, getCampaignMetrics);
router.post('/track', trackCampaignEvent);

export default router;