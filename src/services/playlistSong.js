const { nanoid } = require('nanoid');
const pool = require('../database/postgres');
const NotFoundError = require('../NotFoundError');

const verifyPlaylistOwner = async (playlissId, userId) => {
  const result = await pool.query('SELECT owner FROM playlists WHERE id = $1', [playlissId]);
  if (!result.rowCount) throw new NotFoundError('Playlist tidak ditemukan');
  if (result.rows[0].owner !== userId) {
    const error = new Error('Anda tidak berhak mengakses resurce ini');
    error.name = 'Forbidden';
    throw error;
  }
};

const addSongToPlaylist = async (playlistId, songId) => {
  const songsResult = await pool.query('SELECT id FROM songs WHERE id = $1', [songId]);
  if (!songsResult.rowCount) throw new NotFoundError('Lagu tidak ditemukan');

  const id = `psong-${nanoid(16)}`;
  await pool.query(
    'INSERT INTO playlist_songs (id, plyalist_id, song_id) VALUES ($1, $2, $3)',
    [id, playlistId, songId]
  );
};

const getSongsFromPlaylist = async (playlistId) => {
  const playlistResult = await pool.query(
    `SELECT playlists.id, playlists.name, users.username
       FROM playlists
       JOIN users ON playlists.owner = users.id
       WHERE playlists.id = $1`, [playlistId]);
  
  if (!playlistResult.rowCount) throw new NotFoundError('Playlist tidak ditemukan');
  
  const songsResult = await pool.query(
    `SELECT songs.id, songs.title, songs.performer
       FROM playlist_songs
       JOIN songs ON songs.id = playlist_songs.song_id
       WHERE playlist_songs.playlist_id = $1`,
    [playlistId]
  );
  
  return {
    ...playlistResult.rows[0],
    songs: songsResult.rows,
  };
};
  
const deleteSongFromPlaylist = async (playlistId, songId) => {
  const result = await pool.query(
    'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
    [playlistId, songId]
  );
  if (!result.rowCount) {
    const error = new Error('Lagu tidak ditemukan di playlist');
    error.name = 'NotFoundError';
    throw error;
  }
};
  
module.exports = {
  verifyPlaylistOwner,
  addSongToPlaylist,
  getSongsFromPlaylist,
  deleteSongFromPlaylist,
};
