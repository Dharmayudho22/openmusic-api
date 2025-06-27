const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../NotFoundError'); 
const config = require('../utils/config');
const CacheService = require('./CacheService'); 

class AlbumLikesService {
  constructor() {
    this._pool = new Pool(config.postgres);
    this._cacheService = new CacheService(); 
  }

  async addAlbumLike(userId, albumId) {
    const albumQuery = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [albumId],
    };
    const albumResult = await this._pool.query(albumQuery);

    if (!albumResult.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const checkLikeQuery = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };
    const checkLikeResult = await this._pool.query(checkLikeQuery);

    if (checkLikeResult.rows.length > 0) {
      const deleteLikeQuery = {
        text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
        values: [userId, albumId],
      };
      const deleteResult = await this._pool.query(deleteLikeQuery);

      if (!deleteResult.rows.length) {
        throw new InvariantError('Gagal batal menyukai album');
      }
      await this._cacheService.delete(`album_likes:${albumId}`); // Invalidate cache
      return 'Batal menyukai album';
    }

    // If not liked, then like
    const id = `like-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const addLikeQuery = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, userId, albumId, createdAt],
    };
    const addResult = await this._pool.query(addLikeQuery);

    if (!addResult.rows[0].id) {
      throw new InvariantError('Gagal menyukai album');
    }
    await this._cacheService.delete(`album_likes:${albumId}`); // Invalidate cache
    return 'Menyukai album';
  }

  async getAlbumLikesCount(albumId) {
    try {
      const result = await this._cacheService.get(`album_likes:${albumId}`);
      if (result !== null) {
        return { count: result, source: 'cache' };
      }
    } catch (error) {
      console.error('Error getting album likes from cache:', error);
    }

    const query = {
      text: 'SELECT COUNT(id) AS count FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };
    const { rows } = await this._pool.query(query);

    const count = parseInt(rows[0].count, 10);
    
    await this._cacheService.set(`album_likes:${albumId}`, count.toString());

    return { count, source: 'database' };
  }

  async verifyAlbumLike(userId, albumId) {
    const query = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };
    const { rows } = await this._pool.query(query);
    return rows.length > 0;
  }
}

module.exports = AlbumLikesService;