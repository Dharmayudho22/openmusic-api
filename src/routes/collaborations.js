const {
  postCollaborationHandler,
  deleteCollaborationHandler,
} = require('../handlers/collaborations');
  
module.exports = [
  {
    method: 'POST',
    path: '/collaborations',
    handler: postCollaborationHandler,
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: deleteCollaborationHandler,
  },
];
  