const { StatusCodes } = require('http-status-codes');
const CustomApiError = require('./CustomApiError');

class NotFoundError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;
