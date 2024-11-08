import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createTag,
  getAllTags,
  getTagById,
  getTagBySlug,
  updateTag,
  deleteTag,
  getTagHierarchy
} from '../controllers/tagController.js';

const router = express.Router();

router.post('/', authMiddleware, createTag);
router.get('/', getAllTags);
router.get('/hierarchy', getTagHierarchy);
router.get('/:id', getTagById);
router.get('/slug/:slug', getTagBySlug);
router.put('/:id', authMiddleware, updateTag);
router.delete('/:id', authMiddleware, deleteTag);

export default router;