/**
 * Global error handling middleware
 */
const errorMiddleware = (err, req, res, next) => {
  // Log error
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  // Response object
  const response = {
    success: false,
    message,
    error: {
      type: err.name || 'Error',
      code: err.code || 'INTERNAL_ERROR'
    }
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
    response.error.details = err.details || null;
  }

  // Handle specific error types
  switch (err.name) {
    case 'SequelizeValidationError':
      response.message = 'Validation error';
      response.error.validationErrors = err.errors.map(e => ({
        field: e.path,
        message: e.message
      }));
      return res.status(400).json(response);

    case 'SequelizeUniqueConstraintError':
      response.message = 'Duplicate entry';
      response.error.field = err.errors[0]?.path;
      return res.status(409).json(response);

    case 'SequelizeDatabaseError':
      response.message = 'Database error';
      return res.status(500).json(response);

    case 'JsonWebTokenError':
      response.message = 'Invalid token';
      return res.status(401).json(response);

    case 'TokenExpiredError':
      response.message = 'Token expired';
      return res.status(401).json(response);

    default:
      return res.status(statusCode).json(response);
  }
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
};

/**
 * Create custom error
 */
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorMiddleware,
  asyncHandler,
  notFoundHandler,
  AppError
};
