const {
  postPlaylistHandler,
  getPlaylistsHandler,
  deletePlaylistHandler,
} = require('../handlers/playlists');
  
module.exports = [
  {
    method: 'POST',
    path: '/playlists',
    handler: postPlaylistHandler,
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: getPlaylistsHandler,
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: deletePlaylistHandler,
  },
];
  