const { validatePlaylistPayload } = require('../validator/playlistsValidator');
const { addPlaylists, getPlaylists, deletePlaylist } = require('../services/playlists');
const { authenticate } = require('../auth/authMiddleware');
const Boom = require('@hapi/boom');

const postPlaylistHandler = async (request, h) => {
  try {
    const userId = authenticate(request);
    validatePlaylistPayload(request.payload);

    const playlistId = await addPlaylists(request.payload.name, userId);
    return h.response({
      status: 'success',
      message: 'Playlist berhasil dibuat',
      data: { playlistId },
    }).code(201);
  } catch (error) {
    if (Boom.isBoom(error)) {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(error.output.statusCode);
    }

    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    }).code(500);
  }
};

const getPlaylistsHandler = async (request, h) => {
  try {
    const userId = authenticate(request);
    const playlists = await getPlaylists(userId);

    return h.response({
      status: 'success',
      data: { playlists },
    });
  } catch (error) {
    if (Boom.isBoom(error)) {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(error.output.statusCode);
    }

    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    }).code(500);
  }
};

const deletePlaylistHandler = async (request, h) => {
  try {
    const userId = authenticate(request);
    const { id } = request.params;

    await deletePlaylist(id, userId);
    return h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus',
    });
  } catch (error) {
    if (Boom.isBoom(error)) {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(error.output.statusCode);
    }

    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    }).code(500);
  }
};

module.exports = {
  postPlaylistHandler,
  getPlaylistsHandler,
  deletePlaylistHandler,
};
