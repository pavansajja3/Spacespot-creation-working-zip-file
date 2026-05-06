# Environment Configuration for SpaceSpot Backend

## Required Variables

### Database
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=spacespot
DB_USER=postgres
DB_PASSWORD=your_secure_password
```

### JWT Authentication
```
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d
```

### Payment Gateways
```
# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_SANDBOX=true
```

### Email Service
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_SECURE=false
EMAIL_FROM=noreply@spacespot.com
EMAIL_SERVICE=smtp
```

### SMS Service (Twilio)
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=+1234567890
```

## Optional Variables

### Server Configuration
```
NODE_ENV=development
PORT=3000
```

### Security
```
CORS_ORIGIN=http://localhost:3000
SESSION_SECRET=your-session-secret-key
```

### Rate Limiting
```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Logging
```
LOG_LEVEL=info
LOG_FORMAT=combined
DB_LOGGING=false
```

## Frontend URLs
```
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3000/api
```

## Cloud Storage (Optional)

### Cloudinary
```
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### AWS S3 (Optional)
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
```

## Production Environment

For production deployment, ensure:
1. All `JWT_SECRET` and `JWT_REFRESH_SECRET` are unique and secure (minimum 32 characters)
2. `NODE_ENV=production`
3. `LOG_LEVEL=error` (avoid logging sensitive data)
4. `CORS_ORIGIN` is set to your production frontend URL
5. All payment gateway secrets are replaced with production keys
6. Use a strong, unique database password
7. Enable SSL/TLS for database connections
8. Set up proper backup and disaster recovery procedures

## Security Best Practices

- Never commit `.env` file to version control
- Use a secrets manager (AWS Secrets Manager, HashiCorp Vault) in production
- Rotate API keys regularly
- Use different keys for development, staging, and production
- Enable 2FA for all service accounts
- Regularly audit access logs
