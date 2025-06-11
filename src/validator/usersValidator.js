const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().max(50).required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

const validateUserPayload = (payload) => {
  const { error } = UserPayloadSchema.validate(payload);
  if (error) {
    const validationError = new Error(error.details.map(d => d.message).join(', '));
    validationError.name = 'ValidationError';
    throw validationError;
  }
};

module.exports = { validateUserPayload };