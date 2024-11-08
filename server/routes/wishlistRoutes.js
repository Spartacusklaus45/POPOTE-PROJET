import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createWishlist,
  getUserWishlists,
  getWishlistById,
  addToWishlist,
  removeFromWishlist,
  updateWishlist,
  deleteWishlist,
  shareWishlist,
  getWishlistByShareableLink
} from '../controllers/wishlistController.js';

const router = express.Router();

router.post('/', authMiddleware, createWishlist);
router.get('/', authMiddleware, getUserWishlists);
router.get('/:id', authMiddleware, getWishlistById);
router.post('/:id/products', authMiddleware, addToWishlist);
router.delete('/:id/products/:productId', authMiddleware, removeFromWishlist);
router.put('/:id', authMiddleware, updateWishlist);
router.delete('/:id', authMiddleware, deleteWishlist);
router.post('/:id/share', authMiddleware, shareWishlist);
router.get('/shared/:shareableLink', getWishlistByShareableLink);

export default router;