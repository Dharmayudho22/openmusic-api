const Joi = require('joi');

const AuthPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const RefreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const validateAuthPayload = (payload) => {
  const { error } = AuthPayloadSchema.validate(payload);
  if (error) {
    const validationError = new Error(error.details.map(d => d.message).join(', '));
    validationError.name = 'ValidationError';
    throw validationError;
  }
};

const validateRefreshTokenPayload = (payload) => {
  const { error } = RefreshTokenSchema.validate(payload);
  if (error) {
    const validationError = new Error(error.details.map(d => d.message).join(', '));
    validationError.name = 'ValidationError';
    throw validationError;
  }
};

module.exports = { 
  validateAuthPayload,
  validateRefreshTokenPayload, 
};
