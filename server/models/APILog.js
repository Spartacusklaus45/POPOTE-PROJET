import mongoose from 'mongoose';

const apiLogSchema = new mongoose.Schema({
  api: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExternalAPI',
    required: true
  },
  endpoint: {
    type: String,
    required: true
  },
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE'],
    required: true
  },
  requestData: mongoose.Schema.Types.Mixed,
  responseData: mongoose.Schema.Types.Mixed,
  statusCode: Number,
  duration: Number,
  error: {
    message: String,
    stack: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ip: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export const APILog = mongoose.model('APILog', apiLogSchema);