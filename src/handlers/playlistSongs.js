const {
  verifyPlaylistOwner,
  addSongToPlaylist,
  getSongsFromPlaylist,
  deleteSongFromPlaylist
} = require('../services/playlistSong');

const { validatePlaylistSongPayload } = require('../validator/playlistSongsValidator');
const { authenticate } = require('../auth/authMiddleware');

const postSongToPlaylistHandler = async (request, h) => {
  try {
    const userId = authenticate(request);
    const { id: playlistId } = request.params;
    validatePlaylistSongPayload(request.payload);
    await verifyPlaylistOwner(playlistId, userId);
    await addSongToPlaylist(playlistId, request.payload.songId);

    return h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    }).code(201);
  } catch (error) {
    const status = error.name === 'ValidationError' ? 400 :
      error.name === 'Forbidden' ? 403 :
        error.name === 'Unauthorized' ? 401 :
          error.name === 'NotFoundError' ? 404 : 500;
    return h.response({
      status: 'fail',
      message: error.message
    }).code(status);
  }
};

const getSongsFromPlaylistHandler = async (request, h) => {
  try {
    const userId = authenticate(request);
    const { id: playlistId } = request.params;
    await verifyPlaylistOwner(playlistId, userId);

    const playlist = await getSongsFromPlaylist(playlistId);

    return h.response({
      status: 'success',
      data: { playlist },
    });
  } catch (error) {
    const status = error.name === 'Forbiddan' ? 403 :
      error.name === 'Unauthorized' ? 401 : 
        error.name === 'NotFoundError' ? 404 : 500;
    return h.response({
      status: 'fail', 
      message: error.message
    }).code(status);
  }
};

const deleteSongFromPlaylistHandler = async (request, h) => {
  try {
    const userId = authenticate(request);
    const { id: playlistId } = request.params;
    validatePlaylistSongPayload(request.payload);
    await verifyPlaylistOwner(playlistId, userId);
    await deleteSongFromPlaylist(playlistId, request.payload.songId);
  
    return h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    });
  } catch (error) {
    const status = error.name === 'ValidationError' ? 400 :
      error.name === 'Forbidden' ? 403 :
        error.name === 'Unauthorized' ? 401 :
          error.name === 'NotFoundError' ? 404 : 500;
    return h.response({ 
      status: 'fail', 
      message: error.message 
    }).code(status);
  }
};
  
module.exports = {
  postSongToPlaylistHandler,
  getSongsFromPlaylistHandler,
  deleteSongFromPlaylistHandler,
};
