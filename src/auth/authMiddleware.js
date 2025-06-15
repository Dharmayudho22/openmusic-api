const jwt = require('jsonwebtoken');
const Boom = require('@hapi/boom');

const authenticate = (request) => {
  const authHeader = request.headers?.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw Boom.unauthorized('Token tidak ditemukan');
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    return decoded.userId;
  } catch {
    throw Boom.unauthorized('Token tidak valid');
  }
};

module.exports = { authenticate };