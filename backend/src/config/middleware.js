// Middleware configurations
module.exports = {
  auth: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    tokenLocation: 'header' // 'header' or 'query'
  },
  passport: {
    jwt: {
      authRoute: '/api/auth/login',
      failureMessage: true
    }
  },
  session: {
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.COOKIE_SECURE === 'true',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  },
  api: {
    version: process.env.API_VERSION || 'v1',
    timeout: parseInt(process.env.API_TIMEOUT) || 30000
  }
};
