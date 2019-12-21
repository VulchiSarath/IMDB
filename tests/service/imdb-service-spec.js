'use strict';

const _ = require('lodash');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;
var beforeEach = mocha.beforeEach;
const assert = require('assert');
const uuid = require('uuid');
const config = {
  "jwt": {
    "expiry": 3600,
    "refresh": 0,
    "secret": "NzMwNWQ5NDMtOWUzYy00MjRhLTk1ODYtZjFlNTJkNjcyNmI0"
  },
  "mongoose": {
    "connectionstring_imdb": "mongodb://localhost:27017/imdb",
    "poolSize": 5
  }
};
const mongoose = require('../../base-lib/mongoose-db');
const UserDBAccessor = require('../../lib/db-accessor/user-db-accessor');
const GenreDBAccessor = require('../../lib/db-accessor/genre-db-accessor');
const MovieDBAccessor = require('../../lib/db-accessor/movie-db-accessor');
const dependencies = {
  db: mongoose.createConnection(config.mongoose.connectionstring_imdb)
};

describe('imdb Service Test,', async () => {
  let userDBAccessor,
    genreDBAccessor,
    movieDBAccessor,
    configs;
  beforeEach('Stub data', () => {
    try {
      configs = _.cloneDeep(config);
      userDBAccessor = new UserDBAccessor(dependencies, configs);
      genreDBAccessor = new GenreDBAccessor(dependencies, configs);
      movieDBAccessor = new MovieDBAccessor(dependencies, configs);
    } catch (error) {
      throw error;
    }
  });
  it('User signUp and validation', async () => {
    try {
      let user_info = {
        email_address: "test@gmail.com",
        password_hash: "$2b$10$x5RMRCPJflZLgNs4z1A6vOF9bX4zQ1THFkDXyHBou5lpGqjKtYPPa",
        _id: uuid.v4()
      }
      await userDBAccessor.deleteData({ email_address: user_info.email_address });
      const userData = await userDBAccessor.save(user_info);
      const user = userData.toObject();
      assert.equal(user_info.email_address, user.email_address);
    } catch (error) {
      throw error;
    }
  });

  it('User signIN', async () => {
    try {
      let user_info = {
        email_address: "test@gmail.com",
      }
      const user = await userDBAccessor.filter({ email_address: user_info.email_address });
      assert.equal(user.length, 1);
    } catch (error) {
      throw error;
    }
  });

  it('User signIN', async () => {
    try {
      let user_info = {
        email_address: "test@gmail.com",
      }
      const user = await userDBAccessor.filter({ email_address: user_info.email_address });
      assert.equal(user.length, 1);
    } catch (error) {
      throw error;
    }
  });

  it('Genre and recommended movies', async () => {
    try {
      const email_address = "test@gmail.com",
        favourite = ["Action", "Thriller"];
      const user_info = await userDBAccessor.filter({ email_address: email_address });
      const genres = await genreDBAccessor.findByIn(favourite);
      await userDBAccessor.findOneAndUpdate({ _id: user_info[0]._id }, { genres: _.map(genres, '_id') });
      const userDetail = await userDBAccessor.filter({ email_address: email_address });
      assert.equal(userDetail[0].email_address, email_address);
      assert.equal(userDetail[0].genres.length, 2);
      for(let i=0; i < genres.length; i++){
        await movieDBAccessor.findSortAndLimit({ genre_id: genres[i] });
        assert.ok(true);
      }
    } catch (error) {
      throw error;
    }
  });

});
