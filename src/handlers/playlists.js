const { validatePlaylistPayload } = require('../validator/playlistsValidator');
const { addPlaylist, getPlaylists, deletePlaylist } = require('../services/playlists');
const { authenticate } = require('../auth/authMiddleware');

const postPlaylistHandler = async (request, h) => {
  try {
    const userId = authenticate(request);
    validatePlaylistPayload(request.payload);
  
    const playlistId = await addPlaylist(request.payload.name, userId);
    return h.response({
      status: 'success',
      message: 'Playlist berhasil dibuat',
      data: { playlistId },
    }).code(201);
  } catch (error) {
    const isClient = ['ValidationError', 'Unauthorized'].includes(error.name);
    return h.response({
      status: 'fail',
      message: error.message,
    }).code(isClient ? 400 : 500);
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
    return h.response({
      status: 'fail',
      message: error.message,
    }).code(error.name === 'Unauthorized' ? 401 : 500);
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
    const status = error.name === 'Forbidden' ? 403 : error.name === 'Unauthorized' ? 401 : 500;
    return h.response({
      status: 'fail',
      message: error.message,
    }).code(status);
  }
};
  
module.exports = {
  postPlaylistHandler,
  getPlaylistsHandler,
  deletePlaylistHandler,
};