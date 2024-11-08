import { SearchQuery } from '../models/SearchQuery.js';

export const logSearch = async (req, res) => {
  try {
    const searchQuery = new SearchQuery({
      ...req.body,
      user: req.user?.id,
      metadata: {
        ...req.body.metadata,
        device: req.headers['user-agent']
      }
    });

    await searchQuery.save();
    res.status(201).json(searchQuery);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement de la recherche' });
  }
};

export const getPopularSearches = async (req, res) => {
  try {
    const { type, limit, days } = req.query;
    const popularQueries = await SearchQuery.getPopularQueries({
      type,
      limit: parseInt(limit),
      days: parseInt(days)
    });
    res.json(popularQueries);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des recherches populaires' });
  }
};

export const getSuggestions = async (req, res) => {
  try {
    const { q, type } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Paramètre de recherche requis' });
    }

    const suggestions = await SearchQuery.getSuggestions(q, type);
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des suggestions' });
  }
};

export const getUserSearchHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const query = { user: req.user.id };

    const total = await SearchQuery.countDocuments(query);
    const searches = await SearchQuery.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      searches,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique' });
  }
};

export const clearSearchHistory = async (req, res) => {
  try {
    await SearchQuery.deleteMany({ user: req.user.id });
    res.json({ message: 'Historique de recherche effacé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'historique' });
  }
};

export const logSearchClick = async (req, res) => {
  try {
    const { searchId } = req.params;
    const { itemId, position } = req.body;

    const searchQuery = await SearchQuery.findById(searchId);
    if (!searchQuery) {
      return res.status(404).json({ message: 'Recherche non trouvée' });
    }

    await searchQuery.addClick(itemId, position);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement du clic' });
  }
};

export const getSearchAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    const match = {};

    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    if (type) match.type = type;

    const analytics = await SearchQuery.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          totalSearches: { $sum: 1 },
          successfulSearches: {
            $sum: {
              $cond: [
                { $eq: ['$performance.status', 'SUCCESS'] },
                1,
                0
              ]
            }
          },
          avgResults: { $avg: '$results.total' },
          avgDuration: { $avg: '$performance.duration' },
          noResultsCount: {
            $sum: {
              $cond: [
                { $eq: ['$performance.status', 'NO_RESULTS'] },
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(analytics);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des analyses' });
  }
};