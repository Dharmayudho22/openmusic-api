const { validateUserPayload } = require('../validator/usersValidator');
const { addUser } = require('../services/users');

const postUserHandler = async (request, h) => {
  try {
    validateUserPayload(request.payload);

    const userId = await addUser(request.payload);

    return h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: { userId },
    }).code(201);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(400);
    }
   
    console.error(error);
    return h.response({
      status: 'error',
      message: 'Gagal menambahkan user.',
    }).code(500);
  }
};

module.exports = { postUserHandler };