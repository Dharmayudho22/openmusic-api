const { nanoid } = require('nanoid');
const pool = require('../database/postgres');
const Boom = require('@hapi/boom');

class PlaylistsService {
  async addPlaylists(name, owner) {
    const id = `playlist-${nanoid(16)}`;
    await pool.query('INSERT INTO playlists (id, name, owner) VALUES ($1, $2, $3)', [id, name, owner]);
    return id;
  }

  async getPlaylists(owner) {
    const result = await pool.query(
      `SELECT playlists.id, playlists.name, users.username
       FROM playlists
       JOIN users ON playlists.owner = users.id
       WHERE owner = $1`,
      [owner]
    );
    return result.rows;
  }

  async deletePlaylist(id, owner) {
    const result = await pool.query(
      'DELETE FROM playlists WHERE id = $1 AND owner = $2 RETURNING id',
      [id, owner]
    );
    if (!result.rowCount) {
      throw Boom.forbidden('Anda tidak berhak menghapus playlist ini atau playlist tidak ditemukan');
    }
  }

  async getPlaylistDetailForExport(playlistId) {
    const result = await pool.query(
      `SELECT playlists.id, playlists.name, users.username, songs.id as song_id, songs.title, songs.performer
       FROM playlists
       JOIN users ON playlists.owner = users.id
       LEFT JOIN playlist_songs ON playlists.id = playlist_songs.playlist_id
       LEFT JOIN songs ON songs.id = playlist_songs.song_id
       WHERE playlists.id = $1`,
      [playlistId]
    );

    if (!result.rows.length) {
      throw Boom.notFound('Playlist tidak ditemukan');
    }

    const { id, name, username } = result.rows[0];
    const songs = result.rows
      .filter((row) => row.song_id)
      .map((row) => ({
        id: row.song_id,
        title: row.title,
        performer: row.performer,
      }));

    return {
      id,
      name,
      username,
      songs,
    };
  }
}

module.exports = PlaylistsService;
