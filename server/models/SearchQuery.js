import mongoose from 'mongoose';

const searchQuerySchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['PRODUCT', 'RECIPE', 'CATEGORY', 'GLOBAL'],
    default: 'GLOBAL'
  },
  filters: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  results: {
    total: Number,
    items: [{
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'type'
    }]
  },
  metadata: {
    device: String,
    platform: String,
    location: {
      city: String,
      country: String
    }
  },
  performance: {
    duration: Number,
    status: {
      type: String,
      enum: ['SUCCESS', 'NO_RESULTS', 'ERROR'],
      default: 'SUCCESS'
    }
  },
  clickedResults: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'type'
    },
    position: Number,
    timestamp: Date
  }]
}, {
  timestamps: true
});

// Index pour la recherche rapide
searchQuerySchema.index({ query: 1, type: 1 });
searchQuerySchema.index({ user: 1, createdAt: -1 });
searchQuerySchema.index({ 
  query: 'text',
  'metadata.location.city': 'text'
});

// Méthode pour ajouter un clic sur un résultat
searchQuerySchema.methods.addClick = async function(itemId, position) {
  this.clickedResults.push({
    item: itemId,
    position,
    timestamp: new Date()
  });
  return this.save();
};

// Méthode pour obtenir les requêtes populaires
searchQuerySchema.statics.getPopularQueries = async function(options = {}) {
  const {
    type = null,
    limit = 10,
    days = 7
  } = options;

  const match = {
    createdAt: {
      $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    }
  };

  if (type) match.type = type;

  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$query',
        count: { $sum: 1 },
        successRate: {
          $avg: {
            $cond: [
              { $eq: ['$performance.status', 'SUCCESS'] },
              1,
              0
            ]
          }
        },
        avgResults: { $avg: '$results.total' },
        lastSearched: { $max: '$createdAt' }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);
};

// Méthode pour obtenir les suggestions de recherche
searchQuerySchema.statics.getSuggestions = async function(query, type = null) {
  const match = {
    query: { $regex: `^${query}`, $options: 'i' },
    'performance.status': 'SUCCESS',
    'results.total': { $gt: 0 }
  };

  if (type) match.type = type;

  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$query',
        count: { $sum: 1 },
        avgResults: { $avg: '$results.total' }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
};

export const SearchQuery = mongoose.model('SearchQuery', searchQuerySchema);