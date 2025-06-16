const { authenticate } = require('../auth/authMiddleware');
const { validateCollaborationPayload } = require('../validator/collaborationsValidator');
const { addCollaboration, deleteCollaboration } = require('../services/collaborations');
const { verifyPlaylistOwner } = require('../services/playlistSongs');
const Boom = require('@hapi/boom');

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
    if (Boom.isBoom(error)){
      return h.response({
        status: error.output.statusCode === 500? 'error' : 'fail',
        message: error.message,
      }).code(error.output.statusCode);
    }

    if (error.name === 'ValidationError'){
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(400);
    }
    
    console.error(error);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    }).code(500);
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
    if (Boom.isBoom(error)) {
      return h.response({
        status: error.output.statusCode === 500 ? 'error' : 'fail',
        message: error.message,
      }).code(error.output.statusCode);
    }

    if (error.name === 'ValidationError') {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(400);
    }

    console.error(error);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    }).code(500);
  }
};

module.exports = {
  postCollaborationHandler,
  deleteCollaborationHandler,
};
