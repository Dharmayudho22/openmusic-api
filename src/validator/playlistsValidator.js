const Joi = require('joi');
const Boom = require('@hapi/boom');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const validatePlaylistPayload = (payload) => {
  const { error } = PlaylistPayloadSchema.validate(payload);
  if (error) {
    throw Boom.badRequest(error.details.map(d => d.message).join(', '));
  }
};

module.exports = { validatePlaylistPayload };