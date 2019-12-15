const jwt = require('jsonwebtoken');

class JWT {
  constructor(dependencies, config) {
      this.config = config;
      
  }
  async sign(payload) {
    const me = this;
    try {
      return await jwt.sign(payload, me.config.jwt.privateKey);
    } catch (error) {
      throw error;
    }
  }

  async verify(token){
    const me = this;
    try {
      return await jwt.verify(token, me.config.jwt.privateKey);
    } catch (error) {
      throw error;
    }
  }
}
module.exports = JWT;
