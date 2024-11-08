import mongoose from 'mongoose';
import { encrypt, decrypt } from '../utils/encryption';

const connectDB = async () => {
  try {
    // Chiffrement des données sensibles
    mongoose.plugin(schema => {
      schema.pre('save', function(next) {
        const doc = this;
        const sensitiveFields = ['email', 'phone', 'address'];
        
        sensitiveFields.forEach(field => {
          if (doc[field]) {
            doc[field] = encrypt(doc[field]);
          }
        });
        next();
      });

      schema.post('find', function(docs) {
        docs.forEach(doc => {
          sensitiveFields.forEach(field => {
            if (doc[field]) {
              doc[field] = decrypt(doc[field]);
            }
          });
        });
      });
    });

    const conn = await mongoose.connect(process.env.MONGO_URI!, {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
      },
      maxPoolSize: 10,
      socketTimeoutMS: 45000,
      ssl: true,
      authSource: 'admin',
      retryWrites: true,
      w: 'majority'
    });

    console.log('MongoDB Connected');
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;