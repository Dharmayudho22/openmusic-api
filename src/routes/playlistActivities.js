const { getPlaylistActivitiesHandler } = require('../handlers/playlistActivities');

module.exports = [
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: getPlaylistActivitiesHandler,
  },
];
