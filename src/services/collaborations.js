const { nanoid } = require('nanoid');
const pool = require('../database/postgres');
//const NotFoundError = require('../NotFoundError');

const addCollaboration = async (playlistId, userId) => {
  const id = `collab-${nanoid(16)}`;
  const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
  if (!userCheck.rowCount) {
    const error = new Error('User tidak ditemukan');
    error.name = 'NotFoundError';
    throw error;
  }

  const playlistCheck = await pool.query('SELECT id FROM playlists WHERE id = $1', [playlistId]);
  if (!playlistCheck.rowCount) {
    const error = new Error('Playlist tidak ditemukan');
    error.name = 'NotFoundError';
    throw error;
  }

  await pool.query(
    'INSERT INTO collaborations (id, playlist_id, user_id) VALUES ($1, $2, $3)',
    [id, playlistId, userId]
  );
  return id;
};

const deleteCollaboration = async (playlistId, userId) => {
  const result = await pool.query(
    'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
    [playlistId, userId]
  );
  if (!result.rowCount) {
    const error = new Error('Kolaborator tidak ditemukan');
    error.name = 'NotFoundError';
    throw error;
  }
};

const isPlaylistCollaborator = async (playlistId, userId) => {
  const result = await pool.query(
    'SELECT id FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
    [playlistId, userId]
  );
  return result.rowCount > 0;
};

module.exports = {
  addCollaboration,
  deleteCollaboration,
  isPlaylistCollaborator,
};