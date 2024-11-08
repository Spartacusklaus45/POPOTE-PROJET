import { ExternalAPI } from '../models/ExternalAPI.js';
import { APILog } from '../models/APILog.js';
import { APIMetric } from '../models/APIMetric.js';
import crypto from 'crypto';

export const getAllAPIs = async (req, res) => {
  try {
    const apis = await ExternalAPI.find().select('-apiKey');
    res.json(apis);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching APIs' });
  }
};

export const getAPIById = async (req, res) => {
  try {
    const api = await ExternalAPI.findById(req.params.id).select('-apiKey');
    if (!api) {
      return res.status(404).json({ message: 'API not found' });
    }
    res.json(api);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching API' });
  }
};

export const createAPI = async (req, res) => {
  try {
    const api = new ExternalAPI(req.body);
    await api.save();
    res.status(201).json(api);
  } catch (err) {
    res.status(500).json({ message: 'Error creating API' });
  }
};

export const updateAPI = async (req, res) => {
  try {
    const api = await ExternalAPI.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-apiKey');
    if (!api) {
      return res.status(404).json({ message: 'API not found' });
    }
    res.json(api);
  } catch (err) {
    res.status(500).json({ message: 'Error updating API' });
  }
};

export const deleteAPI = async (req, res) => {
  try {
    const api = await ExternalAPI.findByIdAndDelete(req.params.id);
    if (!api) {
      return res.status(404).json({ message: 'API not found' });
    }
    res.json({ message: 'API deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting API' });
  }
};

export const getAPIMetrics = async (req, res) => {
  try {
    const metrics = await APIMetric.find({ api: req.params.id })
      .sort('-date')
      .limit(30);
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching API metrics' });
  }
};

export const getAPILogs = async (req, res) => {
  try {
    const logs = await APILog.find({ api: req.params.id })
      .sort('-timestamp')
      .limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching API logs' });
  }
};

export const testAPIConnection = async (req, res) => {
  try {
    const api = await ExternalAPI.findById(req.params.id);
    if (!api) {
      return res.status(404).json({ message: 'API not found' });
    }

    // Test the connection using the API's test endpoint
    const response = await fetch(`${api.baseUrl}/test`, {
      headers: {
        'Authorization': `Bearer ${api.apiKey}`
      }
    });

    const isConnected = response.ok;
    
    // Update API status
    api.status = isConnected ? 'active' : 'error';
    api.lastCheck = new Date();
    if (!isConnected) api.errorCount++;
    
    await api.save();

    res.json({
      success: isConnected,
      message: isConnected ? 'Connection successful' : 'Connection failed'
    });
  } catch (err) {
    res.status(500).json({ message: 'Error testing API connection' });
  }
};

export const getAPIStatus = async (req, res) => {
  try {
    const api = await ExternalAPI.findById(req.params.id)
      .select('status lastCheck errorCount');
    if (!api) {
      return res.status(404).json({ message: 'API not found' });
    }
    res.json(api);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching API status' });
  }
};

export const resetAPIKey = async (req, res) => {
  try {
    const api = await ExternalAPI.findById(req.params.id);
    if (!api) {
      return res.status(404).json({ message: 'API not found' });
    }

    // Generate new API key
    const newApiKey = crypto.randomBytes(32).toString('hex');
    api.apiKey = newApiKey;
    await api.save();

    res.json({
      message: 'API key reset successfully',
      newApiKey
    });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting API key' });
  }
};