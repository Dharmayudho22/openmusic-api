const jwt = require('jsonwebtoken');

const authenticate = (request) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    const error = new Error('Token tidak ditemukan');
    error.name = 'Unauthorized';
    throw error;
  }
  
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    return decoded.userId;
  } catch (err) {
    const error = new Error('Token tidak valid');
    error.name = 'Unauthorized';
    throw error;
  }
};
  
module.exports = { authenticate };