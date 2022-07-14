const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authorization = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authorization failed');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, 'jwtSecret');
    const { userId, name } = payload;
    req.user = { userId, name };
    next();
  } catch (err) {
    throw new UnauthenticatedError('Authorization failed');
  }
};

module.exports = authorization;
