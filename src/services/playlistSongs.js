const { nanoid } = require('nanoid');
const pool = require('../database/postgres');
const NotFoundError = require('../NotFoundError');
const { isPlaylistCollaborator } = require('./collaborations');
const { logActivity } = require('./playlistActivities');

const verifyPlaylistOwner = async (playlistId, userId) => {
  const result = await pool.query('SELECT owner FROM playlists WHERE id = $1', [playlistId]);
  if (!result.rowCount) throw new NotFoundError('Playlist tidak ditemukan');

  if (result.rows[0].owner !== userId) {
    const error = new Error('Anda tidak berhak mengakses resource ini');
    error.name = 'Forbidden';
    throw error;
  }
};

const verifyPlaylistAccess = async (playlistId, userId) => {
  try {
    await verifyPlaylistOwner(playlistId, userId);
  } catch (error) {
    if (error instanceof NotFoundError) throw error;

    const isCollab = await isPlaylistCollaborator(playlistId, userId);
    if (!isCollab) {
      const forbiddenError = new Error('Anda tidak punya akses ke playlist ini');
      forbiddenError.name = 'Forbidden';
      throw forbiddenError;
    }
  }
};

const addSongToPlaylist = async (playlistId, songId, userId) => {
  const songsResult = await pool.query('SELECT id FROM songs WHERE id = $1', [songId]);
  if (!songsResult.rowCount) throw new NotFoundError('Lagu tidak ditemukan');

  const id = `psong-${nanoid(16)}`;
  await pool.query(
    'INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES ($1, $2, $3)',
    [id, playlistId, songId]
  );  

  await logActivity(playlistId, songId, userId, 'add');
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
  
const deleteSongFromPlaylist = async (playlistId, songId, userId) => {
  const result = await pool.query(
    'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
    [playlistId, songId]
  );

  if (!result.rowCount) {
    const error = new Error('Lagu tidak ditemukan di playlist');
    error.name = 'NotFoundError';
    throw error;
  }

  await logActivity(playlistId, songId, userId, 'delete');
};
  
module.exports = {
  verifyPlaylistAccess,
  addSongToPlaylist,
  getSongsFromPlaylist,
  deleteSongFromPlaylist,
};
