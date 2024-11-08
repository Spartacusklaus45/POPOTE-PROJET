import mongoose from 'mongoose';

const marketingCampaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP'],
    required: true
  },
  status: {
    type: String,
    enum: ['DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'],
    default: 'DRAFT'
  },
  audience: {
    type: {
      type: String,
      enum: ['ALL', 'SEGMENT', 'CUSTOM'],
      required: true
    },
    segment: {
      type: String,
      enum: ['NEW_USERS', 'INACTIVE_USERS', 'PREMIUM_USERS', 'REGULAR_CUSTOMERS']
    },
    filters: {
      location: [String],
      ageRange: {
        min: Number,
        max: Number
      },
      lastOrderDate: Date,
      orderCount: Number,
      totalSpent: Number,
      interests: [String]
    },
    excludedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  content: {
    subject: String,
    title: String,
    body: String,
    imageUrl: String,
    callToAction: {
      text: String,
      url: String
    },
    template: String,
    variables: {
      type: Map,
      of: String
    }
  },
  schedule: {
    startDate: Date,
    endDate: Date,
    frequency: {
      type: String,
      enum: ['ONE_TIME', 'DAILY', 'WEEKLY', 'MONTHLY']
    },
    timeSlots: [{
      day: String,
      time: String
    }],
    timezone: String
  },
  metrics: {
    targetAudience: Number,
    sent: Number,
    delivered: Number,
    opened: Number,
    clicked: Number,
    converted: Number,
    bounced: Number,
    unsubscribed: Number,
    complaints: Number
  },
  budget: {
    allocated: Number,
    spent: Number,
    currency: {
      type: String,
      default: 'XOF'
    }
  },
  tracking: {
    utmSource: String,
    utmMedium: String,
    utmCampaign: String
  },
  abTest: {
    enabled: {
      type: Boolean,
      default: false
    },
    variants: [{
      name: String,
      content: {
        subject: String,
        body: String,
        imageUrl: String
      },
      metrics: {
        sent: Number,
        opened: Number,
        clicked: Number,
        converted: Number
      }
    }]
  }
}, {
  timestamps: true
});

// Index pour la recherche rapide
marketingCampaignSchema.index({ status: 1, 'schedule.startDate': 1 });
marketingCampaignSchema.index({ type: 1, status: 1 });

// Méthode pour calculer les métriques
marketingCampaignSchema.methods.calculateMetrics = function() {
  const m = this.metrics;
  return {
    deliveryRate: m.delivered / m.sent * 100,
    openRate: m.opened / m.delivered * 100,
    clickRate: m.clicked / m.opened * 100,
    conversionRate: m.converted / m.clicked * 100,
    bounceRate: m.bounced / m.sent * 100,
    unsubscribeRate: m.unsubscribed / m.delivered * 100
  };
};

// Méthode pour vérifier si la campagne peut être démarrée
marketingCampaignSchema.methods.canStart = function() {
  return this.status === 'SCHEDULED' && 
         new Date() >= this.schedule.startDate &&
         (!this.schedule.endDate || new Date() <= this.schedule.endDate);
};

// Méthode pour mettre à jour les métriques
marketingCampaignSchema.methods.updateMetrics = async function(type, count = 1) {
  if (this.metrics[type] !== undefined) {
    this.metrics[type] += count;
    await this.save();
  }
};

export const MarketingCampaign = mongoose.model('MarketingCampaign', marketingCampaignSchema);