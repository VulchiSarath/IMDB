
mongoose = require('mongoose');

class BaseDbAccessor {
  constructor(dependencies, document, schema) {
    this.document = document;
    this.schema = schema;
  }

  async save(payload) {
    try {
      let model = mongoose.model(this.document, this.schema);
      let doc = new model(payload);
      return await doc.save();
    } catch (error) {
      throw error;
    }
  }

  async filter(options) {
    return new Promise((resolve, reject) => {
      try {
        let model = mongoose.model(this.document, this.schema);
        model.find(options, (err, response) => {
          if (err) {
            reject(err)
          }
          let result = response.map(user => user.toObject())
          resolve(result);
        });

      } catch (e) {
        reject(e);
      }
    });

  }

}

module.exports = BaseDbAccessor;
