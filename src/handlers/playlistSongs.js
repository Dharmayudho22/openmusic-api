const {
  addSongToPlaylist,
  getSongsFromPlaylist,
  deleteSongFromPlaylist,
  verifyPlaylistAccess
} = require('../services/playlistSongs');

const { validatePlaylistSongPayload } = require('../validator/playlistSongsValidator');
const { authenticate } = require('../auth/authMiddleware');
const Boom = require('@hapi/boom');

const postSongToPlaylistHandler = async (request, h) => {
  try {
    const userId = authenticate(request);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    validatePlaylistSongPayload(request.payload);
    await verifyPlaylistAccess(playlistId, userId);
    await addSongToPlaylist(playlistId, songId, userId);

    return h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    }).code(201);
  } catch (error) {
    if (Boom.isBoom(error)) {
      return h.response({
        status: 'fail',
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

const getSongsFromPlaylistHandler = async (request, h) => {
  try {
    const userId = authenticate(request);
    const { id: playlistId } = request.params;
    await verifyPlaylistAccess(playlistId, userId);

    const playlist = await getSongsFromPlaylist(playlistId);

    return h.response({
      status: 'success',
      data: { playlist },
    });
  } catch (error) {
    if (Boom.isBoom(error)) {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(error.output.statusCode);
    }

    console.error(error);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    }).code(500);
  }
};

const deleteSongFromPlaylistHandler = async (request, h) => {
  try {
    const userId = authenticate(request);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    validatePlaylistSongPayload(request.payload);
    await verifyPlaylistAccess(playlistId, userId);
    await deleteSongFromPlaylist(playlistId, songId, userId);
  
    return h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    });
  } catch (error) {
    if (Boom.isBoom(error)) {
      return h.response({
        status: 'fail',
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
  postSongToPlaylistHandler,
  getSongsFromPlaylistHandler,
  deleteSongFromPlaylistHandler,
};
