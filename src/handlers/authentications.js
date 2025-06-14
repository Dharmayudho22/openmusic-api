const { 
  validateAuthPayload,
  validateRefreshTokenPayload 
} = require('../validator/authenticationsValidator');

const {
  verifyUserCredential,
  saveRefreshToken,
  verifyRefreshTokenExistence,
  deleteRefreshToken,
} = require('../services/authentications');
const tokenManager = require('../tokenize/tokenManager');
//const { valid } = require('joi');
//const { validateUserPayload } = require('../validator/usersValidator');
//const { addUser } = require('../services/users');
//const { postUserHandler } = require('./users');

const postAuthenticationHandler = async (request, h) => {
  try {
    validateAuthPayload(request.payload);

    const { username, password } = request.payload;
    const userId = await verifyUserCredential(username, password);

    const accessToken = tokenManager.generateAccessToken({ userId });
    const refreshToken = tokenManager.generateRefreshToken({ userId });

    await saveRefreshToken(refreshToken);

    return h.response({
      status: 'success',
      message: 'Authentication berhasil',
      data: {
        accessToken,
        refreshToken,
      },
    }).code(201);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return h.response({ status: 'fail', message: error.message }).code(400);
    }
    if (error.name === 'InvalidToken') {
      return h.response({ status: 'fail', message: error.message }).code(400);
    }
    if (error.name === 'AuthenticationError') {
      return h.response({ status: 'fail', message: error.message }).code(401);
    }    
  
    //untuk error tak terduga
    console.error(error); //error bisa dilihat jika ada kesalahan
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    }).code(500);
  }
};

const putAuthenticationHandler = async (request, h) => {
  try {
    validateRefreshTokenPayload(request.payload);
    const { refreshToken } = request.payload;

    await verifyRefreshTokenExistence(refreshToken);
    const { userId } = tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = tokenManager.generateAccessToken({ userId });

    return h.response({
      status: 'success',
      message: 'Access token berhasil diperbarui',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    if (error.name === 'InvalidToken') {
      return h.response({ status: 'fail', message: error.message }).code(400);
    }
    if (error.name === 'ValidationError') {
      return h.response({ status: 'fail', message: error.message }).code(400);
    }
  
    //untuk error tak terduga
    console.error(error); //error bisa dilihat jika ada kesalahan
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    }).code(500);
  }
};

const deleteAuthenticationHandler = async (request, h) => {
  try {
    validateRefreshTokenPayload(request.payload);
    const { refreshToken } = request.payload;
  
    await verifyRefreshTokenExistence(refreshToken);
    await deleteRefreshToken(refreshToken);
  
    return h.response({
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return h.response({ status: 'fail', message: error.message }).code(400);
    }
    if (error.name === 'InvalidToken') {
      return h.response({ status: 'fail', message: error.message }).code(400);
    }
    if (error.name === 'AuthenticationError') {
      return h.response({ status: 'fail', message: error.message }).code(401);
    }  
  
    //untuk error tak terduga
    console.error(error); //error bisa dilihat jika ada kesalahan
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    }).code(500);
  }
};

module.exports = { 
  postAuthenticationHandler,
  putAuthenticationHandler,
  deleteAuthenticationHandler,
};