'use strict'
let BaseAppLoader = require('./base-app-loader'),
  repoInfo = { name: 'imdb' },
  mongooseDB = require('./base-lib/mongoose-db'),
  JwtAuth = require('./lib/common/auth');

class AppLoader extends BaseAppLoader {
  constructor() {
    super(repoInfo);
  }

  updateConfigAndDependencies() {
    let me = this;
    me.applicationData.dependencies.db = mongooseDB.createConnection(me.applicationData.config.app_config.mongoose.connectionstring_imdb);
  }

  getSpecificPlugins(instanceConfig, config, dependencies) {
    return [
      {
        plugin: JwtAuth,
        options: { dependencies: dependencies, config: config }
      }
    ];
  }

  registerSpecificStrategies(server, dependencies, config) {
    server.auth.strategy('jwt-auth', 'jwt-auth', {
      dependencies: dependencies,
      config: config
    });
  }

  async fetchConfig() {
    this.applicationData.config = require('./config/config.json');
    return true;
  }

}

module.exports = AppLoader;
