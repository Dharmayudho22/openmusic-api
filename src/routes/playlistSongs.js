const {
  postSongToPlaylistHandler,
  getSongsFromPlaylisthander,
  deleteSongFromPlaylistHandler,
} = require('../handlers/playlistSongs');

module.exports = [
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: postSongToPlaylistHandler,
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: getSongsFromPlaylisthander,
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: deleteSongFromPlaylistHandler,
  },
];