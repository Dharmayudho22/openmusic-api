const bcrypt = require('bcrypt'); 
const pool = require('../database/postgres');
//const jwt = require('jsonwebtoken');

const verifyUserCredential = async (username, password) => {
  const result = await pool.query('SELECT id, password FROM users WHERE username = $1', [username]);
  
  if (!result.rowCount) {
    const error = new Error('Kredensial tidak valid');
    error.name = 'AuthenticationError';
    throw error;
  }

  const { id, password: hashedPassword } = result.rows[0];
  const match = await bcrypt.compare(password, hashedPassword);
  if (!match) {
    const error = new Error('Kredensial tidak valid');
    error.name = 'AuthenticationError';
    throw error;
  }

  return id;
};

const verifyRefreshTokenExistence = async (token) => {
  const result = await pool.query('SELECT token FROM authentications WHERE token = $1', [token]);
  if (!result.rowCount) {
    const error = new Error('Refresh token tidak valid');
    error.name = 'InvalidToken';
    throw error;
  }
};

const deleteRefreshToken = async (token) => {
  const result = await pool.query('DELETE FROM authentications WHERE token = $1 RETURNING token', [token]);
  if (!result.rowCount) {
    const error = new Error('Refresh token tidak ditemukan');
    error.name = 'InvalidToken';
    throw error;
  }
};

const saveRefreshToken = async (token) => {
  await pool.query('INSERT INTO authentications (token) VALUES ($1)', [token]);
};

module.exports = {
  verifyUserCredential,
  saveRefreshToken,
  verifyRefreshTokenExistence,
  deleteRefreshToken,
};
