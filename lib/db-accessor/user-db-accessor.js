'use strict'

const BaseDBAccessor = require('../../base-lib/base-db-accessor'),
    Schema = require('../schema/database/persisted-imdb-schema'),
    Enum = require('../common/enum').Tables;

class UserDBAccessor extends BaseDBAccessor {
  constructor(dependencies, config) {
    super(dependencies, Enum.Users, Schema.userSchema);
    this.config = config;
  }
  
}

module.exports = UserDBAccessor;
