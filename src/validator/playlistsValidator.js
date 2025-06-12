const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const validatePlaylistPayload = (payload) => {
  const { error } = PlaylistPayloadSchema.validate(payload);
  if (error) {
    const validationError = new Error(error.details.map(d => d.message).join(', '));
    validationError.name = 'ValidationError';
    throw validationError;
  }
};

module.exports = { validatePlaylistPayload };