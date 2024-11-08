import mongoose from 'mongoose';

const externalAPISchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  provider: {
    type: String,
    required: true
  },
  apiKey: {
    type: String,
    required: true
  },
  baseUrl: {
    type: String,
    required: true
  },
  endpoints: [{
    name: String,
    path: String,
    method: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'DELETE']
    },
    parameters: [{
      name: String,
      type: String,
      required: Boolean,
      description: String
    }]
  }],
  rateLimit: {
    requests: Number,
    period: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'error'],
    default: 'active'
  },
  lastCheck: Date,
  errorCount: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: [
      'nutrition',
      'recipe',
      'payment',
      'delivery',
      'maps',
      'weather',
      'authentication'
    ]
  },
  settings: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

export const ExternalAPI = mongoose.model('ExternalAPI', externalAPISchema);