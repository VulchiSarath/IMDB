
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

  async filter(options = {}) {
    return new Promise((resolve, reject) => {
      try {
        let model = mongoose.model(this.document, this.schema);
        model.find(options, (err, response) => {
          if (err) {
            reject(err)
          }
          let result = response.map(row => row.toObject())
          resolve(result);
        });

      } catch (e) {
        reject(e);
      }
    });
  }

  async findOneAndUpdate(query, update) {
    return new Promise((resolve, reject) => {
      try {
        let model = mongoose.model(this.document, this.schema);
        model.findOneAndUpdate(query, { $set: update }, (err, response) => {
          if (err) {
            reject(err)
          }
          resolve(response);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async findSortAndLimit(query) {
    return new Promise((resolve, reject) => {
      try {
        let model = mongoose.model(this.document, this.schema);
        let sort = { up_votes: -1 };

        model.find(query).sort(sort).limit(10).exec(function (err, response) {
          if (err) {
            reject(err)
          }
          let result = response.map(row => row.toObject())
          resolve(result);
        });

      } catch (error) {
        reject(error);
      }
    });
  }


  async deleteData(options) {
    return new Promise((resolve, reject) => {
        try {
            let model = mongoose.model(this.document, this.schema);
            model.findOneAndRemove(options, (err, response) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(response);
                }
            })
        } catch (e) {
            reject(e);
        }
    });
}


}

module.exports = BaseDbAccessor;
