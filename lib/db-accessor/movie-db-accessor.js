'use strict'

const BaseDBAccessor = require('../../base-lib/base-db-accessor'),
    Schema = require('../schema/database/persisted-imdb-schema'),
    Enum = require('../common/enum').Tables;

class MovieDBAccessor extends BaseDBAccessor {
  constructor(dependencies, config) {
    super(dependencies, Enum.Movies, Schema.movieSchema);
    this.config = config;
  }
  
}

module.exports = MovieDBAccessor;
