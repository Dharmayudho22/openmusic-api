const Joi = require('joi');

const AUthPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const RefreshTokenScema = Joi.object({
  refreshToken: Joi.string().require(),
});

const validateAuthPayload = (payload) => {
  const { error } = AUthPayloadSchema.validate(payload);
  if (error) {
    const validationError = new Error(error.details.map(d => d.message).join(', '));
    validationError.name = 'ValidationError';
    throw validationError;
  }
};

const validateRefreshTokenPayload = (payload) => {
  const { error } = RefreshTokenScema.validate(payload);
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