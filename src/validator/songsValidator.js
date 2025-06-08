const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number().optional(),
  album_id: Joi.string().optional(),
});

const validateSongPayload = (payload) => {
  const { error } = SongPayloadSchema.validate(payload);
  if (error) {
    const validationError = new Error(error.details.map(detail => detail.message).join(', '));
    validationError.name = 'ValidationError';
    throw validationError;
  }
};

module.exports = { validateSongPayload };
