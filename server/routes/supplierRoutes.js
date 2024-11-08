import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createSupplier,
  getSupplierById,
  getAllSuppliers,
  updateSupplier,
  deleteSupplier,
  addProduct,
  updatePerformance,
  uploadDocument,
  getExpiredDocuments,
  getLowStockProducts
} from '../controllers/supplierController.js';

const router = express.Router();

router.post('/', authMiddleware, createSupplier);
router.get('/', authMiddleware, getAllSuppliers);
router.get('/:id', authMiddleware, getSupplierById);
router.put('/:id', authMiddleware, updateSupplier);
router.delete('/:id', authMiddleware, deleteSupplier);
router.post('/:id/products', authMiddleware, addProduct);
router.put('/:id/performance', authMiddleware, updatePerformance);
router.post('/:id/documents', authMiddleware, uploadDocument);
router.get('/:id/documents/expired', authMiddleware, getExpiredDocuments);
router.get('/:id/products/low-stock', authMiddleware, getLowStockProducts);

export default router;