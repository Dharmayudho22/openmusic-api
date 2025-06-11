const { AlbumPayloadSchema } = require('../models/album-model');
const NotFoundError = require('../NotFoundError');
const {
  getAllAlbums,
  //getAlbumById,
  addAlbum,
  editAlbumById,
  deleteAlbumById,
  getAlbumWithSongs,
} = require('../services/albums');

const postAlbumHandler = async (request, h) => {
  const validation = AlbumPayloadSchema.validate(request.payload);
  if (validation.error) {
    return h.response({
      status: 'fail',
      message: validation.error.message,
    }).code(400);
  }

  const id = await addAlbum(request.payload);
  return h.response({
    status: 'success',
    data: { albumId: id },
  }).code(201);
};

const getAlbumsHandler = async (_request, h) => {
  const albums = await getAllAlbums();
  return h.response({
    status: 'success',
    data: { albums },
  });
};

const getAlbumByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;
    const album = await getAlbumWithSongs(id); 
    if (!album) {
      return h.response({
        status: 'fail',
        message: 'Album tidak ditemukan',
      }).code(404);
    }
    return h.response({
      status: 'success',
      data: { album },
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(404);
    }
    console.error(error);
    return h.response({
      status: 'error',
      message: 'Maaf, terjadi kegagalan pada server kami.',
    }).code(500);
  }
};

const putAlbumByIdHandler = async (request, h) => {
  const validation = AlbumPayloadSchema.validate(request.payload);
  if (validation.error) {
    return h.response({
      status: 'fail',
      message: validation.error.message,
    }).code(400);
  }

  const updated = await editAlbumById(request.params.id, request.payload);
  if (!updated) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui album. Id tidak ditemukan',
    }).code(404);
  }

  return h.response({
    status: 'success',
    message: 'Album berhasil diperbarui',
  });
};

const deleteAlbumByIdHandler = async (request, h) => {
  const deleted = await deleteAlbumById(request.params.id);
  if (!deleted) {
    return h.response({
      status: 'fail',
      message: 'Gagal menghapus album. Id tidak ditemukan',
    }).code(404);
  }

  return h.response({
    status: 'success',
    message: 'Album berhasil dihapus',
  });
};

module.exports = {
  postAlbumHandler,
  getAlbumsHandler,
  getAlbumByIdHandler,
  putAlbumByIdHandler,
  deleteAlbumByIdHandler,
};