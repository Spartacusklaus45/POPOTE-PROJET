import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getAllPreferences,
  getPreferenceById,
  createPreference,
  updatePreference,
  deletePreference,
  getSubstitutes,
  getCompatibleRecipes,
  getPreferencesByType
} from '../controllers/dietaryPreferenceController.js';

const router = express.Router();

router.get('/', getAllPreferences);
router.get('/type/:type', getPreferencesByType);
router.get('/:id', getPreferenceById);
router.get('/:id/substitutes', getSubstitutes);
router.get('/:id/recipes', getCompatibleRecipes);
router.post('/', authMiddleware, createPreference);
router.put('/:id', authMiddleware, updatePreference);
router.delete('/:id', authMiddleware, deletePreference);

export default router;