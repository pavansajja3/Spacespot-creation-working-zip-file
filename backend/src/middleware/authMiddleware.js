const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/app');

class AuthMiddleware {
  // Verify JWT token and attach user to request
  static async verifyToken(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. No token provided.'
        });
      }

      const token = authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. Invalid token format.'
        });
      }

      const decoded = jwt.verify(token, config.JWT_SECRET);
      
      // Verify user still exists and is active
      const user = await User.findByPk(decoded.userId, {
        attributes: ['id', 'email', 'role', 'is_active']
      });

      if (!user || !user.is_active) {
        return res.status(401).json({
          success: false,
          message: 'User account is inactive or no longer exists.'
        });
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name
      };

      next();
    } catch (error) {
      console.error('AuthMiddleware.verifyToken error:', error);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired. Please log in again.'
        });
      }

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token.'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Authentication failed.',
        error: error.message
      });
    }
  }

  // Verify role-based access
  static async checkRole(...allowedRoles) {
    return async (req, res, next) => {
      try {
        const userRole = req.user?.role;

        if (!userRole) {
          return res.status(403).json({
            success: false,
            message: 'User role not found in token.'
          });
        }

        if (!allowedRoles.includes(userRole)) {
          return res.status(403).json({
            success: false,
            message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`
          });
        }

        next();
      } catch (error) {
        console.error('AuthMiddleware.checkRole error:', error);
        return res.status(500).json({
          success: false,
          message: 'Authorization check failed.',
          error: error.message
        });
      }
    };
  }

  // Verify permissions
  static async checkPermission(permission) {
    return async (req, res, next) => {
      try {
        const userPermissions = req.user?.permissions || [];

        if (!userPermissions.includes(permission)) {
          return res.status(403).json({
            success: false,
            message: `Access denied. Required permission: ${permission}`
          });
        }

        next();
      } catch (error) {
        console.error('AuthMiddleware.checkPermission error:', error);
        return res.status(500).json({
          success: false,
          message: 'Permission check failed.',
          error: error.message
        });
      }
    };
  }

  // Verify if user is admin
  static async isAdmin(req, res, next) {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.'
        });
      }
      next();
    } catch (error) {
      console.error('AuthMiddleware.isAdmin error:', error);
      return res.status(500).json({
        success: false,
        message: 'Admin check failed.',
        error: error.message
      });
    }
  }

  // Verify if user is staff
  static async isStaff(req, res, next) {
    try {
      const allowedRoles = ['admin', 'staff'];

      if (!allowedRoles.includes(req.user?.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Staff privileges required.'
        });
      }
      next();
    } catch (error) {
      console.error('AuthMiddleware.isStaff error:', error);
      return res.status(500).json({
        success: false,
        message: 'Staff check failed.',
        error: error.message
      });
    }
  }

  // Generate refresh token
  static generateAccessToken(user) {
    return jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRATION }
    );
  }

  static generateRefreshToken(user) {
    return jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      config.JWT_REFRESH_SECRET,
      { expiresIn: config.JWT_REFRESH_EXPIRATION }
    );
  }

  // Verify token without user existence check (for refresh tokens)
  static verifyTokenWithoutCheck(token) {
    return jwt.verify(token, config.JWT_SECRET);
  }
}

module.exports = AuthMiddleware;
