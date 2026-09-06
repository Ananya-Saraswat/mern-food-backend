function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || (error.name === 'ValidationError' || error.name === 'CastError' ? 400 : 500);
  const message = error.name === 'ValidationError'
    ? Object.values(error.errors).map((item) => item.message).join(', ')
    : error.name === 'CastError' ? 'Invalid resource id'
    : error.message || 'Internal server error';

  if (statusCode >= 500) console.error(error);
  res.status(statusCode).json({ success: false, message });
}

module.exports = { notFound, errorHandler };
