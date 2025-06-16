const { nanoid } = require('nanoid');
const pool = require('../database/postgres');
const Boom = require('@hapi/boom');
//const NotFoundError = require('../NotFoundError');

const addPlaylists = async (name, owner) => {
  const id = `playlist-${nanoid(16)}`;
  await pool.query('INSERT INTO playlists (id, name, owner) VALUES ($1, $2, $3)', [id, name, owner]);
  return id;
};

const getPlaylists = async (owner) => {
  const result = await pool.query(
    `SELECT playlists.id, playlists.name, users.username
    FROM playlists
    JOIN users ON playlists.owner = users.id
    WHERE owner = $1`,
    [owner]
  );
  return result.rows;
};

const deletePlaylist = async (id, owner) => {
  const result = await pool.query(
    'DELETE FROM playlists WHERE id = $1 AND owner = $2 RETURNING id',
    [id, owner]
  );

  if (!result.rowCount) {
    throw Boom.forbidden('Anda tidak berhak menghapus playlist ini atau playlist tidak ditemukan');
  }
};

module.exports = {
  addPlaylists,
  getPlaylists,
  deletePlaylist,
};