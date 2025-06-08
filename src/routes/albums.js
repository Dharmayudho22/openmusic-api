const {
  postAlbumHandler,
  getAlbumsHandler,
  getAlbumByIdHandler,
  putAlbumByIdHandler,
  deleteAlbumByIdHandler,
} = require('../handlers/albums');

const routes = [
  {
    method: 'POST',
    path: '/albums',
    handler: postAlbumHandler,
  },
  {
    method: 'GET',
    path: '/albums',
    handler: getAlbumsHandler,
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: getAlbumByIdHandler,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: putAlbumByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: deleteAlbumByIdHandler,
  },
];

module.exports = routes;