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
      const statusCode = response.output.statusCode;
      const message = response.output.payload.message;
  
      if ([400, 401, 403, 404].includes(statusCode)) {
        return h.response({
          status: 'fail',
          message,
        }).code(statusCode);
      }
  
      console.error(response);
      return h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      }).code(500);
    }
  
    if (response instanceof Error) {
      const statusCode = response.statusCode || 500;
      const message = response.message || 'terjadi kegagalan';
  
      return h.response({
        status: statusCode === 500 ? 'error' : 'fail',
        message,
      }).code(statusCode);
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