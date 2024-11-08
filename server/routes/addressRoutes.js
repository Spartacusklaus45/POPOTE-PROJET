import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  verifyAddress
} from '../controllers/addressController.js';

const router = express.Router();

router.post('/', authMiddleware, createAddress);
router.get('/', authMiddleware, getUserAddresses);
router.get('/:id', authMiddleware, getAddressById);
router.put('/:id', authMiddleware, updateAddress);
router.delete('/:id', authMiddleware, deleteAddress);
router.put('/:id/default', authMiddleware, setDefaultAddress);
router.put('/:id/verify', authMiddleware, verifyAddress);

export default router;