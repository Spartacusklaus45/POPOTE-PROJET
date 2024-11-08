import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createTicket,
  getTicketById,
  getUserTickets,
  addMessage,
  updateTicketStatus,
  assignTicket,
  resolveTicket,
  submitSatisfaction
} from '../controllers/supportTicketController.js';

const router = express.Router();

router.post('/', authMiddleware, createTicket);
router.get('/user', authMiddleware, getUserTickets);
router.get('/:id', authMiddleware, getTicketById);
router.post('/:id/messages', authMiddleware, addMessage);
router.put('/:id/status', authMiddleware, updateTicketStatus);
router.put('/:id/assign', authMiddleware, assignTicket);
router.put('/:id/resolve', authMiddleware, resolveTicket);
router.post('/:id/satisfaction', authMiddleware, submitSatisfaction);

export default router;