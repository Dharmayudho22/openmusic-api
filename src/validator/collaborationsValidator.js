const Joi = require('joi');

const CollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

const validateCollaborationPayload = (payload) => {
  const { error } = CollaborationPayloadSchema.validate(payload);
  if (error) {
    const validationError = new Error(error.details.map(d => d.message).join(', '));
    validationError.name = 'ValidationError';
    throw validationError;
  }
};

module.exports = { validateCollaborationPayload };