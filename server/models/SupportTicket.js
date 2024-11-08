import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['QUESTION', 'PROBLEM', 'REQUEST', 'COMPLAINT', 'OTHER'],
    required: true
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM'
  },
  status: {
    type: String,
    enum: ['NEW', 'IN_PROGRESS', 'WAITING_USER', 'RESOLVED', 'CLOSED'],
    default: 'NEW'
  },
  category: {
    type: String,
    enum: ['ORDER', 'DELIVERY', 'PAYMENT', 'ACCOUNT', 'PRODUCT', 'TECHNICAL', 'OTHER'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  attachments: [{
    url: String,
    name: String,
    type: String,
    size: Number
  }],
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    attachments: [{
      url: String,
      name: String,
      type: String,
      size: Number
    }],
    createdAt: {
      type: Date,
      default: Date.now
    },
    isInternal: {
      type: Boolean,
      default: false
    }
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  relatedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  resolution: {
    solution: String,
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  satisfaction: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date
  },
  metadata: {
    browser: String,
    platform: String,
    ipAddress: String
  }
}, {
  timestamps: true
});

// Index pour la recherche rapide
supportTicketSchema.index({ user: 1, status: 1 });
supportTicketSchema.index({ assignedTo: 1, status: 1 });
supportTicketSchema.index({ category: 1, priority: 1 });

// Méthode pour ajouter un message
supportTicketSchema.methods.addMessage = async function(senderId, content, attachments = [], isInternal = false) {
  this.messages.push({
    sender: senderId,
    content,
    attachments,
    isInternal
  });
  
  // Mettre à jour le statut si nécessaire
  if (this.status === 'NEW') {
    this.status = 'IN_PROGRESS';
  }

  return this.save();
};

// Méthode pour résoudre le ticket
supportTicketSchema.methods.resolve = async function(userId, solution) {
  this.status = 'RESOLVED';
  this.resolution = {
    solution,
    resolvedAt: new Date(),
    resolvedBy: userId
  };
  return this.save();
};

// Méthode pour soumettre une évaluation
supportTicketSchema.methods.submitSatisfaction = async function(rating, comment) {
  this.satisfaction = {
    rating,
    comment,
    submittedAt: new Date()
  };
  return this.save();
};

export const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);