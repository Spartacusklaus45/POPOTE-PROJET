import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import recipeRoutes from './recipeRoutes';
import orderRoutes from './orderRoutes';
import paymentRoutes from './paymentRoutes';
import deliveryRoutes from './deliveryRoutes';
import subscriptionRoutes from './subscriptionRoutes';
import notificationRoutes from './notificationRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/recipes', recipeRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/delivery', deliveryRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

export default router;