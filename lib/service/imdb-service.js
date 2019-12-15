'use strict'

const BaseAppLoader = require('../../base-app-loader'),
  UserDBAccessor = require('../db-accessor/user-db-accessor'),
  GenreDBAccessor = require('../db-accessor/genre-db-accessor'),
  MovieDBAccessor = require('../db-accessor/movie-db-accessor'),
  ReviewDBAccessor = require('../db-accessor/review-db-accessor'),
  Errors = require('../common/errors'),
  Success = require('../common/success'),
  Bcrypt = require('../common/helpers/bcrypt'),
  uuid = require('uuid'),
  Jwt = require('../common/helpers/jwt-token'),
  _ = require('lodash');

class IMDbService extends BaseAppLoader {
  constructor(dependencies, config, requestContext) {
    super(dependencies, config, requestContext);
    this.userDBAccessor = new UserDBAccessor(dependencies, config);
    this.genreDBAccessor = new GenreDBAccessor(dependencies, config);
    this.movieDBAccessor = new MovieDBAccessor(dependencies, config);
    this.reviewDBAccessor = new ReviewDBAccessor(dependencies, config);
    this.jwt = new Jwt(dependencies, config);
  }

  async signUp(payload) {
    const me = this;
    try {
      const options = { email_address: payload.email_address };
      const user = await me.userDBAccessor.filter(options);
      if (user.length > 0) {
        throw Errors.emailAlreadyExists;
      }
      const password_hash = await Bcrypt.encryptPayload(payload.password);
      payload.password_hash = password_hash;
      payload._id = uuid.v4();
      await me.userDBAccessor.save(payload);
      const token = await me.jwt.sign({ email: payload.email_address, password: payload.password_hash });
      return _.merge(Success.userCreatedSuccessfully, { token: token });
    } catch (error) {
      throw error;
    }
  }

  async signIn(payload) {
    const me = this;
    try {
      const options = { email_address: payload.email_address };
      const user = await me.userDBAccessor.filter(options);
      if (user.length > 0) {
        const passwordHash = _.get(user, '0.password_hash');
        await Bcrypt.hashCompare(payload, passwordHash);
        const token = await me.jwt.sign({ email: payload.email_address, password_hash: passwordHash });
        return _.merge(Success.userLoggedIn, { token: token });
      }
      throw Errors.invalidUser;

    } catch (error) {
      throw error;
    }
  }

  async genre() {
    const me = this;
    try {
      //await me.genreDBAccessor.save({ _id: "086ea138-f962-4c1b-84f3-cd5d11bb8c91", genre: "science" });
      return await me.genreDBAccessor.filter();
    } catch (error) {
      throw error;
    }
  }

  async favouriteGenre(payload) {
    const me = this;
    try {
      const user = await me.userDBAccessor.filter({ _id: payload.user_id });
      if (user.length > 0) {
        const genres = await me.genreDBAccessor.findByIn(payload.favourite);
        await me.userDBAccessor.findOneAndUpdate({ _id: payload.user_id }, { genres: _.map(genres, '_id') });
        const response = {
          email_address: user[0].email_address,
          favourite: _.map(genres, 'genre')
        }
        return response;
      }
      throw Errors.invalidUser;
    } catch (error) {
      throw error;
    }
  }

  async recommendedMovies(user_id) {
    const me = this;
    try {
      const user = await me.userDBAccessor.filter({ _id: user_id });
      const genres = _.get(user, '0.genres');
      const result = {};
      for (let i = 0; i < genres.length; i++) {
        let genre = await me.genreDBAccessor.filter({ _id: genres[i] });
        let movies = await me.movieDBAccessor.findSortAndLimit({ genre_id: genres[i] });
        if (movies.length > 0) {
          result[_.get(genre, '0.genre')] = _.map(movies, 'name');
        }
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getReview(movie_id) {
    const me = this;
    try {
      const movie = await me.movieDBAccessor.filter({ _id: movie_id });
      const review = await me.reviewDBAccessor.filter({ movie_id: movie_id });
      const ratings = (movie[0].up_votes) / (movie[0].up_votes + movie[0].down_votes);
      const result = {
        ratings: (ratings * 10).toFixed(2),
        review: _.map(review, 'review')
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async review(payload) {
    const me = this;
    try {
      payload._id = uuid.v4();
      await me.reviewDBAccessor.save(payload);
      return Success.thanksForTheReview;
    } catch (error) {
      throw error;
    }
  }

}

module.exports = IMDbService;
