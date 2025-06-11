const { nanoid } = require('nanoid');
const { validateSongPayload } = require('../validator/songsValidator');
const NotFoundError = require('../NotFoundError');
const {
  getAllSongs,
  getSongById,
  addSong,
  editSongById,
  deleteSongById,
} = require('../services/songs');
//const { message } = require('../validator/songsValidator');

const songsHandler = {
  async postSongHandler(request, h) {
    try {
      const payload = request.payload;
      validateSongPayload(payload);

      const id = `song-${nanoid(16)}`;
      await addSong({ ...payload, id });

      return h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: { songId: id },
      }).code(201);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(400);
      }

      console.error(error);
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(500);
    }
  },

  async getSongsHandler(request, h) {
    try {
      const { title, performer } = request.query;
      const songs = await getAllSongs(title, performer);
      return h.response({
        status: 'success',
        data: { songs },
      });
    } catch (error) {
      console.error(error);
      return h.response({
        status: 'error',
        message: 'Gagal mengambil data lagu.',
      }).code(500);
    }
  },

  async getSongByIdHandler(request, h) {
    try {
      const song = await getSongById(request.params.id);
      if (!song) {
        return h.response({
          status: 'fail',
          message: 'Lagu tidak ditemukan',
        }).code(404);
      }
      return h.response({
        status: 'success',
        data: { song },
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
        message: 'Gagal mengambil data lagu.',
      }).code(500);
    }
  },

  async putSongByIdHandler(request, h) {
    try {
      const payload = request.payload;
      validateSongPayload(payload);
      const updated = await editSongById(request.params.id, payload);
      if (!updated) {
        return h.response({
          status: 'fail',
          message: 'Gagal memperbarui lagu. Id tidak ditemukan',
        }).code(404);
      }
      return {
        status: 'success',
        message: 'Lagu berhasil diperbarui',
      };
    } catch (error) {
      if (error.name === 'ValidationError') {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(400);
      }
      if (error instanceof NotFoundError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(404);
      }
      console.error(error);
      return h.response({
        status: 'error',
        message: 'Gagal memperbarui lagu.',
      }).code(500);
    }
  },

  async deleteSongByIdHandler(request, h) {
    try {
      const deleted = await deleteSongById(request.params.id);
      if (!deleted) {
        return h.response({
          status: 'fail',
          message: 'Gagal menghapus lagu. Id tidak ditemukan',
        }).code(404);
      }
      return {
        status: 'success',
        message: 'Lagu berhasil dihapus',
      };
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
        message: 'Gagal menghapus lagu.',
      }).code(500);
    }
  },
};

module.exports = songsHandler;
