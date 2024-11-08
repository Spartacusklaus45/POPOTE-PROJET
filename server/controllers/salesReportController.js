import { SalesReport } from '../models/SalesReport.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';

export const generateReport = async (req, res) => {
  try {
    const { period, startDate, endDate } = req.body;

    // Vérifier si un rapport existe déjà pour cette période
    const existingReport = await SalesReport.findOne({
      period,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    });

    if (existingReport) {
      return res.status(400).json({ message: 'Un rapport existe déjà pour cette période' });
    }

    // Récupérer les données nécessaires
    const orders = await Order.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).populate('user');

    // Calculer les métriques
    const metrics = calculateMetrics(orders);

    // Créer le rapport
    const report = new SalesReport({
      period,
      startDate,
      endDate,
      ...metrics
    });

    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la génération du rapport' });
  }
};

export const getReport = async (req, res) => {
  try {
    const report = await SalesReport.findById(req.params.id)
      .populate('products.sold.product')
      .populate('products.topSellers.product')
      .populate('products.lowStock.product')
      .populate('customers.topSpenders.user', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Rapport non trouvé' });
    }

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du rapport' });
  }
};

export const getReportsByPeriod = async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;
    const query = { period };

    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }

    const reports = await SalesReport.find(query)
      .sort('-startDate');

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des rapports' });
  }
};

export const getTrends = async (req, res) => {
  try {
    const { period, count } = req.query;
    const trends = await SalesReport.getTrends(period, parseInt(count));
    res.json(trends);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des tendances' });
  }
};

export const exportReport = async (req, res) => {
  try {
    const report = await SalesReport.findById(req.params.id)
      .populate('products.sold.product')
      .populate('customers.topSpenders.user', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Rapport non trouvé' });
    }

    // Générer le PDF ou CSV selon le format demandé
    const format = req.query.format || 'pdf';
    const exportData = await generateExportData(report, format);

    res.set('Content-Type', format === 'pdf' ? 'application/pdf' : 'text/csv');
    res.set('Content-Disposition', `attachment; filename=report-${report._id}.${format}`);
    res.send(exportData);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'export du rapport' });
  }
};

// Fonctions utilitaires

function calculateMetrics(orders) {
  const metrics = {
    revenue: {
      total: 0,
      byPaymentMethod: {},
      byCategory: {}
    },
    orders: {
      total: orders.length,
      completed: 0,
      cancelled: 0,
      returned: 0,
      averageValue: 0
    },
    products: {
      sold: {},
      topSellers: [],
      lowStock: []
    },
    customers: {
      total: new Set(orders.map(o => o.user._id.toString())).size,
      new: 0,
      returning: 0,
      topSpenders: []
    }
  };

  // Calculer les métriques
  orders.forEach(order => {
    // Revenus
    metrics.revenue.total += order.totalPrice;

    // Méthodes de paiement
    const method = order.paymentMethod;
    metrics.revenue.byPaymentMethod[method] = (metrics.revenue.byPaymentMethod[method] || 0) + order.totalPrice;

    // Statuts des commandes
    switch (order.status) {
      case 'COMPLETED':
        metrics.orders.completed++;
        break;
      case 'CANCELLED':
        metrics.orders.cancelled++;
        break;
      case 'RETURNED':
        metrics.orders.returned++;
        break;
    }

    // Produits vendus
    order.items.forEach(item => {
      if (!metrics.products.sold[item.product]) {
        metrics.products.sold[item.product] = {
          quantity: 0,
          revenue: 0
        };
      }
      metrics.products.sold[item.product].quantity += item.quantity;
      metrics.products.sold[item.product].revenue += item.price * item.quantity;
    });
  });

  // Calculer les moyennes
  metrics.orders.averageValue = metrics.revenue.total / metrics.orders.total;

  // Transformer les objets en tableaux pour le stockage
  metrics.products.sold = Object.entries(metrics.products.sold).map(([product, data]) => ({
    product,
    ...data
  }));

  // Trier les produits les plus vendus
  metrics.products.topSellers = [...metrics.products.sold]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return metrics;
}

async function generateExportData(report, format) {
  if (format === 'pdf') {
    // Logique de génération de PDF
    return Buffer.from('PDF data');
  } else {
    // Générer CSV
    const headers = [
      'Période',
      'Revenus totaux',
      'Nombre de commandes',
      'Panier moyen',
      'Nouveaux clients',
      'Taux de conversion'
    ];

    const data = [
      report.period,
      report.revenue.total,
      report.orders.total,
      report.metrics.averageOrderValue,
      report.customers.new,
      report.metrics.conversionRate
    ];

    return [headers.join(','), data.join(',')].join('\n');
  }
}