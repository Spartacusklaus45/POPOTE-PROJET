import { UserActivity } from '../models/UserActivity.js';

export const logActivity = async (req, res) => {
  try {
    const activity = new UserActivity({
      user: req.user.id,
      type: req.body.type,
      data: req.body.data,
      metadata: {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        platform: req.body.platform,
        device: req.body.device
      },
      sessionId: req.body.sessionId
    });

    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'activité' });
  }
};

export const getRecentActivities = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const activities = await UserActivity.getRecentActivities(
      req.user.id,
      parseInt(limit)
    );
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des activités' });
  }
};

export const getActivityStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await UserActivity.getActivityStats(
      req.user.id,
      new Date(startDate),
      new Date(endDate)
    );
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
};

export const getSessionActivities = async (req, res) => {
  try {
    const activities = await UserActivity.find({
      user: req.user.id,
      sessionId: req.params.sessionId
    }).sort('createdAt');
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des activités de session' });
  }
};

export const deleteActivities = async (req, res) => {
  try {
    const { before } = req.query;
    if (!before) {
      return res.status(400).json({ message: 'Date requise' });
    }

    await UserActivity.deleteMany({
      user: req.user.id,
      createdAt: { $lt: new Date(before) }
    });

    res.json({ message: 'Activités supprimées avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression des activités' });
  }
};