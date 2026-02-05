const { verifyToken } = require('../utils/jwt.util');
const db = require('../models');

/**
 * Middleware to verify JWT token
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide a valid token.'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token
    const decoded = verifyToken(token);

    // Get user from database
    const user = await db.User.findByPk(decoded.userId, {
      attributes: { exclude: ['passwordHash'] },
      include: [{
        model: db.Subscription,
        as: 'subscriptions',
        where: { status: 'active' },
        required: false
      }]
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user.id;
    req.userRole = user.role;

    next();
  } catch (error) {
    if (error.message === 'Token expired') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
        code: 'TOKEN_EXPIRED'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }
};

/**
 * Middleware to require specific role(s)
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions. This feature requires a higher access level.',
        requiredRoles: allowedRoles,
        yourRole: req.user.role
      });
    }

    next();
  };
};

/**
 * Middleware to check if user has Plus subscription
 */
const requirePlus = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Admin always has access
    if (req.user.role === 'admin') {
      return next();
    }

    // Check for active Plus subscription
    const subscription = await db.Subscription.findOne({
      where: {
        userId: req.user.id,
        planType: 'plus',
        status: 'active'
      }
    });

    if (!subscription) {
      return res.status(403).json({
        success: false,
        message: 'This feature requires Index Plus subscription',
        code: 'PLUS_REQUIRED',
        upgrade: 'https://app.azexai.com/upgrade'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking subscription status'
    });
  }
};

/**
 * Optional auth middleware - attaches user if token is present
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const decoded = verifyToken(token);
      const user = await db.User.findByPk(decoded.userId, {
        attributes: { exclude: ['passwordHash'] }
      });
      
      if (user && user.isActive) {
        req.user = user;
        req.userId = user.id;
        req.userRole = user.role;
      }
    }

    next();
  } catch (error) {
    // Continue without user
    next();
  }
};

module.exports = {
  authMiddleware,
  requireRole,
  requirePlus,
  optionalAuth
};
