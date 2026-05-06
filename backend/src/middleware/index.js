// Middleware Index
module.exports = {
  // Authentication middleware
  AuthMiddleware: require('./authMiddleware'),
  
  // Rate limiting middleware
  RateLimitMiddleware: require('./rateLimitMiddleware'),
  
  // Security middleware
  SecurityMiddleware: require('./securityMiddleware'),
  
  // Upload middleware
  UploadMiddleware: require('./uploadMiddleware')
};
