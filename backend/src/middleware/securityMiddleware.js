const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const config = require('../config/app');

class SecurityMiddleware {
  // Initialize helmet with security headers
  static helmet() {
    return helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
          scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
          imgSrc: ["'self'", "data:", "https:"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          connectSrc: ["'self'", "https://api.stripe.com", "https://api.paypal.com"],
          frameSrc: ["'none'"],
          upgradeInsecureRequests: []
        }
      },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: "same-origin" },
      crossOriginResourcePolicy: { policy: "same-origin" },
      dnsPrefetchControl: { allow: false },
      frameguard: { action: "deny" },
      hidePoweredBy: true,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      },
      ieNoOpen: true,
      noSniff: true,
      originAgentCluster: true,
      permittedCrossDomainPolicies: { permittedPolicies: "none" },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      xssFilter: true
    });
  }

  // CORS configuration
  static cors() {
    const corsOptions = {
      origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        // Check if origin is in whitelist
        const allowedOrigins = config.ALLOWED_ORIGINS || ['http://localhost:3000'];
        
        if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('localhost')) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
      exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
      maxAge: 86400, // 24 hours
      optionsSuccessStatus: 200
    };

    return cors(corsOptions);
  }

  // Compression middleware
  static compression() {
    return compression({
      level: 6,
      threshold: 1024,
      filter: (req, res) => {
        // Don't compress if client doesn't support it
        if (req.headers['x-no-compression']) {
          return false;
        }

        // Compress JSON, HTML, CSS, JavaScript
        return /json|html|css|javascript|text/
          .test(res.getHeader('Content-Type'));
      }
    });
  }

  // Disable caching for sensitive endpoints
  static noCache() {
    return function (req, res, next) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      next();
    };
  }

  // Security headers for specific routes
  static securityHeaders(req, res, next) {
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    });
    next();
  }

  // Disable path traversal
  static noPathTraversal() {
    return (req, res, next) => {
      // Check for path traversal attempts
      if (req.path.includes('..') || req.path.includes('%2e%2e')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid path requested'
        });
      }
      next();
    };
  }

  // Initialize all security middleware
  static initialize() {
    return [
      this.helmet(),
      this.cors(),
      this.compression(),
      this.noCache(),
      this.securityHeaders,
      this.noPathTraversal()
    ];
  }
}

module.exports = SecurityMiddleware;
