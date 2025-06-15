const { postAuthenticationHandler, putAuthenticationHandler, deleteAuthenticationHandler } = require('../handlers/authentications');

module.exports = [
  {
    method: 'POST',
    path: '/authentications',
    handler: postAuthenticationHandler,
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: putAuthenticationHandler,
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: deleteAuthenticationHandler,
  },
];