import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  logSearch,
  getPopularSearches,
  getSuggestions,
  getUserSearchHistory,
  clearSearchHistory,
  logSearchClick,
  getSearchAnalytics
} from '../controllers/searchQueryController.js';

const router = express.Router();

router.post('/', logSearch);
router.get('/popular', getPopularSearches);
router.get('/suggestions', getSuggestions);
router.get('/history', authMiddleware, getUserSearchHistory);
router.delete('/history', authMiddleware, clearSearchHistory);
router.post('/:searchId/click', logSearchClick);
router.get('/analytics', authMiddleware, getSearchAnalytics);

export default router;