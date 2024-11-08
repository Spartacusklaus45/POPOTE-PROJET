import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['GENERAL', 'ORDERS', 'DELIVERY', 'PAYMENT', 'ACCOUNT', 'PRODUCTS', 'TECHNICAL'],
    required: true
  },
  tags: [String],
  isPublished: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  helpfulVotes: {
    helpful: {
      type: Number,
      default: 0
    },
    notHelpful: {
      type: Number,
      default: 0
    }
  },
  relatedFaqs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FAQ'
  }],
  seoMetadata: {
    title: String,
    description: String,
    keywords: [String]
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour la recherche rapide
faqSchema.index({ category: 1, isPublished: 1 });
faqSchema.index({ tags: 1 });
faqSchema.index({ 
  question: 'text',
  answer: 'text'
});

// Méthode pour voter
faqSchema.methods.vote = function(isHelpful) {
  if (isHelpful) {
    this.helpfulVotes.helpful += 1;
  } else {
    this.helpfulVotes.notHelpful += 1;
  }
  return this.save();
};

// Méthode pour calculer le score d'utilité
faqSchema.methods.getHelpfulScore = function() {
  const total = this.helpfulVotes.helpful + this.helpfulVotes.notHelpful;
  if (total === 0) return 0;
  return (this.helpfulVotes.helpful / total) * 100;
};

export const FAQ = mongoose.model('FAQ', faqSchema);