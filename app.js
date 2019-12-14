'use strict'
let BaseAppLoader = require('./base-app-loader'),
  repoInfo = { name: 'imdb' },
  mongooseDB = require('./base-lib/mongoose-db');

class AppLoader extends BaseAppLoader {
  constructor() {
    super(repoInfo);
  }

  updateConfigAndDependencies() {
    let me = this;
    me.applicationData.dependencies.db = mongooseDB.createConnection(me.applicationData.config.app_config.mongoose.connectionstring_imdb);
  }

  async fetchConfig() {
    this.applicationData.config = require('./config/config.json');
    return true;
  }

}

module.exports = AppLoader;
