import express from 'express';
import dotenv from 'dotenv';
import {
  securityHeaders,
  xssProtection,
  noSqlInjection,
  parameterPollution,
  rateLimiter
} from './middleware/security';
import { auditLog } from './middleware/audit';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

// Middleware de sécurité
app.use(securityHeaders);
app.use(xssProtection);
app.use(noSqlInjection);
app.use(parameterPollution);
app.use(rateLimiter);

// Middleware d'audit
app.use(auditLog);

// Parsing et validation des données
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Routes
app.use('/api', routes);

// Gestion des erreurs
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Gestion gracieuse de l'arrêt
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();