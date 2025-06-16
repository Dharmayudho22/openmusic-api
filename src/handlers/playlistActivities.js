const { authenticate } = require('../auth/authMiddleware');
const { verifyPlaylistAccess } = require('../services/playlistSongs');
const { getPlaylistActivities } = require('../services/playlistActivities');
const Boom = require('@hapi/boom');

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
    if (Boom.isBoom(error)) {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(error.output.statusCode);
    }

    // const status = error.name === 'Unauthorized' ? 401 :
    //   error.name === 'Forbidden' ? 403 :
    //     error.name === 'NotFoundError' ? 404 : 500;

    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    }).code(500);
  }
};

module.exports = { getPlaylistActivitiesHandler };
