-'use strict'

const BaseDBAccessor = require('../../base-lib/base-db-accessor'),
  Schema = require('../schema/database/persisted-imdb-schema'),
  Enum = require('../common/enum').Tables;

class genreDBAccessor extends BaseDBAccessor {
  constructor(dependencies, config) {
    super(dependencies, Enum.Genres, Schema.genreSchema);
    this.config = config;
  }

  async findByIn(values) {
    return new Promise((resolve, reject) => {
      try {
        let model = mongoose.model(this.document, this.schema);
        model.find({ genre: { "$in": values } }, (err, response) => {
          if (err) {
            reject(err)
          }
          let result = response.map(row => row.toObject())
          resolve(result);
        })
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = genreDBAccessor;
