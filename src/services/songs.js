const pool = require('../database/postgres');
const NotFoundError = require('../NotFoundError');

const getAllSongs = async (title, performer) => {
  let query = 'SELECT id, title, performer FROM songs';
  const values = [];
  if (title && performer) {
    query += ' WHERE title ILIKE $1 AND performer ILIKE $2';
    values.push(`%${title}%`, `%${performer}%`);
  } else if (title) {
    query += ' WHERE title ILIKE $1';
    values.push(`%${title}%`);
  } else if (performer) {
    query += ' WHERE performer ILIKE $1';
    values.push(`%${performer}%`);
  }
  const result = await pool.query(query, values);
  return result.rows;
};


const getSongById = async (id) => {
  const result = await pool.query('SELECT * FROM songs WHERE id = $1', [id]);
  if (!result.rowCount) throw new NotFoundError('Lagu tidak ditemukan');
  return result.rows[0];    
};

const addSong = async (payload) => {
  const { title, year, performer, genre, duration, albumId } = payload;
  const id = payload.id || `song-${Math.random().toString(36).substring(2, 16)}`;

  if (albumId) {
    const result = await pool.query('SELECT id FROM albums WHERE id = $1', [albumId]);
    if (!result.rowCount) {
      const error = new Error('Album tidak ditemukan');
      error.name = 'NotFoundError';
      throw error;
    }
  }

  await pool.query(
    'INSERT INTO songs (id, title, year, performer, genre, duration, album_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [id, title, year, performer, genre, duration, albumId || null]
  );
  return id;
};

const editSongById = async (id, payload) => {
  const { title, year, performer, genre, duration, album_id } = payload; 
  const result = await pool.query(
    'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
    [title, year, performer, genre, duration, album_id || null, id]
  );
  if (!result.rowCount) throw new NotFoundError('Gagal memperbarui. Id tidak ditemukan');
  return true;
};
  
const deleteSongById = async (id) => {
  const result = await pool.query(
    'DELETE FROM songs WHERE id = $1 RETURNING id',
    [id]
  );
  if (!result.rowCount) throw new NotFoundError('Gagal menghapus. Id tidak ditemukan');
  return true;
};
  
module.exports = {
  getAllSongs,
  getSongById,
  addSong,
  editSongById,
  deleteSongById,
};