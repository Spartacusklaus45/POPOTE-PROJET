import { Delivery } from '../models/Delivery.js';
import { Order } from '../models/Order.js';
import { ShippingMethod } from '../models/ShippingMethod.js';
import { createNotification } from '../services/notificationService.js';

export const createDelivery = async (req, res) => {
  try {
    const { orderId, shippingMethodId, scheduledDate, deliveryAddress } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    const shippingMethod = await ShippingMethod.findById(shippingMethodId);
    if (!shippingMethod) {
      return res.status(404).json({ message: 'Méthode de livraison non trouvée' });
    }

    // Calculer les frais de livraison
    const deliveryCost = shippingMethod.calculateShippingCost(
      req.body.distance,
      deliveryAddress
    );

    const delivery = new Delivery({
      order: orderId,
      shippingMethod: shippingMethodId,
      scheduledDate,
      deliveryAddress,
      deliveryCost,
      distance: req.body.distance,
      estimatedDeliveryTime: {
        min: shippingMethod.minDeliveryTime,<boltArtifact id="shipping-methods-setup" title="Configuration des méthodes de livraison (continued)">
<boltAction type="file" filePath="server/controllers/deliveryController.js">        max: shippingMethod.maxDeliveryTime,
        unit: shippingMethod.timeUnit
      }
    });

    await delivery.save();

    // Mettre à jour le statut de la commande
    order.deliveryStatus = 'PENDING';
    order.delivery = delivery._id;
    await order.save();

    // Notification à l'utilisateur
    await createNotification({
      user: order.user,
      type: 'DELIVERY_CREATED',
      title: 'Livraison programmée',
      message: `Votre livraison est programmée pour le ${new Date(scheduledDate).toLocaleDateString()}`,
      data: { deliveryId: delivery._id }
    });

    res.status(201).json(delivery);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de la livraison' });
  }
};

export const getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('order')
      .populate('shippingMethod');

    if (!delivery) {
      return res.status(404).json({ message: 'Livraison non trouvée' });
    }

    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la livraison' });
  }
};

export const updateDeliveryStatus = async (req, res) => {
  try {
    const { status, location, description } = req.body;
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: 'Livraison non trouvée' });
    }

    await delivery.updateStatus(status, { location, description });

    // Mettre à jour le statut de la commande
    if (status === 'DELIVERED') {
      await Order.findByIdAndUpdate(delivery.order, {
        deliveryStatus: 'DELIVERED',
        status: 'COMPLETED'
      });

      // Notification à l'utilisateur
      await createNotification({
        user: delivery.order.user,
        type: 'DELIVERY_COMPLETED',
        title: 'Livraison effectuée',
        message: 'Votre commande a été livrée avec succès',
        data: { deliveryId: delivery._id }
      });
    }

    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut de livraison' });
  }
};

export const assignDriver = async (req, res) => {
  try {
    const { driverInfo } = req.body;
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: 'Livraison non trouvée' });
    }

    delivery.driver = driverInfo;
    delivery.status = 'ASSIGNED';
    await delivery.save();

    // Notification à l'utilisateur
    await createNotification({
      user: delivery.order.user,
      type: 'DRIVER_ASSIGNED',
      title: 'Livreur assigné',
      message: `Votre livreur ${driverInfo.name} a été assigné à votre commande`,
      data: { deliveryId: delivery._id }
    });

    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'assignation du livreur' });
  }
};

export const reportDeliveryIssue = async (req, res) => {
  try {
    const { type, description } = req.body;
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: 'Livraison non trouvée' });
    }

    delivery.issues.push({
      type,
      description,
      reportedAt: new Date()
    });

    await delivery.save();

    // Notification à l'administrateur
    await createNotification({
      type: 'DELIVERY_ISSUE',
      title: 'Problème de livraison signalé',
      message: `Un problème a été signalé pour la livraison #${delivery._id}`,
      data: { deliveryId: delivery._id }
    });

    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du signalement du problème' });
  }
};

export const getDeliveryTracking = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .select('tracking status estimatedDeliveryTime actualDeliveryTime');

    if (!delivery) {
      return res.status(404).json({ message: 'Livraison non trouvée' });
    }

    res.json({
      tracking: delivery.tracking,
      status: delivery.status,
      estimatedDeliveryTime: delivery.estimatedDeliveryTime,
      actualDeliveryTime: delivery.actualDeliveryTime,
      delay: delivery.calculateDelay()
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du suivi' });
  }
};