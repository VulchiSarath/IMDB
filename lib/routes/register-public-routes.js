'use strict';
let _ = require('lodash'),
IMDbRouteHandler = require('./imdb-route-handler'),
Schema = require('../schema/presenter/imdb-presenter-schema');

class RegisterPublicRoutes {
  constructor(dependencies, config) {
    this.config = config;
    this.dependencies = dependencies;
    this.repoConfig = this.config.app_config;
    this.config.appId = this.repoConfig.appId || 'imdb';
    this.imdbRouteHandler = new IMDbRouteHandler(dependencies, this.repoConfig);
    this.publicInstance = this.getPublicInstance(config.server.instances)
  }

  getPublicInstance(instance) {
    let publicInstance = {}
    _.forEach(instance, function (key) {
      if (key.label == "public") {
        publicInstance = key;
      }
    });
    return publicInstance;
  }

  init() { }

  registerRoutes(server) {
    const me = this;
    server.log('Registering public routes for Fulfillment service');

    server.route({
      method: 'POST',
      path: '/v1/imdb/signup',
      config: {
        handler: (request, reply) => me.imdbRouteHandler.signUp(request, reply),
        description: 'IMDb SignUp',
        validate: {
          payload: Schema.SignUpRequestSchema
        },
        response: {
          failAction: 'error'
        },
        state: {
          parse: false,
          failAction: 'log'
        }
      }
    });

  }
}

module.exports = RegisterPublicRoutes;
