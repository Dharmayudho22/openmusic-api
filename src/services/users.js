const { nanoid } = require('nanoid');
const bcrycpt = require('bcrypt');
const pool = require('../database/postgres');
//const NotFoundError = require('../NotFoundError');

const addUser = async ({ username, password, fullname }) => {
  const result = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
  if (result.rowCount > 0) {
    const error = new error('Username sudah digunakan');
    error.name = 'ValidationError';
    throw error;
  }

  const id = `user-${nanoid(16)}`;
  const hashedPassword = await bcrycpt.hash(password, 10);

  await pool.query(
    'INSET INTO users (id, username, password, fullname) VALUES ($1, $2, $3, $4)',
    [id, username, hashedPassword, fullname]
  );

  return id;
};

module.exports = { addUser };