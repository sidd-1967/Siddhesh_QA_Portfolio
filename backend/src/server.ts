import mongoose from 'mongoose';
import app from './app';
import { config } from './config/config';

async function startServer() {
  // Start Express server immediately so frontend doesn't hang
  app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`);
    console.log(`🌐 Frontend origin: ${config.cors.origin}`);
  });

  try {
    // Connect to MongoDB with a timeout so it doesn't hang forever
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10s timeout instead of 30s default
      connectTimeoutMS: 10000,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    console.error('⚠️  Server is running but database is not connected.');
    console.error('   Check your MONGO_URI and ensure your IP is whitelisted in MongoDB Atlas.');
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

startServer();
