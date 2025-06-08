const Joi = require('joi');
// const songSchema = require('../validator/songsValidator');
// const Song = require('./songs');

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number().optional(),
  albumId: Joi.string().optional(),
});

module.exports = { SongPayloadSchema };