import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
  deleteUser,
  updateUserPreferences
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getCurrentUser);
router.put('/profile', authMiddleware, updateUserProfile);
router.delete('/:id', authMiddleware, deleteUser);
router.put('/preferences', authMiddleware, updateUserPreferences);

export default router;