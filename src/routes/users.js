const { postUserHandler } = require('../handlers/users');

module.exports = [
  {
    method: 'POST',
    path: '/users',
    handler: postUserHandler,
  },
];