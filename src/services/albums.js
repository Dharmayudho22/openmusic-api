const pool = require('../database/postgres');
const NotFoundError = require('../NotFoundError');

const getAllAlbums = async () => {
  const result = await pool.query('SELECT * FROM albums');
  return result.rows;
};

const getAlbumById = async (id) => {
  const albumResult = await pool.query('SELECT * FROM albums WHERE id = $1', [id]);
  
  if (!albumResult.rowCount) {
    throw new NotFoundError('Album tidak ditemukan');
  }
  
  const songsResult = await pool.query(
    'SELECT id, title, performer FROM songs WHERE album_id = $1',
    [id]
  );
  
  return {
    ...albumResult.rows[0],
    songs: songsResult.rows,
  };
};  

const addAlbum = async (payload) => {
  const { name, year } = payload;
  const id = `album-${Math.random().toString(36).substring(2, 18)}`;
  await pool.query('INSERT INTO albums (id, name, year) VALUES ($1, $2, $3)', [id, name, year]);
  return id;
};

const editAlbumById = async (id, payload) => {
  const { name, year } = payload;
  const result = await pool.query(
    'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
    [name, year, id]
  );
  return result.rowCount > 0;
};
  
const deleteAlbumById = async (id) => {
  const result = await pool.query(
    'DELETE FROM albums WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rowCount > 0;
};
  

const getAlbumWithSongs = async (id) => {
  const albumResult = await pool.query('SELECT * FROM albums WHERE id = $1', [id]);
  const album = albumResult.rows[0];
  if (!album) return null;
  const songsResult = await pool.query(
    'SELECT id, title, performer FROM songs WHERE album_id = $1',
    [id]
  );
  album.songs = songsResult.rows;
  return album;
};

module.exports = {
  getAllAlbums,
  getAlbumById,
  addAlbum,
  editAlbumById,
  deleteAlbumById,
  getAlbumWithSongs,
};