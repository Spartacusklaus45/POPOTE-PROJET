import { WebsiteSetting } from '../models/WebsiteSetting.js';
import { createNotification } from '../services/notificationService.js';
import { AdminLog } from '../models/AdminLog.js';

export const createSetting = async (req, res) => {
  try {
    const setting = new WebsiteSetting({
      ...req.body,
      lastModifiedBy: req.user.id
    });

    await setting.save();

    // Log administrateur
    await AdminLog.logAction(req.user.id, 'CREATE', 'SETTINGS', {
      details: {
        key: setting.key,
        category: setting.category
      }
    });

    res.status(201).json(setting);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du paramètre' });
  }
};

export const getAllSettings = async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    const settings = await WebsiteSetting.find(query)
      .populate('lastModifiedBy', 'name')
      .sort('category key');

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des paramètres' });
  }
};

export const getPublicSettings = async (req, res) => {
  try {
    const settings = await WebsiteSetting.getPublicSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des paramètres publics' });
  }
};

export const getSettingByKey = async (req, res) => {
  try {
    const setting = await WebsiteSetting.findOne({ key: req.params.key })
      .populate('lastModifiedBy', 'name')
      .populate('history.modifiedBy', 'name');

    if (!setting) {
      return res.status(404).json({ message: 'Paramètre non trouvé' });
    }

    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du paramètre' });
  }
};

export const updateSetting = async (req, res) => {
  try {
    const setting = await WebsiteSetting.findOne({ key: req.params.key });
    
    if (!setting) {
      return res.status(404).json({ message: 'Paramètre non trouvé' });
    }

    await setting.updateValue(req.body.value, req.user.id, req.body.reason);

    // Log administrateur
    await AdminLog.logAction(req.user.id, 'UPDATE', 'SETTINGS', {
      details: {
        key: setting.key,
        oldValue: setting.history[setting.history.length - 1].value,
        newValue: req.body.value,
        reason: req.body.reason
      }
    });

    // Notification aux administrateurs
    await createNotification({
      type: 'SETTING_UPDATED',
      title: 'Paramètre modifié',
      message: `Le paramètre ${setting.key} a été mis à jour`,
      data: { settingKey: setting.key }
    });

    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du paramètre' });
  }
};

export const deleteSetting = async (req, res) => {
  try {
    const setting = await WebsiteSetting.findOne({ key: req.params.key });
    
    if (!setting) {
      return res.status(404).json({ message: 'Paramètre non trouvé' });
    }

    await setting.remove();

    // Log administrateur
    await AdminLog.logAction(req.user.id, 'DELETE', 'SETTINGS', {
      details: {
        key: setting.key,
        category: setting.category
      }
    });

    res.json({ message: 'Paramètre supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression du paramètre' });
  }
};

export const getSettingHistory = async (req, res) => {
  try {
    const setting = await WebsiteSetting.findOne({ key: req.params.key })
      .populate('history.modifiedBy', 'name');

    if (!setting) {
      return res.status(404).json({ message: 'Paramètre non trouvé' });
    }

    const history = setting.getHistory();
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique' });
  }
};

export const bulkUpdateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    const updates = [];

    for (const { key, value, reason } of settings) {
      const setting = await WebsiteSetting.findOne({ key });
      if (setting) {
        await setting.updateValue(value, req.user.id, reason);
        updates.push(setting);
      }
    }

    // Log administrateur
    await AdminLog.logAction(req.user.id, 'UPDATE', 'SETTINGS', {
      details: {
        keys: settings.map(s => s.key),
        reason: 'Mise à jour en masse'
      }
    });

    res.json(updates);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour des paramètres' });
  }
};