import { Request, Response, NextFunction } from 'express';
import { createHash } from 'crypto';
import { AdminLog } from '../models/AdminLog';

// Journalisation des actions sensibles
export const auditLog = async (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  res.on('finish', async () => {
    const duration = Date.now() - startTime;
    
    // Création d'une empreinte unique de la requête
    const requestHash = createHash('sha256')
      .update(JSON.stringify({
        method: req.method,
        url: req.url,
        body: req.body,
        userId: req.user?.id,
        timestamp: startTime
      }))
      .digest('hex');

    await AdminLog.create({
      user: req.user?.id,
      action: req.method,
      resourceType: req.baseUrl.split('/')[1],
      details: {
        url: req.url,
        method: req.method,
        body: req.body,
        statusCode: res.statusCode,
        duration,
        requestHash
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
  });

  next();
};