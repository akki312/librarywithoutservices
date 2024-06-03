// middleware/errorHandler.js
function errorHandler(err, req, res, next) {
    console.error(err.stack); // Log the error stack trace for debugging
  
    const statusCode = err.status || 500;
    const errorMessage = err.message || 'Internal Server Error';
  
    // Customize error response based on error type
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', details: err.errors });
    } else if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(409).json({ message: 'Duplicate Key Error', details: err.keyValue });
    }
  
    res.status(statusCode).json({
      message: errorMessage,
      // Optionally include stack trace in development
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }
  
  module.exports = errorHandler;
  