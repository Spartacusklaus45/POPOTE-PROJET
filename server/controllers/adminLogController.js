import { AdminLog } from '../models/AdminLog.js';

export const getAllLogs = async (req, res) => {
  try {
    const { 
      action, 
      resourceType, 
      startDate, 
      endDate,
      page = 1,
      limit = 50
    } = req.query;

    const query = {};
    if (action) query.action = action;
    if (resourceType) query.resourceType = resourceType;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const total = await AdminLog.countDocuments(query);
    const logs = await AdminLog.find(query)
      .populate('admin', 'name email')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      logs,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des logs' });
  }
};

export const getLogById = async (req, res) => {
  try {
    const log = await AdminLog.findById(req.params.id)
      .populate('admin', 'name email');

    if (!log) {
      return res.status(404).json({ message: 'Log non trouvé' });
    }

    res.json(log);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du log' });
  }
};

export const getResourceLogs = async (req, res) => {
  try {
    const { resourceType, resourceId } = req.params;
    const logs = await AdminLog.getResourceLogs(resourceType, resourceId);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des logs de la ressource' });
  }
};

export const getAdminLogs = async (req, res) => {
  try {
    const logs = await AdminLog.getAdminLogs(req.params.adminId);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des logs de l\'administrateur' });
  }
};

export const exportLogs = async (req, res) => {
  try {
    const { startDate, endDate, format = 'csv' } = req.query;
    const query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await AdminLog.find(query)
      .populate('admin', 'name email')
      .sort('-createdAt');

    if (format === 'csv') {
      // Générer le CSV
      const csv = generateCSV(logs);
      res.header('Content-Type', 'text/csv');
      res.attachment('admin_logs.csv');
      return res.send(csv);
    }

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'export des logs' });
  }
};

// Fonction utilitaire pour générer le CSV
function generateCSV(logs) {
  const headers = [
    'Date',
    'Admin',
    'Action',
    'Resource Type',
    'Resource ID',
    'Status',
    'IP Address',
    'Details'
  ];

  const rows = logs.map(log => [
    log.createdAt.toISOString(),
    log.admin.name,
    log.action,
    log.resourceType,
    log.resourceId,
    log.status,
    log.ipAddress,
    JSON.stringify(log.details)
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}