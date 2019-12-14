const mongoose = require('mongoose');
Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: String,
  email_address: String,
  password_hash: String,
  genre: [String],
  up_votes_movies: [String],
  down_voted_movies: [String]

});

module.exports = {
  userSchema
};