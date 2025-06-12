const bcrypt = require('bcrypt'); 
const pool = require('../database/postgres');
//const jwt = require('jsonwebtoken');

const verifyUserCredential = async (username, password) => {
  const result = await pool.query('SELECT id, password FROM users WHERE username = $1', [username]);
  if (!result.rowCount) throw new Error('Kredensial tidak valid');

  const { id, password: hashed } = result.row[0];
  const match = await bcrypt.compare(password, hashed);
  if (!match) throw new Error('Kredensial tidak valid');

  return id;
};

const verifyRefreshTokenExistence = async (token) => {
  const result = await pool.query('SELECT token FROM authentications WHERE token = $1', [token]);
  if (!result.rowCount) {
    const error = new Error('Refresh token tidak ditemukan');
    error.name = 'InvalidToken';
    throw error;
  }
};

const deleteRefreshToken = async (token) => {
  const result = await pool.query('DELETE FROM authentications WHERE token = $1 RETURNING token', [token]);
  if (!result.rowCount) {
    const error = new Error('Refresh tokenn tidak ditemukan');
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