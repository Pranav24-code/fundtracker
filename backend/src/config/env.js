/**
 * Environment variable validation
 * Ensures all required environment variables are set
 */

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRE',
];

const optionalEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'ADMIN_EMAIL',
];

const validateEnv = () => {
  const missing = [];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.error('Please check your .env file');
    process.exit(1);
  }

  // Warn about missing optional vars
  optionalEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      console.warn(`⚠️  Optional env variable not set: ${varName}`);
    }
  });

  console.log('✅ Environment variables validated');
};

module.exports = validateEnv;
