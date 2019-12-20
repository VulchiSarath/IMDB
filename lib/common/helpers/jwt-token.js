const jwt = require('jsonwebtoken');

class JWT {
  constructor(dependencies, config) {
    this.config = config;

  }
  async sign(payload) {
    const me = this;
    try {
      return await jwt.sign(payload, me.config.jwt.secret, { algorithm: 'HS256', expiresIn: "1h" });
    } catch (error) {
      throw error;
    }
  }

  async verify(token) {
    const me = this;
    try {
      var parts = token.split(' ');
      if (parts.length === 2) {
        var scheme = parts[0];
        var credentials = parts[1];

        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
          let response = await jwt.verify(token, me.config.jwt.secret, { algorithm: 'HS256' });
          return response;
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
module.exports = JWT;
