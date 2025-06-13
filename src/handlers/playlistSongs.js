const {
  //verifyPlaylistOwner,
  addSongToPlaylist,
  getSongsFromPlaylist,
  deleteSongFromPlaylist,
  verifyPlaylistAccess
} = require('../services/playlistSong');

const { validatePlaylistSongPayload } = require('../validator/playlistSongsValidator');
const { authenticate } = require('../auth/authMiddleware');

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
    await verifyPlaylistAccess(playlistId, userId);

    const playlist = await getSongsFromPlaylist(playlistId);

    return h.response({
      status: 'success',
      data: { playlist },
    });
  } catch (error) {
    const status = error.name === 'Forbidden' ? 403 :
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
    const { songId } = request.payload;

    validatePlaylistSongPayload(request.payload);
    await verifyPlaylistAccess(playlistId, userId);
    await deleteSongFromPlaylist(playlistId, songId, userId);
  
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
