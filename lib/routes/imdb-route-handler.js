'use strict'

const BaseAppLoader = require('../../base-app-loader'),
  IMDbService = require('../service/imdb-service'),
  co = require('co');

class IMDbRouteHandler extends BaseAppLoader {
  constructor(dependencies, config) {
    super(dependencies);
    this.config = config;
  }

  signUp(request, reply) {
    const me = this;
    return co(function* () {
      const imdbService = new IMDbService(me.dependencies, me.config, request);
      const result = yield imdbService.signUp(request.payload);
      return me.replySuccess(reply, result);
    }).catch(function (error) {
      return me.replyError(reply, error);
    });
  }

  signIn(request, reply) {
    const me = this;
    return co(function* () {
      const imdbService = new IMDbService(me.dependencies, me.config, request);
      const result = yield imdbService.signIn(request.payload);
      return me.replySuccess(reply, result);
    }).catch(function (error) {
      return me.replyError(reply, error);
    });
  }

  genre(request, reply){
    const me = this;
    return co(function* () {
      const imdbService = new IMDbService(me.dependencies, me.config, request);
      const result = yield imdbService.genre();
      return me.replySuccess(reply, result);
    }).catch(function (error) {
      return me.replyError(reply, error);
    });
  }

  favouriteGenre(request, reply){
    const me = this;
    return co(function* () {
      const imdbService = new IMDbService(me.dependencies, me.config, request);
      const result = yield imdbService.favouriteGenre(request.payload);
      return me.replySuccess(reply, result);
    }).catch(function (error) {
      return me.replyError(reply, error);
    });
  }

  recommendedMovies(request, reply) {
    const me = this;
    return co(function* () {
      const imdbService = new IMDbService(me.dependencies, me.config, request);
      const result = yield imdbService.recommendedMovies(request.query.user_id);
      return me.replySuccess(reply, result);
    }).catch(function (error) {
      return me.replyError(reply, error);
    });
  }

  getReview(request, reply){
    const me = this;
    return co(function* () {
    const imdbService = new IMDbService(me.dependencies, me.config, request);
      const result = yield imdbService.getReview(request.query.movie_id);
      return me.replySuccess(reply, result);
    }).catch(function (error) {
      return me.replyError(reply, error);
    });
  }

  review(request, reply){
    const me = this;
    return co(function* () {
    const imdbService = new IMDbService(me.dependencies, me.config, request);
      const result = yield imdbService.review(request.payload);
      return me.replySuccess(reply, result);
    }).catch(function (error) {
      return me.replyError(reply, error);
    });
  }
  
}

module.exports = IMDbRouteHandler;
