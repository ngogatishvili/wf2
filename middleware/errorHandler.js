const { StatusCodes } = require('http-status-codes');

const errorHandler = (err, req, res) => {
  const CustomError = {
    statusCode: err.StatusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong',
  };

  if (err.code === 11000) {
    CustomError.statusCode = StatusCodes.UNAUTHORIZED;
    CustomError.message = `Duplicate value is detected for ${Object.keys(
      err.keyValue,
    )}`;
  }

  if (err.name === 'ValidationError') {
    CustomError.statusCode = StatusCodes.BAD_REQUEST;
    CustomError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(',');
  }

  return res.status(CustomError.statusCode).json({ msg: CustomError.message });
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err})
};

module.exports = errorHandler;
