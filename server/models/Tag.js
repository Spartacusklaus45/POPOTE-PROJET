import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['CATEGORY', 'CUISINE', 'DIET', 'OCCASION', 'FEATURE', 'OTHER'],
    required: true
  },
  description: String,
  icon: String,
  color: String,
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  seoMetadata: {
    title: String,
    description: String,
    keywords: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index pour la recherche rapide
tagSchema.index({ slug: 1 });
tagSchema.index({ type: 1, isActive: 1 });
tagSchema.index({ parent: 1 });

// Middleware pour générer le slug
tagSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Méthode pour obtenir le chemin complet du tag
tagSchema.methods.getFullPath = async function() {
  const path = [this.name];
  let currentTag = this;

  while (currentTag.parent) {
    currentTag = await this.constructor.findById(currentTag.parent);
    if (currentTag) {
      path.unshift(currentTag.name);
    } else {
      break;
    }
  }

  return path.join(' > ');
};

// Méthode pour obtenir tous les tags enfants
tagSchema.methods.getChildren = async function() {
  return this.constructor.find({ parent: this._id });
};

export const Tag = mongoose.model('Tag', tagSchema);