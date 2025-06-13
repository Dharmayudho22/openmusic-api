const { authenticate } = require('../auth/authMiddleware');
const { validateCollaborationPayload } = require('../validator/collaborationsValidator');
const { addCollaboration, deleteCollaboration } = require('../services/collaborations');
const { verifyPlaylistOwner } = require('../services/playlistSongs');

const postCollaborationHandler = async (request, h) => {
  try {
    const userId = authenticate(request);
    validateCollaborationPayload(request.payload);

    const { playlistId, userId: targetUserId } = request.payload;

    await verifyPlaylistOwner(playlistId, userId);
    const collabId = await addCollaboration(playlistId, targetUserId);

    return h.response({
      status: 'success',
      message: 'Kolaborator berhasil ditambahkan',
      data: { collaborationId: collabId },
    }).code(201);
  } catch (error) {
    const status = error.name === 'ValidationError' ? 400 :
      error.name === 'Forbidden' ? 403 :
        error.name === 'Unauthorized' ? 401 :
          error.name === 'NotFoundError' ? 404 : 500;
    return h.response({ status: 'fail', message: error.message }).code(status);
  }
};

const deleteCollaborationHandler = async (request, h) => {
  try {
    const userId = authenticate(request);
    validateCollaborationPayload(request.payload);

    const { playlistId, userId: targetUserId } = request.payload;

    await verifyPlaylistOwner(playlistId, userId);
    await deleteCollaboration(playlistId, targetUserId);

    return h.response({
      status: 'success',
      message: 'Kolaborator berhasil dihapus',
    });
  } catch (error) {
    const status = error.name === 'ValidationError' ? 400 :
      error.name === 'Forbidden' ? 403 :
        error.name === 'Unauthorized' ? 401 :
          error.name === 'NotFoundError' ? 404 : 500;
    return h.response({ status: 'fail', message: error.message }).code(status);
  }
};

module.exports = {
  postCollaborationHandler,
  deleteCollaborationHandler,
};
