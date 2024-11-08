import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostBySlug,
  updateBlogPost,
  deleteBlogPost,
  likeBlogPost,
  unlikeBlogPost,
  addComment,
  searchBlogPosts
} from '../controllers/blogPostController.js';

const router = express.Router();

router.post('/', authMiddleware, createBlogPost);
router.get('/', getAllBlogPosts);
router.get('/search', searchBlogPosts);
router.get('/:slug', getBlogPostBySlug);
router.put('/:id', authMiddleware, updateBlogPost);
router.delete('/:id', authMiddleware, deleteBlogPost);
router.post('/:id/like', authMiddleware, likeBlogPost);
router.delete('/:id/like', authMiddleware, unlikeBlogPost);
router.post('/:id/comments', authMiddleware, addComment);

export default router;