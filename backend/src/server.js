require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const validateEnv = require('./config/env');

const PORT = process.env.PORT || 5000;

// Validate environment variables
validateEnv();

// Connect to database
connectDB();

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`❤️  Health check at http://localhost:${PORT}/health`);

  // Start cron jobs in production
  if (process.env.NODE_ENV === 'production') {
    try {
      const { startRedFlagJob } = require('./jobs/redFlag.job');
      startRedFlagJob();
    } catch (error) {
      console.error('Failed to start cron jobs:', error);
    }
  }
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
