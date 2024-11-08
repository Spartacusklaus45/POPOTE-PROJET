import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    default: 'Ma liste de souhaits'
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    notes: String,
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM'
    },
    priceAlert: {
      enabled: {
        type: Boolean,
        default: false
      },
      targetPrice: Number
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  shareableLink: String,
  description: String,
  occasion: {
    type: String,
    enum: ['BIRTHDAY', 'WEDDING', 'HOLIDAY', 'OTHER']
  }
}, {
  timestamps: true
});

// Index pour la recherche rapide
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ isPublic: 1 });
wishlistSchema.index({ shareableLink: 1 });

// Méthode pour vérifier si un produit est dans la liste
wishlistSchema.methods.hasProduct = function(productId) {
  return this.items.some(item => item.product.toString() === productId.toString());
};

// Méthode pour ajouter un produit
wishlistSchema.methods.addProduct = async function(productId, options = {}) {
  if (this.hasProduct(productId)) {
    throw new Error('Ce produit est déjà dans la liste');
  }

  this.items.push({
    product: productId,
    ...options
  });

  return this.save();
};

// Méthode pour supprimer un produit
wishlistSchema.methods.removeProduct = async function(productId) {
  this.items = this.items.filter(
    item => item.product.toString() !== productId.toString()
  );
  return this.save();
};

// Méthode pour générer un lien partageable
wishlistSchema.methods.generateShareableLink = function() {
  this.shareableLink = `${this._id}-${Math.random().toString(36).substring(2, 15)}`;
  return this.shareableLink;
};

export const Wishlist = mongoose.model('Wishlist', wishlistSchema);