"use strict";
const Hoek = require('hoek'),
  Joi = require('joi'),
  Errors = require('./errors'),
  Jwt = require('../common/helpers/jwt-token'),
  internals = {};

exports.plugin = {
  register: function (server, options) {
    server.auth.scheme('jwt-auth', internals.implementation);
  },
  pkg: require('./../../package.json'),
  name: 'jwt-auth'
}

internals.schema = Joi.object({ dependencies: Joi.any().required(), config: Joi.any().required() });

internals.implementation = function (server, options) {
  try {
    const results = Joi.validate(options, internals.schema);
    Hoek.assert(!results.error, results.error);

    const scheme = {
      authenticate: async function (request, h) {
        try {
          const jwt = new Jwt(options.dependencies, options.config.app_config);
          let token = request.headers["authorization"];
          if (!token) {
            return h.response(Errors.AuthMissing).code(401).takeover();
          }
          let decode = await jwt.verify(token);
          return h.authenticated({ credentials: decode, isValid: false });
        }
        catch (err) {
          return h.response(Errors.InvalidToken).code(401).takeover();
        }
      }
    };

    return scheme;
  }
  catch (ex) {
    throw ex;
  }
};
