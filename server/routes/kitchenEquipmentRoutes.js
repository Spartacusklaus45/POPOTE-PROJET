import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getCompatibleRecipes,
  getEquipmentByCategory,
  searchEquipment
} from '../controllers/kitchenEquipmentController.js';

const router = express.Router();

router.get('/', getAllEquipment);
router.get('/search', searchEquipment);
router.get('/category/:category', getEquipmentByCategory);
router.get('/:id', getEquipmentById);
router.get('/:id/recipes', getCompatibleRecipes);
router.post('/', authMiddleware, createEquipment);
router.put('/:id', authMiddleware, updateEquipment);
router.delete('/:id', authMiddleware, deleteEquipment);

export default router;