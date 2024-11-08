import mongoose from 'mongoose';

const apiMetricSchema = new mongoose.Schema({
  api: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExternalAPI',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  requests: {
    total: Number,
    successful: Number,
    failed: Number
  },
  responseTime: {
    average: Number,
    min: Number,
    max: Number
  },
  errors: [{
    code: String,
    message: String,
    count: Number
  }],
  usage: {
    bandwidth: Number,
    cost: Number,
    credits: Number
  },
  endpoints: [{
    path: String,
    calls: Number,
    errors: Number,
    avgResponseTime: Number
  }]
}, {
  timestamps: true
});

export const APIMetric = mongoose.model('APIMetric', apiMetricSchema);