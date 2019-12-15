'use strict';

const joi = require('joi');


const SignUpRequestSchema = joi.object({
  email_address: joi.string().email().required(),
  password: joi.string().required()
});

const GenreResponseSchema = joi.array().items(
  joi.object({
    _id: joi.string().required(),
    genre: joi.string().required()
  }));

const FavouriteGenreRequestSchema = joi.object({
  user_id: joi.string().required(),
  favourite: joi.array().items(
    joi.string()).required()
});

const FavouriteGenreResponseSchema = joi.object({
  email_address: joi.string().email().required(),
  favourite: joi.array().items(
    joi.string()).required()
});

const RecommendedMoviesRequestSchema = joi.object({
  user_id: joi.string().required()
});

const RecommendedMoviesResponseSchema = joi.object().pattern(joi.string(), joi.array().items(joi.string()));

const RequiredString = joi.string();

const ReviewResponseSchema = joi.object({
  ratings: joi.number(),
  review: joi.array().items(joi.string())

});

const ReviewRequestSchema = joi.object({
  user_id: joi.string().required(),
  movie_id: joi.string().required(),
  vote: joi.boolean().required(),
  review: joi.string().required()
})

module.exports = {
  SignUpRequestSchema,
  GenreResponseSchema,
  FavouriteGenreRequestSchema,
  FavouriteGenreResponseSchema,
  RecommendedMoviesRequestSchema,
  RecommendedMoviesResponseSchema,
  RequiredString,
  ReviewResponseSchema,
  ReviewRequestSchema
};