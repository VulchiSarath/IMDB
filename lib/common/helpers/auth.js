const Jwt = require('./jwt-token');

class Auth extends Jwt {
  constructor(dependencies, config) {
    super(dependencies, config);
  }

  async validate(request) {
    const me = this;
    try {
      return me.verify(request);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Auth; 