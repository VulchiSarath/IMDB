const mongoose = require('mongoose');
Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: String,
  email_address: String,
  password_hash: String,
  genres: [String],
  up_votes_movies: [String],
  down_voted_movies: [String],
  created_date: { type: Date, default: Date.now }

});

const genreSchema = new Schema({
  _id: String,
  genre: String
});

const movieSchema = new Schema({
  _id: String,
  name: String,
  genre_id: String,
  release_date: { type: Date, default: Date.now },
  up_votes: Number,
  down_votes: Number
});

const reviewSchema = new Schema({
  _id: String,
  movie_id: String,
  user_id: String,
  review: String,
  vote: Boolean
})

module.exports = {
  userSchema,
  genreSchema,
  movieSchema,
  reviewSchema
};