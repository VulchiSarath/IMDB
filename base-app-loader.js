'use strict';

let Hapi = require('@hapi/hapi'),
  nconf = require('nconf'),
  path = require('path'),
  assert = require('assert'),
  _ = require('lodash'),
  fs = require('fs'),
  Auth = require('./lib/common/helpers/auth'),
  Errors = require('./lib/common/errors');

class BaseAppLoader {

  constructor(repoInfo, ) {
    let me = this;
    nconf.argv().env();
    me.cwd = process.cwd();
    me.bootConfig = me._initializeBootConfig();
    me.applicationData = {
      dependencies: {},
      serverObjects: {}
    };
    me.repoInfo = repoInfo;
  }

  async bootUpApp() {
    let me = this;
    try {
      me.fetchBaseRoutes();
      await me.fetchConfig();
      me.updateConfigAndDependencies();
      await me.createHapiServerInstances();
      me.registerAuthStrategies();
      me.configureCookies();
      await me.registerPublicRoutes();
      await me.startServers();
    }
    catch (err) {
      throw err;
    }
  }

  _initializeBootConfig() {
    let me = this;
    let bootConfig = {}
    if (nconf.get('bootConfig')) {
      bootConfig = require(path.join(me.cwd, nconf.get('bootConfig')));
    }
    return bootConfig;
  }

  fetchBaseRoutes() {
    let me = this;
    // Override in child class for different prefix.
    me.applicationData.publicRoutePrefix = `/v1/${me.repoInfo.name}`;
  }

  updateConfigAndDependencies() {
    /*
      Need to be implemented in Child Class
      if config and dependencies common for all Hapi servers needs to be updated.
    */
  }

  _getCommonPlugins() {
    let me = this;

    let plugins = [
      {
        plugin: require('hapi-swaggered'),
        options: {
          requiredTags: ['public'],
          info: {
            title: me.repoInfo.name,
            version: me.repoInfo.version
          },
          endpoint: `${me.applicationData.publicRoutePrefix}/swagger`,
          tagging: { mode: 'tags' }
        }
      },
      {
        plugin: require('hapi-swaggered-ui'),
        options: {
          title: me.repoInfo.name,
          path: `${me.applicationData.publicRoutePrefix}/documentation`,
          swaggerOptions: {
            validatorUrl: false
          }
        }
      }
    ];

    return plugins;
  }

  async createHapiServerInstances() {
    let me = this;
    for (const instanceConfig of me.applicationData.config.server.instances) {
      let server = new Hapi.server({
        port: instanceConfig.port,
        routes: {
          validate: {
            failAction: async (request, h, err) => {
              if (err.isJoi) {
                return h.response(err.output.payload)
                  .code(400)
                  .takeover();
              }
              return h.response(err).takeover()
            }
          }
        }
      });
      let plugins = _.concat(
        me._getCommonPlugins()
      )

      await server.register([]);

      me.applicationData.serverObjects[instanceConfig.label] = server;
    }
  }

  async registerPublicRoutes() {
    let me = this;
    let routeFile = `${me.cwd}/lib/routes/register-public-routes`;
    if (fs.existsSync(`${routeFile}.js`)) {
      let RegisterRoutes = require(routeFile);
      let routes = new RegisterRoutes(me.applicationData.dependencies, me.applicationData.config);
      let server = me.applicationData.serverObjects['public']
      await routes.init(server);
      routes.registerRoutes(server);
    }
  }


  async startServers() {
    let me = this;
    let firstServer = _.first(_.values(me.applicationData.serverObjects));
    _.tail(_.values(me.applicationData.serverObjects)).forEach(function (serverObj) {
      firstServer.control(serverObj);
    });
    await firstServer.start();
    _.values(me.applicationData.serverObjects).forEach(function (serverObj) {
      serverObj.log('Server started at: ' + serverObj.info.uri);
    });
  }

  async authValidation(request) {
    try {
      await Auth.validate(request);
    } catch (error) {
      throw error;
    }
  }

  registerSpecificStrategies(server, dependencies, config) {
  }

  registerAuthStrategies() {
    let me = this;
    _.each(_.values(me.applicationData.serverObjects), (serverObject) => {
      me.registerSpecificStrategies(serverObject, me.applicationData.dependencies, me.applicationData.config);
    })
  }

  configureSpecificCookies(server, dependencies, config) { // eslint-disable-line
    /*
      Child class needs to override it.
    */
  }

  configureCookies() {
    let me = this;
    _.each(me.applicationData.serverObjects, (serverObject) => {
      me.configureSpecificCookies(serverObject, me.applicationData.dependencies, me.applicationData.config);
    });
  }

  /**
  * This method replies success back to the hapi reply.  If the message object has a statusCode, then use that.
  * @memberof BaseHelper
  * @param {string} h Hapi response toolkit
  * @param {object} message The message in the response.
  */
  replySuccess(h, message) {
    let statusCode = 200;
    if (message && message.statusCode) {
      statusCode = message.statusCode
    }
    return h.response(message).code(statusCode);
  }

  /**
  * This method replies an error back to the hapi reply.  If the error object has a statusCode, then use that.  Otherwise, a 500 will be used.
  * @memberof BaseHelper
  * @param {string} h Hapi response tool kit
  * @param {object} error The error in the response.
  * @param {options} error Options.  options.returnRawJSON is the flag to return raw JSON.
  */
  replyError(h, error, options) {
    const returnRawJSON = options && options.returnRawJSON ? options.returnRawJSON : false;
    if (!error.statusCode && !error.status) {
      error = Errors.UnexpectedErrorOccurred;
    }
    return h.response(returnRawJSON ? error : JSON.stringify(error)).code(error.statusCode || error.status || 500);
  }

}

module.exports = BaseAppLoader;
