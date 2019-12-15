'use strict'

const BaseDBAccessor = require('../../base-lib/base-db-accessor'),
    Schema = require('../schema/database/persisted-imdb-schema'),
    Enum = require('../common/enum').Tables;

class ReviewDBAccessor extends BaseDBAccessor {
  constructor(dependencies, config) {
    super(dependencies, Enum.reviews, Schema.reviewSchema);
    this.config = config;
  }
  
}

module.exports = ReviewDBAccessor;
