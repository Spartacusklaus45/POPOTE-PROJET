import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { createPayment } from '../services/paymentService';
import { sendNotification } from '../services/notificationService';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = new Order({
      ...req.body,
      user: req.user._id
    });

    const createdOrder = await order.save();

    // Initialize payment
    if (req.body.paymentMethod !== 'CASH') {
      await createPayment({
        order: createdOrder._id,
        user: req.user._id,
        amount: createdOrder.totalPrice,
        paymentMethod: req.body.paymentMethod
      });
    }

    // Send notification
    await sendNotification({
      userId: req.user._id,
      type: 'ORDER_CREATED',
      title: 'Commande créée',
      message: `Votre commande #${createdOrder._id} a été créée avec succès`
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.recipe');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check for authorization
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.recipe')
      .sort('-createdAt');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    const updatedOrder = await order.save();

    // Send notification
    await sendNotification({
      userId: order.user,
      type: 'ORDER_STATUS_UPDATED',
      title: 'Statut de commande mis à jour',
      message: `Votre commande #${order._id} est maintenant ${status}`
    });

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    order.status = 'CANCELLED';
    const updatedOrder = await order.save();

    // Send notification
    await sendNotification({
      userId: order.user,
      type: 'ORDER_CANCELLED',
      title: 'Commande annulée',
      message: `Votre commande #${order._id} a été annulée`
    });

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling order' });
  }
};