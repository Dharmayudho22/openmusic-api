const { authenticate } = require('../auth/authMiddleware');
const { verifyPlaylistAccess } = require('../services/playlistSongs');
const { getPlaylistActivities } = require('../services/playlistActivities');

const getPlaylistActivitiesHandler = async (request, h) => {
  try {
    const userId = authenticate(request);
    const { id: playlistId } = request.params;

    await verifyPlaylistAccess(playlistId, userId);

    const activities = await getPlaylistActivities(playlistId);

    return h.response({
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    });
  } catch (error) {
    const status = error.name === 'Unauthorized' ? 401 :
      error.name === 'Forbidden' ? 403 :
        error.name === 'NotFoundError' ? 404 : 500;

    return h.response({
      status: 'fail',
      message: error.message,
    }).code(status);
  }
};

module.exports = { getPlaylistActivitiesHandler };
