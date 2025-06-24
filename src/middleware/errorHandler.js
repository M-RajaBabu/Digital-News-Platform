const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    message: 'Internal Server Error',
    status: 500
  };

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    error = {
      message: 'Validation Error',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      })),
      status: 400
    };
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    error = {
      message: 'Duplicate Entry',
      details: err.errors.map(e => ({
        field: e.path,
        message: `${e.path} already exists`
      })),
      status: 400
    };
  }

  // Sequelize foreign key constraint errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    error = {
      message: 'Reference Error',
      details: `Referenced ${err.fields.join(', ')} does not exist`,
      status: 400
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Invalid token',
      status: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      message: 'Token expired',
      status: 401
    };
  }

  // Cast errors (invalid UUID, etc.)
  if (err.name === 'CastError') {
    error = {
      message: 'Invalid ID format',
      status: 400
    };
  }

  // Custom application errors
  if (err.status) {
    error = {
      message: err.message || 'Application Error',
      status: err.status
    };
  }

  // Development error details
  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
    error.error = err.message;
  }

  res.status(error.status).json({
    error: error.message,
    ...(error.details && { details: error.details }),
    ...(error.stack && { stack: error.stack }),
    ...(error.error && { error: error.error }),
    status: error.status,
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
};

module.exports = errorHandler; 