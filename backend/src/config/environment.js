// Environment variables configuration
module.exports = {
  required: {
    DB_HOST: 'Database host',
    DB_PORT: 'Database port',
    DB_NAME: 'Database name',
    DB_USER: 'Database user',
    DB_PASSWORD: 'Database password',
    JWT_SECRET: 'JWT secret key',
    JWT_EXPIRES_IN: 'JWT expiration time'
  },
  optional: {
    NODE_ENV: 'Environment (development/production)',
    LOG_LEVEL: 'Logging level',
    PORT: 'Server port',
    CORS_ORIGIN: 'CORS allowed origins',
    RATE_LIMIT_WINDOW_MS: 'Rate limit window',
    RATE_LIMIT_MAX_REQUESTS: 'Rate limit max requests'
  },
  defaults: {
    NODE_ENV: 'development',
    LOG_LEVEL: 'info',
    PORT: 3000,
    CORS_ORIGIN: 'http://localhost:3000',
    RATE_LIMIT_WINDOW_MS: 900000, // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: 100
  },
  sensitive: [
    'DB_PASSWORD',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'STRIPE_SECRET_KEY',
    'PAYPAL_CLIENT_SECRET',
    'TWILIO_AUTH_TOKEN',
    'EMAIL_PASS',
    'CLOUDINARY_API_SECRET',
    'AWS_SECRET_ACCESS_KEY'
  ],
  url: {
    frontend: {
      development: 'http://localhost:3000',
      production: process.env.FRONTEND_URL
    },
    backend: {
      development: 'http://localhost:3000/api',
      production: process.env.BACKEND_URL
    }
  }
};
