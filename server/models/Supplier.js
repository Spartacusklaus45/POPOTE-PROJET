import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['PRODUCER', 'DISTRIBUTOR', 'WHOLESALER', 'MANUFACTURER'],
    required: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'PENDING', 'BLOCKED'],
    default: 'ACTIVE'
  },
  contact: {
    name: String,
    email: String,
    phone: String,
    position: String
  },
  address: {
    street: String,
    city: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    price: Number,
    minOrderQuantity: Number,
    leadTime: Number, // en jours
    isPreferred: {
      type: Boolean,
      default: false
    }
  }],
  paymentTerms: {
    method: {
      type: String,
      enum: ['CASH', 'CREDIT', 'BANK_TRANSFER'],
      default: 'BANK_TRANSFER'
    },
    creditDays: {
      type: Number,
      default: 30
    },
    currency: {
      type: String,
      default: 'XOF'
    }
  },
  performance: {
    qualityScore: {
      type: Number,
      min: 0,
      max: 100
    },
    deliveryScore: {
      type: Number,
      min: 0,
      max: 100
    },
    responseTime: {
      type: Number, // en heures
      default: 24
    },
    lastEvaluation: Date
  },
  documents: [{
    type: {
      type: String,
      enum: ['CONTRACT', 'LICENSE', 'CERTIFICATION', 'INSURANCE'],
      required: true
    },
    number: String,
    issueDate: Date,
    expiryDate: Date,
    fileUrl: String
  }],
  bankDetails: {
    bankName: String,
    accountNumber: String,
    accountName: String,
    swiftCode: String
  },
  notes: String,
  tags: [String]
}, {
  timestamps: true
});

// Index pour la recherche rapide
supplierSchema.index({ code: 1 });
supplierSchema.index({ status: 1 });
supplierSchema.index({ 'products.product': 1 });
supplierSchema.index({ 
  name: 'text',
  'contact.name': 'text',
  'contact.email': 'text'
});

// Méthode pour générer un code unique
supplierSchema.statics.generateCode = async function() {
  const count = await this.countDocuments();
  return `SUP${(count + 1).toString().padStart(4, '0')}`;
};

// Méthode pour calculer le score global
supplierSchema.methods.calculateOverallScore = function() {
  if (!this.performance.qualityScore || !this.performance.deliveryScore) {
    return null;
  }
  return (this.performance.qualityScore * 0.6 + this.performance.deliveryScore * 0.4).toFixed(2);
};

// Méthode pour vérifier les documents expirés
supplierSchema.methods.getExpiredDocuments = function() {
  const now = new Date();
  return this.documents.filter(doc => 
    doc.expiryDate && doc.expiryDate < now
  );
};

// Méthode pour obtenir les produits en rupture de stock
supplierSchema.methods.getLowStockProducts = async function(threshold = 10) {
  const products = await mongoose.model('Product').find({
    _id: { $in: this.products.map(p => p.product) },
    quantity: { $lte: threshold }
  });
  return products;
};

export const Supplier = mongoose.model('Supplier', supplierSchema);