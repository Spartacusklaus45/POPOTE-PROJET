import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: String,
  comment: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000
  },
  images: [{
    url: String,
    caption: String
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  purchaseDate: Date,
  useTime: {
    duration: Number,
    unit: {
      type: String,
      enum: ['DAYS', 'WEEKS', 'MONTHS', 'YEARS']
    }
  },
  pros: [String],
  cons: [String],
  helpfulVotes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isHelpful: Boolean,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  moderationNotes: String,
  edited: {
    isEdited: {
      type: Boolean,
      default: false
    },
    lastEditDate: Date
  }
}, {
  timestamps: true
});

// Index pour la recherche rapide
reviewSchema.index({ product: 1, status: 1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });

// Méthode pour calculer le score d'utilité
reviewSchema.methods.calculateHelpfulScore = function() {
  if (this.helpfulVotes.length === 0) return 0;

  const helpfulCount = this.helpfulVotes.filter(vote => vote.isHelpful).length;
  return (helpfulCount / this.helpfulVotes.length) * 100;
};

// Méthode pour vérifier si un utilisateur peut modifier l'avis
reviewSchema.methods.canBeEditedBy = function(userId) {
  return this.user.toString() === userId.toString() && 
         this.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 jours
};

// Méthode pour ajouter un vote d'utilité
reviewSchema.methods.addHelpfulVote = async function(userId, isHelpful) {
  const existingVoteIndex = this.helpfulVotes.findIndex(
    vote => vote.user.toString() === userId.toString()
  );

  if (existingVoteIndex > -1) {
    this.helpfulVotes[existingVoteIndex].isHelpful = isHelpful;
  } else {
    this.helpfulVotes.push({ user: userId, isHelpful });
  }

  return this.save();
};

export const Review = mongoose.model('Review', reviewSchema);