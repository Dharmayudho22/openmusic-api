const Hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
//const { validateSongPayload } = require('../validator/songsValidator');

dotenv.config();

const init = async() => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  //routes
  const albumRoutes = require('../routes/albums');
  const songRoutes = require('../routes/songs');
  const userRoutes = require('../routes/users');
  const authRoutes = require('../routes/authentications');
  const playlistRoute = require('../routes/playlists');
  const playlistSongRoute = require('../routes/playlistSongs');
  const collaborationRoutes = require('../routes/collaborations');
  const playlistActivityRoutes = require('../routes/playlistActivities');
  server.route([...albumRoutes, ...songRoutes, ...userRoutes, ...authRoutes, ...playlistRoute, ...playlistSongRoute, ...collaborationRoutes, ...playlistActivityRoutes]);
    
  //error
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response.isBoom) {
      if (response.output.statusCode === 404) {
        return h.response({
          status: 'fail',
          message: 'Resource tidak ditemukan',
        }).code(404);
      }

      if (response.isClientError) {
        return h.response({
          status: 'fail',
          message: response.message,
        }).code(response.output.statusCode);
      }

      console.error(response);
      return h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      }).code(500);
    }

    // Tangani error custom (seperti NotFoundError, ValidationError)
    if (response instanceof Error) {
      if (response.name === 'NotFoundError') {
        return h.response({
          status: 'fail',
          message: response.message,
        }).code(404);
      }

      if (response.name === 'ValidationError') {
        return h.response({
          status: 'fail',
          message: response.message,
        }).code(400);
      }

      console.error(response);
      return h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      }).code(500);
    }

    return h.continue;
  });

  console.log('Registered Routes:');
  server.table().forEach(route => {
    console.log(`- ${route.method.toUpperCase()} ${route.path}`);
  });

  await server.start();
  console.log(`Server will run at http://${process.env.HOST}:${process.env.PORT}`);
};

init();