const rateLimit = require('express-rate-limit');
const config = require('../config/app');

class RateLimitMiddleware {
  // Global rate limiter for all requests
  static generalLimiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS * 1000,
    max: config.RATE_LIMIT_MAX_REQUESTS,
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Strict rate limiter for authentication endpoints
  static authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
      success: false,
      message: 'Too many authentication attempts, please try again after 15 minutes.'
    },
    skipSuccessfulRequests: false
  });

  // Lenient rate limiter for read-only endpoints
  static readLimiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS * 1000,
    max: config.RATE_LIMIT_MAX_REQUESTS * 2,
    message: {
      success: false,
      message: 'Too many read requests from this IP.'
    },
    standardHeaders: true,
    legacyHeaders: false
  });

  // Custom rate limiter for specific routes
  static createLimiter(options = {}) {
    const {
      windowMs = config.RATE_LIMIT_WINDOW_MS * 1000,
      max = config.RATE_LIMIT_MAX_REQUESTS,
      message = 'Too many requests from this IP, please try again later.',
      skipSuccessfulRequests = true,
      keyGenerator = (req) => req.ip
    } = options;

    return rateLimit({
      windowMs,
      max,
      message: {
        success: false,
        message
      },
      skipSuccessfulRequests,
      keyGenerator
    });
  }

  // Rate limiter for file upload
  static uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 uploads per hour
    message: {
      success: false,
      message: 'Too many file uploads, please try again later.'
    },
    skipSuccessfulRequests: false
  });

  // Rate limiter for payment processing
  static paymentLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 payment attempts per hour
    message: {
      success: false,
      message: 'Too many payment attempts, please try again later.'
    },
    skipSuccessfulRequests: false
  });

  // Rate limiter for notification sending
  static notificationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // 50 notifications per hour
    message: {
      success: false,
      message: 'Too many notification requests, please try again later.'
    },
    skipSuccessfulRequests: false
  });

  // Get current rate limit status
  static getStatus(req, res, next) {
    const limit = res.locals.limit || config.RATE_LIMIT_MAX_REQUESTS;
    const remaining = res.locals.remaining || 0;
    const reset = res.locals.reset || 0;

    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', reset);

    if (remaining <= 0) {
      res.setHeader('Retry-After', Math.ceil((reset - Math.floor(Date.now() / 1000)) / 60));
    }

    next();
  }
}

module.exports = RateLimitMiddleware;
