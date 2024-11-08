import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
  adjustQuantity,
  checkAvailability,
  reserveStock
} from '../controllers/inventoryController.js';

const router = express.Router();

router.post('/', authMiddleware, createInventory);
router.get('/:id', authMiddleware, getInventoryById);
router.put('/:id', authMiddleware, updateInventory);
router.delete('/:id', authMiddleware, deleteInventory);
router.put('/:id/quantity', authMiddleware, adjustQuantity);
router.get('/availability', checkAvailability);
router.post('/:id/reserve', authMiddleware, reserveStock);

export default router;