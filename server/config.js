export const config = {
  mongoUri: process.env.MONGO_URI,
  mongoOptions: {
    serverApi: {
      version: process.env.MONGO_API_VERSION,
      strict: process.env.MONGO_STRICT === 'true',
      deprecationErrors: process.env.MONGO_DEPRECATION_ERRORS === 'true'
    }
  },
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_PORT === '465',
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM
  },
  frontendUrl: process.env.FRONTEND_URL
};