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
    server.log('Registering public routes for imdb service');

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

    server.route({
      method: 'POST',
      path: '/v1/imdb/signin',
      config: {
        handler: (request, reply) => me.imdbRouteHandler.signIn(request, reply),
        description: 'IMDb SignIp',
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

    server.route({
      method: 'GET',
      path: '/v1/imdb/genre',
      config: {
        handler: (request, reply) => me.imdbRouteHandler.genre(request, reply),
        description: 'get genre lists',
        validate: {

        },
        response: {
          failAction: 'error',
          schema: Schema.GenreResponseSchema,
        },
        state: {
          parse: false,
          failAction: 'log'
        }
      }
    });

    server.route({
      method: 'POST',
      path: '/v1/imdb/favourite-genre',
      config: {
        handler: (request, reply) => me.imdbRouteHandler.favouriteGenre(request, reply),
        description: 'set favourite genre',
        validate: {
          payload: Schema.FavouriteGenreRequestSchema
        },
        response: {
          failAction: 'error',
          schema: Schema.FavouriteGenreResponseSchema,
        },
        state: {
          parse: false,
          failAction: 'log'
        }
      }
    });

    server.route({
      method: 'GET',
      path: '/v1/imdb/recommended-movies',
      config: {
        handler: (request, reply) => me.imdbRouteHandler.recommendedMovies(request, reply),
        description: 'get recommended movies',
        validate: {
          query: { user_id: Schema.RequiredString }
        },
        response: {
          failAction: 'error',
          schema: Schema.RecommendedMoviesResponseSchema,
        },
        state: {
          parse: false,
          failAction: 'log'
        }
      }
    });

    server.route({
      method: 'GET',
      path: '/v1/imdb/review',
      config: {
        handler: (request, reply) => me.imdbRouteHandler.getReview(request, reply),
        description: 'get reviews',
        validate: {
          query: { movie_id: Schema.RequiredString }
        },
        response: {
          failAction: 'error',
          schema: Schema.ReviewResponseSchema,
        },
        state: {
          parse: false,
          failAction: 'log'
        }
      }
    });

    server.route({
      method: 'POST',
      path: '/v1/imdb/review',
      config: {
        handler: (request, reply) => me.imdbRouteHandler.review(request, reply),
        description: 'set reviews',
        validate: {
          payload: Schema.ReviewRequestSchema
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
