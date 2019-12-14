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
}

module.exports = IMDbRouteHandler;
