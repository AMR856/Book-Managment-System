const errorHandler = (err, req, res, next) => {

  console.log('==========================================');
  console.error(err);
  console.log('==========================================');

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.isJoi) statusCode = 400;
  if (err.name === 'JsonWebTokenError') statusCode = 401;

  res.status(statusCode).json({
    status: 'error',
    message,
  });
  
}

module.exports = errorHandler;