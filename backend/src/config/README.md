# Configuration Management - SpaceSpot Backend

## Overview
This document provides a comprehensive overview of all configuration files and settings for the SpaceSpot backend API.

## Configuration Files Structure

```
backend/src/config/
├── database.js          # Database connection configuration
├── app.js               # Application-level settings (JWT, CORS, rate limiting)
├── services.js          # Third-party service configurations (Stripe, PayPal, etc.)
├── middleware.js        # Middleware-specific settings (auth, passport, session)
├── validation.js        # Input validation rules and regex patterns
├── environment.js       # Environment variable requirements and defaults
└── README.md            # This file
```

## 1. Database Configuration (database.js)

### Purpose
Manages PostgreSQL database connection pooling and connection settings.

### Key Features
- Connection pooling with configurable max/min connections
- Environment-based connection string
- Logging control for SQL queries
- Connection health checks

### Configuration Options
```javascript
{
  host: 'localhost',
  port: 5432,
  database: 'spacespot',
  username: 'postgres',
  password: 'your_password',
  dialect: 'postgres',
  logging: boolean | function,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}
```

### Environment Variables
- `DB_HOST` - Database server hostname
- `DB_PORT` - Database server port
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_LOGGING` - Enable SQL query logging

## 2. Application Configuration (app.js)

### Purpose
Application-wide settings including security, CORS, and rate limiting.

### JWT Configuration
```javascript
{
  secret: 'jwt-secret-key',
  expiresIn: '24h',
  refreshSecret: 'refresh-secret-key',
  refreshExpiresIn: '7d'
}
```

### CORS Configuration
```javascript
{
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

### Rate Limiting
```javascript
{
  windowMs: 900000, // 15 minutes
  maxRequests: 100
}
```

### Environment Variables
- `JWT_SECRET` - JWT signing secret (required)
- `JWT_EXPIRES_IN` - JWT token expiration
- `JWT_REFRESH_SECRET` - Refresh token secret
- `JWT_REFRESH_EXPIRES_IN` - Refresh token expiration
- `CORS_ORIGIN` - Allowed frontend origins
- `RATE_LIMIT_WINDOW_MS` - Rate limit window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS` - Maximum requests per window

## 3. Third-Party Services (services.js)

### Purpose
Configuration for all external service integrations.

### Payment Gateways

#### Stripe
```javascript
{
  secretKey: process.env.STRIPE_SECRET_KEY,
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
}
```

#### PayPal
```javascript
{
  clientId: process.env.PAYPAL_CLIENT_ID,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET,
  sandbox: boolean
}
```

### Email Service (SMTP)
```javascript
{
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  user: 'your_email@gmail.com',
  pass: 'your_app_password',
  from: 'noreply@spacespot.com'
}
```

### SMS Service (Twilio)
```javascript
{
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  fromNumber: process.env.TWILIO_FROM_NUMBER
}
```

### Cloud Storage

#### Cloudinary
```javascript
{
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET
}
```

#### AWS S3
```javascript
{
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}
```

### Environment Variables
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_SANDBOX`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_FROM`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

## 4. Middleware Configuration (middleware.js)

### Purpose
Settings for authentication middleware, session management, and API configuration.

### Authentication
```javascript
{
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
  tokenLocation: 'header' // 'header' or 'query'
}
```

### Session Management
```javascript
{
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.COOKIE_SECURE === 'true',
    httpOnly: true,
    maxAge: 86400000 // 24 hours
  }
}
```

### API Configuration
```javascript
{
  version: 'v1',
  timeout: 30000
}
```

### Environment Variables
- `SESSION_SECRET`
- `COOKIE_SECURE`
- `API_VERSION`
- `API_TIMEOUT`

## 5. Validation Configuration (validation.js)

### Purpose
Input validation rules, regex patterns, and custom validators.

### Validation Options
```javascript
{
  options: {
    abortEarly: false,
    stripUnknown: false,
    language: {
      labels: {
        email: 'Email',
        password: 'Password'
      }
    }
  },
  customRules: {
    isNotEmpty: (value) => value.trim().length > 0
  }
}
```

### Email Validation
```javascript
{
  regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
}
```

### Phone Validation
```javascript
{
  regex: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/
}
```

### Password Requirements
```javascript
{
  minLength: 8,
  maxLength: 100,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialCharacters: true
}
```

### Name Validation
```javascript
{
  minLength: 2,
  maxLength: 255
}
```

## 6. Environment Configuration (environment.js)

### Purpose
Centralized environment variable requirements, optional variables, and defaults.

### Required Variables
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

### Optional Variables
- `NODE_ENV` (default: 'development')
- `LOG_LEVEL` (default: 'info')
- `PORT` (default: 3000)
- `CORS_ORIGIN` (default: 'http://localhost:3000')

### Sensitive Variables (Never logged)
- `DB_PASSWORD`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `STRIPE_SECRET_KEY`
- `PAYPAL_CLIENT_SECRET`
- `TWILIO_AUTH_TOKEN`
- `EMAIL_PASS`
- `CLOUDINARY_API_SECRET`
- `AWS_SECRET_ACCESS_KEY`

## Environment-Specific Settings

### Development
```
NODE_ENV=development
LOG_LEVEL=debug
DB_LOGGING=true
RATE_LIMIT_MAX_REQUESTS=1000
```

### Staging
```
NODE_ENV=staging
LOG_LEVEL=info
DB_LOGGING=false
RATE_LIMIT_MAX_REQUESTS=200
```

### Production
```
NODE_ENV=production
LOG_LEVEL=error
DB_LOGGING=false
RATE_LIMIT_MAX_REQUESTS=100
```

## Security Considerations

### JWT Security
- Use minimum 32-character secrets
- Rotate secrets every 90 days
- Use different secrets for access and refresh tokens
- Store secrets in environment variables, not code

### Database Security
- Use strong passwords
- Enable SSL/TLS for connections
- Limit database user permissions
- Regular backups with encryption

### Payment Security
- Use production keys in production
- Never log payment card information
- Implement PCI DSS compliance
- Use webhook verification for all payment events

### API Security
- Implement rate limiting
- Use HTTPS in production
- Validate all input data
- Sanitize output to prevent XSS

## Configuration Loading Order

1. Environment variables (highest priority)
2. Process.env
3. Default values in config files
4. Hardcoded defaults

## Testing Configuration

```javascript
// test/config.js
module.exports = {
  ...require('../src/config/database.js'),
  ...require('../src/config/app.js'),
  ...require('../src/config/services.js')
};
```

## Monitoring Configuration

### Health Check Endpoints
- `/api/health` - Basic health check
- `/api/health/detailed` - Detailed health with dependencies

### Metrics
- Response time metrics
- Error rates
- Database connection pool usage
- Rate limit violations

## Deployment Checklist

- [ ] All required environment variables set
- [ ] JWT secrets are unique and secure
- [ ] Payment gateway keys are production keys
- [ ] CORS origins are properly configured
- [ ] Rate limiting is enabled
- [ ] SSL/TLS is enabled for all connections
- [ ] Database backups are configured
- [ ] Logging is set to appropriate level
- [ ] API timeouts are reasonable
- [ ] Sensitive data is not logged
- [ ] Secrets are stored in secure vault (not .env file)

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DB_HOST`, `DB_PORT`, `DB_NAME`
   - Verify database user has correct permissions
   - Check if database server is running

2. **JWT Authentication Fails**
   - Verify `JWT_SECRET` matches across services
   - Check token expiration time
   - Ensure token is properly formatted

3. **Email Not Sending**
   - Verify SMTP credentials
   - Check firewall rules for port 587/465
   - Test with a different email service

4. **Payment Webhook Not Working**
   - Verify `STRIPE_WEBHOOK_SECRET`
   - Check webhook URL is publicly accessible
   - Ensure proper content-type headers

## Additional Resources

- [PostgreSQL Connection Documentation](https://www.postgresql.org/docs/current/libpq-connect.html)
- [JWT Best Practices](https://jwt.io/introduction)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Express Security Checklist](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Last Updated**: 2024-01-15
**Version**: 1.0
**Maintainer**: Backend Development Team
