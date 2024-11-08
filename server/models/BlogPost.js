import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 500
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['RECIPES', 'TIPS', 'NEWS', 'EVENTS', 'LIFESTYLE', 'NUTRITION'],
    required: true
  },
  tags: [String],
  featuredImage: {
    url: String,
    alt: String,
    caption: String
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
    default: 'DRAFT'
  },
  publishedAt: Date,
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    date: {
      type: Date,
      default: Date.now
    },
    isApproved: {
      type: Boolean,
      default: false
    }
  }],
  relatedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogPost'
  }],
  seoMetadata: {
    title: String,
    description: String,
    keywords: [String],
    ogImage: String
  },
  readingTime: Number
}, {
  timestamps: true
});

// Index pour la recherche rapide
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1, status: 1 });
blogPostSchema.index({
  title: 'text',
  content: 'text',
  excerpt: 'text'
});

// Middleware pour générer le slug
blogPostSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Calculer le temps de lecture
  if (this.content) {
    const wordsPerMinute = 200;
    const wordCount = this.content.trim().split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }

  next();
});

// Méthode pour incrémenter les vues
blogPostSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Méthode pour ajouter un like
blogPostSchema.methods.addLike = async function(userId) {
  if (!this.likes.some(like => like.user.toString() === userId.toString())) {
    this.likes.push({ user: userId });
    await this.save();
    return true;
  }
  return false;
};

// Méthode pour retirer un like
blogPostSchema.methods.removeLike = async function(userId) {
  this.likes = this.likes.filter(
    like => like.user.toString() !== userId.toString()
  );
  await this.save();
  return true;
};

// Méthode pour ajouter un commentaire
blogPostSchema.methods.addComment = async function(userId, content) {
  this.comments.push({
    user: userId,
    content,
    isApproved: false
  });
  await this.save();
  return this.comments[this.comments.length - 1];
};

export const BlogPost = mongoose.model('BlogPost', blogPostSchema);