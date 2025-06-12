const Joi = require('joi');

const PlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const validatePlaylistSongPayload = (payload) => {
  const { error } = PlaylistSongPayloadSchema.validate(payload);
  if (error) {
    const validationError = new Error(error.details.map(d => d.message).join(', '));
    validationError.name = 'ValidationError';
    throw validationError;
  }
};

module.exports = { validatePlaylistSongPayload };