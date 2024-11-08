import mongoose from 'mongoose';

const salesReportSchema = new mongoose.Schema({
  period: {
    type: String,
    enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  revenue: {
    total: {
      type: Number,
      required: true
    },
    byPaymentMethod: [{
      method: String,
      amount: Number
    }],
    byCategory: [{
      category: String,
      amount: Number
    }]
  },
  orders: {
    total: {
      type: Number,
      required: true
    },
    completed: Number,
    cancelled: Number,
    returned: Number,
    averageValue: Number
  },
  products: {
    sold: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: Number,
      revenue: Number
    }],
    topSellers: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: Number,
      revenue: Number
    }],
    lowStock: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: Number,
      threshold: Number
    }]
  },
  customers: {
    total: Number,
    new: Number,
    returning: Number,
    topSpenders: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      orders: Number,
      spent: Number
    }]
  },
  metrics: {
    conversionRate: Number,
    averageOrderValue: Number,
    customerRetentionRate: Number,
    cartAbandonmentRate: Number
  },
  comparisons: {
    previousPeriod: {
      revenue: {
        amount: Number,
        percentage: Number
      },
      orders: {
        count: Number,
        percentage: Number
      }
    },
    samePeroidLastYear: {
      revenue: {
        amount: Number,
        percentage: Number
      },
      orders: {
        count: Number,
        percentage: Number
      }
    }
  }
}, {
  timestamps: true
});

// Index pour la recherche rapide
salesReportSchema.index({ period: 1, startDate: 1, endDate: 1 });

// Méthode pour générer un rapport
salesReportSchema.statics.generateReport = async function(period, startDate, endDate) {
  // Logique de génération de rapport à implémenter
  const report = new this({
    period,
    startDate,
    endDate,
    // ... autres calculs
  });
  return report.save();
};

// Méthode pour obtenir les tendances
salesReportSchema.statics.getTrends = async function(period, count = 6) {
  return this.find({ period })
    .sort('-endDate')
    .limit(count);
};

export const SalesReport = mongoose.model('SalesReport', salesReportSchema);